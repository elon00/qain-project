import React, { useState } from 'react';
import { 
  Bot, 
  Sparkles, 
  X, 
  Send, 
  Zap, 
  ShieldCheck, 
  Cpu, 
  Activity,
  AlertTriangle,
  Loader2
} from 'lucide-react';
import { EdgeNode, AiStrategyResponse } from '../types';

interface AiAssistantDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  edgeNodes: EdgeNode[];
  conwayStep: number;
}

export const AiAssistantDrawer: React.FC<AiAssistantDrawerProps> = ({
  isOpen,
  onClose,
  edgeNodes,
  conwayStep
}) => {
  const [queryInput, setQueryInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState<AiStrategyResponse | null>(null);

  const handleRunAiAnalysis = async (customQuery?: string) => {
    setLoading(true);
    const q = customQuery || queryInput || "Optimize global node load and PQC security parameters.";

    try {
      const res = await fetch('/api/ai/edge-orchestrate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          edgeNodes,
          activeTasksCount: 14,
          conwaySummary: `Conway step #${conwayStep} with active glider pattern in sector (12,8)`,
          query: q
        })
      });

      const data = await res.json();
      setAiResponse(data);
    } catch (err) {
      console.error(err);
      setAiResponse({
        analysis: "Operating under local edge fallback heuristics.",
        recommendedActions: [
          {
            nodeId: "node-us-east-1",
            action: "PQC Lattice Refresh",
            reasoning: "Rule trigger active.",
            priority: "High"
          }
        ],
        quantumThreatAssessment: "Lattice parameters verified.",
        pqcRecommendation: "ML-KEM-768 active."
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-full sm:w-[480px] bg-slate-900 border-l border-cyan-800/80 z-50 shadow-2xl flex flex-col backdrop-blur-xl">
      {/* Drawer Header */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center border border-cyan-500/50">
            <Bot className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h3 className="font-bold text-slate-100 text-sm">QAIN AI Orchestrator</h3>
            <p className="text-[10px] text-slate-400 font-mono">Powered by Gemini 2.5 Flash API</p>
          </div>
        </div>

        <button 
          onClick={onClose}
          className="text-slate-400 hover:text-slate-100 p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Drawer Body */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 font-sans text-xs text-slate-300">
        {/* Preset Triggers */}
        <div>
          <div className="text-[11px] font-mono text-cyan-400 font-bold mb-2 uppercase tracking-wider">
            Quick AI Analysis Triggers
          </div>
          <div className="space-y-1.5 font-mono">
            <button
              onClick={() => handleRunAiAnalysis("Analyze edge node load balancing & recommend PQC updates")}
              className="w-full text-left p-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 text-[11px] transition-colors flex items-center justify-between cursor-pointer"
            >
              <span>1. Optimize Global Node Load & PQC</span>
              <Sparkles className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            </button>

            <button
              onClick={() => handleRunAiAnalysis("Evaluate Conway cellular automaton pattern state for task migration")}
              className="w-full text-left p-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 text-[11px] transition-colors flex items-center justify-between cursor-pointer"
            >
              <span>2. Synthesize Conway Automaton Patterns</span>
              <Activity className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            </button>

            <button
              onClick={() => handleRunAiAnalysis("Perform Post-Quantum Cryptography lattice threat audit")}
              className="w-full text-left p-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 text-[11px] transition-colors flex items-center justify-between cursor-pointer"
            >
              <span>3. PQC Lattice Threat Audit</span>
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            </button>
          </div>
        </div>

        {/* AI Output Section */}
        {loading ? (
          <div className="p-8 text-center space-y-3 bg-slate-950 rounded-2xl border border-slate-800">
            <Loader2 className="w-6 h-6 text-cyan-400 animate-spin mx-auto" />
            <div className="text-cyan-300 font-mono text-xs">Gemini AI Analyzing Edge Mesh & Conway State...</div>
          </div>
        ) : aiResponse ? (
          <div className="space-y-4">
            {/* Analysis Overview */}
            <div className="bg-slate-950 border border-cyan-900/60 rounded-xl p-3.5 space-y-2">
              <div className="flex items-center space-x-2 text-cyan-300 font-bold font-mono">
                <Bot className="w-4 h-4 text-cyan-400" />
                <span>AI Strategy Synthesis</span>
              </div>
              <p className="text-slate-300 leading-relaxed text-[11px]">
                {aiResponse.analysis}
              </p>
            </div>

            {/* Recommended Actions */}
            {aiResponse.recommendedActions && aiResponse.recommendedActions.length > 0 && (
              <div className="space-y-2">
                <div className="text-[11px] font-mono text-slate-400 font-bold uppercase">
                  Recommended Edge Directives
                </div>
                {aiResponse.recommendedActions.map((act, i) => (
                  <div key={i} className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
                    <div className="flex items-center justify-between font-mono text-[11px]">
                      <span className="font-bold text-cyan-300">{act.nodeId}</span>
                      <span className="px-1.5 py-0.5 rounded text-[10px] bg-cyan-950 text-cyan-300 font-bold border border-cyan-800">
                        {act.priority}
                      </span>
                    </div>
                    <div className="text-slate-100 font-bold text-xs">{act.action}</div>
                    <div className="text-slate-400 text-[11px]">{act.reasoning}</div>
                  </div>
                ))}
              </div>
            )}

            {/* PQC Recommendation */}
            <div className="bg-slate-950 border border-emerald-900/60 rounded-xl p-3.5 space-y-1 font-mono">
              <div className="text-emerald-400 font-bold text-[11px] flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" />
                PQC Lattice Recommendation
              </div>
              <p className="text-slate-300 text-[11px]">
                {aiResponse.pqcRecommendation}
              </p>
            </div>
          </div>
        ) : null}
      </div>

      {/* Drawer Footer Input */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/80">
        <form 
          onSubmit={e => {
            e.preventDefault();
            handleRunAiAnalysis();
          }}
          className="flex gap-2"
        >
          <input
            type="text"
            value={queryInput}
            onChange={e => setQueryInput(e.target.value)}
            placeholder="Ask AI edge orchestrator..."
            className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 text-xs focus:border-cyan-500 focus:outline-none"
          />
          <button
            type="submit"
            className="px-3.5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center justify-center cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
