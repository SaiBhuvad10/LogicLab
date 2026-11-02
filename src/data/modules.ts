export interface NavModule {
  id: string;
  name: string;
  path: string;
  icon: string;
  description: string;
  category: 'Overview' | 'Core Tools' | 'Circuits' | 'Sequential' | 'Education' | 'Preferences';
  badge?: string;
}

export const MODULES: NavModule[] = [
  {
    id: 'dashboard',
    name: 'Dashboard',
    path: '/',
    icon: 'LayoutDashboard',
    description: 'System metrics, quick access cards, and laboratory overview.',
    category: 'Overview'
  },
  {
    id: 'gates',
    name: 'Logic Gate Simulator',
    path: '/gates',
    icon: 'Cpu',
    description: 'Interactive AND, OR, NOT, NAND, NOR, XOR, and XNOR gates.',
    category: 'Core Tools'
  },
  {
    id: 'designer',
    name: 'Circuit Designer',
    path: '/designer',
    icon: 'Workflow',
    description: 'Full drag-and-drop schematic canvas with live simulation.',
    category: 'Core Tools',
    badge: 'Pro'
  },
  {
    id: 'truth-table',
    name: 'Truth Table Generator',
    path: '/truth-table',
    icon: 'TableProperties',
    description: 'Evaluate up to 4 variables, minterms, and export CSV.',
    category: 'Core Tools'
  },
  {
    id: 'boolean-solver',
    name: 'Boolean Algebra Solver',
    path: '/boolean-solver',
    icon: 'Binary',
    description: 'Step-by-step law minimization, SOP and POS canonical forms.',
    category: 'Core Tools'
  },
  {
    id: 'kmap-solver',
    name: 'K-Map Solver',
    path: '/kmap-solver',
    icon: 'Grid',
    description: '2, 3, and 4-variable Karnaugh map minimization with grouping.',
    category: 'Core Tools'
  },
  {
    id: 'number-system',
    name: 'Number System Converter',
    path: '/number-system',
    icon: 'Calculator',
    description: 'Radix conversions, 1\'s/2\'s complement, and binary arithmetic.',
    category: 'Core Tools'
  },
  {
    id: 'combinational',
    name: 'Combinational Circuits',
    path: '/combinational',
    icon: 'Share2',
    description: 'Adders, subtractors, MUX, DEMUX, decoders, CLA, and ALU.',
    category: 'Circuits'
  },
  {
    id: 'flip-flop',
    name: 'Flip-Flop Simulator',
    path: '/flip-flop',
    icon: 'ToggleRight',
    description: 'Edge-triggered SR, JK, D, and T bistable multivibrators.',
    category: 'Sequential'
  },
  {
    id: 'counter',
    name: 'Counter Simulator',
    path: '/counter',
    icon: 'Timer',
    description: 'Async, sync, Mod-N, ring, and Johnson binary counters.',
    category: 'Sequential'
  },
  {
    id: 'shift-register',
    name: 'Shift Registers',
    path: '/shift-register',
    icon: 'FastForward',
    description: 'SISO, SIPO, PISO, and PIPO bidirectional registers.',
    category: 'Sequential'
  },
  {
    id: 'learning',
    name: 'Learning Centre',
    path: '/learning',
    icon: 'GraduationCap',
    description: 'Semester III digital electronics syllabus, theory, and guides.',
    category: 'Education'
  },
  {
    id: 'quiz',
    name: 'Quiz & Practice',
    path: '/quiz',
    icon: 'CheckSquare',
    description: 'Topic-wise MCQs, instant explanations, and performance tracking.',
    category: 'Education'
  },
  {
    id: 'saved-circuits',
    name: 'Saved Circuits',
    path: '/saved-circuits',
    icon: 'FolderHeart',
    description: 'Manage, duplicate, import, and export saved schematic files.',
    category: 'Preferences'
  },
  {
    id: 'settings',
    name: 'Settings',
    path: '/settings',
    icon: 'Settings',
    description: 'Themes, simulation engine parameters, and app storage.',
    category: 'Preferences'
  }
];

