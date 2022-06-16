import {useNavigation} from '@react-navigation/native';
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
import {Props, SphereProps} from '../../types';
import BottomBar from '../BottomBar';

const TransactionEntry = () => {
  return (
    <TouchableOpacity activeOpacity={0.7} style={styles.container}>
      <View style={styles.row}>
        <View>
          <Text style={styles.body}>28/03/2021 12:01</Text>
          <Text style={styles.body}>Kamaru Alalade</Text>
        </View>

        <Text style={styles.body}>PAID</Text>
      </View>
    </TouchableOpacity>
  );
};

export default TransactionEntry;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    backgroundColor: '#70908A',
    width: '90%',
    height: 60,
    borderRadius: 3,
    marginTop: 25,
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
    fontFamily: 'Axiforma-Heavy',
    fontSize: 29,
    color: 'white',
  },
  body: {
    fontFamily: 'Axiforma-Medium',
    fontSize: 14,
    color: 'white',
    textAlign: 'center',
    lineHeight: 20,
  },
});
