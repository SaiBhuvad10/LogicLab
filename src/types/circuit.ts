export type GateType = 'AND' | 'OR' | 'NOT' | 'NAND' | 'NOR' | 'XOR' | 'XNOR';

export type InputNodeType = 'CONST_0' | 'CONST_1' | 'SWITCH' | 'CLOCK';
export type OutputNodeType = 'LED' | 'PROBE' | 'DISPLAY';

export type CircuitNodeType = GateType | InputNodeType | OutputNodeType;

export interface CircuitNodeData {
  label: string;
  type: CircuitNodeType;
  value?: number; // 0 or 1
  frequency?: number; // for clock in Hz (e.g. 1Hz, 2Hz)
  inputs?: { [handleId: string]: number | null };
  output?: number;
  color?: string;
  name?: string;
}

export interface CircuitMetadata {
  id: string;
  name: string;
  description: string;
  createdAt: number;
  updatedAt: number;
  tags?: string[];
  nodeCount: number;
  wireCount: number;
}

export interface SavedCircuit {
  id: string;
  name: string;
  description: string;
  createdAt: number;
  updatedAt: number;
  nodes: any[];
  edges: any[];
  viewport?: { x: number; y: number; zoom: number };
}

export interface SimulationResult {
  nodeOutputs: Record<string, number>;
  activeEdges: Set<string>;
  hasCycles: boolean;
  cycleNodes: string[];
  missingInputs: { nodeId: string; handleId: string }[];
  evaluationOrder: string[];
  simulationTimeMs: number;
}

