import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { typeDefs } from '../src/graphql/schema';
import { resolvers } from '../src/graphql/resolvers';
import { storageService } from '../src/services/storage';

describe('GraphQL API', () => {
  let app: express.Application;

  beforeAll(async () => {
    await storageService.initialize();

    const apolloServer = new ApolloServer({
      typeDefs,
      resolvers,
    });

    await apolloServer.start();

    app = express();
    app.use(express.json());
    app.use('/graphql', expressMiddleware(apolloServer));
  });

  describe('Health Query', () => {
    it('should return health status', async () => {
      const query = `
        query {
          health {
            status
            timestamp
            uptime
            version
          }
        }
      `;

      const response = await request(app)
        .post('/graphql')
        .send({ query })
        .expect(200);

      expect(response.body.data.health).toMatchObject({
        status: 'ok',
        timestamp: expect.any(String),
        uptime: expect.any(Number),
        version: expect.any(String),
      });
    });
  });

  describe('Entity Queries', () => {
    it('should return empty array for non-existent entity type', async () => {
      const query = `
        query {
          entities(type: "nonexistent") {
            id
            data
          }
        }
      `;

      const response = await request(app)
        .post('/graphql')
        .send({ query })
        .expect(200);

      expect(response.body.data.entities).toEqual([]);
    });

    it('should return all entity types', async () => {
      const query = `
        query {
          entityTypes
        }
      `;

      const response = await request(app)
        .post('/graphql')
        .send({ query })
        .expect(200);

      expect(response.body.data.entityTypes).toEqual(expect.any(Array));
    });
  });

  describe('Entity Mutations', () => {
    it('should create a new entity of any type', async () => {
      const mutation = `
        mutation {
          createEntity(type: "products", input: { 
            name: "Laptop", 
            price: 999.99, 
            category: "Electronics" 
          }) {
            id
            data
            createdAt
            updatedAt
          }
        }
      `;

      const response = await request(app)
        .post('/graphql')
        .send({ query: mutation })
        .expect(200);

      expect(response.body.data.createEntity).toMatchObject({
        id: expect.any(String),
        data: {
          name: 'Laptop',
          price: 999.99,
          category: 'Electronics',
        },
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      });
    });

    it('should create entities of different types', async () => {
      // Create a user
      const userMutation = `
        mutation {
          createEntity(type: "users", input: { 
            name: "João Silva", 
            email: "joao@exemplo.com",
            age: 30
          }) {
            id
            data
          }
        }
      `;

      const userResponse = await request(app)
        .post('/graphql')
        .send({ query: userMutation })
        .expect(200);

      expect(userResponse.body.data.createEntity.data).toMatchObject({
        name: 'João Silva',
        email: 'joao@exemplo.com',
        age: 30,
      });

      // Create a post
      const postMutation = `
        mutation {
          createEntity(type: "posts", input: { 
            title: "Meu Post", 
            content: "Conteúdo do post",
            published: true
          }) {
            id
            data
          }
        }
      `;

      const postResponse = await request(app)
        .post('/graphql')
        .send({ query: postMutation })
        .expect(200);

      expect(postResponse.body.data.createEntity.data).toMatchObject({
        title: 'Meu Post',
        content: 'Conteúdo do post',
        published: true,
      });

      // Verify entity types
      const typesQuery = `
        query {
          entityTypes
        }
      `;

      const typesResponse = await request(app)
        .post('/graphql')
        .send({ query: typesQuery })
        .expect(200);

      expect(typesResponse.body.data.entityTypes).toContain('users');
      expect(typesResponse.body.data.entityTypes).toContain('posts');
    });
  });
});