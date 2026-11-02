import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { StorageUtil, AppStorageData, QuizAttempt } from '../utils/storage';
import { MODULES } from '../data/modules';
import { PRESET_CIRCUITS } from '../data/presetCircuits';
import { SavedCircuit } from '../types/circuit';
import {
  Cpu,
  Workflow,
  TableProperties,
  Binary,
  Grid,
  Share2,
  ToggleRight,
  GraduationCap,
  CheckSquare,
  ArrowRight,
  Sparkles,
  Play,
  Layers,
  History,
  Award
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [storageData, setStorageData] = useState<AppStorageData>(() => StorageUtil.loadData());

  useEffect(() => {
    setStorageData(StorageUtil.loadData());
  }, []);

  const savedCircuits = storageData.circuits;
  const quizAttempts = storageData.quizHistory;
  const recentModules = storageData.recentModules;

  // Calculate stats
  const totalCircuitsCount = savedCircuits.length + PRESET_CIRCUITS.length;
  const bestScore = quizAttempts.length > 0
    ? Math.max(...quizAttempts.map((q: QuizAttempt) => q.percentage))
    : 0;

  const quickTools = [
    {
      title: 'Logic Gate Simulator',
      desc: 'Simulate AND, OR, NOT, NAND, NOR, XOR, XNOR gates with binary switches.',
      icon: <Cpu className="w-5 h-5 text-blue-500" />,
      path: '/gates',
      badge: 'Core'
    },
    {
      title: 'Circuit Designer',
      desc: 'Drag & drop visual schematic editor with live topological wire propagation.',
      icon: <Workflow className="w-5 h-5 text-indigo-500" />,
      path: '/designer',
      badge: 'Interactive'
    },
    {
      title: 'K-Map Minimizer',
      desc: '2, 3, and 4-variable Karnaugh Maps with adjacent group highlighting.',
      icon: <Grid className="w-5 h-5 text-emerald-500" />,
      path: '/kmap-solver',
      badge: 'Solver'
    },
    {
      title: 'Combinational Logic & ALU',
      desc: 'Half/Full Adders, Subtractors, MUX, Demux, Decoders, CLA, and 4-bit ALU.',
      icon: <Share2 className="w-5 h-5 text-amber-500" />,
      path: '/combinational',
      badge: '14 Circuits'
    },
    {
      title: 'Flip-Flops & Multivibrators',
      desc: 'SR, JK, D, and T bistable elements with edge-triggered clock pulses.',
      icon: <ToggleRight className="w-5 h-5 text-pink-500" />,
      path: '/flip-flop',
      badge: 'Sequential'
    },
    {
      title: 'Semester III Quiz & Practice',
      desc: 'Topic-wise multiple choice quizzes with instant detailed textbook explanations.',
      icon: <CheckSquare className="w-5 h-5 text-purple-500" />,
      path: '/quiz',
      badge: 'Exam Prep'
    }
  ];

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6 sm:space-y-8 select-none">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white p-5 sm:p-8 shadow-lg shadow-blue-500/20">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-xs text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Semester III Digital Electronics Virtual Laboratory</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome to LogicLab Simulator
          </h1>
          <p className="mt-2 text-sm text-blue-100 leading-relaxed">
            A software-based digital electronics laboratory for computer engineering students.
            Simulate logic gates, design complex circuits with topological signal flow, minimize
            Boolean equations, and practice interactive university syllabus problems.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              onClick={() => navigate('/designer')}
              className="flex items-center gap-2 px-4 py-2 bg-white text-blue-600 hover:bg-blue-50 rounded-xl text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer"
            >
              <Workflow className="w-4 h-4" /> Open Circuit Designer
            </button>
            <button
              onClick={() => navigate('/learning')}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500/30 hover:bg-blue-500/40 text-white border border-white/20 rounded-xl text-xs font-semibold transition-all cursor-pointer"
            >
              <GraduationCap className="w-4 h-4" /> Syllabus & Notes
            </button>
          </div>
        </div>

        {/* Ambient background accent */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 flex items-center justify-center pointer-events-none">
          <Cpu className="w-72 h-72 text-white" />
        </div>
      </div>

      {/* Real Statistics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Total Modules</span>
            <Layers className="w-4 h-4 text-blue-500" />
          </div>
          <div className="font-mono font-bold text-2xl text-slate-900 dark:text-white">
            15
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Full curriculum coverage</p>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Available Gates</span>
            <Cpu className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="font-mono font-bold text-2xl text-slate-900 dark:text-white">
            7
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Basic, Universal & Special</p>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Available Schematics</span>
            <Workflow className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="font-mono font-bold text-2xl text-slate-900 dark:text-white">
            {totalCircuitsCount}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            {savedCircuits.length} user + {PRESET_CIRCUITS.length} presets
          </p>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Best Quiz Score</span>
            <Award className="w-4 h-4 text-amber-500" />
          </div>
          <div className="font-mono font-bold text-2xl text-slate-900 dark:text-white">
            {quizAttempts.length > 0 ? `${bestScore}%` : 'No attempts'}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            {quizAttempts.length} quizzes taken
          </p>
        </div>
      </div>

      {/* Quick Access Modules Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Primary Laboratory Tools
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Quick access to core digital electronics simulation workbenches
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickTools.map((tool) => (
            <div
              key={tool.title}
              onClick={() => navigate(tool.path)}
              className="group p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-blue-500/50 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 group-hover:scale-110 transition-transform">
                    {tool.icon}
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                    {tool.badge}
                  </span>
                </div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {tool.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  {tool.desc}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between text-xs font-semibold text-blue-600 dark:text-blue-400">
                <span>Launch Tool</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Section: Preset Schematics & Getting Started */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Preset & Recent Circuits */}
        <div className="lg:col-span-2 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                Featured Circuit Schematics
              </h3>
              <p className="text-xs text-slate-400">
                Load verified educational circuits into the Circuit Designer with one click
              </p>
            </div>
            <button
              onClick={() => navigate('/saved-circuits')}
              className="text-xs text-blue-600 dark:text-blue-400 font-semibold hover:underline"
            >
              View All ({totalCircuitsCount})
            </button>
          </div>

          <div className="space-y-2.5">
            {PRESET_CIRCUITS.map((circuit: SavedCircuit) => (
              <div
                key={circuit.id}
                onClick={() => navigate('/designer')}
                className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-500 bg-slate-50/50 dark:bg-slate-800/30 hover:bg-white dark:hover:bg-slate-800 transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-xs">
                    <Workflow className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-semibold text-xs text-slate-800 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {circuit.name}
                    </div>
                    <div className="text-[11px] text-slate-400 line-clamp-1">
                      {circuit.description}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-xs">
                  <span className="font-mono text-[11px] text-slate-400">
                    {circuit.nodes.length} nodes · {circuit.edges.length} wires
                  </span>
                  <Play className="w-4 h-4 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Getting Started Guide */}
        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-1">
              Lab Getting Started
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Tips for Semester III practical sessions
            </p>

            <ol className="space-y-3 text-xs text-slate-600 dark:text-slate-300">
              <li className="flex gap-2.5">
                <span className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 font-bold flex items-center justify-center shrink-0 text-[10px]">
                  1
                </span>
                <span>
                  Start with the <strong>Logic Gate Simulator</strong> to inspect truth tables for all 7 gates.
                </span>
              </li>
              <li className="flex gap-2.5">
                <span className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 font-bold flex items-center justify-center shrink-0 text-[10px]">
                  2
                </span>
                <span>
                  Build custom circuits in <strong>Circuit Designer</strong> by dragging switches, gates, and LEDs.
                </span>
              </li>
              <li className="flex gap-2.5">
                <span className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 font-bold flex items-center justify-center shrink-0 text-[10px]">
                  3
                </span>
                <span>
                  Minimize Boolean functions using the <strong>K-Map Solver</strong> to get optimal SOP and POS equations.
                </span>
              </li>
              <li className="flex gap-2.5">
                <span className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 font-bold flex items-center justify-center shrink-0 text-[10px]">
                  4
                </span>
                <span>
                  Verify knowledge with the <strong>Quiz & Practice</strong> module before exams.
                </span>
              </li>
            </ol>
          </div>

          <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={() => navigate('/learning')}
              className="w-full py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
            >
              <GraduationCap className="w-3.5 h-3.5" /> Open Learning Centre
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
