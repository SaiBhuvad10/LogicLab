import { GateId, GateDefinition } from '../types/gates';

export function evaluateGate(gate: GateId, inputs: number[]): number {
  if (inputs.some(val => val !== 0 && val !== 1)) {
    throw new Error(`Invalid binary input value in gate ${gate}: ${JSON.stringify(inputs)}`);
  }

  switch (gate) {
    case 'NOT':
      if (inputs.length < 1) throw new Error('NOT gate requires at least 1 input');
      return inputs[0] === 1 ? 0 : 1;

    case 'AND':
      if (inputs.length < 2) throw new Error('AND gate requires at least 2 inputs');
      return inputs.every(v => v === 1) ? 1 : 0;

    case 'OR':
      if (inputs.length < 2) throw new Error('OR gate requires at least 2 inputs');
      return inputs.some(v => v === 1) ? 1 : 0;

    case 'NAND':
      if (inputs.length < 2) throw new Error('NAND gate requires at least 2 inputs');
      return inputs.every(v => v === 1) ? 0 : 1;

    case 'NOR':
      if (inputs.length < 2) throw new Error('NOR gate requires at least 2 inputs');
      return inputs.some(v => v === 1) ? 0 : 1;

    case 'XOR':
      if (inputs.length < 2) throw new Error('XOR gate requires at least 2 inputs');
      // Odd number of 1s
      return inputs.reduce((acc, v) => acc ^ v, 0);

    case 'XNOR':
      if (inputs.length < 2) throw new Error('XNOR gate requires at least 2 inputs');
      // Inverted XOR for 2 inputs
      return inputs.reduce((acc, v) => acc ^ v, 0) === 1 ? 0 : 1;

    default:
      throw new Error(`Unknown gate type: ${gate}`);
  }
}

