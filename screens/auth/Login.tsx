import React, {useEffect, useState} from 'react';
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
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {authActions} from '../../src/actions/auth.actions';
import {RootState} from '../../src/reducers';
import {Props} from '../../types';

const Login: React.FC<Props> = ({route, navigation}) => {
  console.log(route?.params)
  const dispatch = useDispatch();
  const loginError = useSelector(
    (state: RootState) => state.authReducer.loginError,
  );
  const loggingIn = useSelector(
    (state: RootState) => state.authReducer.loggingIn,
  );

  const [form, setForm] = useState<Object>({email: 'demo@gmail.com', password: 'demo'});
  const [error, setError] = useState<String | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setError(loginError);
  }, [loginError]);

  useEffect(() => {
    if (loggingIn) {
      setLoading(true);
    } else {
      setLoading(false);
    }
  }, [loggingIn]);

  return (
    <View style={styles.container}>
      <Text style={[styles.header, {marginTop: 20}]}>Welcome back!</Text>
      <Text style={[styles.body, {marginTop: 20, marginBottom: 20}]}>
        Log In to continue
      </Text>

      <TextInput
        style={[styles.input, styles.body]}
        placeholder="Email Address"
        placeholderTextColor="#ffffff60"
        keyboardType="email-address"
        autoCapitalize="none"
        value={form.email}
        onChangeText={text => {
          setForm({...form, email: text});
        }}
      />
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
      <TouchableOpacity
        onPress={() => {
          setLoading(true);
          if (form.email.length != 0 && form.password.length != 0) {
            dispatch(authActions.login(form));
          } else {
            setError('Please fill in your details completely');
            setTimeout(() => {
              setError(null);
            }, 4000);
          }
        }}
        activeOpacity={0.89}
        style={{
          backgroundColor: '#E2A8FE',
          height: 45,
          borderRadius: 3,
          marginTop: 30,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        {loggingIn ? (
          <ActivityIndicator color={'#02000a'} size={'small'} />
        ) : (
          <Text style={[styles.body, {color:"#02000a"}]}>Log In</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => {
          navigation.navigate('ForgotPassword');
        }}
        activeOpacity={0.89}
        style={styles.forgot}>
        <Text style={styles.body}>I forgot my password</Text>
      </TouchableOpacity>

      {error && (
        <>
          <Text
            style={[
              styles.body,
              {marginBottom: 30, color: 'red', marginTop: 20, lineHeight:23},
            ]}>
            {error}
          </Text>
        </>
      )}
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#fff',
    padding: 20,
  },
  forgot: {
    marginTop: 30,
    alignItems: 'flex-start',
  },
  input: {
    backgroundColor: '#E2A8FE20',
    height: 53,
    marginTop: 15,
    borderRadius: 3,
    paddingLeft: 15,
    fontSize: 15,
  },
  header: {
    fontFamily: 'Axiforma-Heavy',
    fontSize: 29,
    color: 'black',
  },
  body: {
    fontFamily: 'Axiforma-Medium',
    fontSize: 15,
    color: 'black',
  },
});
