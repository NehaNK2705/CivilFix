import React, { useState } from 'react';
import {
  Search,
  PlusCircle,
  RotateCcw,
  Shield,
  Wifi,
  WifiOff,
  Menu,
  Sparkles
} from 'lucide-react';
import { useReports } from '../../context/ReportsContext';
import { ConfirmModal } from '../Common/ConfirmModal';

export function Navbar({ activeTab, setActiveTab, onMobileMenuToggle }) {
  const {
    serverStatus,
    isAdminMode,
    toggleAdminMode,
    filters,
    setFilters,
    resetDemoData
  } = useReports();

  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleSearchChange = (e) => {
    setFilters((prev) => ({ ...prev, search: e.target.value }));
    if (activeTab !== 'explorer' && e.target.value.trim().length > 0) {
      setActiveTab('explorer');
    }
  };

  return (
    <>
      <header className="bg-white/95 backdrop-blur-md border-b border-slate-200 sticky top-0 z-20 px-4 py-3 sm:px-6 shadow-xs">
        <div className="flex items-center justify-between gap-3">
          {/* Mobile menu toggle & Title */}
          <div className="flex items-center space-x-3">
            <button
              onClick={onMobileMenuToggle}
              className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 focus:outline-none"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="hidden sm:flex flex-col">
              <h1 className="text-lg font-bold text-slate-900 leading-tight">
                {activeTab === 'dashboard' && 'Civic Operations Dashboard'}
                {activeTab === 'report' && 'Submit New Civic Issue'}
                {activeTab === 'explorer' && 'Citizen Complaints Explorer'}
                {activeTab === 'map' && 'Interactive Metropolitan Issue Map'}
                {activeTab === 'admin' && 'Demo Administrator Control Room'}
                {activeTab === 'classifier' && 'Transparent Heuristic Priority Engine'}
              </h1>
              <span className="text-xs text-slate-500 font-medium">
                Transparent heuristics • Instant triage • Zero database required
              </span>
            </div>
          </div>

          {/* Search bar */}
          <div className="flex-1 max-w-md relative hidden md:block">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search reports by ID, title, keyword, or landmark..."
              value={filters.search}
              onChange={handleSearchChange}
              className="w-full pl-9 pr-4 py-1.5 text-sm bg-slate-100 hover:bg-slate-100/80 focus:bg-white border border-transparent focus:border-teal-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 transition-all text-slate-800 placeholder-slate-400"
            />
          </div>

          {/* Right Controls */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Server Connection Status Badge */}
            <div
              className={`hidden lg:flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${
                serverStatus === 'connected'
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-amber-50 text-amber-700 border-amber-200'
              }`}
              title={
                serverStatus === 'connected'
                  ? 'Connected to Express In-Memory REST API (Data resets on server restart)'
                  : 'Offline mode active: client-side localStorage fallback is active'
              }
            >
              {serverStatus === 'connected' ? (
                <>
                  <Wifi className="w-3.5 h-3.5 mr-1.5 text-emerald-600" />
                  <span>REST API Connected</span>
                </>
              ) : (
                <>
                  <WifiOff className="w-3.5 h-3.5 mr-1.5 text-amber-600" />
                  <span>Local Storage Fallback</span>
                </>
              )}
            </div>

            {/* Admin Toggle */}
            <button
              onClick={toggleAdminMode}
              className={`flex items-center px-2.5 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                isAdminMode
                  ? 'bg-amber-500 text-white border-amber-600 shadow-sm shadow-amber-500/25 ring-2 ring-amber-400/40'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200'
              }`}
              title="Toggle Demo Admin privileges (no production login required)"
            >
              <Shield className="w-3.5 h-3.5 mr-1" />
              <span className="hidden sm:inline">Admin Mode:</span>
              <span className="ml-1 font-bold">{isAdminMode ? 'ON' : 'OFF'}</span>
            </button>

            {/* Reset Demo Data Button */}
            <button
              onClick={() => setShowResetConfirm(true)}
              className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 border border-slate-200 flex items-center transition-colors"
              title="Reset to 14 realistic demo reports"
            >
              <RotateCcw className="w-3.5 h-3.5 sm:mr-1 text-slate-500" />
              <span className="hidden sm:inline">Reset Demo</span>
            </button>

            {/* Primary Action Button */}
            <button
              onClick={() => setActiveTab('report')}
              className="flex items-center px-3.5 py-1.5 bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-700 hover:to-teal-600 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-sm shadow-teal-500/25 transition-all transform active:scale-95"
            >
              <PlusCircle className="w-4 h-4 mr-1.5" />
              <span>Report Issue</span>
            </button>
          </div>
        </div>
      </header>

      {/* Reset Confirmation Modal */}
      <ConfirmModal
        isOpen={showResetConfirm}
        title="Reset Demo Dataset?"
        message="This will restore the default 14 realistic municipal reports across all categories and reset any custom edits. Proceed?"
        confirmText="Reset to Seed Data"
        isDestructive={false}
        onConfirm={() => {
          resetDemoData();
          setShowResetConfirm(false);
        }}
        onCancel={() => setShowResetConfirm(false)}
      />
    </>
  );
}
