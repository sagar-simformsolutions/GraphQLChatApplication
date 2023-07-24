import React, { useEffect, useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './screens/LoginScreen';
import SignUpScreen from './screens/SignUpScreen';
import ChatScreen from './screens/ChatScreen';
import MessageList from './screens/MessageList';
import { NavigationContainer } from '@react-navigation/native';
import {
  ApolloClient,
  createHttpLink,
  ApolloProvider,
  InMemoryCache,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getToken } from './utils';

const Stack = createStackNavigator();

const MainStack = () => {
  const [isLogin, setLogin] = useState(null);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(async () => {
    const data = await getToken();
    setLogin(data);
  }, []);

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      {!isLogin && (
        <>
          <Stack.Screen name='Login' component={LoginScreen} />
          <Stack.Screen name='SignUp' component={SignUpScreen} />
        </>
      )}
      <Stack.Screen name='MessageList' component={MessageList} />
      <Stack.Screen name='Chat' component={ChatScreen} />
    </Stack.Navigator>
  );
};

const App = () => {
  const httpLink = createHttpLink({
    uri: 'http://localhost:8080/',
  });

  let tokenData = null;
  const authLink = setContext(async (_, { headers }) => {
    tokenData = await getToken();

    const token = JSON.parse(tokenData)?.jwt ?? null;
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : '',
      },
    };
  });

  const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
  });

  return (
    <ApolloProvider client={client}>
      <NavigationContainer>
        <MainStack />
      </NavigationContainer>
    </ApolloProvider>
  );
};

export default App;
