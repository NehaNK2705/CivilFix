import React from 'react';
import { PRIORITY_COLORS } from '../../utils/formatters';
import { AlertTriangle, AlertCircle, Info, ShieldAlert } from 'lucide-react';

export function PriorityBadge({ label, score, showScore = true }) {
  const colorClass = PRIORITY_COLORS[label] || 'bg-slate-100 text-slate-800 border-slate-300';

  const getIcon = () => {
    switch (label) {
      case 'Critical':
        return <ShieldAlert className="w-3.5 h-3.5 mr-1 text-rose-700 animate-pulse" />;
      case 'High':
        return <AlertTriangle className="w-3.5 h-3.5 mr-1 text-orange-700" />;
      case 'Medium':
        return <AlertCircle className="w-3.5 h-3.5 mr-1 text-amber-700" />;
      default:
        return <Info className="w-3.5 h-3.5 mr-1 text-emerald-700" />;
    }
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold border ${colorClass}`}>
      {getIcon()}
      <span>{label}</span>
      {showScore && score !== undefined && (
        <span className="ml-1.5 px-1 py-0.2 rounded bg-black/10 text-[10px] font-mono font-bold">
          {score}/100
        </span>
      )}
    </span>
  );
}
