export type CellValue = 0 | 1 | 'X';

export interface KMapCell {
  row: number;
  col: number;
  minterm: number;
  value: CellValue;
  binary: string;
}

export interface KMapGroup {
  id: string;
  cells: number[]; // minterm indices
  color: string;
  termSOP: string;
  termPOS: string;
  size: number;
  description: string;
}

export interface KMapSolution {
  varCount: 2 | 3 | 4;
  variables: string[];
  grid: KMapCell[][];
  rowLabels: string[];
  colLabels: string[];
  groups: KMapGroup[];
  sopExpression: string;
  posExpression: string;
  essentialImplicants: string[];
  explanations: string[];
}

const GROUP_COLORS = [
  '#4263EB', // Blue
  '#10B981', // Emerald
  '#F59E0B', // Amber
  '#EC4899', // Pink
  '#8B5CF6', // Purple
  '#06B6D4', // Cyan
  '#EF4444'  // Red
];

export class KMapEngine {
  /**
   * Returns row and col Gray code headers and minterm layout.
   */
  static getLayout(varCount: 2 | 3 | 4): {
    rowLabels: string[];
    colLabels: string[];
    mintermGrid: number[][];
  } {
    if (varCount === 2) {
      return {
        rowLabels: ['0', '1'],
        colLabels: ['0', '1'],
        mintermGrid: [
          [0, 1],
          [2, 3]
        ]
      };
    } else if (varCount === 3) {
      return {
        rowLabels: ['0', '1'],
        colLabels: ['00', '01', '11', '10'],
        mintermGrid: [
          [0, 1, 3, 2],
          [4, 5, 7, 6]
        ]
      };
    } else {
      // 4-variable
      return {
        rowLabels: ['00', '01', '11', '10'],
        colLabels: ['00', '01', '11', '10'],
        mintermGrid: [
          [0, 1, 3, 2],
          [4, 5, 7, 6],
          [12, 13, 15, 14],
          [8, 9, 11, 10]
        ]
      };
    }
  }

  /**
   * Converts cell minterm binary representation to term string.
   */
  static mintermToTerm(minterm: number, varCount: number, variables: string[]): string {
    const bin = minterm.toString(2).padStart(varCount, '0');
    return variables.map((v, i) => (bin[i] === '1' ? v : `${v}'`)).join('');
  }

  /**
   * Generates term expression for a group by eliminating variables that vary.
   */
  static getGroupTerm(
    cells: number[],
    varCount: number,
    variables: string[],
    isPOS: boolean = false
  ): string {
    const bins = cells.map(c => c.toString(2).padStart(varCount, '0'));
    const sopParts: string[] = [];
    const posParts: string[] = [];

    for (let i = 0; i < varCount; i++) {
      const bit0 = bins[0][i];
      const allSame = bins.every(b => b[i] === bit0);

      if (allSame) {
        if (bit0 === '1') {
          sopParts.push(variables[i]);
          posParts.push(`${variables[i]}'`);
        } else {
          sopParts.push(`${variables[i]}'`);
          posParts.push(variables[i]);
        }
      }
    }

    if (sopParts.length === 0) return '1';
    if (isPOS) {
      return posParts.length > 0 ? `(${posParts.join(' + ')})` : '0';
    }
    return sopParts.join('');
  }

