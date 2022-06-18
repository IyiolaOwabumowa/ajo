import React, {useEffect, useState} from 'react';
import RNPaystack from 'react-native-paystack';
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
  ActivityIndicator,
  Alert,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../src/reducers';
import {Props, SettingItemProps} from '../../types';
import SettingItem from '../settings/SettingItem';
import WalletBar from './WalletBar';
import endpointsConfig from '../../endpoints.config';
import axios from 'axios';
import Config from 'react-native-config';
import {useNavigation} from '@react-navigation/native';
import {authActions} from '../../src/actions/auth.actions';
import { walletActions } from '../../src/actions/wallet.actions';

const AddCard = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const token = useSelector(state => state.authReducer.token);
  const _id = useSelector((state: RootState) => state.authReducer.userId);
  const profile = useSelector((state: RootState) => state.userReducer.profile);
  const onboarding = useSelector(state => state.authReducer.onboarding);
  const wallet = useSelector((state: RootState) => state.walletReducer.wallet);

  const [form, setForm] = useState({
    amountInKobo: '5000',
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cvc: '',
    email: '',
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (profile) {
      // setForm({
      //   amountInKobo: '5000',
      //   cardNumber: '',
      //   expiryMonth: '',
      //   expiryYear: '',
      //   cvc: '',
      //   email: profile.email,
      // });

      setForm({
        amountInKobo: '5000',
        cardNumber: '4084084084084081',
        expiryMonth: '06',
        expiryYear: '23',
        cvc: '408',
        email: profile.email,
      });

      
    }
  }, []);

  return (
    <View style={styles.container}>
      {/* <WalletBar balance={20000} /> */}
      {onboarding ? (
        <>
          <Text style={[styles.header, {marginTop: 20, padding: 20}]}>
            Last Step
          </Text>
          <Text
            style={[
              styles.body,
              {
                lineHeight: 25,
                textAlign: 'left',
                color: '#ffffff',
                paddingLeft: 20,

                marginBottom: 30,
              },
            ]}>
            Anytime your ajo payment is due, {'\n'}
            we'll charge this card
          </Text>
        </>
      ) : (
        <Text
          style={[
            styles.body,
            {
              lineHeight: 25,
              textAlign: 'center',
              color: '#ffffff',
              paddingLeft: 30,
              paddingRight: 30,
              marginBottom: 30,
              marginTop: 10,
            },
          ]}>
          Anytime your ajo payment is due, {'\n'}
          we'll charge your card
        </Text>
      )}
      <View style={{padding: 20}}>
        <Text style={[styles.body]}>Card Number</Text>
        <TextInput
          style={[styles.input, styles.body]}
          placeholder="Enter your card number"
          placeholderTextColor="#ffffff60"
          keyboardType="number-pad"
          value={form.cardNumber}
          maxLength={19}
          onChangeText={text => {
            setForm({
              ...form,
              cardNumber: text
                .replace(/\s?/g, '')
                .replace(/(\d{4})/g, '$1 ')
                .trim(),
            });
          }}
        />
        <View style={{flexDirection: 'row'}}>
          <View style={{width: '47%', marginRight: '6%'}}>
            <Text style={[styles.body]}>Expiry Date</Text>
            <TextInput
              style={[styles.input, styles.body]}
              placeholder="Expiry Month (MM)"
              placeholderTextColor="#ffffff60"
              value={form.expiryMonth}
              maxLength={2}
              onChangeText={text => {
                setForm({
                  ...form,
                  expiryMonth: text,
                });
              }}
            />
          </View>
          <View style={{width: '47%', marginRight: '6%'}}>
            <Text style={[styles.body]}>Expiry Year</Text>
            <TextInput
              style={[styles.input, styles.body]}
              placeholder="Expiry Year (YY)"
              placeholderTextColor="#ffffff60"
              value={form.expiryYear}
              maxLength={2}
              onChangeText={text => {
                setForm({
                  ...form,
                  expiryYear: text,
                });
              }}
            />
          </View>
        </View>

        <View>
          <Text style={[styles.body]}>CVV</Text>
          <TextInput
            style={[styles.input, styles.body]}
            placeholder="CVV"
            placeholderTextColor="#ffffff60"
            keyboardType="number-pad"
            value={form.cvc}
            maxLength={3}
            onChangeText={text => {
              setForm({...form, cvc: text});
            }}
          />
        </View>

        <TouchableOpacity
          activeOpacity={0.89}
          onPress={() => {
            setLoading(true);
            if (
              form.cardNumber.length > 0 &&
              form.cvc.length > 0 &&
              // form.email.length > 0 &&
              form.expiryMonth.length > 0 &&
              form.expiryYear.length > 0
            ) {
              Alert.alert(
                'Important Notice',
                "We're about to test your card's validity with a temporary ₦50 charge and we will refund your bank account immediately",
                [
                  {
                    text: 'Continue',
                    onPress: () => {
                      RNPaystack.chargeCard(form)
                        .then(async res => {
                          setLoading(false);

                          await axios
                            .get(
                              `${Config.API_URL}/api/wallets/verify/${res.reference}`,
                              {
                                headers: {
                                  Authorization: `Bearer ${token}`,
                                  'Content-Type': 'application/json',
                                },
                              },
                            )
                            .then((response: any) => {
                              console.log(response);
                              if (!onboarding) {
                                Alert.alert(
                                  'Your card details have been updated!',
                                );
                              } else {
                                Alert.alert('Welcome to ajo', '', [
                                  {text: 'Continue', style: 'default'},
                                ]);
                              }
                              dispatch(authActions.finishOnBoarding());
                              dispatch(walletActions.getWallet(wallet._id, token))
                            })

                            .catch((error: any) => {
                              setError(error.response.data.message.body);
                              setTimeout(() => {
                                setError(null);
                              }, 3000);
                            });
                        })
                        .catch(error => {
                          setLoading(false);
                          console.log(error); // error is a javascript Error object
                          console.log(error.message);
                          Alert.alert(error.message);
                          // setError(error.message);
                          // setTimeout(() => {
                          //   setError(null);
                          // }, 4000);
                          // console.log(error.code);
                        });
                    },
                  },
                  {
                    text: 'Cancel',
                    onPress: () => {
                      setLoading(false);
                      Alert.alert(
                        "Without your card details (which we will never ever save), you won't be able to participate in an ajo.",
                      );
                    },
                  },
                ],
              );
            } else {
              setLoading(false);
              setError('Please fill in all your details');
              setTimeout(() => {
                setError(null);
              }, 4000);
            }
          }}
          style={{
            backgroundColor: '#E2A8FE',
            height: 58,
            borderRadius: 3,

            justifyContent: 'center',
            alignItems: 'center',
          }}>
          {loading ? (
            <ActivityIndicator color={'#02000a'} size={'small'} />
          ) : (
            <Text style={[styles.body, {color: '#02000A'}]}>
              {onboarding ? 'Next' : 'Change Card'}
            </Text>
          )}
        </TouchableOpacity>
        {error && (
          <Text
            style={[
              styles.body,
              {
                textAlign: 'center',
                marginTop: 10,
                lineHeight: 20,
                color: '#E2A8FE',
              },
            ]}>
            {error}
          </Text>
        )}

        <Text
          style={[
            styles.body,
            {textAlign: 'center', marginTop: 50, lineHeight: 20},
          ]}>
          Ajo Technologies will never store your card information as all
          payments and personal information are securely processed and encrypted
          by Paystack
        </Text>
      </View>
    </View>
  );
};

export default AddCard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
