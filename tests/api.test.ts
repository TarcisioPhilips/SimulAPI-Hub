import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import request from 'supertest';
import express from 'express';
import { StorageService } from '../src/services/storage';
import apiRoutes from '../src/routes/api';

describe('API Endpoints', () => {
  let app: express.Application;
  let storageService: StorageService;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use('/', apiRoutes);
    
    // Use in-memory storage for tests
    storageService = new StorageService(':memory:');
  });

  beforeEach(async () => {
    await storageService.initialize();
  });

  describe('GET /api/:entity', () => {
    it('should return empty array for non-existent entity type', async () => {
      const response = await request(app)
        .get('/api/users')
        .expect(200);

      expect(response.body).toMatchObject({
        data: [],
        message: expect.stringContaining('Retrieved 0 users entities'),
      });
    });
  });

  describe('POST /api/:entity', () => {
    it('should create a new entity', async () => {
      const userData = { name: 'John Doe', email: 'john@example.com' };

      const response = await request(app)
        .post('/api/users')
        .send(userData)
        .expect(201);

      expect(response.body.data).toMatchObject({
        id: expect.any(String),
        name: 'John Doe',
        email: 'john@example.com',
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      });

      expect(response.body.message).toContain('Created users with ID');
    });
  });

  describe('GET /api/:entity/:id', () => {
    it('should return 404 for non-existent entity', async () => {
      const response = await request(app)
        .get('/api/users/non-existent-id')
        .expect(404);

      expect(response.body).toMatchObject({
        error: 'Not found',
        message: expect.stringContaining('users with ID non-existent-id not found'),
      });
    });
  });

  describe('PUT /api/:entity/:id', () => {
    it('should return 404 for non-existent entity', async () => {
      const response = await request(app)
        .put('/api/users/non-existent-id')
        .send({ name: 'Updated Name' })
        .expect(404);

      expect(response.body).toMatchObject({
        error: 'Not found',
        message: expect.stringContaining('users with ID non-existent-id not found'),
      });
    });
  });

  describe('DELETE /api/:entity/:id', () => {
    it('should return 404 for non-existent entity', async () => {
      const response = await request(app)
        .delete('/api/users/non-existent-id')
        .expect(404);

      expect(response.body).toMatchObject({
        error: 'Not found',
        message: expect.stringContaining('users with ID non-existent-id not found'),
      });
    });
  });
});