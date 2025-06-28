import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import express from 'express';
import healthRoutes from '../src/routes/health';

describe('Health Endpoint', () => {
  let app: express.Application;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use('/', healthRoutes);
  });

  it('should return health status', async () => {
    const response = await request(app)
      .get('/health')
      .expect(200);

    expect(response.body).toMatchObject({
      status: 'ok',
      timestamp: expect.any(String),
      uptime: expect.any(Number),
      version: expect.any(String),
    });

    expect(new Date(response.body.timestamp)).toBeInstanceOf(Date);
    expect(response.body.uptime).toBeGreaterThanOrEqual(0);
  });
});