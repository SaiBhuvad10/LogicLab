import { SavedCircuit } from '../types/circuit';

export const PRESET_CIRCUITS: SavedCircuit[] = [
  {
    id: 'preset_half_adder',
    name: 'Half Adder Schematic',
    description: 'Computes 1-bit binary addition: Sum = A ⊕ B, Carry = A · B.',
    createdAt: 1710000000000,
    updatedAt: 1710000000000,
    nodes: [
      {
        id: 'in_a',
        type: 'SWITCH',
        position: { x: 80, y: 120 },
        data: { label: 'Input A', type: 'SWITCH', value: 1 }
      },
      {
        id: 'in_b',
        type: 'SWITCH',
        position: { x: 80, y: 260 },
        data: { label: 'Input B', type: 'SWITCH', value: 1 }
      },
      {
        id: 'gate_xor',
        type: 'XOR',
        position: { x: 300, y: 100 },
        data: { label: 'XOR Gate', type: 'XOR' }
      },
      {
        id: 'gate_and',
        type: 'AND',
        position: { x: 300, y: 280 },
        data: { label: 'AND Gate', type: 'AND' }
      },
      {
        id: 'out_sum',
        type: 'LED',
        position: { x: 540, y: 100 },
        data: { label: 'Sum (S)', type: 'LED', color: '#10B981' }
      },
      {
        id: 'out_carry',
        type: 'LED',
        position: { x: 540, y: 280 },
        data: { label: 'Carry (C)', type: 'LED', color: '#4263EB' }
      }
    ],
    edges: [
      { id: 'e1', source: 'in_a', target: 'gate_xor', targetHandle: 'in_0', animated: true },
      { id: 'e2', source: 'in_b', target: 'gate_xor', targetHandle: 'in_1', animated: true },
      { id: 'e3', source: 'in_a', target: 'gate_and', targetHandle: 'in_0', animated: true },
      { id: 'e4', source: 'in_b', target: 'gate_and', targetHandle: 'in_1', animated: true },
      { id: 'e5', source: 'gate_xor', target: 'out_sum', targetHandle: 'in', animated: true },
      { id: 'e6', source: 'gate_and', target: 'out_carry', targetHandle: 'in', animated: true }
    ]
  },
  {
    id: 'preset_mux_2to1',
    name: '2:1 Multiplexer with Logic Gates',
    description: 'Selects between D0 and D1 using select line S: Y = S\'·D0 + S·D1.',
    createdAt: 1710000000000,
    updatedAt: 1710000000000,
    nodes: [
      {
        id: 'in_d0',
        type: 'SWITCH',
        position: { x: 60, y: 80 },
        data: { label: 'Data D0', type: 'SWITCH', value: 1 }
      },
      {
        id: 'in_d1',
        type: 'SWITCH',
        position: { x: 60, y: 220 },
        data: { label: 'Data D1', type: 'SWITCH', value: 0 }
      },
      {
        id: 'in_sel',
        type: 'SWITCH',
        position: { x: 60, y: 360 },
        data: { label: 'Select (S)', type: 'SWITCH', value: 0 }
      },
      {
        id: 'gate_not',
        type: 'NOT',
        position: { x: 240, y: 360 },
        data: { label: 'NOT Gate', type: 'NOT' }
      },
      {
        id: 'gate_and0',
        type: 'AND',
        position: { x: 380, y: 100 },
        data: { label: 'AND0 (D0 · S\')', type: 'AND' }
      },
      {
        id: 'gate_and1',
        type: 'AND',
        position: { x: 380, y: 240 },
        data: { label: 'AND1 (D1 · S)', type: 'AND' }
      },
      {
        id: 'gate_or',
        type: 'OR',
        position: { x: 560, y: 170 },
        data: { label: 'OR Gate', type: 'OR' }
      },
      {
        id: 'out_y',
        type: 'LED',
        position: { x: 740, y: 170 },
        data: { label: 'Output (Y)', type: 'LED', color: '#F59E0B' }
      }
    ],
    edges: [
      { id: 'e1', source: 'in_sel', target: 'gate_not', targetHandle: 'in_0', animated: true },
      { id: 'e2', source: 'in_d0', target: 'gate_and0', targetHandle: 'in_0', animated: true },
      { id: 'e3', source: 'gate_not', target: 'gate_and0', targetHandle: 'in_1', animated: true },
      { id: 'e4', source: 'in_d1', target: 'gate_and1', targetHandle: 'in_0', animated: true },
      { id: 'e5', source: 'in_sel', target: 'gate_and1', targetHandle: 'in_1', animated: true },
      { id: 'e6', source: 'gate_and0', target: 'gate_or', targetHandle: 'in_0', animated: true },
      { id: 'e7', source: 'gate_and1', target: 'gate_or', targetHandle: 'in_1', animated: true },
      { id: 'e8', source: 'gate_or', target: 'out_y', targetHandle: 'in', animated: true }
    ]
  },
  {
    id: 'preset_xor_nand',
    name: 'XOR Gate Built from 4 NAND Gates',
    description: 'Demonstrating functional completeness of universal NAND gates.',
    createdAt: 1710000000000,
    updatedAt: 1710000000000,
    nodes: [
      {
        id: 'in_a',
        type: 'SWITCH',
        position: { x: 60, y: 120 },
        data: { label: 'Input A', type: 'SWITCH', value: 0 }
      },
      {
        id: 'in_b',
        type: 'SWITCH',
        position: { x: 60, y: 260 },
        data: { label: 'Input B', type: 'SWITCH', value: 1 }
      },
      {
        id: 'nand_1',
        type: 'NAND',
        position: { x: 220, y: 190 },
        data: { label: 'NAND 1 (AB)\'', type: 'NAND' }
      },
      {
        id: 'nand_2',
        type: 'NAND',
        position: { x: 420, y: 100 },
        data: { label: 'NAND 2', type: 'NAND' }
      },
      {
        id: 'nand_3',
        type: 'NAND',
        position: { x: 420, y: 280 },
        data: { label: 'NAND 3', type: 'NAND' }
      },
      {
        id: 'nand_4',
        type: 'NAND',
        position: { x: 620, y: 190 },
        data: { label: 'NAND 4 (Output)', type: 'NAND' }
      },
      {
        id: 'out_xor',
        type: 'LED',
        position: { x: 800, y: 190 },
        data: { label: 'XOR Result', type: 'LED', color: '#10B981' }
      }
    ],
    edges: [
      { id: 'e1', source: 'in_a', target: 'nand_1', targetHandle: 'in_0', animated: true },
      { id: 'e2', source: 'in_b', target: 'nand_1', targetHandle: 'in_1', animated: true },
      { id: 'e3', source: 'in_a', target: 'nand_2', targetHandle: 'in_0', animated: true },
      { id: 'e4', source: 'nand_1', target: 'nand_2', targetHandle: 'in_1', animated: true },
      { id: 'e5', source: 'nand_1', target: 'nand_3', targetHandle: 'in_0', animated: true },
      { id: 'e6', source: 'in_b', target: 'nand_3', targetHandle: 'in_1', animated: true },
      { id: 'e7', source: 'nand_2', target: 'nand_4', targetHandle: 'in_0', animated: true },
      { id: 'e8', source: 'nand_3', target: 'nand_4', targetHandle: 'in_1', animated: true },
      { id: 'e9', source: 'nand_4', target: 'out_xor', targetHandle: 'in', animated: true }
    ]
  }
];

