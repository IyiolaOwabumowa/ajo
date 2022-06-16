import moment from 'moment';
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

const NotificationItem = ({title, content, day}: any) => {
  return (
    <View style={styles.container}>
      <View style={{width: '70%'}}>
        <Text style={[styles.body, {lineHeight: 20, fontWeight:"bold"}]}>{title}</Text>
        <Text style={[styles.body, {lineHeight: 20, marginTop:20, color:"white"}]}>{content}</Text>
      </View>
      <Text style={[styles.body, {lineHeight: 20}]}>
        {moment(day).fromNow()}
      </Text>
    </View>
  );
};

export default NotificationItem;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#02000A',
    borderRadius: 5,
    padding: 20,
    marginBottom: 20,
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
    color: '#E2A8FE',
  },
});
