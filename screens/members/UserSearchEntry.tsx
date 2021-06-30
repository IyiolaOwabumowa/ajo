import React, {useEffect} from 'react';
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
} from 'react-native';
import {Props, UserSearchEntryProps} from '../../types';
import SlideUp from '../settings/SlideUp';
import SettingItem from '../settings/SettingItem';

const UserSearchEntry = ({id, name, email}: UserSearchEntryProps) => {
  return (
    <View style={styles.container}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <View
          style={{
            backgroundColor: '#00000040',
            width: 50,
            height: 50,
            borderRadius: 25,
            marginRight: 25,
          }}></View>
        <View>
          <Text style={styles.body}>{name}</Text>
          <View
            style={{
              borderRadius: 3,
              marginTop: 5,
            }}>
            <Text style={[styles.body, {color: '#ffffff80'}]}>
              {email.length >= 20 ? `${email.slice(0, 20)}...` : email}
            </Text>
          </View>
        </View>
      </View>

      <TouchableOpacity activeOpacity={0.89} style={styles.invite}>
        <Text style={styles.body}>Send Invite</Text>
      </TouchableOpacity>
    </View>
  );
};

export default UserSearchEntry;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 5,
    backgroundColor: '#171717',
    padding: 10,
    marginBottom: 15,
  },
  invite: {
    padding: 5,
    marginRight: 10,
    borderRadius: 3,
    backgroundColor: '#0A3C25',
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
    fontFamily: 'Axiforma Heavy',
    fontSize: 29,
    color: 'white',
  },
  body: {
    fontFamily: 'Axiforma Medium',
    fontSize: 12,
    color: '#ffffff',
  },
});
