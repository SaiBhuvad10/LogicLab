import { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Activity } from 'lucide-react';

export const ClockNode = memo(({ data, selected }: NodeProps) => {
  const d = data as Record<string, any>;
  const outVal = d.output === 1 ? 1 : 0;
  const freq = d.frequency || 1;

  return (
    <div
      className={`px-3 py-2.5 rounded-xl border transition-all duration-150 shadow-md min-w-[130px] ${
        selected
          ? 'border-blue-500 ring-2 ring-blue-500/30 bg-slate-900 text-white'
          : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100'
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className={`p-1 rounded-lg ${outVal === 1 ? 'bg-blue-500/20 text-blue-500' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
            <Activity className={`w-4 h-4 ${outVal === 1 ? 'animate-pulse' : ''}`} />
          </div>
          <div>
            <div className="font-bold text-xs text-blue-600 dark:text-blue-400">CLK</div>
            <div className="text-[10px] text-slate-400 font-mono">{String(freq)} Hz</div>
          </div>
        </div>

        <div
          className={`w-6 h-6 rounded-md flex items-center justify-center font-mono font-bold text-xs ${
            outVal === 1 ? 'bg-blue-600 text-white shadow-sm' : 'bg-slate-200 dark:bg-slate-800 text-slate-400'
          }`}
        >
          {String(outVal)}
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Right}
        id="out"
        className={`!w-3 !h-3 ${outVal === 1 ? '!bg-blue-500' : '!bg-slate-400'}`}
        style={{ top: '50%' }}
      />
    </div>
  );
});
