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
import {Props} from '../../types';
import SlideUp from '../settings/SlideUp';
import SettingItem from '../settings/SettingItem';
import TransactionItem from './TransactionItem';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../src/reducers';
import {separator} from '../../src/helpers/helpers';

const Transactions = ({navigation, route}: Props) => {
  const dispatch = useDispatch();
  const token = useSelector(state => state.authReducer.token);
  const _id = useSelector((state: RootState) => state.authReducer.userId);
  const profile = useSelector((state: RootState) => state.userReducer.profile);
  const wallet = useSelector((state: RootState) => state.walletReducer.wallet);
  const requesting = useSelector(
    (state: RootState) => state.userReducer.requesting,
  );

  const [searchTerm, setSearchTerm] = useState('');
  const [filteredTransactions, setFilteredTransactions] = useState({
    debit: [],
    credit: [],
  });
  const [transactions, setTransactions] = useState<object[]>([]);

  useEffect(() => {
    const unsortedTransactions = [
      ...wallet.transactions.debit,
      ...wallet.transactions.credit,
    ];

    const sortedTransactions = unsortedTransactions
      .filter(transaction =>
        transaction.name.toLowerCase().includes(searchTerm),
      )
      .sort((a: any, b: any) => new Date(b.createdAt) - new Date(a.createdAt));
    console.log(unsortedTransactions);

    setTransactions([...sortedTransactions]);
  }, [searchTerm]);

  return (
    <View style={styles.container}>
      <View style={{marginTop: 0}}></View>
      {/* <Text
        style={[
          styles.body,
          {
            lineHeight: 25,
            textAlign: 'center',
            color: '#ffffff30',

            marginBottom: 30,
          },
        ]}>
        Here's where you'll see transactions that have happened on your ajo
        account
      </Text> */}
      <TextInput
        style={[styles.input, styles.body]}
        placeholder="Type a circle name"
        placeholderTextColor="#000"
        value={searchTerm}
        onChangeText={text => {
          setSearchTerm(text.toLowerCase());
        }}
      />
      {transactions.length == 0 ? (
        <Text
          style={[
            styles.body,
            {
              lineHeight: 25,
              textAlign: 'center',
              color: '#000',

              marginBottom: 30,
            },
          ]}>
          No results!
        </Text>
      ) : (
        <>
          <ScrollView>
            {transactions.map((transaction: any) => {
              return (
                <TransactionItem
                  amount={separator(transaction.amount)}
                  debit={wallet.transactions.debit.some(
                    (object: any) =>
                      object._id.toString() === transaction._id.toString(),
                  )}
                  initiator={transaction.initiator}
                  key={transaction._id}
                  name={
                    transaction.initiator == 'user'
                      ? 'Ajo (Card Verification Reversal)'
                      : transaction.name
                  }
                  dateTime={transaction.createdAt}
                />
              );
            })}

            {/* {filteredTransactions.credit.map((creditTransaction: any) => {
              return (
                <TransactionItem
                  amount={separator(creditTransaction.amount)}
                  debit={false}
                  initiator={creditTransaction.initiator}
                  key={creditTransaction._id}
                  name={'From: ' + creditTransaction.name}
                  dateTime={
                    creditTransaction.createdAt.slice(0, 10) +
                    ' at ' +
                    creditTransaction.createdAt.slice(11, 16)
                  }
                />
              );
            })} */}
          </ScrollView>
        </>
      )}
    </View>
  );
};

export default Transactions;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
    backgroundColor: '#000000010',
    height: 53,
    marginTop: 0,
    marginBottom: 30,
    borderRadius: 0,
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
