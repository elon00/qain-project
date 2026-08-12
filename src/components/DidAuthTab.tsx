import React, { useState } from 'react';
import { 
  DidDocument, 
  VerifiableCredential 
} from '../types';
import { 
  Fingerprint, 
  KeyRound, 
  ShieldCheck, 
  FileCheck, 
  Sparkles, 
  UserCheck, 
  Plus, 
  Lock, 
  CheckCircle2, 
  ShieldAlert, 
  Copy, 
  Check 
} from 'lucide-react';
import { 
  createQainDid, 
  generateZkIdentityProof, 
  issueVerifiableCredential, 
  registerWebAuthnPasskey, 
  ZkProofResult 
} from '../utils/didAuth';

interface DidAuthTabProps {
  userDid: DidDocument;
  setUserDid: React.Dispatch<React.SetStateAction<DidDocument>>;
}

export const DidAuthTab: React.FC<DidAuthTabProps> = ({
  userDid,
  setUserDid
}) => {
  const [isAuthenticatedWithPasskey, setIsAuthenticatedWithPasskey] = useState(false);
  const [passkeyData, setPasskeyData] = useState<{ credentialId: string; publicKeyBase64: string } | null>(null);
  
  // ZK Proof Generator State
  const [zkSecretScore, setZkSecretScore] = useState(92);
  const [zkThreshold, setZkThreshold] = useState(80);
  const [zkProofResult, setZkProofResult] = useState<ZkProofResult | null>(null);

  // New VC Issue State
  const [isVcModalOpen, setIsVcModalOpen] = useState(false);
  const [newVcType, setNewVcType] = useState('PqcEdgeNodeOperatorCredential');
  const [newVcRole, setNewVcRole] = useState('Quantum Mesh Administrator');
  const [isCopied, setIsCopied] = useState(false);

  // Generate New DID Document
  const handleCreateNewDid = () => {
    const newDoc = createQainDid(`user-${Math.random().toString(36).substring(2, 6)}`);
    setUserDid(newDoc);
    setIsAuthenticatedWithPasskey(false);
    setPasskeyData(null);
  };

  // WebAuthn Passkey Registration & Login
  const handleRegisterPasskey = async () => {
    const res = await registerWebAuthnPasskey('qain-operator');
    setPasskeyData(res);
    setIsAuthenticatedWithPasskey(true);

    setUserDid(prev => ({
      ...prev,
      webAuthnCredentialId: res.credentialId,
      trustScore: 100
    }));
  };

  // Generate ZK Clearance Proof
  const handleGenerateZkProof = () => {
    const proof = generateZkIdentityProof(userDid.id, zkSecretScore, zkThreshold);
    setZkProofResult(proof);
  };

  // Issue Verifiable Credential
  const handleIssueVc = (e: React.FormEvent) => {
    e.preventDefault();
    const newVc = issueVerifiableCredential(
      'did:qain:governance-central',
      userDid.id,
      newVcType,
      {
        role: newVcRole,
        issuanceTimestamp: new Date().toISOString(),
        pqcProtection: 'ML-DSA-65',
        authorizedNodesLimit: 50
      }
    );

    setUserDid(prev => ({
      ...prev,
      verifiableCredentials: [newVc, ...prev.verifiableCredentials]
    }));
    setIsVcModalOpen(false);
  };

  const copyDid = () => {
    navigator.clipboard.writeText(userDid.id);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-md relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center space-x-2 text-indigo-400 text-xs font-mono font-semibold uppercase tracking-wider mb-1">
              <Fingerprint className="w-4 h-4" />
              <span>Decentralized User Authentication Layer (W3C DID + WebAuthn)</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-100">Self-Sovereign Identity & Passkey Security</h2>
            <p className="text-sm text-slate-400 max-w-2xl mt-1">
              Decentralized Identifier (DID) management with zero-knowledge clearance proofs and hardware-backed biometric WebAuthn passkey authentication.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleCreateNewDid}
              className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-indigo-300 text-xs font-bold border border-indigo-800/50 transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Generate New DID</span>
            </button>

            {!isAuthenticatedWithPasskey ? (
              <button
                onClick={handleRegisterPasskey}
                className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-slate-100 font-bold text-xs shadow-lg shadow-indigo-600/20 cursor-pointer"
              >
                <KeyRound className="w-4 h-4" />
                <span>Sign in with Passkey</span>
              </button>
            ) : (
              <span className="inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                <CheckCircle2 className="w-4 h-4 mr-1.5 text-emerald-400" />
                Passkey Authenticated
              </span>
            )}
          </div>
        </div>

        {/* User DID Badge Overview */}
        <div className="mt-6 bg-slate-950/80 border border-slate-800 rounded-xl p-4 font-mono text-xs space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2">
            <div className="flex items-center space-x-2">
              <UserCheck className="w-4 h-4 text-indigo-400" />
              <span className="font-bold text-slate-200">W3C DID Document:</span>
              <span className="text-cyan-300 font-semibold">{userDid.id}</span>
              <button 
                onClick={copyDid}
                className="text-slate-400 hover:text-cyan-300 flex items-center gap-1 ml-2"
              >
                {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
            <div className="flex items-center space-x-3 text-slate-400 text-[11px]">
              <span>Trust Score: <strong className="text-emerald-400">{userDid.trustScore}%</strong></span>
              <span>•</span>
              <span>Created: <strong className="text-slate-300">{new Date(userDid.created).toLocaleDateString()}</strong></span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px]">
            <div>
              <div className="text-slate-400 mb-1">PQC Multikey Fingerprint:</div>
              <div className="bg-slate-900 p-2 rounded text-indigo-300 truncate border border-slate-800">
                {userDid.authenticationKeys[0]?.publicKeyMultibase || 'Multikey-MLDSA'}
              </div>
            </div>

            <div>
              <div className="text-slate-400 mb-1">Hardware Passkey Status:</div>
              <div className="bg-slate-900 p-2 rounded text-emerald-400 truncate border border-slate-800">
                {userDid.webAuthnCredentialId || 'Unlinked (Click Passkey Sign-In)'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Verifiable Credentials + Zero-Knowledge Proof Studio */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Verifiable Credentials List */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-2">
              <FileCheck className="w-5 h-5 text-indigo-400" />
              <h3 className="font-bold text-slate-100 text-base">Verifiable Credentials (VC)</h3>
            </div>
            <button
              onClick={() => setIsVcModalOpen(true)}
              className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-slate-100 text-xs font-bold transition-colors cursor-pointer"
            >
              Issue New VC
            </button>
          </div>

          <div className="space-y-3">
            {userDid.verifiableCredentials.map((vc, idx) => (
              <div key={idx} className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 space-y-2 font-mono text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-indigo-300 text-[11px] truncate max-w-[200px]">{vc.type.join(' / ')}</span>
                  <span className="text-[10px] text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                    PQC Signed
                  </span>
                </div>

                <div className="bg-slate-900 p-2 rounded text-[11px] text-slate-300 space-y-1 border border-slate-800">
                  {Object.entries(vc.claims).map(([k, v]) => (
                    <div key={k} className="flex justify-between">
                      <span className="text-slate-400">{k}:</span>
                      <span className="text-cyan-300 font-semibold">{String(v)}</span>
                    </div>
                  ))}
                </div>

                <div className="text-[10px] text-slate-500 truncate">
                  Sig: {vc.pqcProofSignature.substring(0, 40)}...
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Zero Knowledge Identity Clearance Proof Studio */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
            <Sparkles className="w-5 h-5 text-cyan-400" />
            <h3 className="font-bold text-slate-100 text-base">Zero-Knowledge (ZK) Clearance Proof Studio</h3>
          </div>

          <div className="space-y-3 text-xs">
            <p className="text-slate-400">
              Prove to edge nodes that your security clearance score exceeds the minimum threshold without revealing your raw score or private keys.
            </p>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Secret Clearance Score</label>
                <input
                  type="number"
                  value={zkSecretScore}
                  onChange={e => setZkSecretScore(parseInt(e.target.value) || 0)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 font-mono focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Required Threshold</label>
                <input
                  type="number"
                  value={zkThreshold}
                  onChange={e => setZkThreshold(parseInt(e.target.value) || 0)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 font-mono focus:border-cyan-500 focus:outline-none"
                />
              </div>
            </div>

            <button
              onClick={handleGenerateZkProof}
              className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center justify-center space-x-2 shadow-lg shadow-cyan-500/20 cursor-pointer"
            >
              <Lock className="w-4 h-4" />
              <span>Generate ZK Range Proof</span>
            </button>

            {zkProofResult && (
              <div className="bg-slate-950 border border-cyan-900/60 rounded-xl p-3.5 space-y-2 font-mono text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-cyan-300">Proof Verification Status:</span>
                  {zkProofResult.verified ? (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                      PROOF VALID
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-950 text-rose-300 border border-rose-800">
                      PROOF FAILED
                    </span>
                  )}
                </div>

                <div className="text-[11px] text-slate-300 bg-slate-900 p-2.5 rounded border border-slate-800">
                  {zkProofResult.claim}
                </div>

                <div className="text-[10px] text-slate-400 space-y-1">
                  <div>Commitment R: <span className="text-teal-300">{zkProofResult.proofData.commitmentR}</span></div>
                  <div>Challenge e: <span className="text-indigo-300">{zkProofResult.proofData.challengeE}</span></div>
                  <div>Response s: <span className="text-cyan-300">{zkProofResult.proofData.responseS}</span></div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* VC Creation Modal */}
      {isVcModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-indigo-800/80 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-indigo-400" />
                Issue Verifiable Credential
              </h3>
              <button 
                onClick={() => setIsVcModalOpen(false)}
                className="text-slate-400 hover:text-slate-200 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleIssueVc} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Credential Type</label>
                <input
                  type="text"
                  required
                  value={newVcType}
                  onChange={e => setNewVcType(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Assigned Role</label>
                <input
                  type="text"
                  required
                  value={newVcRole}
                  onChange={e => setNewVcRole(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-[11px] text-slate-400">
                Signature: <strong className="text-indigo-300">Dilithium ML-DSA-65 PQC Vector</strong>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsVcModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-slate-100 font-bold"
                >
                  Issue Credential
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
