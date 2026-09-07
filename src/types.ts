export type PqcAlgorithm = 'ML-KEM-768' | 'ML-KEM-1024' | 'ML-DSA-65' | 'ML-DSA-87' | 'SPHINCS+-SHA256';

export type NodeStatus = 'active' | 'warning' | 'compromised' | 'idle' | 'quantum-locked';

export interface EdgeNode {
  id: string;
  name: string;
  region: string;
  location: { lat: number; lng: number };
  status: NodeStatus;
  cpuLoad: number; // percentage
  memoryLoad: number; // percentage
  qpuCapacity: number; // Qubits available
  activePqcAlgorithm: PqcAlgorithm;
  activePqcKeyFingerprint: string;
  tasksCount: number;
  bandwidthMbps: number;
  latencyMs: number;
  conwayGridX: number;
  conwayGridY: number;
  quantumSecurityScore: number; // 0 - 100
  lastHeartbeat: string;
}

export interface EdgeTask {
  id: string;
  title: string;
  payload: string;
  encryptedPayload?: string;
  sharedSecretHash?: string;
  pqcAlgorithm: PqcAlgorithm;
  status: 'pending' | 'routing' | 'encrypted' | 'completed' | 'quarantined';
  assignedNodeId: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  createdAt: string;
  executionLogs: string[];
}

export interface PqcKeypair {
  id: string;
  algorithm: PqcAlgorithm;
  publicKey: string;
  privateKey: string;
  fingerprint: string;
  bitSecurity: number;
  matrixDimensions: string;
  createdAt: string;
}

export interface VerifiableCredential {
  id: string;
  issuer: string;
  subjectDid: string;
  type: string[];
  issuanceDate: string;
  expirationDate: string;
  claims: Record<string, string | number | boolean>;
  pqcProofSignature: string;
}

export interface DidDocument {
  id: string; // did:qain:...
  created: string;
  authenticationKeys: {
    id: string;
    type: string;
    publicKeyMultibase: string;
  }[];
  verifiableCredentials: VerifiableCredential[];
  zkProofsCount: number;
  trustScore: number;
  webAuthnCredentialId?: string;
}

export interface ConwayCell {
  x: number;
  y: number;
  alive: boolean;
  energy: number; // 0 - 100
  type: 'standard' | 'quantum' | 'gateway' | 'shield';
  nodeId?: string;
  age: number;
}

export interface ConwayRuleConfig {
  birthRule: number[]; // e.g. [3]
  survivalRule: number[]; // e.g. [2, 3]
  enableQuantumSuperposition: boolean;
  decayRate: number;
  actionMappings: {
    overpopulationAction: string;
    underpopulationAction: string;
    gliderPatternAction: string;
  };
}

export interface AutomatonDecision {
  id: string;
  step: number;
  timestamp: string;
  cellCoords: [number, number];
  patternDetected: string;
  actionType: 'MIGRATE_TASK' | 'ISOLATE_NODE' | 'ROTATE_PQC_KEY' | 'SPAWN_EDGE_CAPACITY' | 'POWER_OPTIMIZATION';
  details: string;
  affectedNodeId: string;
  confidence: number;
}

export interface PqcBenchmarkResult {
  algorithm: string;
  type: 'KEM' | 'Signature';
  keyGenTimeMs: number;
  encapsulateTimeMs?: number;
  decapsulateTimeMs?: number;
  signTimeMs?: number;
  verifyTimeMs?: number;
  publicKeySizeBytes: number;
  cipherOrSigSizeBytes: number;
  quantumSecurityBits: number;
}

export interface AiStrategyResponse {
  analysis: string;
  recommendedActions: {
    nodeId: string;
    action: string;
    reasoning: string;
    priority: string;
  }[];
  quantumThreatAssessment: string;
  pqcRecommendation: string;
}

export interface PqcKeyPair {
  keyId: string;
  algorithm: 'ML-KEM-768' | 'ML-DSA-65' | 'Hybrid-Ed25519-Dilithium';
  publicKey: string;
  publicKeyFingerprint?: string;
  privateKeyPreview?: string;
  secretKey?: string;
  keySizeBits: number;
  nistSecurityLevel?: number;
  securityLevel?: number;
  createdAt?: string;
  generatedAt?: string;
  authorizedForAgent?: boolean;
}
