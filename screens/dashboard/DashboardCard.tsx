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
import {DashCardProps} from '../../types';

const DashboardCard = ({title, subtitle, value}: DashCardProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.body}>{title}</Text>
      <Text style={[styles.body, {fontSize: 12, marginTop: 8}]}>
        {subtitle}
      </Text>
      <Text style={[styles.header, {fontSize: 23, marginTop: 40}]}>
        {value}
      </Text>
    </View>
  );
};

export default DashboardCard;

const styles = StyleSheet.create({
  container: {
    height: 158,
    borderRadius: 10,
    marginTop: 20,
    backgroundColor: '#272727',
    padding: 20,
    width: '100%',
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
