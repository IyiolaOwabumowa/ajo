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
  Image,
} from 'react-native';
import {NavigationContainer, useNavigation} from '@react-navigation/native';
import {
  createStackNavigator,
  StackNavigationProp,
} from '@react-navigation/stack';
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
import Fund from './screens/wallet/Fund';
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

const App = () => {
  const Stack = createStackNavigator();

  // const CircleStack = createStackNavigator<CircleStackParamsList>();
  const Tab = createBottomTabNavigator();

  useEffect(() => {
    setTimeout(() => {
      SplashScreen.hide();
    }, 3000);
  }, []);

  const AuthScreen = () => {
    return (
      <Stack.Navigator>
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
              backgroundColor: '#1C1C1C',
              shadowColor: '#181818',
            },
            headerBackTitleStyle: {
              color: '#fff',
            },
            headerTitleStyle: {
              color: '#fff',
            },
            headerTintColor: '#fff',
            headerTitle: '',
          }}
        />
        <Stack.Screen
          name="Login"
          component={Login}
          options={{
            headerStyle: {
              backgroundColor: '#1C1C1C',
              shadowColor: '#181818',
            },
            headerBackTitleStyle: {
              color: '#fff',
            },
            headerTitleStyle: {
              color: '#fff',
            },
            headerTintColor: '#fff',
            headerTitle: '',
          }}
        />
        <Stack.Screen
          name="ForgotPassword"
          component={ForgotPassword}
          options={{
            headerStyle: {
              backgroundColor: '#1C1C1C',
              shadowColor: '#181818',
            },
            headerBackTitleStyle: {
              color: '#fff',
            },
            headerTitleStyle: {
              color: '#fff',
            },
            headerTintColor: '#fff',
            headerTitle: '',
          }}
        />
      </Stack.Navigator>
    );
  };

  const HomeScreen = () => {
    return (
      <Stack.Navigator>
        <Stack.Screen
          name="Dashboard"
          component={Dashboard}
          options={{
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
            headerStyle: {
              backgroundColor: '#1C1C1C',
              shadowColor: '#181818',
            },
            headerRight: () => {
              return (
                <TouchableOpacity style={{marginRight: 30}}>
                  <Text style={styles.body}>Hi, Iyiola</Text>
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
            animationEnabled: false,
            gestureEnabled: false,
            headerStyle: {
              backgroundColor: '#1C1C1C',
              shadowColor: '#181818',
            },
            headerBackTitleStyle: {
              color: '#fff',
            },
            headerTitleStyle: {
              color: '#fff',
            },
            headerTintColor: '#fff',
            headerTitle: () => {
              return <Text style={styles.body}>Transactions</Text>;
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
            animationEnabled: false,
            gestureEnabled: false,
            headerStyle: {
              backgroundColor: '#1C1C1C',
              shadowColor: '#181818',
            },
            headerBackTitleStyle: {
              color: '#fff',
            },
            headerTitleStyle: {
              color: '#fff',
            },
            headerTintColor: '#fff',
            headerTitle: () => {
              return <Text style={styles.body}>My Circles</Text>;
            },
            headerRight: () => {
              return (
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('CreateCircle');
                  }}
                  style={{
                    marginRight: 10,
                    // backgroundColor: '#598E76',
                    padding: 10,
                    borderRadius: 3,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text style={[styles.body, {}]}>Create</Text>
                </TouchableOpacity>
              );
            },
          }}
        />
        <Stack.Screen
          name="CreateCircle"
          component={CreateCircle}
          options={{
            animationEnabled: false,
            gestureEnabled: false,
            headerStyle: {
              backgroundColor: '#1C1C1C',
              shadowColor: '#181818',
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
              return <Text style={styles.body}>Create a Circle</Text>;
            },
            headerRight: () => {
              return (
                <TouchableOpacity style={{marginRight: 30}}>
                  <Text style={styles.body}>Save</Text>
                </TouchableOpacity>
              );
            },
          }}
        />
        <Stack.Screen
          name="CircleDashboard"
          component={CircleDashboard}
          options={({route}) => ({
            animationEnabled: false,
            gestureEnabled: false,
            headerStyle: {
              backgroundColor: '#1C1C1C',
              shadowColor: '#181818',
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
              return (
                <Text style={styles.body}>{route.params.headerTitle} </Text>
              );
            },
            headerRight: () => {
              return (
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('CircleSettings', {...route.params});
                  }}
                  style={{
                    // width: '100%',
                    // height: '100%',
                    marginRight: 10,
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
            animationEnabled: false,
            gestureEnabled: false,
            headerStyle: {
              backgroundColor: '#1C1C1C',
              shadowColor: '#181818',
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
              return <Text style={styles.body}>Circle Settings</Text>;
            },
          })}
        />
        <Stack.Screen
          name="ViewMembers"
          component={ViewMembers}
          options={({route}) => ({
            animationEnabled: false,
            gestureEnabled: false,
            headerStyle: {
              backgroundColor: '#1C1C1C',
              shadowColor: '#181818',
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
            animationEnabled: false,
            gestureEnabled: false,
            headerStyle: {
              backgroundColor: '#1C1C1C',
              shadowColor: '#181818',
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
              return (
                <Text style={[styles.body, {textAlign: 'center'}]}>
                  Invite to {route?.params.headerTitle}
                </Text>
              );
            },
          })}
        />
        <Stack.Screen
          name="EditCircle"
          component={EditCircle}
          options={({route}) => ({
            animationEnabled: false,
            gestureEnabled: false,
            headerStyle: {
              backgroundColor: '#1C1C1C',
              shadowColor: '#181818',
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
              return (
                <Text style={[styles.body, {textAlign: 'center'}]}>
                  {route?.params.headerTitle}
                </Text>
              );
            },
            headerRight: () => {
              return (
                <TouchableOpacity style={{marginRight: 30}}>
                  <Text style={styles.body}>Update</Text>
                </TouchableOpacity>
              );
            },
          })}
        />
      </Stack.Navigator>
    );
  };

  const WalletScreen = () => {
    const navigation = useNavigation();

    return (
      <Stack.Navigator>
        <Stack.Screen
          name="WalletDashboard"
          component={WalletDashboard}
          options={{
            animationEnabled: false,
            gestureEnabled: false,
            headerStyle: {
              backgroundColor: '#1C1C1C',
              shadowColor: '#181818',
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
          name="Fund"
          component={Fund}
          options={{
            animationEnabled: false,
            gestureEnabled: false,
            headerStyle: {
              backgroundColor: '#1C1C1C',
              shadowColor: '#181818',
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
              return <Text style={styles.body}>Fund Wallet</Text>;
            },
          }}
        />
        <Stack.Screen
          name="Withdraw"
          component={Withdraw}
          options={{
            animationEnabled: false,
            gestureEnabled: false,
            headerStyle: {
              backgroundColor: '#1C1C1C',
              shadowColor: '#181818',
            },
            headerBackTitleStyle: {
              color: '#fff',
            },
            headerTitleStyle: {
              color: '#fff',
            },
            headerBackTitle: 'Back',
            headerTintColor: '#fff',
            headerTitle: () => {
              return <Text style={styles.body}>Withdraw Money</Text>;
            },
          }}
        />
      </Stack.Navigator>
    );
  };

  const NotificationsScreen = () => {
    const navigation = useNavigation();

    return (
      <Stack.Navigator>
        <Stack.Screen
          name="Notifications"
          component={Notifications}
          options={{
            animationEnabled: false,
            gestureEnabled: false,
            headerStyle: {
              backgroundColor: '#1C1C1C',
              shadowColor: '#181818',
            },
            headerBackTitleStyle: {
              color: '#fff',
            },
            headerTitleStyle: {
              color: '#fff',
            },
            headerTintColor: '#fff',
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
      <Stack.Navigator>
        <Stack.Screen
          name="Settings"
          component={Settings}
          options={{
            animationEnabled: false,
            gestureEnabled: false,
            headerStyle: {
              backgroundColor: '#1C1C1C',
              shadowColor: '#181818',
            },
            headerBackTitleStyle: {
              color: '#fff',
            },
            headerTitleStyle: {
              color: '#fff',
            },
            headerTintColor: '#fff',
            headerTitle: () => {
              return <Text style={styles.body}>Settings</Text>;
            },
          }}
        />
        <Stack.Screen
          name="PersonalInformation"
          component={PersonalInformation}
          options={{
            animationEnabled: false,
            gestureEnabled: false,
            headerStyle: {
              backgroundColor: '#1C1C1C',
              shadowColor: '#181818',
            },
            headerBackTitleStyle: {
              color: '#fff',
            },
            headerTitleStyle: {
              color: '#fff',
            },
            headerTintColor: '#fff',
            headerTitle: () => {
              return <Text style={styles.body}>Personal</Text>;
            },
            headerRight: () => {
              return (
                <TouchableOpacity onPress={() => {}} style={{marginRight: 30}}>
                  <Text style={styles.body}>Update </Text>
                </TouchableOpacity>
              );
            },
          }}
        />
        <Stack.Screen
          name="NotificationSettings"
          component={NotificationSettings}
          options={{
            animationEnabled: false,
            gestureEnabled: false,
            headerStyle: {
              backgroundColor: '#1C1C1C',
              shadowColor: '#181818',
            },
            headerBackTitleStyle: {
              color: '#fff',
            },
            headerTitleStyle: {
              color: '#fff',
            },
            headerTintColor: '#fff',
            headerTitle: () => {
              return <Text style={styles.body}>Notification Settings</Text>;
            },
          }}
        />
        <Stack.Screen
          name="ChangePassword"
          component={ChangePassword}
          options={{
            animationEnabled: false,
            gestureEnabled: false,
            headerStyle: {
              backgroundColor: '#1C1C1C',
              shadowColor: '#181818',
            },
            headerBackTitleStyle: {
              color: '#fff',
            },
            headerTitleStyle: {
              color: '#fff',
            },
            headerTintColor: '#fff',
            headerTitle: () => {
              return <Text style={styles.body}>Change Password</Text>;
            },
          }}
        />
        <Stack.Screen
          name="TermsandConditions"
          component={TermsandConditions}
          options={{
            animationEnabled: false,
            gestureEnabled: false,
            headerStyle: {
              backgroundColor: '#1C1C1C',
              shadowColor: '#181818',
            },
            headerBackTitleStyle: {
              color: '#fff',
            },
            headerTitleStyle: {
              color: '#fff',
            },
            headerTintColor: '#fff',
            headerTitle: () => {
              return <Text style={styles.body}>{'Terms & Conditions'}</Text>;
            },
          }}
        />
        <Stack.Screen
          name="PrivacyPolicy"
          component={PrivacyPolicy}
          options={{
            animationEnabled: false,
            gestureEnabled: false,
            headerStyle: {
              backgroundColor: '#1C1C1C',
              shadowColor: '#181818',
            },
            headerBackTitleStyle: {
              color: '#fff',
            },
            headerTitleStyle: {
              color: '#fff',
            },
            headerTintColor: '#fff',
            headerTitle: () => {
              return <Text style={styles.body}>{'Privacy Policy'}</Text>;
            },
          }}
        />
        <Stack.Screen
          name="BankAccount"
          component={BankAccount}
          options={{
            animationEnabled: false,
            gestureEnabled: false,
            headerStyle: {
              backgroundColor: '#1C1C1C',
              shadowColor: '#181818',
            },
            headerBackTitleStyle: {
              color: '#fff',
            },
            headerTitleStyle: {
              color: '#fff',
            },
            headerTintColor: '#fff',
            headerTitle: () => {
              return <Text style={styles.body}>{'Bank Account'}</Text>;
            },
          }}
        />
      </Stack.Navigator>
    );
  };

  return (
    <NavigationContainer>
      <Tab.Navigator
        tabBarOptions={{
          activeTintColor: '#000',
          showLabel: false,
          // inactiveTintColor: 'lightgray',
          activeBackgroundColor: '#0A3C25',

          tabStyle: {
            marginLeft:20,
            marginRight:20,
            borderRadius: 40,
          },
          // inactiveBackgroundColor: '#b55031',
          labelStyle: {
            fontSize: 12,
          },
          style: {
            backgroundColor: '#1C1C1C',
            borderTopColor: '#ffffff00',
            paddingTop: 8,
          },
        }}>
        {2 == 1 ? (
          <Tab.Screen
            name="Splash"
            component={AuthScreen}
            options={{tabBarVisible: false}}
          />
        ) : (
          <>
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
            <Tab.Screen
              name="Wallet"
              component={WalletScreen}
              options={{
                tabBarIcon: () => {
                  return (
                    <Image
                      source={require('./assets/images/wallet.png')}
                      resizeMode="contain"
                      style={{width: '100%', height: '60%'}}
                    />
                  );
                },
              }}
            />
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
              name="Notifications"
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
  );
};

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

export default App;
