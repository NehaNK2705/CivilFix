import { reportsStore } from '../services/reportsStore.js';

export function getReports(req, res, next) {
  try {
    const { search, category, status, priority, sort, page, limit } = req.query;
    const result = reportsStore.getAll({
      search,
      category,
      status,
      priority,
      sort,
      page,
      limit
    });

    res.json({
      success: true,
      data: result.reports,
      pagination: {
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages
      }
    });
  } catch (err) {
    next(err);
  }
}

export function getReportById(req, res, next) {
  try {
    const { id } = req.params;
    const report = reportsStore.getById(id);

    if (!report) {
      return res.status(404).json({
        success: false,
        error: `Report with ID "${id}" was not found.`
      });
    }

    res.json({
      success: true,
      data: report
    });
  } catch (err) {
    next(err);
  }
}

export function createReport(req, res, next) {
  try {
    const { title, description, category, location, reporterName, imagePreview, coordinates } = req.body;

    if (!title || typeof title !== 'string' || title.trim().length < 4) {
      return res.status(400).json({
        success: false,
        error: 'Title must be at least 4 characters long.'
      });
    }

    if (!description || typeof description !== 'string' || description.trim().length < 10) {
      return res.status(400).json({
        success: false,
        error: 'Description must be at least 10 characters long to allow accurate priority assessment.'
      });
    }

    if (!location || typeof location !== 'string' || location.trim().length < 3) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a valid location or landmark.'
      });
    }

    // Safety check on image preview string (base64 or URL)
    let sanitizedImage = null;
    if (imagePreview && typeof imagePreview === 'string') {
      // Prevent massive payloads (> 2MB)
      if (imagePreview.length > 2 * 1024 * 1024) {
        return res.status(413).json({
          success: false,
          error: 'Image preview payload is too large. Please upload an image under 1.5MB.'
        });
      }
      sanitizedImage = imagePreview;
    }

    const created = reportsStore.create({
      title,
      description,
      category,
      location,
      reporterName,
      imagePreview: sanitizedImage,
      coordinates
    });

    res.status(201).json({
      success: true,
      message: 'Civic issue report created and classified successfully.',
      data: created
    });
  } catch (err) {
    next(err);
  }
}

export function updateReportStatus(req, res, next) {
  try {
    const { id } = req.params;
    const { status, note, updatedBy } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        error: 'Status is required (Submitted, Acknowledged, In Progress, or Resolved).'
      });
    }

    const updated = reportsStore.updateStatus(id, status, note, updatedBy);

    if (!updated) {
      return res.status(404).json({
        success: false,
        error: `Report with ID "${id}" was not found.`
      });
    }

    res.json({
      success: true,
      message: `Status updated to "${status}".`,
      data: updated
    });
  } catch (err) {
    next(err);
  }
}

export function exportReportsCsv(req, res, next) {
  try {
    const { search, category, status, priority, sort } = req.query;
    const csvContent = reportsStore.exportCsv({ search, category, status, priority, sort });

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="civicfix-reports-${Date.now()}.csv"`);
    res.status(200).send(csvContent);
  } catch (err) {
    next(err);
  }
}

export function resetDemoReports(req, res, next) {
  try {
    const restored = reportsStore.reset();
    res.json({
      success: true,
      message: 'Demo reports restored to initial dataset of 14 cases.',
      count: restored.length
    });
  } catch (err) {
    next(err);
  }
}
