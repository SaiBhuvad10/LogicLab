import { SavedCircuit } from '../types/circuit';

export interface UserSettings {
  theme: 'light' | 'dark' | 'system';
  simulationSpeedMs: number;
  showGrid: boolean;
  snapToGrid: boolean;
  wireColorMode: 'logic' | 'monochrome';
  soundEnabled: boolean;
}

export interface QuizAttempt {
  id: string;
  topicId: string;
  topicName: string;
  score: number;
  total: number;
  percentage: number;
  date: number;
}

export interface AppStorageData {
  version: number;
  settings: UserSettings;
  circuits: SavedCircuit[];
  quizHistory: QuizAttempt[];
  recentModules: string[];
}

const STORAGE_KEY = 'logiclab_v1_data';

const DEFAULT_SETTINGS: UserSettings = {
  theme: 'dark',
  simulationSpeedMs: 500,
  showGrid: true,
  snapToGrid: true,
  wireColorMode: 'logic',
  soundEnabled: true
};

const DEFAULT_DATA: AppStorageData = {
  version: 1,
  settings: DEFAULT_SETTINGS,
  circuits: [],
  quizHistory: [],
  recentModules: []
};

export class StorageUtil {
  static loadData(): AppStorageData {
    if (typeof window === 'undefined' || !window.localStorage) {
      return DEFAULT_DATA;
    }
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return DEFAULT_DATA;
      const parsed = JSON.parse(raw);
      return {
        ...DEFAULT_DATA,
        ...parsed,
        settings: { ...DEFAULT_SETTINGS, ...(parsed.settings || {}) }
      };
    } catch (e) {
      console.warn('Failed to parse LogicLab localStorage data, using defaults:', e);
      return DEFAULT_DATA;
    }
  }

  static saveData(data: Partial<AppStorageData>): void {
    if (typeof window === 'undefined' || !window.localStorage) return;
    try {
      const current = this.loadData();
      const updated = { ...current, ...data };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save to localStorage:', e);
    }
  }

  // Circuits
  static getCircuits(): SavedCircuit[] {
    return this.loadData().circuits;
  }

  static saveCircuit(circuit: SavedCircuit): void {
    const data = this.loadData();
    const existingIdx = data.circuits.findIndex(c => c.id === circuit.id);
    if (existingIdx >= 0) {
      data.circuits[existingIdx] = { ...circuit, updatedAt: Date.now() };
    } else {
      data.circuits.push({ ...circuit, createdAt: Date.now(), updatedAt: Date.now() });
    }
    this.saveData({ circuits: data.circuits });
  }

  static deleteCircuit(id: string): void {
    const data = this.loadData();
    data.circuits = data.circuits.filter(c => c.id !== id);
    this.saveData({ circuits: data.circuits });
  }

  // Settings
  static getSettings(): UserSettings {
    return this.loadData().settings;
  }

  static updateSettings(partial: Partial<UserSettings>): UserSettings {
    const data = this.loadData();
    const updated = { ...data.settings, ...partial };
    this.saveData({ settings: updated });
    return updated;
  }

  // Quiz
  static recordQuizAttempt(attempt: Omit<QuizAttempt, 'id' | 'date'>): QuizAttempt {
    const data = this.loadData();
    const fullAttempt: QuizAttempt = {
      ...attempt,
      id: `quiz_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      date: Date.now()
    };
    data.quizHistory.unshift(fullAttempt);
    // keep last 50
    data.quizHistory = data.quizHistory.slice(0, 50);
    this.saveData({ quizHistory: data.quizHistory });
    return fullAttempt;
  }

  static getQuizHistory(): QuizAttempt[] {
    return this.loadData().quizHistory;
  }

  // Recent modules
  static recordModuleVisit(moduleId: string): void {
    const data = this.loadData();
    const filtered = data.recentModules.filter(m => m !== moduleId);
    filtered.unshift(moduleId);
    this.saveData({ recentModules: filtered.slice(0, 6) });
  }

  static getRecentModules(): string[] {
    return this.loadData().recentModules;
  }

  // Global export/import
  static exportFullBackup(): string {
    return JSON.stringify(this.loadData(), null, 2);
  }

  static importFullBackup(jsonStr: string): boolean {
    try {
      const parsed = JSON.parse(jsonStr);
      if (typeof parsed !== 'object' || parsed === null) return false;
      this.saveData(parsed);
      return true;
    } catch {
      return false;
    }
  }

  static clearAllData(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem(STORAGE_KEY);
    }
  }
}

