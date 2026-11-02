import { create } from 'zustand';
import {
  Node,
  Edge,
  Connection,
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  NodeChange,
  EdgeChange
} from '@xyflow/react';
import { CircuitNodeType, SimulationResult, SavedCircuit } from '../types/circuit';
import { CircuitEngine, SimNode, SimEdge } from '../engine/circuitEngine';
import { StorageUtil } from '../utils/storage';
import { PRESET_CIRCUITS } from '../data/presetCircuits';

interface CircuitHistory {
  nodes: Node[];
  edges: Edge[];
}

interface CircuitState {
  circuitId: string;
  circuitName: string;
  circuitDescription: string;
  nodes: Node[];
  edges: Edge[];
  selectedNodeId: string | null;

  // Simulation
  isSimulating: boolean;
  clockTick: number;
  simulationResult: SimulationResult;

  // Undo / Redo
  history: CircuitHistory[];
  historyIndex: number;

  // Actions
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void;

  addNode: (type: CircuitNodeType, position: { x: number; y: number }, label?: string) => void;
  updateNodeData: (id: string, data: Record<string, any>) => void;
  toggleSwitchValue: (id: string) => void;
  selectNode: (id: string | null) => void;
  deleteSelected: () => void;
  duplicateSelected: () => void;

  runSimulation: () => void;
  stopSimulation: () => void;
  stepSimulation: () => void;
  resetSimulation: () => void;

  undo: () => void;
  redo: () => void;
  pushHistory: () => void;

  clearCanvas: () => void;
  loadPreset: (presetId: string) => void;
  loadCircuit: (circuit: SavedCircuit) => void;
  saveCircuit: () => SavedCircuit;
  exportJSON: () => string;
  importJSON: (jsonStr: string) => boolean;
}

const DEFAULT_SIM_RESULT: SimulationResult = {
  nodeOutputs: {},
  activeEdges: new Set(),
  hasCycles: false,
  cycleNodes: [],
  missingInputs: [],
  evaluationOrder: [],
  simulationTimeMs: 0
};

