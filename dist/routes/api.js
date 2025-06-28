"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const storage_1 = require("../services/storage");
const router = (0, express_1.Router)();
router.get('/api/:entity', async (req, res) => {
    try {
        const { entity } = req.params;
        const entities = await storage_1.storageService.getAllEntities(entity);
        res.json({
            data: entities,
            message: `Retrieved ${entities.length} ${entity} entities`,
        });
    }
    catch (error) {
        res.status(500).json({
            error: 'Internal server error',
            message: error instanceof Error ? error.message : 'Unknown error',
        });
    }
});
router.get('/api/:entity/:id', async (req, res) => {
    try {
        const { entity, id } = req.params;
        const entityData = await storage_1.storageService.getEntityById(entity, id);
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
    }
    catch (error) {
        res.status(500).json({
            error: 'Internal server error',
            message: error instanceof Error ? error.message : 'Unknown error',
        });
    }
});
router.post('/api/:entity', async (req, res) => {
    try {
        const { entity } = req.params;
        const entityData = await storage_1.storageService.createEntity(entity, req.body);
        res.status(201).json({
            data: entityData,
            message: `Created ${entity} with ID ${entityData.id}`,
        });
    }
    catch (error) {
        res.status(500).json({
            error: 'Internal server error',
            message: error instanceof Error ? error.message : 'Unknown error',
        });
    }
});
router.put('/api/:entity/:id', async (req, res) => {
    try {
        const { entity, id } = req.params;
        const entityData = await storage_1.storageService.updateEntity(entity, id, req.body);
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
    }
    catch (error) {
        res.status(500).json({
            error: 'Internal server error',
            message: error instanceof Error ? error.message : 'Unknown error',
        });
    }
});
router.delete('/api/:entity/:id', async (req, res) => {
    try {
        const { entity, id } = req.params;
        const deleted = await storage_1.storageService.deleteEntity(entity, id);
        if (!deleted) {
            return res.status(404).json({
                error: 'Not found',
                message: `${entity} with ID ${id} not found`,
            });
        }
        res.json({
            message: `Deleted ${entity} with ID ${id}`,
        });
    }
    catch (error) {
        res.status(500).json({
            error: 'Internal server error',
            message: error instanceof Error ? error.message : 'Unknown error',
        });
    }
});
exports.default = router;
//# sourceMappingURL=api.js.map