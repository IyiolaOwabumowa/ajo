import React, {useEffect, useState} from 'react';
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
import {useDispatch, useSelector} from 'react-redux';
import {userActions} from '../../src/actions/user.actions';
import {Props} from '../../types';
import BottomBar from '../BottomBar';
import DashboardCard from './DashboardCard';
import {RootState} from '../../src/reducers';
import {separator} from '../../src/helpers/helpers';
import {ICircle, IWallet} from '../../server/types';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {walletActions} from '../../src/actions/wallet.actions';
import {circleActions} from '../../src/actions/circle.actions';
import axios from 'axios';
import Config from 'react-native-config';

const Dashboard = () => {
  const dispatch = useDispatch();
  const token = useSelector(state => state.authReducer.token);
  const userId = useSelector((state: RootState) => state.authReducer.userId);
  const profile = useSelector((state: RootState) => state.userReducer.profile);
  const circles = useSelector(
    (state: RootState) => state.circleReducer.circles,
  );

  const expectedTotalIncome = useSelector(
    (state: RootState) => state.circleReducer.expectedTotalIncome,
  );
  const wallet = useSelector((state: RootState) => state.walletReducer.wallet);

  const [total, setTotal] = useState(0);
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  useEffect(() => {
    if (isFocused) {
      axios
        .get(`${Config.API_URL}/api/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Cache-Control': 'no-cache',
          },
        })
        .then(response => {
          dispatch(
            circleActions.generateCircles(token, response.data.user.circles),
          );
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

  const cardExists = (wallet: IWallet) => {
    if (Object.keys(wallet).length > 0) {
      if (wallet.bankdetails.authorization) {
        return true;
      } else {
        return false;
      }
    }
  };

  const bankExists = (wallet: IWallet) => {
    if (Object.keys(wallet).length > 0) {
      if (wallet.bankdetails.accountnumber) {
        return true;
      } else {
        return false;
      }
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        activeOpacity={0.89}
        onPress={() => {
          navigation.navigate('Transactions');
        }}
        style={{height: 50, marginTop: 50, marginBottom: 50}}>
        <View
          style={{
            backgroundColor: '#E2A8FE50',
            paddingLeft: 20,
            paddingTop: 0,
            paddingRight: 20,
            height: 50,
            marginBottom: 40,
            width: '100%',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <Text style={styles.body}>View transaction history</Text>
          <Image
            source={require('../../assets/images/forward-arrow.png')}
            resizeMode="contain"
            style={{width: '6%'}}
          />
        </View>
      </TouchableOpacity>
      {Object.keys(wallet).length > 0 && (
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <DashboardCard
            title=""
            subtitle=""
            value={
              cardExists(wallet)
                ? `${wallet.bankdetails.authorization.brand
                    .slice(0, 1)
                    .toUpperCase()}${wallet.bankdetails.authorization.brand.slice(
                    1,
                  )} card ending with ${
                    wallet.bankdetails.authorization.last4
                  }.`
                : `Add a Debit Card`
            }
            wallet={wallet}
            slug="card"
          />

          <DashboardCard
            title=""
            subtitle=""
            value={
              bankExists(wallet)
                ? `Account Number:\n${wallet.bankdetails.accountnumber}`
                : `Add Bank Account`
            }
            wallet={wallet}
            slug="bank"
          />
        </View>
      )}

      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <DashboardCard
          title="Expected Income"
          subtitle="From all your circles"
          value={`₦${separator(expectedTotalIncome)}`}
        />

        <DashboardCard
          title="Circles Joined"
          subtitle="Total circles"
          value={`${separator(circles && circles.length)} ${
            parseInt(separator(circles && circles.length)) > 1 ||
            parseInt(separator(circles && circles.length)) == 0
              ? 'Circles'
              : 'Circle'
          }`}
        />
      </View>
      {/* <Text
        style={[
          styles.body,
          {textAlign: 'center', marginTop: 200, lineHeight: 20, padding: 0},
        ]}>
        Ajo Technologies will never store your card information. All debit card
        information are securely processed and encrypted by Paystack.
      </Text> */}
    </View>
  );
};

export default Dashboard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#fff',
    padding: 20,
  },
  center: {
    flex: 1,
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
  },
});
