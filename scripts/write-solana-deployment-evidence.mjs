import fs from "node:fs/promises";

const rpcUrl = process.env.SOLANA_RPC_URL || "https://api.testnet.solana.com";
const programId = process.env.QAIN_SOLANA_PROGRAM_ID;
const sourceCommit = process.env.SOURCE_COMMIT || "";
const deploySignature = process.env.DEPLOY_SIGNATURE || "";

if (!programId) {
  console.error("QAIN_SOLANA_PROGRAM_ID is required");
  process.exit(2);
}

async function rpc(method, params = []) {
  const response = await fetch(rpcUrl, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ jsonrpc: "2.0", id: 1, method, params }),
  });
  if (!response.ok) throw new Error(`RPC HTTP ${response.status}`);
  const payload = await response.json();
  if (payload.error) throw new Error(JSON.stringify(payload.error));
  return payload.result;
}

const [accountInfo, signatures] = await Promise.all([
  rpc("getAccountInfo", [programId, { encoding: "base64", commitment: "confirmed" }]),
  rpc("getSignaturesForAddress", [programId, { limit: 10 }, "confirmed"]),
]);

if (!accountInfo?.value?.executable) {
  throw new Error(`Program ${programId} is not an executable Solana account on testnet`);
}

const latestSuccessful = Array.isArray(signatures)
  ? signatures.find((entry) => !entry.err)
  : null;

const signature = deploySignature || latestSuccessful?.signature || "";
const verifiedAt = new Date().toISOString();
const evidence = {
  project: "QAIN",
  cluster: "testnet",
  rpcUrl,
  programId,
  deploymentSignature: signature,
  explorerProgramUrl: `https://explorer.solana.com/address/${programId}?cluster=testnet`,
  explorerTransactionUrl: signature
    ? `https://explorer.solana.com/tx/${signature}?cluster=testnet`
    : "",
  executable: true,
  owner: accountInfo.value.owner,
  lamports: accountInfo.value.lamports,
  verifiedAt,
  sourceCommit,
};

await fs.mkdir("deployments", { recursive: true });
await fs.writeFile(
  "deployments/solana-testnet.json",
  JSON.stringify(evidence, null, 2) + "\n",
  "utf8",
);

console.log(JSON.stringify(evidence, null, 2));
