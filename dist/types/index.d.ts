export interface Entity {
    id: string;
    [key: string]: unknown;
}
export interface MockDatabase {
    [entityType: string]: Entity[];
}
export interface CreateEntityRequest {
    [key: string]: unknown;
}
export interface UpdateEntityRequest {
    [key: string]: unknown;
}
export interface ApiResponse<T = unknown> {
    data?: T;
    error?: string;
    message?: string;
}
export interface HealthResponse {
    status: 'ok';
    timestamp: string;
    uptime: number;
    version: string;
}
//# sourceMappingURL=index.d.ts.map