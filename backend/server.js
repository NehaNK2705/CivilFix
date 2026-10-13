import express from 'express';
import cors from 'cors';
import healthRoutes from './routes/healthRoutes.js';
import reportsRoutes from './routes/reportsRoutes.js';
import statsRoutes from './routes/statsRoutes.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true, limit: '5mb' }));

// Request logging in development
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[API] ${req.method} ${req.originalUrl} - ${res.statusCode} (${duration}ms)`);
  });
  next();
});

// API Routes
app.use('/api/health', healthRoutes);
app.use('/api/reports', reportsRoutes);
app.use('/api/stats', statsRoutes);

// Root informational endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'CivicFix AI REST API is running',
    documentation: {
      health: 'GET /api/health',
      reports: 'GET /api/reports',
      createReport: 'POST /api/reports',
      reportDetails: 'GET /api/reports/:id',
      updateStatus: 'PATCH /api/reports/:id/status',
      stats: 'GET /api/stats',
      exportCsv: 'GET /api/reports/export',
      resetDemo: 'POST /api/reports/reset'
    },
    notice: 'In-memory data store for demonstration purposes. Browser localStorage sync enabled.'
  });
});

// 404 & Centralized Error Handler
app.use(notFoundHandler);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(` CivicFix AI Backend running on http://localhost:${PORT}`);
  console.log(` Health check: http://localhost:${PORT}/api/health`);
  console.log(` Reports API: http://localhost:${PORT}/api/reports`);
  console.log(` Stats API:   http://localhost:${PORT}/api/stats`);
  console.log(`====================================================`);
});
