import React, { useState, useEffect } from 'react';
import { CounterEngine, CounterType, CounterState } from '../engine/counterEngine';
import {
  Timer,
  Play,
  Pause,
  RotateCcw,
  Activity,
  History,
  BookOpen
} from 'lucide-react';

export const CounterSimulator: React.FC = () => {
  const [counterType, setCounterType] = useState<CounterType>('ASYNC_UP');
  const [bitCount, setBitCount] = useState<number>(4);
  const [modN, setModN] = useState<number>(10);
  const [isRunning, setIsRunning] = useState<boolean>(false);

  const [state, setState] = useState<CounterState>(() =>
    CounterEngine.getInitialState('ASYNC_UP', 4, 10)
  );

  const handleTypeChange = (type: CounterType) => {
    setCounterType(type);
    setIsRunning(false);
    setState(CounterEngine.getInitialState(type, bitCount, modN));
  };

  const handleBitChange = (bits: number) => {
    setBitCount(bits);
    setIsRunning(false);
    setState(CounterEngine.getInitialState(counterType, bits, modN));
  };

  const handleModChange = (n: number) => {
    setModN(n);
    setIsRunning(false);
    setState(CounterEngine.getInitialState(counterType, bitCount, n));
  };

  const handleTick = () => {
    setState((prev) => CounterEngine.tick(prev));
  };

  const handleReset = () => {
    setIsRunning(false);
    setState(CounterEngine.getInitialState(counterType, bitCount, modN));
  };

  // Auto timer
  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => {
      handleTick();
    }, 700);
    return () => clearInterval(interval);
  }, [isRunning, counterType, bitCount, modN]);

  const sequence = CounterEngine.getSequence(counterType, bitCount, modN);

  return (
    <div className="p-4 sm:p-6 max-w-6xl mx-auto space-y-4 sm:space-y-6 select-none">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
          <Timer className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
          <span>Digital Counter Simulator</span>
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Ripple and synchronous up/down counters, Mod-N reset logic, ring, and Johnson sequences
        </p>
      </div>

      {/* Counter Type Tabs */}
      <div className="flex flex-wrap gap-2">
        {[
          { id: 'ASYNC_UP', label: 'Async Up (Ripple)' },
          { id: 'ASYNC_DOWN', label: 'Async Down' },
          { id: 'SYNC_UP', label: 'Synchronous Up' },
          { id: 'SYNC_DOWN', label: 'Synchronous Down' },
          { id: 'MOD_N', label: `Mod-${modN} Counter` },
          { id: 'RING', label: 'Ring Counter' },
          { id: 'JOHNSON', label: 'Johnson (Twisted Ring)' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTypeChange(tab.id as CounterType)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              counterType === tab.id
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Control Bar: Bit width, Mod-N input, Pulse buttons */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-wrap">
          {/* Bit Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
              Flip-Flops:
            </span>
            {[2, 3, 4].map((b) => (
              <button
                key={b}
                onClick={() => handleBitChange(b)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  bitCount === b
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                }`}
              >
                {b} Bits
              </button>
            ))}
          </div>

          {/* Mod-N selector */}
          {counterType === 'MOD_N' && (
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                Modulus (N):
              </span>
              <input
                type="number"
                min="2"
                max={1 << bitCount}
                value={modN}
                onChange={(e) => handleModChange(Math.max(2, Math.min(1 << bitCount, parseInt(e.target.value) || 2)))}
                className="w-16 px-2.5 py-1 text-xs font-mono font-bold bg-slate-50 dark:bg-slate-800 border rounded-lg"
              />
            </div>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white transition-colors ${
              isRunning ? 'bg-amber-500 hover:bg-amber-600' : 'bg-emerald-600 hover:bg-emerald-700'
            }`}
          >
            {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            {isRunning ? 'Pause Auto-Clock' : 'Start Auto-Clock'}
          </button>

          <button
            onClick={handleTick}
            className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition-colors"
          >
            <Activity className="w-3.5 h-3.5" /> Single Pulse
          </button>

          <button
            onClick={handleReset}
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 text-slate-500 transition-colors"
            title="Reset counter"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Counter Graphic & Visualization */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Flip-Flop Stage LEDs & Digital Readout */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Flip-Flop Stages (MSB to LSB)
            </span>
            <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400">
              Clock Cycle #{state.clockCycles}
            </span>
          </div>

          {/* LED Flip-Flop Indicators */}
          <div className="p-8 bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-dashed border-slate-300 dark:border-slate-800 flex items-center justify-around">
            {state.binaryBits.map((bit, idx) => {
              const stageNum = bitCount - 1 - idx;
              return (
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
                    Q{stageNum} {stageNum === bitCount - 1 ? '(MSB)' : stageNum === 0 ? '(LSB)' : ''}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Numeric Dual Readout */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Decimal Count
              </span>
              <div className="font-mono text-3xl font-extrabold text-blue-600 dark:text-blue-400 mt-1">
                {state.currentValue}
              </div>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Binary State
              </span>
              <div className="font-mono text-3xl font-extrabold text-indigo-600 dark:text-indigo-400 mt-1">
                [{state.binaryBits.join('')}]₂
              </div>
            </div>
          </div>
        </div>

        {/* Right: State Transition Sequence Table */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              State Transition Sequence ({sequence.length} States)
            </h3>
            <span className="text-[10px] font-mono text-blue-500">
              MOD = {sequence.length}
            </span>
          </div>

          <div className="max-h-72 overflow-y-auto">
            <table className="w-full text-center text-xs font-mono border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden">
              <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold sticky top-0">
                <tr>
                  <th className="py-2">State</th>
                  <th className="py-2">Binary Bits</th>
                  <th className="py-2">Decimal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {sequence.map((step) => {
                  const isCurrent =
                    step.decimal === state.currentValue &&
                    step.binary === state.binaryBits.join('');

                  return (
                    <tr
                      key={step.step}
                      className={`transition-colors ${
                        isCurrent
                          ? 'bg-blue-500/15 font-bold text-blue-600 dark:text-blue-400'
                          : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
                      }`}
                    >
                      <td className="py-1.5 text-slate-400">S{step.step}</td>
                      <td className="py-1.5">{step.binary}</td>
                      <td className="py-1.5 font-bold">
                        {step.decimal} {isCurrent && '◀ Current'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

