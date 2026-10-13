import React from 'react';
import { useReports } from '../../context/ReportsContext';
import { CATEGORY_LABELS } from '../../utils/formatters';
import { PieChart } from 'lucide-react';

export function CategoryChart() {
  const { stats } = useReports();
  const distribution = stats?.categoryDistribution || {};
  const total = stats?.totalReports || 1;

  const categories = [
    { key: 'pothole', color: 'bg-amber-500', barColor: 'bg-amber-500' },
    { key: 'damaged_streetlight', color: 'bg-yellow-500', barColor: 'bg-yellow-500' },
    { key: 'water_leakage', color: 'bg-blue-500', barColor: 'bg-blue-500' },
    { key: 'drainage', color: 'bg-indigo-500', barColor: 'bg-indigo-500' },
    { key: 'garbage', color: 'bg-emerald-500', barColor: 'bg-emerald-500' },
    { key: 'road_damage', color: 'bg-orange-500', barColor: 'bg-orange-500' },
    { key: 'other', color: 'bg-slate-400', barColor: 'bg-slate-400' }
  ];

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-sm font-bold text-slate-900 flex items-center">
            <PieChart className="w-4 h-4 mr-1.5 text-teal-600" />
            Category Distribution
          </h3>
          <p className="text-xs text-slate-500">Breakdown of reported civic departments</p>
        </div>
        <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-lg">
          {total} Total Issues
        </span>
      </div>

      <div className="space-y-2.5 py-2">
        {categories.map(({ key, color, barColor }) => {
          const count = distribution[key] || 0;
          const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
          const label = CATEGORY_LABELS[key] || key;

          return (
            <div key={key} className="group">
              <div className="flex items-center justify-between text-xs font-medium text-slate-700 mb-1">
                <div className="flex items-center space-x-2 truncate">
                  <span className={`w-2 h-2 rounded-full ${color} shrink-0`}></span>
                  <span className="truncate">{label}</span>
                </div>
                <div className="flex items-center space-x-2 shrink-0">
                  <span className="font-bold text-slate-900">{count}</span>
                  <span className="text-[11px] text-slate-400 font-mono">({percentage}%)</span>
                </div>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  style={{ width: `${percentage}%` }}
                  className={`h-full ${barColor} rounded-full transition-all duration-500`}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
