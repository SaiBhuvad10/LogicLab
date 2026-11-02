import React, { useState } from 'react';
import { KMapEngine, KMapSolution, CellValue } from '../engine/kmapEngine';
import { Grid, Sparkles, RotateCcw, Info, CheckCircle2 } from 'lucide-react';

export const KMapSolver: React.FC = () => {
  const [varCount, setVarCount] = useState<2 | 3 | 4>(3);
  const [minterms, setMinterms] = useState<number[]>([1, 3, 5, 7]);
  const [dontCares, setDontCares] = useState<number[]>([]);

  const totalCells = 1 << varCount;

  // Solve K-map
  const solution: KMapSolution = KMapEngine.solve(varCount, minterms, dontCares);

  const toggleCell = (m: number) => {
    if (minterms.includes(m)) {
      // 1 -> X
      setMinterms(minterms.filter((x) => x !== m));
      setDontCares([...dontCares, m]);
    } else if (dontCares.includes(m)) {
      // X -> 0
      setDontCares(dontCares.filter((x) => x !== m));
    } else {
      // 0 -> 1
      setMinterms([...minterms, m]);
    }
  };

  const handleClear = () => {
    setMinterms([]);
    setDontCares([]);
  };

  const applyPreset = (vars: 2 | 3 | 4, m: number[], d: number[] = []) => {
    setVarCount(vars);
    setMinterms(m);
    setDontCares(d);
  };

  // Find if cell belongs to any group
  const getCellGroupColors = (m: number): string[] => {
    return solution.groups.filter((g) => g.cells.includes(m)).map((g) => g.color);
  };

  return (
    <div className="p-4 sm:p-6 max-w-6xl mx-auto space-y-4 sm:space-y-6 select-none">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
          <Grid className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
          <span>Karnaugh Map (K-Map) Solver</span>
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Minimize 2, 3, and 4-variable Boolean expressions with Gray-code adjacent grouping
        </p>
      </div>

      {/* Control Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Variable count selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
              Variables:
            </span>
            {([2, 3, 4] as const).map((count) => (
              <button
                key={count}
                onClick={() => {
                  setVarCount(count);
                  setMinterms(minterms.filter((m) => m < 1 << count));
                  setDontCares(dontCares.filter((d) => d < 1 << count));
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  varCount === count
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                {count} Vars ({count === 2 ? 'A, B' : count === 3 ? 'A, BC' : 'AB, CD'})
              </button>
            ))}
          </div>

          {/* Preset Buttons */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <Sparkles className="w-3.5 h-3.5 text-blue-500" />
            <span className="text-xs font-semibold text-slate-500">Presets:</span>
            <button
              onClick={() => applyPreset(3, [1, 3, 5, 7])}
              className="px-2.5 py-1 text-[11px] font-medium rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-900/30 text-slate-700 dark:text-slate-300"
            >
              Odd Function (3-Var)
            </button>
            <button
              onClick={() => applyPreset(3, [3, 5, 6, 7])}
              className="px-2.5 py-1 text-[11px] font-medium rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-900/30 text-slate-700 dark:text-slate-300"
            >
              Majority (3-Var)
            </button>
            <button
              onClick={() => applyPreset(4, [10, 11, 12, 13, 14, 15], [])}
              className="px-2.5 py-1 text-[11px] font-medium rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-900/30 text-slate-700 dark:text-slate-300"
            >
              BCD Invalid States
            </button>
            <button
              onClick={() => applyPreset(4, [0, 2, 8, 10])}
              className="px-2.5 py-1 text-[11px] font-medium rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-900/30 text-slate-700 dark:text-slate-300"
            >
              4 Corners Wrap
            </button>
            <button
              onClick={handleClear}
              className="px-2.5 py-1 text-[11px] font-medium rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 text-slate-500 flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" /> Clear
            </button>
          </div>
        </div>

        <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
          <Info className="w-3.5 h-3.5 text-blue-500" />
          <span>Click any cell to cycle its value: <strong>0 ➔ 1 ➔ X (Don't Care) ➔ 0</strong></span>
        </div>
      </div>

      {/* Grid and Output Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Interactive Gray-Code Grid */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs flex flex-col items-center">
          <div className="mb-4 text-center">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              {varCount}-Variable Karnaugh Map Grid
            </span>
            <div className="text-[11px] text-slate-500 mt-0.5">
              Gray Code: Rows (
              {varCount === 2 ? 'A' : varCount === 3 ? 'A' : 'AB'}) × Columns (
              {varCount === 2 ? 'B' : varCount === 3 ? 'BC' : 'CD'})
            </div>
          </div>

          <div className="overflow-x-auto p-4">
            <table className="border-collapse">
              <thead>
                <tr>
                  <th className="p-3 text-xs font-mono font-bold text-slate-400 text-right pr-4">
                    {varCount === 2 ? 'A \\ B' : varCount === 3 ? 'A \\ BC' : 'AB \\ CD'}
                  </th>
                  {solution.colLabels.map((colHeader) => (
                    <th
                      key={colHeader}
                      className="p-3 text-xs font-mono font-bold text-blue-600 dark:text-blue-400 text-center w-16"
                    >
                      {colHeader}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {solution.grid.map((row, rIdx) => (
                  <tr key={rIdx}>
                    <td className="p-3 text-xs font-mono font-bold text-blue-600 dark:text-blue-400 text-right pr-4">
                      {solution.rowLabels[rIdx]}
                    </td>
                    {row.map((cell) => {
                      const colors = getCellGroupColors(cell.minterm);
                      const isCovered = colors.length > 0;
                      const primaryColor = colors[0];

                      return (
                        <td key={cell.minterm} className="p-1">
                          <button
                            onClick={() => toggleCell(cell.minterm)}
                            style={{
                              borderColor: primaryColor || undefined,
                              boxShadow: primaryColor ? `0 0 10px ${primaryColor}40` : undefined
                            }}
                            className={`w-16 h-16 rounded-xl border-2 flex flex-col items-center justify-center font-mono transition-all cursor-pointer relative ${
                              cell.value === 1
                                ? 'bg-blue-500/10 dark:bg-blue-900/30 font-bold text-slate-900 dark:text-white'
                                : cell.value === 'X'
                                ? 'bg-amber-500/10 font-bold text-amber-600 dark:text-amber-400'
                                : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-400 hover:border-slate-400'
                            }`}
                          >
                            <span className="text-lg font-bold">
                              {cell.value}
                            </span>
                            <span className="text-[9px] text-slate-400 font-mono">
                              m{cell.minterm}
                            </span>

                            {/* Group color dot indicators */}
                            {colors.length > 0 && (
                              <div className="absolute top-1 right-1 flex gap-0.5">
                                {colors.map((c, i) => (
                                  <span
                                    key={i}
                                    style={{ backgroundColor: c }}
                                    className="w-1.5 h-1.5 rounded-full"
                                  />
                                ))}
                              </div>
                            )}
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center gap-4 text-xs text-slate-400 mt-3">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-blue-500/20 border border-blue-500" />
              1: Minterm
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-amber-500/20 border border-amber-500" />
              X: Don't Care
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-slate-100 dark:bg-slate-800 border border-slate-300" />
              0: Inactive
            </span>
          </div>
        </div>

        {/* Right: Minimized Expressions & Group Explanations */}
        <div className="lg:col-span-5 space-y-5">
          {/* Minimized SOP */}
          <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Minimal Sum of Products (SOP)
            </div>
            <div className="text-lg font-mono font-extrabold text-blue-600 dark:text-blue-400 mb-2">
              Y = {solution.sopExpression}
            </div>
            <div className="text-xs text-slate-400 font-mono">
              F({solution.variables.join(',')}) = Σm({minterms.join(',') || '∅'})
              {dontCares.length > 0 && ` + d(${dontCares.join(',')})`}
            </div>
          </div>

          {/* Minimized POS */}
          <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Minimal Product of Sums (POS)
            </div>
            <div className="text-base font-mono font-bold text-indigo-600 dark:text-indigo-400 mb-1">
              Y = {solution.posExpression}
            </div>
          </div>

          {/* Adjacent Groups Found */}
          <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-3">
              Essential Prime Implicant Groups ({solution.groups.length})
            </h3>

            {solution.groups.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No groups formed (function is 0)</p>
            ) : (
              <div className="space-y-2">
                {solution.groups.map((group) => (
                  <div
                    key={group.id}
                    className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <span
                        style={{ backgroundColor: group.color }}
                        className="w-3.5 h-3.5 rounded-md shrink-0 shadow-xs"
                      />
                      <div>
                        <div className="font-mono font-bold text-slate-800 dark:text-slate-100">
                          {group.termSOP}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          Covered: [{group.cells.join(', ')}] (Size {group.size})
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400">
                      Eliminates {Math.log2(group.size)} vars
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Grouping Step-by-Step Explanation */}
          <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-2">
              Derivation Notes & Torus Wrap
            </h3>
            <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
              {solution.explanations.map((exp, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{exp}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

