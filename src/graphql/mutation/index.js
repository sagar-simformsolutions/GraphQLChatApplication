import { gql, useMutation } from '@apollo/client';

const LOGIN = gql`
  mutation login($user: SigninUserInput!) {
    login(user: $user) {
      id
      jwt
      username
    }
  }
`;

const CREATE_MESSAGE = gql`
  mutation createMessage($message: CreateMessageInput!) {
    createMessage(message: $message) {
      id
      text
    }
  }
`;

export { LOGIN, CREATE_MESSAGE };
