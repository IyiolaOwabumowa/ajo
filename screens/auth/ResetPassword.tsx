import {useNavigation} from '@react-navigation/native';
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
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {authActions} from '../../src/actions/auth.actions';
import {RootState} from '../../src/reducers';
import {Props, SettingItemProps} from '../../types';

const ResetPassword = ({route}: any) => {
  const {token, id} = route.params;
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const profile = useSelector((state: RootState) => state.userReducer.profile);
  const message = useSelector((state: RootState) => state.authReducer.message);
  const requesting = useSelector(
    (state: RootState) => state.authReducer.requesting,
  );
  const successful = useSelector(
    (state: RootState) => state.authReducer.successful,
  );
  const error = useSelector((state: RootState) => state.authReducer.error);

  const [form, setForm] = useState({
    confirmpassword: '',
    newpassword: '',
  });

  const [warning, setWarning] = useState<String | null>(null);

  useEffect(() => {
    if (successful) {
      Alert.alert(
        'Password reset successful! ',
        'You can now login with your new password',
      );
      navigation.navigate('Login');
    }
  }, [successful]);

  return (
    <View style={styles.container}>
      <View style={{padding: 20}}>
        <Text style={[styles.body]}>New Password</Text>
        <TextInput
          style={[styles.input, styles.body]}
          placeholder="Enter your new password"
          placeholderTextColor="#ffffff60"
          autoCapitalize="none"
          value={form.newpassword}
          onChangeText={text => {
            setForm({...form, newpassword: text});
          }}
        />

        <Text style={[styles.body]}>Confirm New Password</Text>
        <TextInput
          style={[styles.input, styles.body]}
          placeholder="Enter your new password"
          placeholderTextColor="#ffffff60"
          autoCapitalize="none"
          value={form.confirmpassword}
          onChangeText={text => {
            setForm({...form, confirmpassword: text});
          }}
        />

        <TouchableOpacity
          activeOpacity={0.89}
          style={{
            backgroundColor: '#E2A8FE',
            height: 45,
            borderRadius: 3,

            justifyContent: 'center',
            alignItems: 'center',
          }}
          onPress={() => {
            if (
              form.confirmpassword.length > 0 &&
              form.newpassword.length > 0
            ) {
              if (form.confirmpassword === form.newpassword) {
                const data = {password: form.newpassword};
                dispatch(authActions.resetPassword(token, id, data));
              } else {
                setWarning('Passwords do not match');
                setTimeout(() => {
                  setWarning(null);
                }, 3000);
              }
            } else {
              setWarning('Kindly enter your password in both fields');
              setTimeout(() => {
                setWarning(null);
              }, 3000);
            }
          }}>
          {requesting ? (
            <ActivityIndicator color={'#02000a'} size={'small'} />
          ) : (
            <Text style={[styles.body, {color: '#02000A'}]}>Update</Text>
          )}
        </TouchableOpacity>
        {error && (
          <Text style={[styles.body, {marginTop: 5, color: '#E2A8FE'}]}>
            {error}
          </Text>
        )}
        {warning && (
          <Text style={[styles.body, {marginTop: 5, color: '#E2A8FE'}]}>
            {warning}
          </Text>
        )}
        {message && (
          <Text style={[styles.body, {marginTop: 5, color: '#E2A8FE'}]}>
            {message}
          </Text>
        )}
      </View>
    </View>
  );
};

export default ResetPassword;

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
