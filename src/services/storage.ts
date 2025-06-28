import fs from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import type { Entity, MockDatabase, CreateEntityRequest, UpdateEntityRequest } from '../types';

export class StorageService {
  private dbPath: string;
  private database: MockDatabase = {};

  constructor(dbPath = 'mocks.json') {
    this.dbPath = path.resolve(dbPath);
  }

  async initialize(): Promise<void> {
    try {
      const data = await fs.readFile(this.dbPath, 'utf-8');
      this.database = JSON.parse(data) as MockDatabase;
    } catch (error) {
      // File doesn't exist or is invalid, start with empty database
      this.database = {};
      await this.save();
    }
  }

  private async save(): Promise<void> {
    await fs.writeFile(this.dbPath, JSON.stringify(this.database, null, 2));
  }

  async getAllEntities(entityType: string): Promise<Entity[]> {
    return this.database[entityType] || [];
  }

  async getEntityById(entityType: string, id: string): Promise<Entity | null> {
    const entities = this.database[entityType] || [];
    return entities.find(entity => entity.id === id) || null;
  }

  async createEntity(entityType: string, data: CreateEntityRequest): Promise<Entity> {
    if (!this.database[entityType]) {
      this.database[entityType] = [];
    }

    const entity: Entity = {
      id: uuidv4(),
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.database[entityType].push(entity);
    await this.save();
    return entity;
  }

  async updateEntity(entityType: string, id: string, data: UpdateEntityRequest): Promise<Entity | null> {
    const entities = this.database[entityType] || [];
    const entityIndex = entities.findIndex(entity => entity.id === id);

    if (entityIndex === -1) {
      return null;
    }

    const updatedEntity: Entity = {
      ...entities[entityIndex],
      ...data,
      id, // Ensure ID cannot be changed
      updatedAt: new Date().toISOString(),
    };

    entities[entityIndex] = updatedEntity;
    await this.save();
    return updatedEntity;
  }

  async deleteEntity(entityType: string, id: string): Promise<boolean> {
    const entities = this.database[entityType] || [];
    const entityIndex = entities.findIndex(entity => entity.id === id);

    if (entityIndex === -1) {
      return false;
    }

    entities.splice(entityIndex, 1);
    await this.save();
    return true;
  }

  getAllEntityTypes(): string[] {
    return Object.keys(this.database);
  }

  async getDatabase(): Promise<MockDatabase> {
    return { ...this.database };
  }
}

export const storageService = new StorageService();