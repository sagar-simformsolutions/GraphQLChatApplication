import { useLazyQuery, useMutation } from '@apollo/client';
import React, { useEffect, useState } from 'react';
import { Button, StyleSheet, TouchableOpacity } from 'react-native';
import { ActivityIndicator, TextInput } from 'react-native';
import { KeyboardAvoidingView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LOGIN } from '../graphql';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = (props) => {
  const [view, setView] = useState('login');
  const [email, setEmail] = useState('Tabitha7@yahoo.com');
  const [password, setPassword] = useState('HbXNFGAfJ8cFYg2');
  const [username, setUserName] = useState('Arnaldo69');
  const [login, { data, loading, error }] = useMutation(LOGIN);

  const switchView = () => {
    setView(view === 'signup' ? 'login' : 'signup');
  };

  const handleAuthAction = async () => {
    if (view === 'login') {
      login({
        variables: {
          user: {
            email: email,
            password: password,
            username: username,
          },
        },
      });
    }
  };

  const handleLoginCreds = async (login) => {
    await AsyncStorage.setItem('loginKey', JSON.stringify(login)).then(() => {
      props?.navigation?.navigate('MessageList');
    });
  };

  useEffect(() => {
    if (data?.login) {
      handleLoginCreds(data?.login);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.login]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView behavior={'padding'} style={styles.container}>
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator />
          </View>
        )}
        <View style={styles.inputContainer}>
          <TextInput
            onChangeText={(emailId) => setEmail(emailId)}
            placeholder={'Email'}
            style={styles.input}
            value={email}
          />
          <TextInput
            onChangeText={(pwd) => setPassword(pwd)}
            placeholder={'Password'}
            // secureTextEntry
            style={styles.input}
            value={password}
          />
          <TextInput
            onChangeText={(usrName) => setPassword(usrName)}
            placeholder={'Username'}
            style={styles.input}
            value={username}
          />
        </View>
        <Button
          onPress={handleAuthAction}
          style={styles.submit}
          title={view === 'signup' ? 'Sign up' : 'Login'}
          disabled={loading || !!props?.auth?.jwt}
        />
        <View style={styles.switchContainer}>
          <Text>
            {view === 'signup' ? 'Already have an account?' : 'New to Chatty?'}
          </Text>
          <TouchableOpacity onPress={switchView}>
            <Text style={styles.switchAction}>
              {view === 'login' ? 'Sign up' : 'Login'}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#eeeeee',
    paddingHorizontal: 50,
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderRadius: 4,
    marginVertical: 6,
    padding: 6,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  loadingContainer: {
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    position: 'absolute',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 12,
  },
  switchAction: {
    paddingHorizontal: 4,
    color: 'blue',
  },
  submit: {
    marginVertical: 6,
  },
});
