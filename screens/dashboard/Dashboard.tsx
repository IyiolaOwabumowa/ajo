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
import {Props} from '../../types';
import BottomBar from '../BottomBar';
import DashboardCard from './DashboardCard';

const Dashboard = ({navigation}: Props) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        activeOpacity={0.89}
        onPress={() => {
          navigation.navigate('Transactions');
        }}
        style={[styles.row, {marginTop: 50}]}>
        <Text style={styles.body}>View transaction history</Text>
        <Image
          source={require('../../assets/images/forward-arrow.png')}
          resizeMode="contain"
          style={{width: '2%'}}
        />
      </TouchableOpacity>

      <DashboardCard
        title="Wallet"
        subtitle="Your wallet balance"
        value="$50,000"
      />

      <DashboardCard
        title="Expected Income"
        subtitle="This month"
        value="$500,000"
      />

      <DashboardCard
        title="Circles Joined"
        subtitle="Total circles"
        value={5}
      />
      <View style={styles.center}></View>
    </View>
  );
};

export default Dashboard;

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
