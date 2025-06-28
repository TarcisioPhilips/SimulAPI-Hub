import type { Entity, MockDatabase, CreateEntityRequest, UpdateEntityRequest } from '../types';
export declare class StorageService {
    private dbPath;
    private database;
    constructor(dbPath?: string);
    initialize(): Promise<void>;
    private save;
    getAllEntities(entityType: string): Promise<Entity[]>;
    getEntityById(entityType: string, id: string): Promise<Entity | null>;
    createEntity(entityType: string, data: CreateEntityRequest): Promise<Entity>;
    updateEntity(entityType: string, id: string, data: UpdateEntityRequest): Promise<Entity | null>;
    deleteEntity(entityType: string, id: string): Promise<boolean>;
    getAllEntityTypes(): string[];
    getDatabase(): Promise<MockDatabase>;
}
export declare const storageService: StorageService;
//# sourceMappingURL=storage.d.ts.map