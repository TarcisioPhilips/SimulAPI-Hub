import { Router, Request, Response } from 'express';
import { storageService } from '../services/storage';
import type { ApiResponse, Entity } from '../types';

const router = Router();

// GET /api/:entity - List all entities
router.get('/api/:entity', async (req: Request, res: Response<ApiResponse<Entity[]>>) => {
  try {
    const { entity } = req.params;
    const entities = await storageService.getAllEntities(entity);
    
    res.json({
      data: entities,
      message: `Retrieved ${entities.length} ${entity} entities`,
    });
  } catch (error) {
    res.status(500).json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// GET /api/:entity/:id - Get single entity
router.get('/api/:entity/:id', async (req: Request, res: Response<ApiResponse<Entity>>) => {
  try {
    const { entity, id } = req.params;
    const entityData = await storageService.getEntityById(entity, id);
    
    if (!entityData) {
      return res.status(404).json({
        error: 'Not found',
        message: `${entity} with ID ${id} not found`,
      });
    }

    res.json({
      data: entityData,
      message: `Retrieved ${entity} with ID ${id}`,
    });
  } catch (error) {
    res.status(500).json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// POST /api/:entity - Create new entity
router.post('/api/:entity', async (req: Request, res: Response<ApiResponse<Entity>>) => {
  try {
    const { entity } = req.params;
    const entityData = await storageService.createEntity(entity, req.body);
    
    res.status(201).json({
      data: entityData,
      message: `Created ${entity} with ID ${entityData.id}`,
    });
  } catch (error) {
    res.status(500).json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// PUT /api/:entity/:id - Update entity
router.put('/api/:entity/:id', async (req: Request, res: Response<ApiResponse<Entity>>) => {
  try {
    const { entity, id } = req.params;
    const entityData = await storageService.updateEntity(entity, id, req.body);
    
    if (!entityData) {
      return res.status(404).json({
        error: 'Not found',
        message: `${entity} with ID ${id} not found`,
      });
    }

    res.json({
      data: entityData,
      message: `Updated ${entity} with ID ${id}`,
    });
  } catch (error) {
    res.status(500).json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// DELETE /api/:entity/:id - Delete entity
router.delete('/api/:entity/:id', async (req: Request, res: Response<ApiResponse>) => {
  try {
    const { entity, id } = req.params;
    const deleted = await storageService.deleteEntity(entity, id);
    
    if (!deleted) {
      return res.status(404).json({
        error: 'Not found',
        message: `${entity} with ID ${id} not found`,
      });
    }

    res.json({
      message: `Deleted ${entity} with ID ${id}`,
    });
  } catch (error) {
    res.status(500).json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

export default router;