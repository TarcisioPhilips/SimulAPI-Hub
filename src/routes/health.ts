import { Router, Request, Response } from 'express';
import type { HealthResponse } from '../types';

const router = Router();

router.get('/health', (req: Request, res: Response<HealthResponse>) => {
  const healthResponse: HealthResponse = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: process.env.npm_package_version || '1.0.0',
  };

  res.json(healthResponse);
});

export default router;