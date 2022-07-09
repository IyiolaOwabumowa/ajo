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
  const circleError = useSelector((state: RootState) =>
    state.circleReducer.circleError ? state.circleReducer.circleError : null,
  );
  const active = useSelector((state: RootState) => state.circleReducer.active);
  const successful = useSelector(
    (state: RootState) => state.circleReducer.successful,
  );

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

  const [created, setCreated] = useState(false);

  useEffect(() => {
    setError(circleError);
  }, [circleError]);

  useEffect(() => {
    if (successful) {
      setCreated(true);
    }
  }, [successful]);

  useEffect(() => {
    if (created) {
      Alert.alert('Circle created successfully', '', [
        {
          text: 'Ok',
          onPress: () => {
            navigation.navigate('CircleDashboard');
            setTimeout(() => {
              setCreated(false);
            }, 2000);
          },
        },
      ]);
    }
  }, [created]);

  return (
    <View style={styles.container}>
      <Text style={[styles.body, {marginTop: 20}]}>Name your circle</Text>
      <TextInput
        style={[styles.input, styles.body]}
        placeholder="Circle Name"
        placeholderTextColor="#00000060"
        value={form.circlename}
        autoCorrect={false}
        onChangeText={text => {
          setForm({...form, circlename: text});
        }}
      />
      <Text style={styles.body}>
        How many days should each round take? (At least 7)
      </Text>
      <TextInput
        style={[styles.input, styles.body]}
        placeholder="Enter number of days"
        placeholderTextColor="#00000060"
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
        placeholderTextColor="#00000060"
        value={form.fee.toString()}
        keyboardType="number-pad"
        onChangeText={text => {
          setForm({...form, fee: text});
        }}
      />
      <Text style={styles.body}>Number of people in your ajo (At least 2)</Text>
      <TextInput
        style={[styles.input, styles.body]}
        placeholder="Enter a number"
        placeholderTextColor="#00000060"
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
          height: 45,
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
          } else {
            setError('Please make sure all fields are correct');
            setTimeout(() => {
              setError(null);
            }, 4000);
          }
        }}>
        {requesting ? (
          <ActivityIndicator color={'#02000A'} size={'small'} />
        ) : (
          <Text style={[styles.body, {color: '#02000A'}]}>Create Circle</Text>
        )}
      </TouchableOpacity>

      {error && (
        <>
          <Text
            style={[
              styles.body,
              {marginBottom: 30, color: 'red', marginTop: 20},
            ]}>
            {error}
          </Text>
        </>
      )}

      {/* <Text
        style={[
          styles.body,
          {textAlign: 'left', marginTop: 40, lineHeight: 20, padding: 0},
        ]}>
        - Your circle should have at least 7 days per round.
        {'\n\n'}- Your circle should have at least 2 people.
      </Text> */}
    </View>
  );
};

export default CreateCircle;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#fff',
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
    color: '#000',
  },
});
