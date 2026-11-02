import { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';

export const OutputNode = memo(({ data, selected }: NodeProps) => {
  const d = data as Record<string, any>;
  const type = d.type || 'LED';
  const outVal = d.output === 1 ? 1 : 0;
  const isLed = type === 'LED';

  return (
    <div
      className={`px-3 py-2.5 rounded-xl border transition-all duration-150 shadow-md min-w-[120px] ${
        selected
          ? 'border-blue-500 ring-2 ring-blue-500/30 bg-slate-900 text-white'
          : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100'
      }`}
    >
      {/* Input Handle */}
      <Handle
        type="target"
        position={Position.Left}
        id="in"
        className={`!w-3 !h-3 ${outVal === 1 ? '!bg-emerald-500' : '!bg-slate-400'}`}
        style={{ top: '50%' }}
      />

      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
            {String(type)}
          </div>
          <div className="text-xs font-medium text-slate-900 dark:text-slate-100">
            {String(d.label || 'Output')}
          </div>
        </div>

        {isLed ? (
          <div className="flex items-center gap-1.5">
            <div
              className={`w-6 h-6 rounded-full border-2 border-white/20 transition-all duration-200 ${
                outVal === 1
                  ? 'bg-emerald-500 led-glow-on scale-105'
                  : 'bg-slate-300 dark:bg-slate-800 led-glow-off'
              }`}
            />
            <span className="font-mono text-xs font-bold">{outVal}</span>
          </div>
        ) : (
          <div className="text-right">
            <div
              className={`font-mono font-bold text-sm px-2 py-0.5 rounded ${
                outVal === 1
                  ? 'bg-emerald-500 text-white shadow-sm'
                  : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              {outVal} ({outVal === 1 ? '+5V' : '0V'})
            </div>
          </div>
        )}
      </div>
    </div>
  );
});
