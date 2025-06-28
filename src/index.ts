import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';

import { storageService } from './services/storage';
import healthRoutes from './routes/health';
import apiRoutes from './routes/api';
import { typeDefs } from './graphql/schema';
import { resolvers } from './graphql/resolvers';
import { openApiSpec } from './docs/openapi';

const PORT = process.env.PORT || 3000;

async function startServer(): Promise<void> {
  // Initialize storage
  await storageService.initialize();

  // Create Express app
  const app = express();

  // Security middleware
  app.use(helmet({
    contentSecurityPolicy: false, // Disable for GraphQL Playground
    crossOriginEmbedderPolicy: false,
  }));
  app.use(cors());
  app.use(morgan('combined'));
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));

  // Create Apollo Server
  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    introspection: true,
    // GraphQL Playground is deprecated in Apollo Server 4, but introspection enables GraphiQL
  });

  await apolloServer.start();

  // Routes
  app.use('/', healthRoutes);
  app.use('/', apiRoutes);

  // Swagger UI for REST API documentation
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(openApiSpec, {
    explorer: true,
    customSiteTitle: 'Mock-API & Docs-as-a-Service',
    customCssUrl: '/swagger-ui-custom.css',
  }));

  // GraphQL endpoint
  app.use('/graphql', expressMiddleware(apolloServer));

  // Root endpoint with API information
  app.get('/', (req, res) => {
    res.json({
      name: 'Mock-API & Docs-as-a-Service',
      version: '1.0.0',
      description: 'A generic CRUD API for mocking any entity',
      endpoints: {
        health: '/health',
        restApi: '/api/:entity',
        graphql: '/graphql',
        docs: '/docs',
      },
      documentation: {
        swagger: `${req.protocol}://${req.get('host')}/docs`,
        graphql: `${req.protocol}://${req.get('host')}/graphql`,
      },
    });
  });

  // 404 handler
  app.use('*', (req, res) => {
    res.status(404).json({
      error: 'Not Found',
      message: `Route ${req.originalUrl} not found`,
      availableEndpoints: {
        health: '/health',
        restApi: '/api/:entity',
        graphql: '/graphql',
        docs: '/docs',
      },
    });
  });

  // Error handler
  app.use((error: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('Error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: error.message,
    });
  });

  // Start server
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📚 API Documentation: http://localhost:${PORT}/docs`);
    console.log(`🎯 GraphQL Playground: http://localhost:${PORT}/graphql`);
    console.log(`❤️  Health Check: http://localhost:${PORT}/health`);
  });
}

startServer().catch(error => {
  console.error('Failed to start server:', error);
  process.exit(1);
});