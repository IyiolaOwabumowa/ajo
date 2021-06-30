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
import {Props} from '../../types';
import SlideUp from '../settings/SlideUp';
import SettingItem from '../settings/SettingItem';
import UserSearchEntry from './UserSearchEntry';

const InviteMembers = ({navigation, route}: Props) => {
  console.log(route?.params);
  return (
    <View style={styles.container}>
      <View style={{marginTop: 30}}></View>
      <Text
        style={[
          styles.body,
          {
            lineHeight: 25,
            textAlign: 'center',
            color: '#ffffff30',

            marginBottom: 30,
          },
        ]}>
        You can only search and invite registered users
      </Text>
      <TextInput
        style={[styles.input, styles.body]}
        placeholder="Search for a user"
        placeholderTextColor="#ffffff60"
      />
      <UserSearchEntry
        name={'Iyiola Owabumowa'}
        email={'iyiolaema@gmail.com'}
        id={2}
      />
      <UserSearchEntry
        name={'Hakeem Olajide'}
        email={'hakfum@gmail.com'}
        id={3}
      />
      <UserSearchEntry
        name={'Moronke Akindele'}
        email={'moronkeakindele@gmail.com'}
        id={3}
      />
    </View>
  );
};

export default InviteMembers;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1C1C1C',
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
    fontSize: 14,
    color: '#ffffff',
  },
});
