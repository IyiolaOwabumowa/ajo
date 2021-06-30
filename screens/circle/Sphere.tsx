import {useNavigation} from '@react-navigation/core';
import React, {useEffect, useRef} from 'react';
import {
  Animated,
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
import {Props, SphereProps} from '../../types';
import BottomBar from '../BottomBar';

const Sphere = ({id, title}: SphereProps) => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('CircleDashboard', {id: id, headerTitle: title});
      }}
      activeOpacity={0.7}
      style={[styles.container]}>
      <Text style={styles.body}>{title}</Text>
    </TouchableOpacity>
  );
};

export default Sphere;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    //borderColor: '#141414',
    backgroundColor:"#0A3C25",
    //borderWidth: 3,
    width: 127,
    height: 127,
    borderRadius: 100,
    padding: 10,
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
    textAlign: 'center',
    lineHeight: 25,
  },
});
