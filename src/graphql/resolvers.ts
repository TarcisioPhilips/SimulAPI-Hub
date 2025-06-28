import { GraphQLScalarType, Kind } from 'graphql';
import { storageService } from '../services/storage';
import type { Entity } from '../types';

// Custom JSON scalar type
const JSONScalar = new GraphQLScalarType({
  name: 'JSON',
  description: 'JSON custom scalar type',
  serialize(value: unknown): unknown {
    return value;
  },
  parseValue(value: unknown): unknown {
    return value;
  },
  parseLiteral(ast): unknown {
    switch (ast.kind) {
      case Kind.STRING:
      case Kind.BOOLEAN:
        return ast.value;
      case Kind.INT:
      case Kind.FLOAT:
        return parseFloat(ast.value);
      case Kind.OBJECT:
        return ast.fields.reduce((acc, field) => {
          acc[field.name.value] = this.parseLiteral(field.value);
          return acc;
        }, {} as Record<string, unknown>);
      case Kind.LIST:
        return ast.values.map(value => this.parseLiteral(value));
      default:
        return null;
    }
  },
});

interface EntityWithData extends Omit<Entity, 'id'> {
  id: string;
  data: Record<string, unknown>;
}

const transformEntity = (entity: Entity): EntityWithData => {
  const { id, createdAt, updatedAt, ...data } = entity;
  return {
    id,
    createdAt: createdAt as string,
    updatedAt: updatedAt as string,
    data,
  };
};

export const resolvers = {
  JSON: JSONScalar,

  Query: {
    entities: async (_: unknown, { type }: { type: string }): Promise<EntityWithData[]> => {
      const entities = await storageService.getAllEntities(type);
      return entities.map(transformEntity);
    },

    entity: async (_: unknown, { type, id }: { type: string; id: string }): Promise<EntityWithData | null> => {
      const entity = await storageService.getEntityById(type, id);
      return entity ? transformEntity(entity) : null;
    },

    entityTypes: async (): Promise<string[]> => {
      return storageService.getAllEntityTypes();
    },

    health: () => ({
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      version: process.env.npm_package_version || '1.0.0',
    }),
  },

  Mutation: {
    createEntity: async (_: unknown, { type, input }: { type: string; input: Record<string, unknown> }): Promise<EntityWithData> => {
      const entity = await storageService.createEntity(type, input);
      return transformEntity(entity);
    },

    updateEntity: async (_: unknown, { type, id, input }: { type: string; id: string; input: Record<string, unknown> }): Promise<EntityWithData | null> => {
      const entity = await storageService.updateEntity(type, id, input);
      return entity ? transformEntity(entity) : null;
    },

    deleteEntity: async (_: unknown, { type, id }: { type: string; id: string }): Promise<boolean> => {
      return await storageService.deleteEntity(type, id);
    },
  },
};