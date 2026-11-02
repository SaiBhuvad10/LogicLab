import { evaluateGate } from './gateEngine';
import { CircuitNodeType, GateType, SimulationResult } from '../types/circuit';

export interface SimNode {
  id: string;
  type: CircuitNodeType;
  data: {
    label?: string;
    type?: CircuitNodeType;
    value?: number;
    frequency?: number;
    output?: number;
    inputs?: Record<string, number | null>;
    [key: string]: any;
  };
}

export interface SimEdge {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string | null;
  targetHandle?: string | null;
}

export class CircuitEngine {
  /**
   * Detects cycles in the directed graph of nodes and edges using DFS coloring.
   * White = 0 (unvisited), Gray = 1 (visiting), Black = 2 (visited).
   */
  static detectCycles(nodes: SimNode[], edges: SimEdge[]): { hasCycles: boolean; cycleNodes: string[] } {
    const adj: Map<string, string[]> = new Map();
    nodes.forEach(n => adj.set(n.id, []));
    edges.forEach(e => {
      if (adj.has(e.source)) {
        adj.get(e.source)!.push(e.target);
      }
    });

    const color: Map<string, number> = new Map();
    const parent: Map<string, string | null> = new Map();
    nodes.forEach(n => color.set(n.id, 0));

    let cycleFound = false;
    const cycleNodesSet = new Set<string>();

    function dfs(nodeId: string, path: string[]) {
      color.set(nodeId, 1);
      path.push(nodeId);

      const neighbors = adj.get(nodeId) || [];
      for (const neighbor of neighbors) {
        if (color.get(neighbor) === 1) {
          cycleFound = true;
          // Mark all nodes in current cycle loop
          const idx = path.indexOf(neighbor);
          if (idx !== -1) {
            for (let i = idx; i < path.length; i++) {
              cycleNodesSet.add(path[i]);
            }
          } else {
            cycleNodesSet.add(neighbor);
            cycleNodesSet.add(nodeId);
          }
        } else if (color.get(neighbor) === 0) {
          dfs(neighbor, [...path]);
        }
      }

      color.set(nodeId, 2);
    }

    for (const node of nodes) {
      if (color.get(node.id) === 0) {
        dfs(node.id, []);
      }
    }

    return {
      hasCycles: cycleFound,
      cycleNodes: Array.from(cycleNodesSet)
    };
  }

  /**
   * Performs Kahn's algorithm for topological sorting of DAG nodes.
   */
  static topologicalSort(nodes: SimNode[], edges: SimEdge[]): { sorted: string[]; hasCycles: boolean } {
    const inDegree: Map<string, number> = new Map();
    const adj: Map<string, string[]> = new Map();

    nodes.forEach(n => {
      inDegree.set(n.id, 0);
      adj.set(n.id, []);
    });

    edges.forEach(e => {
      if (adj.has(e.source) && inDegree.has(e.target)) {
        adj.get(e.source)!.push(e.target);
        inDegree.set(e.target, (inDegree.get(e.target) || 0) + 1);
      }
    });

    const queue: string[] = [];
    inDegree.forEach((deg, id) => {
      if (deg === 0) queue.push(id);
    });

    const sorted: string[] = [];
    while (queue.length > 0) {
      const u = queue.shift()!;
      sorted.push(u);

      const neighbors = adj.get(u) || [];
      for (const v of neighbors) {
        const nextDeg = (inDegree.get(v) || 0) - 1;
        inDegree.set(v, nextDeg);
        if (nextDeg === 0) {
          queue.push(v);
        }
      }
    }

    const hasCycles = sorted.length < nodes.length;
    return { sorted, hasCycles };
  }

