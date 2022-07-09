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
import {Props, UserSearchEntryProps} from '../../types';
import SlideUp from '../settings/SlideUp';
import SettingItem from '../settings/SettingItem';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../src/reducers';
import axios from 'axios';
import Config from 'react-native-config';
import {Members} from '../../server/types';
import {circleActions} from '../../src/actions/circle.actions';

const UserSearchEntry = ({
  id,
  name,
  email,
  storeInvite,
}: UserSearchEntryProps) => {
  const dispatch = useDispatch();

  const token = useSelector((state: RootState) => state.authReducer.token);
  const active = useSelector((state: RootState) => state.circleReducer.active);
  const profile = useSelector((state: RootState) => state.userReducer.profile);

  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const checkStatus = (id: string) => {
    const isInvited = active.invites.some(
      (inviteId: string) => inviteId === id,
    );
    const existsInCircle = active.members.some(
      (members: Members) => members._id.toString() === id,
    );

    if (existsInCircle) return 'Member';
    else return 'Send Invite';
  };

  const sendInvite = async (userId: any, circleId: any, fullname: any) => {
    setLoading(true);
    const body = {
      id: userId,
      circleid: circleId,
    };
    return axios
      .post(`${Config.API_URL}/api/invite`, body, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(response => {
        setLoading(false);
        Alert.alert(`${response.data.message.body}`);
        setSent(true);
      })
      .catch(function (error) {
        setLoading(false);
        console.log(error.response);
        if (error.response) {
          const errorObject = {
            status: error.response.status,
            error: error.response,
          };
          Alert.alert(`${error.response.data.message.body}`);
          return errorObject;
        }
      });
  };

  // useEffect(() => {
  //   if (invitedMomentsAgo) {
  //     setSent(true);
  //   }
  // }, [invitedMomentsAgo]);

  return (
    <View style={{justifyContent:"center", alignItems:"center"}}>

    
    <View style={styles.container}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <View>
          {/* <Text style={styles.body}>{name}</Text> */}
          <Text style={[styles.body, {fontSize: 13}]}>{name}</Text>
          {/* <View
            style={{
              borderRadius: 3,
              marginTop: 5,
            }}>
            <Text style={[styles.body, {color: '#ffffff80'}]}>
              {email.length >= 20 ? `${email.slice(0, 20)}...` : email}
            </Text>
          </View> */}
        </View>
      </View>
      {loading ? (
        <ActivityIndicator
          style={{padding: 5, marginRight: 30}}
          color={'black'}
          size={'small'}
        />
      ) : (
        <TouchableOpacity
          onPress={() => {
            if (checkStatus(id) == 'Send Invite') {
              sendInvite(id, active._id, name);
              storeInvite(id);
            }
          }}
          activeOpacity={0.89}
          style={{
            ...styles.invite,
            backgroundColor:
              checkStatus(id) == 'Send Invite' ? '#E2A8FE' : '#ffffff30',
          }}>
          <Text
            style={{
              ...styles.body,
              color: checkStatus(id) == 'Send Invite' ? '#02000A' : '#ffffff30',
            }}>
            {checkStatus(id)}
          </Text>
        </TouchableOpacity>
      )}
    </View>
    </View>
  );
};

export default UserSearchEntry;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height:55,
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 3,
    backgroundColor: '#E2A8FE40',
    paddingLeft: 20,
    paddingRight: 20,
    // marginLeft: 10,
    // marginRight:10,
    marginTop:15


  },
  invite: {
    padding: 5,
    marginRight: 10,
    borderRadius: 3,
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
    backgroundColor: '#2E2E2E',
    height: 53,
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
    fontSize: 12,
    color: '#000',
  },
});
