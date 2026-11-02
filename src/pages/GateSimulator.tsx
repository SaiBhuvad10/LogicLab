import React, { useState } from 'react';
import { GATE_DEFINITIONS, evaluateGate } from '../engine/gateEngine';
import { GateId } from '../types/gates';
import { RotateCcw, Lightbulb, CheckCircle2, BookOpen } from 'lucide-react';

export const GateSimulator: React.FC = () => {
  const [selectedGate, setSelectedGate] = useState<GateId>('AND');
  const [inputA, setInputA] = useState<number>(0);
  const [inputB, setInputB] = useState<number>(0);

  const def = GATE_DEFINITIONS[selectedGate];
  const isUnary = selectedGate === 'NOT';

  // Real-time calculation via engine
  const currentInputs = isUnary ? [inputA] : [inputA, inputB];
  const output = evaluateGate(selectedGate, currentInputs);

  const handleReset = () => {
    setInputA(0);
    setInputB(0);
  };

  const setPresetCombination = (a: number, b: number) => {
    setInputA(a);
    setInputB(b);
  };

  const gateList: GateId[] = ['AND', 'OR', 'NOT', 'NAND', 'NOR', 'XOR', 'XNOR'];

  return (
    <div className="p-4 sm:p-6 max-w-6xl mx-auto space-y-4 sm:space-y-6 select-none">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Logic Gate Simulator
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Interactive simulation of fundamental, universal, and special digital logic gates
        </p>
      </div>

      {/* Gate Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {gateList.map((gate) => (
          <button
            key={gate}
            onClick={() => {
              setSelectedGate(gate);
              handleReset();
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              selectedGate === gate
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20 scale-102'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            {gate} GATE
          </button>
        ))}
      </div>

      {/* Main Interactive Workbench */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Interactive Gate Circuit Graphic */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 flex flex-col justify-between shadow-xs">
          <div>
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded">
                  {def.name}
                </span>
                <div className="font-mono font-bold text-lg text-slate-900 dark:text-white mt-1">
                  {def.expression}
                </div>
              </div>

              <button
                onClick={handleReset}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-medium transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Reset
              </button>
            </div>

            {/* Interactive Gate Diagram */}
            <div className="relative py-12 px-6 flex items-center justify-center bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-dashed border-slate-300 dark:border-slate-800 overflow-hidden">
              <div className="flex items-center justify-between w-full max-w-md">
                {/* Inputs Column */}
                <div className="flex flex-col gap-6 z-10">
                  {/* Switch A */}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setInputA(inputA === 1 ? 0 : 1)}
                      className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center font-mono font-bold text-base transition-all shadow-md cursor-pointer ${
                        inputA === 1
                          ? 'bg-emerald-500 text-white shadow-emerald-500/30 ring-2 ring-emerald-400'
                          : 'bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-slate-400'
                      }`}
                    >
                      <span className="text-[9px] uppercase font-sans text-slate-400">Input A</span>
                      <span>{inputA}</span>
                    </button>
                    <span className={`text-xs font-mono font-bold ${inputA === 1 ? 'text-emerald-500' : 'text-slate-400'}`}>
                      {inputA === 1 ? 'HIGH (+5V)' : 'LOW (0V)'}
                    </span>
                  </div>

                  {/* Switch B (if binary gate) */}
                  {!isUnary && (
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setInputB(inputB === 1 ? 0 : 1)}
                        className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center font-mono font-bold text-base transition-all shadow-md cursor-pointer ${
                          inputB === 1
                            ? 'bg-emerald-500 text-white shadow-emerald-500/30 ring-2 ring-emerald-400'
                            : 'bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-slate-400'
                        }`}
                      >
                        <span className="text-[9px] uppercase font-sans text-slate-400">Input B</span>
                        <span>{inputB}</span>
                      </button>
                      <span className={`text-xs font-mono font-bold ${inputB === 1 ? 'text-emerald-500' : 'text-slate-400'}`}>
                        {inputB === 1 ? 'HIGH (+5V)' : 'LOW (0V)'}
                      </span>
                    </div>
                  )}
                </div>

                {/* Central Gate Symbol Graphic */}
                <div className="relative px-6">
                  <div className="w-28 h-20 bg-white dark:bg-slate-900 border-2 border-blue-600 dark:border-blue-500 rounded-2xl flex flex-col items-center justify-center shadow-lg relative">
                    <span className="font-extrabold text-lg text-blue-600 dark:text-blue-400">
                      {selectedGate}
                    </span>
                    <span className="text-[9px] text-slate-400 font-mono">
                      {isUnary ? '1-Input' : '2-Input'}
                    </span>
                  </div>
                </div>

                {/* Output Indicator Column */}
                <div className="flex flex-col items-center gap-2 z-10">
                  <div
                    className={`w-16 h-16 rounded-full border-4 border-white/20 flex flex-col items-center justify-center transition-all duration-300 ${
                      output === 1
                        ? 'bg-emerald-500 led-glow-on scale-105'
                        : 'bg-slate-300 dark:bg-slate-800 led-glow-off'
                    }`}
                  >
                    <Lightbulb className={`w-6 h-6 ${output === 1 ? 'text-white' : 'text-slate-500'}`} />
                  </div>
                  <div className="text-center font-mono">
                    <div className="text-base font-extrabold text-slate-900 dark:text-white">
                      Y = {output}
                    </div>
                    <div className={`text-[10px] font-bold ${output === 1 ? 'text-emerald-500' : 'text-slate-400'}`}>
                      {output === 1 ? 'LED ON' : 'LED OFF'}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Test Combinations */}
            <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">
                Preset Test Inputs:
              </span>
              <div className="flex items-center gap-1.5">
                {isUnary ? (
                  <>
                    <button
                      onClick={() => setPresetCombination(0, 0)}
                      className="px-2.5 py-1 text-xs font-mono font-medium rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-900/30 text-slate-700 dark:text-slate-300"
                    >
                      A=0
                    </button>
                    <button
                      onClick={() => setPresetCombination(1, 0)}
                      className="px-2.5 py-1 text-xs font-mono font-medium rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-900/30 text-slate-700 dark:text-slate-300"
                    >
                      A=1
                    </button>
                  </>
                ) : (
                  <>
                    {[
                      [0, 0],
                      [0, 1],
                      [1, 0],
                      [1, 1]
                    ].map(([a, b]) => (
                      <button
                        key={`${a}-${b}`}
                        onClick={() => setPresetCombination(a, b)}
                        className={`px-2.5 py-1 text-xs font-mono font-medium rounded-lg transition-colors ${
                          inputA === a && inputB === b
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-900/30 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {a},{b}
                      </button>
                    ))}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Gate Specifications & Dynamic Truth Table */}
        <div className="lg:col-span-5 space-y-6">
          {/* Truth Table */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-1">
              Truth Table Verification
            </h3>
            <p className="text-xs text-slate-400 mb-3">
              Highlighted row indicates the currently active input state
            </p>

            <table className="w-full text-center text-xs font-mono border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
              <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold">
                <tr>
                  {def.inputCount === 1 ? (
                    <th className="py-2">Input A</th>
                  ) : (
                    <>
                      <th className="py-2">Input A</th>
                      <th className="py-2">Input B</th>
                    </>
                  )}
                  <th className="py-2">Output Y</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {def.truthTable.inputs.map((inRow, idx) => {
                  const isActiveRow = isUnary
                    ? inRow[0] === inputA
                    : inRow[0] === inputA && inRow[1] === inputB;
                  const rowOutput = def.truthTable.outputs[idx];

                  return (
                    <tr
                      key={idx}
                      className={`transition-colors ${
                        isActiveRow
                          ? 'bg-blue-500/15 font-bold text-blue-600 dark:text-blue-400'
                          : 'hover:bg-slate-50 dark:hover:bg-slate-800/40 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {inRow.map((v, cIdx) => (
                        <td key={cIdx} className="py-2">
                          {v}
                        </td>
                      ))}
                      <td className="py-2 font-bold">
                        {rowOutput}
                        {isActiveRow && (
                          <span className="ml-1 text-[10px] text-blue-600 dark:text-blue-400">
                            ◀ Active
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Theory & Boolean Laws */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-slate-800 dark:text-slate-100 font-bold text-sm">
              <BookOpen className="w-4 h-4 text-blue-500" />
              <span>Theory & Algebraic Laws</span>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {def.details}
            </p>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
              <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">
                Associated Boolean Laws
              </div>
              <div className="font-mono text-xs font-semibold text-blue-600 dark:text-blue-400">
                {def.booleanLaw}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

