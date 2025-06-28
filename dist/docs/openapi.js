"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.openApiSpec = void 0;
exports.openApiSpec = {
    openapi: '3.0.0',
    info: {
        title: 'Mock-API & Docs-as-a-Service',
        version: '1.0.0',
        description: 'A generic CRUD API for mocking any entity with auto-generated documentation',
        contact: {
            name: 'API Support',
        },
    },
    servers: [
        {
            url: 'http://localhost:3000',
            description: 'Development server',
        },
    ],
    paths: {
        '/health': {
            get: {
                tags: ['Health'],
                summary: 'Health check endpoint',
                description: 'Returns the health status of the API',
                responses: {
                    '200': {
                        description: 'API is healthy',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        status: { type: 'string', example: 'ok' },
                                        timestamp: { type: 'string', format: 'date-time' },
                                        uptime: { type: 'number', example: 3600 },
                                        version: { type: 'string', example: '1.0.0' },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
        '/api/{entity}': {
            get: {
                tags: ['Generic CRUD'],
                summary: 'List all entities',
                description: 'Retrieve all entities of a specific type',
                parameters: [
                    {
                        name: 'entity',
                        in: 'path',
                        required: true,
                        description: 'The entity type (e.g., users, posts, products)',
                        schema: { type: 'string' },
                        example: 'users',
                    },
                ],
                responses: {
                    '200': {
                        description: 'List of entities',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        data: {
                                            type: 'array',
                                            items: { $ref: '#/components/schemas/Entity' },
                                        },
                                        message: { type: 'string' },
                                    },
                                },
                            },
                        },
                    },
                },
            },
            post: {
                tags: ['Generic CRUD'],
                summary: 'Create new entity',
                description: 'Create a new entity of the specified type',
                parameters: [
                    {
                        name: 'entity',
                        in: 'path',
                        required: true,
                        description: 'The entity type',
                        schema: { type: 'string' },
                        example: 'users',
                    },
                ],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                additionalProperties: true,
                                example: {
                                    name: 'John Doe',
                                    email: 'john@example.com',
                                    age: 30,
                                },
                            },
                        },
                    },
                },
                responses: {
                    '201': {
                        description: 'Entity created successfully',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        data: { $ref: '#/components/schemas/Entity' },
                                        message: { type: 'string' },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
        '/api/{entity}/{id}': {
            get: {
                tags: ['Generic CRUD'],
                summary: 'Get entity by ID',
                description: 'Retrieve a specific entity by its ID',
                parameters: [
                    {
                        name: 'entity',
                        in: 'path',
                        required: true,
                        description: 'The entity type',
                        schema: { type: 'string' },
                        example: 'users',
                    },
                    {
                        name: 'id',
                        in: 'path',
                        required: true,
                        description: 'The entity ID',
                        schema: { type: 'string' },
                        example: '123e4567-e89b-12d3-a456-426614174000',
                    },
                ],
                responses: {
                    '200': {
                        description: 'Entity found',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        data: { $ref: '#/components/schemas/Entity' },
                                        message: { type: 'string' },
                                    },
                                },
                            },
                        },
                    },
                    '404': {
                        description: 'Entity not found',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/ErrorResponse' },
                            },
                        },
                    },
                },
            },
            put: {
                tags: ['Generic CRUD'],
                summary: 'Update entity',
                description: 'Update an existing entity',
                parameters: [
                    {
                        name: 'entity',
                        in: 'path',
                        required: true,
                        description: 'The entity type',
                        schema: { type: 'string' },
                        example: 'users',
                    },
                    {
                        name: 'id',
                        in: 'path',
                        required: true,
                        description: 'The entity ID',
                        schema: { type: 'string' },
                        example: '123e4567-e89b-12d3-a456-426614174000',
                    },
                ],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                additionalProperties: true,
                                example: {
                                    name: 'Jane Doe',
                                    email: 'jane@example.com',
                                },
                            },
                        },
                    },
                },
                responses: {
                    '200': {
                        description: 'Entity updated successfully',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        data: { $ref: '#/components/schemas/Entity' },
                                        message: { type: 'string' },
                                    },
                                },
                            },
                        },
                    },
                    '404': {
                        description: 'Entity not found',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/ErrorResponse' },
                            },
                        },
                    },
                },
            },
            delete: {
                tags: ['Generic CRUD'],
                summary: 'Delete entity',
                description: 'Delete an entity by its ID',
                parameters: [
                    {
                        name: 'entity',
                        in: 'path',
                        required: true,
                        description: 'The entity type',
                        schema: { type: 'string' },
                        example: 'users',
                    },
                    {
                        name: 'id',
                        in: 'path',
                        required: true,
                        description: 'The entity ID',
                        schema: { type: 'string' },
                        example: '123e4567-e89b-12d3-a456-426614174000',
                    },
                ],
                responses: {
                    '200': {
                        description: 'Entity deleted successfully',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        message: { type: 'string' },
                                    },
                                },
                            },
                        },
                    },
                    '404': {
                        description: 'Entity not found',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/ErrorResponse' },
                            },
                        },
                    },
                },
            },
        },
    },
    components: {
        schemas: {
            Entity: {
                type: 'object',
                properties: {
                    id: {
                        type: 'string',
                        format: 'uuid',
                        description: 'Unique identifier',
                        example: '123e4567-e89b-12d3-a456-426614174000',
                    },
                    createdAt: {
                        type: 'string',
                        format: 'date-time',
                        description: 'Creation timestamp',
                    },
                    updatedAt: {
                        type: 'string',
                        format: 'date-time',
                        description: 'Last update timestamp',
                    },
                },
                additionalProperties: true,
                required: ['id'],
            },
            ErrorResponse: {
                type: 'object',
                properties: {
                    error: { type: 'string' },
                    message: { type: 'string' },
                },
                required: ['error', 'message'],
            },
        },
    },
};
//# sourceMappingURL=openapi.js.map