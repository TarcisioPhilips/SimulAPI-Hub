"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const server_1 = require("@apollo/server");
const express4_1 = require("@apollo/server/express4");
const storage_1 = require("./services/storage");
const health_1 = __importDefault(require("./routes/health"));
const api_1 = __importDefault(require("./routes/api"));
const schema_1 = require("./graphql/schema");
const resolvers_1 = require("./graphql/resolvers");
const openapi_1 = require("./docs/openapi");
const PORT = process.env.PORT || 3000;
async function startServer() {
    await storage_1.storageService.initialize();
    const app = (0, express_1.default)();
    app.use((0, helmet_1.default)({
        contentSecurityPolicy: false,
        crossOriginEmbedderPolicy: false,
    }));
    app.use((0, cors_1.default)());
    app.use((0, morgan_1.default)('combined'));
    app.use(express_1.default.json({ limit: '10mb' }));
    app.use(express_1.default.urlencoded({ extended: true }));
    const apolloServer = new server_1.ApolloServer({
        typeDefs: schema_1.typeDefs,
        resolvers: resolvers_1.resolvers,
        introspection: true,
    });
    await apolloServer.start();
    app.use('/', health_1.default);
    app.use('/', api_1.default);
    app.use('/docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(openapi_1.openApiSpec, {
        explorer: true,
        customSiteTitle: 'Mock-API & Docs-as-a-Service',
        customCssUrl: '/swagger-ui-custom.css',
    }));
    app.use('/graphql', (0, express4_1.expressMiddleware)(apolloServer));
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
    app.use((error, req, res, next) => {
        console.error('Error:', error);
        res.status(500).json({
            error: 'Internal Server Error',
            message: error.message,
        });
    });
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
//# sourceMappingURL=index.js.map