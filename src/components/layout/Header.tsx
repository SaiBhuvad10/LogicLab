import React, { useState } from 'react';
import { useAppStore } from '../../store/appStore';
import { useNavigate } from 'react-router-dom';
import { MODULES } from '../../data/modules';
import {
  Menu,
  Sun,
  Moon,
  Search,
  Bell,
  Cpu,
  GraduationCap
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    theme,
    toggleTheme,
    toggleSidebar,
    searchQuery,
    setSearchQuery,
    notifications,
    removeNotification
  } = useAppStore();

  const navigate = useNavigate();
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  const filteredModules = searchQuery.trim()
    ? MODULES.filter(
        (m) =>
          m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          m.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  return (
    <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-30 select-none shadow-xs">
      <div className="h-16 px-3 sm:px-4 flex items-center justify-between">
        {/* Left: Hamburger & Brand */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Toggle Sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div
            onClick={() => navigate('/')}
            className="flex items-center gap-2 sm:gap-2.5 cursor-pointer group"
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <Cpu className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-sm sm:text-base tracking-tight text-slate-900 dark:text-white">
                  LogicLab
                </span>
                <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 px-1.5 py-0.2 rounded font-mono">
                  v1.0
                </span>
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium hidden sm:block">
                Digital Electronics Laboratory
              </div>
            </div>
          </div>
        </div>

        {/* Middle: Universal Search Bar (Desktop) */}
        <div className="relative flex-1 max-w-md mx-4 hidden md:block">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSearchDropdown(true);
              }}
              onFocus={() => setShowSearchDropdown(true)}
              placeholder="Search gates, solvers, K-Maps, flip-flops..."
              className="w-full pl-9 pr-4 py-1.5 bg-slate-100 dark:bg-slate-800 border border-transparent focus:border-blue-500 rounded-xl text-xs text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-medium"
            />
          </div>

          {/* Search Results Dropdown */}
          {showSearchDropdown && searchQuery.trim() && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl p-2 z-50 max-h-80 overflow-y-auto">
              {filteredModules.length === 0 ? (
                <div className="p-3 text-center text-xs text-slate-400">
                  No matching tools or topics found
                </div>
              ) : (
                <div className="space-y-1">
                  {filteredModules.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => {
                        navigate(m.path);
                        setSearchQuery('');
                        setShowSearchDropdown(false);
                      }}
                      className="w-full text-left p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-between transition-colors"
                    >
                      <div>
                        <div className="font-semibold text-xs text-slate-800 dark:text-slate-100">
                          {m.name}
                        </div>
                        <div className="text-[11px] text-slate-400 line-clamp-1">
                          {m.description}
                        </div>
                      </div>
                      <span className="text-[10px] text-blue-500 font-mono">
                        {m.category}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Controls: Mobile Search, Theme Toggle, Notifications, User Badge */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Mobile Search Button */}
          <button
            onClick={() => setShowMobileSearch(!showMobileSearch)}
            className="md:hidden p-2 rounded-xl text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Search"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Light/Dark Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          >
            {theme === 'dark' ? (
              <Sun className="w-5 h-5 text-amber-400" />
            ) : (
              <Moon className="w-5 h-5 text-slate-600" />
            )}
          </button>

          {/* Notification Bell */}
          <div className="relative">
            <button
              onClick={() => setShowNotifMenu(!showNotifMenu)}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative"
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
              {notifications.length > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-600 ring-2 ring-white dark:ring-slate-900" />
              )}
            </button>

            {showNotifMenu && (
              <div className="absolute right-0 mt-2 w-72 sm:w-80 max-w-[90vw] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl p-3 z-50">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-100">
                    Notifications
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {notifications.length} recent
                  </span>
                </div>
                {notifications.length === 0 ? (
                  <div className="py-4 text-center text-xs text-slate-400">
                    No active notifications
                  </div>
                ) : (
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {notifications.map((n) => (
                      <div
                        key={n.id}
                        className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800 text-xs flex items-start justify-between gap-2"
                      >
                        <span className="text-slate-700 dark:text-slate-300">
                          {n.message}
                        </span>
                        <button
                          onClick={() => removeNotification(n.id)}
                          className="text-slate-400 hover:text-slate-600 text-[10px]"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* User Profile Area (No Auth Required) */}
          <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800 ml-1">
            <div className="w-8 h-8 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-xs border border-blue-500/20">
              <GraduationCap className="w-4 h-4" />
            </div>
            <div className="hidden lg:block text-left">
              <div className="text-xs font-bold text-slate-800 dark:text-slate-100 leading-tight">
                Semester III
              </div>
              <div className="text-[10px] text-slate-400 leading-tight">
                Computer Engineering
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Search Overlay Bar */}
      {showMobileSearch && (
        <div className="md:hidden px-3 py-2 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/90">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              autoFocus
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tools, gates, flip-flops..."
              className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
          {searchQuery.trim() && (
            <div className="mt-2 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-2 max-h-60 overflow-y-auto space-y-1">
              {filteredModules.length === 0 ? (
                <div className="text-center text-xs text-slate-400 py-2">No matching tools</div>
              ) : (
                filteredModules.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => {
                      navigate(m.path);
                      setSearchQuery('');
                      setShowMobileSearch(false);
                    }}
                    className="w-full text-left p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-xs flex items-center justify-between"
                  >
                    <span className="font-semibold text-slate-800 dark:text-slate-100">{m.name}</span>
                    <span className="text-[10px] text-blue-500">{m.category}</span>
                  </button>
                ))
              )}
            </div>
          )}
        </div>
      )}
    </header>
  );
};

