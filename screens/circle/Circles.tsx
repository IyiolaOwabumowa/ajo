import {
  useFocusEffect,
  useIsFocused,
  useNavigation,
} from '@react-navigation/native';
import axios from 'axios';
import React, {useCallback, useEffect, useRef, useState} from 'react';
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
import Config from 'react-native-config';
import {useDispatch, useSelector} from 'react-redux';
import {ICircle} from '../../server/types';
import {circleActions} from '../../src/actions/circle.actions';
import {userActions} from '../../src/actions/user.actions';
import {userConstants} from '../../src/constants/userConstants';
import {RootState} from '../../src/reducers';
import {Props} from '../../types';
import BottomBar from '../BottomBar';
import Sphere from './Sphere';

const Circles = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  // const valueY = useRef(new Animated.Value(0)).current;
  // const valueY2 = useRef(new Animated.Value(5)).current;

  const token = useSelector(state => state.authReducer.token);
  const _id = useSelector((state: RootState) => state.authReducer.userId);
  const user = useSelector((state: RootState) => state.userReducer.user);
  const circles = useSelector(
    (state: RootState) => state.circleReducer.circles,
  );
  const circlesRequesting = useSelector(
    (state: RootState) => state.circleReducer.requesting,
  );
  const profileRequesting = useSelector(
    (state: RootState) => state.userReducer.requesting,
  );
  const wallet = useSelector((state: RootState) => state.walletReducer.wallet);
  const [displayCircles, setDisplayCircles] = useState<Boolean>(true);
  const [profile, setProfile] = useState(null);
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      axios
        .get(`${Config.API_URL}/api/users/${_id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Cache-Control': 'no-cache',
          },
        })
        .then(response => {
          setProfile(response.data.user);
          dispatch(
            circleActions.generateCircles(token, response.data.user.circles),
          );
          setDisplayCircles(true);
        })
        .catch(function (error) {
          console.log(error);

          if (error.response) {
            const errorObject = {
              status: error.response.status,
              error: error.response,
            };
          }
        });
    }
    return () => {};
  }, [isFocused]);

  // useEffect(() => {
  //   Animated.loop(
  //     Animated.sequence([
  //       Animated.timing(valueY, {
  //         toValue: 5,
  //         duration: 2000,
  //         useNativeDriver: true,
  //       }),
  //       Animated.timing(valueY, {
  //         toValue: 0,
  //         duration: 2000,
  //         useNativeDriver: true,
  //       }),
  //     ]),
  //   ).start();
  //   Animated.loop(
  //     Animated.sequence([
  //       Animated.timing(valueY2, {
  //         toValue: 0,
  //         duration: 2000,
  //         useNativeDriver: true,
  //       }),
  //       Animated.timing(valueY2, {
  //         toValue: 5,
  //         duration: 2000,
  //         useNativeDriver: true,
  //       }),
  //     ]),
  //   ).start();
  // }, []);

  return (
    <ScrollView style={{flex: 1, backgroundColor: '#fff'}} contentContainerStyle={{paddingBottom: 600}}>
      <View style={styles.container}>
        {circles?.length != 0 ? (
          <View style={{backgroundColor: '#f8e9ff'}}>
            <Text
              style={[
                styles.body,
                {
                  lineHeight: 25,
                  textAlign: 'center',
                  color: '#000',
                  paddingLeft: 30,
                  paddingRight: 30,
                  marginTop: 20,
                  marginLeft: 30,
                  marginRight: 30,
                  marginBottom: 20,
                },
              ]}>
              You can start contributing in ajo circles!
            </Text>
          </View>
        ) : (
          <></>
        )}
        {displayCircles ? (
          <>
            <View style={{}}>
              {circles?.length != 0 ? (
                <>
                  <View style={{backgroundColor: '#f8e9ff'}}>
                    <TouchableOpacity
                      onPress={() => {
                        navigation.navigate('CreateCircle');
                      }}
                      activeOpacity={0.89}
                      style={{
                        backgroundColor: '#E2A8FE',
                        height: 45,
                        borderRadius: 3,
                        margin: 15,
                        marginBottom: 30,

                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <Text style={[styles.body, {color: '#02000a'}]}>
                        Create a circle
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <View style={{marginTop: 30}}></View>
                  
                    {circles?.map((circle: ICircle) => {
                      return (
                        <View
                          key={circle._id}
                          style={[
                            styles.container,
                            {
                              padding: 5,
                              marginLeft: 9,
                              marginRight: 9,
                            },
                          ]}>
                          <Sphere
                            title={circle.circlename}
                            id={circle._id}
                            circle={circle}
                          />
                        </View>
                      );
                    })}
                
                </>
              ) : (
                <>
                  <View style={{backgroundColor: '#f8e9ff'}}>
                    <Text
                      style={[
                        styles.body,
                        {
                          lineHeight: 25,
                          textAlign: 'center',
                          color: '#000',

                          paddingLeft: 25,
                          paddingRight: 25,
                          marginTop: 30,
                          marginBottom: 30,
                        },
                      ]}>
                      It looks lonely in here, you can create your own circle or
                      ask your friends to invite you into theirs!
                    </Text>

                    <TouchableOpacity
                      onPress={() => {
                        navigation.navigate('CreateCircle');
                      }}
                      activeOpacity={0.89}
                      style={{
                        backgroundColor: '#E2A8FE',
                        height: 45,
                        borderRadius: 3,
                        margin: 20,
                        marginBottom: 30,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <Text style={[styles.body, {color: '#02000a'}]}>
                        Create a circle
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <View
                    style={{
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <Image
                      source={require('../../assets/images/empty.png')}
                      resizeMode="contain"
                      style={{height: '68%'}}
                    />
                  </View>
                </>
              )}
            </View>
          </>
        ) : (
          <View
            style={{
              marginTop: 50,
            }}>
            <ActivityIndicator color={'#000'} size={'large'} />
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default Circles;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 0,
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
    color: 'white',
  },
});
