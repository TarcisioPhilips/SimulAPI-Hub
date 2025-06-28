# Mock-API & Docs-as-a-Service

A comprehensive backend MVP that provides a generic CRUD API for mocking any entity, complete with REST endpoints, GraphQL API, auto-generated documentation, and comprehensive testing.

## 🚀 Quick Start

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev
```

The server will start on `http://localhost:3000` with the following endpoints available:

- **API Root**: `http://localhost:3000`
- **Health Check**: `http://localhost:3000/health`
- **REST API**: `http://localhost:3000/api/:entity`
- **GraphQL**: `http://localhost:3000/graphql`
- **API Documentation**: `http://localhost:3000/docs`

## 📋 Features

### ✅ Mock REST API
Generic CRUD operations for any entity type:
- `GET /api/:entity` - List all entities
- `GET /api/:entity/:id` - Get entity by ID
- `POST /api/:entity` - Create new entity
- `PUT /api/:entity/:id` - Update entity
- `DELETE /api/:entity/:id` - Delete entity
- `GET /health` - Health check endpoint

### ✅ GraphQL API
Full GraphQL implementation with:
- Auto-generated schema for all entity types
- Query and mutation support
- GraphQL playground at `/graphql`
- Custom JSON scalar for flexible data types

### ✅ Auto-Generated Documentation
- OpenAPI 3.0 specification
- Interactive Swagger UI at `/docs`
- Comprehensive endpoint documentation

### ✅ Testing Suite
- Vitest + Supertest for API testing
- Health endpoint tests
- REST API integration tests
- GraphQL query/mutation tests

## 🛠️ Usage Examples

### REST API Examples

#### Create a User
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "age": 30
  }'
```

#### Get All Users
```bash
curl http://localhost:3000/api/users
```

#### Get User by ID
```bash
curl http://localhost:3000/api/users/123e4567-e89b-12d3-a456-426614174000
```

#### Update User
```bash
curl -X PUT http://localhost:3000/api/users/123e4567-e89b-12d3-a456-426614174000 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Smith",
    "age": 31
  }'
```

#### Delete User
```bash
curl -X DELETE http://localhost:3000/api/users/123e4567-e89b-12d3-a456-426614174000
```

### GraphQL Examples

#### Create Entity Mutation
```graphql
mutation {
  createEntity(type: "products", input: {
    name: "Laptop",
    price: 999.99,
    category: "Electronics"
  }) {
    id
    data
    createdAt
  }
}
```

#### Query Entities
```graphql
query {
  entities(type: "products") {
    id
    data
    createdAt
    updatedAt
  }
}
```

#### Get Single Entity
```graphql
query {
  entity(type: "products", id: "your-entity-id") {
    id
    data
    createdAt
    updatedAt
  }
}
```

#### Health Check
```graphql
query {
  health {
    status
    timestamp
    uptime
    version
  }
}
```

## 🧪 Testing

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run linting
pnpm lint

# Fix linting issues
pnpm lint:fix

# Format code
pnpm format
```

## 📁 Project Structure

```
src/
├── index.ts              # Main server setup
├── types/                # TypeScript type definitions
├── services/
│   └── storage.ts        # JSON file storage service
├── routes/
│   ├── health.ts         # Health check endpoint
│   └── api.ts            # Generic CRUD endpoints
├── graphql/
│   ├── schema.ts         # GraphQL type definitions
│   └── resolvers.ts      # GraphQL resolvers
└── docs/
    └── openapi.ts        # OpenAPI specification

tests/                    # Test files
├── health.test.ts
├── api.test.ts
└── graphql.test.ts

mocks.json               # JSON storage file
```

## 🎯 Entity Types

The API is completely generic - you can work with any entity type by simply using it in the URL path. Examples:

- `/api/users` - User management
- `/api/posts` - Blog posts
- `/api/products` - Product catalog
- `/api/orders` - Order management
- `/api/anything` - Any custom entity

Each entity automatically gets:
- UUID-based ID generation
- `createdAt` and `updatedAt` timestamps
- Flexible JSON data storage
- Full CRUD operations via REST and GraphQL

## 🔧 Configuration

### Environment Variables
- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment (development/production)

### Storage
Data is persisted in `mocks.json` file in the project root. The file is automatically created if it doesn't exist.

## 📖 API Documentation

### REST API
Visit `http://localhost:3000/docs` for interactive Swagger UI documentation with:
- Complete endpoint descriptions
- Request/response schemas
- Try-it-out functionality
- Authentication examples

### GraphQL API
Visit `http://localhost:3000/graphql` for GraphQL playground with:
- Schema introspection
- Query/mutation examples
- Real-time query execution
- Documentation explorer

## 🚀 Production Deployment

```bash
# Build the project
pnpm build

# Start production server
pnpm start
```

## 🧰 Tech Stack

- **Node.js v20+** - Runtime environment
- **Express.js** - Web framework
- **Apollo Server** - GraphQL server
- **TypeScript** - Type safety
- **Vitest** - Testing framework
- **Supertest** - HTTP testing
- **Swagger UI** - API documentation
- **ESLint + Prettier** - Code quality

## 📝 License

MIT License - feel free to use this project for your own mock API needs!