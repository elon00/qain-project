import React, { useState } from 'react';
import { 
  EdgeNode, 
  EdgeTask, 
  PqcAlgorithm 
} from '../types';
import { 
  Cpu, 
  ShieldCheck, 
  Globe, 
  Plus, 
  RefreshCw, 
  Terminal, 
  Radio, 
  Lock, 
  Server,
  Zap,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { encapsAndEncryptPayload } from '../utils/pqcCrypto';

interface EdgeTopologyTabProps {
  nodes: EdgeNode[];
  setNodes: React.Dispatch<React.SetStateAction<EdgeNode[]>>;
  tasks: EdgeTask[];
  setTasks: React.Dispatch<React.SetStateAction<EdgeTask[]>>;
}

export const EdgeTopologyTab: React.FC<EdgeTopologyTabProps> = ({
  nodes,
  setNodes,
  tasks,
  setTasks
}) => {
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(nodes[0]?.id || null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskPayload, setNewTaskPayload] = useState('');
  const [newTaskAlgo, setNewTaskAlgo] = useState<PqcAlgorithm>('ML-KEM-768');
  const [newTaskPriority, setNewTaskPriority] = useState<'low' | 'medium' | 'high' | 'critical'>('high');
  const [activeLogTask, setActiveLogTask] = useState<EdgeTask | null>(null);

  const selectedNode = nodes.find(n => n.id === selectedNodeId) || nodes[0];

  // Rotate Node PQC Key
  const handleRotateKey = (nodeId: string) => {
    setNodes(prev => prev.map(n => {
      if (n.id === nodeId) {
        const newAlgo: PqcAlgorithm = n.activePqcAlgorithm === 'ML-KEM-768' ? 'ML-KEM-1024' : 'ML-KEM-768';
        const newFingerprint = `pqc:kyber:rot_${Math.random().toString(16).substring(2, 8)}`;
        return {
          ...n,
          activePqcAlgorithm: newAlgo,
          activePqcKeyFingerprint: newFingerprint,
          quantumSecurityScore: 100
        };
      }
      return n;
    }));
  };

  // Submit New Web 4.0 Task to Edge Mesh
  const handleDeployTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle || !newTaskPayload) return;

    const targetNode = selectedNode || nodes[0];
    
    // Encrypt payload using target node's PQC key
    const encryptedResult = encapsAndEncryptPayload(newTaskPayload, '', newTaskAlgo);

    const newTask: EdgeTask = {
      id: `task-${Date.now().toString(36)}`,
      title: newTaskTitle,
      payload: newTaskPayload,
      encryptedPayload: encryptedResult.ciphertext,
      sharedSecretHash: encryptedResult.sharedSecretHash,
      pqcAlgorithm: newTaskAlgo,
      status: 'encrypted',
      assignedNodeId: targetNode.id,
      priority: newTaskPriority,
      createdAt: new Date().toLocaleTimeString(),
      executionLogs: [
        `[${new Date().toLocaleTimeString()}] Task generated & signed with DID credential`,
        ...encryptedResult.logs,
        `[${new Date().toLocaleTimeString()}] Payload encapsulated and dispatched to Edge Node ${targetNode.name}`
      ]
    };

    setTasks(prev => [newTask, ...prev]);
    setNodes(prev => prev.map(n => n.id === targetNode.id ? { ...n, tasksCount: n.tasksCount + 1 } : n));

    // Reset Form
    setNewTaskTitle('');
    setNewTaskPayload('');
    setIsTaskModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Overview */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-md relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center space-x-2 text-cyan-400 text-xs font-mono font-semibold uppercase tracking-wider mb-1">
              <Globe className="w-4 h-4 animate-spin-slow" />
              <span>Global Web 4.0 Edge Compute Mesh</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-100">Dynamic Edge Node Topology & Orchestration</h2>
            <p className="text-sm text-slate-400 max-w-2xl mt-1">
              Real-time monitoring of decentralized Web 4.0 edge computing nodes secured with Post-Quantum Cryptography (PQC) lattice algorithms.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsTaskModalOpen(true)}
              className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 text-slate-950 font-bold text-sm shadow-lg shadow-cyan-500/20 hover:from-cyan-400 hover:to-teal-400 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Deploy Web 4.0 Task</span>
            </button>
          </div>
        </div>

        {/* Global Node Map Grid representation */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {nodes.map(node => {
            const isSelected = node.id === selectedNodeId;
            return (
              <div
                key={node.id}
                onClick={() => setSelectedNodeId(node.id)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer relative ${
                  isSelected 
                    ? 'bg-cyan-950/60 border-cyan-500/80 shadow-md shadow-cyan-950/50' 
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`w-2 h-2 rounded-full ${
                    node.status === 'active' ? 'bg-emerald-400 animate-pulse' :
                    node.status === 'warning' ? 'bg-amber-400' : 'bg-slate-500'
                  }`} />
                  <span className="text-[10px] font-mono text-slate-400">{node.region}</span>
                </div>

                <div className="font-semibold text-xs text-slate-200 truncate">{node.name}</div>
                <div className="text-[10px] text-cyan-400 font-mono mt-0.5">{node.activePqcAlgorithm}</div>

                {/* Load bar */}
                <div className="mt-3 space-y-1">
                  <div className="flex justify-between text-[10px] font-mono text-slate-400">
                    <span>CPU</span>
                    <span className="text-slate-300 font-bold">{node.cpuLoad}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${node.cpuLoad > 85 ? 'bg-rose-500' : node.cpuLoad > 70 ? 'bg-amber-400' : 'bg-cyan-400'}`}
                      style={{ width: `${node.cpuLoad}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Node Details & Task Queue Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Selected Node Control Dashboard */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-2">
              <Server className="w-5 h-5 text-cyan-400" />
              <h3 className="font-bold text-slate-100 text-base">Node Telemetry</h3>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-950 text-emerald-400 border border-emerald-800/60">
              {selectedNode.status.toUpperCase()}
            </span>
          </div>

          <div>
            <div className="text-lg font-bold text-slate-100">{selectedNode.name}</div>
            <div className="text-xs text-slate-400 font-mono mt-0.5">ID: {selectedNode.id}</div>
          </div>

          {/* Dials & Stats Grid */}
          <div className="grid grid-cols-2 gap-3 font-mono text-xs">
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <div className="text-slate-400 text-[10px]">QPU Capacity</div>
              <div className="text-base font-bold text-cyan-300 mt-1">{selectedNode.qpuCapacity} Qubits</div>
            </div>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <div className="text-slate-400 text-[10px]">Latency</div>
              <div className="text-base font-bold text-teal-300 mt-1">{selectedNode.latencyMs} ms</div>
            </div>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <div className="text-slate-400 text-[10px]">Bandwidth</div>
              <div className="text-base font-bold text-indigo-300 mt-1">{selectedNode.bandwidthMbps} Mbps</div>
            </div>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <div className="text-slate-400 text-[10px]">Security Score</div>
              <div className="text-base font-bold text-emerald-300 mt-1">{selectedNode.quantumSecurityScore}%</div>
            </div>
          </div>

          {/* PQC Key Information */}
          <div className="bg-slate-950/80 border border-cyan-900/40 rounded-xl p-3.5 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 font-medium flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-cyan-400" />
                Active Lattice Algorithm
              </span>
              <span className="font-mono text-cyan-300 font-bold">{selectedNode.activePqcAlgorithm}</span>
            </div>
            <div className="text-[11px] font-mono text-slate-500 truncate bg-slate-900 p-1.5 rounded border border-slate-800">
              FP: {selectedNode.activePqcKeyFingerprint}
            </div>

            <button
              onClick={() => handleRotateKey(selectedNode.id)}
              className="w-full mt-2 flex items-center justify-center space-x-2 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-semibold border border-cyan-800/40 transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Rotate PQC Lattice Key</span>
            </button>
          </div>
        </div>

        {/* Edge Task Queue & Telemetry Stream */}
        <div className="lg:col-span-2 bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-2">
              <Radio className="w-5 h-5 text-teal-400" />
              <h3 className="font-bold text-slate-100 text-base">Web 4.0 Task Dispatch Queue</h3>
            </div>
            <span className="text-xs font-mono text-slate-400">Total Tasks: {tasks.length}</span>
          </div>

          {/* Task List Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300 font-sans">
              <thead className="text-[10px] font-mono uppercase bg-slate-950 text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="p-3">Task ID</th>
                  <th className="p-3">Title</th>
                  <th className="p-3">PQC Encryption</th>
                  <th className="p-3">Assigned Node</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {tasks.map(task => {
                  const nodeObj = nodes.find(n => n.id === task.assignedNodeId);
                  return (
                    <tr key={task.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="p-3 text-cyan-400 font-semibold">{task.id}</td>
                      <td className="p-3 font-sans text-slate-200 font-medium truncate max-w-[180px]">
                        {task.title}
                      </td>
                      <td className="p-3 text-emerald-400 text-[11px]">
                        <span className="inline-flex items-center gap-1 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/50">
                          <Lock className="w-3 h-3 text-emerald-400" />
                          {task.pqcAlgorithm}
                        </span>
                      </td>
                      <td className="p-3 text-slate-400 truncate max-w-[120px]">{nodeObj?.name || task.assignedNodeId}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                          task.status === 'completed' ? 'bg-emerald-950 text-emerald-300' :
                          task.status === 'encrypted' ? 'bg-cyan-950 text-cyan-300' :
                          'bg-amber-950 text-amber-300'
                        }`}>
                          {task.status}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => setActiveLogTask(task)}
                          className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300 text-[11px] font-mono transition-colors"
                        >
                          Logs
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Task Creation Modal */}
      {isTaskModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-cyan-800/80 rounded-2xl p-6 max-w-lg w-full shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                <Zap className="w-5 h-5 text-cyan-400" />
                Deploy Web 4.0 Task to Edge Mesh
              </h3>
              <button 
                onClick={() => setIsTaskModalOpen(false)}
                className="text-slate-400 hover:text-slate-200 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleDeployTask} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Task Title</label>
                <input
                  type="text"
                  required
                  value={newTaskTitle}
                  onChange={e => setNewTaskTitle(e.target.value)}
                  placeholder="e.g. Autonomous Traffic Flow Vector Optimization"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Data Payload (Will be PQC Encrypted)</label>
                <textarea
                  rows={3}
                  required
                  value={newTaskPayload}
                  onChange={e => setNewTaskPayload(e.target.value)}
                  placeholder="Enter message or dataset payload..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 font-mono focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">PQC Lattice Algorithm</label>
                  <select
                    value={newTaskAlgo}
                    onChange={e => setNewTaskAlgo(e.target.value as PqcAlgorithm)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 font-mono focus:border-cyan-500 focus:outline-none"
                  >
                    <option value="ML-KEM-768">ML-KEM-768 (Kyber-768)</option>
                    <option value="ML-KEM-1024">ML-KEM-1024 (High-Security)</option>
                    <option value="ML-DSA-65">ML-DSA-65 (Dilithium)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Priority</label>
                  <select
                    value={newTaskPriority}
                    onChange={e => setNewTaskPriority(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:border-cyan-500 focus:outline-none"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
              </div>

              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-[11px] text-slate-400">
                Target Node: <strong className="text-cyan-300">{selectedNode.name}</strong> ({selectedNode.region})
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsTaskModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold"
                >
                  Encrypt & Dispatch Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Task Execution Log Modal */}
      {activeLogTask && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-cyan-800/80 rounded-2xl p-6 max-w-xl w-full shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2 font-mono">
                <Terminal className="w-4 h-4 text-cyan-400" />
                Execution Log: {activeLogTask.id}
              </h3>
              <button 
                onClick={() => setActiveLogTask(null)}
                className="text-slate-400 hover:text-slate-200 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2 font-mono text-xs text-slate-300 max-h-80 overflow-y-auto">
              <div className="text-cyan-400 font-bold">[{activeLogTask.pqcAlgorithm}] Encrypted Payload Structure:</div>
              <div className="bg-slate-900 p-2 rounded text-[11px] text-emerald-400 break-all border border-slate-800">
                {activeLogTask.encryptedPayload || activeLogTask.payload}
              </div>
              
              <div className="pt-2 text-cyan-400 font-bold">Step Logs:</div>
              {activeLogTask.executionLogs.map((log, i) => (
                <div key={i} className="text-slate-400 flex items-start gap-2">
                  <span className="text-cyan-500 font-bold">›</span>
                  <span>{log}</span>
                </div>
              ))}
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setActiveLogTask(null)}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
