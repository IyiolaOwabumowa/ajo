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
} from 'react-native';

const CreateAccount = () => {
  return (
    <View style={styles.container}>
      <Text style={[styles.header, {marginTop: 20}]}>Create an account</Text>
      <Text style={[styles.body, {marginTop: 10, marginBottom: 50}]}>
        Set up your ajo account below
      </Text>

      <Text style={styles.body}>Email Address</Text>
      <TextInput
        style={[styles.input, styles.body]}
        placeholder="yourcoolname@here.com"
        placeholderTextColor="#ffffff60"
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <Text style={[styles.body, {marginTop: 20}]}>Password</Text>
      <TextInput
        style={[styles.input, styles.body]}
        placeholder="Enter a password"
        placeholderTextColor="#ffffff60"
        secureTextEntry={true}
      />
      <Text style={[styles.body, {marginTop: 20}]}>Confirm Password</Text>
      <TextInput
        style={[styles.input, styles.body]}
        placeholder="Re-enter your password"
        placeholderTextColor="#ffffff60"
        secureTextEntry={true}
      />
      <TouchableOpacity
        activeOpacity={0.89}
        style={{
          backgroundColor: '#0A3C25',
          height: 58,
          borderRadius: 3,
          marginTop: 30,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Text style={styles.body}>Let's Go!</Text>
      </TouchableOpacity>
    </View>
  );
};

export default CreateAccount;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#1C1C1C',
    padding: 20,
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
    fontFamily: 'Axiforma Heavy',
    fontSize: 29,
    color: 'white',
  },
  body: {
    fontFamily: 'Axiforma Medium',
    fontSize: 15,
    color: 'white',
  },
});
