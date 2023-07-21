import {gql} from '@apollo/client';

const GET_GROUP_LIST = gql`
  query groupList {
    groupList {
      id
      name
    }
  }
`;

const GET_MESSAGES = gql`
  query messages($groupId: Int, $userId: Int) {
    messages(groupId: $groupId, userId: $userId) {
      id
      text
      createdAt
      from {
        id
        username
      }
      to {
        id
        name
      }
    }
  }
`;

export {GET_GROUP_LIST, GET_MESSAGES};
