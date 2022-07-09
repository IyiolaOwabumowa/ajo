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
import {Props, TransactionItemProps, UserSearchEntryProps} from '../../types';
import SlideUp from '../settings/SlideUp';
import SettingItem from '../settings/SettingItem';
import moment from 'moment';

const TransactionItem = ({
  dateTime,
  debit,
  initiator,
  name,
  amount,
}: TransactionItemProps) => {
  return (
    <View style={debit ? styles.debit : styles.credit}>
      <View>
        <View
          style={{
            backgroundColor: '#00000020',
            padding: 5,
            borderRadius: 5,
            marginBottom: 10,
          }}>
          <Text style={[styles.body, {color: debit ? 'white' : 'white'}]}>
            {moment(dateTime).format('llll')}
          </Text>
        </View>
        <Text style={[styles.body, {color: debit ? 'white' : 'white',fontWeight: '200', fontSize: 15}]}>
         {debit ? "Debited by" : "Credited by"} {name}{' '}
        </Text>
      </View>
      <Text style={[styles.body, {color: debit ? 'white' : 'white', fontWeight:"700"}]}>
        {' '}
      
        ₦{amount}
      </Text>
    </View>
  );
};

export default TransactionItem;

const styles = StyleSheet.create({
  credit: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 5,
    backgroundColor: '#0A3C25',
    padding: 15,
    marginBottom: 10,
    marginLeft:20,
    marginRight:20,
    marginTop:10
  },
  debit: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 5,
    backgroundColor: '#8B0000',
    padding: 15,
    marginBottom: 10,
    marginLeft:20,
    marginRight:20,
    marginTop:10
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
    fontFamily: 'Axiforma-Heavy',
    fontSize: 29,
    color: 'white',
  },
  body: {
    fontFamily: 'Axiforma-Medium',
    fontSize: 14,
    color: '#000000',
  },
});
