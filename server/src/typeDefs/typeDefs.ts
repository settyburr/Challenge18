
import { gql } from 'apollo-server';

export const typeDefs = gql`
  # Define the User type
  type User {
    id: ID!
    username: String!
    email: String!
    firstName: String
    lastName: String
    createdAt: String!
  }

  # Define the Query type with a 'me' field
  type Query {
    me: User
  }

  # Define any Mutations here if needed (example)
  type Mutation {
    updateUser(firstName: String, lastName: String): User
  }
`;
