import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  fetchReports,
  fetchStats,
  fetchHealth,
  apiCreateReport,
  apiUpdateStatus,
  apiResetDemo
} from '../api/apiClient';
import { classifyLocal } from '../utils/classifier';

const ReportsContext = createContext(null);

const LOCAL_STORAGE_REPORTS_KEY = 'civicfix_reports_cache_v1';
const LOCAL_STORAGE_ADMIN_KEY = 'civicfix_admin_mode';

export function ReportsProvider({ children }) {
  const [reports, setReports] = useState([]);
  const [stats, setStats] = useState(null);
  const [serverStatus, setServerStatus] = useState('checking'); // 'connected' | 'offline'
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState(null);
  const [isAdminMode, setIsAdminMode] = useState(() => {
    return localStorage.getItem(LOCAL_STORAGE_ADMIN_KEY) === 'true';
  });
  const [toasts, setToasts] = useState([]);

  // Filter state
  const [filters, setFilters] = useState({
    search: '',
    category: 'all',
    status: 'all',
    priority: 'all',
    sort: 'newest'
  });

  // Toast dispatch
  const addToast = useCallback((message, type = 'info', title = '') => {
    const id = Date.now() + Math.random().toString(36).substring(2, 6);
    setToasts((prev) => [...prev, { id, message, type, title }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Toggle admin mode
  const toggleAdminMode = useCallback(() => {
    setIsAdminMode((prev) => {
      const next = !prev;
      localStorage.setItem(LOCAL_STORAGE_ADMIN_KEY, String(next));
      addToast(
        next ? 'Demo Administrator privileges activated.' : 'Switched to Public Citizen view.',
        next ? 'warning' : 'info',
        next ? 'Admin Mode Enabled' : 'Citizen Mode'
      );
      return next;
    });
  }, [addToast]);

  // Load from server with localStorage fallback
  const loadData = useCallback(async () => {
    try {
      const health = await fetchHealth();
      if (health && health.status === 'healthy') {
        setServerStatus('connected');
        const [repRes, statsRes] = await Promise.all([
          fetchReports({ limit: 100 }),
          fetchStats()
        ]);
        if (repRes.data) {
          setReports(repRes.data);
          localStorage.setItem(LOCAL_STORAGE_REPORTS_KEY, JSON.stringify(repRes.data));
        }
        if (statsRes.data) {
          setStats(statsRes.data);
        }
      } else {
        throw new Error('API server unreachable');
      }
    } catch {
      setServerStatus('offline');
      // Hydrate from localStorage
      const cached = localStorage.getItem(LOCAL_STORAGE_REPORTS_KEY);
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          setReports(parsed);
          computeLocalStats(parsed);
        } catch {
          // ignore parsing error
        }
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // Compute local stats if offline
  const computeLocalStats = (data) => {
    const total = data.length;
    let openCount = 0;
    let ackCount = 0;
    let inProgCount = 0;
    let resCount = 0;
    let critCount = 0;
    let highCount = 0;

    const catCounts = {
      pothole: 0,
      garbage: 0,
      water_leakage: 0,
      damaged_streetlight: 0,
      drainage: 0,
      road_damage: 0,
      other: 0
    };

    const prioCounts = { Critical: 0, High: 0, Medium: 0, Low: 0 };

    data.forEach((r) => {
      const st = (r.status || '').toLowerCase();
      if (st === 'submitted') openCount++;
      else if (st === 'acknowledged') ackCount++;
      else if (st === 'in progress') inProgCount++;
      else if (st === 'resolved') resCount++;

      if (r.priorityLabel === 'Critical') critCount++;
      if (r.priorityLabel === 'High') highCount++;
      if (prioCounts[r.priorityLabel] !== undefined) prioCounts[r.priorityLabel]++;

      const c = r.category || 'other';
      if (catCounts[c] !== undefined) catCounts[c]++;
      else catCounts.other++;
    });

    setStats({
      totalReports: total,
      openReports: openCount,
      acknowledgedReports: ackCount,
      inProgressReports: inProgCount,
      resolvedReports: resCount,
      highAndCriticalReports: critCount + highCount,
      criticalReports: critCount,
      resolutionRate: total > 0 ? Math.round((resCount / total) * 100) : 0,
      categoryDistribution: catCounts,
      priorityDistribution: prioCounts
    });
  };

  useEffect(() => {
    loadData();
    // Poll server health every 15 seconds to auto-reconnect
    const interval = setInterval(loadData, 15000);
    return () => clearInterval(interval);
  }, [loadData]);

  // Submit a new report
  const submitReport = async (formData) => {
    try {
      if (serverStatus === 'connected') {
        const res = await apiCreateReport(formData);
        if (res.data) {
          const updated = [res.data, ...reports];
          setReports(updated);
          localStorage.setItem(LOCAL_STORAGE_REPORTS_KEY, JSON.stringify(updated));
          await loadData(); // refresh stats
          addToast(`Issue "${res.data.id}" recorded with ${res.data.priorityLabel} priority (${res.data.priorityScore}/100).`, 'success', 'Report Submitted');
          return res.data;
        }
      } else {
        // Offline / client-side creation
        const classification = classifyLocal(formData);
        const newReport = {
          id: `CF-2026-${Math.floor(1000 + Math.random() * 9000)}`,
          title: formData.title,
          description: formData.description,
          category: formData.category,
          location: formData.location,
          coordinates: { lat: 37.7749, lng: -122.4194 },
          reporterName: formData.reporterName || 'Anonymous Resident',
          priorityScore: classification.priorityScore,
          priorityLabel: classification.priorityLabel,
          classificationReasons: classification.classificationReasons,
          status: 'Submitted',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          statusHistory: [
            {
              status: 'Submitted',
              timestamp: new Date().toISOString(),
              note: 'Report created locally in client storage.',
              updatedBy: `${formData.reporterName || 'Citizen'} (Local)`
            }
          ],
          imagePreview: formData.imagePreview || null
        };
        const updated = [newReport, ...reports];
        setReports(updated);
        localStorage.setItem(LOCAL_STORAGE_REPORTS_KEY, JSON.stringify(updated));
        computeLocalStats(updated);
        addToast(`Issue "${newReport.id}" saved to client storage with ${newReport.priorityLabel} priority.`, 'success', 'Report Saved Locally');
        return newReport;
      }
    } catch (err) {
      addToast(err.message || 'Submission failed. Please check form fields.', 'error', 'Error');
      throw err;
    }
  };

  // Update status (Admin action)
  const updateReportStatus = async (id, newStatus, note = '') => {
    try {
      if (serverStatus === 'connected') {
        const res = await apiUpdateStatus(id, {
          status: newStatus,
          note,
          updatedBy: 'Demo Admin'
        });
        if (res.data) {
          const updated = reports.map((r) => (r.id === id ? res.data : r));
          setReports(updated);
          localStorage.setItem(LOCAL_STORAGE_REPORTS_KEY, JSON.stringify(updated));
          if (selectedReport && selectedReport.id === id) {
            setSelectedReport(res.data);
          }
          await loadData();
          addToast(`Report ${id} updated to "${newStatus}".`, 'success', 'Status Updated');
          return res.data;
        }
      } else {
        // Offline fallback
        const nowIso = new Date().toISOString();
        const updated = reports.map((r) => {
          if (r.id === id) {
            const nextHistory = [
              ...(r.statusHistory || []),
              {
                status: newStatus,
                timestamp: nowIso,
                note: note || `Status changed to ${newStatus}`,
                updatedBy: 'Demo Admin (Offline)'
              }
            ];
            return { ...r, status: newStatus, updatedAt: nowIso, statusHistory: nextHistory };
          }
          return r;
        });
        setReports(updated);
        localStorage.setItem(LOCAL_STORAGE_REPORTS_KEY, JSON.stringify(updated));
        computeLocalStats(updated);
        const updatedOne = updated.find((r) => r.id === id);
        if (selectedReport && selectedReport.id === id) {
          setSelectedReport(updatedOne);
        }
        addToast(`Report ${id} updated locally to "${newStatus}".`, 'success', 'Status Updated');
        return updatedOne;
      }
    } catch (err) {
      addToast(err.message || 'Failed to update status', 'error', 'Update Failed');
      throw err;
    }
  };

  // Reset Demo data
  const resetDemoData = async () => {
    try {
      if (serverStatus === 'connected') {
        await apiResetDemo();
        await loadData();
        addToast('Restored 14 realistic demo reports on server and client.', 'info', 'Demo Data Reset');
      } else {
        localStorage.removeItem(LOCAL_STORAGE_REPORTS_KEY);
        window.location.reload();
      }
    } catch (err) {
      addToast('Reset failed: ' + err.message, 'error', 'Error');
    }
  };

  return (
    <ReportsContext.Provider
      value={{
        reports,
        stats,
        loading,
        serverStatus,
        isAdminMode,
        toggleAdminMode,
        toasts,
        addToast,
        removeToast,
        filters,
        setFilters,
        selectedReport,
        setSelectedReport,
        submitReport,
        updateReportStatus,
        resetDemoData,
        refreshData: loadData
      }}
    >
      {children}
    </ReportsContext.Provider>
  );
}

export function useReports() {
  const ctx = useContext(ReportsContext);
  if (!ctx) throw new Error('useReports must be used within a ReportsProvider');
  return ctx;
}
