import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useRef, useState} from 'react';
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
  ActivityIndicator,
  Alert,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {authActions} from '../../src/actions/auth.actions';
import {RootState} from '../../src/reducers';
import Dashboard from '../dashboard/Dashboard';
import BankAccount from '../settings/BankAccount';
import PersonalInformation from '../settings/PersonalInformation';
import AddCard from '../wallet/AddCard';
import Welcome from './Welcome';

const CreateAccount = () => {
  const [form, setForm] = useState<Object>({
    deviceId: '999',
    username: '',
    email: '',
    password: '',
    phone: '',
  });

  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [error, setError] = useState<null | String>(null);
  const [step, setStep] = useState(1);
  const retainer = useRef(1);
  const registering = useSelector(
    (state: RootState) => state.authReducer.registering,
  );

  const serverError = useSelector(
    (state: RootState) => state.authReducer.errorMessage,
  );

  const toastMessage = useSelector(
    (state: RootState) => state.authReducer.toastMessage,
  );

  useEffect(() => {
    setError(serverError);
  }, [serverError]);

  useEffect(() => {
    if (toastMessage) {
      Alert.alert(`${toastMessage}`);
      setTimeout(() => {
        navigation.goBack();
      }, 3000);
    }
  }, [toastMessage]);

  const next = () => {
    setStep(step + 1);
    // dispatch(authActions.signup(form));
  };

  const callback = () => {};

  return (
    <View style={styles.container}>
      <Text style={[styles.header, {marginTop: 25}]}>Step 1 of 4</Text>
      <Text style={[styles.body, {marginTop: 20, marginBottom: 30}]}>
        Create your ajo account below
      </Text>
      <Text style={[styles.body]}>Username</Text>

      <TextInput
        style={[styles.input, styles.body]}
        placeholder="Username"
        placeholderTextColor="#ffffff60"
        autoCapitalize="none"
        autoCorrect={false}
        onChangeText={text => {
          setForm({...form, username: text.trim().toLowerCase()});
        }}
      />
      <Text style={[styles.body]}>Email Address</Text>

      <TextInput
        style={[styles.input, styles.body]}
        placeholder="Email Address"
        placeholderTextColor="#ffffff60"
        keyboardType="email-address"
        autoCapitalize="none"
        onChangeText={text => {
          setForm({...form, email: text});
        }}
      />

      <Text style={[styles.body]}>Password</Text>

      <TextInput
        style={[styles.input, styles.body]}
        placeholder="Password"
        placeholderTextColor="#ffffff60"
        secureTextEntry={true}
        value={form.password}
        onChangeText={text => {
          setForm({...form, password: text});
        }}
      />
      {/* <Text style={[styles.body, {marginTop: 20}]}>Confirm Password</Text>
      <TextInput
        style={[styles.input, styles.body]}
        placeholder="Re-enter your password"
        placeholderTextColor="#ffffff60"
        secureTextEntry={true}
      /> */}
      <Text style={[styles.body]}>Phone Number</Text>

      <TextInput
        style={[styles.input, styles.body]}
        placeholder="Phone Number"
        placeholderTextColor="#ffffff60"
        value={form.phone}
        maxLength= {11}
        onChangeText={text => {
          setForm({...form, phone: text});
        }}
      />
      <TouchableOpacity
        onPress={() => {
          if (
            form.username.length > 0 &&
            form.email.length > 0 &&
            form.password.length > 0 &&
            form.phone.length > 0
          ) {
            dispatch(authActions.signup(form));
            dispatch(authActions.saveOnBoarding("true"))
            
            // Alert.alert('Account created successfully');
          } else {
            setError('Fill in all details correctly');
            setTimeout(() => {
              setError(null);
            }, 5000);
          }
        }}
        activeOpacity={0.89}
        style={{
          backgroundColor: '#E2A8FE',
          height: 53,
          borderRadius: 3,
          marginTop: 30,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        {registering ? (
          <ActivityIndicator color={'#02000A'} size={'small'} />
        ) : (
          <Text style={[styles.body, {color: '#02000A'}]}>Next</Text>
        )}
      </TouchableOpacity>
      <Text
        style={[
          styles.body,
          {marginBottom: 30, color: '#E2A8FE', marginTop: 20},
        ]}>
        {error && `${error}`}
      </Text>
    </View>
  );
};

export default CreateAccount;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#0a0612',
    padding: 20,
  },
  input: {
    backgroundColor: '#E2A8FE20',
    height: 53,
    marginTop: 10,
    marginBottom: 20,
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
    fontSize: 15,
    color: 'white',
  },
});
