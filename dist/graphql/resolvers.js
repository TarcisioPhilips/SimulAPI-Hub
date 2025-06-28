"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolvers = void 0;
const graphql_1 = require("graphql");
const storage_1 = require("../services/storage");
const JSONScalar = new graphql_1.GraphQLScalarType({
    name: 'JSON',
    description: 'JSON custom scalar type',
    serialize(value) {
        return value;
    },
    parseValue(value) {
        return value;
    },
    parseLiteral(ast) {
        switch (ast.kind) {
            case graphql_1.Kind.STRING:
            case graphql_1.Kind.BOOLEAN:
                return ast.value;
            case graphql_1.Kind.INT:
            case graphql_1.Kind.FLOAT:
                return parseFloat(ast.value);
            case graphql_1.Kind.OBJECT:
                return ast.fields.reduce((acc, field) => {
                    acc[field.name.value] = this.parseLiteral(field.value);
                    return acc;
                }, {});
            case graphql_1.Kind.LIST:
                return ast.values.map(value => this.parseLiteral(value));
            default:
                return null;
        }
    },
});
const transformEntity = (entity) => {
    const { id, createdAt, updatedAt, ...data } = entity;
    return {
        id,
        createdAt: createdAt,
        updatedAt: updatedAt,
        data,
    };
};
exports.resolvers = {
    JSON: JSONScalar,
    Query: {
        entities: async (_, { type }) => {
            const entities = await storage_1.storageService.getAllEntities(type);
            return entities.map(transformEntity);
        },
        entity: async (_, { type, id }) => {
            const entity = await storage_1.storageService.getEntityById(type, id);
            return entity ? transformEntity(entity) : null;
        },
        entityTypes: async () => {
            return storage_1.storageService.getAllEntityTypes();
        },
        health: () => ({
            status: 'ok',
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            version: process.env.npm_package_version || '1.0.0',
        }),
    },
    Mutation: {
        createEntity: async (_, { type, input }) => {
            const entity = await storage_1.storageService.createEntity(type, input);
            return transformEntity(entity);
        },
        updateEntity: async (_, { type, id, input }) => {
            const entity = await storage_1.storageService.updateEntity(type, id, input);
            return entity ? transformEntity(entity) : null;
        },
        deleteEntity: async (_, { type, id }) => {
            return await storage_1.storageService.deleteEntity(type, id);
        },
    },
};
//# sourceMappingURL=resolvers.js.map