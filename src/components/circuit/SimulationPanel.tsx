import React, { useState } from 'react';
import { useCircuitStore } from '../../store/circuitStore';
import {
  Play,
  Pause,
  RotateCcw,
  StepForward,
  AlertTriangle,
  CheckCircle,
  Activity,
  ChevronUp,
  ChevronDown
} from 'lucide-react';

export const SimulationPanel: React.FC = () => {
  const {
    isSimulating,
    runSimulation,
    stopSimulation,
    stepSimulation,
    resetSimulation,
    simulationResult,
    clockTick,
    nodes
  } = useCircuitStore();

  const [expanded, setExpanded] = useState(true);

  const outputNodes = nodes.filter(
    (n) => n.data.type === 'LED' || n.data.type === 'PROBE' || n.data.type === 'DISPLAY'
  );

  return (
    <div className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 transition-all duration-200 shadow-lg">
      {/* Top Header / Bar */}
      <div className="px-3 sm:px-4 py-2 flex items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800/60 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <div className="flex items-center gap-1 sm:gap-1.5">
            <button
              onClick={() => (isSimulating ? stopSimulation() : runSimulation())}
              className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 rounded-lg font-medium text-xs transition-colors cursor-pointer shrink-0 ${
                isSimulating
                  ? 'bg-amber-500 hover:bg-amber-600 text-white'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white'
              }`}
            >
              {isSimulating ? (
                <>
                  <Pause className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Pause</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Run Simulation</span>
                </>
              )}
            </button>

            <button
              onClick={stepSimulation}
              className="flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-medium transition-colors cursor-pointer shrink-0"
              title="Step forward one tick"
            >
              <StepForward className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Step</span>
            </button>

            <button
              onClick={resetSimulation}
              className="flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-medium transition-colors cursor-pointer shrink-0"
              title="Reset simulation tick"
            >
              <RotateCcw className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Reset</span>
            </button>
          </div>

          <div className="hidden sm:block h-4 w-px bg-slate-200 dark:bg-slate-700 mx-0.5" />

          {/* Engine Status Indicator */}
          <div className="flex items-center gap-2 sm:gap-3 text-xs shrink-0">
            {simulationResult.hasCycles ? (
              <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400 font-medium text-[11px] sm:text-xs">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate max-w-[90px] sm:max-w-none">Feedback Loop</span>
              </span>
            ) : simulationResult.missingInputs.length > 0 ? (
              <span className="flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium text-[11px] sm:text-xs">
                <Activity className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate max-w-[90px] sm:max-w-none">{simulationResult.missingInputs.length} Floating</span>
              </span>
            ) : (
              <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium text-[11px] sm:text-xs">
                <CheckCircle className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate max-w-[100px] sm:max-w-none">Engine Ready</span>
              </span>
            )}

            <span className="text-slate-400 font-mono text-[10px] sm:text-[11px] hidden md:inline">
              Tick: {clockTick} | Latency: {simulationResult.simulationTimeMs.toFixed(2)}ms
            </span>
          </div>
        </div>

        {/* Right side: quick output indicators on mobile + collapse toggle */}
        <div className="flex items-center gap-2 shrink-0">
          {outputNodes.length > 0 && !expanded && (
            <div className="flex items-center gap-1">
              {outputNodes.slice(0, 3).map((node) => {
                const val = simulationResult.nodeOutputs[node.id] ?? 0;
                return (
                  <span
                    key={node.id}
                    className={`font-mono text-[10px] px-1.5 py-0.5 rounded font-bold ${
                      val === 1
                        ? 'bg-emerald-500 text-white'
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {String(node.data.label || 'Out')[0]}:{val}
                  </span>
                );
              })}
            </div>
          )}

          <button
            onClick={() => setExpanded(!expanded)}
            className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title={expanded ? 'Collapse Outputs' : 'Expand Outputs'}
          >
            {expanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Expanded Content Drawer */}
      {expanded && (
        <div className="p-3.5 max-h-36 overflow-y-auto">
          {outputNodes.length === 0 ? (
            <p className="text-xs text-slate-400 italic">
              No output indicators connected yet. Drag an LED or Logic Probe from the component library.
            </p>
          ) : (
            <div className="flex items-center gap-4 flex-wrap">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Outputs:
              </span>
              {outputNodes.map((node) => {
                const val = simulationResult.nodeOutputs[node.id] ?? 0;
                return (
                  <div
                    key={node.id}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50"
                  >
                    <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                      {String(node.data.label || 'Output')}:
                    </span>
                    <span
                      className={`font-mono font-bold text-xs px-2 py-0.5 rounded ${
                        val === 1
                          ? 'bg-emerald-500 text-white shadow-xs'
                          : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      {String(val)}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
