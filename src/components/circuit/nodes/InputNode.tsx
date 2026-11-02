import { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { useCircuitStore } from '../../../store/circuitStore';
import { ToggleLeft, ToggleRight } from 'lucide-react';

export const InputNode = memo(({ id, data, selected }: NodeProps) => {
  const toggleSwitch = useCircuitStore((s: any) => s.toggleSwitchValue);
  const d = data as Record<string, any>;
  const type = d.type || 'SWITCH';
  const val = d.value === 1 ? 1 : 0;
  const isSwitch = type === 'SWITCH';

  return (
    <div
      className={`px-3 py-2 rounded-xl border transition-all duration-150 shadow-md min-w-[120px] ${
        selected
          ? 'border-blue-500 ring-2 ring-blue-500/30 bg-slate-900 text-white'
          : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100'
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="font-semibold text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            {type === 'CONST_0' ? 'Fixed 0' : type === 'CONST_1' ? 'Fixed 1' : 'Switch'}
          </div>
          <div className="text-xs font-medium text-slate-900 dark:text-slate-100">
            {String(d.label || 'Input')}
          </div>
        </div>

        {isSwitch ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleSwitch(id);
            }}
            className="flex items-center gap-1 cursor-pointer focus:outline-none"
            title="Click to toggle logic level"
          >
            {val === 1 ? (
              <ToggleRight className="w-7 h-7 text-emerald-500 transition-transform active:scale-95" />
            ) : (
              <ToggleLeft className="w-7 h-7 text-slate-400 transition-transform active:scale-95" />
            )}
            <span
              className={`font-mono font-bold text-xs px-1.5 py-0.5 rounded ${
                val === 1
                  ? 'bg-emerald-500 text-white'
                  : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              {val}
            </span>
          </button>
        ) : (
          <div
            className={`w-6 h-6 rounded-md flex items-center justify-center font-mono font-bold text-xs ${
              val === 1
                ? 'bg-emerald-500 text-white shadow-sm shadow-emerald-500/50'
                : 'bg-slate-300 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
            }`}
          >
            {val}
          </div>
        )}
      </div>

      {/* Output Handle */}
      <Handle
        type="source"
        position={Position.Right}
        id="out"
        className={`!w-3 !h-3 ${val === 1 ? '!bg-emerald-500' : '!bg-slate-400'}`}
        style={{ top: '50%' }}
      />
    </div>
  );
});
