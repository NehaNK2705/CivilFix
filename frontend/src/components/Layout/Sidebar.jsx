import React from 'react';
import {
  LayoutDashboard,
  PlusCircle,
  FileSearch,
  MapPin,
  ShieldCheck,
  Cpu,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { useReports } from '../../context/ReportsContext';

export function Sidebar({ activeTab, setActiveTab, isCollapsed, setIsCollapsed }) {
  const { stats, isAdminMode } = useReports();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, badge: null },
    { id: 'report', label: 'Report Issue', icon: PlusCircle, badge: 'New', badgeColor: 'bg-teal-500' },
    { id: 'explorer', label: 'Reports Explorer', icon: FileSearch, badge: stats?.totalReports || null },
    { id: 'map', label: 'Civic Map View', icon: MapPin, badge: 'Live' },
    { id: 'admin', label: 'Admin Command', icon: ShieldCheck, badge: isAdminMode ? 'Active' : null, badgeColor: 'bg-amber-500' },
    { id: 'classifier', label: 'Heuristics Engine', icon: Cpu, badge: 'Rules' }
  ];

  return (
    <aside
      className={`bg-slate-900 text-white transition-all duration-300 ease-in-out flex flex-col fixed md:relative z-30 h-screen ${
        isCollapsed ? 'w-20' : 'w-64'
      } border-r border-slate-800 shadow-xl`}
    >
      {/* Brand Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-800/80">
        <div className="flex items-center space-x-3 overflow-hidden">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-teal-500/20 shrink-0">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col truncate">
              <span className="font-extrabold text-base tracking-tight text-white leading-tight">
                CivicFix <span className="text-teal-400 font-black">AI</span>
              </span>
              <span className="text-[11px] text-slate-400 font-medium">Smart Resolution Hub</span>
            </div>
          )}
        </div>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden md:flex p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-teal-600/90 text-white shadow-md shadow-teal-600/25 ring-1 ring-teal-400/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
              title={isCollapsed ? item.label : undefined}
            >
              <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'}`} />
              {!isCollapsed && (
                <div className="ml-3 flex-1 flex items-center justify-between truncate">
                  <span className="truncate">{item.label}</span>
                  {item.badge !== null && (
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full text-white ${
                        item.badgeColor || 'bg-slate-700'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </nav>

      {/* Admin Mode Status Banner */}
      {!isCollapsed && (
        <div className="p-3 mx-3 mb-3 rounded-xl bg-slate-800/80 border border-slate-700/60">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 font-medium">Role:</span>
            <span
              className={`font-semibold px-2 py-0.5 rounded text-[11px] ${
                isAdminMode ? 'bg-amber-500/20 text-amber-300' : 'bg-teal-500/20 text-teal-300'
              }`}
            >
              {isAdminMode ? 'Demo Admin' : 'Resident'}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1 leading-snug">
            {isAdminMode ? 'Can escalate & resolve issues' : 'Can submit and monitor complaints'}
          </p>
        </div>
      )}

      {/* Footer Info */}
      <div className="p-3 border-t border-slate-800/80 text-[11px] text-slate-400">
        {!isCollapsed ? (
          <div className="flex flex-col space-y-1">
            <div className="flex items-center justify-between text-slate-400">
              <span>Prototype v1.0</span>
              <span className="text-teal-400 font-medium">In-Memory / Local</span>
            </div>
            <p className="text-[10px] text-slate-400 leading-tight">
              Designed for Hackathon Fast Track Demo.
            </p>
          </div>
        ) : (
          <div className="text-center font-mono text-[10px] text-slate-400">v1.0</div>
        )}
      </div>
    </aside>
  );
}
