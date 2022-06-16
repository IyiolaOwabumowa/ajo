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

const WalletDashboard = ({navigation, route}: Props) => {
  return (
    <View style={styles.container}>
      {/* <WalletBar balance={20000} /> */}

      <SettingItem title="Fund Wallet" next="Fund" />
      <SettingItem title="Withdraw " next="Withdraw"  />
    </View>
  );
};

export default WalletDashboard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop:30,
    backgroundColor: '#0a0612',
  },
  bar: {
    width: '70%',
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
