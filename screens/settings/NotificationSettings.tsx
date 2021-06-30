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
import {Props, SettingItemProps} from '../../types';
import SettingItem from './SettingItem';

const NotificationSettings = ({navigation, route}: Props) => {
  return (
    <View style={styles.container}>
      <View>
        <Text
          style={[
            styles.body,
            {
              lineHeight: 25,
              textAlign: 'center',
              color: '#ffffff30',
              paddingLeft: 30,
              paddingRight: 30,
              marginBottom: 30,
              marginTop: 30,
            },
          ]}>
          We know. Sometimes, we also aren't in the mood for notifications
        </Text>

        <SettingItem title="Push Notifications" toggle={true} />
        <SettingItem title="Do Not Disturb" toggle={true} />
      </View>
    </View>
  );
};

export default NotificationSettings;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1C1C1C',
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
    color: 'white',
  },
});
