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

const BankAccount = () => {
  return (
    <View style={styles.container}>
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
        Your bank account information is safely stored and encrypted with ajo
      </Text>
      <View style={{padding: 20}}>
        <Text style={[styles.body]}>First Name</Text>
        <TextInput
          style={[styles.input, styles.body]}
          placeholder="Enter your first name"
          placeholderTextColor="#ffffff60"
        />
        <Text style={[styles.body]}>Last Name</Text>
        <TextInput
          style={[styles.input, styles.body]}
          placeholder="Enter your last name"
          placeholderTextColor="#ffffff60"
        />
        <Text style={[styles.body]}>Account Number</Text>
        <TextInput
          style={[styles.input, styles.body]}
          placeholder="Enter your account number"
          placeholderTextColor="#ffffff60"
        />
        <TouchableOpacity
          activeOpacity={0.89}
          style={{
            backgroundColor: '#0A3C25',
            height: 58,
            borderRadius: 3,

            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text style={styles.body}>Update</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default BankAccount;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1C1C1C',
  },
  bar: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#171717',
    padding: 10,
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