  /**
   * Solves K-map for given minterms and optional don't cares.
   */
  static solve(
    varCount: 2 | 3 | 4,
    minterms: number[],
    dontCares: number[] = [],
    customVars?: string[]
  ): KMapSolution {
    const variables = customVars || (varCount === 2 ? ['A', 'B'] : varCount === 3 ? ['A', 'B', 'C'] : ['A', 'B', 'C', 'D']);
    const { rowLabels, colLabels, mintermGrid } = this.getLayout(varCount);

    const mintermSet = new Set(minterms);
    const dontCareSet = new Set(dontCares);

    // Build grid
    const grid: KMapCell[][] = mintermGrid.map((row, r) =>
      row.map((m, c) => {
        let val: CellValue = 0;
        if (mintermSet.has(m)) val = 1;
        else if (dontCareSet.has(m)) val = 'X';

        return {
          row: r,
          col: c,
          minterm: m,
          value: val,
          binary: m.toString(2).padStart(varCount, '0')
        };
      })
    );

    const numRows = rowLabels.length;
    const numCols = colLabels.length;

    // Helper to find all valid rectangular groups of size 2^k
    // Sizes to test: for 4 vars: 16, 8, 4, 2, 1
    const candidateSizes: [number, number][] = [];
    if (varCount === 4) {
      candidateSizes.push([4, 4]); // 16
      candidateSizes.push([4, 2], [2, 4]); // 8
      candidateSizes.push([4, 1], [1, 4], [2, 2]); // 4
      candidateSizes.push([2, 1], [1, 2]); // 2
      candidateSizes.push([1, 1]); // 1
    } else if (varCount === 3) {
      candidateSizes.push([2, 4]); // 8
      candidateSizes.push([2, 2], [1, 4]); // 4
      candidateSizes.push([2, 1], [1, 2]); // 2
      candidateSizes.push([1, 1]); // 1
    } else {
      candidateSizes.push([2, 2]); // 4
      candidateSizes.push([2, 1], [1, 2]); // 2
      candidateSizes.push([1, 1]); // 1
    }

    // Find all prime implicants (covering 1s and Xs)
    interface PotentialGroup {
      cells: number[];
      size: number;
      contains1: boolean;
    }

    const allPrimeImplicants: PotentialGroup[] = [];

    for (const [h, w] of candidateSizes) {
      for (let r = 0; r < numRows; r++) {
        for (let c = 0; c < numCols; c++) {
          const cells: number[] = [];
          let allAllowed = true;
          let hasOne = false;

          for (let dr = 0; dr < h; dr++) {
            for (let dc = 0; dc < w; dc++) {
              const rr = (r + dr) % numRows;
              const cc = (c + dc) % numCols;
              const cellVal = grid[rr][cc].value;

              if (cellVal === 0) {
                allAllowed = false;
                break;
              }
              if (cellVal === 1) hasOne = true;
              cells.push(grid[rr][cc].minterm);
            }
            if (!allAllowed) break;
          }

          if (allAllowed && hasOne) {
            cells.sort((a, b) => a - b);
            const key = cells.join(',');
            if (!allPrimeImplicants.some(g => g.cells.join(',') === key)) {
              allPrimeImplicants.push({
                cells,
                size: cells.length,
                contains1: true
              });
            }
          }
        }
      }
    }

    // Remove groups that are strict subsets of larger groups
    const maximalGroups = allPrimeImplicants.filter(g1 => {
      return !allPrimeImplicants.some(g2 => {
        if (g2.size <= g1.size) return false;
        const g2Set = new Set(g2.cells);
        return g1.cells.every(c => g2Set.has(c));
      });
    });

    // Greedy set cover to select minimal Essential Prime Implicants
    const uncoveredMinterms = new Set(minterms);
    const chosenGroups: PotentialGroup[] = [];

    // First find essential prime implicants (cells covered by only ONE group)
    minterms.forEach(m => {
      const covering = maximalGroups.filter(g => g.cells.includes(m));
      if (covering.length === 1) {
        const epi = covering[0];
        if (!chosenGroups.includes(epi)) {
          chosenGroups.push(epi);
          epi.cells.forEach(c => uncoveredMinterms.delete(c));
        }
      }
    });

    // Cover remaining 1s with largest remaining groups
    while (uncoveredMinterms.size > 0) {
      const candidate = maximalGroups
        .filter(g => !chosenGroups.includes(g))
        .sort((a, b) => {
          const covA = a.cells.filter(c => uncoveredMinterms.has(c)).length;
          const covB = b.cells.filter(c => uncoveredMinterms.has(c)).length;
          return covB - covA || b.size - a.size;
        })[0];

      if (!candidate) break;
      chosenGroups.push(candidate);
      candidate.cells.forEach(c => uncoveredMinterms.delete(c));
    }

    // If minterms was empty: Y = 0
    if (minterms.length === 0) {
      return {
        varCount,
        variables,
        grid,
        rowLabels,
        colLabels,
        groups: [],
        sopExpression: '0',
        posExpression: '0',
        essentialImplicants: [],
        explanations: ['No minterms selected. Output is unconditionally 0.']
      };
    }

    // If all minterms cover the entire map: Y = 1
    const totalCells = numRows * numCols;
    if (minterms.length + dontCares.length >= totalCells && chosenGroups.some(g => g.size === totalCells)) {
      return {
        varCount,
        variables,
        grid,
        rowLabels,
        colLabels,
        groups: [{
          id: 'grp_0',
          cells: Array.from({ length: totalCells }, (_, i) => i),
          color: GROUP_COLORS[0],
          termSOP: '1',
          termPOS: '1',
          size: totalCells,
          description: `Complete map covered (${totalCells} cells). Logic level is HIGH.`
        }],
        sopExpression: '1',
        posExpression: '1',
        essentialImplicants: ['1'],
        explanations: ['Entire grid is covered by a single group. Result simplifies to 1.']
      };
    }

    // Build KMapGroup objects
    const groups: KMapGroup[] = chosenGroups.map((g, idx) => {
      const termSOP = this.getGroupTerm(g.cells, varCount, variables, false);
      const termPOS = this.getGroupTerm(g.cells, varCount, variables, true);
      const color = GROUP_COLORS[idx % GROUP_COLORS.length];

      return {
        id: `grp_${idx + 1}`,
        cells: g.cells,
        color,
        termSOP,
        termPOS,
        size: g.size,
        description: `Group of ${g.size} (minterms: ${g.cells.join(', ')}) produces term "${termSOP}"`
      };
    });

    const sopTerms = groups.map(g => g.termSOP);
    const sopExpression = sopTerms.length > 0 ? sopTerms.join(' + ') : '0';

    // Build POS expression similarly from maxterms (zeros)
    // Complementary simplification
    const zeros = [];
    for (let i = 0; i < totalCells; i++) {
      if (!mintermSet.has(i) && !dontCareSet.has(i)) {
        zeros.push(i);
      }
    }
    const posExpression = zeros.length === 0 ? '1' : groups.map(g => g.termPOS).join(' · ');

    const explanations: string[] = [
      `Grid configured with Gray-code ordering to ensure adjacent cells differ by exactly 1 bit.`,
      `Formed ${groups.length} maximal group(s) of powers of two (sizes: ${groups.map(g => g.size).join(', ')}).`,
      ...groups.map(g => g.description),
      `Final Minimal SOP: ${sopExpression}`
    ];

    return {
      varCount,
      variables,
      grid,
      rowLabels,
      colLabels,
      groups,
      sopExpression,
      posExpression,
      essentialImplicants: sopTerms,
      explanations
    };
  }
}

