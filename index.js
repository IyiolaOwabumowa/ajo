/**
 * @format
 */
import 'react-native-gesture-handler';
import {AppRegistry} from 'react-native';
import React, {useEffect, useState} from 'react';
import App from './App';
import {name as appName} from './app.json';
import RNPaystack from 'react-native-paystack';
import Config from 'react-native-config';
import messaging, {firebase} from '@react-native-firebase/messaging';

// import { initializeApp } from 'firebase/app';

//@ts-ignore


messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('message is handled in the background', remoteMessage);
});

AppRegistry.registerComponent(appName, () => App);
