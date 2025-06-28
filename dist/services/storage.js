"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.storageService = exports.StorageService = void 0;
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const uuid_1 = require("uuid");
class StorageService {
    dbPath;
    database = {};
    constructor(dbPath = 'mocks.json') {
        this.dbPath = path_1.default.resolve(dbPath);
    }
    async initialize() {
        try {
            const data = await promises_1.default.readFile(this.dbPath, 'utf-8');
            this.database = JSON.parse(data);
        }
        catch (error) {
            this.database = {};
            await this.save();
        }
    }
    async save() {
        await promises_1.default.writeFile(this.dbPath, JSON.stringify(this.database, null, 2));
    }
    async getAllEntities(entityType) {
        return this.database[entityType] || [];
    }
    async getEntityById(entityType, id) {
        const entities = this.database[entityType] || [];
        return entities.find(entity => entity.id === id) || null;
    }
    async createEntity(entityType, data) {
        if (!this.database[entityType]) {
            this.database[entityType] = [];
        }
        const entity = {
            id: (0, uuid_1.v4)(),
            ...data,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        this.database[entityType].push(entity);
        await this.save();
        return entity;
    }
    async updateEntity(entityType, id, data) {
        const entities = this.database[entityType] || [];
        const entityIndex = entities.findIndex(entity => entity.id === id);
        if (entityIndex === -1) {
            return null;
        }
        const updatedEntity = {
            ...entities[entityIndex],
            ...data,
            id,
            updatedAt: new Date().toISOString(),
        };
        entities[entityIndex] = updatedEntity;
        await this.save();
        return updatedEntity;
    }
    async deleteEntity(entityType, id) {
        const entities = this.database[entityType] || [];
        const entityIndex = entities.findIndex(entity => entity.id === id);
        if (entityIndex === -1) {
            return false;
        }
        entities.splice(entityIndex, 1);
        await this.save();
        return true;
    }
    getAllEntityTypes() {
        return Object.keys(this.database);
    }
    async getDatabase() {
        return { ...this.database };
    }
}
exports.StorageService = StorageService;
exports.storageService = new StorageService();
//# sourceMappingURL=storage.js.map