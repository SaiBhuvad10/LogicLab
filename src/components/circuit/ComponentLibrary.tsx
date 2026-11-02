import React from 'react';
import { CircuitNodeType } from '../../types/circuit';
import { useCircuitStore } from '../../store/circuitStore';
import {
  ToggleRight,
  Clock,
  Lightbulb,
  Radio,
  Eye,
  Plus,
  X
} from 'lucide-react';

interface ComponentItem {
  type: CircuitNodeType;
  label: string;
  category: 'INPUT' | 'GATES' | 'OUTPUT';
  icon: React.ReactNode;
  description: string;
}

const COMPONENTS: ComponentItem[] = [
  // INPUT
  {
    type: 'SWITCH',
    label: 'Toggle Switch',
    category: 'INPUT',
    icon: <ToggleRight className="w-4 h-4 text-emerald-500" />,
    description: 'Interactive binary switch (0 or 1)'
  },
  {
    type: 'CONST_0',
    label: 'Logic 0 (GND)',
    category: 'INPUT',
    icon: <span className="font-mono font-bold text-xs text-slate-500">0</span>,
    description: 'Constant LOW voltage level'
  },
  {
    type: 'CONST_1',
    label: 'Logic 1 (VCC)',
    category: 'INPUT',
    icon: <span className="font-mono font-bold text-xs text-emerald-500">1</span>,
    description: 'Constant HIGH voltage level'
  },
  {
    type: 'CLOCK',
    label: 'Clock Generator',
    category: 'INPUT',
    icon: <Clock className="w-4 h-4 text-blue-500" />,
    description: 'Periodic square wave pulse train'
  },

  // GATES
  {
    type: 'AND',
    label: 'AND Gate',
    category: 'GATES',
    icon: <span className="font-bold text-xs text-blue-600">AND</span>,
    description: 'Outputs 1 if all inputs are 1'
  },
  {
    type: 'OR',
    label: 'OR Gate',
    category: 'GATES',
    icon: <span className="font-bold text-xs text-blue-600">OR</span>,
    description: 'Outputs 1 if any input is 1'
  },
  {
    type: 'NOT',
    label: 'NOT Inverter',
    category: 'GATES',
    icon: <span className="font-bold text-xs text-blue-600">NOT</span>,
    description: 'Single-input inversion: 1-A'
  },
  {
    type: 'NAND',
    label: 'NAND Gate',
    category: 'GATES',
    icon: <span className="font-bold text-xs text-indigo-600">NAND</span>,
    description: 'Universal gate: NOT(AND)'
  },
  {
    type: 'NOR',
    label: 'NOR Gate',
    category: 'GATES',
    icon: <span className="font-bold text-xs text-indigo-600">NOR</span>,
    description: 'Universal gate: NOT(OR)'
  },
  {
    type: 'XOR',
    label: 'XOR Gate',
    category: 'GATES',
    icon: <span className="font-bold text-xs text-purple-600">XOR</span>,
    description: 'Outputs 1 if inputs are unequal'
  },
  {
    type: 'XNOR',
    label: 'XNOR Gate',
    category: 'GATES',
    icon: <span className="font-bold text-xs text-purple-600">XNOR</span>,
    description: 'Outputs 1 if inputs are equal'
  },

  // OUTPUT
  {
    type: 'LED',
    label: 'LED Indicator',
    category: 'OUTPUT',
    icon: <Lightbulb className="w-4 h-4 text-amber-500" />,
    description: 'Visual indicator: glows green on HIGH'
  },
  {
    type: 'DISPLAY',
    label: 'Logic Probe',
    category: 'OUTPUT',
    icon: <Eye className="w-4 h-4 text-cyan-500" />,
    description: 'Digital voltage readout (+5V / 0V)'
  },
  {
    type: 'PROBE',
    label: 'Binary Display',
    category: 'OUTPUT',
    icon: <Radio className="w-4 h-4 text-emerald-500" />,
    description: 'Digital logic bit monitor'
  }
];

export interface ComponentLibraryProps {
  onClose?: () => void;
  onItemAdded?: () => void;
  isMobileDrawer?: boolean;
}

export const ComponentLibrary: React.FC<ComponentLibraryProps> = ({
  onClose,
  onItemAdded,
  isMobileDrawer = false
}) => {
  const addNode = useCircuitStore((s) => s.addNode);

  const onDragStart = (e: React.DragEvent, type: CircuitNodeType, label: string) => {
    e.dataTransfer.setData('application/reactflow', JSON.stringify({ type, label }));
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleQuickAdd = (type: CircuitNodeType, label: string) => {
    const randomPos = {
      x: 180 + Math.floor(Math.random() * 80) * 2,
      y: 120 + Math.floor(Math.random() * 80) * 2
    };
    addNode(type, randomPos, label);
    if (onItemAdded) {
      onItemAdded();
    }
  };

  const categories = ['INPUT', 'GATES', 'OUTPUT'] as const;

  return (
    <aside
      className={`${
        isMobileDrawer ? 'w-full' : 'w-64 border-r border-slate-200 dark:border-slate-800'
      } bg-white dark:bg-slate-900 flex flex-col h-full overflow-hidden select-none`}
    >
      <div className="p-3.5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-sm text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <span>Component Library</span>
            <span className="text-[10px] bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-full font-mono">
              {COMPONENTS.length}
            </span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {isMobileDrawer ? 'Tap any component to add to canvas' : 'Drag to canvas or click (+) to add'}
          </p>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Close Drawer"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {categories.map((category) => (
          <div key={category}>
            <div className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1.5 px-1">
              {category}
            </div>
            <div className="space-y-1.5">
              {COMPONENTS.filter((c) => c.category === category).map((comp) => (
                <div
                  key={comp.type}
                  draggable={!isMobileDrawer}
                  onDragStart={(e) => onDragStart(e, comp.type, comp.label)}
                  onClick={() => handleQuickAdd(comp.type, comp.label)}
                  className="group flex items-center justify-between p-2 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-500 bg-slate-50/60 dark:bg-slate-800/40 hover:bg-white dark:hover:bg-slate-800 cursor-pointer lg:cursor-grab active:cursor-grabbing transition-all shadow-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-6 h-6 rounded flex items-center justify-center bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600">
                      {comp.icon}
                    </div>
                    <div>
                      <div className="text-xs font-medium text-slate-700 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                        {comp.label}
                      </div>
                      <div className="text-[10px] text-slate-400 line-clamp-1">
                        {comp.description}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleQuickAdd(comp.type, comp.label);
                    }}
                    className="p-1 rounded bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 text-blue-600 dark:text-blue-400 opacity-80 group-hover:opacity-100 transition-opacity"
                    title={`Add ${comp.label}`}
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
};

