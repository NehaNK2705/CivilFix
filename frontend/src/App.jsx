import React, { useState } from 'react';
import { ReportsProvider, useReports } from './context/ReportsContext';
import { Sidebar } from './components/Layout/Sidebar';
import { Navbar } from './components/Layout/Navbar';
import { ToastContainer } from './components/Common/Toast';
import { MetricCards } from './components/Dashboard/MetricCards';
import { TrendsChart } from './components/Dashboard/TrendsChart';
import { CategoryChart } from './components/Dashboard/CategoryChart';
import { RecentReports } from './components/Dashboard/RecentReports';
import { ReportForm } from './components/Reports/ReportForm';
import { ReportFilters } from './components/Reports/ReportFilters';
import { ReportTable } from './components/Reports/ReportTable';
import { ReportCard } from './components/Reports/ReportCard';
import { ReportDetailModal } from './components/Reports/ReportDetailModal';
import { CivicMap } from './components/Map/CivicMap';
import { AdminOverview } from './components/Admin/AdminOverview';
import { ClassificationPreview } from './components/ClassifierExplainer/ClassificationPreview';
import { PlusCircle, FileSearch, ArrowRight, ShieldCheck, Sparkles, X } from 'lucide-react';

function DashboardContent({ activeTab, setActiveTab }) {
  const { reports, filters, setSelectedReport } = useReports();
  const [explorerViewMode, setExplorerViewMode] = useState('table'); // 'table' | 'cards'
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Filtered reports for Explorer
  const filteredReports = reports.filter((r) => {
    // Search query
    if (filters.search && filters.search.trim() !== '') {
      const q = filters.search.trim().toLowerCase();
      const match =
        r.id.toLowerCase().includes(q) ||
        r.title.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q) ||
        r.location.toLowerCase().includes(q) ||
        (r.reporterName && r.reporterName.toLowerCase().includes(q));
      if (!match) return false;
    }

    // Category
    if (filters.category && filters.category !== 'all') {
      if (r.category !== filters.category) return false;
    }

    // Status
    if (filters.status && filters.status !== 'all') {
      if (r.status.toLowerCase() !== filters.status.toLowerCase()) return false;
    }

    // Priority
    if (filters.priority && filters.priority !== 'all') {
      if (r.priorityLabel.toLowerCase() !== filters.priority.toLowerCase()) return false;
    }

    return true;
  });

  // Sort filtered
  filteredReports.sort((a, b) => {
    if (filters.sort === 'highest_priority') return b.priorityScore - a.priorityScore;
    if (filters.sort === 'lowest_priority') return a.priorityScore - b.priorityScore;
    if (filters.sort === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt);
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      {/* Desktop & Mobile Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          setIsMobileMenuOpen(false);
        }}
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
      />

      {/* Mobile Drawer Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <div
            className="w-64 h-full bg-slate-900"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-end p-3">
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-slate-400 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            {/* Same sidebar inside mobile drawer */}
            <Sidebar
              activeTab={activeTab}
              setActiveTab={(tab) => {
                setActiveTab(tab);
                setIsMobileMenuOpen(false);
              }}
              isCollapsed={false}
              setIsCollapsed={() => {}}
            />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Navbar */}
        <Navbar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onMobileMenuToggle={() => setIsMobileMenuOpen(true)}
        />

        {/* Scrollable View Container */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
          {/* TAB 1: DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Banner CTA */}
              <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-teal-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
                <div className="max-w-2xl relative z-10 space-y-3">
                  <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 border border-teal-400/30 text-xs font-semibold">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Real-Time Citizen Issue Resolution Platform</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white leading-tight">
                    Smart Civic Issue Reporting with Instant Hazard Classification
                  </h2>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    Transparent rule-based priority scoring empowers citizens to report street damage, water leakage, open manholes, and electrical hazards while operations teams triage emergency corridors.
                  </p>
                  <div className="pt-2 flex flex-wrap gap-3">
                    <button
                      onClick={() => setActiveTab('report')}
                      className="px-5 py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md shadow-teal-500/25 flex items-center"
                    >
                      <PlusCircle className="w-4 h-4 mr-2" />
                      <span>Report a New Issue</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('map')}
                      className="px-5 py-2.5 bg-slate-800/80 hover:bg-slate-700 text-white font-semibold text-xs sm:text-sm rounded-xl border border-slate-700 transition-all flex items-center"
                    >
                      <span>Explore Spatial Map</span>
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </button>
                  </div>
                </div>
              </div>

              {/* KPI Metric Cards */}
              <MetricCards />

              {/* Charts Row */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <TrendsChart />
                <CategoryChart />
              </div>

              {/* Recent Reports Table */}
              <RecentReports setActiveTab={setActiveTab} />
            </div>
          )}

          {/* TAB 2: REPORT ISSUE */}
          {activeTab === 'report' && (
            <ReportForm
              onReportCreated={(created) => {
                setSelectedReport(created);
                setActiveTab('explorer');
              }}
            />
          )}

          {/* TAB 3: EXPLORER */}
          {activeTab === 'explorer' && (
            <div className="space-y-5">
              <ReportFilters
                viewMode={explorerViewMode}
                setViewMode={setExplorerViewMode}
                filteredReports={filteredReports}
              />

              {explorerViewMode === 'table' ? (
                <ReportTable reports={filteredReports} />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredReports.map((report) => (
                    <ReportCard key={report.id} report={report} />
                  ))}
                  {filteredReports.length === 0 && (
                    <div className="col-span-full bg-white rounded-2xl p-12 text-center border border-slate-200 text-slate-500 text-sm">
                      No reports match the selected filters.
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: CIVIC MAP */}
          {activeTab === 'map' && <CivicMap />}

          {/* TAB 5: ADMIN OVERVIEW */}
          {activeTab === 'admin' && <AdminOverview />}

          {/* TAB 6: HEURISTICS ENGINE EXPLORER */}
          {activeTab === 'classifier' && <ClassificationPreview />}
        </main>
      </div>

      {/* Global Modals & Toasts */}
      <ReportDetailModal />
      <ToastContainer />
    </div>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <ReportsProvider>
      <DashboardContent activeTab={activeTab} setActiveTab={setActiveTab} />
    </ReportsProvider>
  );
}
