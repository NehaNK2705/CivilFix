import { reportsStore } from '../services/reportsStore.js';

export function getStats(req, res, next) {
  try {
    const stats = reportsStore.getStats();
    res.json({
      success: true,
      data: stats
    });
  } catch (err) {
    next(err);
  }
}
