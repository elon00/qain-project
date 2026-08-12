import { EdgeNode, EdgeTask } from '../types';

export const INITIAL_EDGE_NODES: EdgeNode[] = [
  {
    id: 'node-us-east-1',
    name: 'North America Alpha (Virginia)',
    region: 'us-east',
    location: { lat: 38.03, lng: -78.47 },
    status: 'active',
    cpuLoad: 42,
    memoryLoad: 58,
    qpuCapacity: 128,
    activePqcAlgorithm: 'ML-KEM-768',
    activePqcKeyFingerprint: 'pqc:kyber:7a8f92c1',
    tasksCount: 14,
    bandwidthMbps: 9400,
    latencyMs: 12,
    conwayGridX: 4,
    conwayGridY: 3,
    quantumSecurityScore: 99,
    lastHeartbeat: '1s ago'
  },
  {
    id: 'node-eu-west-1',
    name: 'Europe Central (Frankfurt)',
    region: 'eu-central',
    location: { lat: 50.11, lng: 8.68 },
    status: 'active',
    cpuLoad: 78,
    memoryLoad: 81,
    qpuCapacity: 64,
    activePqcAlgorithm: 'ML-KEM-1024',
    activePqcKeyFingerprint: 'pqc:kyber:1024_d4e1',
    tasksCount: 22,
    bandwidthMbps: 8800,
    latencyMs: 18,
    conwayGridX: 12,
    conwayGridY: 5,
    quantumSecurityScore: 100,
    lastHeartbeat: '2s ago'
  },
  {
    id: 'node-ap-south-1',
    name: 'Asia Pacific Mesh (Tokyo)',
    region: 'ap-east',
    location: { lat: 35.67, lng: 139.65 },
    status: 'active',
    cpuLoad: 31,
    memoryLoad: 45,
    qpuCapacity: 256,
    activePqcAlgorithm: 'ML-KEM-768',
    activePqcKeyFingerprint: 'pqc:kyber:768_e92b',
    tasksCount: 9,
    bandwidthMbps: 12000,
    latencyMs: 8,
    conwayGridX: 18,
    conwayGridY: 8,
    quantumSecurityScore: 98,
    lastHeartbeat: '1s ago'
  },
  {
    id: 'node-af-south-1',
    name: 'Africa Edge Quantum Hub (Cape Town)',
    region: 'af-south',
    location: { lat: -33.92, lng: 18.42 },
    status: 'warning',
    cpuLoad: 89,
    memoryLoad: 92,
    qpuCapacity: 32,
    activePqcAlgorithm: 'ML-KEM-768',
    activePqcKeyFingerprint: 'pqc:kyber:af_3301',
    tasksCount: 31,
    bandwidthMbps: 4500,
    latencyMs: 42,
    conwayGridX: 8,
    conwayGridY: 11,
    quantumSecurityScore: 94,
    lastHeartbeat: '3s ago'
  },
  {
    id: 'node-sa-east-1',
    name: 'South America Hub (São Paulo)',
    region: 'sa-east',
    location: { lat: -23.55, lng: -46.63 },
    status: 'idle',
    cpuLoad: 15,
    memoryLoad: 28,
    qpuCapacity: 48,
    activePqcAlgorithm: 'ML-KEM-768',
    activePqcKeyFingerprint: 'pqc:kyber:sa_9180',
    tasksCount: 3,
    bandwidthMbps: 6200,
    latencyMs: 35,
    conwayGridX: 2,
    conwayGridY: 14,
    quantumSecurityScore: 96,
    lastHeartbeat: '1s ago'
  }
];

export const INITIAL_EDGE_TASKS: EdgeTask[] = [
  {
    id: 'task-101',
    title: 'Quantum Drug Docking Matrix Processing',
    payload: 'CELL_PROTEIN_BINDING_PQC_ENCRYPTED_VECTOR_321',
    pqcAlgorithm: 'ML-KEM-1024',
    status: 'completed',
    assignedNodeId: 'node-ap-south-1',
    priority: 'critical',
    createdAt: new Date(Date.now() - 300000).toLocaleTimeString(),
    executionLogs: [
      'Task received via DID authentication layer',
      'PQC shared secret derived via ML-KEM-1024',
      'Execution finished on 256-Qubit simulator in 0.42s'
    ]
  },
  {
    id: 'task-102',
    title: 'Edge Automaton Swarm Traffic Optimization',
    payload: 'AUTOMATON_SWARM_GRID_CONWAY_DECISION_RULESET_02',
    pqcAlgorithm: 'ML-KEM-768',
    status: 'routing',
    assignedNodeId: 'node-us-east-1',
    priority: 'high',
    createdAt: new Date(Date.now() - 120000).toLocaleTimeString(),
    executionLogs: [
      'Routed by Conway Automaton cell (4,3)',
      'ML-DSA-65 signature verified'
    ]
  },
  {
    id: 'task-103',
    title: 'Autonomous Drone Swarm Telemetry Pipeline',
    payload: 'DRONE_PACKET_PQC_SIGNED_TIMESTAMP_VECTOR_88',
    pqcAlgorithm: 'ML-DSA-65',
    status: 'encrypted',
    assignedNodeId: 'node-eu-west-1',
    priority: 'medium',
    createdAt: new Date(Date.now() - 60000).toLocaleTimeString(),
    executionLogs: [
      'Encapsulated payload using Frankfurt Kyber public key'
    ]
  }
];
