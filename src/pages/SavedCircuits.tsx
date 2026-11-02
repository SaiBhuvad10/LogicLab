import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { StorageUtil } from '../utils/storage';
import { SavedCircuit } from '../types/circuit';
import { PRESET_CIRCUITS } from '../data/presetCircuits';
import { useCircuitStore } from '../store/circuitStore';
import { useAppStore } from '../store/appStore';
import {
  FolderHeart,
  Search,
  Upload,
  Download,
  Copy,
  Trash2,
  Edit2,
  Play,
  Calendar,
  Layers,
  Sparkles
} from 'lucide-react';

export const SavedCircuits: React.FC = () => {
  const navigate = useNavigate();
  const { loadCircuit } = useCircuitStore();
  const { addNotification } = useAppStore();

  const [circuits, setCircuits] = useState<SavedCircuit[]>([]);
  const [search, setSearch] = useState<string>('');
  const [renameTarget, setRenameTarget] = useState<SavedCircuit | null>(null);
  const [newName, setNewName] = useState<string>('');
  const [deleteTarget, setDeleteTarget] = useState<SavedCircuit | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const refreshCircuits = () => {
    const userCircuits = StorageUtil.getCircuits();
    // Combine presets + user circuits
    setCircuits([...PRESET_CIRCUITS, ...userCircuits]);
  };

  useEffect(() => {
    refreshCircuits();
  }, []);

  const filtered = circuits.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase())
  );

  const handleOpen = (circuit: SavedCircuit) => {
    loadCircuit(circuit);
    addNotification(`Loaded circuit "${circuit.name}" into Designer`, 'info');
    navigate('/designer');
  };

  const handleDuplicate = (circuit: SavedCircuit) => {
    const copy: SavedCircuit = {
      ...circuit,
      id: `circuit_${Date.now()}`,
      name: `${circuit.name} (Copy)`,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    StorageUtil.saveCircuit(copy);
    refreshCircuits();
    addNotification(`Duplicated circuit "${copy.name}"`, 'success');
  };

  const handleRename = () => {
    if (!renameTarget || !newName.trim()) return;
    const updated: SavedCircuit = {
      ...renameTarget,
      name: newName.trim(),
      updatedAt: Date.now()
    };
    StorageUtil.saveCircuit(updated);
    setRenameTarget(null);
    setNewName('');
    refreshCircuits();
    addNotification('Circuit renamed successfully', 'success');
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    StorageUtil.deleteCircuit(deleteTarget.id);
    setDeleteTarget(null);
    refreshCircuits();
    addNotification('Circuit deleted', 'info');
  };

  const handleExportSingle = (circuit: SavedCircuit) => {
    const json = JSON.stringify(circuit, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${circuit.name.toLowerCase().replace(/\s+/g, '_')}.json`;
    a.click();
    URL.revokeObjectURL(url);
    addNotification(`Exported "${circuit.name}" to JSON`, 'info');
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.nodes && Array.isArray(parsed.nodes)) {
          const imported: SavedCircuit = {
            ...parsed,
            id: `circuit_${Date.now()}`,
            createdAt: Date.now(),
            updatedAt: Date.now()
          };
          StorageUtil.saveCircuit(imported);
          refreshCircuits();
          addNotification(`Imported circuit "${imported.name}" successfully!`, 'success');
        } else {
          addNotification('Invalid circuit JSON format', 'error');
        }
      } catch {
        addNotification('Could not parse JSON file', 'error');
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-4 sm:space-y-6 select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <FolderHeart className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
            <span>Saved Circuit Schematics</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Manage your persistent digital schematics, load into the circuit editor, and export/import JSON
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5" /> Import JSON
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleImportFile}
            className="hidden"
          />

          <button
            onClick={() => navigate('/designer')}
            className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer"
          >
            New Circuit in Designer
          </button>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter saved circuits by title or description..."
          className="w-full pl-9 pr-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      {/* Circuit Cards Grid */}
      {filtered.length === 0 ? (
        <div className="py-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
          <FolderHeart className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-700 mb-2" />
          <h3 className="font-bold text-sm text-slate-700 dark:text-slate-300">
            No Saved Circuits Found
          </h3>
          <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
            Create and save a new schematic in the Circuit Designer or import a JSON schematic file.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((circuit) => {
            const isPreset = circuit.id.startsWith('preset_');
            return (
              <div
                key={circuit.id}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs flex flex-col justify-between hover:border-blue-500/50 transition-all group"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                        isPreset
                          ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400'
                          : 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400'
                      }`}
                    >
                      {isPreset ? 'Built-in Preset' : 'User Schematic'}
                    </span>

                    <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                      <Layers className="w-3 h-3" />
                      {circuit.nodes.length} nodes · {circuit.edges.length} wires
                    </span>
                  </div>

                  <h3 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {circuit.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {circuit.description || 'Custom digital electronics circuit schematic.'}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between">
                  {/* Action icons */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleExportSingle(circuit)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      title="Export JSON"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDuplicate(circuit)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      title="Duplicate"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    {!isPreset && (
                      <>
                        <button
                          onClick={() => {
                            setRenameTarget(circuit);
                            setNewName(circuit.name);
                          }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          title="Rename"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(circuit)}
                          className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </>
                    )}
                  </div>

                  {/* Launch button */}
                  <button
                    onClick={() => handleOpen(circuit)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                  >
                    <Play className="w-3 h-3" /> Open in Studio
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Rename Dialog Modal */}
      {renameTarget && (
        <div className="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl p-5 max-w-sm w-full border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              Rename Circuit
            </h3>
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 font-semibold"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setRenameTarget(null)}
                className="px-3 py-1.5 text-xs text-slate-500 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleRename}
                className="px-3 py-1.5 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
              >
                Save Name
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl p-5 max-w-sm w-full border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              Delete Circuit Schematic?
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Are you sure you want to delete <strong>"{deleteTarget.name}"</strong>? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setDeleteTarget(null)}
                className="px-3 py-1.5 text-xs text-slate-500 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-3 py-1.5 text-xs font-bold bg-red-600 hover:bg-red-700 text-white rounded-lg"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

