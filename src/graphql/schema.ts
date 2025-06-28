import { gql } from 'graphql-tag';

export const typeDefs = gql`
  scalar JSON

  type Entity {
    id: ID!
    createdAt: String
    updatedAt: String
    data: JSON
  }

  type Query {
    entities(type: String!): [Entity!]!
    entity(type: String!, id: ID!): Entity
    entityTypes: [String!]!
    health: HealthStatus!
  }

  type Mutation {
    createEntity(type: String!, input: JSON!): Entity!
    updateEntity(type: String!, id: ID!, input: JSON!): Entity
    deleteEntity(type: String!, id: ID!): Boolean!
  }

  type HealthStatus {
    status: String!
    timestamp: String!
    uptime: Float!
    version: String!
  }
`;