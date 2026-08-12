import React, { useState } from 'react';
import { Header } from './components/Header';
import { EdgeTopologyTab } from './components/EdgeTopologyTab';
import { PqcStudioTab } from './components/PqcStudioTab';
import { ConwayAutomatonTab } from './components/ConwayAutomatonTab';
import { DidAuthTab } from './components/DidAuthTab';
import { AiAssistantDrawer } from './components/AiAssistantDrawer';
import { INITIAL_EDGE_NODES, INITIAL_EDGE_TASKS } from './data/mockInitialData';
import { createQainDid } from './utils/didAuth';
import { EdgeNode, EdgeTask, DidDocument } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<'topology' | 'pqc' | 'conway' | 'did'>('topology');
  const [nodes, setNodes] = useState<EdgeNode[]>(INITIAL_EDGE_NODES);
  const [tasks, setTasks] = useState<EdgeTask[]>(INITIAL_EDGE_TASKS);
  const [userDid, setUserDid] = useState<DidDocument>(() => createQainDid('operator-prime'));
  const [conwayStep, setConwayStep] = useState<number>(42);
  const [isAiDrawerOpen, setIsAiDrawerOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500 selection:text-slate-950 antialiased flex flex-col">
      {/* Navigation Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        userDid={userDid}
        isAiDrawerOpen={isAiDrawerOpen}
        setIsAiDrawerOpen={setIsAiDrawerOpen}
        conwayStep={conwayStep}
        activeNodesCount={nodes.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {activeTab === 'topology' && (
          <EdgeTopologyTab
            nodes={nodes}
            setNodes={setNodes}
            tasks={tasks}
            setTasks={setTasks}
          />
        )}

        {activeTab === 'pqc' && (
          <PqcStudioTab />
        )}

        {activeTab === 'conway' && (
          <ConwayAutomatonTab
            conwayStep={conwayStep}
            setConwayStep={setConwayStep}
            edgeNodes={nodes}
          />
        )}

        {activeTab === 'did' && (
          <DidAuthTab
            userDid={userDid}
            setUserDid={setUserDid}
          />
        )}
      </main>

      {/* AI Orchestrator Drawer */}
      <AiAssistantDrawer
        isOpen={isAiDrawerOpen}
        onClose={() => setIsAiDrawerOpen(false)}
        edgeNodes={nodes}
        conwayStep={conwayStep}
      />

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-4 text-center text-xs text-slate-500 font-mono">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>QAIN Web 4.0 Platform • Post-Quantum Edge Mesh & Conway AI</div>
          <div className="text-slate-600">NIST FIPS-203 ML-KEM • W3C DID Standard</div>
        </div>
      </footer>
    </div>
  );
}
