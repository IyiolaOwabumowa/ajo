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
import TransactionEntry from './TransactionEntry';

const CircleDashboard = ({navigation}: Props) => {
  return (
    <View style={styles.container}>
      <View style={[styles.transBar]}>
        <Text style={[styles.body, {fontSize: 13}]}>
        Round 1
        </Text>

        <Text style={[styles.body, {fontSize: 13}]}>
          Ends in 23 days
        </Text>
      </View>
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'flex-start',
          backgroundColor: '#043b23',
          paddingLeft: 20,
          height: 130,
          width: '90%',
          borderRadius: 5,
        }}>
        <Text style={[styles.header, {fontSize: 15}]}>
          Monthly Goal: $4,000,000
        </Text>
        <Text style={[styles.body, {fontSize: 13, marginTop: 20}]}>
          We've saved: $300,000
        </Text>
      </View>
      <View
        style={[
          styles.transBar,
          {
            alignItems: 'center',

            marginBottom: 0,
            paddingLeft: 20,
          },
        ]}>
        <Text style={[styles.body, {fontSize: 13, textAlign: 'center'}]}>
          We're funding{' '}
          <Text style={[styles.header, {fontSize: 13}]}>Iyiola Owabumowa</Text>{' '}
          in this round
        </Text>
      </View>
      <View
        style={[
          styles.transBar,
          {alignItems: 'center', backgroundColor: '#043b23', marginBottom: 0},
        ]}>
        <Text style={[styles.body, {fontSize: 13, textAlign: 'center'}]}>
          View this round’s transactions
        </Text>

        <Image
          source={require('../../assets/images/forward-arrow.png')}
          resizeMode="contain"
          style={{width: 10, height: '60%'}}
        />
      </View>
      <View
        style={[
          styles.transBar,
          {
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'space-evenly',
            paddingLeft: 0,
            marginTop: 60,
            backgroundColor: '#ffffff00',
          },
        ]}>
        <Text style={[styles.header, {fontSize: 15}]}>
          Your due contribution for this round
        </Text>
        <Text
          style={[
            styles.body,
            {fontSize: 13, color: '#ffffff50', marginTop: 10},
          ]}>
          We’ll deduct this from your ajo wallet
        </Text>
      </View>

      <View style={{flex:1, width:"90%"}}>
        <TouchableOpacity
          activeOpacity={0.8}
          style={[
            styles.transBar,
            {
              marginTop:0,
              height:50,
              width: '100%',
              backgroundColor: '#0A3C25',
              justifyContent: 'flex-start',
            },
          ]}>
          <Text style={[styles.body, {fontSize: 13}]}>Pay $14,000 Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CircleDashboard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#1C1C1C',
  },
  transBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '90%',
    borderRadius: 5,
    backgroundColor: '#00000020',
    height: 60,
    marginTop: 20,
    marginBottom: 20,
    paddingLeft: 20,
    paddingRight: 20,
  },
  incomeBg: {
    width: '50%',
    height: 30,
    borderRadius: 4,
    marginBottom: 15,
    paddingLeft: 20,
    paddingRight: 20,
    backgroundColor: '#42256D',
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
    fontFamily: 'Axiforma Medium',
    fontSize: 29,
    color: 'white',
  },
  body: {
    fontFamily: 'Axiforma Medium',
    fontSize: 14,
    color: 'white',
  },
});