  /**
   * Evaluates the circuit state.
   */
  static simulate(
    nodes: SimNode[],
    edges: SimEdge[],
    clockTick: number = 0
  ): SimulationResult {
    const startTime = performance.now();

    // 1. Check for cycles
    const cycleCheck = this.detectCycles(nodes, edges);
    if (cycleCheck.hasCycles) {
      return {
        nodeOutputs: {},
        activeEdges: new Set(),
        hasCycles: true,
        cycleNodes: cycleCheck.cycleNodes,
        missingInputs: [],
        evaluationOrder: [],
        simulationTimeMs: performance.now() - startTime
      };
    }

    // 2. Topological sort
    const { sorted } = this.topologicalSort(nodes, edges);

    // Map of node outputs: nodeId -> 0 or 1
    const nodeOutputs: Record<string, number> = {};
    const activeEdges = new Set<string>();
    const missingInputs: { nodeId: string; handleId: string }[] = [];

    // Map incoming edges: targetNodeId -> Map<handleId, { sourceId, sourceHandle, edgeId }>
    const incoming: Map<string, Map<string, { sourceId: string; edgeId: string }>> = new Map();
    nodes.forEach(n => incoming.set(n.id, new Map()));

    edges.forEach(e => {
      if (incoming.has(e.target)) {
        const handle = e.targetHandle || 'in_0';
        incoming.get(e.target)!.set(handle, {
          sourceId: e.source,
          edgeId: e.id
        });
      }
    });

    // 3. Evaluate in topological order
    const nodeMap = new Map<string, SimNode>(nodes.map(n => [n.id, n]));

    for (const nodeId of sorted) {
      const node = nodeMap.get(nodeId);
      if (!node) continue;

      const nodeType = (node.data?.type || node.type) as CircuitNodeType;

      // Handle Input Nodes
      if (nodeType === 'CONST_0') {
        nodeOutputs[nodeId] = 0;
      } else if (nodeType === 'CONST_1') {
        nodeOutputs[nodeId] = 1;
      } else if (nodeType === 'SWITCH') {
        nodeOutputs[nodeId] = node.data?.value === 1 ? 1 : 0;
      } else if (nodeType === 'CLOCK') {
        // Clock oscillates based on clockTick or frequency
        // For simplicity, clockTick % 2 determines square wave
        nodeOutputs[nodeId] = (clockTick % 2) as number;
      }
      // Handle Output Nodes
      else if (nodeType === 'LED' || nodeType === 'PROBE' || nodeType === 'DISPLAY') {
        const incMap = incoming.get(nodeId);
        const inConn = incMap?.get('in') || incMap?.get('in_0');
        if (inConn && nodeOutputs[inConn.sourceId] !== undefined) {
          const val = nodeOutputs[inConn.sourceId];
          nodeOutputs[nodeId] = val;
          if (val === 1) activeEdges.add(inConn.edgeId);
        } else {
          nodeOutputs[nodeId] = 0;
        }
      }
      // Handle Logic Gates
      else {
        const gateType = nodeType as GateType;
        const incMap = incoming.get(nodeId) || new Map();

        if (gateType === 'NOT') {
          // NOT expects 1 input (either 'in' or 'in_0')
          const conn = incMap.get('in') || incMap.get('in_0');
          if (!conn || nodeOutputs[conn.sourceId] === undefined) {
            missingInputs.push({ nodeId, handleId: 'in_0' });
            nodeOutputs[nodeId] = 0;
          } else {
            const inVal = nodeOutputs[conn.sourceId];
            if (inVal === 1) activeEdges.add(conn.edgeId);
            nodeOutputs[nodeId] = evaluateGate('NOT', [inVal]);
          }
        } else {
          // 2-input gates expect 'in_0' (A) and 'in_1' (B)
          // or fallback to inspecting any incoming connections
          const connA = incMap.get('in_0');
          const connB = incMap.get('in_1');

          let valA: number | null = null;
          let valB: number | null = null;

          if (connA && nodeOutputs[connA.sourceId] !== undefined) {
            valA = nodeOutputs[connA.sourceId];
            if (valA === 1) activeEdges.add(connA.edgeId);
          } else {
            missingInputs.push({ nodeId, handleId: 'in_0' });
          }

          if (connB && nodeOutputs[connB.sourceId] !== undefined) {
            valB = nodeOutputs[connB.sourceId];
            if (valB === 1) activeEdges.add(connB.edgeId);
          } else {
            missingInputs.push({ nodeId, handleId: 'in_1' });
          }

          if (valA !== null && valB !== null) {
            nodeOutputs[nodeId] = evaluateGate(gateType, [valA, valB]);
          } else {
            nodeOutputs[nodeId] = 0;
          }
        }
      }
    }

    return {
      nodeOutputs,
      activeEdges,
      hasCycles: false,
      cycleNodes: [],
      missingInputs,
      evaluationOrder: sorted,
      simulationTimeMs: performance.now() - startTime
    };
  }
}

