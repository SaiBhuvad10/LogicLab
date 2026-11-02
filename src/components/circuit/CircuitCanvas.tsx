import React, { useCallback, useRef, useEffect, useState } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useReactFlow,
  ReactFlowProvider,
  BackgroundVariant
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { useCircuitStore } from '../../store/circuitStore';
import { useAppStore } from '../../store/appStore';
import { GateNode } from './nodes/GateNode';
import { InputNode } from './nodes/InputNode';
import { OutputNode } from './nodes/OutputNode';
import { ClockNode } from './nodes/ClockNode';
import { ComponentLibrary } from './ComponentLibrary';
import { PropertiesPanel } from './PropertiesPanel';
import { SimulationPanel } from './SimulationPanel';
import { PRESET_CIRCUITS } from '../../data/presetCircuits';
import { CircuitNodeType } from '../../types/circuit';
import {
  Save,
  Download,
  Upload,
  Trash2,
  Undo2,
  Redo2,
  ZoomIn,
  ZoomOut,
  Maximize,
  FolderOpen,
  Plus,
  Sliders
} from 'lucide-react';

const nodeTypes = {
  gateNode: GateNode,
  inputNode: InputNode,
  outputNode: OutputNode,
  clockNode: ClockNode
};

const CircuitCanvasInner: React.FC = () => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { screenToFlowPosition, fitView, zoomIn, zoomOut } = useReactFlow();

  const {
    nodes,
    edges,
    circuitName,
    isSimulating,
    onNodesChange,
    onEdgesChange,
    onConnect,
    addNode,
    selectedNodeId,
    selectNode,
    stepSimulation,
    undo,
    redo,
    historyIndex,
    history,
    clearCanvas,
    loadPreset,
    saveCircuit,
    exportJSON,
    importJSON
  } = useCircuitStore();

  const { addNotification, theme } = useAppStore();
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [mobileDrawer, setMobileDrawer] = useState<'library' | 'properties' | null>(null);

  const selectedNode = nodes.find((n) => n.id === selectedNodeId);

  // Clock tick timer effect
  useEffect(() => {
    if (!isSimulating) return;
    const interval = setInterval(() => {
      // Advance clock tick
      useCircuitStore.setState((s) => ({ clockTick: s.clockTick + 1 }));
      stepSimulation();
    }, 600);
    return () => clearInterval(interval);
  }, [isSimulating, stepSimulation]);

  // Drag over handler for canvas
  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  // Drop component on canvas
  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      const rawData = event.dataTransfer.getData('application/reactflow');
      if (!rawData) return;

      try {
        const { type, label } = JSON.parse(rawData);
        const position = screenToFlowPosition({
          x: event.clientX,
          y: event.clientY
        });
        addNode(type as CircuitNodeType, position, label);
      } catch (e) {
        console.error('Failed to drop component:', e);
      }
    },
    [screenToFlowPosition, addNode]
  );

  const handleSave = () => {
    const saved = saveCircuit();
    addNotification(`Circuit "${saved.name}" saved successfully to LocalStorage!`, 'success');
  };

  const handleExport = () => {
    const json = exportJSON();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${circuitName.toLowerCase().replace(/\s+/g, '_')}_circuit.json`;
    a.click();
    URL.revokeObjectURL(url);
    addNotification('Circuit exported as JSON file', 'info');
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const success = importJSON(content);
      if (success) {
        addNotification('Circuit schematic imported successfully!', 'success');
        fitView({ padding: 0.2 });
      } else {
        addNotification('Invalid circuit JSON file format', 'error');
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] overflow-hidden select-none relative">
      {/* Top Canvas Toolbar (Fully Responsive) */}
      <div className="h-12 sm:h-14 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-2 sm:px-4 flex items-center justify-between gap-1 sm:gap-2 z-10 shrink-0">
        <div className="flex items-center gap-1.5 sm:gap-3 min-w-0">
          <input
            type="text"
            value={circuitName}
            onChange={(e) => useCircuitStore.setState({ circuitName: e.target.value })}
            className="font-semibold text-xs sm:text-sm bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 px-1.5 py-1 rounded border border-transparent hover:border-slate-300 dark:hover:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500 w-24 sm:w-40 md:w-52 truncate"
            placeholder="Circuit Name"
          />

          <div className="h-4 sm:h-5 w-px bg-slate-200 dark:bg-slate-800 shrink-0" />

          {/* Preset Selector */}
          <div className="flex items-center gap-1 shrink-0">
            <FolderOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400 shrink-0" />
            <select
              onChange={(e) => {
                if (e.target.value) {
                  loadPreset(e.target.value);
                  setTimeout(() => fitView({ padding: 0.2 }), 50);
                }
              }}
              defaultValue=""
              className="text-[11px] sm:text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-1.5 sm:px-2.5 py-1 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 max-w-[110px] sm:max-w-[170px] md:max-w-none truncate"
            >
              <option value="" disabled>
                Load Example...
              </option>
              {PRESET_CIRCUITS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Toolbar Action Buttons */}
        <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
          <button
            onClick={undo}
            disabled={historyIndex <= 0}
            className="p-1 sm:p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 text-slate-600 dark:text-slate-300 transition-colors"
            title="Undo"
          >
            <Undo2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
          <button
            onClick={redo}
            disabled={historyIndex >= history.length - 1}
            className="p-1 sm:p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 text-slate-600 dark:text-slate-300 transition-colors"
            title="Redo"
          >
            <Redo2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>

          <div className="hidden xs:block h-4 sm:h-5 w-px bg-slate-200 dark:bg-slate-800" />

          <button
            onClick={() => zoomIn()}
            className="hidden sm:inline-flex p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => zoomOut()}
            className="hidden sm:inline-flex p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={() => fitView({ padding: 0.2 })}
            className="p-1 sm:p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
            title="Fit View"
          >
            <Maximize className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>

          <div className="h-4 sm:h-5 w-px bg-slate-200 dark:bg-slate-800" />

          <button
            onClick={handleSave}
            className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors shrink-0"
            title="Save Circuit"
          >
            <Save className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Save</span>
          </button>

          <button
            onClick={handleExport}
            className="p-1 sm:p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
            title="Export JSON"
          >
            <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-1 sm:p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
            title="Import JSON"
          >
            <Upload className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleImportFile}
            className="hidden"
          />

          <button
            onClick={() => setShowClearConfirm(true)}
            className="p-1 sm:p-1.5 rounded-lg border border-red-200 dark:border-red-900/40 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
            title="Clear Canvas"
          >
            <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </div>
      </div>

      {/* Main Studio Workspace: Left Library | Center Canvas | Right Properties */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Desktop Left Library */}
        <div className="hidden lg:flex shrink-0 h-full">
          <ComponentLibrary />
        </div>

        {/* Central Infinite Grid Canvas (Takes 100% space on Mobile) */}
        <div ref={reactFlowWrapper} className="flex-1 w-full h-full relative bg-slate-50 dark:bg-slate-950">
          {/* Mobile Quick Action Buttons on Canvas */}
          <div className="lg:hidden absolute top-3 left-3 z-20">
            <button
              onClick={() => setMobileDrawer('library')}
              className="flex items-center gap-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-500/25 text-xs font-bold transition-transform active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Add Gate</span>
            </button>
          </div>

          <div className="lg:hidden absolute top-3 right-3 z-20">
            <button
              onClick={() => setMobileDrawer('properties')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl shadow-lg text-xs font-bold transition-all active:scale-95 ${
                selectedNodeId
                  ? 'bg-indigo-600 text-white shadow-indigo-500/30 ring-2 ring-indigo-400'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700'
              }`}
            >
              <Sliders className="w-4 h-4 text-blue-500" />
              <span>{selectedNodeId ? `Inspect (${String(selectedNode?.data?.label || selectedNode?.data?.type || 'Node')})` : 'Inspector'}</span>
              {selectedNodeId && (
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              )}
            </button>
          </div>

          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={(_, node) => selectNode(node.id)}
            onPaneClick={() => selectNode(null)}
            onDrop={onDrop}
            onDragOver={onDragOver}
            nodeTypes={nodeTypes}
            fitView
            snapToGrid
            snapGrid={[15, 15]}
            colorMode={theme === 'dark' ? 'dark' : 'light'}
            defaultEdgeOptions={{
              animated: true,
              style: { strokeWidth: 2 }
            }}
          >
            <Background
              variant={BackgroundVariant.Dots}
              gap={16}
              size={1.5}
              color={theme === 'dark' ? '#334155' : '#cbd5e1'}
            />
            <Controls showInteractive={false} className="!bg-white dark:!bg-slate-800 !border-slate-200 dark:!border-slate-700" />
            <MiniMap
              nodeStrokeWidth={3}
              zoomable
              pannable
              className="hidden md:block !bg-white dark:!bg-slate-900 !border-slate-200 dark:!border-slate-800"
            />
          </ReactFlow>
        </div>

        {/* Desktop Right Properties Panel */}
        <div className="hidden lg:flex shrink-0 h-full">
          <PropertiesPanel />
        </div>
      </div>

      {/* Bottom Simulation and Output Health Panel */}
      <SimulationPanel />

      {/* Mobile Slide-Over Drawer: Component Library */}
      {mobileDrawer === 'library' && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileDrawer(null)}
          />
          <div className="relative w-80 max-w-[85vw] h-full bg-white dark:bg-slate-900 shadow-2xl z-50 flex flex-col">
            <ComponentLibrary
              isMobileDrawer={true}
              onClose={() => setMobileDrawer(null)}
              onItemAdded={() => {
                addNotification('Component added to canvas!', 'info');
                setMobileDrawer(null);
              }}
            />
          </div>
        </div>
      )}

      {/* Mobile Slide-Over Drawer: Inspector & Properties */}
      {mobileDrawer === 'properties' && (
        <div className="lg:hidden fixed inset-0 z-40 flex justify-end">
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileDrawer(null)}
          />
          <div className="relative w-80 max-w-[85vw] h-full bg-white dark:bg-slate-900 shadow-2xl z-50 flex flex-col">
            <PropertiesPanel
              isMobileDrawer={true}
              onClose={() => setMobileDrawer(null)}
            />
          </div>
        </div>
      )}

      {/* Clear Canvas Confirmation Modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl p-5 max-w-sm w-full border border-slate-200 dark:border-slate-800 shadow-xl">
            <h3 className="font-bold text-base text-slate-900 dark:text-slate-100 mb-2">
              Clear Circuit Canvas?
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-5 leading-relaxed">
              Are you sure you want to remove all components and wires? Unsaved progress will be lost.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="px-3 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  clearCanvas();
                  setShowClearConfirm(false);
                  addNotification('Canvas cleared', 'info');
                }}
                className="px-3 py-1.5 text-xs font-semibold bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                Clear Canvas
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export const CircuitCanvas: React.FC = () => {
  return (
    <ReactFlowProvider>
      <CircuitCanvasInner />
    </ReactFlowProvider>
  );
};

