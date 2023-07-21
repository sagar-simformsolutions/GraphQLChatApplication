import {gql, useMutation} from '@apollo/client';

const Login = gql`
  mutation login($user: SigninUserInput!) {
    login(user: $user) {
      id
      jwt
      username
    }
  }
`;

const CreateMessage = gql`
  mutation createMessage($message: CreateMessageInput!) {
    createMessage(message: $message) {
      id
      text
    }
  }
`;

export {Login, CreateMessage};
