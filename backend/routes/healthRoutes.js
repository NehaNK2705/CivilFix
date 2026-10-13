import { Router } from 'express';

const router = Router();

const startTime = new Date();

router.get('/', (req, res) => {
  res.json({
    success: true,
    status: 'healthy',
    service: 'CivicFix AI REST Backend',
    version: '1.0.0',
    uptimeSeconds: Math.floor((Date.now() - startTime.getTime()) / 1000),
    persistence: 'in-memory (resets upon server restart; localStorage client-side resilience enabled)',
    timestamp: new Date().toISOString()
  });
});

export default router;
