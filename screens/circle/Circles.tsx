import {useNavigation} from '@react-navigation/core';
import React, {useEffect, useRef} from 'react';
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
  Animated,
} from 'react-native';
import {Props} from '../../types';
import BottomBar from '../BottomBar';
import Sphere from './Sphere';

const Circles = ({navigation}: Props) => {
  const valueY = useRef(new Animated.Value(0)).current;

  const valueY2 = useRef(new Animated.Value(5)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(valueY, {
          toValue: 5,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(valueY, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ]),
    ).start();
    Animated.loop(
      Animated.sequence([
        Animated.timing(valueY2, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(valueY2, {
          toValue: 5,
          duration: 2000,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, []);
  return (
    <View style={styles.container}>
      <Text
        style={[
          styles.body,
          {
            lineHeight: 25,
            textAlign: 'center',
            color: '#ffffff30',
            paddingLeft: 30,
            paddingRight: 30,
            marginBottom: 30,
          },
        ]}>
        Tap on a circle to enter
      </Text>
      <View>
        <Animated.View
          style={[
            styles.container,
            {
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginBottom: 150,
              transform: [{translateY: valueY}],
            },
          ]}>
          <Sphere title={'Olatunde Family'} id={'3'} />

          <Sphere title={'Greensprings School'} id={'3'} />
        </Animated.View>
        <Animated.View
          style={[
            styles.container,
            {
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginBottom: 150,
              transform: [{translateY: valueY2}],
            },
          ]}>
          <Sphere title={'Evans'} id={'3'} />

          <Sphere title={'Titi Family'} id={'3'} />
        </Animated.View>
        <Animated.View
          style={[
            styles.container,
            {
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginBottom: 30,
              transform: [{translateY: valueY}],
            },
          ]}>
          <Sphere title={'PEPSI'} id={'3'} />

          <Sphere title={'MTN'} id={'3'} />
        </Animated.View>
      </View>

      {/* <View style={styles.center}>
        
      </View> */}
    </View>
  );
};

export default Circles;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#1C1C1C',
    padding: 20,
  },
  center: {
    flex: 1,
    alignItems: 'center',
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
