import {useNavigation} from '@react-navigation/native';
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
import {DashCardProps} from '../../types';

const DashboardCard = ({
  title,
  subtitle,
  value,
  wallet,
  slug,
}: DashCardProps) => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      activeOpacity={slug ? 0.9 : 1}
      onPress={() => {
        if (slug == 'card') {
          navigation.navigate('AddCard');
        }
        if (slug == 'bank') {
          navigation.navigate('BankAccount');
        }
      }}
      style={[
        styles.container,
        {
          justifyContent: 'center',
          backgroundColor: wallet ? '#9e5096' : '#733a78',
          width: '49%',
          height: wallet ? 150 : 150,
          borderRadius: 3,
        },
      ]}>
      {!wallet && (
        <Text
          style={[
            styles.body,
            {
              fontSize: wallet ? 15 : 15,
              marginTop: 8,
              marginBottom: wallet ? 10 : 0,
              color: wallet ? '#fff' : '#fff',
              fontFamily: 'Axiforma-Medium',
            },
          ]}>
          {title}
        </Text>
      )}

      {slug == 'card' && (
        <Image
          source={require('../../assets/images/credit-card.png')}
          resizeMode="contain"
          style={{width: '30%', height: '30%'}}
        />
      )}
      {slug == 'bank' && (
        <Image
          source={require('../../assets/images/bank.png')}
          resizeMode="contain"
          style={{width: '30%', height: '30%'}}
        />
      )}

      <Text
        style={[
          styles.header,
          {
            fontSize: wallet ? 14 : 20,
            marginTop: wallet ? 10 : 0,
            color: wallet ? '#fff' : '#fff',
            lineHeight: wallet ? 18 : 40,
            fontFamily: 'Axiforma-Medium',
          },
        ]}>
        {value}
        {wallet &&
        wallet.bankdetails.authorization != null &&
        slug == 'card' ? (
          <Text
            style={[
              styles.header,
              {
                textDecorationLine:"underline",
                textDecorationStyle:"dotted",
                fontSize: wallet ? 14 : 20,
                marginTop: wallet ? 10 : 0,
                color: wallet ? '#000' : '#000',
                lineHeight: wallet ? 18 : 40,
                fontFamily: 'Axiforma-Medium',
              },
            ]}>
            {'\n\n'}Change {slug}?
          </Text>
        ) : (
          <></>
        )}

        {wallet &&
        wallet.bankdetails.accountnumber != null &&
        slug == 'bank' ? (
          <Text
            style={[
              styles.header,
              {
                textDecorationLine:"underline",
                textDecorationStyle:"dotted",
                fontSize: wallet ? 14 : 20,
                marginTop: wallet ? 10 : 0,
                color: wallet ? '#000' : '#000',
                lineHeight: wallet ? 18 : 40,
                fontFamily: 'Axiforma-Medium',
                
              },
            ]}>
            {'\n\n'}Change {slug}?
          </Text>
        ) : (
          <></>
        )}
      </Text>
    </TouchableOpacity>
  );
};

export default DashboardCard;

const styles = StyleSheet.create({
  container: {
    height: 158,
    borderRadius: 10,
    marginTop: 8,
    backgroundColor: '#02fffA',
    padding: 20,
    width: '100%',
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
    color: '#E2A8FE',
  },
});
