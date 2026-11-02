import React, { useState } from 'react';
import {
  NumberSystemEngine,
  Radix,
  ConversionResult,
  BinaryArithmeticResult,
  SignedRepresentationResult
} from '../engine/numberSystemEngine';
import { useAppStore } from '../store/appStore';
import {
  Calculator,
  RotateCcw,
  Copy,
  Check,
  Plus,
  Minus,
  Binary,
  ArrowRight
} from 'lucide-react';

export const NumberSystem: React.FC = () => {
  const { addNotification } = useAppStore();
  const [activeTab, setActiveTab] = useState<'CONVERT' | 'SIGNED' | 'ARITHMETIC'>('CONVERT');

  // Converter state
  const [inputValue, setInputValue] = useState<string>('42');
  const [sourceRadix, setSourceRadix] = useState<Radix>(10);
  const [targetRadix, setTargetRadix] = useState<Radix>(2);

  // Signed state
  const [signedDecimal, setSignedDecimal] = useState<number>(-12);
  const [signedBitLength, setSignedBitLength] = useState<number>(8);

  // Arithmetic state
  const [binA, setBinA] = useState<string>('0101'); // 5
  const [binB, setBinB] = useState<string>('0011'); // 3
  const [arithBitLength, setArithBitLength] = useState<number>(8);

  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (val: string, key: string) => {
    navigator.clipboard.writeText(val);
    setCopiedKey(key);
    addNotification(`Copied: ${val}`, 'success');
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Run conversion
  let conversionResult: ConversionResult | null = null;
  let convError: string | null = null;

  try {
    if (NumberSystemEngine.isValidForBase(inputValue, sourceRadix)) {
      conversionResult = NumberSystemEngine.convert(inputValue, sourceRadix, targetRadix);
    } else {
      convError = `Invalid characters for base ${sourceRadix}`;
    }
  } catch (e: any) {
    convError = e.message;
  }

  // Signed representation
  const signedResult: SignedRepresentationResult = NumberSystemEngine.getSignedRepresentations(
    signedDecimal,
    signedBitLength
  );

  // Arithmetic results
  const addResult: BinaryArithmeticResult = NumberSystemEngine.addBinary(binA, binB, arithBitLength);
  const subResult: BinaryArithmeticResult = NumberSystemEngine.subtractBinary(binA, binB, arithBitLength);

  return (
    <div className="p-4 sm:p-6 max-w-6xl mx-auto space-y-4 sm:space-y-6 select-none">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
          <Calculator className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
          <span>Number System Converter & Arithmetic</span>
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Positional radix conversions, signed complements, and bit-level binary arithmetic
        </p>
      </div>

      {/* Mode Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto no-scrollbar">
        {[
          { id: 'CONVERT', label: 'Base Converter (Step-by-Step)' },
          { id: 'SIGNED', label: "1's & 2's Complement" },
          { id: 'ARITHMETIC', label: 'Binary Addition & Subtraction' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === tab.id
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: Base Converter */}
      {activeTab === 'CONVERT' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Input Value */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  Enter Number Value
                </label>
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="w-full px-3.5 py-2 font-mono text-sm font-bold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 uppercase"
                />
              </div>

              {/* Source Radix */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  Source Base (From)
                </label>
                <select
                  value={sourceRadix}
                  onChange={(e) => setSourceRadix(parseInt(e.target.value) as Radix)}
                  className="w-full px-3 py-2 text-xs font-semibold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value={2}>Base 2 (Binary)</option>
                  <option value={8}>Base 8 (Octal)</option>
                  <option value={10}>Base 10 (Decimal)</option>
                  <option value={16}>Base 16 (Hexadecimal)</option>
                </select>
              </div>

              {/* Target Radix */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  Target Base (To)
                </label>
                <select
                  value={targetRadix}
                  onChange={(e) => setTargetRadix(parseInt(e.target.value) as Radix)}
                  className="w-full px-3 py-2 text-xs font-semibold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value={2}>Base 2 (Binary)</option>
                  <option value={8}>Base 8 (Octal)</option>
                  <option value={10}>Base 10 (Decimal)</option>
                  <option value={16}>Base 16 (Hexadecimal)</option>
                </select>
              </div>
            </div>

            {/* Quick Presets */}
            <div className="flex items-center gap-1.5 flex-wrap pt-2">
              <span className="text-xs font-semibold text-slate-500">Quick Samples:</span>
              {[
                { val: '255', base: 10 },
                { val: '101010', base: 2 },
                { val: '77', base: 8 },
                { val: 'FF', base: 16 },
                { val: '1024', base: 10 }
              ].map((s) => (
                <button
                  key={s.val}
                  onClick={() => {
                    setInputValue(s.val);
                    setSourceRadix(s.base as Radix);
                  }}
                  className="px-2.5 py-1 text-xs font-mono rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-900/30 text-slate-700 dark:text-slate-300"
                >
                  {s.val} (Base {s.base})
                </button>
              ))}
            </div>
          </div>

          {/* Results Summary in all 4 bases */}
          {conversionResult ? (
            <div className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { name: 'Binary (Base 2)', val: conversionResult.binaryVal, key: 'bin' },
                  { name: 'Octal (Base 8)', val: conversionResult.octalVal, key: 'oct' },
                  { name: 'Decimal (Base 10)', val: conversionResult.decimalVal.toString(), key: 'dec' },
                  { name: 'Hex (Base 16)', val: conversionResult.hexVal, key: 'hex' }
                ].map((item) => (
                  <div
                    key={item.name}
                    className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs flex flex-col justify-between"
                  >
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                        {item.name}
                      </div>
                      <div className="text-lg font-mono font-extrabold text-blue-600 dark:text-blue-400 break-words">
                        {item.val}
                      </div>
                    </div>
                    <button
                      onClick={() => handleCopy(item.val, item.key)}
                      className="mt-3 flex items-center gap-1 text-[11px] font-semibold text-slate-500 hover:text-blue-600 transition-colors"
                    >
                      {copiedKey === item.key ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                      {copiedKey === item.key ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                ))}
              </div>

              {/* Step-by-Step Working */}
              <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-3">
                  Step-by-Step Mathematical Working
                </h3>
                <div className="space-y-2.5">
                  {conversionResult.steps.map((st) => (
                    <div
                      key={st.step}
                      className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 flex items-start gap-3"
                    >
                      <span className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 font-bold flex items-center justify-center text-xs shrink-0 font-mono">
                        {st.step}
                      </span>
                      <div className="flex-1">
                        <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                          {st.description}
                        </div>
                        <div className="font-mono text-xs text-blue-600 dark:text-blue-400 mt-0.5">
                          {st.expression}
                        </div>
                        <div className="font-mono text-xs font-bold text-slate-900 dark:text-slate-100 mt-1">
                          {st.result}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-xl border border-red-200 dark:border-red-900/40 bg-red-50 dark:bg-red-950/30 text-red-600 text-xs">
              {convError || 'Invalid input'}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: 1's & 2's Complement */}
      {activeTab === 'SIGNED' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  Signed Decimal Number (-128 to +127 for 8-bit)
                </label>
                <input
                  type="number"
                  value={signedDecimal}
                  onChange={(e) => setSignedDecimal(parseInt(e.target.value) || 0)}
                  className="w-full px-3.5 py-2 font-mono text-sm font-bold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  Register Bit Length
                </label>
                <div className="flex items-center gap-2">
                  {[4, 8, 16].map((len) => (
                    <button
                      key={len}
                      onClick={() => setSignedBitLength(len)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                        signedBitLength === len
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      {len}-Bit
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Signed Output Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                Sign-Magnitude Representation
              </div>
              <div className="text-xl font-mono font-extrabold text-blue-600 dark:text-blue-400">
                {signedResult.signMagnitude}
              </div>
              <p className="text-[11px] text-slate-400 mt-2">
                MSB = {signedResult.signMagnitude[0]} ({signedResult.isNegative ? 'Negative' : 'Positive'})
              </p>
            </div>

            <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                1's Complement Representation
              </div>
              <div className="text-xl font-mono font-extrabold text-indigo-600 dark:text-indigo-400">
                {signedResult.onesComplement}
              </div>
              <p className="text-[11px] text-slate-400 mt-2">
                {signedResult.isNegative
                  ? 'All magnitude bits inverted'
                  : 'Positive number matches magnitude'}
              </p>
            </div>

            <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                2's Complement Representation
              </div>
              <div className="text-xl font-mono font-extrabold text-emerald-600 dark:text-emerald-400">
                {signedResult.twosComplement}
              </div>
              <p className="text-[11px] text-slate-400 mt-2">
                Standard format used by modern ALU registers
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-500">
            <strong>Register Range ({signedBitLength}-bit):</strong> [{signedResult.rangeMin} to +{signedResult.rangeMax}]
          </div>
        </div>
      )}

      {/* TAB 3: Binary Arithmetic */}
      {activeTab === 'ARITHMETIC' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  Operand A (Binary)
                </label>
                <input
                  type="text"
                  value={binA}
                  onChange={(e) => setBinA(e.target.value.replace(/[^01]/g, ''))}
                  className="w-full px-3.5 py-2 font-mono text-sm font-bold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
                <span className="text-[10px] text-slate-400 font-mono">
                  Decimal: {parseInt(binA || '0', 2)}
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  Operand B (Binary)
                </label>
                <input
                  type="text"
                  value={binB}
                  onChange={(e) => setBinB(e.target.value.replace(/[^01]/g, ''))}
                  className="w-full px-3.5 py-2 font-mono text-sm font-bold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
                <span className="text-[10px] text-slate-400 font-mono">
                  Decimal: {parseInt(binB || '0', 2)}
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  Bit Width
                </label>
                <div className="flex items-center gap-2">
                  {[4, 8, 16].map((bits) => (
                    <button
                      key={bits}
                      onClick={() => setArithBitLength(bits)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                        arithBitLength === bits
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      {bits}-Bit
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Addition & Subtraction Visual Calculations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Binary Addition */}
            <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
                <Plus className="w-4 h-4 text-emerald-500" />
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  Binary Addition (A + B)
                </h3>
              </div>

              <div className="font-mono text-sm space-y-1 bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-200 dark:border-slate-700/60">
                <div className="text-amber-500 text-xs">
                  Carry:&nbsp; {addResult.carryBits}
                </div>
                <div className="text-slate-700 dark:text-slate-200">
                  &nbsp; &nbsp; &nbsp; &nbsp; {addResult.operandA} ({parseInt(addResult.operandA, 2)})
                </div>
                <div className="text-slate-700 dark:text-slate-200">
                  + &nbsp; &nbsp; &nbsp;{addResult.operandB} ({parseInt(addResult.operandB, 2)})
                </div>
                <div className="border-t-2 border-slate-400 dark:border-slate-600 pt-1 font-bold text-blue-600 dark:text-blue-400 text-base">
                  = &nbsp; &nbsp; &nbsp;{addResult.resultBits} ({addResult.decimalResult})
                </div>
              </div>

              <p className="text-xs text-slate-500 leading-relaxed">
                {addResult.explanation}
              </p>
            </div>

            {/* Binary Subtraction */}
            <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
                <Minus className="w-4 h-4 text-indigo-500" />
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  Binary Subtraction (A - B) via 2's Comp
                </h3>
              </div>

              <div className="font-mono text-sm space-y-1 bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-200 dark:border-slate-700/60">
                <div className="text-slate-700 dark:text-slate-200">
                  &nbsp; &nbsp; &nbsp; &nbsp; {subResult.operandA} ({parseInt(subResult.operandA, 2)})
                </div>
                <div className="text-slate-700 dark:text-slate-200">
                  - &nbsp; &nbsp; &nbsp;{subResult.operandB} ({parseInt(subResult.operandB, 2)})
                </div>
                <div className="border-t-2 border-slate-400 dark:border-slate-600 pt-1 font-bold text-indigo-600 dark:text-indigo-400 text-base">
                  = &nbsp; &nbsp; &nbsp;{subResult.resultBits} ({subResult.decimalResult})
                </div>
              </div>

              <p className="text-xs text-slate-500 leading-relaxed">
                {subResult.explanation}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

