/**
 * CivicFix AI - In-Memory Reports Store
 * 
 * Note: Data is held in memory during the active server session.
 * A server restart will restore the initial seed state.
 * Client-side localStorage provides additional resilience.
 */

import { INITIAL_REPORTS } from '../data/seedData.js';
import { classifyReport, normalizeCategory } from './classifierService.js';

class ReportsStore {
  constructor() {
    this.reports = JSON.parse(JSON.stringify(INITIAL_REPORTS));
    this.nextCounter = 1015;
  }

  // Reset store to default demo seed data
  reset() {
    this.reports = JSON.parse(JSON.stringify(INITIAL_REPORTS));
    this.nextCounter = 1015;
    return this.reports;
  }

  // Get all reports with filtering, searching, sorting, and pagination
  getAll({ search = '', category = 'all', status = 'all', priority = 'all', sort = 'newest', page = 1, limit = 50 } = {}) {
    let filtered = [...this.reports];

    // Search query: ID, title, description, location, reporterName
    if (search && search.trim() !== '') {
      const q = search.trim().toLowerCase();
      filtered = filtered.filter(r => 
        r.id.toLowerCase().includes(q) ||
        r.title.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q) ||
        r.location.toLowerCase().includes(q) ||
        (r.reporterName && r.reporterName.toLowerCase().includes(q))
      );
    }

    // Category filter
    if (category && category !== 'all') {
      const normCat = normalizeCategory(category);
      filtered = filtered.filter(r => normalizeCategory(r.category) === normCat);
    }

    // Status filter
    if (status && status !== 'all') {
      filtered = filtered.filter(r => r.status.toLowerCase() === status.toLowerCase());
    }

    // Priority filter
    if (priority && priority !== 'all') {
      filtered = filtered.filter(r => r.priorityLabel.toLowerCase() === priority.toLowerCase());
    }

