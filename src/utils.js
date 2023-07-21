import AsyncStorage from '@react-native-async-storage/async-storage';

const getToken = async () => {
  const tokenRaw = await AsyncStorage.getItem('loginKey');

  if (tokenRaw) {
    return tokenRaw;
  }
  return null;
};

export {getToken};
