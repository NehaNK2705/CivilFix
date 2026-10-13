import React, { useState } from 'react';
import { useReports } from '../../context/ReportsContext';
import { StatusPill } from '../Common/StatusPill';
import { PriorityBadge } from '../Common/PriorityBadge';
import { CATEGORY_LABELS, formatDate } from '../../utils/formatters';
import { MapPin, ChevronLeft, ChevronRight, Eye } from 'lucide-react';

export function ReportTable({ reports = [] }) {
  const { setSelectedReport } = useReports();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const totalPages = Math.ceil(reports.length / itemsPerPage) || 1;
  const currentReports = reports.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  if (reports.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
        <p className="text-slate-500 text-sm">No reports match your selected filters.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden flex flex-col justify-between">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="bg-slate-50/70 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <th className="py-3.5 px-4 font-semibold">Report ID</th>
              <th className="py-3.5 px-4 font-semibold">Issue Details & Landmark</th>
              <th className="py-3.5 px-4 font-semibold">Category</th>
              <th className="py-3.5 px-4 font-semibold">Priority Score</th>
              <th className="py-3.5 px-4 font-semibold">Status</th>
              <th className="py-3.5 px-4 font-semibold">Reported At</th>
              <th className="py-3.5 px-4 font-semibold text-right">View</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {currentReports.map((report) => (
              <tr
                key={report.id}
                onClick={() => setSelectedReport(report)}
                className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
              >
                <td className="py-3.5 px-4 font-mono text-xs font-bold text-teal-600 whitespace-nowrap">
                  {report.id}
                </td>
                <td className="py-3.5 px-4 max-w-sm">
                  <div className="font-semibold text-slate-900 group-hover:text-teal-700 transition-colors truncate">
                    {report.title}
                  </div>
                  <div className="text-xs text-slate-500 flex items-center mt-0.5 truncate">
                    <MapPin className="w-3.5 h-3.5 mr-1 text-slate-400 shrink-0" />
                    <span className="truncate">{report.location}</span>
                  </div>
                </td>
                <td className="py-3.5 px-4 text-xs font-medium text-slate-600 whitespace-nowrap">
                  {CATEGORY_LABELS[report.category] || report.category}
                </td>
                <td className="py-3.5 px-4 whitespace-nowrap">
                  <PriorityBadge label={report.priorityLabel} score={report.priorityScore} />
                </td>
                <td className="py-3.5 px-4 whitespace-nowrap">
                  <StatusPill status={report.status} />
                </td>
                <td className="py-3.5 px-4 text-xs text-slate-500 whitespace-nowrap">
                  {formatDate(report.createdAt)}
                </td>
                <td className="py-3.5 px-4 text-right whitespace-nowrap">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedReport(report);
                    }}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-teal-600 hover:bg-teal-50 transition-colors"
                    title="View Full Report"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="p-3.5 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
          <span className="text-xs text-slate-500">
            Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
            {Math.min(currentPage * itemsPerPage, reports.length)} of {reports.length} reports
          </span>
          <div className="flex items-center space-x-1.5">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-40 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-semibold px-2 text-slate-700">
              Page {currentPage} of {totalPages}
            </span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-40 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
