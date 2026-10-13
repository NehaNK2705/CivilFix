/**
 * CivicFix API Client with resilient localStorage fallback
 */

const API_BASE = '/api';

export async function fetchHealth() {
  try {
    const res = await fetch(`${API_BASE}/health`, { signal: AbortSignal.timeout(3000) });
    if (!res.ok) throw new Error(`Health check failed with status ${res.status}`);
    return await res.json();
  } catch (err) {
    return { success: false, status: 'offline', error: err.message };
  }
}

export async function fetchReports(params = {}) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, val]) => {
    if (val !== undefined && val !== null && val !== 'all' && val !== '') {
      query.append(key, val);
    }
  });

  const url = `${API_BASE}/reports${query.toString() ? '?' + query.toString() : ''}`;
  const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || `Failed to fetch reports (${res.status})`);
  }
  return await res.json();
}

export async function fetchReportById(id) {
  const res = await fetch(`${API_BASE}/reports/${id}`, { signal: AbortSignal.timeout(4000) });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || `Report ${id} not found`);
  }
  return await res.json();
}

export async function apiCreateReport(reportData) {
  const res = await fetch(`${API_BASE}/reports`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(reportData),
    signal: AbortSignal.timeout(6000)
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || 'Failed to submit report');
  }
  return await res.json();
}

export async function apiUpdateStatus(id, { status, note, updatedBy }) {
  const res = await fetch(`${API_BASE}/reports/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status, note, updatedBy }),
    signal: AbortSignal.timeout(5000)
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || 'Failed to update report status');
  }
  return await res.json();
}

export async function fetchStats() {
  const res = await fetch(`${API_BASE}/stats`, { signal: AbortSignal.timeout(4000) });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || 'Failed to fetch statistics');
  }
  return await res.json();
}

export async function apiResetDemo() {
  const res = await fetch(`${API_BASE}/reports/reset`, {
    method: 'POST',
    signal: AbortSignal.timeout(5000)
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || 'Failed to reset demo data');
  }
  return await res.json();
}
