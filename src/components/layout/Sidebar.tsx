import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAppStore } from '../../store/appStore';
import { MODULES, NavModule } from '../../data/modules';
import {
  LayoutDashboard,
  Cpu,
  Workflow,
  TableProperties,
  Binary,
  Grid,
  Calculator,
  Share2,
  ToggleRight,
  Timer,
  FastForward,
  GraduationCap,
  CheckSquare,
  FolderHeart,
  Settings
} from 'lucide-react';

const ICON_MAP: Record<string, React.ReactNode> = {
  LayoutDashboard: <LayoutDashboard className="w-4 h-4" />,
  Cpu: <Cpu className="w-4 h-4" />,
  Workflow: <Workflow className="w-4 h-4" />,
  TableProperties: <TableProperties className="w-4 h-4" />,
  Binary: <Binary className="w-4 h-4" />,
  Grid: <Grid className="w-4 h-4" />,
  Calculator: <Calculator className="w-4 h-4" />,
  Share2: <Share2 className="w-4 h-4" />,
  ToggleRight: <ToggleRight className="w-4 h-4" />,
  Timer: <Timer className="w-4 h-4" />,
  FastForward: <FastForward className="w-4 h-4" />,
  GraduationCap: <GraduationCap className="w-4 h-4" />,
  CheckSquare: <CheckSquare className="w-4 h-4" />,
  FolderHeart: <FolderHeart className="w-4 h-4" />,
  Settings: <Settings className="w-4 h-4" />
};

export const Sidebar: React.FC = () => {
  const { sidebarOpen, setSidebarOpen, setActiveModuleId } = useAppStore();

  const categories = [
    'Overview',
    'Core Tools',
    'Circuits',
    'Sequential',
    'Education',
    'Preferences'
  ] as const;

  const handleNavClick = (id: string) => {
    setActiveModuleId(id);
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

  return (
    <aside
      className={`fixed lg:static top-16 bottom-0 left-0 z-30 w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col transition-transform duration-200 ease-in-out select-none shadow-xl lg:shadow-none ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}
    >
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
        {categories.map((cat) => {
          const items = MODULES.filter((m) => m.category === cat);
          if (items.length === 0) return null;

          return (
            <div key={cat}>
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-3 mb-1.5">
                {cat}
              </div>
              <div className="space-y-0.5">
                {items.map((item: NavModule) => (
                  <NavLink
                    key={item.id}
                    to={item.path}
                    onClick={() => handleNavClick(item.id)}
                    className={({ isActive }) =>
                      `flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all group ${
                        isActive
                          ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/30'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <div className="flex items-center gap-2.5">
                          <span
                            className={
                              isActive
                                ? 'text-white'
                                : 'text-slate-400 group-hover:text-blue-500 transition-colors'
                            }
                          >
                            {ICON_MAP[item.icon] || <Cpu className="w-4 h-4" />}
                          </span>
                          <span className="truncate">{item.name}</span>
                        </div>

                        {item.badge && (
                          <span
                            className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase tracking-wider ${
                              isActive
                                ? 'bg-white/20 text-white'
                                : 'bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400'
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </>
                    )}
                  </NavLink>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Sidebar Footer info */}
      <div className="p-3 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-400 dark:text-slate-500 flex items-center justify-between">
        <span>Semester III Laboratory</span>
        <span className="font-mono text-[10px] text-blue-500">SE-COMP</span>
      </div>
    </aside>
  );
};

