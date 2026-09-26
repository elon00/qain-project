import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import { generatePqcKeypair, generatePqcKeyPair, createPqcHybridSignature, computeDemoDigestHex, encapsAndEncryptPayload, decapsAndDecryptPayload, runPqcBenchmarks } from "./src/utils/pqcCrypto";
import { createQainDid, generateZkIdentityProof } from "./src/utils/didAuth";
import { handleX402ExactJson, SOLANA_TESTNET_CAIP2 } from "./src/utils/x402";
import { createMcpRuntime, createSolanaActionMetadata, createBlinkUrl } from "./src/integrations/nextgen";

const PORT = 3000;

async function startServer() {
  const app = express();
  app.use(express.json());

  // Gemini API client lazy initializer
  function getGeminiClient() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return null;
    return new GoogleGenAI({ apiKey });
  }

  // --- API ROUTES ---

  app.get("/api/health", (_req, res) => {
    res.json({
      status: "ok",
      platform: "QAIN Web 4.0 Edge Computing Platform",
      pqcEngine: "ML-KEM-768 / ML-DSA-65 Active",
      conwayAutomaton: "Online",
      timestamp: new Date().toISOString()
    });
  });

  const qainMcp = createMcpRuntime({
    name: "qain-project",
    version: "0.0.0",
    tools: [
      {
        name: "health",
        description: "Return QAIN runtime capability status without claiming external certification.",
        execute: async () => ({
          platform: "QAIN Web 4.0 Edge Computing Platform",
          pqc: "research integration",
          x402: "configured only when facilitator/payee environment is present",
          network: process.env.X402_NETWORK || SOLANA_TESTNET_CAIP2,
        }),
      },
      {
        name: "pqc_benchmark",
        description: "Run the repository PQC benchmark function and return local engineering measurements.",
        execute: async () => runPqcBenchmarks(),
      },
    ],
  });

  app.post("/api/mcp", async (req, res) => {
    const response = await qainMcp.handle(req.body);
    return res.status(response.error ? 400 : 200).json(response);
  });

  app.get("/api/actions/pqc-insight", (_req, res) => {
    return res.json(createSolanaActionMetadata({
      title: "QAIN PQC Insight",
      icon: "https://github.com/elon00.png",
      description: "QAIN Action discovery endpoint. Paid execution remains fail-closed until a wallet transaction builder and x402 settlement path are both verified.",
      label: "Open QAIN",
      disabled: true,
      error: "Wallet-signable Action transaction builder is not yet verified in this runtime.",
    }));
  });

  app.post("/api/actions/pqc-insight", (_req, res) => {
    return res.status(501).json({
      error: {
        message: "No transaction is fabricated. Enable a tested wallet-signable Solana transaction builder before activating this Action.",
      },
    });
  });

  app.get("/api/blinks/pqc-insight", (req, res) => {
    const base = process.env.PUBLIC_BASE_URL || `${req.protocol}://${req.get("host")}`;
    return res.json({
      action: `${base}/api/actions/pqc-insight`,
      blink: createBlinkUrl(`${base}/api/actions/pqc-insight`),
      status: "DISCOVERY_ONLY",
    });
  });

  // x402 v2 paid QAIN service on Solana testnet.
  // The route fails closed when the facilitator or payment recipient is not configured.
  app.post("/api/x402/pqc-insight", async (req, res) => {
    await handleX402ExactJson(req, res, async () => {
      const { payload, serviceId } = req.body || {};
      const canonicalPayload = typeof payload === "string"
        ? payload
        : JSON.stringify(payload ?? { message: "QAIN x402 paid PQC insight" });

      const keyPair = generatePqcKeyPair("ML-DSA-65");
      const requestDigest = computeDemoDigestHex(canonicalPayload);
      const proof = createPqcHybridSignature(
        requestDigest,
        keyPair,
        Number(process.env.X402_PRICE_ATOMIC || "1000") / 1_000_000,
        serviceId || "qain-x402-pqc-insight",
      );

      return {
        success: true,
        protocol: "x402-v2",
        network: process.env.X402_NETWORK || SOLANA_TESTNET_CAIP2,
        service: serviceId || "qain-x402-pqc-insight",
        requestDigest,
        pqc: {
          algorithm: keyPair.algorithm,
          publicKey: keyPair.publicKey,
          fingerprint: keyPair.publicKeyFingerprint,
          hybridSignature: proof.hybridSignature,
          mlDsaComponent: proof.mlDsaComponent,
          quantumResistanceScore: proof.quantumResistanceScore,
        },
        benchmarks: runPqcBenchmarks(),
        timestamp: new Date().toISOString(),
      };
    });
  });

  // PQC Key Generation Endpoint
  app.post("/api/pqc/generate-key", (req, res) => {
    const { algorithm } = req.body || {};
    const algo = algorithm || 'ML-KEM-768';
    const keypair = generatePqcKeypair(algo);
    res.json({ success: true, keypair });
  });

  // PQC Encrypt Payload
  app.post("/api/pqc/encrypt", (req, res) => {
    const { payload, publicKey, algorithm } = req.body || {};
    if (!payload) {
      return res.status(400).json({ error: "Missing payload parameter" });
    }
    const pubKey = publicKey || generatePqcKeypair(algorithm || 'ML-KEM-768').publicKey;
    const result = encapsAndEncryptPayload(payload, pubKey, algorithm || 'ML-KEM-768');
    res.json({ success: true, ...result });
  });

  // PQC Decrypt Payload
  app.post("/api/pqc/decrypt", (req, res) => {
    const { encryptedPayload, privateKey, kemCiphertext } = req.body || {};
    if (!encryptedPayload) {
      return res.status(400).json({ error: "Missing encryptedPayload" });
    }
    const result = decapsAndDecryptPayload(
      encryptedPayload,
      privateKey || '',
      kemCiphertext || ''
    );
    res.json({ success: true, ...result });
  });

  // PQC Benchmarks
  app.get("/api/pqc/benchmarks", (_req, res) => {
    const benchmarks = runPqcBenchmarks();
    res.json({ success: true, benchmarks });
  });

  // DID Creation & Resolution
  app.post("/api/did/create", (req, res) => {
    const { alias } = req.body || {};
    const didDoc = createQainDid(alias);
    res.json({ success: true, didDocument: didDoc });
  });

  // Zero Knowledge Identity Clearance Proof
  app.post("/api/did/zk-proof", (req, res) => {
    const { did, score, threshold } = req.body || {};
    const zkProof = generateZkIdentityProof(
      did || 'did:qain:node-genesis',
      score ?? 92,
      threshold ?? 75
    );
    res.json({ success: true, zkProof });
  });

  // AI Edge Orchestration Endpoint (Gemini API)
  app.post("/api/ai/edge-orchestrate", async (req, res) => {
    const { edgeNodes, activeTasksCount, conwaySummary, query } = req.body || {};

    const ai = getGeminiClient();
    if (!ai) {
      return res.json({
        success: true,
        fallback: true,
        analysis: "Gemini API key is pending configuration. Operating under server-side autonomous fallback strategy ruleset.",
        recommendedActions: [
          {
            nodeId: "node-us-east-1",
            action: "PQC Key Rotation to ML-KEM-1024",
            reasoning: "Automaton cluster density threshold reached.",
            priority: "High"
          },
          {
            nodeId: "node-eu-west-1",
            action: "Dynamic Task Migration (+450 TFLOPS)",
            reasoning: "Overpopulation rule triggered in Conway grid (12,8).",
            priority: "Critical"
          }
        ],
        quantumThreatAssessment: "No live quantum-threat measurement is available from this fallback path.",
        pqcRecommendation: "Use standardized ML-KEM/ML-DSA configurations only after threat-model and interoperability review; this fallback does not certify a security level."
      });
    }

    try {
      const prompt = `
You are the QAIN Web 4.0 Edge Orchestration AI.
Current Edge Node State: ${JSON.stringify(edgeNodes || []).substring(0, 1000)}
Active Edge Tasks Count: ${activeTasksCount || 12}
Conway Automaton Pattern Summary: ${conwaySummary || "Glider pattern expanding toward sector (14,9)"}
User Custom Query/Instruction: ${query || "Optimize global node load and PQC security levels."}

Return a concise JSON response with the following keys:
1. "analysis": A 2-3 sentence overview of the edge computing health and quantum threat state.
2. "recommendedActions": An array of objects with keys {"nodeId", "action", "reasoning", "priority"}.
3. "quantumThreatAssessment": A brief 1-2 sentence risk statement on Post-Quantum Cryptography readiness.
4. "pqcRecommendation": Recommended PQC algorithm (ML-KEM-768 vs ML-KEM-1024 vs ML-DSA-87) and key length.
Ensure valid JSON output without markdown backticks if possible, or plain clean text.
`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
      });

      const text = response.text || "";
      let parsed = null;
      try {
        const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
        parsed = JSON.parse(cleaned);
      } catch {
        parsed = {
          analysis: text,
          recommendedActions: [
            {
              nodeId: "node-us-east-1",
              action: "Scale Edge Allocation",
              reasoning: "Automaton decision trigger",
              priority: "High"
            }
          ],
          quantumThreatAssessment: "The model response could not be parsed into evidence-backed structured data.",
          pqcRecommendation: "No algorithm upgrade is automatically recommended without a defined threat model and validated implementation evidence."
        };
      }

      res.json({ success: true, ...parsed });
    } catch (err) {
      console.error("Gemini API Error:", err);
      res.json({
        success: false,
        error: "AI Generation Error",
        analysis: "Fallback edge heuristic active.",
        recommendedActions: [
          {
            nodeId: "node-global",
            action: "Maintain PQC Key Sheathing",
            reasoning: "Automatic lattice protection active.",
            priority: "Medium"
          }
        ],
        quantumThreatAssessment: "Standard ML-KEM-768 active across mesh.",
        pqcRecommendation: "ML-KEM-768 + ML-DSA-65."
      });
    }
  });

  // AI PQC Threat Analysis Endpoint
  app.post("/api/ai/threat-analysis", async (req, res) => {
    const { payload, algorithm } = req.body || {};
    const ai = getGeminiClient();

    if (!ai) {
      return res.json({
        success: true,
        threatScore: null,
        qubitRequirementToBreak: null,
        timeToQuantumBreakthroughYears: null,
        analysis: "No defensible live quantum-break timeline or qubit requirement is produced without an explicit cryptanalytic model and evidence.",
        recommendation: "Treat the implemented PQC algorithms as research integrations and follow current standards plus independent cryptographic review."
      });
    }

    try {
      const prompt = `
Analyze the post-quantum cryptography security of the following setup:
Payload length: ${payload?.length || 50} chars
Target Algorithm: ${algorithm || 'ML-KEM-768'}

Provide a structured JSON response with:
- "threatScore": number (0-100, where lower is safer)
- "qubitRequirementToBreak": number (logical qubits required to compromise)
- "timeToQuantumBreakthroughYears": string
- "analysis": string explaining lattice problem hardness (Ring-LWE / Module-LWE)
- "recommendation": string
`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
      });

      const text = response.text || "";
      let parsed = null;
      try {
        const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
        parsed = JSON.parse(cleaned);
      } catch {
        parsed = {
          threatScore: null,
          qubitRequirementToBreak: null,
          timeToQuantumBreakthroughYears: null,
          analysis: text,
          recommendation: "Use ML-KEM-1024 for long-term secure archival."
        };
      }

      res.json({ success: true, ...parsed });
    } catch (err) {
      res.json({
        success: true,
        threatScore: null,
        qubitRequirementToBreak: null,
        timeToQuantumBreakthroughYears: null,
        analysis: "The AI provider failed, so no quantitative quantum-security claim is available.",
        recommendation: "Keep the endpoint fail-honest: use tested standardized implementations and independent review rather than invented forecasts."
      });
    }
  });

  // --- VITE / STATIC SERVING ---
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`QAIN Web 4.0 Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
