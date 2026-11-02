export type GateId = 'AND' | 'OR' | 'NOT' | 'NAND' | 'NOR' | 'XOR' | 'XNOR';

export interface GateDefinition {
  id: GateId;
  name: string;
  expression: string;
  description: string;
  inputCount: number;
  symbolSvg: string;
  truthTable: {
    inputs: number[][];
    outputs: number[];
  };
  details: string;
  booleanLaw: string;
}

