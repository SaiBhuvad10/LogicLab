import React from 'react';
import { useCircuitStore } from '../../store/circuitStore';
import { GATE_DEFINITIONS } from '../../engine/gateEngine';
import { GateId } from '../../types/gates';
import {
  Trash2,
  Copy,
  Info,
  CheckCircle2,
  AlertTriangle,
  Sliders,
  X
} from 'lucide-react';

export interface PropertiesPanelProps {
  onClose?: () => void;
  isMobileDrawer?: boolean;
}

export const PropertiesPanel: React.FC<PropertiesPanelProps> = ({
  onClose,
  isMobileDrawer = false
}) => {
  const {
    nodes,
    edges,
    selectedNodeId,
    updateNodeData,
    deleteSelected,
    duplicateSelected,
    simulationResult
  } = useCircuitStore();

  const selectedNode = nodes.find((n) => n.id === selectedNodeId);

  if (!selectedNode) {
    return (
      <aside
        className={`${
          isMobileDrawer ? 'w-full' : 'w-72 border-l border-slate-200 dark:border-slate-800'
        } bg-white dark:bg-slate-900 flex flex-col h-full overflow-y-auto p-4 select-none`}
      >
        <div className="flex items-center justify-between text-slate-500 mb-4 pb-3 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-blue-500" />
            <h3 className="font-semibold text-sm text-slate-800 dark:text-slate-100">
              Inspector
            </h3>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Close Inspector"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        <div className="text-center py-6 px-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 mb-4">
          <Sliders className="w-8 h-8 mx-auto text-slate-400 mb-2" />
          <p className="text-xs font-medium text-slate-600 dark:text-slate-300">
            No component selected
          </p>
          <p className="text-[11px] text-slate-400 mt-1">
            Click on any gate, switch, or output on the canvas to inspect and configure properties.
          </p>
        </div>

        {/* Circuit Stats Summary */}
        <div className="space-y-3">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Circuit Statistics
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800">
              <div className="text-slate-400 text-[10px]">Total Nodes</div>
              <div className="font-mono font-bold text-base text-slate-800 dark:text-slate-100">
                {nodes.length}
              </div>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800">
              <div className="text-slate-400 text-[10px]">Active Wires</div>
              <div className="font-mono font-bold text-base text-slate-800 dark:text-slate-100">
                {edges.length}
              </div>
            </div>
          </div>

          <div className="mt-4 p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
            <div className="flex items-center gap-2 text-xs font-semibold mb-1">
              {simulationResult.hasCycles ? (
                <>
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                  <span className="text-amber-600 dark:text-amber-400">Feedback Loop Detected</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span className="text-emerald-600 dark:text-emerald-400">Valid Combinational DAG</span>
                </>
              )}
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              {simulationResult.hasCycles
                ? 'Circuit contains combinational feedback cycles. Signals cannot be ordered topologically.'
                : 'All paths are loop-free. Signals propagate predictably from primary inputs to outputs.'}
            </p>
          </div>
        </div>
      </aside>
    );
  }

  const nodeData = selectedNode.data as Record<string, any>;
  const nodeType = String(nodeData.type || 'AND');
  const isGate = ['AND', 'OR', 'NOT', 'NAND', 'NOR', 'XOR', 'XNOR'].includes(nodeType);
  const gateDef = isGate ? GATE_DEFINITIONS[nodeType as GateId] : null;

  return (
    <aside
      className={`${
        isMobileDrawer ? 'w-full' : 'w-72 border-l border-slate-200 dark:border-slate-800'
      } bg-white dark:bg-slate-900 flex flex-col h-full overflow-y-auto p-4 select-none`}
    >
      <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800 mb-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/40 px-2 py-0.5 rounded">
            {nodeType}
          </span>
          <h3 className="font-semibold text-sm text-slate-800 dark:text-slate-100 mt-1">
            Component Properties
          </h3>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={duplicateSelected}
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
            title="Duplicate node"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={deleteSelected}
            className="p-1.5 rounded-lg border border-red-200 dark:border-red-900/40 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
            title="Delete node"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ml-1"
              title="Close Inspector"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      <div className="space-y-4">
        {/* Label input */}
        <div>
          <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
            Component Label
          </label>
          <input
            type="text"
            value={String(nodeData.label || '')}
            onChange={(e) => updateNodeData(selectedNode.id, { label: e.target.value })}
            className="w-full px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
          />
        </div>

        {/* Logic State display */}
        <div>
          <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
            Current Output State
          </label>
          <div className="flex items-center gap-2">
            <span
              className={`font-mono font-bold text-sm px-2.5 py-1 rounded-md ${
                nodeData.output === 1
                  ? 'bg-emerald-500 text-white'
                  : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              LOGIC {String(nodeData.output ?? 0)}
            </span>
            <span className="text-xs text-slate-400">
              ({nodeData.output === 1 ? 'HIGH / +5V' : 'LOW / 0V'})
            </span>
          </div>
        </div>

        {/* Node-specific configurations */}
        {nodeType === 'SWITCH' && (
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
              Switch Value
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => updateNodeData(selectedNode.id, { value: 0 })}
                className={`py-1.5 text-xs font-bold rounded-lg border transition-colors ${
                  nodeData.value === 0
                    ? 'bg-slate-800 text-white border-slate-800 dark:bg-slate-700'
                    : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                0 (LOW)
              </button>
              <button
                onClick={() => updateNodeData(selectedNode.id, { value: 1 })}
                className={`py-1.5 text-xs font-bold rounded-lg border transition-colors ${
                  nodeData.value === 1
                    ? 'bg-emerald-600 text-white border-emerald-600'
                    : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                1 (HIGH)
              </button>
            </div>
          </div>
        )}

        {nodeType === 'CLOCK' && (
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-medium text-slate-600 dark:text-slate-300">
                Frequency
              </label>
              <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400">
                {String(nodeData.frequency || 1)} Hz
              </span>
            </div>
            <input
              type="range"
              min="0.5"
              max="5"
              step="0.5"
              value={Number(nodeData.frequency || 1)}
              onChange={(e) =>
                updateNodeData(selectedNode.id, { frequency: parseFloat(e.target.value) })
              }
              className="w-full accent-blue-600"
            />
          </div>
        )}

        {/* Gate info details & mini truth table */}
        {gateDef && (
          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-3">
            <div>
              <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                Boolean Expression
              </div>
              <div className="font-mono font-bold text-sm text-blue-600 dark:text-blue-400 mt-0.5">
                {gateDef.expression}
              </div>
            </div>

            <div>
              <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1">
                Truth Table
              </div>
              <table className="w-full text-center text-xs font-mono border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden">
                <thead className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  <tr>
                    {gateDef.inputCount === 1 ? (
                      <th>A</th>
                    ) : (
                      <>
                        <th>A</th>
                        <th>B</th>
                      </>
                    )}
                    <th>Y</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {gateDef.truthTable.inputs.map((inRow, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      {inRow.map((val, cIdx) => (
                        <td key={cIdx} className="py-1">
                          {val}
                        </td>
                      ))}
                      <td className="py-1 font-bold text-blue-600 dark:text-blue-400">
                        {gateDef.truthTable.outputs[idx]}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              {gateDef.details}
            </p>
          </div>
        )}
      </div>
    </aside>
  );
};
