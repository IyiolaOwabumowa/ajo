import React, {useEffect, useRef, useState} from 'react';
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
  Alert,
  ActivityIndicator,
} from 'react-native';
import {Props} from '../../types';
import SlideUp from '../settings/SlideUp';
import SettingItem from '../settings/SettingItem';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../src/reducers';
import axios from 'axios';
import Config from 'react-native-config';
import {Members} from '../../server/types';

const Debtors = ({navigation, route}: Props) => {
  const dispatch = useDispatch();
  const token = useSelector((state: RootState) => state.authReducer.token);
  const _id = useSelector((state: RootState) => state.authReducer.userId);
  const profile = useSelector((state: RootState) => state.userReducer.profile);
  const active = useSelector((state: RootState) => state.circleReducer.active);

  const wallet = useSelector((state: RootState) => state.walletReducer.wallet);
  const circles = useSelector(
    (state: RootState) => state.circleReducer.circles,
  );

  const [name, setName] = useState('');
  const [loading, setLoading] = useState(true);
  const membersArray = useRef<any>([]).current;

  const [owner, setOwner] = useState(false);

  useEffect(() => {
    setOwner(active._creator?.toString() === profile._id?.toString());
  }, []);
  //@ts-ignore
  const {members} = route?.params;

  useEffect(() => {
    const promises = members.map((member: Members) => {
      console.log(active.round.funded.includes(member?._id));
      if (active.round.funded.includes(member?._id) == true) {
        return axios
          .get(`${Config.API_URL}/api/users/${member._id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then(response => {
            // setName(
            //   `${response.data.user.firstname} ${response.data.user.lastname}`,
            // );

            return {
              _id: member._id,
              firstname: response.data.user.firstname,
              lastname: response.data.user.lastname,
              deactivated: member.deactivated,
              walletId: member.walletId,
              paid: member.paid,
              trials: member.trials,
              warnings: member.warnings,
            };
          })
          .catch(function (error) {
            if (error.response) {
              const errorObject = {
                status: error.response.status,
                error: error.response,
              };
              return errorObject;
            }
          });
      } else {
        return null;
      }
    });

    console.log(promises);

    if (!promises.every((promise: any) => promise == null)) {
      Promise.all(promises).then(results => {
        membersArray.push(...results);
        setLoading(false);
      });
    }
    setLoading(false);
  }, []);

  const deactivateMember = async (_id: any, circleId: any, name: any) => {
    return axios
      .get(`${Config.API_URL}/api/circles/deactivate/${circleId}/${_id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(response => {
        Alert.alert(
          `Deactived!`,
          `You can decide to activate ${name} in this circle.`,
        );
      })
      .catch(function (error) {
        if (error.response) {
          const errorObject = {
            status: error.response.status,
            error: error.response.message.body,
          };
          return errorObject;
        }
      });
  };

  const activateMember = async (_id: any, circleId: any, name: any) => {
    return axios
      .get(`${Config.API_URL}/api/circles/activate/${circleId}/${_id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(response => {
        Alert.alert(
          `Activated!`,
          `You can decide to deactivate ${name} in this circle.`,
        );
      })
      .catch(function (error) {
        if (error.response) {
          const errorObject = {
            status: error.response.status,
            error: error.response.message.body,
          };
          return errorObject;
        }
      });
  };

  return (
    <View style={styles.container}>
      <View style={{marginTop: 30}}></View>
      {!loading ? (
        <>
          {membersArray.length > 0 ? (
            membersArray.map((member: any) => {
              return (
                <React.Fragment key={member?._id}>
                  <SettingItem
                    key={member?._id}
                    title={`${member?.firstname} ${member?.lastname} ${
                      member?.deactivated ? '(Deactivated)' : ''
                    }`}
                    member={member}
                    owner={owner}
                    deactivated={member?.deactivated}
                    action={
                      member?.deactivated ? activateMember : deactivateMember
                    }
                    circle={active}
                  />
                </React.Fragment>
              );
            })
          ) : (
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
              <Text style={[styles.body, {color: '#ffffff'}]}>
                No member in this round has been funded yet
              </Text>
            </View>
          )}
        </>
      ) : (
        <>
          <ActivityIndicator size={'large'} color={'white'} />
        </>
      )}
    </View>
  );
};

export default Debtors;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0612',
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
    backgroundColor: '#2E2E2E',
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
