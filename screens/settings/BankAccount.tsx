import axios from 'axios';
import React, {Profiler, useEffect, useRef, useState} from 'react';
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
import RNPickerSelect from 'react-native-picker-select';
import Config from 'react-native-config';
import {useDispatch, useSelector} from 'react-redux';
import {walletActions} from '../../src/actions/wallet.actions';
import {RootState} from '../../src/reducers';
import {Props, SettingItemProps} from '../../types';
import SettingItem from './SettingItem';
import DropDownPicker from 'react-native-dropdown-picker';
import {useNavigation} from '@react-navigation/native';
// import {banks} from "./banks"

const BankAccount = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const onboarding = useSelector(state => state.authReducer.onboarding);
  const token = useSelector((state: RootState) => state.authReducer.token);
  const profile = useSelector((state: RootState) => state.userReducer.profile);
  const _id = useSelector((state: RootState) => state.authReducer.userId);
  const wallet = useSelector((state: RootState) => state.walletReducer.wallet);
  const err = useSelector((state: RootState) => state.walletReducer.error);
  const successful = useSelector(
    (state: RootState) => state.walletReducer.success,
  );

  const requesting = useSelector(
    (state: RootState) => state.walletReducer.requesting,
  );

  const [form, setForm] = useState({
    accountnumber: '',
    recipientcode: '',
  });
  const [error, setError] = useState<string | null>(null);
  const pickerRef = useRef();
  const [bank, setBank] = useState<any>(null);
  const [banks, setBanks] = useState([]);
  const [open, setOpen] = useState(false);
  const [updated, setUpdated] = useState(false);

  var banksForPicker: any = [];

  useEffect(() => {
    if (banks.length == 0) {
      axios
        .get('https://api.paystack.co/bank?currency=NGN')
        .then(res => {
          res.data.data.splice(0, 90).map((object: any) => {
            banksForPicker.push({label: object.name, value: object.code});
          });
          setBanks(banksForPicker);
        })
        .then(error => {
          // console.log(error);
        });
    }
  }, []);

  useEffect(() => {
    if (wallet && wallet.bankdetails) {
      // change back to this after demo
      // setBank(wallet.bankdetails.bankcode);
      // setForm({
      //   accountnumber: wallet.bankdetails.accountnumber,
      //   recipientcode: wallet.bankdetails.recipientcode,
      //   authorizationcode: wallet.bankdetails.authorizationcode,
      // });

      setBank("057");
      setForm({
        accountnumber: "0000000000",
        recipientcode: "RCP_u25dbpb45wajw94",
        authorizationcode: wallet.bankdetails.authorizationcode,
      });


      // bankcode
      // 
      // accountnumber
      // 
    }
  }, []);

  useEffect(() => {
    if (requesting == false && err != null) {
      Alert.alert(err);
    }
  }, [err]);
  useEffect(() => {
    if (successful) {
      setUpdated(successful);
    }
  }, [successful]);

  useEffect(() => {
    if (updated) {
      if (onboarding) {
        navigation.navigate('StepFour');
        setUpdated(false);
      } else {
        Alert.alert('Bank updated successfully');
        setUpdated(false);
      }
    }
  }, [updated]);

  // useEffect(() => {}, [banks]);
  return (
    <View style={styles.container}>
      {onboarding ? (
        <>
          <Text style={[styles.header, {marginTop: 20, padding: 20}]}>
            Step 3 of 4
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
            This is where we'll send all the {'\n'}
            money you earn
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
          This is where we'll send all the {'\n'}
          money you make
        </Text>
      )}

      <View style={{padding: 20}}>
        <Text style={[styles.body]}>Choose your bank</Text>
        <View
          style={{
            zIndex: 3, // works on ios
            elevation: 3,
            marginTop: 10,
            marginBottom: 30,
          }}>
          <DropDownPicker
            open={open}
            value={bank}
            items={banks}
            setOpen={setOpen}
            setValue={setBank}
            dropDownContainerStyle={{
              backgroundColor: '#E2A8FE',
            }}
            listItemLabelStyle={{
              color: '#000',
            }}
            bottomOffset={-800}
            theme="DARK"
          />
        </View>

        <Text style={[styles.body]}>Account Number</Text>
        <TextInput
          style={[styles.input, styles.body]}
          placeholder="Enter your account number"
          placeholderTextColor="#ffffff60"
          value={form.accountnumber}
          maxLength={10}
          onChangeText={text => {
            setForm({...form, accountnumber: text});
          }}
        />

        <TouchableOpacity
          activeOpacity={0.89}
          style={{
            backgroundColor: '#E2A8FE',
            height: 53,
            borderRadius: 3,
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onPress={() => {
            if (bank != null && form.accountnumber.length > 0) {
              dispatch(
                walletActions.updateBankDetails(
                  token,
                  form.accountnumber,
                  bank,
                  form.recipientcode,
                ),
              );
            } else {
              setError('Please fill in all details completely');

              setTimeout(() => {
                setError(null);
              }, 4000);
            }
          }}>
          {requesting ? (
            <ActivityIndicator color={'#02000A'} size={'small'} />
          ) : (
            <Text style={[styles.body, {color: '#02000A'}]}>
              {onboarding ? 'Next' : ' Update Bank Account'}
            </Text>
          )}
        </TouchableOpacity>

        {error && (
          <>
            <Text
              style={[
                styles.body,
                {marginBottom: 30, color: '#E2A8FE', marginTop: 20},
              ]}>
              {error}
            </Text>
          </>
        )}
      </View>
    </View>
  );
};

export default BankAccount;

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
