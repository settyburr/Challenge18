import { gql } from '@apollo/client';


export const LOGIN_USER = gql`
  mutation LoginUser($email: String!, $password: String!) {
    loginUser(email: $email, password: $password) {
      token
      user {
        id
        username
        email
      }
    }
  }
`;

export const ADD_USER = gql`
  mutation AddUser($username: String!, $email: String!, $password: String!) {
    addUser(username: $username, email: $email, password: $password) {
      token
      user {
        id
        username
        email
      }
    }
  }
`;

export const SAVE_BOOK = gql`
  mutation SaveBook($bookId: ID!, $title: String!, $author: String!) {
    saveBook(bookId: $bookId, title: $title, author: $author) {
      id
      username
      savedBooks {
        bookId
        title
        author
      }
    }
  }
`;


export const REMOVE_BOOK = gql`
  mutation RemoveBook($bookId: ID!) {
    removeBook(bookId: $bookId) {
      id
      username
      savedBooks {
        bookId
        title
        author
      }
    }
  }
`;
