import React from 'react';
import { useReports } from '../../context/ReportsContext';
import {
  FileText,
  Clock,
  Wrench,
  CheckCircle2,
  AlertOctagon,
  TrendingUp
} from 'lucide-react';

export function MetricCards() {
  const { stats, setFilters, setActiveTab } = useReports();

  if (!stats) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 animate-pulse">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-28 bg-slate-200 rounded-2xl"></div>
        ))}
      </div>
    );
  }

  const cards = [
    {
      title: 'Total Reports',
      count: stats.totalReports,
      subtext: 'Across all wards',
      icon: FileText,
      color: 'teal',
      bgLight: 'bg-teal-50',
      textDark: 'text-teal-900',
      border: 'border-teal-100',
      iconBg: 'bg-teal-500 text-white',
      filter: { status: 'all', priority: 'all' }
    },
    {
      title: 'Open / Submitted',
      count: stats.openReports,
      subtext: 'Awaiting triage',
      icon: Clock,
      color: 'amber',
      bgLight: 'bg-amber-50',
      textDark: 'text-amber-900',
      border: 'border-amber-100',
      iconBg: 'bg-amber-500 text-white',
      filter: { status: 'Submitted', priority: 'all' }
    },
    {
      title: 'In Progress',
      count: stats.inProgressReports,
      subtext: 'Crews deployed',
      icon: Wrench,
      color: 'indigo',
      bgLight: 'bg-indigo-50',
      textDark: 'text-indigo-900',
      border: 'border-indigo-100',
      iconBg: 'bg-indigo-500 text-white',
      filter: { status: 'In Progress', priority: 'all' }
    },
    {
      title: 'Resolved',
      count: stats.resolvedReports,
      subtext: `${stats.resolutionRate}% resolution rate`,
      icon: CheckCircle2,
      color: 'emerald',
      bgLight: 'bg-emerald-50',
      textDark: 'text-emerald-900',
      border: 'border-emerald-100',
      iconBg: 'bg-emerald-500 text-white',
      filter: { status: 'Resolved', priority: 'all' }
    },
    {
      title: 'Critical & High Priority',
      count: stats.highAndCriticalReports,
      subtext: `${stats.criticalReports} emergency tier`,
      icon: AlertOctagon,
      color: 'rose',
      bgLight: 'bg-rose-50',
      textDark: 'text-rose-900',
      border: 'border-rose-100',
      iconBg: 'bg-rose-500 text-white',
      filter: { priority: 'Critical', status: 'all' }
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5 sm:gap-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className={`bg-white rounded-2xl p-4 sm:p-5 border ${card.border} shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between group`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 truncate">{card.title}</span>
              <div className={`p-2 rounded-xl ${card.iconBg} shadow-xs`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {card.count}
              </div>
              <div className="text-[11px] text-slate-500 font-medium mt-1 truncate">
                {card.subtext}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
