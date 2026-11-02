import React, { useState } from 'react';
import { CombinationalEngine } from '../engine/combinationalEngine';
import { Share2, Lightbulb, BookOpen, Layers } from 'lucide-react';

type CircuitCategory = 'Adders/Subtractors' | 'Multiplexers/Demultiplexers' | 'Decoders/Encoders' | 'ALU & CLA';

export const CombinationalCircuits: React.FC = () => {
  const [selectedCircuit, setSelectedCircuit] = useState<string>('half_adder');

  // Input states
  const [inA, setInA] = useState<number>(1);
  const [inB, setInB] = useState<number>(1);
  const [inCin, setInCin] = useState<number>(0);
  const [inBin, setInBin] = useState<number>(0);

  // MUX/DEMUX data & select
  const [d0, setD0] = useState<number>(1);
  const [d1, setD1] = useState<number>(0);
  const [d2, setD2] = useState<number>(1);
  const [d3, setD3] = useState<number>(0);
  const [s0, setS0] = useState<number>(0);
  const [s1, setS1] = useState<number>(0);
  const [din, setDin] = useState<number>(1);
  const [enable, setEnable] = useState<number>(1);

  // ALU & Multi-bit states
  const [busA, setBusA] = useState<number>(5); // 0101
  const [busB, setBusB] = useState<number>(3); // 0011
  const [aluOpcode, setAluOpcode] = useState<number>(0); // ADD

  // Priority Encoder inputs (D0..D7)
  const [encInputs, setEncInputs] = useState<number[]>([0, 0, 0, 0, 1, 0, 0, 0]);

  const circuits = [
    { id: 'half_adder', name: 'Half Adder', category: 'Adders/Subtractors' },
    { id: 'full_adder', name: 'Full Adder', category: 'Adders/Subtractors' },
    { id: 'half_subtractor', name: 'Half Subtractor', category: 'Adders/Subtractors' },
    { id: 'full_subtractor', name: 'Full Subtractor', category: 'Adders/Subtractors' },
    { id: 'cla_4bit', name: '4-Bit Look-Ahead Carry Adder', category: 'Adders/Subtractors' },

    { id: 'mux_2to1', name: '2:1 Multiplexer', category: 'Multiplexers/Demultiplexers' },
    { id: 'mux_4to1', name: '4:1 Multiplexer', category: 'Multiplexers/Demultiplexers' },
    { id: 'demux_1to2', name: '1:2 Demultiplexer', category: 'Multiplexers/Demultiplexers' },
    { id: 'demux_1to4', name: '1:4 Demultiplexer', category: 'Multiplexers/Demultiplexers' },

    { id: 'decoder_2to4', name: '2-to-4 Decoder', category: 'Decoders/Encoders' },
    { id: 'decoder_3to8', name: '3-to-8 Decoder', category: 'Decoders/Encoders' },
    { id: 'encoder_8to3', name: '8-to-3 Priority Encoder', category: 'Decoders/Encoders' },
    { id: 'comparator', name: '4-Bit Digital Comparator', category: 'Decoders/Encoders' },

    { id: 'alu_4bit', name: '4-Bit Arithmetic Logic Unit (ALU)', category: 'ALU & CLA' }
  ];

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-4 sm:space-y-6 select-none">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
          <Share2 className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
          <span>Combinational Circuits Laboratory</span>
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Interactive evaluation of arithmetic circuits, multiplexers, decoders, CLA, and ALU
        </p>
      </div>

      {/* Circuit Selector Pill Grid */}
      <div className="flex flex-wrap gap-2">
        {circuits.map((c) => (
          <button
            key={c.id}
            onClick={() => setSelectedCircuit(c.id)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              selectedCircuit === c.id
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            {c.name}
          </button>
        ))}
      </div>

      {/* Active Circuit Workbench */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Interactive Controls & Live Circuit Simulation */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 mb-5 border-b border-slate-100 dark:border-slate-800">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/40 px-2 py-0.5 rounded">
                  {circuits.find((c) => c.id === selectedCircuit)?.category}
                </span>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1">
                  {circuits.find((c) => c.id === selectedCircuit)?.name}
                </h3>
              </div>
            </div>

            {/* CIRCUIT 1: Half Adder */}
            {selectedCircuit === 'half_adder' && (() => {
              const res = CombinationalEngine.evalHalfAdder(inA, inB);
              return (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 block mb-1">Input A</label>
                      <button
                        onClick={() => setInA(inA === 1 ? 0 : 1)}
                        className={`w-full py-2.5 rounded-xl font-mono font-bold text-sm ${inA === 1 ? 'bg-emerald-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600'}`}
                      >
                        A = {inA}
                      </button>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 block mb-1">Input B</label>
                      <button
                        onClick={() => setInB(inB === 1 ? 0 : 1)}
                        className={`w-full py-2.5 rounded-xl font-mono font-bold text-sm ${inB === 1 ? 'bg-emerald-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600'}`}
                      >
                        B = {inB}
                      </button>
                    </div>
                  </div>

                  <div className="p-6 bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-dashed border-slate-300 dark:border-slate-800 flex items-center justify-around">
                    <div className="text-center">
                      <div className={`w-14 h-14 rounded-full mx-auto flex items-center justify-center font-bold text-lg ${res.sum === 1 ? 'bg-emerald-500 text-white led-glow-on' : 'bg-slate-300 dark:bg-slate-800 text-slate-500'}`}>
                        {res.sum}
                      </div>
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300 mt-2 block font-mono">Sum (S = A ⊕ B)</span>
                    </div>

                    <div className="text-center">
                      <div className={`w-14 h-14 rounded-full mx-auto flex items-center justify-center font-bold text-lg ${res.carry === 1 ? 'bg-blue-600 text-white led-glow-blue' : 'bg-slate-300 dark:bg-slate-800 text-slate-500'}`}>
                        {res.carry}
                      </div>
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300 mt-2 block font-mono">Carry (C = A · B)</span>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* CIRCUIT 2: Full Adder */}
            {selectedCircuit === 'full_adder' && (() => {
              const res = CombinationalEngine.evalFullAdder(inA, inB, inCin);
              return (
                <div className="space-y-6">
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 block mb-1">Input A</label>
                      <button
                        onClick={() => setInA(inA === 1 ? 0 : 1)}
                        className={`w-full py-2 rounded-xl font-mono font-bold text-sm ${inA === 1 ? 'bg-emerald-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600'}`}
                      >
                        A = {inA}
                      </button>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 block mb-1">Input B</label>
                      <button
                        onClick={() => setInB(inB === 1 ? 0 : 1)}
                        className={`w-full py-2 rounded-xl font-mono font-bold text-sm ${inB === 1 ? 'bg-emerald-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600'}`}
                      >
                        B = {inB}
                      </button>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 block mb-1">Carry In (Cin)</label>
                      <button
                        onClick={() => setInCin(inCin === 1 ? 0 : 1)}
                        className={`w-full py-2 rounded-xl font-mono font-bold text-sm ${inCin === 1 ? 'bg-amber-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600'}`}
                      >
                        Cin = {inCin}
                      </button>
                    </div>
                  </div>

                  <div className="p-6 bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-dashed border-slate-300 dark:border-slate-800 flex items-center justify-around">
                    <div className="text-center">
                      <div className={`w-14 h-14 rounded-full mx-auto flex items-center justify-center font-bold text-lg ${res.sum === 1 ? 'bg-emerald-500 text-white led-glow-on' : 'bg-slate-300 dark:bg-slate-800 text-slate-500'}`}>
                        {res.sum}
                      </div>
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300 mt-2 block font-mono">Sum = A ⊕ B ⊕ Cin</span>
                    </div>

                    <div className="text-center">
                      <div className={`w-14 h-14 rounded-full mx-auto flex items-center justify-center font-bold text-lg ${res.cout === 1 ? 'bg-blue-600 text-white led-glow-blue' : 'bg-slate-300 dark:bg-slate-800 text-slate-500'}`}>
                        {res.cout}
                      </div>
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300 mt-2 block font-mono">Cout = AB + Cin(A⊕B)</span>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* CIRCUIT 3: Half Subtractor */}
            {selectedCircuit === 'half_subtractor' && (() => {
              const res = CombinationalEngine.evalHalfSubtractor(inA, inB);
              return (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 block mb-1">Minuend (A)</label>
                      <button
                        onClick={() => setInA(inA === 1 ? 0 : 1)}
                        className={`w-full py-2.5 rounded-xl font-mono font-bold text-sm ${inA === 1 ? 'bg-emerald-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600'}`}
                      >
                        A = {inA}
                      </button>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 block mb-1">Subtrahend (B)</label>
                      <button
                        onClick={() => setInB(inB === 1 ? 0 : 1)}
                        className={`w-full py-2.5 rounded-xl font-mono font-bold text-sm ${inB === 1 ? 'bg-emerald-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600'}`}
                      >
                        B = {inB}
                      </button>
                    </div>
                  </div>

                  <div className="p-6 bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-dashed border-slate-300 dark:border-slate-800 flex items-center justify-around">
                    <div className="text-center">
                      <div className={`w-14 h-14 rounded-full mx-auto flex items-center justify-center font-bold text-lg ${res.diff === 1 ? 'bg-emerald-500 text-white led-glow-on' : 'bg-slate-300 dark:bg-slate-800 text-slate-500'}`}>
                        {res.diff}
                      </div>
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300 mt-2 block font-mono">Difference (Diff = A ⊕ B)</span>
                    </div>

                    <div className="text-center">
                      <div className={`w-14 h-14 rounded-full mx-auto flex items-center justify-center font-bold text-lg ${res.borrow === 1 ? 'bg-rose-500 text-white' : 'bg-slate-300 dark:bg-slate-800 text-slate-500'}`}>
                        {res.borrow}
                      </div>
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300 mt-2 block font-mono">Borrow (Bout = A' · B)</span>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* CIRCUIT 4: Full Subtractor */}
            {selectedCircuit === 'full_subtractor' && (() => {
              const res = CombinationalEngine.evalFullSubtractor(inA, inB, inBin);
              return (
                <div className="space-y-6">
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 block mb-1">Input A</label>
                      <button
                        onClick={() => setInA(inA === 1 ? 0 : 1)}
                        className={`w-full py-2 rounded-xl font-mono font-bold text-sm ${inA === 1 ? 'bg-emerald-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600'}`}
                      >
                        A = {inA}
                      </button>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 block mb-1">Input B</label>
                      <button
                        onClick={() => setInB(inB === 1 ? 0 : 1)}
                        className={`w-full py-2 rounded-xl font-mono font-bold text-sm ${inB === 1 ? 'bg-emerald-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600'}`}
                      >
                        B = {inB}
                      </button>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 block mb-1">Borrow In (Bin)</label>
                      <button
                        onClick={() => setInBin(inBin === 1 ? 0 : 1)}
                        className={`w-full py-2 rounded-xl font-mono font-bold text-sm ${inBin === 1 ? 'bg-rose-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600'}`}
                      >
                        Bin = {inBin}
                      </button>
                    </div>
                  </div>

                  <div className="p-6 bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-dashed border-slate-300 dark:border-slate-800 flex items-center justify-around">
                    <div className="text-center">
                      <div className={`w-14 h-14 rounded-full mx-auto flex items-center justify-center font-bold text-lg ${res.diff === 1 ? 'bg-emerald-500 text-white led-glow-on' : 'bg-slate-300 dark:bg-slate-800 text-slate-500'}`}>
                        {res.diff}
                      </div>
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300 mt-2 block font-mono">Diff = A ⊕ B ⊕ Bin</span>
                    </div>

                    <div className="text-center">
                      <div className={`w-14 h-14 rounded-full mx-auto flex items-center justify-center font-bold text-lg ${res.bout === 1 ? 'bg-rose-500 text-white' : 'bg-slate-300 dark:bg-slate-800 text-slate-500'}`}>
                        {res.bout}
                      </div>
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300 mt-2 block font-mono">Bout = A'B + Bin(A⊕B)'</span>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* CIRCUIT 5: 4:1 Multiplexer */}
            {selectedCircuit === 'mux_4to1' && (() => {
              const res = CombinationalEngine.evalMux4to1(d0, d1, d2, d3, s1, s0);
              return (
                <div className="space-y-6">
                  <div>
                    <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 block mb-1.5">Data Inputs (D0 to D3)</label>
                    <div className="grid grid-cols-4 gap-2">
                      {[
                        { label: 'D0', val: d0, set: setD0 },
                        { label: 'D1', val: d1, set: setD1 },
                        { label: 'D2', val: d2, set: setD2 },
                        { label: 'D3', val: d3, set: setD3 }
                      ].map((item, idx) => (
                        <button
                          key={item.label}
                          onClick={() => item.set(item.val === 1 ? 0 : 1)}
                          className={`py-2 rounded-xl font-mono text-xs font-bold border ${
                            res.select === idx
                              ? 'border-blue-500 ring-2 ring-blue-500/30'
                              : 'border-slate-200 dark:border-slate-700'
                          } ${item.val === 1 ? 'bg-emerald-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600'}`}
                        >
                          {item.label} = {item.val}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 block mb-1.5">Select Inputs (S1, S0)</label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => setS1(s1 === 1 ? 0 : 1)}
                        className={`py-2 rounded-xl font-mono text-xs font-bold ${s1 === 1 ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600'}`}
                      >
                        S1 = {s1}
                      </button>
                      <button
                        onClick={() => setS0(s0 === 1 ? 0 : 1)}
                        className={`py-2 rounded-xl font-mono text-xs font-bold ${s0 === 1 ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600'}`}
                      >
                        S0 = {s0}
                      </button>
                    </div>
                  </div>

                  <div className="p-5 bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-dashed border-slate-300 dark:border-slate-800 text-center">
                    <span className="text-xs text-slate-400 font-mono">Selected Input: D{res.select}</span>
                    <div className={`w-16 h-16 rounded-full mx-auto my-2 flex items-center justify-center font-bold text-xl ${res.y === 1 ? 'bg-emerald-500 text-white led-glow-on' : 'bg-slate-300 dark:bg-slate-800 text-slate-500'}`}>
                      {res.y}
                    </div>
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300 font-mono">Output Y = {res.y}</span>
                  </div>
                </div>
              );
            })()}

            {/* CIRCUIT 6: 2:1 Multiplexer */}
            {selectedCircuit === 'mux_2to1' && (() => {
              const res = CombinationalEngine.evalMux2to1(d0, d1, s0);
              return (
                <div className="space-y-6">
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 block mb-1">Data D0</label>
                      <button
                        onClick={() => setD0(d0 === 1 ? 0 : 1)}
                        className={`w-full py-2 rounded-xl font-mono font-bold text-sm ${d0 === 1 ? 'bg-emerald-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600'}`}
                      >
                        D0 = {d0}
                      </button>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 block mb-1">Data D1</label>
                      <button
                        onClick={() => setD1(d1 === 1 ? 0 : 1)}
                        className={`w-full py-2 rounded-xl font-mono font-bold text-sm ${d1 === 1 ? 'bg-emerald-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600'}`}
                      >
                        D1 = {d1}
                      </button>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 block mb-1">Select Line (S)</label>
                      <button
                        onClick={() => setS0(s0 === 1 ? 0 : 1)}
                        className={`w-full py-2 rounded-xl font-mono font-bold text-sm ${s0 === 1 ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600'}`}
                      >
                        S = {s0}
                      </button>
                    </div>
                  </div>

                  <div className="p-6 bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-dashed border-slate-300 dark:border-slate-800 text-center">
                    <span className="text-xs text-slate-400 font-mono">Routing: {s0 === 0 ? 'D0' : 'D1'} to Y</span>
                    <div className={`w-16 h-16 rounded-full mx-auto my-2 flex items-center justify-center font-bold text-xl ${res.y === 1 ? 'bg-emerald-500 text-white led-glow-on' : 'bg-slate-300 dark:bg-slate-800 text-slate-500'}`}>
                      {res.y}
                    </div>
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300 font-mono">Output Y = S'D0 + SD1 = {res.y}</span>
                  </div>
                </div>
              );
            })()}

            {/* CIRCUIT 7: 1:2 DEMUX */}
            {selectedCircuit === 'demux_1to2' && (() => {
              const res = CombinationalEngine.evalDemux1to2(din, s0);
              return (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 block mb-1">Data In (Din)</label>
                      <button
                        onClick={() => setDin(din === 1 ? 0 : 1)}
                        className={`w-full py-2.5 rounded-xl font-mono font-bold text-sm ${din === 1 ? 'bg-emerald-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600'}`}
                      >
                        Din = {din}
                      </button>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 block mb-1">Select (S)</label>
                      <button
                        onClick={() => setS0(s0 === 1 ? 0 : 1)}
                        className={`w-full py-2.5 rounded-xl font-mono font-bold text-sm ${s0 === 1 ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600'}`}
                      >
                        S = {s0}
                      </button>
                    </div>
                  </div>

                  <div className="p-6 bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-dashed border-slate-300 dark:border-slate-800 flex items-center justify-around">
                    <div className="text-center">
                      <div className={`w-14 h-14 rounded-full mx-auto flex items-center justify-center font-bold text-lg ${res.y0 === 1 ? 'bg-emerald-500 text-white led-glow-on' : 'bg-slate-300 dark:bg-slate-800 text-slate-500'}`}>
                        {res.y0}
                      </div>
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300 mt-2 block font-mono">Y0 = S' · Din</span>
                    </div>

                    <div className="text-center">
                      <div className={`w-14 h-14 rounded-full mx-auto flex items-center justify-center font-bold text-lg ${res.y1 === 1 ? 'bg-emerald-500 text-white led-glow-on' : 'bg-slate-300 dark:bg-slate-800 text-slate-500'}`}>
                        {res.y1}
                      </div>
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300 mt-2 block font-mono">Y1 = S · Din</span>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* CIRCUIT 8: 1:4 DEMUX */}
            {selectedCircuit === 'demux_1to4' && (() => {
              const res = CombinationalEngine.evalDemux1to4(din, s1, s0);
              return (
                <div className="space-y-6">
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 block mb-1">Data In</label>
                      <button
                        onClick={() => setDin(din === 1 ? 0 : 1)}
                        className={`w-full py-2 rounded-xl font-mono font-bold text-sm ${din === 1 ? 'bg-emerald-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600'}`}
                      >
                        Din = {din}
                      </button>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 block mb-1">Select S1</label>
                      <button
                        onClick={() => setS1(s1 === 1 ? 0 : 1)}
                        className={`w-full py-2 rounded-xl font-mono font-bold text-sm ${s1 === 1 ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600'}`}
                      >
                        S1 = {s1}
                      </button>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 block mb-1">Select S0</label>
                      <button
                        onClick={() => setS0(s0 === 1 ? 0 : 1)}
                        className={`w-full py-2 rounded-xl font-mono font-bold text-sm ${s0 === 1 ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600'}`}
                      >
                        S0 = {s0}
                      </button>
                    </div>
                  </div>

                  <div className="p-6 bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-dashed border-slate-300 dark:border-slate-800 grid grid-cols-4 gap-2 text-center">
                    {[
                      { label: 'Y0', val: res.y0 },
                      { label: 'Y1', val: res.y1 },
                      { label: 'Y2', val: res.y2 },
                      { label: 'Y3', val: res.y3 }
                    ].map((out) => (
                      <div key={out.label} className="text-center">
                        <div className={`w-12 h-12 rounded-full mx-auto flex items-center justify-center font-bold text-base ${out.val === 1 ? 'bg-emerald-500 text-white led-glow-on' : 'bg-slate-300 dark:bg-slate-800 text-slate-500'}`}>
                          {out.val}
                        </div>
                        <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 mt-1 block font-mono">{out.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}

            {/* CIRCUIT 9: 2-to-4 Decoder */}
            {selectedCircuit === 'decoder_2to4' && (() => {
              const res = CombinationalEngine.evalDecoder2to4(inA, inB, enable);
              return (
                <div className="space-y-6">
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 block mb-1">Enable (EN)</label>
                      <button
                        onClick={() => setEnable(enable === 1 ? 0 : 1)}
                        className={`w-full py-2 rounded-xl font-mono font-bold text-sm ${enable === 1 ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600'}`}
                      >
                        EN = {enable}
                      </button>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 block mb-1">Input A (MSB)</label>
                      <button
                        onClick={() => setInA(inA === 1 ? 0 : 1)}
                        className={`w-full py-2 rounded-xl font-mono font-bold text-sm ${inA === 1 ? 'bg-emerald-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600'}`}
                      >
                        A = {inA}
                      </button>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 block mb-1">Input B (LSB)</label>
                      <button
                        onClick={() => setInB(inB === 1 ? 0 : 1)}
                        className={`w-full py-2 rounded-xl font-mono font-bold text-sm ${inB === 1 ? 'bg-emerald-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600'}`}
                      >
                        B = {inB}
                      </button>
                    </div>
                  </div>

                  <div className="p-6 bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-dashed border-slate-300 dark:border-slate-800 grid grid-cols-4 gap-2 text-center">
                    {[
                      { label: 'Y0 (00)', val: res.y0 },
                      { label: 'Y1 (01)', val: res.y1 },
                      { label: 'Y2 (10)', val: res.y2 },
                      { label: 'Y3 (11)', val: res.y3 }
                    ].map((out) => (
                      <div key={out.label} className="text-center">
                        <div className={`w-12 h-12 rounded-full mx-auto flex items-center justify-center font-bold text-base ${out.val === 1 ? 'bg-emerald-500 text-white led-glow-on' : 'bg-slate-300 dark:bg-slate-800 text-slate-500'}`}>
                          {out.val}
                        </div>
                        <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 mt-1 block font-mono">{out.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}

            {/* CIRCUIT 10: 3-to-8 Decoder */}
            {selectedCircuit === 'decoder_3to8' && (() => {
              const res = CombinationalEngine.evalDecoder3to8(inA, inB, inCin, enable);
              return (
                <div className="space-y-6">
                  <div className="grid grid-cols-4 gap-2">
                    <div>
                      <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Enable</label>
                      <button
                        onClick={() => setEnable(enable === 1 ? 0 : 1)}
                        className={`w-full py-1.5 rounded-lg font-mono font-bold text-xs ${enable === 1 ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800'}`}
                      >
                        EN = {enable}
                      </button>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">A (MSB)</label>
                      <button
                        onClick={() => setInA(inA === 1 ? 0 : 1)}
                        className={`w-full py-1.5 rounded-lg font-mono font-bold text-xs ${inA === 1 ? 'bg-emerald-500 text-white' : 'bg-slate-100 dark:bg-slate-800'}`}
                      >
                        A = {inA}
                      </button>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">B</label>
                      <button
                        onClick={() => setInB(inB === 1 ? 0 : 1)}
                        className={`w-full py-1.5 rounded-lg font-mono font-bold text-xs ${inB === 1 ? 'bg-emerald-500 text-white' : 'bg-slate-100 dark:bg-slate-800'}`}
                      >
                        B = {inB}
                      </button>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">C (LSB)</label>
                      <button
                        onClick={() => setInCin(inCin === 1 ? 0 : 1)}
                        className={`w-full py-1.5 rounded-lg font-mono font-bold text-xs ${inCin === 1 ? 'bg-emerald-500 text-white' : 'bg-slate-100 dark:bg-slate-800'}`}
                      >
                        C = {inCin}
                      </button>
                    </div>
                  </div>

                  <div className="p-4 bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-dashed border-slate-300 dark:border-slate-800 grid grid-cols-4 sm:grid-cols-8 gap-2 text-center">
                    {[
                      { label: 'Y0', val: res.y0 },
                      { label: 'Y1', val: res.y1 },
                      { label: 'Y2', val: res.y2 },
                      { label: 'Y3', val: res.y3 },
                      { label: 'Y4', val: res.y4 },
                      { label: 'Y5', val: res.y5 },
                      { label: 'Y6', val: res.y6 },
                      { label: 'Y7', val: res.y7 }
                    ].map((out) => (
                      <div key={out.label} className="text-center">
                        <div className={`w-9 h-9 rounded-full mx-auto flex items-center justify-center font-bold text-xs ${out.val === 1 ? 'bg-emerald-500 text-white led-glow-on' : 'bg-slate-300 dark:bg-slate-800 text-slate-500'}`}>
                          {out.val}
                        </div>
                        <span className="text-[10px] font-mono text-slate-600 dark:text-slate-300 mt-1 block">{out.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}

            {/* CIRCUIT 11: 8-to-3 Priority Encoder */}
            {selectedCircuit === 'encoder_8to3' && (() => {
              const res = CombinationalEngine.evalPriorityEncoder8to3(encInputs);
              return (
                <div className="space-y-6">
                  <div>
                    <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 block mb-1.5">
                      Inputs D0 (Lowest Priority) to D7 (Highest Priority)
                    </label>
                    <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                      {encInputs.map((val, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            const copy = [...encInputs];
                            copy[idx] = val === 1 ? 0 : 1;
                            setEncInputs(copy);
                          }}
                          className={`py-2 rounded-xl font-mono text-xs font-bold ${
                            val === 1
                              ? 'bg-blue-600 text-white ring-2 ring-blue-500/30'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-600'
                          }`}
                        >
                          D{idx} = {val}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="p-6 bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-dashed border-slate-300 dark:border-slate-800 text-center">
                    <span className="text-xs text-slate-400 font-mono">
                      Highest Active Input: {res.activeLine >= 0 ? `D${res.activeLine}` : 'None'}
                    </span>
                    <div className="flex items-center justify-center gap-6 my-3 font-mono font-extrabold text-2xl text-blue-600 dark:text-blue-400">
                      <div>Y2: {res.y2}</div>
                      <div>Y1: {res.y1}</div>
                      <div>Y0: {res.y0}</div>
                    </div>
                    <span className="text-xs font-bold text-slate-500 font-mono">
                      Binary Output: [{res.y2}{res.y1}{res.y0}]₂ (Decimal: {res.activeLine >= 0 ? res.activeLine : 0})
                    </span>
                  </div>
                </div>
              );
            })()}

            {/* CIRCUIT 12: 4-Bit Comparator */}
            {selectedCircuit === 'comparator' && (() => {
              const res = CombinationalEngine.evalComparator(busA, busB);
              return (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 block mb-1">Operand A (0 to 15)</label>
                      <input
                        type="number"
                        min="0"
                        max="15"
                        value={busA}
                        onChange={(e) => setBusA(Math.max(0, Math.min(15, parseInt(e.target.value) || 0)))}
                        className="w-full px-3 py-2 font-mono text-sm font-bold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                      />
                      <span className="text-[10px] text-slate-400 font-mono">Binary: {busA.toString(2).padStart(4, '0')}</span>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 block mb-1">Operand B (0 to 15)</label>
                      <input
                        type="number"
                        min="0"
                        max="15"
                        value={busB}
                        onChange={(e) => setBusB(Math.max(0, Math.min(15, parseInt(e.target.value) || 0)))}
                        className="w-full px-3 py-2 font-mono text-sm font-bold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                      />
                      <span className="text-[10px] text-slate-400 font-mono">Binary: {busB.toString(2).padStart(4, '0')}</span>
                    </div>
                  </div>

                  <div className="p-6 bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-dashed border-slate-300 dark:border-slate-800 grid grid-cols-3 gap-4 text-center">
                    <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                      <div className="text-xs text-slate-400 font-mono">A &gt; B</div>
                      <div className={`font-mono text-xl font-bold mt-1 ${res.aGtB === 1 ? 'text-emerald-500' : 'text-slate-400'}`}>{res.aGtB}</div>
                    </div>

                    <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                      <div className="text-xs text-slate-400 font-mono">A = B</div>
                      <div className={`font-mono text-xl font-bold mt-1 ${res.aEqB === 1 ? 'text-blue-500' : 'text-slate-400'}`}>{res.aEqB}</div>
                    </div>

                    <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                      <div className="text-xs text-slate-400 font-mono">A &lt; B</div>
                      <div className={`font-mono text-xl font-bold mt-1 ${res.aLtB === 1 ? 'text-amber-500' : 'text-slate-400'}`}>{res.aLtB}</div>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* CIRCUIT 13: 4-Bit CLA */}
            {selectedCircuit === 'cla_4bit' && (() => {
              const aBits = busA.toString(2).padStart(4, '0').split('').map(Number).reverse();
              const bBits = busB.toString(2).padStart(4, '0').split('').map(Number).reverse();
              const res = CombinationalEngine.evalCLA4Bit(aBits, bBits, inCin);
              const sumVal = res.sum.slice().reverse().join('');

              return (
                <div className="space-y-6">
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 block mb-1">A (4-Bit): {busA}</label>
                      <input
                        type="number"
                        min="0"
                        max="15"
                        value={busA}
                        onChange={(e) => setBusA(Math.max(0, Math.min(15, parseInt(e.target.value) || 0)))}
                        className="w-full px-3 py-1.5 font-mono text-xs font-bold bg-slate-50 dark:bg-slate-800 border rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 block mb-1">B (4-Bit): {busB}</label>
                      <input
                        type="number"
                        min="0"
                        max="15"
                        value={busB}
                        onChange={(e) => setBusB(Math.max(0, Math.min(15, parseInt(e.target.value) || 0)))}
                        className="w-full px-3 py-1.5 font-mono text-xs font-bold bg-slate-50 dark:bg-slate-800 border rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 block mb-1">Cin</label>
                      <button
                        onClick={() => setInCin(inCin === 1 ? 0 : 1)}
                        className={`w-full py-1.5 rounded-lg font-mono font-bold text-xs ${inCin === 1 ? 'bg-amber-500 text-white' : 'bg-slate-100 dark:bg-slate-800'}`}
                      >
                        Cin = {inCin}
                      </button>
                    </div>
                  </div>

                  <div className="p-5 bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-dashed border-slate-300 dark:border-slate-800 space-y-3">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-slate-400">Generates Gi = Ai·Bi:</span>
                      <span className="font-bold text-blue-600">[{res.generates.slice().reverse().join('')}]</span>
                    </div>
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-slate-400">Propagates Pi = Ai⊕Bi:</span>
                      <span className="font-bold text-indigo-600">[{res.propagates.slice().reverse().join('')}]</span>
                    </div>
                    <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-sm font-mono font-bold">
                      <span>Sum: [{sumVal}]₂ ({parseInt(sumVal, 2)})</span>
                      <span className={res.cout === 1 ? 'text-amber-500 font-bold' : 'text-slate-400'}>
                        Cout = {res.cout}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* CIRCUIT 14: 4-Bit ALU */}
            {selectedCircuit === 'alu_4bit' && (() => {
              const res = CombinationalEngine.evalALU(busA, busB, aluOpcode);
              const opNames = ['ADD (A+B)', 'SUB (A-B)', 'AND (A·B)', 'OR (A+B)', 'XOR (A⊕B)', 'NOT A', 'PASS A', 'PASS B'];

              return (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 block mb-1">Operand A (0-15)</label>
                      <input
                        type="number"
                        min="0"
                        max="15"
                        value={busA}
                        onChange={(e) => setBusA(Math.max(0, Math.min(15, parseInt(e.target.value) || 0)))}
                        className="w-full px-3 py-1.5 font-mono text-sm font-bold bg-slate-50 dark:bg-slate-800 border rounded-xl"
                      />
                      <span className="text-[10px] text-slate-400 font-mono">[{busA.toString(2).padStart(4, '0')}]₂</span>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 block mb-1">Operand B (0-15)</label>
                      <input
                        type="number"
                        min="0"
                        max="15"
                        value={busB}
                        onChange={(e) => setBusB(Math.max(0, Math.min(15, parseInt(e.target.value) || 0)))}
                        className="w-full px-3 py-1.5 font-mono text-sm font-bold bg-slate-50 dark:bg-slate-800 border rounded-xl"
                      />
                      <span className="text-[10px] text-slate-400 font-mono">[{busB.toString(2).padStart(4, '0')}]₂</span>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 block mb-1.5">ALU Operation</label>
                    <div className="grid grid-cols-4 gap-2">
                      {opNames.map((name, op) => (
                        <button
                          key={name}
                          onClick={() => setAluOpcode(op)}
                          className={`py-2 rounded-xl text-xs font-bold transition-all ${
                            aluOpcode === op
                              ? 'bg-blue-600 text-white shadow-xs'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                          }`}
                        >
                          {name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* ALU Output Display & Status Flags */}
                  <div className="p-5 bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-dashed border-slate-300 dark:border-slate-800 space-y-4">
                    <div className="text-center">
                      <div className="text-xs text-slate-400 font-mono">Result: [{res.resultBits}]₂</div>
                      <div className="text-3xl font-mono font-extrabold text-blue-600 dark:text-blue-400 my-1">
                        {res.result}
                      </div>
                    </div>

                    {/* Flags */}
                    <div className="grid grid-cols-4 gap-2 pt-2 border-t border-slate-200 dark:border-slate-800 text-center">
                      <div className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                        <div className="text-[10px] text-slate-400 font-bold">Zero (Z)</div>
                        <div className={`font-mono text-sm font-bold ${res.zero === 1 ? 'text-emerald-500' : 'text-slate-400'}`}>{res.zero}</div>
                      </div>
                      <div className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                        <div className="text-[10px] text-slate-400 font-bold">Carry (C)</div>
                        <div className={`font-mono text-sm font-bold ${res.carry === 1 ? 'text-blue-500' : 'text-slate-400'}`}>{res.carry}</div>
                      </div>
                      <div className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                        <div className="text-[10px] text-slate-400 font-bold">Negative (N)</div>
                        <div className={`font-mono text-sm font-bold ${res.negative === 1 ? 'text-rose-500' : 'text-slate-400'}`}>{res.negative}</div>
                      </div>
                      <div className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                        <div className="text-[10px] text-slate-400 font-bold">Overflow (V)</div>
                        <div className={`font-mono text-sm font-bold ${res.overflow === 1 ? 'text-amber-500' : 'text-slate-400'}`}>{res.overflow}</div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>

        {/* Right: Architectural Notes & Mathematical Equations */}
        <div className="lg:col-span-5 space-y-5">
          <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-slate-800 dark:text-slate-100 font-bold text-sm">
              <BookOpen className="w-4 h-4 text-blue-500" />
              <span>Circuit Equations & Principles</span>
            </div>

            {selectedCircuit === 'half_adder' && (
              <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                <p>Adds two single binary bits A and B to yield Sum and Carry.</p>
                <div className="font-mono text-blue-600 dark:text-blue-400 font-bold bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-lg border border-slate-200 dark:border-slate-700">
                  Sum = A ⊕ B<br />Carry = A · B
                </div>
              </div>
            )}

            {selectedCircuit === 'full_adder' && (
              <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                <p>Adds three single binary bits (A, B, and Carry In) from previous stages.</p>
                <div className="font-mono text-blue-600 dark:text-blue-400 font-bold bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-lg border border-slate-200 dark:border-slate-700">
                  Sum = A ⊕ B ⊕ Cin<br />Cout = A·B + Cin·(A ⊕ B)
                </div>
              </div>
            )}

            {selectedCircuit === 'half_subtractor' && (
              <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                <p>Subtracts subtrahend B from minuend A.</p>
                <div className="font-mono text-blue-600 dark:text-blue-400 font-bold bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-lg border border-slate-200 dark:border-slate-700">
                  Diff = A ⊕ B<br />Borrow = A' · B
                </div>
              </div>
            )}

            {selectedCircuit === 'full_subtractor' && (
              <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                <p>Subtracts B and Borrow In (Bin) from A.</p>
                <div className="font-mono text-blue-600 dark:text-blue-400 font-bold bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-lg border border-slate-200 dark:border-slate-700">
                  Diff = A ⊕ B ⊕ Bin<br />Bout = A'B + Bin·(A ⊕ B)'
                </div>
              </div>
            )}

            {selectedCircuit === 'mux_4to1' && (
              <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                <p>Selects 1 of 4 data lines using two select lines S1 and S0.</p>
                <div className="font-mono text-blue-600 dark:text-blue-400 font-bold bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-lg border border-slate-200 dark:border-slate-700">
                  Y = S1'S0'D0 + S1'S0D1 + S1S0'D2 + S1S0D3
                </div>
              </div>
            )}

            {selectedCircuit === 'alu_4bit' && (
              <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                <p>Central arithmetic core performing arithmetic (ADD, SUB) and bitwise logic with status flags (Z, C, N, V).</p>
                <div className="font-mono text-blue-600 dark:text-blue-400 font-bold bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-lg border border-slate-200 dark:border-slate-700">
                  Z = (Result == 0)<br />
                  C = Carry / Borrow Out<br />
                  N = MSB (Sign bit)<br />
                  V = 2's Complement Overflow
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

