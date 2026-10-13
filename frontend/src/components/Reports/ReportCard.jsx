import React from 'react';
import { useReports } from '../../context/ReportsContext';
import { PriorityBadge } from '../Common/PriorityBadge';
import { StatusPill } from '../Common/StatusPill';
import { CATEGORY_LABELS, formatRelativeTime } from '../../utils/formatters';
import { MapPin, User, Calendar, ExternalLink } from 'lucide-react';

export function ReportCard({ report }) {
  const { setSelectedReport } = useReports();

  return (
    <div
      onClick={() => setSelectedReport(report)}
      className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md hover:border-teal-300 transition-all cursor-pointer flex flex-col justify-between group"
    >
      <div>
        {/* Header row */}
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <span className="font-mono text-xs font-bold text-teal-600 bg-teal-50 px-2 py-0.5 rounded-md">
            {report.id}
          </span>
          <StatusPill status={report.status} />
        </div>

        {/* Title */}
        <h4 className="text-base font-bold text-slate-900 line-clamp-2 group-hover:text-teal-700 transition-colors">
          {report.title}
        </h4>

        {/* Description snippet */}
        <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
          {report.description}
        </p>

        {/* Photo thumbnail if available */}
        {report.imagePreview && (
          <div className="mt-3 h-28 rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
            <img
              src={report.imagePreview}
              alt={report.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
        {/* Category & Priority */}
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-semibold text-slate-500 truncate">
            {CATEGORY_LABELS[report.category] || report.category}
          </span>
          <PriorityBadge label={report.priorityLabel} score={report.priorityScore} />
        </div>

        {/* Location & Time */}
        <div className="flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center truncate max-w-[180px]">
            <MapPin className="w-3 h-3 mr-1 text-slate-400 shrink-0" />
            <span className="truncate">{report.location}</span>
          </div>
          <span>{formatRelativeTime(report.createdAt)}</span>
        </div>
      </div>
    </div>
  );
}
