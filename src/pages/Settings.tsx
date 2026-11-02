import React, { useState } from 'react';
import { useAppStore } from '../store/appStore';
import { StorageUtil } from '../utils/storage';
import {
  Settings as SettingsIcon,
  Sun,
  Moon,
  Laptop,
  Trash2,
  Cpu,
  Info,
  CheckCircle2,
  ShieldAlert,
  Volume2,
  Grid
} from 'lucide-react';

export const Settings: React.FC = () => {
  const { theme, setTheme, settings, updateSettings, addNotification } = useAppStore();
  const [showClearConfirm, setShowClearConfirm] = useState<boolean>(false);

  const handleClearAll = () => {
    StorageUtil.clearAllData();
    setShowClearConfirm(false);
    addNotification('All local data and saved circuits cleared successfully.', 'info');
    setTimeout(() => window.location.reload(), 1000);
  };

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto space-y-4 sm:space-y-6 select-none">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
          <SettingsIcon className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
          <span>Application Settings</span>
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Customize simulation preferences, visual themes, and local storage state
        </p>
      </div>

      {/* Visual Theme Setting */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-3">
        <h3 className="font-bold text-sm text-slate-900 dark:text-white">
          Visual Theme
        </h3>
        <p className="text-xs text-slate-400">
          Select interface color scheme for laboratory workstations
        </p>

        <div className="grid grid-cols-3 gap-3 pt-2">
          <button
            onClick={() => setTheme('light')}
            className={`p-3.5 rounded-xl border flex items-center justify-center gap-2.5 text-xs font-semibold transition-all cursor-pointer ${
              theme === 'light'
                ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-xs ring-1 ring-blue-500'
                : 'border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'
            }`}
          >
            <Sun className="w-4 h-4 text-amber-500" />
            <span>Light Surface</span>
          </button>

          <button
            onClick={() => setTheme('dark')}
            className={`p-3.5 rounded-xl border flex items-center justify-center gap-2.5 text-xs font-semibold transition-all cursor-pointer ${
              theme === 'dark'
                ? 'border-blue-500 bg-blue-900/30 text-blue-300 shadow-xs ring-1 ring-blue-500'
                : 'border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'
            }`}
          >
            <Moon className="w-4 h-4 text-blue-400" />
            <span>Deep Navy (Dark)</span>
          </button>

          <button
            onClick={() => setTheme('system')}
            className={`p-3.5 rounded-xl border flex items-center justify-center gap-2.5 text-xs font-semibold transition-all cursor-pointer ${
              theme === 'system'
                ? 'border-blue-500 bg-blue-900/30 text-blue-300 shadow-xs ring-1 ring-blue-500'
                : 'border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'
            }`}
          >
            <Laptop className="w-4 h-4 text-slate-400" />
            <span>System Default</span>
          </button>
        </div>
      </div>

      {/* Circuit Engine & Canvas Preferences */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-4">
        <h3 className="font-bold text-sm text-slate-900 dark:text-white">
          Circuit Simulator Configuration
        </h3>

        <div className="space-y-4 text-xs">
          {/* Simulation Tick Speed */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <div className="font-semibold text-slate-800 dark:text-slate-200">
                Clock Oscillation Period
              </div>
              <div className="text-slate-400 text-[11px]">
                Frequency of automated signal updates in circuit canvas
              </div>
            </div>
            <div className="flex items-center gap-2">
              {[250, 500, 1000].map((ms) => (
                <button
                  key={ms}
                  onClick={() => updateSettings({ simulationSpeedMs: ms })}
                  className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                    settings.simulationSpeedMs === ms
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {ms}ms ({1000 / ms} Hz)
                </button>
              ))}
            </div>
          </div>

          {/* Wire Logic Coloring */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <div className="font-semibold text-slate-800 dark:text-slate-200">
                Active Signal Highlighting
              </div>
              <div className="text-slate-400 text-[11px]">
                Glow HIGH (1) wires green with animated particle dash flow
              </div>
            </div>
            <button
              onClick={() =>
                updateSettings({
                  wireColorMode: settings.wireColorMode === 'logic' ? 'monochrome' : 'logic'
                })
              }
              className={`px-3 py-1 rounded-lg font-bold text-xs ${
                settings.wireColorMode === 'logic'
                  ? 'bg-emerald-500 text-white'
                  : 'bg-slate-200 dark:bg-slate-800 text-slate-600'
              }`}
            >
              {settings.wireColorMode === 'logic' ? 'Enabled' : 'Disabled'}
            </button>
          </div>

          {/* Grid Snapping */}
          <div className="flex items-center justify-between">
            <div>
              <div className="font-semibold text-slate-800 dark:text-slate-200">
                Canvas Grid Snapping
              </div>
              <div className="text-slate-400 text-[11px]">
                Snap logic gates and wire pins to 15px coordinates
              </div>
            </div>
            <button
              onClick={() => updateSettings({ snapToGrid: !settings.snapToGrid })}
              className={`px-3 py-1 rounded-lg font-bold text-xs ${
                settings.snapToGrid
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-200 dark:bg-slate-800 text-slate-600'
              }`}
            >
              {settings.snapToGrid ? 'Active' : 'Freeform'}
            </button>
          </div>
        </div>
      </div>

      {/* Danger Zone: Storage Clearing */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-red-200 dark:border-red-950/40 p-5 shadow-xs space-y-3">
        <h3 className="font-bold text-sm text-red-600 dark:text-red-400 flex items-center gap-1.5">
          <ShieldAlert className="w-4 h-4" />
          <span>Local Data Management</span>
        </h3>
        <p className="text-xs text-slate-500 leading-relaxed">
          Erase all user-created schematics, quiz history attempts, and personal laboratory preferences from this browser's LocalStorage.
        </p>

        <button
          onClick={() => setShowClearConfirm(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5" /> Clear All Local Data
        </button>
      </div>

      {/* About Section */}
      <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-500 space-y-2">
        <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200 font-bold text-sm">
          <Cpu className="w-4 h-4 text-blue-500" />
          <span>About LogicLab Virtual Laboratory</span>
        </div>
        <p className="leading-relaxed">
          LogicLab is an open educational technology laboratory built specifically for
          Semester III Computer Engineering students. All mathematical logic simulations, truth table
          combinations, K-map grouping algorithms, and DAG signal propagations run purely in software
          with zero physical hardware dependencies.
        </p>
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] font-mono text-slate-400">
          <span>Version 1.0.0 (Production Build)</span>
          <span>Designed with React 19 + TypeScript</span>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl p-5 max-w-sm w-full border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              Reset Application Data?
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Are you sure you want to reset all stored state? This will remove your custom circuits and quiz performance history.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="px-3 py-1.5 text-xs text-slate-500 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleClearAll}
                className="px-3 py-1.5 text-xs font-bold bg-red-600 hover:bg-red-700 text-white rounded-lg"
              >
                Yes, Reset All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

