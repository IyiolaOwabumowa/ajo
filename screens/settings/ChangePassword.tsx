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
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {authActions} from '../../src/actions/auth.actions';
import {RootState} from '../../src/reducers';
import {Props, SettingItemProps} from '../../types';
import SettingItem from './SettingItem';

const ChangePassword = () => {
  const dispatch = useDispatch();
  const token = useSelector(state => state.authReducer.token);
  const _id = useSelector((state: RootState) => state.authReducer.userId);
  const profile = useSelector((state: RootState) => state.userReducer.profile);
  const message = useSelector((state: RootState) => state.authReducer.message);
  const requesting = useSelector(
    (state: RootState) => state.authReducer.requesting,
  );
  const error = useSelector((state: RootState) => state.authReducer.error);

  const [form, setForm] = useState({
    currentpassword: '',
    newpassword: '',
  });

  const [warning, setWarning] = useState<String | null>(null);

  return (
    <View style={styles.container}>
      <View style={{padding: 20}}>
        <Text style={[styles.body]}>Current Password</Text>

        <TextInput
          style={[styles.input, styles.body]}
          placeholder="Enter your current password"
          placeholderTextColor="#00000050"
          autoCapitalize="none"
          autoCorrect={false}
          value={form.currentpassword}
          onChangeText={text => {
            setForm({...form, currentpassword: text});
          }}
        />
        <Text style={[styles.body]}>New Password</Text>
        <TextInput
          style={[styles.input, styles.body]}
          placeholder="Enter your new password"
          placeholderTextColor="#00000050"
          autoCapitalize="none"
          autoCorrect={false}
          secureTextEntry={true}
          value={form.newpassword}
          onChangeText={text => {
            setForm({...form, newpassword: text});
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
              form.currentpassword.length > 0 &&
              form.newpassword.length > 0
            ) {
              dispatch(authActions.changePassword(token, form));
            } else {
              setWarning('Please fill in all fields');
              setTimeout(() => {
                setWarning(null);
              }, 3000);
            }
          }}>
          {requesting ? (
            <ActivityIndicator color={'#02000a'} size={'small'} />
          ) : (
            <Text style={[styles.body, {color: "#02000A"}]}>Update</Text>
          )}
        </TouchableOpacity>
        {error && <Text style={[styles.body, {marginTop: 30, color:"red"}]}>{error}</Text>}
        {warning && (
          <Text style={[styles.body, {marginTop: 30, color: "red"}]}>{warning}</Text>
        )}
        {message && (
          <Text style={[styles.body, {marginTop: 30, color:"red"}]}>{message}</Text>
        )}
      </View>
    </View>
  );
};

export default ChangePassword;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
    color: 'black',
  },
});
