import { ConwayCell, ConwayRuleConfig, AutomatonDecision, EdgeNode } from '../types';

export const DEFAULT_CONWAY_RULES: ConwayRuleConfig = {
  birthRule: [3],
  survivalRule: [2, 3],
  enableQuantumSuperposition: true,
  decayRate: 5,
  actionMappings: {
    overpopulationAction: 'MIGRATE_TASK',
    underpopulationAction: 'POWER_OPTIMIZATION',
    gliderPatternAction: 'SPAWN_EDGE_CAPACITY'
  }
};

export function createEmptyConwayGrid(cols: number, rows: number): ConwayCell[][] {
  const grid: ConwayCell[][] = [];
  for (let y = 0; y < rows; y++) {
    const row: ConwayCell[] = [];
    for (let x = 0; x < cols; x++) {
      row.push({
        x,
        y,
        alive: false,
        energy: 0,
        type: (x + y) % 7 === 0 ? 'quantum' : (x + y) % 5 === 0 ? 'gateway' : 'standard',
        age: 0
      });
    }
    grid.push(row);
  }
  return grid;
}

// Preset Patterns for Conway Automaton
export const PRESET_PATTERNS: Record<string, [number, number][]> = {
  Glider: [
    [0, 1], [1, 2], [2, 0], [2, 1], [2, 2]
  ],
  Pulsar: [
    [2, 0], [3, 0], [4, 0], [8, 0], [9, 0], [10, 0],
    [0, 2], [5, 2], [7, 2], [12, 2],
    [0, 3], [5, 3], [7, 3], [12, 3],
    [0, 4], [5, 4], [7, 4], [12, 4],
    [2, 5], [3, 5], [4, 5], [8, 5], [9, 5], [10, 5],
    [2, 7], [3, 7], [4, 7], [8, 7], [9, 7], [10, 7],
    [0, 8], [5, 8], [7, 8], [12, 8],
    [0, 9], [5, 9], [7, 9], [12, 9],
    [0, 10], [5, 10], [7, 10], [12, 10],
    [2, 12], [3, 12], [4, 12], [8, 12], [9, 12], [10, 12]
  ],
  'Quantum Beacon': [
    [0, 0], [1, 0], [0, 1], [1, 1],
    [2, 2], [3, 2], [2, 3], [3, 3]
  ],
  'Gosper Glider Gun': [
    [24, 0],
    [22, 1], [24, 1],
    [12, 2], [13, 2], [20, 2], [21, 2], [34, 2], [35, 2],
    [11, 3], [15, 3], [20, 3], [21, 3], [34, 3], [35, 3],
    [0, 4], [1, 4], [10, 4], [16, 4], [20, 4], [21, 4],
    [0, 5], [1, 5], [10, 5], [14, 5], [16, 5], [17, 5], [22, 5], [24, 5],
    [10, 6], [16, 6], [24, 6],
    [11, 7], [15, 7],
    [12, 8], [13, 8]
  ]
};

export function applyPatternToGrid(
  grid: ConwayCell[][],
  patternCoords: [number, number][],
  startDx: number,
  startDy: number
): ConwayCell[][] {
  const newGrid = grid.map(row => row.map(cell => ({ ...cell })));
  const rows = newGrid.length;
  const cols = newGrid[0].length;

  for (const [dx, dy] of patternCoords) {
    const x = (startDx + dx) % cols;
    const y = (startDy + dy) % rows;
    if (y >= 0 && y < rows && x >= 0 && x < cols) {
      newGrid[y][x].alive = true;
      newGrid[y][x].energy = 95;
      newGrid[y][x].age = 1;
    }
  }
  return newGrid;
}