export const useCircuitStore = create<CircuitState>((set, get) => {
  // Load default preset (Half Adder)
  const defaultPreset = PRESET_CIRCUITS[0];
  const initialNodes: Node[] = (defaultPreset.nodes || []).map(n => ({
    ...n,
    type: getNodeTypeGroup(n.type as CircuitNodeType)
  }));
  const initialEdges: Edge[] = (defaultPreset.edges || []).map(e => ({
    ...e,
    className: 'wire-inactive'
  }));

  const initialSim = CircuitEngine.simulate(
    initialNodes.map(mapFlowToSimNode),
    initialEdges.map(mapFlowToSimEdge),
    0
  );

  return {
    circuitId: defaultPreset.id,
    circuitName: defaultPreset.name,
    circuitDescription: defaultPreset.description,
    nodes: initialNodes,
    edges: initialEdges,
    selectedNodeId: null,

    isSimulating: true,
    clockTick: 0,
    simulationResult: initialSim,

    history: [{ nodes: initialNodes, edges: initialEdges }],
    historyIndex: 0,

    setNodes: (nodes) => set({ nodes }),
    setEdges: (edges) => set({ edges }),

    onNodesChange: (changes) => {
      set({
        nodes: applyNodeChanges(changes, get().nodes)
      });
      get().stepSimulation();
    },

    onEdgesChange: (changes) => {
      set({
        edges: applyEdgeChanges(changes, get().edges)
      });
      get().pushHistory();
      get().stepSimulation();
    },

    onConnect: (connection) => {
      const newEdge: Edge = {
        ...connection,
        id: `e_${connection.source}_${connection.target}_${Date.now()}`,
        animated: true,
        className: 'wire-inactive'
      } as Edge;

      const updatedEdges = addEdge(newEdge, get().edges);
      set({ edges: updatedEdges });
      get().pushHistory();
      get().stepSimulation();
    },

    addNode: (type, position, label) => {
      const id = `${type.toLowerCase()}_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`;
      const nodeTypeGroup = getNodeTypeGroup(type);

      let initialValue = 0;
      if (type === 'CONST_1') initialValue = 1;

      const newNode: Node = {
        id,
        type: nodeTypeGroup,
        position,
        data: {
          label: label || `${type}`,
          type,
          value: initialValue,
          frequency: 1,
          output: initialValue,
          inputs: {}
        }
      };

      set((state) => ({
        nodes: [...state.nodes, newNode],
        selectedNodeId: id
      }));

      get().pushHistory();
      get().stepSimulation();
    },

    updateNodeData: (id, partialData) => {
      set((state) => ({
        nodes: state.nodes.map((node) => {
          if (node.id === id) {
            return {
              ...node,
              data: {
                ...node.data,
                ...partialData
              }
            };
          }
          return node;
        })
      }));
      get().stepSimulation();
    },

    toggleSwitchValue: (id) => {
      set((state) => ({
        nodes: state.nodes.map((node) => {
          if (node.id === id) {
            const currentVal = node.data?.value === 1 ? 0 : 1;
            return {
              ...node,
              data: {
                ...node.data,
                value: currentVal
              }
            };
          }
          return node;
        })
      }));
      get().stepSimulation();
    },

    selectNode: (id) => set({ selectedNodeId: id }),

    deleteSelected: () => {
      const { selectedNodeId, nodes, edges } = get();
      if (!selectedNodeId) return;

      const updatedNodes = nodes.filter((n) => n.id !== selectedNodeId);
      const updatedEdges = edges.filter(
        (e) => e.source !== selectedNodeId && e.target !== selectedNodeId
      );

      set({
        nodes: updatedNodes,
        edges: updatedEdges,
        selectedNodeId: null
      });

      get().pushHistory();
      get().stepSimulation();
    },

    duplicateSelected: () => {
      const { selectedNodeId, nodes } = get();
      if (!selectedNodeId) return;

      const sourceNode = nodes.find((n) => n.id === selectedNodeId);
      if (!sourceNode) return;

      const newId = `${sourceNode.data.type}_${Date.now()}`;
      const duplicatedNode: Node = {
        ...sourceNode,
        id: newId,
        position: {
          x: sourceNode.position.x + 40,
          y: sourceNode.position.y + 40
        },
        data: {
          ...sourceNode.data,
          label: `${sourceNode.data.label} (Copy)`
        },
        selected: true
      };

      set({
        nodes: [...nodes.map(n => ({ ...n, selected: false })), duplicatedNode],
        selectedNodeId: newId
      });

      get().pushHistory();
      get().stepSimulation();
    },

    runSimulation: () => set({ isSimulating: true }),
    stopSimulation: () => set({ isSimulating: false }),

    stepSimulation: () => {
      const { nodes, edges, clockTick } = get();
      const simNodes = nodes.map(mapFlowToSimNode);
      const simEdges = edges.map(mapFlowToSimEdge);

      const result = CircuitEngine.simulate(simNodes, simEdges, clockTick);

      // Update node data with computed outputs
      const updatedNodes = nodes.map((n) => {
        const outVal = result.nodeOutputs[n.id];
        return {
          ...n,
          data: {
            ...n.data,
            output: outVal ?? n.data?.value ?? 0
          }
        };
      });

      // Update wire styling based on activeEdges
      const updatedEdges = edges.map((e) => {
        const isActive = result.activeEdges.has(e.id);
        return {
          ...e,
          className: isActive ? 'wire-active' : 'wire-inactive',
          animated: isActive
        };
      });

      set({
        simulationResult: result,
        nodes: updatedNodes,
        edges: updatedEdges
      });
    },

    resetSimulation: () => {
      set({ clockTick: 0 });
      get().stepSimulation();
    },

    pushHistory: () => {
      const { nodes, edges, history, historyIndex } = get();
      const nextHistory = history.slice(0, historyIndex + 1);
      nextHistory.push({ nodes, edges });
      // Keep max 30 snapshots
      if (nextHistory.length > 30) nextHistory.shift();
      set({
        history: nextHistory,
        historyIndex: nextHistory.length - 1
      });
    },

    undo: () => {
      const { history, historyIndex } = get();
      if (historyIndex > 0) {
        const newIdx = historyIndex - 1;
        const snap = history[newIdx];
        set({
          nodes: snap.nodes,
          edges: snap.edges,
          historyIndex: newIdx
        });
        get().stepSimulation();
      }
    },

    redo: () => {
      const { history, historyIndex } = get();
      if (historyIndex < history.length - 1) {
        const newIdx = historyIndex + 1;
        const snap = history[newIdx];
        set({
          nodes: snap.nodes,
          edges: snap.edges,
          historyIndex: newIdx
        });
        get().stepSimulation();
      }
    },

    clearCanvas: () => {
      set({
        nodes: [],
        edges: [],
        selectedNodeId: null,
        simulationResult: DEFAULT_SIM_RESULT,
        circuitName: 'Untitled Circuit',
        circuitDescription: ''
      });
      get().pushHistory();
    },

    loadPreset: (presetId) => {
      const preset = PRESET_CIRCUITS.find((p) => p.id === presetId);
      if (!preset) return;
      get().loadCircuit(preset);
    },

    loadCircuit: (circuit) => {
      const mappedNodes: Node[] = (circuit.nodes || []).map((n) => ({
        ...n,
        type: getNodeTypeGroup(n.type as CircuitNodeType)
      }));
      const mappedEdges: Edge[] = (circuit.edges || []).map((e) => ({
        ...e,
        className: 'wire-inactive'
      }));

      set({
        circuitId: circuit.id,
        circuitName: circuit.name,
        circuitDescription: circuit.description,
        nodes: mappedNodes,
        edges: mappedEdges,
        selectedNodeId: null
      });

      get().pushHistory();
      get().stepSimulation();
    },

    saveCircuit: () => {
      const { circuitId, circuitName, circuitDescription, nodes, edges } = get();
      const saved: SavedCircuit = {
        id: circuitId.startsWith('preset_') ? `circuit_${Date.now()}` : circuitId,
        name: circuitName || 'Untitled Circuit',
        description: circuitDescription || 'Custom digital circuit schematic',
        createdAt: Date.now(),
        updatedAt: Date.now(),
        nodes,
        edges
      };
      StorageUtil.saveCircuit(saved);
      return saved;
    },

    exportJSON: () => {
      const { circuitId, circuitName, circuitDescription, nodes, edges } = get();
      const payload: SavedCircuit = {
        id: circuitId,
        name: circuitName,
        description: circuitDescription,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        nodes,
        edges
      };
      return JSON.stringify(payload, null, 2);
    },

    importJSON: (jsonStr) => {
      try {
        const parsed = JSON.parse(jsonStr) as SavedCircuit;
        if (!parsed.nodes || !Array.isArray(parsed.nodes)) return false;
        get().loadCircuit(parsed);
        return true;
      } catch {
        return false;
      }
    }
  };
});

function getNodeTypeGroup(type: CircuitNodeType): string {
  switch (type) {
    case 'CONST_0':
    case 'CONST_1':
    case 'SWITCH':
      return 'inputNode';
    case 'CLOCK':
      return 'clockNode';
    case 'LED':
    case 'PROBE':
    case 'DISPLAY':
      return 'outputNode';
    default:
      return 'gateNode';
  }
}

function mapFlowToSimNode(n: Node): SimNode {
  return {
    id: n.id,
    type: (n.data?.type || 'AND') as CircuitNodeType,
    data: n.data || {}
  };
}

function mapFlowToSimEdge(e: Edge): SimEdge {
  return {
    id: e.id,
    source: e.source,
    target: e.target,
    sourceHandle: e.sourceHandle,
    targetHandle: e.targetHandle
  };
}

