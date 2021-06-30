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
import {Props, SettingItemProps} from '../../types';
import SettingItem from './SettingItem';

const PersonalInformation = ({navigation, route}: Props) => {
  return (
    <View style={styles.container}>
      <View style={{padding: 20}}>
        <View style={{alignItems: 'center', marginBottom: 50}}>
          <View
            style={{
              backgroundColor: '#00000050',
              width: 150,
              height: 150,
              borderRadius: 75,
            }}></View>
        </View>

        <Text style={[styles.body]}>First Name</Text>
        <TextInput
          style={[styles.input, styles.body]}
          placeholder="Enter your first name"
          placeholderTextColor="#ffffff60"
        />
        <Text style={[styles.body]}>Last Name</Text>
        <TextInput
          style={[styles.input, styles.body]}
          placeholder="Enter your last name"
          placeholderTextColor="#ffffff60"
        />
        <Text style={[styles.body]}>Age</Text>
        <TextInput
          style={[styles.input, styles.body]}
          placeholder="Enter your age"
          placeholderTextColor="#ffffff60"
        />

        <Text style={[styles.body]}>Occupation</Text>
        <TextInput
          style={[styles.input, styles.body]}
          placeholder="What do you do"
          placeholderTextColor="#ffffff60"
        />
      </View>
    </View>
  );
};

export default PersonalInformation;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1C1C1C',
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
    backgroundColor: '#2E2E2E',
    height: 53,
    marginTop: 10,
    marginBottom: 30,
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
    fontSize: 14,
    color: 'white',
  },
});
