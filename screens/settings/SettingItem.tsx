import {useNavigation} from '@react-navigation/native';
import axios from 'axios';
import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  ImageBackground,
  Text,
  Alert,
  TextInput,
  useColorScheme,
  View,
  Switch,
  Button,
  TouchableOpacity,
  TouchableHighlight,
  Image,
  ActivityIndicator,
} from 'react-native';
import Config from 'react-native-config';
import {useDispatch, useSelector} from 'react-redux';
import {authActions} from '../../src/actions/auth.actions';
import {userActions} from '../../src/actions/user.actions';
import {RootState} from '../../src/reducers';
import {Props, SettingItemProps} from '../../types';

const SettingItem = ({
  title,
  toggle,
  next,
  deletable,
  member,
  deactivated,
  action,
  paused,
  circle,
  owner,
  params,
  debtors,
}: SettingItemProps) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const token = useSelector(state => state.authReducer.token);
  const _id = useSelector((state: RootState) => state.authReducer.userId);
  const profile = useSelector((state: RootState) => state.userReducer.profile);
  const requesting = useSelector(
    (state: RootState) => state.userReducer.requesting,
  );
  const active = useSelector((state: RootState) => state.circleReducer.active);

  const [isEnabled, setIsEnabled] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [p, setP] = useState<object>({});

  useEffect(() => {
    if (params) {
      setP(params);
    }
  }, [params]);

  useEffect(() => {
    setIsEnabled(toggle);
  }, []);

  const deleteCircle = (_id: any, token: any) => {
    setIsLoading(true);
    return axios
      .delete(`${Config.API_URL}/api/circles/${_id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(response => {
        setIsLoading(false);
        Alert.alert(`${response.data.message.body}`, '', [
          {
            text: 'Go Back',
            onPress: () => {
              
              navigation.navigate('Circles');
            },
          },
        ]);
      })
      .catch(function (error) {
        setIsLoading(false);
        Alert.alert(`An error occured, please try again later`, '', [
          {
            text: 'Go Back',
            onPress: () => {
              navigation.navigate('Circles');
            },
          },
        ]);
        if (error.response) {
          const errorObject = {
            status: error.response.status,
            error: error.response,
          };
          return errorObject;
        }
      });
  };

  const leaveCircle = (_id: any, token: any) => {
    return axios
      .get(`${Config.API_URL}/api/circles/leave/${_id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(response => {
        Alert.alert(`${response.data.message.body}`, '', [
          {
            text: 'Go Back',
            onPress: () => {
              navigation.navigate('Circles');
            },
          },
        ]);
        // dispatch(userActions.getProfile(profile._id, token));
      })
      .catch(function (error) {
        if (error.response) {
          const errorObject = {
            status: error.response.status,
            error: error.response,
          };
          return errorObject;
        }
      });
  };
  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => {
          console.log(owner, title);
          if (title == 'Logout') {
            dispatch(authActions.deleteUserToken());
            dispatch({type: 'DELETE_PROFILE'});
          } else if (toggle) {
            setIsEnabled(!isEnabled);
            // `${p ? ',' + {...p} : null}`
          } else if (member && owner) {
            if (!debtors) {
              Alert.alert(`What do you want to do to ${title}?`, '', [
                {
                  text: deactivated
                    ? 'Activate this member'
                    : 'Deactivate from circle',

                  onPress: () => {
                    if (action) {
                      action(member._id, circle._id, title);
                    }
                  },
                },

                {
                  text: 'Cancel',
                  onPress: () => {},
                  style: 'cancel',
                },
              ]);
            }
          } else if (member && !owner) {
            //do nothing
          } else if (owner == true && title == 'Delete Circle') {
            deleteCircle(active._id, token);
          } else if (owner == false && title == 'Leave Circle') {
            leaveCircle(active._id, token);
          }

          // else if(next == "Fund"){
          //   Alert.alert(`How do you want to fund your wallet?`, '', [
          //     {
          //       text: 'Bank Account (OTP)',

          //       onPress: () => {
          //         //redirect to payment screen with bank account option

          //       },
          //     },
          //     {
          //       text: 'USSD',

          //       onPress: () => {
          //         //redirect to payment screen with USSD option
          //       },
          //     },

          //     {
          //       text: 'Cancel',
          //       onPress: () => {},
          //       style: 'cancel',
          //     },
          //   ]);
          // }
          else {
            navigation.navigate(`${next}`, params ? params : undefined);
          }
        }}
        activeOpacity={0.8}
        style={styles.highlighter}>
        {isLoading ? (
          <ActivityIndicator size={'small'} color={'white'} />
        ) : (
          <Text
            style={
              !deletable
                ? styles.body
                : paused
                ? [styles.body, {color: '#00000040'}]
                : [styles.body, {color: '#000'}]
            }>
            {title}
            {deactivated ? ' (Deactivated)' : ''}
          </Text>
        )}

        {toggle != null ? (
          <>
            <Switch
              trackColor={{false: 'red', true: '#E2A8FE'}}
              thumbColor={isEnabled ? '#ffffff' : '#f4f3f4'}
              ios_backgroundColor="#ffffff90"
              onValueChange={() => {
                if (title == 'Push Notifications') {
                  dispatch(
                    userActions.updateNotifications(_id, token, {
                      push: !isEnabled,
                      dnd: profile.settings.dnd,
                    }),
                  );
                } else {
                  dispatch(
                    userActions.updateNotifications(_id, token, {
                      push: profile.settings.push,
                      dnd: !isEnabled,
                    }),
                  );
                }
              }}
              value={isEnabled}
            />
          </>
        ) : (
          <>
            {title == 'Delete Circle' ? (
              <Image
                source={require('../../assets/images/forward-arrow.png')}
                resizeMode="contain"
                style={{
                  width: 20, height: '100%',
                  opacity: paused ? 1 : 0.9,
                }}
              />
            ) : (
              <Image
                source={require('../../assets/images/forward-arrow.png')}
                resizeMode="contain"
                style={{width: 20, height: '100%'}}
              />
            )}
          </>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default SettingItem;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginBottom: 10,
  },
  highlighter: {
    backgroundColor: '#E2A8FE40',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    marginRight: 20,
    marginLeft: 20,
    width: '95%',
    borderRadius: 5,
    height: 60,
  },

  transBar: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    backgroundColor: '#0A3C25',
    height: 50,
    marginTop: 20,
  },
  incomeBg: {
    padding: 5,
    height: 30,
    borderRadius: 4,
    marginBottom: 10,
    paddingLeft: 20,
    paddingRight: 20,
    backgroundColor: '#0A3C25',
    justifyContent: 'center',
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
    color: '#000',
  },
});
