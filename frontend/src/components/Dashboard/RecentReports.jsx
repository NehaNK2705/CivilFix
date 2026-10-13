import React from 'react';
import { useReports } from '../../context/ReportsContext';
import { StatusPill } from '../Common/StatusPill';
import { PriorityBadge } from '../Common/PriorityBadge';
import { CATEGORY_LABELS, formatRelativeTime } from '../../utils/formatters';
import { ArrowRight, MapPin, Sparkles } from 'lucide-react';

export function RecentReports({ setActiveTab }) {
  const { reports, setSelectedReport } = useReports();
  const recent = reports.slice(0, 5);

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900 flex items-center">
            <Sparkles className="w-4 h-4 mr-1.5 text-teal-600" />
            Recent Reports & Urgent Triage
          </h3>
          <p className="text-xs text-slate-500">Latest issues submitted across all sectors</p>
        </div>
        <button
          onClick={() => setActiveTab('explorer')}
          className="text-xs font-semibold text-teal-600 hover:text-teal-700 flex items-center group transition-colors"
        >
          <span>View all reports</span>
          <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      <div className="overflow-x-auto -mx-5 px-5">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              <th className="pb-3 font-semibold">Report ID</th>
              <th className="pb-3 font-semibold">Issue Title & Location</th>
              <th className="pb-3 font-semibold">Category</th>
              <th className="pb-3 font-semibold">Smart Priority</th>
              <th className="pb-3 font-semibold">Status</th>
              <th className="pb-3 font-semibold text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {recent.map((report) => (
              <tr
                key={report.id}
                onClick={() => setSelectedReport(report)}
                className="hover:bg-slate-50/80 cursor-pointer transition-colors group"
              >
                <td className="py-3 font-mono text-xs font-bold text-teal-600">
                  {report.id}
                </td>
                <td className="py-3 max-w-xs">
                  <div className="font-medium text-slate-900 truncate">{report.title}</div>
                  <div className="text-[11px] text-slate-400 flex items-center mt-0.5 truncate">
                    <MapPin className="w-3 h-3 mr-1 text-slate-400 shrink-0" />
                    <span className="truncate">{report.location}</span>
                    <span className="mx-1.5">•</span>
                    <span>{formatRelativeTime(report.createdAt)}</span>
                  </div>
                </td>
                <td className="py-3 text-xs text-slate-600">
                  {CATEGORY_LABELS[report.category] || report.category}
                </td>
                <td className="py-3">
                  <PriorityBadge label={report.priorityLabel} score={report.priorityScore} />
                </td>
                <td className="py-3">
                  <StatusPill status={report.status} />
                </td>
                <td className="py-3 text-right">
                  <span className="text-xs font-semibold text-teal-600 group-hover:underline">
                    Details →
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
