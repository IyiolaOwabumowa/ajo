import React, {useEffect} from 'react';
import {enableScreens} from 'react-native-screens';
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
  Image,
  Alert,
  Linking,
  Platform,
} from 'react-native';
import {
  DarkTheme,
  NavigationContainer,
  useFocusEffect,
  useIsFocused,
  useNavigation,
} from '@react-navigation/native';
import {
  createStackNavigator,
  StackNavigationProp,
} from '@react-navigation/stack';
import {Provider, useDispatch, useSelector} from 'react-redux';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import SplashScreen from 'react-native-splash-screen';
import CreateAccount from './screens/auth/CreateAccount';
import SplashOptions from './screens/auth/SplashOptions';
import {StackParamList, Props} from './types';
import Login from './screens/auth/Login';
import ForgotPassword from './screens/auth/ForgotPassword';
import Dashboard from './screens/dashboard/Dashboard';
import CreateCircle from './screens/circle/CreateCircle';
import Circles from './screens/circle/Circles';
import BottomBar from './screens/BottomBar';
import CircleDashboard from './screens/circle/CircleDashboard';
import CircleSettings from './screens/settings/CircleSettings';
import ViewMembers from './screens/members/ViewMembers';
import InviteMembers from './screens/members/InviteMembers';
import EditCircle from './screens/circle/EditCircle';
import WalletDashboard from './screens/wallet/WalletDashboard';
import AddCard from './screens/wallet/AddCard';
import Withdraw from './screens/wallet/Withdraw';
import Notifications from './screens/notifications/Notifications';
import Transactions from './screens/dashboard/Transactions';
import Settings from './screens/settings/Settings';
import PersonalInformation from './screens/settings/PersonalInformation';
import NotificationSettings from './screens/settings/NotificationSettings';
import ChangePassword from './screens/settings/ChangePassword';
import TermsandConditions from './screens/settings/TermsandConditions';
import PrivacyPolicy from './screens/settings/PrivacyPolicy';
import BankAccount from './screens/settings/BankAccount';
import {store} from './store';
import {authActions} from './src/actions/auth.actions';
import {RootState} from './src/reducers';
import {userActions} from './src/actions/user.actions';
import {walletActions} from './src/actions/wallet.actions';
import {circleActions} from './src/actions/circle.actions';
import Debtors from './screens/circle/Debtors';
import FundedMembers from './screens/circle/FundedMembers';
import Config from 'react-native-config';
import RNPaystack from 'react-native-paystack';
import messaging, {firebase} from '@react-native-firebase/messaging';
import axios from 'axios';
import linking from './src/utils/linking';
import ResetPassword from './screens/auth/ResetPassword';

