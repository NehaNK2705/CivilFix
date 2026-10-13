export const CATEGORY_LABELS = {
  pothole: 'Pothole',
  garbage: 'Garbage Overflow',
  water_leakage: 'Water Leakage',
  damaged_streetlight: 'Damaged Streetlight',
  drainage: 'Drainage / Sewage',
  road_damage: 'Road / Sidewalk Damage',
  other: 'Other Civic Issue'
};

export const STATUS_COLORS = {
  Submitted: 'bg-amber-50 text-amber-700 border-amber-200',
  Acknowledged: 'bg-blue-50 text-blue-700 border-blue-200',
  'In Progress': 'bg-indigo-50 text-indigo-700 border-indigo-200',
  Resolved: 'bg-emerald-50 text-emerald-700 border-emerald-200'
};

export const PRIORITY_COLORS = {
  Critical: 'bg-rose-100 text-rose-800 border-rose-300 ring-rose-500',
  High: 'bg-orange-100 text-orange-800 border-orange-300 ring-orange-500',
  Medium: 'bg-amber-100 text-amber-800 border-amber-300 ring-amber-500',
  Low: 'bg-emerald-100 text-emerald-800 border-emerald-300 ring-emerald-500'
};

export function formatDate(isoString) {
  if (!isoString) return 'Just now';
  try {
    const d = new Date(isoString);
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return isoString;
  }
}

export function formatRelativeTime(isoString) {
  if (!isoString) return 'Just now';
  try {
    const diff = Math.floor((Date.now() - new Date(isoString).getTime()) / 1000);
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  } catch {
    return 'Recently';
  }
}
