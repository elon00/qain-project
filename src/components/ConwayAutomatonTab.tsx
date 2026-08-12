import React, { useState, useEffect, useRef } from 'react';
import { 
  ConwayCell, 
  AutomatonDecision, 
  EdgeNode 
} from '../types';
import { 
  Grid3X3, 
  Play, 
  Pause, 
  SkipForward, 
  RotateCcw, 
  Sparkles, 
  Zap, 
  Cpu, 
  Sliders, 
  Activity 
} from 'lucide-react';
import { 
  createEmptyConwayGrid, 
  stepConwayAutomaton, 
  applyPatternToGrid, 
  PRESET_PATTERNS, 
  DEFAULT_CONWAY_RULES 
} from '../utils/conwayEngine';

interface ConwayAutomatonTabProps {
  conwayStep: number;
  setConwayStep: React.Dispatch<React.SetStateAction<number>>;
  edgeNodes: EdgeNode[];
}

export const ConwayAutomatonTab: React.FC<ConwayAutomatonTabProps> = ({
  conwayStep,
  setConwayStep,
  edgeNodes
}) => {
  const GRID_COLS = 32;
  const GRID_ROWS = 20;

  const [grid, setGrid] = useState<ConwayCell[][]>(() => {
    const empty = createEmptyConwayGrid(GRID_COLS, GRID_ROWS);
    return applyPatternToGrid(empty, PRESET_PATTERNS['Glider'], 2, 2);
  });

  const [isRunning, setIsRunning] = useState(true);
  const [speedMs, setSpeedMs] = useState(300);
  const [selectedPattern, setSelectedPattern] = useState<string>('Glider');
  const [paintType, setPaintType] = useState<'alive' | 'quantum' | 'dead'>('alive');
  const [decisionFeed, setDecisionFeed] = useState<AutomatonDecision[]>([]);
  const [birthRuleInput, setBirthRuleInput] = useState('3');
  const [survivalRuleInput, setSurvivalRuleInput] = useState('2,3');

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Render Grid onto Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cellWidth = canvas.width / GRID_COLS;
    const cellHeight = canvas.height / GRID_ROWS;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw Grid Lines
    ctx.strokeStyle = 'rgba(30, 41, 59, 0.6)';
    ctx.lineWidth = 0.5;

    for (let x = 0; x <= GRID_COLS; x++) {
      ctx.beginPath();
      ctx.moveTo(x * cellWidth, 0);
      ctx.lineTo(x * cellWidth, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y <= GRID_ROWS; y++) {
      ctx.beginPath();
      ctx.moveTo(0, y * cellHeight);
      ctx.lineTo(canvas.width, y * cellHeight);
      ctx.stroke();
    }

    // Draw Cells
    for (let y = 0; y < GRID_ROWS; y++) {
      for (let x = 0; x < GRID_COLS; x++) {
        const cell = grid[y][x];
        if (cell.alive) {
          const cx = x * cellWidth;
          const cy = y * cellHeight;

          if (cell.type === 'quantum') {
            // Quantum Cell Glow
            ctx.fillStyle = '#a855f7';
            ctx.shadowColor = '#c084fc';
            ctx.shadowBlur = 8;
          } else if (cell.type === 'gateway') {
            ctx.fillStyle = '#14b8a6';
            ctx.shadowColor = '#2dd4bf';
            ctx.shadowBlur = 6;
          } else {
            ctx.fillStyle = '#06b6d4';
            ctx.shadowColor = '#22d3ee';
            ctx.shadowBlur = 6;
          }

          ctx.beginPath();
          ctx.roundRect(cx + 1, cy + 1, cellWidth - 2, cellHeight - 2, 3);
          ctx.fill();
          ctx.shadowBlur = 0; // Reset
        }
      }
    }
  }, [grid]);

  // Simulation Loop
  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => {
      handleStepForward();
    }, speedMs);

    return () => clearInterval(interval);
  }, [isRunning, speedMs, grid, birthRuleInput, survivalRuleInput, conwayStep]);

  // Step Forward
  const handleStepForward = () => {
    const birthRules = birthRuleInput.split(',').map(n => parseInt(n.trim())).filter(n => !isNaN(n));
    const survivalRules = survivalRuleInput.split(',').map(n => parseInt(n.trim())).filter(n => !isNaN(n));

    const rules = {
      ...DEFAULT_CONWAY_RULES,
      birthRule: birthRules.length ? birthRules : [3],
      survivalRule: survivalRules.length ? survivalRules : [2, 3]
    };

    const nextStep = conwayStep + 1;
    const result = stepConwayAutomaton(grid, rules, nextStep, edgeNodes);

    setGrid(result.nextGrid);
    setConwayStep(nextStep);

    if (result.decisions.length > 0) {
      setDecisionFeed(prev => [...result.decisions.slice(0, 3), ...prev].slice(0, 15));
    }
  };

  // Canvas Click Handler to Paint Cells
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor(((e.clientX - rect.left) / rect.width) * GRID_COLS);
    const y = Math.floor(((e.clientY - rect.top) / rect.height) * GRID_ROWS);

    if (x >= 0 && x < GRID_COLS && y >= 0 && y < GRID_ROWS) {
      setGrid(prev => {
        const next = prev.map(r => r.map(c => ({ ...c })));
        if (paintType === 'dead') {
          next[y][x].alive = false;
        } else {
          next[y][x].alive = true;
          next[y][x].type = paintType === 'quantum' ? 'quantum' : 'standard';
          next[y][x].energy = 90;
        }
        return next;
      });
    }
  };

  // Apply Selected Preset Pattern
  const handleApplyPreset = (patternName: string) => {
    setSelectedPattern(patternName);
    const empty = createEmptyConwayGrid(GRID_COLS, GRID_ROWS);
    const pattern = PRESET_PATTERNS[patternName] || PRESET_PATTERNS['Glider'];
    const updated = applyPatternToGrid(empty, pattern, 4, 4);
    setGrid(updated);
  };

  // Clear Grid
  const handleClear = () => {
    setGrid(createEmptyConwayGrid(GRID_COLS, GRID_ROWS));
    setIsRunning(false);
  };

  // Randomize Grid
  const handleRandomize = () => {
    const empty = createEmptyConwayGrid(GRID_COLS, GRID_ROWS);
    for (let y = 0; y < GRID_ROWS; y++) {
      for (let x = 0; x < GRID_COLS; x++) {
        if (Math.random() < 0.25) {
          empty[y][x].alive = true;
          empty[y][x].type = Math.random() < 0.2 ? 'quantum' : 'standard';
          empty[y][x].energy = 80;
        }
      }
    }
    setGrid(empty);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-md relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center space-x-2 text-amber-400 text-xs font-mono font-semibold uppercase tracking-wider mb-1">
              <Grid3X3 className="w-4 h-4 animate-spin-slow" />
              <span>Automaton Conway AI • Dynamic Decision Engine</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-100">Cellular Automaton Edge Control Matrix</h2>
            <p className="text-sm text-slate-400 max-w-2xl mt-1">
              Conway's Game of Life cellular dynamics mapping directly to edge computing load migration, PQC key updates, and resource allocation.
            </p>
          </div>

          {/* Quick Step & Status */}
          <div className="flex items-center gap-3">
            <div className="bg-slate-950 px-4 py-2 rounded-xl border border-slate-800 text-xs font-mono text-slate-300">
              Generation: <strong className="text-amber-300 text-sm">#{conwayStep}</strong>
            </div>

            <button
              onClick={() => setIsRunning(!isRunning)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer ${
                isRunning 
                  ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/20' 
                  : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/20'
              }`}
            >
              {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span>{isRunning ? 'Pause Engine' : 'Run Automaton'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Canvas + Control Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Canvas Visualizer (Span 2 cols) */}
        <div className="lg:col-span-2 bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <h3 className="font-bold text-slate-100 text-base">2D Cellular Mesh Canvas</h3>
            </div>

            {/* Pattern Presets */}
            <div className="flex items-center space-x-2 text-xs font-mono">
              <span className="text-slate-400 hidden sm:inline">Presets:</span>
              {Object.keys(PRESET_PATTERNS).map(name => (
                <button
                  key={name}
                  onClick={() => handleApplyPreset(name)}
                  className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-colors cursor-pointer ${
                    selectedPattern === name
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                  }`}
                >
                  {name}
                </button>
              ))}
            </div>
          </div>

          {/* Canvas Element */}
          <div className="relative rounded-xl overflow-hidden bg-slate-950 border border-slate-800 p-2">
            <canvas
              ref={canvasRef}
              width={640}
              height={400}
              onClick={handleCanvasClick}
              className="w-full h-[360px] cursor-crosshair block rounded-lg"
            />
          </div>

          {/* Canvas Bottom Tool Controls */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
            {/* Draw Paint Selector */}
            <div className="flex items-center space-x-2 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
              <span className="text-slate-400">Paint Mode:</span>
              <button
                onClick={() => setPaintType('alive')}
                className={`px-2 py-0.5 rounded text-[10px] font-bold ${paintType === 'alive' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400'}`}
              >
                Compute Cell
              </button>
              <button
                onClick={() => setPaintType('quantum')}
                className={`px-2 py-0.5 rounded text-[10px] font-bold ${paintType === 'quantum' ? 'bg-purple-500 text-slate-950' : 'text-slate-400'}`}
              >
                Quantum Cell
              </button>
              <button
                onClick={() => setPaintType('dead')}
                className={`px-2 py-0.5 rounded text-[10px] font-bold ${paintType === 'dead' ? 'bg-rose-500 text-slate-950' : 'text-slate-400'}`}
              >
                Erase
              </button>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center space-x-2">
              <button
                onClick={handleStepForward}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 font-semibold cursor-pointer"
              >
                <SkipForward className="w-3.5 h-3.5" />
                <span>Single Step</span>
              </button>

              <button
                onClick={handleRandomize}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-teal-300 font-semibold cursor-pointer"
              >
                Randomize
              </button>

              <button
                onClick={handleClear}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-rose-300 font-semibold cursor-pointer"
              >
                Clear
              </button>
            </div>
          </div>
        </div>

        {/* Automaton Decision Log & Rule Settings */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
            <Zap className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-slate-100 text-base">AI Decision Feed</h3>
          </div>

          {/* Rule Tweaker */}
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2 text-xs font-mono">
            <div className="text-slate-400 font-bold text-[11px] flex items-center gap-1">
              <Sliders className="w-3.5 h-3.5 text-cyan-400" />
              Automaton Rule Parameters
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] text-slate-400">Birth (B)</label>
                <input
                  type="text"
                  value={birthRuleInput}
                  onChange={e => setBirthRuleInput(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded p-1 text-slate-100 text-[11px]"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400">Survival (S)</label>
                <input
                  type="text"
                  value={survivalRuleInput}
                  onChange={e => setSurvivalRuleInput(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded p-1 text-slate-100 text-[11px]"
                />
              </div>
            </div>
          </div>

          {/* Real-Time Decision Feed */}
          <div className="space-y-2 font-mono text-xs max-h-[340px] overflow-y-auto pr-1">
            {decisionFeed.length === 0 ? (
              <div className="p-4 text-center text-slate-500 bg-slate-950 rounded-xl border border-slate-800/80">
                Run automaton or step forward to generate AI decision triggers.
              </div>
            ) : (
              decisionFeed.map((dec, i) => (
                <div key={i} className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className={`font-bold px-1.5 py-0.5 rounded text-[10px] ${
                      dec.actionType === 'MIGRATE_TASK' ? 'bg-amber-950 text-amber-400' :
                      dec.actionType === 'ROTATE_PQC_KEY' ? 'bg-purple-950 text-purple-400' :
                      'bg-cyan-950 text-cyan-400'
                    }`}>
                      {dec.actionType}
                    </span>
                    <span className="text-slate-500">{dec.timestamp}</span>
                  </div>
                  <div className="text-slate-200 font-sans font-medium text-[11px] mt-1">
                    {dec.details}
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono">
                    Pattern: {dec.patternDetected} (Conf: {(dec.confidence * 100).toFixed(0)}%)
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
