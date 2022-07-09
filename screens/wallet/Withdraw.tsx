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
import SettingItem from '../settings/SettingItem';
import WalletBar from './WalletBar';

const Withdraw = ({navigation, route}: Props) => {
  return (
    <View style={styles.container}>
      {/* <WalletBar balance={20000} /> */}
      <View style={{padding: 20}}>
        <Text style={[styles.body]}>Amount</Text>
        <TextInput
          style={[styles.input, styles.body]}
          placeholder="Amount to withdraw from wallet"
          placeholderTextColor="#ffffff60"
        />
        <TouchableOpacity
          activeOpacity={0.89}
          style={{
            backgroundColor: '#E2A8FE',
            height: 45,
            borderRadius: 3,

            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text style={[styles.body, {color: '#02000A'}]}>
            Withdraw to Bank
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Withdraw;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0612',
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
    backgroundColor: '#E2A8FE20',
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
    fontSize: 14,
    color: 'white',
  },
});
