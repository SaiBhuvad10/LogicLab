import { BooleanEngine } from './booleanEngine';
import { CircuitEngine, SimNode, SimEdge } from './circuitEngine';

export interface TruthTableRow {
  index: number;
  binaryIndex: string;
  inputs: Record<string, number>;
  output: number;
  isMinterm: boolean;
  isMaxterm: boolean;
}

export interface TruthTableResult {
  variables: string[];
  rows: TruthTableRow[];
  minterms: number[];
  maxterms: number[];
  sopCanonical: string;
  posCanonical: string;
  expression: string;
  isValid: boolean;
  error?: string;
}

export class TruthTableEngine {
  /**
   * Generates input combinations for n variables.
   */
  static generateCombinations(variables: string[]): Record<string, number>[] {
    const n = variables.length;
    const totalRows = 1 << n; // 2^n
    const combinations: Record<string, number>[] = [];

    for (let i = 0; i < totalRows; i++) {
      const row: Record<string, number> = {};
      for (let j = 0; j < n; j++) {
        // High-order bit on the left: variables[0] is MSB
        const shift = n - 1 - j;
        row[variables[j]] = (i >> shift) & 1;
      }
      combinations.push(row);
    }

    return combinations;
  }

  /**
   * Evaluates a Boolean expression over all combinations of variables.
   */
  static generateFromExpression(expression: string, customVariables?: string[]): TruthTableResult {
    const parse = BooleanEngine.parse(expression);
    if (!parse.isValid) {
      return {
        variables: customVariables || [],
        rows: [],
        minterms: [],
        maxterms: [],
        sopCanonical: '',
        posCanonical: '',
        expression,
        isValid: false,
        error: parse.error || 'Syntax error'
      };
    }

    // Determine variables: union of parsed and custom
    const varSet = new Set([...parse.variables, ...(customVariables || [])]);
    const variables = Array.from(varSet).sort();
    if (variables.length === 0) {
      return {
        variables: [],
        rows: [],
        minterms: [],
        maxterms: [],
        sopCanonical: '',
        posCanonical: '',
        expression,
        isValid: false,
        error: 'No variables found in expression'
      };
    }

    const combinations = this.generateCombinations(variables);
    const rows: TruthTableRow[] = [];
    const minterms: number[] = [];
    const maxterms: number[] = [];

    combinations.forEach((combo, idx) => {
      let output = 0;
      try {
        output = BooleanEngine.evaluateRPN(parse.rpn, combo);
      } catch (err: any) {
        output = 0;
      }

      const isMinterm = output === 1;
      const isMaxterm = output === 0;

      if (isMinterm) minterms.push(idx);
      if (isMaxterm) maxterms.push(idx);

      rows.push({
        index: idx,
        binaryIndex: idx.toString(2).padStart(variables.length, '0'),
        inputs: combo,
        output,
        isMinterm,
        isMaxterm
      });
    });

    // Canonical SOP: Sum of Minterms
    const sopTerms = minterms.map(m => {
      const row = rows[m].inputs;
      return variables.map(v => (row[v] === 1 ? v : `${v}'`)).join('');
    });
    const sopCanonical = sopTerms.length > 0 ? sopTerms.join(' + ') : '0';

    // Canonical POS: Product of Maxterms
    const posTerms = maxterms.map(m => {
      const row = rows[m].inputs;
      const inner = variables.map(v => (row[v] === 0 ? v : `${v}'`)).join(' + ');
      return `(${inner})`;
    });
    const posCanonical = posTerms.length > 0 ? posTerms.join(' · ') : '1';

    return {
      variables,
      rows,
      minterms,
      maxterms,
      sopCanonical,
      posCanonical,
      expression,
      isValid: true
    };
  }

  /**
   * Generates a truth table directly from a Circuit Designer schematic!
   */
  static generateFromCircuit(nodes: SimNode[], edges: SimEdge[]): {
    inputLabels: string[];
    outputLabels: string[];
    rows: { inputs: number[]; outputs: number[] }[];
  } {
    // 1. Identify input switch/const nodes and output LED/probe nodes
    const inputNodes = nodes.filter(n => n.type === 'SWITCH' || n.data?.type === 'SWITCH');
    const outputNodes = nodes.filter(n => n.type === 'LED' || n.data?.type === 'LED' || n.type === 'PROBE' || n.data?.type === 'PROBE');

    if (inputNodes.length === 0 || outputNodes.length === 0) {
      return { inputLabels: [], outputLabels: [], rows: [] };
    }

    const inputLabels = inputNodes.map((n, i) => n.data?.label || `In_${i + 1}`);
    const outputLabels = outputNodes.map((n, i) => n.data?.label || `Out_${i + 1}`);

    const n = inputNodes.length;
    const totalRows = 1 << n;
    const rows: { inputs: number[]; outputs: number[] }[] = [];

    for (let i = 0; i < totalRows; i++) {
      const inVals: number[] = [];
      const testNodes = nodes.map(node => {
        const inputIdx = inputNodes.findIndex(inNode => inNode.id === node.id);
        if (inputIdx !== -1) {
          const shift = n - 1 - inputIdx;
          const bit = (i >> shift) & 1;
          inVals.push(bit);
          return {
            ...node,
            data: { ...node.data, value: bit }
          };
        }
        return node;
      });

      const simRes = CircuitEngine.simulate(testNodes, edges);
      const outVals = outputNodes.map(outNode => simRes.nodeOutputs[outNode.id] ?? 0);

      rows.push({
        inputs: inVals,
        outputs: outVals
      });
    }

    return { inputLabels, outputLabels, rows };
  }

  /**
   * Formats truth table as CSV.
   */
  static toCSV(table: TruthTableResult): string {
    if (!table.isValid || table.rows.length === 0) return '';
    const headers = [...table.variables, 'Output (Y)'].join(',');
    const lines = table.rows.map(r => {
      const inVals = table.variables.map(v => r.inputs[v]);
      return [...inVals, r.output].join(',');
    });
    return [headers, ...lines].join('\n');
  }

  /**
   * Formats truth table as plain readable text table for copying.
   */
  static toText(table: TruthTableResult): string {
    if (!table.isValid || table.rows.length === 0) return '';
    const header = table.variables.join(' | ') + ' || Y';
    const separator = '-'.repeat(header.length + 4);
    const body = table.rows
      .map(r => {
        const ins = table.variables.map(v => r.inputs[v]).join(' | ');
        return `${ins} || ${r.output}`;
      })
      .join('\n');
    return `${header}\n${separator}\n${body}\n\nCanonical SOP: Σm(${table.minterms.join(', ')}) = ${table.sopCanonical}\nCanonical POS: ΠM(${table.maxterms.join(', ')}) = ${table.posCanonical}`;
  }
}

