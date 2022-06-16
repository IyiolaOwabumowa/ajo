import React, {useEffect, useReducer, useState} from 'react';
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

const ForgotPassword = () => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [resetError, setResetError] = useState<String | null>(null);
  const [resetSuccess, setResetSuccess] = useState<String | null>(null);

  const requesting = useSelector(
    (state: RootState) => state.authReducer.sendingReq,
  );
  const serverError = useSelector(
    (state: RootState) => state.authReducer.resetError,
  );
  const resetMessage = useSelector(
    (state: RootState) => state.authReducer.resetMessage,
  );

  useEffect(() => {
    if (resetMessage != null) {
      Alert.alert(`${resetMessage}`);
    }
  }, [resetMessage]);

  return (
    <View style={styles.container}>
      <Text style={[styles.header, {marginTop: 20}]}>Reset Password</Text>
      <Text style={[styles.body, {marginTop: 20, marginBottom: 20}]}>
        Let's help you out!
      </Text>

      <TextInput
        style={[styles.input, styles.body]}
        placeholder="Enter the email you signed up with"
        placeholderTextColor="#ffffff60"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={text => {
          setEmail(text);
        }}
      />

      <TouchableOpacity
        activeOpacity={0.89}
        onPress={() => {
          if (email.length > 0) {
            dispatch(authActions.sendResetLink(email));
          } else {
            setResetError('Please enter your email');
            setTimeout(() => {
              setResetError(null);
            }, 5000);
          }
        }}
        style={{
          backgroundColor: '#E2A8FE',
          height: 53,
          borderRadius: 3,
          marginTop: 30,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        {requesting ? (
          <ActivityIndicator color={'#02000A'} size={'small'} />
        ) : (
          <Text style={[styles.body, {color: '#02000A'}]}>
            Send me a reset link
          </Text>
        )}
      </TouchableOpacity>
      <Text
        style={[
          styles.body,
          {marginTop: 30, color: '#E2A8FE', lineHeight: 25},
        ]}>
        {serverError && `${serverError}`}
        {'\n'}
        {resetError && `${resetError}`}
      </Text>
    </View>
  );
};

export default ForgotPassword;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#0a0612',
    padding: 20,
  },
  forgot: {
    marginTop: 40,
    alignItems: 'flex-start',
  },
  input: {
    backgroundColor: '#E2A8FE20',
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
    fontSize: 15,
    color: 'white',
  },
});
