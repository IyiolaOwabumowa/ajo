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
import {DashCardProps, Props} from '../types';

const BottomBar = ({navigation}: Props) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate("Login");
        }}
        style={{width: '20%', height: '90%'}}>
        <Image
          source={require('../assets/images/home.png')}
          resizeMode="contain"
          style={{width: '100%', height: '100%'}}
        />
      </TouchableOpacity>
      <TouchableOpacity style={{width: '20%', height: '90%'}}>
        <Image
          source={require('../assets/images/wallet.png')}
          resizeMode="contain"
          style={{width: '100%', height: '100%'}}
        />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('Circle');
        }}
        style={{width: '20%', height: '90%'}}>
        <Image
          source={require('../assets/images/circle.png')}
          resizeMode="contain"
          style={{width: '100%', height: '100%'}}
        />
      </TouchableOpacity>
      <TouchableOpacity style={{width: '20%', height: '90%'}}>
        <Image
          source={require('../assets/images/notification.png')}
          resizeMode="contain"
          style={{width: '100%', height: '100%'}}
        />
      </TouchableOpacity>
      <TouchableOpacity style={{width: '20%', height: '90%'}}>
        <Image
          source={require('../assets/images/settings.png')}
          resizeMode="contain"
          style={{width: '100%', height: '100%'}}
        />
      </TouchableOpacity>
    </View>
  );
};

export default BottomBar;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',

    justifyContent: 'space-between',
    bottom: 20,
    position: 'absolute',
    height: 73,
    borderRadius: 40,
    marginTop: 20,
    backgroundColor: '#0A3C25',
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
    color: 'white',
  },
});
