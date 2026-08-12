import React from 'react';
import { 
  Cpu, 
  ShieldCheck, 
  Grid3X3, 
  Fingerprint, 
  Bot, 
  Activity, 
  Network,
  Zap
} from 'lucide-react';
import { DidDocument } from '../types';

interface HeaderProps {
  activeTab: 'topology' | 'pqc' | 'conway' | 'did';
  setActiveTab: (tab: 'topology' | 'pqc' | 'conway' | 'did') => void;
  userDid: DidDocument;
  isAiDrawerOpen: boolean;
  setIsAiDrawerOpen: (open: boolean) => void;
  conwayStep: number;
  activeNodesCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  userDid,
  isAiDrawerOpen,
  setIsAiDrawerOpen,
  conwayStep,
  activeNodesCount
}) => {
  return (
    <header className="bg-slate-900 border-b border-cyan-900/50 sticky top-0 z-40 text-slate-100 shadow-xl shadow-cyan-950/20 backdrop-blur-md bg-slate-900/90">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Branding & Status Row */}
        <div className="flex items-center justify-between py-3 border-b border-slate-800/80">
          <div className="flex items-center space-x-3">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 via-teal-500 to-indigo-600 p-[2px] shadow-lg shadow-cyan-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Network className="w-5 h-5 text-cyan-400 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-cyan-300 via-teal-200 to-indigo-200 bg-clip-text text-transparent">
                  QAIN <span className="text-cyan-400 font-mono text-sm font-normal">v4.0</span>
                </h1>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-mono font-medium bg-cyan-950/80 text-cyan-300 border border-cyan-800/50">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-400 mr-1.5 animate-ping" />
                  Web 4.0 Mesh Active
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Post-Quantum Cryptography • Conway Automaton AI • Decentralized DID Auth
              </p>
            </div>
          </div>

          {/* Telemetry Pills & DID User Badge */}
          <div className="flex items-center space-x-3">
            {/* Quick Metrics */}
            <div className="hidden lg:flex items-center space-x-4 bg-slate-950/70 border border-slate-800 px-3 py-1.5 rounded-lg text-xs font-mono">
              <div className="flex items-center space-x-1.5 text-slate-300">
                <Activity className="w-3.5 h-3.5 text-cyan-400" />
                <span>Nodes: <strong className="text-cyan-300">{activeNodesCount}</strong></span>
              </div>
              <span className="text-slate-700">|</span>
              <div className="flex items-center space-x-1.5 text-slate-300">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>PQC: <strong className="text-emerald-300">ML-KEM-768</strong></span>
              </div>
              <span className="text-slate-700">|</span>
              <div className="flex items-center space-x-1.5 text-slate-300">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>Conway Gen: <strong className="text-amber-300">#{conwayStep}</strong></span>
              </div>
            </div>

            {/* Active DID Pill */}
            <div className="flex items-center space-x-2 bg-slate-950 border border-cyan-900/60 hover:border-cyan-700 text-cyan-200 px-3 py-1.5 rounded-lg text-xs font-mono transition-colors">
              <Fingerprint className="w-4 h-4 text-cyan-400 shrink-0" />
              <div className="text-left hidden sm:block">
                <div className="text-[10px] text-cyan-400 uppercase tracking-wider font-semibold">User DID</div>
                <div className="truncate max-w-[120px] text-slate-300 font-semibold">{userDid.id}</div>
              </div>
            </div>

            {/* AI Assistant Button */}
            <button
              onClick={() => setIsAiDrawerOpen(!isAiDrawerOpen)}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                isAiDrawerOpen 
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30 font-semibold' 
                  : 'bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-800/40'
              }`}
            >
              <Bot className="w-4 h-4" />
              <span className="hidden sm:inline">QAIN AI Co-Pilot</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation Row */}
        <div className="flex items-center justify-between overflow-x-auto scrollbar-none py-2 gap-2">
          <nav className="flex space-x-1 sm:space-x-2">
            <button
              id="tab-topology"
              onClick={() => setActiveTab('topology')}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                activeTab === 'topology'
                  ? 'bg-cyan-950/90 text-cyan-200 border border-cyan-500/50 shadow-inner'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Cpu className={`w-4 h-4 ${activeTab === 'topology' ? 'text-cyan-400' : ''}`} />
              <span>Web 4.0 Edge Topology</span>
            </button>

            <button
              id="tab-pqc"
              onClick={() => setActiveTab('pqc')}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                activeTab === 'pqc'
                  ? 'bg-cyan-950/90 text-cyan-200 border border-cyan-500/50 shadow-inner'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <ShieldCheck className={`w-4 h-4 ${activeTab === 'pqc' ? 'text-emerald-400' : ''}`} />
              <span>PQC Cryptography Hub</span>
            </button>

            <button
              id="tab-conway"
              onClick={() => setActiveTab('conway')}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                activeTab === 'conway'
                  ? 'bg-cyan-950/90 text-cyan-200 border border-cyan-500/50 shadow-inner'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Grid3X3 className={`w-4 h-4 ${activeTab === 'conway' ? 'text-amber-400' : ''}`} />
              <span>Conway Automaton AI</span>
            </button>

            <button
              id="tab-did"
              onClick={() => setActiveTab('did')}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                activeTab === 'did'
                  ? 'bg-cyan-950/90 text-cyan-200 border border-cyan-500/50 shadow-inner'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Fingerprint className={`w-4 h-4 ${activeTab === 'did' ? 'text-indigo-400' : ''}`} />
              <span>DID & Decentralized Auth</span>
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};
