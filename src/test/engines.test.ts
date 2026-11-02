import { describe, it, expect, beforeEach } from 'vitest';
import { evaluateGate, GATE_DEFINITIONS } from '../engine/gateEngine';
import { CircuitEngine, SimNode, SimEdge } from '../engine/circuitEngine';
import { TruthTableEngine } from '../engine/truthTableEngine';
import { BooleanEngine } from '../engine/booleanEngine';
import { KMapEngine } from '../engine/kmapEngine';
import { NumberSystemEngine } from '../engine/numberSystemEngine';
import { CombinationalEngine } from '../engine/combinationalEngine';
import { FlipFlopEngine } from '../engine/flipFlopEngine';
import { CounterEngine } from '../engine/counterEngine';
import { RegisterEngine } from '../engine/registerEngine';
import { StorageUtil } from '../utils/storage';

describe('LogicLab Engine Verification', () => {
  // 1. All Seven Logic Gates
  describe('Logic Gates', () => {
    it('evaluates AND gate correctly', () => {
      expect(evaluateGate('AND', [0, 0])).toBe(0);
      expect(evaluateGate('AND', [0, 1])).toBe(0);
      expect(evaluateGate('AND', [1, 0])).toBe(0);
      expect(evaluateGate('AND', [1, 1])).toBe(1);
    });

    it('evaluates OR gate correctly', () => {
      expect(evaluateGate('OR', [0, 0])).toBe(0);
      expect(evaluateGate('OR', [0, 1])).toBe(1);
      expect(evaluateGate('OR', [1, 0])).toBe(1);
      expect(evaluateGate('OR', [1, 1])).toBe(1);
    });

    it('evaluates NOT gate correctly', () => {
      expect(evaluateGate('NOT', [0])).toBe(1);
      expect(evaluateGate('NOT', [1])).toBe(0);
    });

    it('evaluates NAND gate correctly', () => {
      expect(evaluateGate('NAND', [0, 0])).toBe(1);
      expect(evaluateGate('NAND', [0, 1])).toBe(1);
      expect(evaluateGate('NAND', [1, 0])).toBe(1);
      expect(evaluateGate('NAND', [1, 1])).toBe(0);
    });

    it('evaluates NOR gate correctly', () => {
      expect(evaluateGate('NOR', [0, 0])).toBe(1);
      expect(evaluateGate('NOR', [0, 1])).toBe(0);
      expect(evaluateGate('NOR', [1, 0])).toBe(0);
      expect(evaluateGate('NOR', [1, 1])).toBe(0);
    });

    it('evaluates XOR gate correctly', () => {
      expect(evaluateGate('XOR', [0, 0])).toBe(0);
      expect(evaluateGate('XOR', [0, 1])).toBe(1);
      expect(evaluateGate('XOR', [1, 0])).toBe(1);
      expect(evaluateGate('XOR', [1, 1])).toBe(0);
    });

    it('evaluates XNOR gate correctly', () => {
      expect(evaluateGate('XNOR', [0, 0])).toBe(1);
      expect(evaluateGate('XNOR', [0, 1])).toBe(0);
      expect(evaluateGate('XNOR', [1, 0])).toBe(0);
      expect(evaluateGate('XNOR', [1, 1])).toBe(1);
    });

    it('contains all 7 gate definitions with expressions', () => {
      const keys = Object.keys(GATE_DEFINITIONS);
      expect(keys).toEqual(['AND', 'OR', 'NOT', 'NAND', 'NOR', 'XOR', 'XNOR']);
    });
  });

  // 2. Truth Table Generation
  describe('Truth Table Generation', () => {
    it('generates 4 rows for 2 variables (A AND B)', () => {
      const result = TruthTableEngine.generateFromExpression('A * B');
      expect(result.isValid).toBe(true);
      expect(result.rows.length).toBe(4);
      expect(result.minterms).toEqual([3]); // only 1 1 is 1
      expect(result.maxterms).toEqual([0, 1, 2]);
    });

    it('generates 8 rows for 3 variables (A + B*C)', () => {
      const result = TruthTableEngine.generateFromExpression('A + B*C');
      expect(result.isValid).toBe(true);
      expect(result.rows.length).toBe(8);
      expect(result.variables).toEqual(['A', 'B', 'C']);
    });

    it('handles inverted variables with prime notation: A*B\'', () => {
      const result = TruthTableEngine.generateFromExpression("A*B'");
      expect(result.isValid).toBe(true);
      // Row 2 is A=1, B=0 -> output = 1
      const row2 = result.rows.find(r => r.inputs.A === 1 && r.inputs.B === 0);
      expect(row2?.output).toBe(1);
    });
  });

  // 3. Number Conversions
  describe('Number Conversions', () => {
    it('converts Binary 1010 to Decimal 10, Octal 12, Hex A', () => {
      const res = NumberSystemEngine.convert('1010', 2, 10);
      expect(res.decimalVal).toBe(10);
      expect(res.octalVal).toBe('12');
      expect(res.hexVal).toBe('A');
    });

    it('converts Decimal 255 to Hex FF and Binary 11111111', () => {
      const res = NumberSystemEngine.convert('255', 10, 16);
      expect(res.output).toBe('FF');
      expect(res.binaryVal).toBe('11111111');
    });

    it('validates invalid inputs per base', () => {
      expect(NumberSystemEngine.isValidForBase('102', 2)).toBe(false);
      expect(NumberSystemEngine.isValidForBase('89', 8)).toBe(false);
      expect(NumberSystemEngine.isValidForBase('1F', 16)).toBe(true);
    });
  });

  // 4. Binary Arithmetic
  describe('Binary Arithmetic', () => {
    it('adds 5 (0101) and 3 (0011) to get 8 (1000)', () => {
      const res = NumberSystemEngine.addBinary('0101', '0011', 4);
      expect(res.resultBits).toBe('1000');
      expect(res.decimalResult).toBe(8);
      expect(res.overflow).toBe(false);
    });

    it('subtracts 7 (0111) - 4 (0100) to get 3 (0011)', () => {
      const res = NumberSystemEngine.subtractBinary('0111', '0100', 4);
      expect(res.resultBits).toBe('0011');
      expect(res.decimalResult).toBe(3);
    });
  });

  // 5. Boolean Simplification
  describe('Boolean Simplification', () => {
    it('simplifies double negation !!A to A', () => {
      const res = BooleanEngine.simplifyWithSteps('!!A');
      expect(res.simplified).toBe('A');
      expect(res.steps.length).toBeGreaterThan(1);
    });

    it('simplifies A + A to A via idempotent law', () => {
      const res = BooleanEngine.simplifyWithSteps('A + A');
      expect(res.simplified).toBe('A');
    });
  });

  // 6. K-Map Minimization
  describe('K-Map Solver', () => {
    it('minimizes 2-variable OR function: minterms 1, 2, 3 -> A + B', () => {
      const sol = KMapEngine.solve(2, [1, 2, 3]);
      expect(sol.sopExpression).toBe("B + A");
    });

    it('minimizes 4-variable complete grid to 1', () => {
      const all16 = Array.from({ length: 16 }, (_, i) => i);
      const sol = KMapEngine.solve(4, all16);
      expect(sol.sopExpression).toBe('1');
    });

    it('simplifies minterms with don\'t cares', () => {
      const sol = KMapEngine.solve(3, [0, 2], [1, 3]); // covers all A=0 row
      expect(sol.sopExpression).toBe("A'");
    });
  });

  // 7. Combinational Adders and Subtractors
  describe('Combinational Adders & Subtractors', () => {
    it('evaluates Half Adder: A=1, B=1 -> Sum=0, Carry=1', () => {
      expect(CombinationalEngine.evalHalfAdder(1, 1)).toEqual({ sum: 0, carry: 1 });
    });

    it('evaluates Full Adder: A=1, B=1, Cin=1 -> Sum=1, Cout=1', () => {
      expect(CombinationalEngine.evalFullAdder(1, 1, 1)).toEqual({ sum: 1, cout: 1 });
    });

    it('evaluates Half Subtractor: A=0, B=1 -> Diff=1, Borrow=1', () => {
      expect(CombinationalEngine.evalHalfSubtractor(0, 1)).toEqual({ diff: 1, borrow: 1 });
    });

    it('evaluates 4-bit CLA fast carries', () => {
      // 9 (LSB-first: [1, 0, 0, 1]) + 7 (LSB-first: [1, 1, 1, 0]) = 16 (Sum: [0, 0, 0, 0], Cout: 1)
      const res = CombinationalEngine.evalCLA4Bit([1, 0, 0, 1], [1, 1, 1, 0], 0);
      expect(res.cout).toBe(1);
      expect(res.sum).toEqual([0, 0, 0, 0]);
    });
  });

  // 8. Multiplexers and Decoders
  describe('MUX and Decoder', () => {
    it('evaluates 4:1 MUX selecting line 2', () => {
      const res = CombinationalEngine.evalMux4to1(0, 0, 1, 0, 1, 0); // S1=1, S0=0 -> select=2 (D2)
      expect(res.select).toBe(2);
      expect(res.y).toBe(1);
    });

    it('evaluates 2:4 Decoder with enable=1', () => {
      const res = CombinationalEngine.evalDecoder2to4(1, 1, 1); // A=1, B=1 -> Y3=1
      expect(res.y3).toBe(1);
      expect(res.y0).toBe(0);
    });
  });

  // 9. Flip-Flop State Transitions
  describe('Flip-Flop Simulator', () => {
    it('handles SR flip-flop toggle and forbidden state', () => {
      // Set
      const setRes = FlipFlopEngine.transition('SR', { s: 1, r: 0 }, 0);
      expect(setRes.nextQ).toBe(1);
      expect(setRes.isInvalid).toBe(false);

      // Forbidden
      const forbidRes = FlipFlopEngine.transition('SR', { s: 1, r: 1 }, 1);
      expect(forbidRes.isInvalid).toBe(true);
    });

    it('handles JK flip-flop toggle state when J=1, K=1', () => {
      const res1 = FlipFlopEngine.transition('JK', { j: 1, k: 1 }, 0);
      expect(res1.nextQ).toBe(1);
      const res2 = FlipFlopEngine.transition('JK', { j: 1, k: 1 }, 1);
      expect(res2.nextQ).toBe(0);
    });
  });

  // 10. Counter Sequences
  describe('Counter Engine', () => {
    it('advances synchronous up counter from 0 to 1 to 2', () => {
      let state = CounterEngine.getInitialState('SYNC_UP', 4);
      expect(state.currentValue).toBe(0);
      state = CounterEngine.tick(state);
      expect(state.currentValue).toBe(1);
      state = CounterEngine.tick(state);
      expect(state.currentValue).toBe(2);
    });

    it('cycles Mod-5 counter from 4 to 0', () => {
      let state = CounterEngine.getInitialState('MOD_N', 3, 5);
      state.currentValue = 4;
      state = CounterEngine.tick(state);
      expect(state.currentValue).toBe(0);
    });

    it('circulates Ring Counter bits properly', () => {
      let state = CounterEngine.getInitialState('RING', 4);
      expect(state.binaryBits.join('')).toBe('1000');
      state = CounterEngine.tick(state);
      expect(state.binaryBits.join('')).toBe('0100');
    });
  });

  // 11. Shift Registers
  describe('Shift Registers', () => {
    it('shifts serial bit into SIPO register', () => {
      let state = RegisterEngine.getInitialState('SIPO', 4, 'RIGHT');
      expect(state.bits).toEqual([0, 0, 0, 0]);
      state.serialIn = 1;
      state = RegisterEngine.tick(state);
      expect(state.bits).toEqual([1, 0, 0, 0]);
      state.serialIn = 0;
      state = RegisterEngine.tick(state);
      expect(state.bits).toEqual([0, 1, 0, 0]);
    });
  });

  // 12. Circuit Dependency Evaluation (DAG & Cycles)
  describe('Circuit Designer Engine', () => {
    it('detects cycles in feedback loop', () => {
      const nodes: SimNode[] = [
        { id: '1', type: 'AND', data: { type: 'AND' } },
        { id: '2', type: 'OR', data: { type: 'OR' } }
      ];
      const edges: SimEdge[] = [
        { id: 'e1', source: '1', target: '2' },
        { id: 'e2', source: '2', target: '1' } // cycle!
      ];
      const check = CircuitEngine.detectCycles(nodes, edges);
      expect(check.hasCycles).toBe(true);
    });

    it('evaluates 2-input AND gate circuit in topological order', () => {
      const nodes: SimNode[] = [
        { id: 'in1', type: 'SWITCH', data: { type: 'SWITCH', value: 1 } },
        { id: 'in2', type: 'SWITCH', data: { type: 'SWITCH', value: 1 } },
        { id: 'g1', type: 'AND', data: { type: 'AND' } },
        { id: 'out1', type: 'LED', data: { type: 'LED' } }
      ];
      const edges: SimEdge[] = [
        { id: 'e1', source: 'in1', target: 'g1', targetHandle: 'in_0' },
        { id: 'e2', source: 'in2', target: 'g1', targetHandle: 'in_1' },
        { id: 'e3', source: 'g1', target: 'out1', targetHandle: 'in' }
      ];

      const sim = CircuitEngine.simulate(nodes, edges);
      expect(sim.hasCycles).toBe(false);
      expect(sim.nodeOutputs['g1']).toBe(1);
      expect(sim.nodeOutputs['out1']).toBe(1);
      expect(sim.activeEdges.has('e3')).toBe(true);
    });
  });

  // 13. LocalStorage persistence
  describe('Storage Utility', () => {
    beforeEach(() => {
      StorageUtil.clearAllData();
    });

    it('saves and retrieves circuits', () => {
      const testCircuit = {
        id: 'test_1',
        name: 'Half Adder Circuit',
        description: 'Simple half adder schematic',
        createdAt: 1000,
        updatedAt: 1000,
        nodes: [{ id: 'n1', type: 'XOR', data: {} }],
        edges: []
      };

      StorageUtil.saveCircuit(testCircuit);
      const circuits = StorageUtil.getCircuits();
      expect(circuits.length).toBe(1);
      expect(circuits[0].name).toBe('Half Adder Circuit');
    });

    it('records quiz attempts', () => {
      const attempt = StorageUtil.recordQuizAttempt({
        topicId: 'logic_gates',
        topicName: 'Logic Gates',
        score: 9,
        total: 10,
        percentage: 90
      });
      expect(attempt.percentage).toBe(90);
      const history = StorageUtil.getQuizHistory();
      expect(history.length).toBe(1);
    });
  });
});