const AppWrapper = () => {
  RNPaystack.init({publicKey: Config.PAYSTACK_PUBLIC});
  const Stack = createStackNavigator();
  const dispatch = useDispatch();
  const token = useSelector(state => state.authReducer.token);
  const onboarding = useSelector(state => state.authReducer.onboarding);
  const firstname = useSelector(
    (state: RootState) => state.userReducer.profile?.firstname,
  );
  const _id = useSelector((state: RootState) => state.authReducer.userId);
  const profile = useSelector((state: RootState) => state.userReducer.profile);
  const wallet = useSelector((state: RootState) => state.walletReducer.wallet);
  const active = useSelector((state: RootState) => state.circleReducer.active);
  var fcmUnsubscribe: () => void;

  // const CircleStack = createStackNavigator<CircleStackParamsList>();
  const Tab = createBottomTabNavigator();

  // const app = firebase.initializeApp({
  //   appId: '1:880775330381:ios:23764b7f92f24dc2b5fa04',
  //   projectId: 'ajo-f1b9b',
  //   authDomain: 'ajo-f1b9b.firebaseapp.com',
  //   apiKey: 'AIzaSyBkqwjauHsURSJJou5oxcbArPYR0HjB0q0',
  //   messagingSenderId: '880775330381',
  //   databaseURL: 'https://ajo-f1b9b.firebaseio.com', // Realtime Database

  //   storageBucket: 'ajo-f1b9b.appspot.com',
  // });
  // //const analytics = getAnalytics(app);

  // const auth = firebase.auth();
  // const db = firebase.firestore();

  if (!firebase.apps.length) {
    firebase.initializeApp({
      appId: '1:880775330381:ios:23764b7f92f24dc2b5fa04',
      projectId: 'ajo-f1b9b',
      authDomain: 'ajo-f1b9b.firebaseapp.com',
      apiKey: 'AIzaSyBkqwjauHsURSJJou5oxcbArPYR0HjB0q0',
      messagingSenderId: '880775330381',
      databaseURL: 'https://ajo-f1b9b.firebaseio.com', // Realtime Database

      storageBucket: 'ajo-f1b9b.appspot.com',
    });
  }

  React.useEffect(() => {
    if (Platform.OS === 'ios') {
      enableScreens(false);
    }
  }, []);
  useEffect(() => {
    if (token) {
      const registerToken = (tkn: any) => {
        axios
          .post(
            `${Config.API_URL}/api/users/token`,
            {token: tkn},
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          )
          .then(res => {
            console.log('Successfully registered token');
          })
          .catch(error => {});
      };

      messaging()
        .requestPermission()
        .then(authStatus => {
          if (
            authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
            authStatus === messaging.AuthorizationStatus.PROVISIONAL
          ) {
            messaging()
              .getToken()
              .then(token => {
                registerToken(token);

                messaging().onTokenRefresh(token => {
                  registerToken(token);
                });

                fcmUnsubscribe = messaging().onMessage(
                  async (remoteMessage: any) => {
                    console.log('A new message just arrived', remoteMessage);
                    Alert.alert(
                      remoteMessage.notification.title,
                      remoteMessage.notification.body,
                    );
                  },
                );
                messaging().onNotificationOpenedApp(remoteMessage => {
                  // console.log(
                  //   "Notification caused app to open from background",
                  //   remoteMessage
                  // );
                });

                messaging()
                  .getInitialNotification()
                  .then(remoteMessage => {
                    if (remoteMessage) {
                      // console.log(
                      //   "Notification caused app to open from quit state"
                      // );
                    }
                  });
              });
          }
        })
        .catch(err => {
          // console.log("Message request permission error", err);
        });
    }
  }, [token]);

  useEffect(() => {
    setTimeout(() => {
      SplashScreen.hide();
    }, 3000);
  }, []);

  useEffect(() => {
    dispatch(authActions.getUserToken());
    dispatch(authActions.getOnBoarding());
    dispatch(authActions.getId());
  }, []);

  useEffect(() => {
    if (token && _id) {
      dispatch(userActions.getProfile(_id, token));
    }
  }, [token, _id]);

  useEffect(() => {
    if (profile) {
      dispatch(circleActions.generateCircles(token, profile.circles));
    }
  }, [profile != null]);

  useEffect(() => {
    if (profile && Object.keys(wallet).length === 0) {
      dispatch(walletActions.getWallet(profile.walletId, token));
    }
  }, [profile != null, wallet]);

  useEffect(() => {
    const acceptInvite = async (
      tkn: string,
      circleId: string,
      userId: string,
    ) => {
      await axios
        .get(`${Config.API_URL}/api/invite/${circleId}/${userId}`, {
          headers: {
            Authorization: `Bearer ${tkn}`,
            'Cache-Control': 'no-cache',
          },
        })
        .then(response => {
          console.log(response);

          Alert.alert(
            `Circle joined successfully`,
            `You now have access to ${response.data.message.circle.circlename} circle`,
          );
        })
        .catch(function (error) {
          console.log(error);
          Alert.alert(
            `We couldn't add you`,
            `${error.response.data.message.body}`,
          );
        });
    };
    const handleOpenURL = (e: any) => {
      console.log(e.url);
      const route = e.url.replace(/.*?:\/\//g, '');
      // const id = route.match(/\/([^\/]+)\/?$/)[1];
      const routeName = route.split('/')[1];
      // do something with the url, in our case navigate(route)
      console.log(routeName);
      if (routeName == 'invite') {
        const tkn = route.split('/')[2];
        const circleId = route.split('/')[3];
        const userId = route.split('/')[4];
        acceptInvite(tkn, circleId, userId);
        // if (onboarding) {
        //   Alert.alert(
        //     'Unable to accept invite',
        //     'You need to complete the onboarding process before you can accept this invite',
        //   );
        // }
      }
    };

    if (Platform.OS === 'android') {
      Linking.getInitialURL().then(url => {});
    } else {
      Linking.addEventListener('url', handleOpenURL);
    }
  }, []);

  const OnBoardingScreen = () => {
    return (
      <Stack.Navigator>
        <Stack.Screen
          name="StepTwo"
          component={PersonalInformation}
          options={{
            headerStyle: {
              backgroundColor: '#f8e9ff',
              shadowColor: '#f8e9ff',
            },
            headerBackTitleStyle: {
              color: '#000',
            },
            headerTitleStyle: {
              color: '#000',
            },
            headerTintColor: '#000',
            headerBackTitle: 'Back',
            headerTitle:"Getting to know you",
            headerRight: () => {
              return (
                <TouchableOpacity
                  onPress={() => {
                    dispatch(authActions.deleteUserToken());
                    dispatch({type: 'DELETE_PROFILE'});
                  }}
                  style={{
                    // width: '100%',
                    // height: '100%',
                    marginRight: 30,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text style={{color: 'black', fontSize: 16}}>Logout</Text>
                </TouchableOpacity>
              );
            },
          }}
        />
        <Stack.Screen
          name="StepThree"
          component={BankAccount}
          options={{
            headerStyle: {
              backgroundColor: '#f8e9ff',
              shadowColor: '#f8e9ff',
            },
            headerBackTitleStyle: {
              color: '#000',
            },
            headerTitleStyle: {
              color: '#000',
            },
            headerTintColor: '#000',
            headerBackTitle: 'Back',
            headerTitle:'How to pay you',
            headerRight: () => {
              return (
                <TouchableOpacity
                  onPress={() => {
                    dispatch(authActions.deleteUserToken());
                    dispatch({type: 'DELETE_PROFILE'});
                  }}
                  style={{
                    // width: '100%',
                    // height: '100%',
                    marginRight: 30,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text style={{color: 'black', fontSize: 16}}>Logout</Text>
                </TouchableOpacity>
              );
            },
          }}
        />
        <Stack.Screen
          name="StepFour"
          component={AddCard}
          options={{
            headerStyle: {
              backgroundColor: '#f8e9ff',
              shadowColor: '#f8e9ff',
            },
            headerBackTitleStyle: {
              color: '#000',
            },
            headerTitleStyle: {
              color: '#000',
            },
            headerTintColor: '#000',
            headerBackTitle: 'Back',
            headerTitle:"How to charge you",
            headerRight: () => {
              return (
                <TouchableOpacity
                  onPress={() => {
                    dispatch(authActions.deleteUserToken());
                    dispatch({type: 'DELETE_PROFILE'});
                  }}
                  style={{
                    // width: '100%',
                    // height: '100%',
                    marginRight: 30,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text style={{color: 'black', fontSize: 16}}>Logout</Text>
                </TouchableOpacity>
              );
            },
          }}
        />
      </Stack.Navigator>
    );
  };

  const AuthScreen = () => {
    return (
      <Stack.Navigator mode="modal">
        <Stack.Screen
          name="SplashOptions"
          component={SplashOptions}
          options={{headerShown: false, headerTitle: 'Back'}}
        />
        <Stack.Screen
          name="CreateAccount"
          component={CreateAccount}
          options={{
            headerStyle: {
              backgroundColor: '#f8e9ff',
              shadowColor: '#f8e9ff',
            },
            headerBackTitleStyle: {
              color: '#000',
            },
            headerTitleStyle: {
              color: '#000',
            },
            headerTintColor: '#000',
            headerBackTitle: 'Back',
            headerTitle: 'Create an Account',
          }}
        />
        <Stack.Screen
          name="Login"
          component={Login}
          options={{
            headerStyle: {
              backgroundColor: '#f8e9ff',
              shadowColor: '#f8e9ff',
            },
            headerBackTitleStyle: {
              color: '#000',
            },
            headerTitleStyle: {
              color: '#000',
            },
            headerTitle: 'Login',
            headerTintColor: '#000',
            headerBackTitle: 'Back',
          }}
        />
        <Stack.Screen
          name="ForgotPassword"
          component={ForgotPassword}
          options={{
            headerStyle: {
              backgroundColor: '#f8e9ff',
              shadowColor: '#f8e9ff',
            },
            headerBackTitleStyle: {
              color: '#000',
            },
            headerTitleStyle: {
              color: '#000',
            },
            headerTitle:'Reset Password',
            headerTintColor: '#000',
            headerBackTitle: 'Back',
          }}
        />
        <Stack.Screen
          name="ResetPassword"
          component={ResetPassword}
          options={{
            headerStyle: {
              backgroundColor: '#0a0612',
              shadowColor: '#0a0612',
            },
            headerBackTitleStyle: {
              color: '#fff',
            },
            headerTitleStyle: {
              color: '#fff',
            },
            headerTintColor: '#fff',
            headerTitle: 'Enter your new password',
          }}
        />
      </Stack.Navigator>
    );
  };

  const HomeScreen = () => {
    return (
      <Stack.Navigator mode="modal">
        <Stack.Screen
          name="Dashboard"
          component={Dashboard}
          options={{
            headerStyle: {
              backgroundColor: '#f8e9ff',
              shadowColor: '#f8e9ff',
            },
            headerBackTitleStyle: {
              color: '#000',
            },
            headerTitleStyle: {
              color: '#000',
            },
            headerTintColor: '#000',
            headerBackTitle: 'Back',
            headerLeft: () => {
              return (
                <TouchableOpacity style={{marginLeft: 30}}>
                  <Image
                    source={require('./assets/images/logo.png')}
                    resizeMode="contain"
                    style={{width: 50, height: '100%'}}
                  />
                </TouchableOpacity>
              );
            },
            headerRight: () => {
              return (
                <TouchableOpacity style={{marginRight: 30}}>
                  <Text style={styles.body}>Hi {firstname}</Text>
                </TouchableOpacity>
              );
            },
            headerTitle: '',
          }}
        />
        <Stack.Screen
          name="Transactions"
          component={Transactions}
          options={{
            headerStyle: {
              backgroundColor: '#f8e9ff',
              shadowColor: '#f8e9ff',
            },
            headerBackTitleStyle: {
              color: '#000',
            },
            headerTitleStyle: {
              color: '#000',
            },
            headerTintColor: '#000',
            headerBackTitle: 'Back',
            headerTitle: () => {
              return <Text style={styles.body}>Transactions</Text>;
            },
          }}
        />
        <Stack.Screen
          name="WalletDashboard"
          component={WalletDashboard}
          options={{
            animationEnabled: false,
            gestureEnabled: false,
            headerStyle: {
              backgroundColor: '#0a0612',
              shadowColor: '#0a0612',
            },
            headerBackTitleStyle: {
              color: '#fff',
            },
            headerTitleStyle: {
              color: '#fff',
            },
            headerTintColor: '#fff',
            headerTitle: () => {
              return <Text style={styles.body}>My Wallet</Text>;
            },
          }}
        />
        <Stack.Screen
          name="AddCard"
          component={AddCard}
          options={{
            headerStyle: {
              backgroundColor: '#f8e9ff',
              shadowColor: '#f8e9ff',
            },
            headerBackTitleStyle: {
              color: '#000',
            },
            headerTitleStyle: {
              color: '#000',
            },
            headerTintColor: '#000',
            headerBackTitle: 'Back',
            headerTitle: () => {
              return <Text style={styles.body}>Card Details</Text>;
            },
          }}
        />
        <Stack.Screen
          name="BankAccount"
          component={BankAccount}
          options={{
            headerStyle: {
              backgroundColor: '#f8e9ff',
              shadowColor: '#f8e9ff',
            },
            headerBackTitleStyle: {
              color: '#000',
            },
            headerTitleStyle: {
              color: '#000',
            },
            headerTintColor: '#000',
            headerBackTitle: 'Back',
            headerTitle: () => {
              return <Text style={styles.body}>{'Bank Account'}</Text>;
            },
          }}
        />
      </Stack.Navigator>
    );
  };

  const CircleScreen = () => {
    const navigation = useNavigation();

    return (
      <Stack.Navigator>
        <Stack.Screen
          name="Circles"
          component={Circles}
          options={{
            headerStyle: {
              backgroundColor: '#f8e9ff',
              shadowColor: '#f8e9ff',
            },
            headerBackTitleStyle: {
              color: '#000',
            },
            headerTitleStyle: {
              color: '#000',
            },
            headerTintColor: '#000',
            headerBackTitle: 'Back',

            headerTitle: () => {
              return <Text style={styles.body}>My Circles</Text>;
            },
            // headerRight: () => {
            //   return (
            //     <TouchableOpacity
            //       onPress={() => {
            //         navigation.navigate('CreateCircle');
            //       }}
            //       style={{
            //         marginRight: 10,
            //         // backgroundColor: '#598E76',
            //         padding: 10,
            //         borderRadius: 3,
            //         justifyContent: 'center',
            //         alignItems: 'center',
            //       }}>
            //       <Text style={[styles.body, {}]}>Create</Text>
            //     </TouchableOpacity>
            //   );
            // },
          }}
        />
        <Stack.Screen
          name="Debtors"
          component={Debtors}
          options={{
            animationEnabled: false,
            gestureEnabled: false,
            headerStyle: {
              backgroundColor: '#0a0612',
              shadowColor: '#0a0612',
            },
            headerBackTitleStyle: {
              color: '#fff',
            },
            headerTitleStyle: {
              color: '#fff',
            },
            headerTintColor: '#fff',
            headerBackTitle: 'Back',
            headerTitle: () => {
              return <Text style={styles.body}>Debtors List</Text>;
            },
          }}
        />
        <Stack.Screen
          name="FundedMembers"
          component={FundedMembers}
          options={{
            animationEnabled: false,
            gestureEnabled: false,
            headerStyle: {
              backgroundColor: '#0a0612',
              shadowColor: '#0a0612',
            },
            headerBackTitleStyle: {
              color: '#fff',
            },
            headerTitleStyle: {
              color: '#fff',
            },
            headerTintColor: '#fff',
            headerBackTitle: 'Back',
            headerTitle: () => {
              return <Text style={styles.body}>Who has been funded?</Text>;
            },
          }}
        />
        <Stack.Screen
          name="CreateCircle"
          component={CreateCircle}
          options={{
            headerStyle: {
              backgroundColor: '#f8e9ff',
              shadowColor: '#f8e9ff',
            },
            headerBackTitleStyle: {
              color: '#000',
            },
            headerTitleStyle: {
              color: '#000',
            },
            headerTintColor: '#000',
            headerBackTitle: 'Back',

            headerTitle: () => {
              return <Text style={styles.body}>Create a Circle</Text>;
            },
          }}
        />
        <Stack.Screen
          name="CircleDashboard"
          component={CircleDashboard}
          options={({route}) => ({
            gestureEnabled: false,
            headerStyle: {
              backgroundColor: '#f8e9ff',
              shadowColor: '#f8e9ff',
            },
            headerBackTitleStyle: {
              color: '#000',
            },
            headerTitleStyle: {
              color: '#000',
            },
            headerTintColor: '#000',
            headerBackTitle: 'Back',

            headerTitle: () => {
              return (
                <Text style={styles.body}>
                  {active ? active.circlename : ''}
                </Text>
              );
            },
            headerRight: () => {
              return (
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('CircleSettings');
                  }}
                  style={{
                    // width: '100%',
                    // height: '100%',
                    marginRight: 30,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Image
                    source={require('./assets/images/settings.png')}
                    style={{
                      width: 25,
                      height: 25,
                    }}
                  />
                </TouchableOpacity>
              );
            },
          })}
        />
        <Stack.Screen
          name="CircleSettings"
          component={CircleSettings}
          options={({route}) => ({
            headerStyle: {
              backgroundColor: '#f8e9ff',
              shadowColor: '#f8e9ff',
            },
            headerBackTitleStyle: {
              color: '#000',
            },
            headerTitleStyle: {
              color: '#000',
            },
            headerTintColor: '#000',
            headerBackTitle: 'Back',

            headerTitle: () => {
              return <Text style={styles.body}>Circle Settings</Text>;
            },
          })}
        />
        <Stack.Screen
          name="ViewMembers"
          component={ViewMembers}
          options={({route}) => ({
            headerStyle: {
              backgroundColor: '#f8e9ff',
              shadowColor: '#f8e9ff',
            },
            headerBackTitleStyle: {
              color: '#000',
            },
            headerTitleStyle: {
              color: '#000',
            },
            headerTintColor: '#000',
            headerBackTitle: 'Back',

            headerTitle: () => {
              return (
                <Text style={[styles.body, {textAlign: 'center'}]}>
                  Members
                </Text>
              );
            },
          })}
        />
        <Stack.Screen
          name="InviteMembers"
          component={InviteMembers}
          options={({route}) => ({
            headerStyle: {
              backgroundColor: '#f8e9ff',
              shadowColor: '#f8e9ff',
            },
            headerBackTitleStyle: {
              color: '#000',
            },
            headerTitleStyle: {
              color: '#000',
            },
            headerTintColor: '#000',
            headerBackTitle: 'Back',

            headerTitle: () => {
              return (
                <Text style={[styles.body, {textAlign: 'center'}]}>
                  Invite to {active.circlename}
                </Text>
              );
            },
          })}
        />
        <Stack.Screen
          name="EditCircle"
          component={EditCircle}
          options={({route}) => ({
            headerStyle: {
              backgroundColor: '#f8e9ff',
              shadowColor: '#f8e9ff',
            },
            headerBackTitleStyle: {
              color: '#000',
            },
            headerTitleStyle: {
              color: '#000',
            },
            headerTintColor: '#000',
            headerBackTitle: 'Back',

            headerTitle: () => {
              return (
                <Text style={[styles.body, {textAlign: 'center'}]}>
                  Edit {active?.circlename}
                </Text>
              );
            },
          })}
        />
      </Stack.Navigator>
    );
  };

  const NotificationsScreen = () => {
    const navigation = useNavigation();

    return (
      <Stack.Navigator mode="modal">
        <Stack.Screen
          name="Notifications"
          component={Notifications}
          options={{
            headerStyle: {
              backgroundColor: '#f8e9ff',
              shadowColor: '#f8e9ff',
            },
            headerBackTitleStyle: {
              color: '#000',
            },
            headerTitleStyle: {
              color: '#000',
            },
            headerTintColor: '#000',
            headerBackTitle: 'Back',

            headerTitle: () => {
              return <Text style={styles.body}>Agogo</Text>;
            },
          }}
        />
      </Stack.Navigator>
    );
  };

  const SettingsScreen = () => {
    const navigation = useNavigation();

    return (
      <Stack.Navigator mode="modal">
        <Stack.Screen
          name="Settings"
          component={Settings}
          options={{
            headerStyle: {
              backgroundColor: '#f8e9ff',
              shadowColor: '#f8e9ff',
            },
            headerBackTitleStyle: {
              color: '#000',
            },
            headerTitleStyle: {
              color: '#000',
            },
            headerTintColor: '#000',
            headerBackTitle: 'Back',
            headerTitle: () => {
              return <Text style={styles.body}>Settings</Text>;
            },
          }}
        />
        <Stack.Screen
          name="PersonalInformation"
          component={PersonalInformation}
          options={{
            headerStyle: {
              backgroundColor: '#f8e9ff',
              shadowColor: '#f8e9ff',
            },
            headerBackTitleStyle: {
              color: '#000',
            },
            headerTitleStyle: {
              color: '#000',
            },
            headerTintColor: '#000',
            headerBackTitle: 'Back',

            headerTitle: () => {
              return <Text style={styles.body}>Personal</Text>;
            },
          }}
        />
        <Stack.Screen
          name="NotificationSettings"
          component={NotificationSettings}
          options={{
            headerStyle: {
              backgroundColor: '#f8e9ff',
              shadowColor: '#f8e9ff',
            },
            headerBackTitleStyle: {
              color: '#000',
            },
            headerTitleStyle: {
              color: '#000',
            },
            headerTintColor: '#000',
            headerBackTitle: 'Back',
            headerTitle: () => {
              return <Text style={styles.body}>Notification Settings</Text>;
            },
          }}
        />
        <Stack.Screen
          name="ChangePassword"
          component={ChangePassword}
          options={{
            headerStyle: {
              backgroundColor: '#f8e9ff',
              shadowColor: '#f8e9ff',
            },
            headerBackTitleStyle: {
              color: '#000',
            },
            headerTitleStyle: {
              color: '#000',
            },
            headerTintColor: '#000',
            headerBackTitle: 'Back',
            headerTitle: () => {
              return <Text style={styles.body}>Change Password</Text>;
            },
          }}
        />
        <Stack.Screen
          name="TermsandConditions"
          component={TermsandConditions}
          options={{
            headerStyle: {
              backgroundColor: '#f8e9ff',
              shadowColor: '#f8e9ff',
            },
            headerBackTitleStyle: {
              color: '#000',
            },
            headerTitleStyle: {
              color: '#000',
            },
            headerTintColor: '#000',
            headerBackTitle: 'Back',
            headerTitle: () => {
              return <Text style={styles.body}>{'Terms & Conditions'}</Text>;
            },
          }}
        />
        <Stack.Screen
          name="PrivacyPolicy"
          component={PrivacyPolicy}
          options={{
            headerStyle: {
              backgroundColor: '#f8e9ff',
              shadowColor: '#f8e9ff',
            },
            headerBackTitleStyle: {
              color: '#000',
            },
            headerTitleStyle: {
              color: '#000',
            },
            headerTintColor: '#000',
            headerBackTitle: 'Back',
            headerTitle: () => {
              return <Text style={styles.body}>{'Privacy Policy'}</Text>;
            },
          }}
        />

        <Stack.Screen
          name="AddCardSettings"
          component={AddCard}
          options={{
            headerStyle: {
              backgroundColor: '#f8e9ff',
              shadowColor: '#f8e9ff',
            },
            headerBackTitleStyle: {
              color: '#000',
            },
            headerTitleStyle: {
              color: '#000',
            },
            headerTintColor: '#000',
            headerBackTitle: 'Back',
            headerTitle: () => {
              return <Text style={styles.body}>Card Details</Text>;
            },
          }}
        />
        <Stack.Screen
          name="BankAccountSettings"
          component={BankAccount}
          options={{
            headerStyle: {
              backgroundColor: '#f8e9ff',
              shadowColor: '#f8e9ff',
            },
            headerBackTitleStyle: {
              color: '#000',
            },
            headerTitleStyle: {
              color: '#000',
            },
            headerTintColor: '#000',
            headerBackTitle: 'Back',

            headerTitle: () => {
              return <Text style={styles.body}>{'Bank Account'}</Text>;
            },
          }}
        />
      </Stack.Navigator>
    );
  };

  return (
    <View style={{flex: 1, backgroundColor: '#0a0612'}}>
      <NavigationContainer theme={DarkTheme} linking={linking}>
        <Tab.Navigator
          tabBarOptions={{
            activeTintColor: '#000',
            showLabel: true,
            // inactiveTintColor: 'lightgray',
            activeBackgroundColor: '#E2A8FE50',

            tabStyle: {
              paddingBottom: 1,
              paddingTop: 0,
              marginBottom: 20,
              marginLeft:20,
              marginRight: 20,
              borderRadius: 5,
            },
            // inactiveBackgroundColor: '#b55031',
            labelStyle: {
              fontSize: 13,
              color: '#000',
              marginBottom: 10,
            },
            style: {
              backgroundColor: '#fff',
              borderTopColor: '#ffffff00',
              paddingTop: 8,
              paddingBottom: 0,
              height: 90,
            },
          }}>
          {!profile == true ? (
            <Tab.Screen
              name="Splash"
              component={AuthScreen}
              options={{tabBarVisible: false}}
            />
          ) : (
            <>
              {onboarding ? (
                <Tab.Screen
                  name="OnBoardingScreen"
                  component={OnBoardingScreen}
                  options={{
                    tabBarVisible: false,
                  }}
                />
              ) : (
                <Tab.Screen
                  name="Home"
                  component={HomeScreen}
                  options={{
                    tabBarIcon: ({focused}) => {
                      if (focused) {
                        return (
                          <Image
                            source={require('./assets/images/home.png')}
                            resizeMode="contain"
                            style={{width: '100%', height: '60%'}}
                          />
                        );
                      }
                      return (
                        <Image
                          source={require('./assets/images/home.png')}
                          resizeMode="contain"
                          style={{width: '100%', height: '60%'}}
                        />
                      );
                    },
                  }}
                />
              )}

              <Tab.Screen
                name="Circles"
                component={CircleScreen}
                options={{
                  tabBarIcon: () => {
                    return (
                      <Image
                        source={require('./assets/images/circle.png')}
                        resizeMode="contain"
                        style={{width: '100%', height: '60%'}}
                      />
                    );
                  },
                }}
              />
              <Tab.Screen
                name="Agogo"
                component={NotificationsScreen}
                options={{
                  tabBarBadge: 4,
                  tabBarIcon: () => {
                    return (
                      <Image
                        source={require('./assets/images/notification.png')}
                        resizeMode="contain"
                        style={{width: '100%', height: '60%'}}
                      />
                    );
                  },
                }}
              />
              <Tab.Screen
                name="Settings"
                component={SettingsScreen}
                options={{
                  tabBarIcon: () => {
                    return (
                      <Image
                        source={require('./assets/images/settings.png')}
                        resizeMode="contain"
                        style={{width: '100%', height: '60%'}}
                      />
                    );
                  },
                }}
              />
            </>
          )}
        </Tab.Navigator>
      </NavigationContainer>
    </View>
  );
};

const App = () => {
  return (
    <Provider store={store}>
      <AppWrapper />
    </Provider>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#1C1C1C',
  },
  header: {
    fontFamily: 'Axiforma-Heavy',
    fontSize: 29,
    color: 'white',
  },
  body: {
    fontFamily: 'Axiforma-Medium',
    fontSize: 15,
    color: '#000',
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

export default App;