export const GATE_DEFINITIONS: Record<GateId, GateDefinition> = {
  AND: {
    id: 'AND',
    name: 'AND Gate',
    expression: 'Y = A · B',
    description: 'Outputs 1 if and only if all of its inputs are 1.',
    inputCount: 2,
    symbolSvg: 'M 10 10 H 35 C 50 10, 50 40, 35 40 H 10 Z',
    truthTable: {
      inputs: [[0, 0], [0, 1], [1, 0], [1, 1]],
      outputs: [0, 0, 0, 1]
    },
    details: 'The AND gate performs logical multiplication. The output is HIGH (1) only when input A AND input B are HIGH (1). In all other conditions, output is LOW (0).',
    booleanLaw: 'A · 0 = 0 | A · 1 = A | A · A = A | A · A\' = 0'
  },
  OR: {
    id: 'OR',
    name: 'OR Gate',
    expression: 'Y = A + B',
    description: 'Outputs 1 if at least one of its inputs is 1.',
    inputCount: 2,
    symbolSvg: 'M 10 10 Q 25 25 10 40 Q 35 40 50 25 Q 35 10 10 10 Z',
    truthTable: {
      inputs: [[0, 0], [0, 1], [1, 0], [1, 1]],
      outputs: [0, 1, 1, 1]
    },
    details: 'The OR gate performs logical addition (disjunction). Output is HIGH (1) if either A OR B (or both) are HIGH. Output is LOW only when all inputs are 0.',
    booleanLaw: 'A + 0 = A | A + 1 = 1 | A + A = A | A + A\' = 1'
  },
  NOT: {
    id: 'NOT',
    name: 'NOT Gate (Inverter)',
    expression: 'Y = A\' (or ¬A)',
    description: 'Inverts the binary signal: 0 becomes 1, and 1 becomes 0.',
    inputCount: 1,
    symbolSvg: 'M 10 10 L 40 25 L 10 40 Z M 40 25 m 3 0 a 3 3 0 1 0 6 0 a 3 3 0 1 0 -6 0',
    truthTable: {
      inputs: [[0], [1]],
      outputs: [1, 0]
    },
    details: 'The NOT gate, also known as an inverter, produces a complement output of its single input. If the input is 0, the output is 1; if the input is 1, the output is 0.',
    booleanLaw: '(A\')\' = A (Double Inversion Law)'
  },
  NAND: {
    id: 'NAND',
    name: 'NAND Gate',
    expression: 'Y = (A · B)\'',
    description: 'Universal gate: outputs 0 only when all inputs are 1.',
    inputCount: 2,
    symbolSvg: 'M 10 10 H 32 C 45 10, 45 40, 32 40 H 10 Z M 44 25 m 3 0 a 3 3 0 1 0 6 0 a 3 3 0 1 0 -6 0',
    truthTable: {
      inputs: [[0, 0], [0, 1], [1, 0], [1, 1]],
      outputs: [1, 1, 1, 0]
    },
    details: 'NAND is a universal logic gate (it can replicate any Boolean function alone). It is equivalent to an AND gate followed by an inverter.',
    booleanLaw: '(A · B)\' = A\' + B\' (De Morgan\'s First Theorem)'
  },
  NOR: {
    id: 'NOR',
    name: 'NOR Gate',
    expression: 'Y = (A + B)\'',
    description: 'Universal gate: outputs 1 only when all inputs are 0.',
    inputCount: 2,
    symbolSvg: 'M 10 10 Q 25 25 10 40 Q 32 40 44 25 Q 32 10 10 10 Z M 44 25 m 3 0 a 3 3 0 1 0 6 0 a 3 3 0 1 0 -6 0',
    truthTable: {
      inputs: [[0, 0], [0, 1], [1, 0], [1, 1]],
      outputs: [1, 0, 0, 0]
    },
    details: 'NOR is also a universal logic gate. It produces a HIGH output only if all inputs are LOW (0). If any input is HIGH, output is LOW.',
    booleanLaw: '(A + B)\' = A\' · B\' (De Morgan\'s Second Theorem)'
  },
  XOR: {
    id: 'XOR',
    name: 'XOR Gate',
    expression: 'Y = A ⊕ B = A\'B + AB\'',
    description: 'Exclusive-OR: outputs 1 when inputs are different.',
    inputCount: 2,
    symbolSvg: 'M 7 10 Q 22 25 7 40 M 13 10 Q 28 25 13 40 Q 35 40 50 25 Q 35 10 13 10 Z',
    truthTable: {
      inputs: [[0, 0], [0, 1], [1, 0], [1, 1]],
      outputs: [0, 1, 1, 0]
    },
    details: 'The XOR (exclusive OR) gate outputs HIGH (1) if the inputs are different (one is 0, the other is 1). If both inputs are equal, output is 0. Widely used in adders and parity checkers.',
    booleanLaw: 'A ⊕ 0 = A | A ⊕ 1 = A\' | A ⊕ A = 0 | A ⊕ A\' = 1'
  },
  XNOR: {
    id: 'XNOR',
    name: 'XNOR Gate',
    expression: 'Y = (A ⊕ B)\' = AB + A\'B\'',
    description: 'Equivalence gate: outputs 1 when inputs are identical.',
    inputCount: 2,
    symbolSvg: 'M 7 10 Q 22 25 7 40 M 13 10 Q 28 25 13 40 Q 32 40 44 25 Q 32 10 13 10 Z M 44 25 m 3 0 a 3 3 0 1 0 6 0 a 3 3 0 1 0 -6 0',
    truthTable: {
      inputs: [[0, 0], [0, 1], [1, 0], [1, 1]],
      outputs: [1, 0, 0, 1]
    },
    details: 'The XNOR (exclusive NOR or equivalence) gate outputs HIGH (1) when both inputs have the same logic level. It is the complement of XOR and functions as a 1-bit equality comparator.',
    booleanLaw: 'A ⊙ B = (A ⊕ B)\' | A ⊙ A = 1 | A ⊙ A\' = 0 | A ⊙ 1 = A'
  }
};

