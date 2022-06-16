import {useNavigation} from '@react-navigation/native';
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
  ActivityIndicator,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {ICircle, IPersonal} from '../../server/types';
import {circleActions} from '../../src/actions/circle.actions';
import {RootState} from '../../src/reducers';
import {Props} from '../../types';

const EditCircle = ({route}: any) => {
  const navigation = useNavigation();
  // const circle = route?.params.circle;

  const dispatch = useDispatch();
  const token = useSelector(state => state.authReducer.token);
  const profile = useSelector((state: RootState) => state.userReducer.profile);
  const circles = useSelector(
    (state: RootState) => state.circleReducer.circles,
  );
  const active = useSelector((state: RootState) => state.circleReducer.active);
  const requesting = useSelector(
    (state: RootState) => state.circleReducer.requesting,
  );

  const [warning, setWarning] = useState<null | string>(null);
  const [refresh, setRefresh] = useState<null | boolean>(false);
  const [fallback, setFallback] = useState<null | string>('');

  const [form, setForm] = useState<any>({
    circlename: '',
    expires: '',
    round: {
      duration: '',
    },
    fee: '',
    capacity: '',
  });

  const secToDays = (seconds: any) => {
    return Math.floor(parseInt(seconds) / (3600 * 24)).toString();
  };

  // const secToDays = (seconds, capacity) => {
  //   return Math.floor((parseInt(seconds) * parseInt(capacity)) / (3600 * 24));
  // };

  useEffect(() => {
    if (!requesting) {
      setForm({
        circlename: active.circlename,
        expires: active.expires,
        round: {
          ...active.round,
          duration: secToDays(active.round.duration)
            ? secToDays(active.round.duration)
            : '88',
        },
        fee: active.fee,
        capacity: active.capacity,
      });
    }
  }, [requesting]);

  // useEffect(() => {
  //   if (active) {
  //     route.params.circle = active;
  //     console.log(route.params.circle);
  //   }
  // }, [active]);

  return (
    <View style={styles.container}>
      {form.round.duration != '' && (
        <>
          <View style={{marginBottom: 30}}>
            {requesting ? (
              <>
                <ActivityIndicator color={'white'} size={'small'} style={{marginBottom:15}} />
              </>
            ) : (
              <>
                <Text
                  style={[
                    styles.body,
                    {
                      lineHeight: 25,
                      textAlign: 'center',
                      color: '#ffffff80',
                      paddingLeft: 10,
                      paddingRight: 10,
                      marginBottom: 10,
                      marginTop: 0,
                    },
                  ]}>
                  This ajo will take{' '}
                  {parseInt(form.round.duration) * parseInt(form.capacity)} days
                  in total
                  <Text style={{color: 'purple'}}>
                    {warning && (
                      <>
                        {'\n'}
                        {warning}
                      </>
                    )}
                  </Text>
                </Text>
              </>
            )}
          </View>
        </>
      )}
      <Text style={styles.body}>Rename your circle</Text>
      <TextInput
        style={[styles.input, styles.body]}
        placeholder="Circle Name"
        placeholderTextColor="#ffffff60"
        value={form.circlename}
        onChangeText={text => {
          setForm({...form, circlename: text});
        }}
      />
      <Text style={styles.body}>How many days should each round take?</Text>
      <TextInput
        style={[styles.input, styles.body]}
        placeholder="Enter number of days"
        placeholderTextColor="#ffffff60"
        value={form.round.duration}
        onChangeText={text => {
          setForm({...form, round: {...form.round, duration: text}});
          setFallback(text);
        }}
      />
      <Text style={styles.body}>What's the contribution fee?</Text>
      <TextInput
        style={[styles.input, styles.body]}
        placeholder="Enter a fee"
        placeholderTextColor="#ffffff60"
        value={form.fee.toString()}
        onChangeText={text => {
          setForm({...form, fee: text});
        }}
      />
      <Text style={styles.body}>Maximum number of people in your ajo</Text>
      <TextInput
        style={[styles.input, styles.body]}
        placeholder="Enter a number"
        placeholderTextColor="#ffffff60"
        value={form.capacity.toString()}
        onChangeText={text => {
          setForm({...form, capacity: text});
        }}
      />

      <TouchableOpacity
        activeOpacity={0.89}
        style={{
          backgroundColor: '#E2A8FE',
          height: 53,
          borderRadius: 3,

          justifyContent: 'center',
          alignItems: 'center',
        }}
        onPress={() => {
          // circlename: '',
          // expires: '',
          // round: {
          //   duration: '',
          // },
          // fee: '',
          // capacity: '',
          if (
            form.circlename.length > 0 &&
            form.round.duration >= 7 &&
            form.fee > 0 &&
            form.capacity > 0
          ) {
            dispatch(circleActions.updateCircle(token, active._id, form, false));
            setTimeout(() => {
              setRefresh(!refresh);
            }, 1000);
          } else if (form.round.duration < 7) {
            setWarning('Each round should take at least one week (7 days)');
            setTimeout(() => {
              setWarning(null);
            }, 6000);
          } else {
          
            setWarning('Please fill in all fields');
            setTimeout(() => {
              setWarning(null);
            }, 3000);
          }
        }}>
        {requesting ? (
          <ActivityIndicator color={'#0a0612'} size={'small'} />
        ) : (
          <Text style={[styles.body, {color:"#0a0612"}]}>Update</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default EditCircle;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#0a0612',
    padding: 20,
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
    backgroundColor: '#E2A8FE20',
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
    color: 'white',
  },
});
