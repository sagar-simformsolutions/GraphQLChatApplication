import {useLazyQuery, useQuery} from '@apollo/client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useEffect, useState} from 'react';
import {Text, View, StyleSheet, TouchableOpacity, FlatList} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {GET_GROUP_LIST} from '../graphql/Queries';

const GroupList = ({item, ...props}) => {
  return (
    <TouchableOpacity
      style={styles.messageContainer}
      onPress={() => props?.navigation.navigate('Chat', {id: item?.id})}>
      <View style={styles.innerMessageContainer}>
        <Text>{item?.name}</Text>
      </View>
    </TouchableOpacity>
  );
};

const MessageList = ({params, ...props}) => {
  const [getGroupList, {loading, error, data}] = useLazyQuery(GET_GROUP_LIST);
  useEffect(() => {
    getGroupList();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text>Group List </Text>
      </View>
      <FlatList
        data={data?.groupList}
        renderItem={({item, index}) => {
          return <GroupList item={item} {...props} />;
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  messageContainer: {
    height: 70,
    borderBottomWidth: 1,
    justifyContent: 'center',
  },
  innerMessageContainer: {
    flexDirection: 'row',
    marginHorizontal: 15,
  },
  header: {
    height: 90,
    borderBottomWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
export default MessageList;
