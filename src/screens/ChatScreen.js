/* eslint-disable react-native/no-inline-styles */
import {useLazyQuery, useMutation} from '@apollo/client';
import React, {useEffect, useState} from 'react';
import {
  FlatList,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {GET_MESSAGES} from '../graphql/Queries';
import {getToken} from '../utils';
import {CreateMessage} from '../graphql/mutation/AuthMutation';

const ChatScreen = ({...props}) => {
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [currentUserName, setCurrentUserName] = useState('');
  const [getMessages, {loading, error, data}] = useLazyQuery(GET_MESSAGES);
  const [
    createMessage,
    {
      data: createMessageData,
      loading: createMessageLoading,
      error: createMessageError,
    },
  ] = useMutation(CreateMessage);

  const handleGetUser = async () => {
    const userData = await getToken();
    const getUserId = JSON.parse(userData)?.id;
    const getUserName = JSON.parse(userData)?.username;
    setCurrentUserName(getUserName);
    setCurrentUserId(getUserId);
    getMessages({
      variables: {
        groupId: props?.route?.params?.id,
        userId: getUserId,
      },
    });
  };

  useEffect(() => {
    const reversedData = data?.messages ? [...data?.messages]?.reverse() : [];
    setMessages(reversedData);
  }, [data]);

  const handleSend = () => {
    if (newMessage.length === 0) {
      return;
    }

    createMessage({
      variables: {
        message: {
          groupId: props?.route?.params?.id,
          text: newMessage,
        },
      },
    });

    setMessages(
      [
        ...data?.messages,
        {
          from: {id: currentUserId, username: currentUserName},
          text: newMessage,
        },
      ]?.reverse(),
    );
    setNewMessage('');
  };

  useEffect(() => {
    handleGetUser();
  }, []);

  const renderItem = ({item}) => {
    const isCurrentUser = item?.from?.id === currentUserId;
    return (
      <View
        style={{
          flexDirection: isCurrentUser ? 'row-reverse' : 'row',
          alignItems: 'center',
        }}>
        <View
          style={{
            height: 50,
            width: 50,
            marginLeft: 5,
            backgroundColor: '#dcf8c6',
            borderRadius: 25,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text style={{fontWeight: '800', color: '#34b7f1'}}>
            {item?.from?.username?.[0]}
          </Text>
        </View>
        <View
          style={{
            backgroundColor: 'white',
            margin: 12,
            width: '50%',
            borderRadius: 15,
          }}>
          <View style={{marginTop: 5, marginLeft: 5}}>
            <Text style={{color: '#34b7f1'}}> {item?.from?.username}</Text>
          </View>
          <Text style={{margin: 10}}>{item?.text}</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={{flex: 1, backgroundColor: '#ece5dd'}}>
        <FlatList
          data={messages ?? []}
          renderItem={renderItem}
          keyExtractor={(item, index) => item?.id?.toString() ?? `${index}`}
          inverted // To display the latest message at the bottom
        />
        <View style={{flexDirection: 'row', alignItems: 'center', padding: 8}}>
          <TextInput
            style={{
              flex: 1,
              height: 40,
              borderColor: 'gray',
              borderWidth: 1,
              marginRight: 8,
            }}
            placeholder="Type a message..."
            value={newMessage}
            onChangeText={text => setNewMessage(text)}
          />
          <TouchableOpacity
            onPress={handleSend}
            style={{backgroundColor: 'blue', padding: 8}}>
            <Text style={{color: 'white'}}>Send</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ChatScreen;
