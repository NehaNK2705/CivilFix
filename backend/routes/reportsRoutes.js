import { Router } from 'express';
import {
  getReports,
  getReportById,
  createReport,
  updateReportStatus,
  exportReportsCsv,
  resetDemoReports
} from '../controllers/reportsController.js';

const router = Router();

// Order matters: static subpaths before /:id
router.get('/export', exportReportsCsv);
router.post('/reset', resetDemoReports);

router.get('/', getReports);
router.post('/', createReport);
router.get('/:id', getReportById);
router.patch('/:id/status', updateReportStatus);

export default router;
