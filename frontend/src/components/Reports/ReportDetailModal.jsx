import React, { useState } from 'react';
import { useReports } from '../../context/ReportsContext';
import { PriorityBadge } from '../Common/PriorityBadge';
import { StatusPill } from '../Common/StatusPill';
import { CATEGORY_LABELS, formatDate } from '../../utils/formatters';
import {
  X,
  MapPin,
  User,
  Calendar,
  CheckCircle2,
  Clock,
  Wrench,
  AlertOctagon,
  ShieldAlert,
  Send,
  Shield,
  FileText
} from 'lucide-react';

const STATUS_STEPS = ['Submitted', 'Acknowledged', 'In Progress', 'Resolved'];

export function ReportDetailModal() {
  const {
    selectedReport,
    setSelectedReport,
    isAdminMode,
    updateReportStatus
  } = useReports();

  const [newStatus, setNewStatus] = useState('');
  const [adminNote, setAdminNote] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  if (!selectedReport) return null;

  const handleUpdate = async (statusToSet) => {
    setIsUpdating(true);
    try {
      await updateReportStatus(
        selectedReport.id,
        statusToSet,
        adminNote || `Status updated to ${statusToSet} via Demo Admin console.`
      );
      setAdminNote('');
    } finally {
      setIsUpdating(false);
    }
  };

  const currentStepIdx = STATUS_STEPS.indexOf(selectedReport.status);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200 animate-fadeIn">
        {/* Modal Header */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-slate-200 flex items-center justify-between z-10">
          <div className="flex items-center space-x-3">
            <span className="font-mono text-sm font-extrabold text-teal-600 bg-teal-50 px-2.5 py-1 rounded-lg border border-teal-100">
              {selectedReport.id}
            </span>
            <span className="text-xs font-semibold text-slate-500">
              {CATEGORY_LABELS[selectedReport.category] || selectedReport.category}
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <PriorityBadge
              label={selectedReport.priorityLabel}
              score={selectedReport.priorityScore}
            />
            <button
              onClick={() => setSelectedReport(null)}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {/* Title & Metadata */}
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug">
              {selectedReport.title}
            </h2>
            <div className="flex flex-wrap items-center gap-y-2 gap-x-4 mt-2.5 text-xs text-slate-500">
              <div className="flex items-center">
                <MapPin className="w-3.5 h-3.5 mr-1 text-teal-600" />
                <span className="font-medium text-slate-700">{selectedReport.location}</span>
              </div>
              <div className="flex items-center">
                <User className="w-3.5 h-3.5 mr-1 text-slate-400" />
                <span>Reporter: {selectedReport.reporterName}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="w-3.5 h-3.5 mr-1 text-slate-400" />
                <span>Filed: {formatDate(selectedReport.createdAt)}</span>
              </div>
            </div>
          </div>

          {/* Attached Image (if present) */}
          {selectedReport.imagePreview && (
            <div className="rounded-2xl overflow-hidden border border-slate-200 max-h-72 bg-slate-100 flex items-center justify-center">
              <img
                src={selectedReport.imagePreview}
                alt={selectedReport.title}
                className="max-h-72 w-full object-cover"
              />
            </div>
          )}

          {/* Description */}
          <div className="bg-slate-50 rounded-2xl p-4.5 border border-slate-200/60">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Citizen Description
            </h4>
            <p className="text-sm text-slate-800 leading-relaxed whitespace-pre-line">
              {selectedReport.description}
            </p>
          </div>

          {/* Classification Rationale Card */}
          <div className="bg-teal-50/60 rounded-2xl p-4.5 border border-teal-200/60">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-bold text-teal-900 uppercase tracking-wider flex items-center">
                <ShieldAlert className="w-3.5 h-3.5 mr-1.5 text-teal-700" />
                Transparent Priority Assessment ({selectedReport.priorityScore}/100 - {selectedReport.priorityLabel})
              </h4>
              <span className="text-[10px] text-teal-700 font-semibold bg-teal-100 px-2 py-0.5 rounded">
                Rule-Based
              </span>
            </div>
            <ul className="space-y-1.5 text-xs text-teal-950 mt-2">
              {selectedReport.classificationReasons?.map((reason, i) => (
                <li key={i} className="flex items-start">
                  <CheckCircle2 className="w-3.5 h-3.5 mr-2 text-teal-600 shrink-0 mt-0.5" />
                  <span>{reason}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Visual Resolution Timeline */}
          <div>
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
              Lifecycle Progress
            </h4>
            {/* Visual Step Indicator */}
            <div className="grid grid-cols-4 gap-2 mb-6">
              {STATUS_STEPS.map((step, idx) => {
                const isPassed = currentStepIdx >= idx;
                const isCurrent = currentStepIdx === idx;
                return (
                  <div
                    key={step}
                    className={`p-3 rounded-xl border text-center transition-all ${
                      isCurrent
                        ? 'bg-teal-600 text-white border-teal-600 shadow-sm'
                        : isPassed
                        ? 'bg-teal-50 text-teal-800 border-teal-200 font-medium'
                        : 'bg-slate-50 text-slate-400 border-slate-200'
                    }`}
                  >
                    <div className="text-[11px] font-bold">Step {idx + 1}</div>
                    <div className="text-xs font-semibold mt-0.5">{step}</div>
                  </div>
                );
              })}
            </div>

            {/* Audit Log / History list */}
            <div className="relative pl-6 space-y-4 border-l-2 border-slate-200 ml-2">
              {selectedReport.statusHistory?.map((hist, i) => (
                <div key={i} className="relative group">
                  <div className="absolute -left-[31px] top-1 w-3.5 h-3.5 rounded-full bg-teal-500 ring-4 ring-white"></div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold text-slate-900">{hist.status}</span>
                      <span className="text-[11px] text-slate-400">
                        {formatDate(hist.timestamp)}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                      {hist.note}
                    </p>
                    <span className="text-[10px] text-slate-400 font-medium">
                      By: {hist.updatedBy}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Admin Action Bar */}
          <div className="pt-4 border-t border-slate-200">
            {isAdminMode ? (
              <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-4.5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-900 flex items-center">
                    <Shield className="w-4 h-4 mr-1.5 text-amber-600" />
                    Demo Admin: Update Lifecycle Status
                  </span>
                  <span className="text-[10px] bg-amber-200/80 text-amber-800 px-2 py-0.5 rounded font-semibold">
                    Authorized Demo Mode
                  </span>
                </div>

                <input
                  type="text"
                  placeholder="Optional operator notes (e.g. Dispatched truck #4, parts ordered)..."
                  value={adminNote}
                  onChange={(e) => setAdminNote(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-xl bg-white border border-amber-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />

                <div className="flex flex-wrap gap-2 pt-1">
                  {STATUS_STEPS.map((s) => (
                    <button
                      key={s}
                      disabled={isUpdating || selectedReport.status === s}
                      onClick={() => handleUpdate(s)}
                      className={`text-xs font-bold px-3 py-1.5 rounded-xl border transition-all ${
                        selectedReport.status === s
                          ? 'bg-slate-200 text-slate-400 border-slate-200 cursor-not-allowed'
                          : s === 'Resolved'
                          ? 'bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-600 shadow-xs'
                          : 'bg-white hover:bg-amber-100 text-slate-800 border-amber-300'
                      }`}
                    >
                      Set to {s}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs text-slate-600">
                <span>Want to update this report's status?</span>
                <span className="font-semibold text-teal-700">
                  Toggle "Admin Mode" in top navbar
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
