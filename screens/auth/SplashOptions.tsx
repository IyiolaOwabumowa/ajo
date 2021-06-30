import React, {useEffect} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  ImageBackground,
  Text,
  useColorScheme,
  View,
  Button,
  TouchableOpacity,
  TouchableHighlight,
} from 'react-native';
import {Props} from '../../types';

const SplashOptions: React.FC<Props> = ({navigation}) => {
  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../../assets/ios/splash-image.png')}
        style={styles.image}>
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            width: '100%',
            position: 'absolute',
            bottom: 50,
          }}>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("Login")
            }}
            style={styles.button}
            activeOpacity={0.89}>
            <Text style={[styles.body, {color: 'black'}]}>Log In</Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              navigation.navigate('CreateAccount');
            }}>
            <Text style={[styles.body, {marginTop: 30, marginBottom: 30}]}>
              Create an account
            </Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );
};

export default SplashOptions;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#1C1C1C',
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
  button: {
    backgroundColor: 'white',
    width: '80%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  image: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
