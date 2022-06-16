import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  ImageBackground,
  Text,
  TextInput,
  useColorScheme,
  View,
  Button,
  TouchableOpacity,
  TouchableHighlight,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {Props} from '../../types';
import SlideUp from '../settings/SlideUp';
import SettingItem from '../settings/SettingItem';
import UserSearchEntry from './UserSearchEntry';
import axios from 'axios';
import Config from 'react-native-config';
import {useSelector} from 'react-redux';
import {RootState} from '../../src/reducers';
import {Members} from '../../server/types';

const InviteMembers = ({navigation, route}: Props) => {
  const token = useSelector((state: RootState) => state.authReducer.token);
  const active = useSelector((state: RootState) => state.circleReducer.active);
  const [users, setUsers] = useState<any>([]);
  const [termStore, setTermStore] = useState('');
  const [storage, setStorage] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const searchUserByName = async (term: any) => {
    setLoading(true);
    return axios
      .get(`${Config.API_URL}/api/invite/?query=${term}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(response => {
        setLoading(false);

        setUsers([...response.data.users]);
      })
      .catch(function (error) {
        setLoading(false);
        setUsers([]);
        if (error.response) {
          const errorObject = {
            status: error.response.status,
            error: error.response,
          };
          return errorObject;
        }
      });
  };

  useEffect(() => {
    console.log(users);
    if (termStore.length > 0) {
      searchUserByName(termStore);
    } else {
      setUsers([]);
    }
  }, [termStore]);

  const storeInvite = (id: string) => {
    const temp = [];
    temp.push(id);
    setStorage([...storage, ...temp]);
  };

  const invitedMomentsAgo = (id: string) => {
    return storage.some((storedId: string) => storedId === id);
  };

  return (
    <View style={styles.container}>
      <View style={{marginTop: 30}}></View>

      <View style={{alignItems: 'center'}}>
        <TextInput
          style={[styles.input, styles.body]}
          placeholder="Search for a registered username"
          placeholderTextColor="#ffffff"
          value={termStore}
          autoCorrect={false}
          onChangeText={text => {
            setTermStore(text);
          }}
        />
      </View>

      {termStore.length == 0 && (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Text
            style={[
              styles.body,
              {
                lineHeight: 25,
                textAlign: 'center',
                color: '#ffffff',

                marginBottom: 30,
              },
            ]}>
            Use the search bar above to start {'\n'}finding who you want to be
            in your circle
          </Text>
        </View>
      )}

      {loading ? (
        <ActivityIndicator color={'white'} size="large" />
      ) : (
        <ScrollView>
          {users.length > 0
            ? users.map(user => {
                return (
                  <UserSearchEntry
                    key={user._id}
                    name={`${user.username}`}
                    email={user.email}
                    id={user._id}
                    // invitedMomentsAgo={invitedMomentsAgo(user._id)}
                    storeInvite={storeInvite}
                  />
                );
              })
            : termStore.length != 0 && (
                <Text
                  style={[
                    styles.body,
                    {
                      lineHeight: 25,
                      textAlign: 'center',
                      color: '#ffffff',

                      marginBottom: 30,
                    },
                  ]}>
                  No user found
                </Text>
              )}
        </ScrollView>
      )}
    </View>
  );
};

export default InviteMembers;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0612',

    padding: 10,
  },
  transBar: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    backgroundColor: '#0A3C25',
    height: 50,
    marginTop: 20,
  },
  incomeBg: {
    padding: 5,
    height: 30,
    borderRadius: 4,
    marginBottom: 10,
    paddingLeft: 20,
    paddingRight: 20,
    backgroundColor: '#0A3C25',
    justifyContent: 'center',
    alignItems: 'center',
  },
  row: {
    height: 40,
    marginRight: 10,
    marginLeft: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  input: {
    backgroundColor: '#E2A8FE20',
    height: 53,
    width: '90%',

    marginTop: 10,
    marginBottom: 30,
    borderRadius: 3,
    paddingLeft: 15,
    fontSize: 15,
  },
  header: {
    fontFamily: 'Axiforma-Heavy',
    fontSize: 29,
    color: 'white',
  },
  body: {
    fontFamily: 'Axiforma-Medium',
    fontSize: 14,
    color: '#ffffff',
  },
});
