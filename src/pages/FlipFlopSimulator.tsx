import React, { useState, useEffect } from 'react';
import { FlipFlopEngine, FlipFlopType } from '../engine/flipFlopEngine';
import {
  ToggleRight,
  Activity,
  RotateCcw,
  AlertTriangle,
  Play,
  Pause,
  BookOpen,
  History
} from 'lucide-react';

export const FlipFlopSimulator: React.FC = () => {
  const [ffType, setFfType] = useState<FlipFlopType>('SR');
  const [q, setQ] = useState<number>(0);
  const [qBar, setQBar] = useState<number>(1);
  const [isInvalid, setIsInvalid] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string>('Initialized: Ready');
  const [autoClock, setAutoClock] = useState<boolean>(false);
  const [clockCycles, setClockCycles] = useState<number>(0);

  // Inputs
  const [inputS, setInputS] = useState<number>(1);
  const [inputR, setInputR] = useState<number>(0);
  const [inputJ, setInputJ] = useState<number>(1);
  const [inputK, setInputK] = useState<number>(0);
  const [inputD, setInputD] = useState<number>(1);
  const [inputT, setInputT] = useState<number>(1);

  // History log
  const [history, setHistory] = useState<
    { cycle: number; q: number; qBar: number; action: string; inputs: string }[]
  >([]);

  // Characteristic info
  const charInfo = FlipFlopEngine.getCharacteristics(ffType);

  const triggerClock = () => {
    let inputsObj: any = {};
    let inputStr = '';

    if (ffType === 'SR') {
      inputsObj = { s: inputS, r: inputR };
      inputStr = `S=${inputS}, R=${inputR}`;
    } else if (ffType === 'JK') {
      inputsObj = { j: inputJ, k: inputK };
      inputStr = `J=${inputJ}, K=${inputK}`;
    } else if (ffType === 'D') {
      inputsObj = { d: inputD };
      inputStr = `D=${inputD}`;
    } else if (ffType === 'T') {
      inputsObj = { t: inputT };
      inputStr = `T=${inputT}`;
    }

    const next = FlipFlopEngine.transition(ffType, inputsObj, q);

    setQ(next.nextQ);
    setQBar(next.nextQBar);
    setIsInvalid(next.isInvalid);
    setStatusMessage(next.explanation);
    const newCycle = clockCycles + 1;
    setClockCycles(newCycle);

    setHistory((prev) => [
      {
        cycle: newCycle,
        q: next.nextQ,
        qBar: next.nextQBar,
        action: next.action,
        inputs: inputStr
      },
      ...prev.slice(0, 14)
    ]);
  };

  // Auto clock timer
  useEffect(() => {
    if (!autoClock) return;
    const interval = setInterval(() => {
      triggerClock();
    }, 1000);
    return () => clearInterval(interval);
  }, [autoClock, ffType, inputS, inputR, inputJ, inputK, inputD, inputT, q]);

  const handleReset = () => {
    setQ(0);
    setQBar(1);
    setIsInvalid(false);
    setClockCycles(0);
    setHistory([]);
    setStatusMessage('Reset to initial state: Q=0, Q\'=1');
  };

  return (
    <div className="p-4 sm:p-6 max-w-6xl mx-auto space-y-4 sm:space-y-6 select-none">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
          <ToggleRight className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
          <span>Flip-Flop Simulator (Bistable Multivibrators)</span>
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Interactive edge-triggered SR, JK, D, and T flip-flop state transitions
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2">
        {(['SR', 'JK', 'D', 'T'] as FlipFlopType[]).map((type) => (
          <button
            key={type}
            onClick={() => {
              setFfType(type);
              handleReset();
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              ffType === type
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            {type} Flip-Flop
          </button>
        ))}
      </div>

      {/* Main Studio Workbench */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Interactive Schematic Graphic */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/40 px-2 py-0.5 rounded">
                  Edge-Triggered Bistable Unit
                </span>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1">
                  {charInfo.name}
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setAutoClock(!autoClock)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    autoClock
                      ? 'bg-amber-500 text-white'
                      : 'border border-slate-200 dark:border-slate-700 hover:bg-slate-100 text-slate-700 dark:text-slate-200'
                  }`}
                >
                  {autoClock ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  {autoClock ? 'Stop Pulse' : 'Auto Pulse'}
                </button>
                <button
                  onClick={handleReset}
                  className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 text-slate-500"
                  title="Reset flip-flop"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Invalid SR State Warning */}
            {isInvalid && (
              <div className="mb-4 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 flex items-start gap-2.5 text-xs text-amber-700 dark:text-amber-400">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold">FORBIDDEN INPUT STATE (S=1, R=1)</div>
                  <p className="mt-0.5 leading-relaxed">
                    Both Q and Q' are forced LOW simultaneously. When inputs drop to 0, unpredictable race conditions and metastability occur!
                  </p>
                </div>
              </div>
            )}

            {/* Central Flip-Flop Hardware Visualization */}
            <div className="p-3 sm:p-8 bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-dashed border-slate-300 dark:border-slate-800 flex items-center justify-between gap-2 overflow-x-auto">
              {/* Inputs */}
              <div className="space-y-4">
                {ffType === 'SR' && (
                  <>
                    <button
                      onClick={() => setInputS(inputS === 1 ? 0 : 1)}
                      className={`w-14 h-12 rounded-xl font-mono font-bold text-xs flex flex-col items-center justify-center transition-all ${
                        inputS === 1 ? 'bg-emerald-500 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-600'
                      }`}
                    >
                      <span className="text-[9px] text-slate-400 font-sans">SET</span>
                      <span>S = {inputS}</span>
                    </button>
                    <button
                      onClick={() => setInputR(inputR === 1 ? 0 : 1)}
                      className={`w-14 h-12 rounded-xl font-mono font-bold text-xs flex flex-col items-center justify-center transition-all ${
                        inputR === 1 ? 'bg-rose-500 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-600'
                      }`}
                    >
                      <span className="text-[9px] text-slate-400 font-sans">RESET</span>
                      <span>R = {inputR}</span>
                    </button>
                  </>
                )}

                {ffType === 'JK' && (
                  <>
                    <button
                      onClick={() => setInputJ(inputJ === 1 ? 0 : 1)}
                      className={`w-14 h-12 rounded-xl font-mono font-bold text-xs flex flex-col items-center justify-center transition-all ${
                        inputJ === 1 ? 'bg-emerald-500 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-600'
                      }`}
                    >
                      <span>J = {inputJ}</span>
                    </button>
                    <button
                      onClick={() => setInputK(inputK === 1 ? 0 : 1)}
                      className={`w-14 h-12 rounded-xl font-mono font-bold text-xs flex flex-col items-center justify-center transition-all ${
                        inputK === 1 ? 'bg-rose-500 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-600'
                      }`}
                    >
                      <span>K = {inputK}</span>
                    </button>
                  </>
                )}

                {ffType === 'D' && (
                  <button
                    onClick={() => setInputD(inputD === 1 ? 0 : 1)}
                    className={`w-16 h-14 rounded-xl font-mono font-bold text-xs flex flex-col items-center justify-center transition-all ${
                      inputD === 1 ? 'bg-emerald-500 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-600'
                    }`}
                  >
                    <span className="text-[9px] text-slate-400 font-sans">DATA</span>
                    <span>D = {inputD}</span>
                  </button>
                )}

                {ffType === 'T' && (
                  <button
                    onClick={() => setInputT(inputT === 1 ? 0 : 1)}
                    className={`w-16 h-14 rounded-xl font-mono font-bold text-xs flex flex-col items-center justify-center transition-all ${
                      inputT === 1 ? 'bg-purple-600 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-600'
                    }`}
                  >
                    <span className="text-[9px] text-slate-400 font-sans">TOGGLE</span>
                    <span>T = {inputT}</span>
                  </button>
                )}

                {/* Clock trigger button */}
                <div className="pt-2">
                  <button
                    onClick={triggerClock}
                    className="w-full py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-md shadow-blue-500/20 active:scale-95 transition-all"
                  >
                    <Activity className="w-3.5 h-3.5" /> Clock Edge ↑
                  </button>
                </div>
              </div>

              {/* Central Integrated Circuit IC */}
              <div className="w-40 h-44 bg-white dark:bg-slate-900 border-2 border-slate-700 dark:border-slate-600 rounded-2xl flex flex-col items-center justify-between p-3 shadow-lg relative">
                <span className="text-[10px] text-slate-400 font-mono">CLK ↑ RISING</span>
                <div className="text-center">
                  <div className="font-extrabold text-xl text-blue-600 dark:text-blue-400 font-mono">
                    {ffType} FF
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">Cycle #{clockCycles}</div>
                </div>
                <div className="w-full flex justify-between px-2 text-[10px] font-mono font-bold text-slate-400">
                  <span>CLK</span>
                  <span>Q / Q'</span>
                </div>
              </div>

              {/* Output LEDs */}
              <div className="space-y-4">
                <div className="text-center">
                  <div
                    className={`w-14 h-14 rounded-full mx-auto flex items-center justify-center font-mono font-bold text-lg transition-all ${
                      q === 1
                        ? 'bg-emerald-500 text-white led-glow-on scale-105'
                        : 'bg-slate-300 dark:bg-slate-800 text-slate-500'
                    }`}
                  >
                    {q}
                  </div>
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 font-mono mt-1 block">
                    Q (Output)
                  </span>
                </div>

                <div className="text-center">
                  <div
                    className={`w-14 h-14 rounded-full mx-auto flex items-center justify-center font-mono font-bold text-lg transition-all ${
                      qBar === 1
                        ? 'bg-emerald-500 text-white led-glow-on scale-105'
                        : 'bg-slate-300 dark:bg-slate-800 text-slate-500'
                    }`}
                  >
                    {qBar}
                  </div>
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 font-mono mt-1 block">
                    Q' (Inverted)
                  </span>
                </div>
              </div>
            </div>

            {/* Status Message */}
            <div className="mt-4 p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300">
              <strong>Engine Status:</strong> {statusMessage}
            </div>
          </div>
        </div>

        {/* Right: Characteristic Table & State Transition History */}
        <div className="lg:col-span-5 space-y-5">
          {/* Characteristic Table */}
          <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-1">
              Characteristic Table & Equation
            </h3>
            <p className="text-xs font-mono text-blue-600 dark:text-blue-400 mb-3">
              {charInfo.equation}
            </p>

            <table className="w-full text-center text-xs font-mono border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
              <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold">
                <tr>
                  {Object.keys(charInfo.table[0])
                    .filter((k) => k !== 'action' && k !== 'qNext')
                    .map((k) => (
                      <th key={k} className="py-2 uppercase">
                        {k}
                      </th>
                    ))}
                  <th className="py-2">Q(t+1)</th>
                  <th className="py-2">Function</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {charInfo.table.map((row: any, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    {Object.keys(row)
                      .filter((k) => k !== 'action' && k !== 'qNext')
                      .map((k) => (
                        <td key={k} className="py-1.5">
                          {row[k]}
                        </td>
                      ))}
                    <td className="py-1.5 font-bold text-blue-600 dark:text-blue-400">
                      {row.qNext}
                    </td>
                    <td className="py-1.5 text-slate-500 font-sans text-[11px]">
                      {row.action}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Transition History Log */}
          <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
            <div className="flex items-center gap-2 pb-2 mb-3 border-b border-slate-100 dark:border-slate-800">
              <History className="w-4 h-4 text-blue-500" />
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                Clock Cycle History
              </h3>
            </div>

            {history.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No clock pulses triggered yet. Click "Clock Edge ↑".</p>
            ) : (
              <div className="space-y-1.5 max-h-48 overflow-y-auto">
                {history.map((h, i) => (
                  <div
                    key={i}
                    className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between text-xs font-mono"
                  >
                    <span className="text-slate-400">#{h.cycle}</span>
                    <span className="text-slate-700 dark:text-slate-300">{h.inputs}</span>
                    <span className="font-bold text-blue-600">Q={h.q}</span>
                    <span className="text-[10px] text-slate-400 font-sans">{h.action}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