// Compute Next Step of Conway Automaton and Extract Edge Decisions
export function stepConwayAutomaton(
  grid: ConwayCell[][],
  rules: ConwayRuleConfig = DEFAULT_CONWAY_RULES,
  stepNumber: number = 1,
  edgeNodes: EdgeNode[] = []
): { nextGrid: ConwayCell[][]; decisions: AutomatonDecision[] } {
  const rows = grid.length;
  const cols = grid[0].length;
  const nextGrid: ConwayCell[][] = [];
  const decisions: AutomatonDecision[] = [];

  for (let y = 0; y < rows; y++) {
    const nextRow: ConwayCell[] = [];
    for (let x = 0; x < cols; x++) {
      const cell = grid[y][x];

      // Count 8 neighbors
      let neighborCount = 0;
      let neighborEnergySum = 0;
      let quantumNeighborCount = 0;

      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          if (dx === 0 && dy === 0) continue;
          const nx = (x + dx + cols) % cols;
          const ny = (y + dy + rows) % rows;
          const neighbor = grid[ny][nx];
          if (neighbor.alive) {
            neighborCount++;
            neighborEnergySum += neighbor.energy;
            if (neighbor.type === 'quantum') quantumNeighborCount++;
          }
        }
      }

      let nextAlive = false;
      let nextEnergy = cell.energy;
      let nextType = cell.type;
      let nextAge = cell.age;

      if (cell.alive) {
        if (rules.survivalRule.includes(neighborCount)) {
          nextAlive = true;
          nextAge = cell.age + 1;
          nextEnergy = Math.min(100, cell.energy + 2);
        } else {
          nextAlive = false;
          nextEnergy = Math.max(0, cell.energy - rules.decayRate);
          nextAge = 0;

          // Trigger decision on death by overpopulation or underpopulation
          if (neighborCount > 3) {
            const targetNode = edgeNodes[(x + y) % (edgeNodes.length || 1)];
            decisions.push({
              id: `dec-${stepNumber}-${x}-${y}`,
              step: stepNumber,
              timestamp: new Date().toLocaleTimeString(),
              cellCoords: [x, y],
              patternDetected: 'Overpopulation Cluster Density (>3 neighbors)',
              actionType: 'MIGRATE_TASK',
              details: `Overcrowded Automaton cell (${x},${y}) triggered dynamic task migration on Node ${targetNode?.name || 'Node-Alpha'} to prevent latency spikes.`,
              affectedNodeId: targetNode?.id || 'node-1',
              confidence: 0.94
            });
          } else if (neighborCount < 2) {
            const targetNode = edgeNodes[(x + y) % (edgeNodes.length || 1)];
            decisions.push({
              id: `dec-${stepNumber}-${x}-${y}`,
              step: stepNumber,
              timestamp: new Date().toLocaleTimeString(),
              cellCoords: [x, y],
              patternDetected: 'Isolated Cell Decay (<2 neighbors)',
              actionType: 'POWER_OPTIMIZATION',
              details: `Isolated Automaton cell (${x},${y}) signaled low activity region. Initiating eco-standby power cycle on ${targetNode?.name || 'Node-Beta'}.`,
              affectedNodeId: targetNode?.id || 'node-2',
              confidence: 0.88
            });
          }
        }
      } else {
        if (rules.birthRule.includes(neighborCount)) {
          nextAlive = true;
          nextAge = 1;
          nextEnergy = Math.min(100, 50 + neighborEnergySum / (neighborCount || 1));

          // Birth trigger
          if (quantumNeighborCount >= 2 && rules.enableQuantumSuperposition) {
            nextType = 'quantum';
            const targetNode = edgeNodes[(x + y) % (edgeNodes.length || 1)];
            decisions.push({
              id: `dec-${stepNumber}-${x}-${y}`,
              step: stepNumber,
              timestamp: new Date().toLocaleTimeString(),
              cellCoords: [x, y],
              patternDetected: 'Quantum Superposition State Birth',
              actionType: 'ROTATE_PQC_KEY',
              details: `Quantum Automaton cell birthed at (${x},${y}). Initiating automatic Kyber-1024 PQC key rotation for cluster ${targetNode?.region || 'US-East'}.`,
              affectedNodeId: targetNode?.id || 'node-3',
              confidence: 0.97
            });
          } else {
            const targetNode = edgeNodes[(x + y) % (edgeNodes.length || 1)];
            decisions.push({
              id: `dec-${stepNumber}-${x}-${y}`,
              step: stepNumber,
              timestamp: new Date().toLocaleTimeString(),
              cellCoords: [x, y],
              patternDetected: 'Swarm Cell Birth (B3 Rule)',
              actionType: 'SPAWN_EDGE_CAPACITY',
              details: `Active swarm birthed at (${x},${y}). Allocated +250 TeraFLOPS compute reservation to ${targetNode?.name || 'Node-Gamma'}.`,
              affectedNodeId: targetNode?.id || 'node-1',
              confidence: 0.91
            });
          }
        } else {
          nextEnergy = Math.max(0, cell.energy - rules.decayRate);
        }
      }

      nextRow.push({
        x,
        y,
        alive: nextAlive,
        energy: nextEnergy,
        type: nextType,
        nodeId: cell.nodeId,
        age: nextAge
      });
    }
    nextGrid.push(nextRow);
  }

  return { nextGrid, decisions };
}
