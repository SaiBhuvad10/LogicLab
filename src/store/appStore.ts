import { create } from 'zustand';
import { StorageUtil, UserSettings } from '../utils/storage';

interface Notification {
  id: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: number;
}

interface AppState {
  theme: 'light' | 'dark' | 'system';
  settings: UserSettings;
  sidebarOpen: boolean;
  searchQuery: string;
  notifications: Notification[];
  activeModuleId: string;

  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  toggleTheme: () => void;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  setSearchQuery: (query: string) => void;
  setActiveModuleId: (id: string) => void;
  updateSettings: (partial: Partial<UserSettings>) => void;
  addNotification: (message: string, type?: 'info' | 'success' | 'warning' | 'error') => void;
  removeNotification: (id: string) => void;
}

export const useAppStore = create<AppState>((set, get) => {
  const initialSettings = StorageUtil.getSettings();
  const initialTheme = initialSettings.theme;

  // Apply theme to document element
  if (typeof document !== 'undefined') {
    if (initialTheme === 'dark' || (initialTheme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }

  return {
    theme: initialTheme,
    settings: initialSettings,
    sidebarOpen: true,
    searchQuery: '',
    notifications: [],
    activeModuleId: 'dashboard',

    setTheme: (theme) => {
      const updated = StorageUtil.updateSettings({ theme });
      if (typeof document !== 'undefined') {
        if (theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
      set({ theme, settings: updated });
    },

    toggleTheme: () => {
      const next = get().theme === 'dark' ? 'light' : 'dark';
      get().setTheme(next);
    },

    setSidebarOpen: (open) => set({ sidebarOpen: open }),
    toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
    setSearchQuery: (searchQuery) => set({ searchQuery }),

    setActiveModuleId: (id) => {
      StorageUtil.recordModuleVisit(id);
      set({ activeModuleId: id });
    },

    updateSettings: (partial) => {
      const updated = StorageUtil.updateSettings(partial);
      set({ settings: updated });
    },

    addNotification: (message, type = 'info') => {
      const notif: Notification = {
        id: `notif_${Date.now()}_${Math.random()}`,
        message,
        type,
        timestamp: Date.now()
      };
      set((state) => ({ notifications: [notif, ...state.notifications].slice(0, 5) }));
      setTimeout(() => {
        get().removeNotification(notif.id);
      }, 4000);
    },

    removeNotification: (id) => {
      set((state) => ({
        notifications: state.notifications.filter((n) => n.id !== id)
      }));
    }
  };
});

