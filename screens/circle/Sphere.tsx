import {useNavigation} from '@react-navigation/native';
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
import {useDispatch} from 'react-redux';
import {circleActions} from '../../src/actions/circle.actions';
import {Props, SphereProps} from '../../types';
import BottomBar from '../BottomBar';

const Sphere = ({circle}: SphereProps) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  return (
    <TouchableOpacity
      onPress={() => {
        dispatch(circleActions.activeCircle(circle));
        navigation.navigate('CircleDashboard', {
          headerTitle: circle.circlename,
        });
      }}
      activeOpacity={0.7}
      style={[styles.container]}>
      <Text style={styles.body}>{circle.circlename}</Text>
      <Image
            source={require('../../assets/images/forward-arrow.png')}
            resizeMode="contain"
            style={{width: '5%'}}
          />
    </TouchableOpacity>
  );
};

export default Sphere;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#E2A8FE40',
    paddingLeft: 20,
    paddingTop: 0,
    paddingRight: 20,
    height: 50,
    marginBottom: 0,
    borderRadius:3,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
    fontFamily: 'Axiforma-Heavy',
    fontSize: 29,
    color: 'white',
  },
  body: {
    fontFamily: 'Axiforma-Medium',
    fontSize: 14,
    color: '#000',
    textAlign: 'center',
    lineHeight: 25,
  },
});
