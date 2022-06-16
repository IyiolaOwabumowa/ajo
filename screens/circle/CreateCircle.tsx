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
  Alert,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {circleActions} from '../../src/actions/circle.actions';
import {userActions} from '../../src/actions/user.actions';
import {RootState} from '../../src/reducers';
import {Props} from '../../types';

const CreateCircle = () => {
  const navigation = useNavigation();

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

  const [form, setForm] = useState({
    circlename: '',
    fee: '',
    capacity: '',
    roundDuration: '',
  });

  const [error, setError] = useState(null);
  return (
    <View style={styles.container}>
      <Text style={styles.body}>Name your circle</Text>
      <TextInput
        style={[styles.input, styles.body]}
        placeholder="Circle Name"
        placeholderTextColor="#ffffff60"
        value={form.circlename}
        autoCorrect={false}
        onChangeText={text => {
          setForm({...form, circlename: text});
        }}
      />
      <Text style={styles.body}>How many days should each round take?</Text>
      <TextInput
        style={[styles.input, styles.body]}
        placeholder="Enter number of days"
        placeholderTextColor="#ffffff60"
        value={form.roundDuration}
        keyboardType="number-pad"
        onChangeText={text => {
          setForm({...form, roundDuration: text});
        }}
      />
      <Text style={styles.body}>What's the contribution fee?</Text>
      <TextInput
        style={[styles.input, styles.body]}
        placeholder="Enter a fee"
        placeholderTextColor="#ffffff60"
        value={form.fee.toString()}
        keyboardType="number-pad"
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
        keyboardType="number-pad"
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
          if (
            form.circlename.length > 0 &&
            parseInt(form.roundDuration) >= 7 &&
            parseInt(form.fee) > 0 &&
            parseInt(form.capacity) > 1
          ) {
            dispatch(circleActions.createCircle(token, form));
            setTimeout(() => {
              // dispatch(userActions.getProfile(profile._id, token));
            }, 500);
            navigation.navigate('CircleDashboard');
            Alert.alert('Circle created successfully');
            //  dispatch(circleActions.generateCircles(token, profile.circles))
            // Alert.alert('Circle created successfully', '', [
            //   {
            //     text: 'Take me to my circle',
            //     onPress: () => {
            //       navigation.navigate('CircleDashboard');
            //     },
            //   },

            //   {
            //     text: 'cancel',
            //     style:"cancel"
            //   }
            // ]);
          } else {
            setError('Please make sure all fields are correct ');
            setTimeout(() => {
              setError(null);
            }, 4000);
          }
        }}>
        {requesting ? (
          <ActivityIndicator color={'#02000A'} size={'small'} />
        ) : (
          <Text style={[styles.body, {color: '#02000A'}]}>Create</Text>
        )}
      </TouchableOpacity>

      {error && (
        <>
          <Text
            style={[
              styles.body,
              {marginBottom: 30, color: '#E2A8FE', marginTop: 20},
            ]}>
            {error}
          </Text>
        </>
      )}

      <Text
        style={[
          styles.body,
          {textAlign: 'left', marginTop: 40, lineHeight: 20, padding: 0},
        ]}>
        - Your circle should have at least 7 days per round.
        {'\n\n'}- Your circle should have at least 2 people.
      </Text>
    </View>
  );
};

export default CreateCircle;

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
