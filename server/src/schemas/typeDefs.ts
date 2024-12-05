import { gql } from 'graphql-tag';

const typeDefs = gql`
  # Define the User type
  type User {
    id: ID!
    username: String!
    email: String!
    firstName: String
    lastName: String
    createdAt: String!
  }
    type Book {
    bookid: ID!
    title: String!
    authors: [String]!
    description: String
    image: String
    link: String!
  }
    type Auth {
    token: ID!
    user: User
    }

  # Define the Query type with a 'me' field
  type Query {
    me: User
    getBooks: Book
  }

  # Define any Mutations here if needed (example)
  type Mutation {
    addUser(username: String!, email: String!, password: String): Auth
    saveBook(bookId: ID!, userId: ID!): User
    removeBook(bookId: ID!, userId: ID!): User
    loginUser(email: String!, passsword: String!): Auth
  }
`;
export default typeDefs;