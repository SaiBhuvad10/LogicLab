import { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { GATE_DEFINITIONS } from '../../../engine/gateEngine';
import { GateId } from '../../../types/gates';

export const GateNode = memo(({ data, selected }: NodeProps) => {
  const d = data as Record<string, any>;
  const gateType = (d.type || 'AND') as GateId;
  const def = GATE_DEFINITIONS[gateType] || GATE_DEFINITIONS['AND'];
  const isUnary = gateType === 'NOT';
  const outVal = d.output ?? 0;

  return (
    <div
      className={`px-3 py-2.5 rounded-xl border transition-all duration-150 shadow-md min-w-[130px] ${
        selected
          ? 'border-blue-500 ring-2 ring-blue-500/30 bg-slate-900 text-white'
          : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100'
      }`}
    >
      {/* Input Handles */}
      {isUnary ? (
        <Handle
          type="target"
          position={Position.Left}
          id="in_0"
          className="!bg-blue-500 !w-3 !h-3"
          style={{ top: '50%' }}
        />
      ) : (
        <>
          <Handle
            type="target"
            position={Position.Left}
            id="in_0"
            className="!bg-blue-500 !w-3 !h-3"
            style={{ top: '30%' }}
          />
          <Handle
            type="target"
            position={Position.Left}
            id="in_1"
            className="!bg-blue-500 !w-3 !h-3"
            style={{ top: '70%' }}
          />
        </>
      )}

      {/* Node Body */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="font-bold text-sm tracking-wide text-blue-600 dark:text-blue-400">
            {def.id}
          </div>
          <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
            {String(d.label || def.name)}
          </div>
        </div>

        {/* Output Pill */}
        <div
          className={`w-6 h-6 rounded-md flex items-center justify-center font-mono font-bold text-xs transition-colors ${
            outVal === 1
              ? 'bg-emerald-500 text-white shadow-sm shadow-emerald-500/50'
              : 'bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
          }`}
        >
          {String(outVal)}
        </div>
      </div>

      {/* Output Handle */}
      <Handle
        type="source"
        position={Position.Right}
        id="out"
        className={`!w-3 !h-3 transition-colors ${
          outVal === 1 ? '!bg-emerald-500' : '!bg-slate-400'
        }`}
        style={{ top: '50%' }}
      />
    </div>
  );
});
