import React, { useState } from 'react';
import { BooleanEngine } from '../engine/booleanEngine';
import { TruthTableEngine } from '../engine/truthTableEngine';
import { Binary, ArrowRight, CheckCircle2, RotateCcw, BookOpen } from 'lucide-react';

const PRESET_EXPRESSIONS = [
  { label: 'Absorption Law', expr: 'A + A*B' },
  { label: 'Involution / Double Negation', expr: '!!A' },
  { label: 'Idempotent Law', expr: 'A + A' },
  { label: 'Dominance / Annulment', expr: 'A + 1' },
  { label: 'Complement Law', expr: "A * A'" },
  { label: "De Morgan's First Law", expr: "!(A * B)" },
  { label: 'Full Adder Sum Logic', expr: 'A ^ B ^ C' }
];

export const BooleanSolver: React.FC = () => {
  const [expression, setExpression] = useState<string>('A + A*B');

  const parseResult = BooleanEngine.parse(expression);
  const simplification = BooleanEngine.simplifyWithSteps(expression);
  const truthTable = TruthTableEngine.generateFromExpression(expression);

  return (
    <div className="p-4 sm:p-6 max-w-6xl mx-auto space-y-4 sm:space-y-6 select-none">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
          <Binary className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
          <span>Boolean Algebra Solver</span>
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Parse, validate, and simplify Boolean functions with step-by-step law derivations
        </p>
      </div>

      {/* Input Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">
            Enter Boolean Expression
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={expression}
              onChange={(e) => setExpression(e.target.value)}
              placeholder="e.g. A + A*B or !(A + B)"
              className="flex-1 px-3.5 py-2 text-sm font-mono bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-semibold text-slate-900 dark:text-slate-100"
            />
            <button
              onClick={() => setExpression('')}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Quick Presets */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs font-semibold text-slate-500">Presets:</span>
          {PRESET_EXPRESSIONS.map((p) => (
            <button
              key={p.label}
              onClick={() => setExpression(p.expr)}
              className="px-2.5 py-1 text-[11px] font-medium rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 transition-colors"
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {parseResult.isValid ? (
        <div className="space-y-6">
          {/* Step-by-Step Derivation */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-blue-500" />
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  Step-by-Step Algebraic Simplification
                </h3>
              </div>
              <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-lg">
                Minimized: Y = {simplification.simplified}
              </span>
            </div>

            <div className="space-y-3">
              {simplification.steps.map((step) => (
                <div
                  key={step.step}
                  className="flex items-start gap-3 p-3 rounded-xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60"
                >
                  <span className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 font-bold flex items-center justify-center text-xs shrink-0 font-mono">
                    {step.step}
                  </span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div className="font-mono font-bold text-xs text-blue-600 dark:text-blue-400">
                        {step.expression}
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-white dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                        {step.rule}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                      {step.explanation}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Canonical Forms & Truth Table */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                Canonical Minterm Notation (SOP)
              </div>
              <div className="text-sm font-mono font-bold text-blue-600 dark:text-blue-400 mb-1">
                F({truthTable.variables.join(', ')}) = Σm({truthTable.minterms.join(', ') || '0'})
              </div>
              <div className="text-xs font-mono text-slate-600 dark:text-slate-300">
                {truthTable.sopCanonical}
              </div>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                Canonical Maxterm Notation (POS)
              </div>
              <div className="text-sm font-mono font-bold text-indigo-600 dark:text-indigo-400 mb-1">
                F({truthTable.variables.join(', ')}) = ΠM({truthTable.maxterms.join(', ') || '1'})
              </div>
              <div className="text-xs font-mono text-slate-600 dark:text-slate-300">
                {truthTable.posCanonical}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-5 rounded-xl border border-red-200 dark:border-red-900/40 bg-red-50 dark:bg-red-950/30 text-red-600 text-xs">
          <strong>Syntax Error:</strong> {parseResult.error}
        </div>
      )}
    </div>
  );
};

