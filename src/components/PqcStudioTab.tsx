import React, { useState, useEffect } from 'react';
import { 
  PqcAlgorithm, 
  PqcKeypair, 
  PqcBenchmarkResult 
} from '../types';
import { 
  ShieldCheck, 
  Key, 
  Lock, 
  Unlock, 
  FileCheck, 
  BarChart3, 
  Zap, 
  RefreshCw, 
  AlertOctagon, 
  CheckCircle2, 
  Cpu, 
  Copy, 
  Check
} from 'lucide-react';
import { 
  generatePqcKeypair, 
  encapsAndEncryptPayload, 
  decapsAndDecryptPayload, 
  signWithDilithium, 
  verifyDilithiumSignature,
  runPqcBenchmarks 
} from '../utils/pqcCrypto';

export const PqcStudioTab: React.FC = () => {
  const [selectedAlgo, setSelectedAlgo] = useState<PqcAlgorithm>('ML-KEM-768');
  const [activeKeypair, setActiveKeypair] = useState<PqcKeypair>(() => generatePqcKeypair('ML-KEM-768'));
  
  // Encrypt / Decrypt Inspector State
  const [inputPayload, setInputPayload] = useState('Confidential Web 4.0 Edge Neural Network Weights & Telemetry Protocol Data');
  const [encryptionResult, setEncryptionResult] = useState<{
    ciphertext: string;
    sharedSecretHash: string;
    kemCiphertext: string;
    logs: string[];
  } | null>(null);

  const [decryptionResult, setDecryptionResult] = useState<{
    decryptedText: string;
    sharedSecretHash: string;
    logs: string[];
  } | null>(null);

  // Digital Signature Studio State
  const [signaturePayload, setSignaturePayload] = useState('OFFICIAL_EDGE_GOVERNANCE_CLEARANCE_DISPATCH_8890');
  const [dilithiumSignature, setDilithiumSignature] = useState<{
    signature: string;
    verificationHash: string;
  } | null>(null);
  const [verificationStatus, setVerificationStatus] = useState<{ valid: boolean; details: string } | null>(null);

  // Benchmark Data
  const [benchmarks, setBenchmarks] = useState<PqcBenchmarkResult[]>([]);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    setBenchmarks(runPqcBenchmarks());
  }, []);

  // Regenerate Keypair on algorithm change or button click
  const handleGenerateKeypair = (algo: PqcAlgorithm = selectedAlgo) => {
    const keys = generatePqcKeypair(algo);
    setActiveKeypair(keys);
    setEncryptionResult(null);
    setDecryptionResult(null);
  };

  // Run Encryption
  const handleRunEncryption = () => {
    if (!inputPayload) return;
    const res = encapsAndEncryptPayload(inputPayload, activeKeypair.publicKey, selectedAlgo);
    setEncryptionResult(res);
    setDecryptionResult(null);
  };

  // Run Decryption
  const handleRunDecryption = () => {
    if (!encryptionResult) return;
    const res = decapsAndDecryptPayload(
      encryptionResult.ciphertext,
      activeKeypair.privateKey,
      encryptionResult.kemCiphertext
    );
    setDecryptionResult(res);
  };

  // Run Dilithium Signature
  const handleSignMessage = () => {
    if (!signaturePayload) return;
    const sigRes = signWithDilithium(signaturePayload, activeKeypair.privateKey, 'ML-DSA-65');
    setDilithiumSignature(sigRes);

    const verifyRes = verifyDilithiumSignature(signaturePayload, sigRes.signature, activeKeypair.publicKey);
    setVerificationStatus(verifyRes);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-md relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center space-x-2 text-emerald-400 text-xs font-mono font-semibold uppercase tracking-wider mb-1">
              <ShieldCheck className="w-4 h-4" />
              <span>NIST FIPS-203 / FIPS-204 Post-Quantum Cryptography</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-100">Lattice-Based PQC Cryptographic Engine</h2>
            <p className="text-sm text-slate-400 max-w-2xl mt-1">
              Test and inspect real-time Module-LWE / Ring-LWE lattice key encapsulation (ML-KEM) and lattice digital signatures (ML-DSA) built for quantum threat resistance.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={selectedAlgo}
              onChange={e => {
                const algo = e.target.value as PqcAlgorithm;
                setSelectedAlgo(algo);
                handleGenerateKeypair(algo);
              }}
              className="bg-slate-950 border border-cyan-800/80 text-cyan-300 font-mono text-xs font-bold px-3.5 py-2 rounded-xl focus:outline-none"
            >
              <option value="ML-KEM-768">ML-KEM-768 (Kyber-768)</option>
              <option value="ML-KEM-1024">ML-KEM-1024 (Kyber-1024)</option>
              <option value="ML-DSA-65">ML-DSA-65 (Dilithium-3)</option>
              <option value="ML-DSA-87">ML-DSA-87 (Dilithium-5)</option>
            </select>

            <button
              onClick={() => handleGenerateKeypair()}
              className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-semibold border border-cyan-800/50 transition-colors cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Generate Keypair</span>
            </button>
          </div>
        </div>

        {/* Active Keypair Details Card */}
        <div className="mt-6 bg-slate-950/80 border border-slate-800 rounded-xl p-4 font-mono text-xs space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-2">
            <div className="flex items-center space-x-2">
              <Key className="w-4 h-4 text-cyan-400" />
              <span className="font-bold text-slate-200">Active PQC Keypair:</span>
              <span className="text-emerald-400 font-bold">{activeKeypair.algorithm}</span>
            </div>
            <div className="flex items-center space-x-3 text-slate-400 text-[11px]">
              <span>Security: <strong className="text-emerald-300">{activeKeypair.bitSecurity}-bit Quantum</strong></span>
              <span>•</span>
              <span>Dimensions: <strong className="text-teal-300">{activeKeypair.matrixDimensions}</strong></span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px]">
            <div>
              <div className="text-slate-400 mb-1 flex items-center justify-between">
                <span>Public Key Vector (Multibase):</span>
                <button 
                  onClick={() => copyToClipboard(activeKeypair.publicKey)}
                  className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                >
                  {isCopied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>Copy</span>
                </button>
              </div>
              <div className="bg-slate-900 p-2 rounded text-slate-300 truncate border border-slate-800">
                {activeKeypair.publicKey}
              </div>
            </div>

            <div>
              <div className="text-slate-400 mb-1">Key Fingerprint:</div>
              <div className="bg-slate-900 p-2 rounded text-cyan-300 truncate border border-slate-800">
                {activeKeypair.fingerprint}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Encrypt/Decrypt Inspector + Dilithium Signature Studio */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ML-KEM Encapsulation & Encryption Studio */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
            <Lock className="w-5 h-5 text-cyan-400" />
            <h3 className="font-bold text-slate-100 text-base">ML-KEM Key Encapsulation & Payload Studio</h3>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Plaintext Message Payload</label>
              <textarea
                rows={3}
                value={inputPayload}
                onChange={e => setInputPayload(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-100 font-mono focus:border-cyan-500 focus:outline-none"
              />
            </div>

            <button
              onClick={handleRunEncryption}
              className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center justify-center space-x-2 shadow-lg shadow-cyan-500/20 cursor-pointer"
            >
              <Zap className="w-4 h-4" />
              <span>Encapsulate Shared Secret & Encrypt Payload</span>
            </button>

            {/* Encryption Result Output */}
            {encryptionResult && (
              <div className="bg-slate-950 border border-cyan-900/60 rounded-xl p-3.5 space-y-3 font-mono">
                <div className="flex items-center justify-between text-cyan-300 text-xs font-bold">
                  <span>Derived PQC Shared Secret Hash:</span>
                  <span className="text-emerald-400">{encryptionResult.sharedSecretHash}</span>
                </div>

                <div>
                  <div className="text-slate-400 text-[10px] mb-1">PQC Encrypted Payload:</div>
                  <div className="bg-slate-900 p-2 rounded text-emerald-300 break-all text-[11px] border border-slate-800">
                    {encryptionResult.ciphertext}
                  </div>
                </div>

                {/* Logs */}
                <div className="bg-slate-900/80 p-2.5 rounded border border-slate-800 space-y-1 text-[10px]">
                  {encryptionResult.logs.map((log, idx) => (
                    <div key={idx} className="text-slate-400">
                      <span className="text-cyan-400">›</span> {log}
                    </div>
                  ))}
                </div>

                {/* Decrypt Trigger */}
                <button
                  onClick={handleRunDecryption}
                  className="w-full py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <Unlock className="w-3.5 h-3.5" />
                  <span>Decapsulate & Verify Payload with Private Key</span>
                </button>

                {decryptionResult && (
                  <div className="bg-emerald-950/80 border border-emerald-800/80 p-3 rounded-lg text-xs space-y-1">
                    <div className="flex items-center text-emerald-300 font-bold gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>Decryption Verified via Ring-LWE Lattice</span>
                    </div>
                    <div className="text-slate-200 font-sans font-medium mt-1 bg-slate-900/90 p-2 rounded border border-slate-800">
                      {decryptionResult.decryptedText}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Dilithium ML-DSA Signature Studio */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
            <FileCheck className="w-5 h-5 text-indigo-400" />
            <h3 className="font-bold text-slate-100 text-base">ML-DSA Lattice Digital Signature Studio</h3>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Payload to Sign with Dilithium</label>
              <textarea
                rows={3}
                value={signaturePayload}
                onChange={e => setSignaturePayload(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-100 font-mono focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <button
              onClick={handleSignMessage}
              className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-slate-100 font-bold text-xs flex items-center justify-center space-x-2 shadow-lg shadow-indigo-600/20 cursor-pointer"
            >
              <FileCheck className="w-4 h-4" />
              <span>Generate Dilithium ML-DSA Signature</span>
            </button>

            {dilithiumSignature && (
              <div className="bg-slate-950 border border-indigo-900/60 rounded-xl p-3.5 space-y-3 font-mono">
                <div>
                  <div className="text-slate-400 text-[10px] mb-1">Signature Verification Hash:</div>
                  <div className="bg-slate-900 p-2 rounded text-indigo-300 break-all text-[11px] border border-slate-800">
                    {dilithiumSignature.verificationHash}
                  </div>
                </div>

                {verificationStatus && (
                  <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-emerald-400 font-bold">Dilithium Signature Verified</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{verificationStatus.details}</div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Benchmark & Quantum Threat Comparison Panel */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
        <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
          <BarChart3 className="w-5 h-5 text-amber-400" />
          <h3 className="font-bold text-slate-100 text-base">
            PQC vs Classic RSA/ECC Quantum Security Benchmarks
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 font-mono text-xs">
          {benchmarks.map((bm, i) => {
            const isLegacy = bm.quantumSecurityBits === 0;
            return (
              <div
                key={i}
                className={`p-4 rounded-xl border space-y-2 ${
                  isLegacy
                    ? 'bg-rose-950/30 border-rose-900/60'
                    : 'bg-slate-950 border-slate-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-200">{bm.algorithm}</span>
                  {isLegacy ? (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-950 text-rose-400 border border-rose-800">
                      VULNERABLE
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                      QUANTUM SAFE
                    </span>
                  )}
                </div>

                <div className="space-y-1 text-[11px] text-slate-400">
                  <div className="flex justify-between">
                    <span>Key Gen Speed:</span>
                    <span className="text-slate-200 font-bold">{bm.keyGenTimeMs} ms</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Public Key Size:</span>
                    <span className="text-slate-200 font-bold">{bm.publicKeySizeBytes} B</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Cipher / Sig Size:</span>
                    <span className="text-slate-200 font-bold">{bm.cipherOrSigSizeBytes} B</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Quantum Bit Security:</span>
                    <span className={`font-bold ${isLegacy ? 'text-rose-400' : 'text-emerald-400'}`}>
                      {bm.quantumSecurityBits} bits
                    </span>
                  </div>
                </div>

                {isLegacy && (
                  <div className="text-[10px] text-rose-300 flex items-center gap-1 mt-2 pt-2 border-t border-rose-900/40">
                    <AlertOctagon className="w-3.5 h-3.5 shrink-0" />
                    <span>Compromised by Shor's Algorithm (~4,096 logical qubits)</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
