import React from 'react';
import { useReports } from '../../context/ReportsContext';
import { exportReportsToCsv } from '../../utils/csvExporter';
import {
  Filter,
  Download,
  LayoutGrid,
  List,
  RotateCcw,
  Search
} from 'lucide-react';

export function ReportFilters({ viewMode, setViewMode, filteredReports = [] }) {
  const { filters, setFilters, addToast } = useReports();

  const handleExport = () => {
    exportReportsToCsv(filteredReports, `civicfix-reports-${new Date().toISOString().split('T')[0]}.csv`);
    addToast(`Exported ${filteredReports.length} reports to CSV.`, 'success', 'Export Complete');
  };

  const handleResetFilters = () => {
    setFilters({
      search: '',
      category: 'all',
      status: 'all',
      priority: 'all',
      sort: 'newest'
    });
  };

  const hasActiveFilters =
    filters.search ||
    filters.category !== 'all' ||
    filters.status !== 'all' ||
    filters.priority !== 'all';

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs space-y-3.5">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by ID, keyword, address, or reporter..."
            value={filters.search}
            onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
            className="w-full pl-9 pr-3.5 py-2 text-sm bg-slate-50 focus:bg-white border border-slate-200 focus:border-teal-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 text-slate-900 transition-all"
          />
        </div>

        {/* View Switcher & Export */}
        <div className="flex items-center space-x-2 shrink-0">
          {/* Table / Grid view switcher */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg text-xs font-medium transition-colors ${
                viewMode === 'table' ? 'bg-white text-teal-700 shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
              title="Table view"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('cards')}
              className={`p-1.5 rounded-lg text-xs font-medium transition-colors ${
                viewMode === 'cards' ? 'bg-white text-teal-700 shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
              title="Card view"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>

          {/* Export CSV Button */}
          <button
            onClick={handleExport}
            className="flex items-center px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs border border-slate-200 transition-colors"
            title="Export filtered reports to CSV format"
          >
            <Download className="w-3.5 h-3.5 mr-1.5 text-slate-500" />
            <span>Export CSV</span>
          </button>

          {/* Reset Filters */}
          {hasActiveFilters && (
            <button
              onClick={handleResetFilters}
              className="p-2 text-slate-400 hover:text-rose-600 rounded-xl hover:bg-rose-50 transition-colors"
              title="Clear all filters"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Filter Selects */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2 border-t border-slate-100">
        {/* Category */}
        <div>
          <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            Category
          </label>
          <select
            value={filters.category}
            onChange={(e) => setFilters((prev) => ({ ...prev, category: e.target.value }))}
            className="w-full text-xs font-medium py-1.5 px-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 focus:outline-none focus:border-teal-500"
          >
            <option value="all">All Categories</option>
            <option value="pothole">Pothole</option>
            <option value="garbage">Garbage</option>
            <option value="water_leakage">Water Leakage</option>
            <option value="damaged_streetlight">Streetlight</option>
            <option value="drainage">Drainage</option>
            <option value="road_damage">Road Damage</option>
            <option value="other">Other</option>
          </select>
        </div>

        {/* Status */}
        <div>
          <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            Status
          </label>
          <select
            value={filters.status}
            onChange={(e) => setFilters((prev) => ({ ...prev, status: e.target.value }))}
            className="w-full text-xs font-medium py-1.5 px-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 focus:outline-none focus:border-teal-500"
          >
            <option value="all">All Statuses</option>
            <option value="Submitted">Submitted</option>
            <option value="Acknowledged">Acknowledged</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
          </select>
        </div>

        {/* Priority */}
        <div>
          <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            Priority
          </label>
          <select
            value={filters.priority}
            onChange={(e) => setFilters((prev) => ({ ...prev, priority: e.target.value }))}
            className="w-full text-xs font-medium py-1.5 px-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 focus:outline-none focus:border-teal-500"
          >
            <option value="all">All Priorities</option>
            <option value="Critical">Critical (85-100)</option>
            <option value="High">High (65-84)</option>
            <option value="Medium">Medium (40-64)</option>
            <option value="Low">Low (0-39)</option>
          </select>
        </div>

        {/* Sort */}
        <div>
          <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            Sort By
          </label>
          <select
            value={filters.sort}
            onChange={(e) => setFilters((prev) => ({ ...prev, sort: e.target.value }))}
            className="w-full text-xs font-medium py-1.5 px-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 focus:outline-none focus:border-teal-500"
          >
            <option value="newest">Newest First</option>
            <option value="highest_priority">Highest Priority Score</option>
            <option value="lowest_priority">Lowest Priority Score</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>
      </div>
    </div>
  );
}