    // Sorting
    filtered.sort((a, b) => {
      if (sort === 'highest_priority' || sort === 'priority') {
        return b.priorityScore - a.priorityScore;
      }
      if (sort === 'lowest_priority') {
        return a.priorityScore - b.priorityScore;
      }
      if (sort === 'oldest') {
        return new Date(a.createdAt) - new Date(b.createdAt);
      }
      // default: newest
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

    const total = filtered.length;
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, parseInt(limit, 10) || 50);
    const startIndex = (pageNum - 1) * limitNum;
    const paginated = filtered.slice(startIndex, startIndex + limitNum);

    return {
      reports: paginated,
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum)
    };
  }

  // Get single report by ID
  getById(id) {
    if (!id) return null;
    return this.reports.find(r => r.id.toLowerCase() === id.trim().toLowerCase()) || null;
  }

  // Create new report
  create({ title, description, category, location, reporterName = 'Anonymous Resident', imagePreview = null, coordinates = null }) {
    if (!title || !description || !location) {
      throw new Error('Title, description, and location are required fields.');
    }

    const normCat = normalizeCategory(category);
    const classification = classifyReport({ title, description, category: normCat, location });

    const newId = `CF-2026-${this.nextCounter++}`;
    const nowIso = new Date().toISOString();

    // Default nearby coordinates if none provided
    const defaultCoords = coordinates || {
      lat: 37.77 + (Math.random() - 0.5) * 0.04,
      lng: -122.42 + (Math.random() - 0.5) * 0.04
    };

    const newReport = {
      id: newId,
      title: title.trim(),
      description: description.trim(),
      category: normCat,
      location: location.trim(),
      coordinates: defaultCoords,
      reporterName: reporterName.trim() || 'Anonymous Resident',
      priorityScore: classification.priorityScore,
      priorityLabel: classification.priorityLabel,
      classificationReasons: classification.classificationReasons,
      status: 'Submitted',
      createdAt: nowIso,
      updatedAt: nowIso,
      statusHistory: [
        {
          status: 'Submitted',
          timestamp: nowIso,
          note: 'Civic issue recorded and evaluated by smart heuristic classifier.',
          updatedBy: `${reporterName.trim() || 'Citizen'} (Portal)`
        }
      ],
      imagePreview: imagePreview || null
    };

    // Prepend to array so new reports appear at the top immediately
    this.reports.unshift(newReport);
    return newReport;
  }

  // Update report status
  updateStatus(id, newStatus, note = '', updatedBy = 'Demo Administrator') {
    const report = this.getById(id);
    if (!report) return null;

    const validStatuses = ['Submitted', 'Acknowledged', 'In Progress', 'Resolved'];
    const matchedStatus = validStatuses.find(s => s.toLowerCase() === newStatus.toLowerCase());

    if (!matchedStatus) {
      throw new Error(`Invalid status "${newStatus}". Must be one of: ${validStatuses.join(', ')}`);
    }

    const nowIso = new Date().toISOString();
    report.status = matchedStatus;
    report.updatedAt = nowIso;

    if (!report.statusHistory) {
      report.statusHistory = [];
    }

    report.statusHistory.push({
      status: matchedStatus,
      timestamp: nowIso,
      note: note.trim() || `Status escalated/updated to ${matchedStatus}.`,
      updatedBy: updatedBy.trim() || 'Civic Operator'
    });

    return report;
  }

  // Generate aggregate stats for dashboard
  getStats() {
    const total = this.reports.length;
    let openCount = 0;
    let acknowledgedCount = 0;
    let inProgressCount = 0;
    let resolvedCount = 0;
    let criticalCount = 0;
    let highCount = 0;

    const categoryCounts = {
      pothole: 0,
      garbage: 0,
      water_leakage: 0,
      damaged_streetlight: 0,
      drainage: 0,
      road_damage: 0,
      other: 0
    };

    const priorityCounts = {
      Critical: 0,
      High: 0,
      Medium: 0,
      Low: 0
    };

    // 7-day trend breakdown (last 7 days)
    const dayBuckets = {};
    const now = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(now.getDate() - i);
      const key = d.toISOString().split('T')[0];
      dayBuckets[key] = { date: key, count: 0, resolved: 0 };
    }

    for (const r of this.reports) {
      // Status breakdown
      const st = r.status.toLowerCase();
      if (st === 'submitted') openCount++;
      else if (st === 'acknowledged') acknowledgedCount++;
      else if (st === 'in progress') inProgressCount++;
      else if (st === 'resolved') resolvedCount++;

      // Priority breakdown
      if (r.priorityLabel === 'Critical') criticalCount++;
      if (r.priorityLabel === 'High') highCount++;
      if (priorityCounts[r.priorityLabel] !== undefined) {
        priorityCounts[r.priorityLabel]++;
      }

      // Category breakdown
      const cat = normalizeCategory(r.category);
      if (categoryCounts[cat] !== undefined) {
        categoryCounts[cat]++;
      } else {
        categoryCounts.other++;
      }

      // Trend mapping
      if (r.createdAt) {
        const dateKey = r.createdAt.split('T')[0];
        if (dayBuckets[dateKey]) {
          dayBuckets[dateKey].count++;
          if (r.status === 'Resolved') {
            dayBuckets[dateKey].resolved++;
          }
        }
      }
    }

    const weeklyTrend = Object.values(dayBuckets);

    // Calculate resolution rate
    const resolutionRate = total > 0 ? Math.round((resolvedCount / total) * 100) : 0;

    return {
      totalReports: total,
      openReports: openCount,
      acknowledgedReports: acknowledgedCount,
      inProgressReports: inProgressCount,
      resolvedReports: resolvedCount,
      highAndCriticalReports: criticalCount + highCount,
      criticalReports: criticalCount,
      resolutionRate,
      categoryDistribution: categoryCounts,
      priorityDistribution: priorityCounts,
      weeklyTrend,
      lastUpdated: new Date().toISOString()
    };
  }

  // Generate CSV data string
  exportCsv(filters = {}) {
    const { reports } = this.getAll({ ...filters, limit: 10000 });
    
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
      'Key Assessment Reasons'
    ];

    const escapeCsv = (val) => {
      if (val === null || val === undefined) return '""';
      const str = String(val).replace(/"/g, '""');
      return `"${str}"`;
    };

    const rows = reports.map(r => [
      escapeCsv(r.id),
      escapeCsv(r.title),
      escapeCsv(r.category),
      escapeCsv(r.status),
      escapeCsv(r.priorityLabel),
      escapeCsv(r.priorityScore),
      escapeCsv(r.location),
      escapeCsv(r.reporterName),
      escapeCsv(r.createdAt),
      escapeCsv(r.updatedAt),
      escapeCsv((r.classificationReasons || []).join('; '))
    ]);

    return [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
  }
}

export const reportsStore = new ReportsStore();
