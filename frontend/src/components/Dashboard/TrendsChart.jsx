import React from 'react';
import { useReports } from '../../context/ReportsContext';
import { TrendingUp, Calendar } from 'lucide-react';

export function TrendsChart() {
  const { stats } = useReports();
  const trend = stats?.weeklyTrend || [];

  const maxVal = Math.max(1, ...trend.map((d) => d.count));

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900 flex items-center">
            <TrendingUp className="w-4 h-4 mr-1.5 text-teal-600" />
            Weekly Intake vs Resolutions
          </h3>
          <p className="text-xs text-slate-500">Volume distribution over the past 7 days</p>
        </div>
        <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg flex items-center">
          <Calendar className="w-3 h-3 mr-1 text-slate-400" />
          Last 7 Days
        </span>
      </div>

      {trend.length === 0 ? (
        <div className="h-44 flex items-center justify-center text-xs text-slate-400">
          No trend data recorded yet
        </div>
      ) : (
        <div className="h-44 flex items-end justify-between gap-2 pt-6 pb-2 px-1">
          {trend.map((day, idx) => {
            const heightPercent = Math.min(100, Math.round((day.count / maxVal) * 100));
            const resolvedPercent = day.count > 0 ? Math.min(100, Math.round((day.resolved / day.count) * 100)) : 0;
            const dateObj = new Date(day.date);
            const dayLabel = dateObj.toLocaleDateString('en-US', { weekday: 'short' });

            return (
              <div key={idx} className="flex-1 flex flex-col items-center group relative">
                {/* Tooltip */}
                <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[10px] rounded-lg px-2 py-1 pointer-events-none whitespace-nowrap shadow-md z-10">
                  {day.count} Reported • {day.resolved} Resolved
                </div>

                {/* Bar */}
                <div className="w-full max-w-[28px] h-32 bg-slate-100 rounded-t-lg overflow-hidden flex flex-col justify-end">
                  <div
                    style={{ height: `${heightPercent}%` }}
                    className="w-full bg-teal-500 hover:bg-teal-600 transition-all rounded-t-md relative flex flex-col justify-end"
                  >
                    {resolvedPercent > 0 && (
                      <div
                        style={{ height: `${resolvedPercent}%` }}
                        className="w-full bg-emerald-400/90"
                        title={`${day.resolved} resolved`}
                      ></div>
                    )}
                  </div>
                </div>

                {/* Day label */}
                <span className="text-[10px] font-semibold text-slate-500 mt-2 truncate">
                  {dayLabel}
                </span>
                <span className="text-[9px] font-bold text-slate-400">
                  {day.count}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {/* Legend */}
      <div className="flex items-center justify-center space-x-5 pt-3 border-t border-slate-100 text-[11px] text-slate-600 font-medium">
        <div className="flex items-center">
          <span className="w-2.5 h-2.5 rounded-sm bg-teal-500 mr-1.5"></span>
          <span>Logged Issues</span>
        </div>
        <div className="flex items-center">
          <span className="w-2.5 h-2.5 rounded-sm bg-emerald-400 mr-1.5"></span>
          <span>Resolved</span>
        </div>
      </div>
    </div>
  );
}
