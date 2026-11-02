import React, { useState } from 'react';
import { TruthTableEngine, TruthTableResult } from '../engine/truthTableEngine';
import { useCircuitStore } from '../store/circuitStore';
import { useAppStore } from '../store/appStore';
import {
  TableProperties,
  Copy,
  Download,
  RotateCcw,
  Sparkles,
  Workflow,
  Check
} from 'lucide-react';

const PRESETS = [
  { label: 'Half Adder Sum', expr: 'A ^ B', vars: ['A', 'B'] },
  { label: 'Half Adder Carry', expr: 'A * B', vars: ['A', 'B'] },
  { label: 'Full Adder Sum', expr: 'A ^ B ^ C', vars: ['A', 'B', 'C'] },
  { label: 'Full Adder Carry', expr: '(A * B) + (C * (A ^ B))', vars: ['A', 'B', 'C'] },
  { label: '2:1 MUX', expr: "(S' * A) + (S * B)", vars: ['S', 'A', 'B'] },
  { label: "De Morgan's Theorem", expr: "!(A + B)", vars: ['A', 'B'] },
  { label: 'Majority Function (3-Var)', expr: '(A*B) + (B*C) + (A*C)', vars: ['A', 'B', 'C'] }
];

export const TruthTable: React.FC = () => {
  const [expression, setExpression] = useState<string>('A * B');
  const [varCount, setVarCount] = useState<number>(2);
  const [copied, setCopied] = useState<boolean>(false);
  const { addNotification } = useAppStore();
  const { nodes, edges } = useCircuitStore();

  const activeVars = ['A', 'B', 'C', 'D'].slice(0, varCount);

  // Generate table
  const tableResult: TruthTableResult = TruthTableEngine.generateFromExpression(
    expression,
    activeVars
  );

  const handleInsertOperator = (op: string) => {
    setExpression((prev) => prev + op);
  };

  const handleCopy = () => {
    const text = TruthTableEngine.toText(tableResult);
    navigator.clipboard.writeText(text);
    setCopied(true);
    addNotification('Truth table copied to clipboard!', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExportCSV = () => {
    const csv = TruthTableEngine.toCSV(tableResult);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `truth_table_${varCount}vars.csv`;
    a.click();
    URL.revokeObjectURL(url);
    addNotification('Truth table exported as CSV file', 'info');
  };

  const handleGenerateFromCircuit = () => {
    const res = TruthTableEngine.generateFromCircuit(
      nodes.map((n) => ({ id: n.id, type: (n.data?.type || 'AND') as any, data: n.data || {} })),
      edges.map((e) => ({ id: e.id, source: e.source, target: e.target, sourceHandle: e.sourceHandle, targetHandle: e.targetHandle }))
    );

    if (res.inputLabels.length === 0 || res.outputLabels.length === 0) {
      addNotification('Current circuit needs at least 1 Switch input and 1 LED output', 'warning');
      return;
    }

    addNotification(`Generated truth table from ${res.inputLabels.length} inputs and ${res.outputLabels.length} outputs!`, 'success');
  };

  return (
    <div className="p-4 sm:p-6 max-w-6xl mx-auto space-y-4 sm:space-y-6 select-none">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
          <TableProperties className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
          <span>Truth Table Generator</span>
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Compute complete 2ⁿ state combinations, canonical minterm/maxterm expansions, and export CSV data
        </p>
      </div>

      {/* Configuration Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-4">
        {/* Variable count & Presets */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
              Variables:
            </span>
            {[1, 2, 3, 4].map((count) => (
              <button
                key={count}
                onClick={() => setVarCount(count)}
                className={`w-9 h-8 rounded-lg text-xs font-bold transition-all ${
                  varCount === count
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                {count} ({Math.pow(2, count)})
              </button>
            ))}
          </div>

          {/* Quick Presets */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <Sparkles className="w-3.5 h-3.5 text-blue-500" />
            <span className="text-xs font-semibold text-slate-500">Presets:</span>
            {PRESETS.map((p) => (
              <button
                key={p.label}
                onClick={() => {
                  setExpression(p.expr);
                  setVarCount(p.vars.length);
                }}
                className="px-2.5 py-1 text-[11px] font-medium rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 transition-colors"
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Expression Input & Quick Keypad */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">
            Boolean Expression
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={expression}
              onChange={(e) => setExpression(e.target.value)}
              placeholder="e.g. A * B + C' or A XOR B"
              className="flex-1 px-3.5 py-2 text-sm font-mono bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-semibold text-slate-900 dark:text-slate-100"
            />
            <button
              onClick={() => setExpression('')}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Clear Expression"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {/* Keypad Buttons */}
          <div className="flex items-center gap-1.5 mt-2 flex-wrap">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mr-1">
              Insert:
            </span>
            {['A', 'B', 'C', 'D'].slice(0, varCount).map((v) => (
              <button
                key={v}
                onClick={() => handleInsertOperator(v)}
                className="px-2.5 py-1 text-xs font-mono font-bold rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200"
              >
                {v}
              </button>
            ))}
            {[
              { label: 'AND (·)', val: ' * ' },
              { label: 'OR (+)', val: ' + ' },
              { label: "NOT (')", val: "'" },
              { label: 'XOR (⊕)', val: ' ^ ' },
              { label: '(', val: '(' },
              { label: ')', val: ')' }
            ].map((btn) => (
              <button
                key={btn.label}
                onClick={() => handleInsertOperator(btn.val)}
                className="px-2.5 py-1 text-xs font-mono font-medium rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-100 transition-colors"
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 sm:gap-4 pt-3 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={handleGenerateFromCircuit}
            className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-medium transition-colors"
          >
            <Workflow className="w-3.5 h-3.5 text-blue-500" /> Generate from Circuit Schematic
          </button>

          <div className="flex items-center justify-end gap-2">
            <button
              onClick={handleCopy}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-medium transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied!' : 'Copy Table'}
            </button>
            <button
              onClick={handleExportCSV}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
            >
              <Download className="w-3.5 h-3.5" /> Export CSV
            </button>
          </div>
        </div>
      </div>

      {/* Results Display */}
      {tableResult.isValid ? (
        <div className="space-y-6">
          {/* Canonical Forms Card */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                Canonical Sum of Products (SOP)
              </div>
              <div className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400 mb-1">
                Σm({tableResult.minterms.join(', ') || '∅'})
              </div>
              <div className="text-xs font-mono text-slate-700 dark:text-slate-300 break-words">
                Y = {tableResult.sopCanonical}
              </div>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                Canonical Product of Sums (POS)
              </div>
              <div className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400 mb-1">
                ΠM({tableResult.maxterms.join(', ') || '∅'})
              </div>
              <div className="text-xs font-mono text-slate-700 dark:text-slate-300 break-words">
                Y = {tableResult.posCanonical}
              </div>
            </div>
          </div>

          {/* Truth Table */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <span className="font-bold text-sm text-slate-900 dark:text-white">
                Generated State Table ({tableResult.rows.length} Rows)
              </span>
              <span className="text-xs font-mono text-slate-400">
                Minterms: {tableResult.minterms.length} | Maxterms: {tableResult.maxterms.length}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-center text-xs font-mono">
                <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="py-2.5 px-3">Row #</th>
                    <th className="py-2.5 px-3">Binary</th>
                    {tableResult.variables.map((v) => (
                      <th key={v} className="py-2.5 px-3">
                        {v}
                      </th>
                    ))}
                    <th className="py-2.5 px-3 text-blue-600 dark:text-blue-400">
                      Output (Y)
                    </th>
                    <th className="py-2.5 px-3">Designation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {tableResult.rows.map((row) => (
                    <tr
                      key={row.index}
                      className={`hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors ${
                        row.output === 1
                          ? 'bg-blue-50/40 dark:bg-blue-950/20'
                          : ''
                      }`}
                    >
                      <td className="py-2 px-3 text-slate-400">{row.index}</td>
                      <td className="py-2 px-3 text-slate-500 font-mono">
                        {row.binaryIndex}
                      </td>
                      {tableResult.variables.map((v) => (
                        <td key={v} className="py-2 px-3">
                          {row.inputs[v]}
                        </td>
                      ))}
                      <td className="py-2 px-3 font-bold">
                        <span
                          className={`inline-block w-5 h-5 rounded leading-5 text-center ${
                            row.output === 1
                              ? 'bg-emerald-500 text-white font-bold'
                              : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                          }`}
                        >
                          {row.output}
                        </span>
                      </td>
                      <td className="py-2 px-3">
                        {row.isMinterm ? (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400">
                            m{row.index}
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">
                            M{row.index}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-6 rounded-xl border border-red-200 dark:border-red-900/40 bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 text-xs">
          <strong>Syntax Error:</strong> {tableResult.error || 'Unable to parse Boolean expression'}. Check for matching parentheses or missing operators.
        </div>
      )}
    </div>
  );
};

