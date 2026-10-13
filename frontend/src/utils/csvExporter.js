/**
 * Client-Side CSV Exporter
 * Generates and triggers download of filtered reports array
 */

export function exportReportsToCsv(reports = [], filename = 'civicfix-reports.csv') {
  if (!reports || reports.length === 0) {
    alert('No reports found to export.');
    return;
  }

  const headers = [
    'Report ID',
    'Title',
    'Category',
    'Status',
    'Priority Label',
    'Priority Score',
    'Location',
    'Reporter Name',
    'Created At',
    'Updated At',
    'Assessment Reasons'
  ];

  const escapeVal = (val) => {
    if (val === null || val === undefined) return '""';
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  };

  const rows = reports.map(r => [
    escapeVal(r.id),
    escapeVal(r.title),
    escapeVal(r.category),
    escapeVal(r.status),
    escapeVal(r.priorityLabel),
    escapeVal(r.priorityScore),
    escapeVal(r.location),
    escapeVal(r.reporterName),
    escapeVal(r.createdAt),
    escapeVal(r.updatedAt),
    escapeVal(Array.isArray(r.classificationReasons) ? r.classificationReasons.join('; ') : '')
  ]);

  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
