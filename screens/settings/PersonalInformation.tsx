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
import {IPersonal, IUser} from '../../server/types';
import {userActions} from '../../src/actions/user.actions';
import {RootState} from '../../src/reducers';
import {Props, SettingItemProps} from '../../types';
import SettingItem from './SettingItem';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import {useNavigation} from '@react-navigation/native';

const PersonalInformation = () => {
  // const populateFields = (state: Object) => {
  //   console.log(Object.keys(state));
  // };

  const dispatch = useDispatch();
  const navigation = useNavigation();
  const onboarding = useSelector(state => state.authReducer.onboarding);
  const token = useSelector(state => state.authReducer.token);
  const _id = useSelector((state: RootState) => state.authReducer.userId);
  const profile = useSelector((state: RootState) => state.userReducer.profile);
  const successful = useSelector(
    (state: RootState) => state.userReducer.successful
  );

  const err = useSelector((state: RootState) => state.userReducer.error);

  const requesting = useSelector(
    (state: RootState) => state.userReducer.requesting,
  );

  const [form, setForm] = useState<IPersonal>({
    firstname: '',
    lastname: '',
    dob: new Date(),
    occupation: '',
  });
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState(new Date());
  const [error, setError] = useState(null);
  const [updated, setUpdated] = useState(false);


  useEffect(() => {
    if (profile) {
      setForm({
        firstname: profile.firstname ? profile.firstname : '',
        lastname: profile.lastname ? profile.lastname : '',
        dob: profile.dob?.length > 0 ? new Date(profile.dob) : new Date(),
        occupation: profile.occupation
          ? profile.occupation
          : profile.occupation,
      });
    }
  }, []);
  useEffect(() => {
    if (successful) {
      setUpdated(successful);
    }
  }, [successful]);

  useEffect(() => {
    if (updated) {
      if (onboarding) {
        navigation.navigate('StepThree');
        setUpdated(false);
      } else {
        Alert.alert('We\'ve updated your personal information!');
        setUpdated(false);
      }
    }
  }, [updated]);

  useEffect(() => {
    if (requesting == false && err != null) {
      Alert.alert(err);
    }
  }, [err]);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date: string | number | Date) => {
    setForm({...form, dob: new Date(date)});
    hideDatePicker();
  };

  return (
    <View style={styles.container}>
      {onboarding ? (
        <>
          <Text style={[styles.header, {marginTop: 20, padding: 20}]}>
            Step 2 of 4
          </Text>
          <Text
            style={[
              styles.body,
              {
                lineHeight: 25,
                textAlign: 'left',
                color: '#ffffff',
                paddingLeft: 20,

                marginBottom: 20,
              },
            ]}>
            We want to know how to address you on our app.
          </Text>
        </>
      ) : (
        <Text
          style={[
            styles.body,
            {
              lineHeight: 25,
              textAlign: 'center',
              color: '#ffffff',
              paddingLeft: 30,
              paddingRight: 30,
              marginBottom: 30,
              marginTop: 30,
            },
          ]}>
          Let's get to know you a little bit
        </Text>
      )}
      <View style={{padding: 20, paddingTop: 20}}>
        <Text style={[styles.body]}>First Name</Text>
        <TextInput
          style={[styles.input, styles.body]}
          placeholder="Enter your first name"
          placeholderTextColor="#ffffff60"
          value={form.firstname}
          onChangeText={text => {
            setForm({...form, firstname: text});
          }}
        />
        <Text style={[styles.body]}>Last Name</Text>
        <TextInput
          style={[styles.input, styles.body]}
          placeholder="Enter your last name"
          placeholderTextColor="#ffffff60"
          value={form.lastname}
          onChangeText={text => {
            setForm({...form, lastname: text});
          }}
        />
        <Text style={[styles.body]}>Birthday</Text>
        <TouchableOpacity
          onPress={() => {
            showDatePicker();
          }}
          activeOpacity={0.89}
          style={{
            height: 53,
            marginTop: 10,
            marginBottom: 15,
            borderRadius: 3,
            marginLeft: -18,

            width: '35%',
          }}>
          <RNDateTimePicker
            value={form.dob}
            display="default"
            onChange={(event, date) => {
              const d = moment(date).format();
              setForm({
                ...form,
                dob: new Date(d),
              });
            }}
          />
        </TouchableOpacity>

        {/* <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="date"
          onConfirm={handleConfirm}
          onCancel={hideDatePicker}
        /> */}
        {/* placeholder="Enter your date of birth"
          placeholderTextColor="#ffffff60"
          value={form.age?.toString()}
          onChangeText={text => {
            setForm({...form, dob: text});
          }} */}

        <Text style={[styles.body]}>Occupation</Text>
        <TextInput
          style={[styles.input, styles.body]}
          placeholder="What do you do"
          placeholderTextColor="#ffffff60"
          value={form.occupation}
          onChangeText={text => {
            setForm({...form, occupation: text});
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
            console.log(form);
            if (
              form.firstname.length > 0 &&
              form.lastname.length > 0 &&
              form.occupation.length > 0 &&
              form.dob.getDate() != new Date().getDate()
            ) {
              dispatch(
                userActions.updateUserProfile(
                  _id,
                  token,
                  form.firstname,
                  form.lastname,
                  form.dob,
                  form.occupation,
                ),
              );
            } else {
              setError(
                'Fill in all details, including your real date of birth',
              );
              setTimeout(() => {
                setError(null);
              }, 5000);
            }
          }}>
          {requesting ? (
            <ActivityIndicator color={'#02000A'} size={'small'} />
          ) : (
            <Text style={[styles.body, {color: '#02000a'}]}>
              {onboarding ? 'Next' : 'Update'}
            </Text>
          )}
        </TouchableOpacity>
        <Text
          style={[
            styles.body,
            {marginBottom: 30, color: '#E2A8FE', marginTop: 20},
          ]}>
          {error && `${error}`}
        </Text>
      </View>
    </View>
  );
};

export default PersonalInformation;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0612',
  },
  bar: {
    width: '70%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#171717',
    padding: 10,
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
    color: '#FFFFFF',
  },
});
