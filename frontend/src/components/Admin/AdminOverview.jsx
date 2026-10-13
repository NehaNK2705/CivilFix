import React, { useState } from 'react';
import { useReports } from '../../context/ReportsContext';
import { PriorityBadge } from '../Common/PriorityBadge';
import { StatusPill } from '../Common/StatusPill';
import { CATEGORY_LABELS, formatDate } from '../../utils/formatters';
import {
  Shield,
  AlertTriangle,
  CheckCircle,
  Wrench,
  Clock,
  Eye,
  ArrowRight,
  Info
} from 'lucide-react';

export function AdminOverview() {
  const {
    reports,
    stats,
    isAdminMode,
    toggleAdminMode,
    updateReportStatus,
    setSelectedReport
  } = useReports();

  const [quickNotes, setQuickNotes] = useState({});

  // High & Critical urgency queue
  const urgentReports = reports.filter(
    (r) => (r.priorityLabel === 'Critical' || r.priorityLabel === 'High') && r.status !== 'Resolved'
  );

  const handleQuickStatus = async (reportId, nextStatus) => {
    const note = quickNotes[reportId] || `Admin expedited to ${nextStatus}`;
    await updateReportStatus(reportId, nextStatus, note);
    setQuickNotes((prev) => ({ ...prev, [reportId]: '' }));
  };

  return (
    <div className="space-y-6">
      {/* Admin Mode Alert & Banner */}
      <div
        className={`rounded-2xl p-5 border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
          isAdminMode
            ? 'bg-amber-500/10 border-amber-300 text-amber-900'
            : 'bg-slate-100 border-slate-200 text-slate-800'
        }`}
      >
        <div className="flex items-start space-x-3.5">
          <div
            className={`p-2.5 rounded-xl ${
              isAdminMode ? 'bg-amber-500 text-white' : 'bg-slate-300 text-slate-700'
            }`}
          >
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold">
              {isAdminMode
                ? 'Authorized Demo Administrator Mode Active'
                : 'Demo Administrator Mode Disabled (Viewing as Citizen)'}
            </h3>
            <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
              {isAdminMode
                ? 'You can dispatch work orders, escalate triage tiers, and change lifecycle resolution stages.'
                : 'Enable Demo Admin Mode to test operational triage workflows and status escalation without passwords.'}
            </p>
          </div>
        </div>

        <button
          onClick={toggleAdminMode}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
            isAdminMode
              ? 'bg-amber-600 hover:bg-amber-700 text-white shadow-sm'
              : 'bg-slate-900 hover:bg-slate-800 text-white'
          }`}
        >
          {isAdminMode ? 'Disable Admin Privileges' : 'Enable Demo Admin Mode'}
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Urgent Backlog</span>
          <div className="text-2xl font-extrabold text-rose-600 mt-1">
            {urgentReports.length} Cases
          </div>
          <span className="text-[11px] text-slate-400">Critical & High unaddressed</span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Active Field Crews</span>
          <div className="text-2xl font-extrabold text-indigo-600 mt-1">
            {stats?.inProgressReports || 0} In Progress
          </div>
          <span className="text-[11px] text-slate-400">Dispatched & working</span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Acknowledged / Queued</span>
          <div className="text-2xl font-extrabold text-blue-600 mt-1">
            {stats?.acknowledgedReports || 0} Assigned
          </div>
          <span className="text-[11px] text-slate-400">Scheduled for inspection</span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Resolution Clearance</span>
          <div className="text-2xl font-extrabold text-emerald-600 mt-1">
            {stats?.resolutionRate || 0}%
          </div>
          <span className="text-[11px] text-slate-400">
            {stats?.resolvedReports || 0} resolved to date
          </span>
        </div>
      </div>

      {/* Urgent Dispatch & Triage Table */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center">
              <AlertTriangle className="w-4 h-4 mr-1.5 text-rose-600" />
              Emergency Triage & Fast-Track Dispatch Queue
            </h3>
            <p className="text-xs text-slate-500">
              Highest scoring public safety hazards requiring operator action
            </p>
          </div>
          <span className="text-xs font-bold px-2.5 py-1 bg-rose-50 text-rose-700 rounded-lg">
            {urgentReports.length} Urgent Items
          </span>
        </div>

        {urgentReports.length === 0 ? (
          <div className="p-8 text-center bg-slate-50 rounded-xl text-slate-500 text-sm">
            🎉 All high and critical priority issues have been successfully resolved!
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {urgentReports.map((report) => (
              <div
                key={report.id}
                className="py-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 group"
              >
                {/* Details */}
                <div className="flex-1 space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs font-bold text-teal-600">
                      {report.id}
                    </span>
                    <PriorityBadge
                      label={report.priorityLabel}
                      score={report.priorityScore}
                    />
                    <StatusPill status={report.status} />
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 leading-snug">
                    {report.title}
                  </h4>
                  <p className="text-xs text-slate-500">
                    📍 {report.location} • {formatDate(report.createdAt)}
                  </p>
                </div>

                {/* Quick Status Workflow Action Buttons */}
                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  <button
                    onClick={() => setSelectedReport(report)}
                    className="p-2 text-slate-400 hover:text-teal-600 hover:bg-slate-100 rounded-lg transition-colors"
                    title="View report details"
                  >
                    <Eye className="w-4 h-4" />
                  </button>

                  {isAdminMode ? (
                    <>
                      {report.status === 'Submitted' && (
                        <button
                          onClick={() => handleQuickStatus(report.id, 'Acknowledged')}
                          className="px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-xs font-bold border border-blue-200 transition-colors"
                        >
                          Acknowledge
                        </button>
                      )}

                      {(report.status === 'Submitted' || report.status === 'Acknowledged') && (
                        <button
                          onClick={() => handleQuickStatus(report.id, 'In Progress')}
                          className="px-3 py-1.5 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-lg text-xs font-bold border border-indigo-200 transition-colors"
                        >
                          Dispatch Crew
                        </button>
                      )}

                      <button
                        onClick={() => handleQuickStatus(report.id, 'Resolved')}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-xs transition-colors"
                      >
                        Mark Resolved
                      </button>
                    </>
                  ) : (
                    <span className="text-xs text-slate-400 italic">
                      Enable admin mode to update
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Architecture Disclaimer Card */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-xs text-slate-600 leading-relaxed space-y-2">
        <h4 className="font-bold text-slate-900 flex items-center">
          <Info className="w-4 h-4 mr-1.5 text-teal-600" />
          Technical Hackathon Note on Architecture & Persistence
        </h4>
        <p>
          This dashboard communicates with an Express REST API backend storing entities in memory for high-performance zero-configuration demoing. Simultaneously, changes are mirrored locally in the browser’s <code className="font-mono bg-white px-1.5 py-0.5 rounded border border-slate-200 text-teal-700">localStorage</code>. When the server process restarts, in-memory records are re-seeded, but client operations continue uninterrupted without database provisioning.
        </p>
      </div>
    </div>
  );
}
