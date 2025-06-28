import { GraphQLScalarType } from 'graphql';
import type { Entity } from '../types';
interface EntityWithData extends Omit<Entity, 'id'> {
    id: string;
    data: Record<string, unknown>;
}
export declare const resolvers: {
    JSON: GraphQLScalarType<unknown, unknown>;
    Query: {
        entities: (_: unknown, { type }: {
            type: string;
        }) => Promise<EntityWithData[]>;
        entity: (_: unknown, { type, id }: {
            type: string;
            id: string;
        }) => Promise<EntityWithData | null>;
        entityTypes: () => Promise<string[]>;
        health: () => {
            status: string;
            timestamp: string;
            uptime: number;
            version: string;
        };
    };
    Mutation: {
        createEntity: (_: unknown, { type, input }: {
            type: string;
            input: Record<string, unknown>;
        }) => Promise<EntityWithData>;
        updateEntity: (_: unknown, { type, id, input }: {
            type: string;
            id: string;
            input: Record<string, unknown>;
        }) => Promise<EntityWithData | null>;
        deleteEntity: (_: unknown, { type, id }: {
            type: string;
            id: string;
        }) => Promise<boolean>;
    };
};
export {};
//# sourceMappingURL=resolvers.d.ts.map