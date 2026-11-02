import React, { useState, useEffect } from 'react';
import {
  RegisterEngine,
  ShiftRegisterType,
  ShiftDirection,
  ShiftRegisterState
} from '../engine/registerEngine';
import {
  FastForward,
  Play,
  Pause,
  RotateCcw,
  Activity,
  ArrowRight,
  ArrowLeft,
  UploadCloud,
  History
} from 'lucide-react';

export const ShiftRegisterSimulator: React.FC = () => {
  const [regType, setRegType] = useState<ShiftRegisterType>('SIPO');
  const [direction, setDirection] = useState<ShiftDirection>('RIGHT');
  const [bitCount, setBitCount] = useState<number>(4);
  const [serialIn, setSerialIn] = useState<number>(1);
  const [parallelIn, setParallelIn] = useState<number[]>([1, 0, 1, 1]);
  const [mode, setMode] = useState<'SHIFT' | 'LOAD'>('SHIFT');
  const [isRunning, setIsRunning] = useState<boolean>(false);

  const [state, setState] = useState<ShiftRegisterState>(() =>
    RegisterEngine.getInitialState('SIPO', 4, 'RIGHT')
  );

  const handleTypeChange = (t: ShiftRegisterType) => {
    setRegType(t);
    setIsRunning(false);
    const initial = RegisterEngine.getInitialState(t, bitCount, direction);
    initial.serialIn = serialIn;
    initial.parallelIn = [...parallelIn];
    initial.mode = mode;
    setState(initial);
  };

  const handleDirectionChange = (d: ShiftDirection) => {
    setDirection(d);
    setState((prev) => ({ ...prev, direction: d }));
  };

  const handleTick = () => {
    setState((prev) => {
      const updated = {
        ...prev,
        serialIn,
        parallelIn,
        mode,
        direction
      };
      return RegisterEngine.tick(updated);
    });
  };

  const handleReset = () => {
    setIsRunning(false);
    const initial = RegisterEngine.getInitialState(regType, bitCount, direction);
    initial.serialIn = serialIn;
    initial.parallelIn = [...parallelIn];
    initial.mode = mode;
    setState(initial);
  };

  // Auto clock
  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => {
      handleTick();
    }, 800);
    return () => clearInterval(interval);
  }, [isRunning, regType, direction, serialIn, parallelIn, mode]);

  return (
    <div className="p-4 sm:p-6 max-w-6xl mx-auto space-y-4 sm:space-y-6 select-none">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
          <FastForward className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
          <span>Shift Register Simulator</span>
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          SISO, SIPO, PISO, and PIPO architectures with bidirectional shifting & parallel load
        </p>
      </div>

      {/* Register Type Tabs */}
      <div className="flex flex-wrap gap-2">
        {[
          { id: 'SISO', label: 'SISO (Serial-In Serial-Out)' },
          { id: 'SIPO', label: 'SIPO (Serial-In Parallel-Out)' },
          { id: 'PISO', label: 'PISO (Parallel-In Serial-Out)' },
          { id: 'PIPO', label: 'PIPO (Parallel-In Parallel-Out)' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTypeChange(tab.id as ShiftRegisterType)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              regType === tab.id
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Control Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-wrap">
          {/* Shift Direction */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
              Direction:
            </span>
            <button
              onClick={() => handleDirectionChange('RIGHT')}
              className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                direction === 'RIGHT'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              Shift Right <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => handleDirectionChange('LEFT')}
              className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                direction === 'LEFT'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Shift Left
            </button>
          </div>

          {/* Mode (for PISO) */}
          {regType === 'PISO' && (
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                Mode:
              </span>
              <button
                onClick={() => setMode('LOAD')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  mode === 'LOAD'
                    ? 'bg-amber-500 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600'
                }`}
              >
                Parallel Load
              </button>
              <button
                onClick={() => setMode('SHIFT')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  mode === 'SHIFT'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600'
                }`}
              >
                Serial Shift
              </button>
            </div>
          )}
        </div>

        {/* Pulse / Auto controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white transition-colors ${
              isRunning ? 'bg-amber-500 hover:bg-amber-600' : 'bg-emerald-600 hover:bg-emerald-700'
            }`}
          >
            {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            {isRunning ? 'Pause Clock' : 'Auto Clock'}
          </button>

          <button
            onClick={handleTick}
            className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition-colors"
          >
            <Activity className="w-3.5 h-3.5" /> Pulse Clock ↑
          </button>

          <button
            onClick={handleReset}
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 text-slate-500 transition-colors"
            title="Reset register"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Studio Workbench */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Interactive Hardware Representation */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/40 px-2 py-0.5 rounded">
                Register State
              </span>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white mt-1">
                4-Stage D Flip-Flop Register Array
              </h3>
            </div>
            <span className="text-xs font-mono font-bold text-slate-400">
              Clock Cycles: #{state.clockCycles}
            </span>
          </div>

          {/* Inputs Section */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4">
            {/* Serial In toggle */}
            {(regType === 'SISO' || regType === 'SIPO' || (regType === 'PISO' && mode === 'SHIFT')) && (
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                  Serial Input Bit
                </span>
                <button
                  onClick={() => setSerialIn(serialIn === 1 ? 0 : 1)}
                  className={`px-3 py-1.5 rounded-lg font-mono font-bold text-xs ${
                    serialIn === 1 ? 'bg-emerald-500 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600'
                  }`}
                >
                  Serial In = {serialIn}
                </button>
              </div>
            )}

            {/* Parallel Input toggles */}
            {(regType === 'PIPO' || regType === 'PISO') && (
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                  Parallel 4-Bit Bus (D0..D3)
                </span>
                <div className="flex items-center gap-1.5">
                  {parallelIn.map((bit, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        const copy = [...parallelIn];
                        copy[idx] = bit === 1 ? 0 : 1;
                        setParallelIn(copy);
                      }}
                      className={`w-8 h-8 rounded-lg font-mono text-xs font-bold ${
                        bit === 1 ? 'bg-blue-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600'
                      }`}
                    >
                      {bit}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Serial Output Display */}
            {(regType === 'SISO' || regType === 'PISO') && (
              <div className="text-right">
                <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                  Serial Out
                </span>
                <div
                  className={`w-9 h-9 rounded-full ml-auto flex items-center justify-center font-mono font-bold text-sm ${
                    state.serialOut === 1 ? 'bg-emerald-500 text-white led-glow-on' : 'bg-slate-300 dark:bg-slate-800 text-slate-500'
                  }`}
                >
                  {state.serialOut}
                </div>
              </div>
            )}
          </div>

          {/* Flip-Flop Stage LEDs */}
          <div className="p-8 bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-dashed border-slate-300 dark:border-slate-800 flex items-center justify-around">
            {state.bits.map((bit, idx) => (
              <div key={idx} className="text-center">
                <div
                  className={`w-14 h-14 rounded-full mx-auto flex items-center justify-center font-mono font-bold text-xl transition-all duration-200 ${
                    bit === 1
                      ? 'bg-emerald-500 text-white led-glow-on scale-105'
                      : 'bg-slate-300 dark:bg-slate-800 text-slate-500'
                  }`}
                >
                  {bit}
                </div>
                <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300 mt-2 block">
                  Stage Q{idx}
                </span>
              </div>
            ))}
          </div>

          {/* Readout */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
              Parallel Register Bus State:
            </span>
            <span className="font-mono text-lg font-extrabold text-blue-600 dark:text-blue-400">
              [{state.bits.join(' ')}]₂
            </span>
          </div>
        </div>

        {/* Right: History Log */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
            <History className="w-4 h-4 text-blue-500" />
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              Shift Register Step Log
            </h3>
          </div>

          <div className="space-y-1.5 max-h-80 overflow-y-auto">
            {state.history.map((h, i) => (
              <div
                key={i}
                className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60 text-xs font-mono flex items-center justify-between"
              >
                <div>
                  <span className="text-slate-400 mr-2">#{h.clock}</span>
                  <span className="font-bold text-blue-600 dark:text-blue-400">
                    [{h.bits.join(', ')}]
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 font-sans truncate max-w-[150px]">
                  {h.action}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

