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
  Alert,
  ActivityIndicator,
} from 'react-native';
import {Props} from '../../types';
import {BlurView, VibrancyView} from '@react-native-community/blur';
import TransactionEntry from './TransactionEntry';
import moment from 'moment';
import {separator} from '../../src/helpers/helpers';
import {ICircle} from '../../server/types';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../src/reducers';
import {useNavigation} from '@react-navigation/native';
import {circleActions} from '../../src/actions/circle.actions';
import axios from 'axios';
import Config from 'react-native-config';
import {authActions} from '../../src/actions/auth.actions';
import SettingItem from '../settings/SettingItem';
import {userActions} from '../../src/actions/user.actions';

const CircleDashboard = ({route}: Props) => {
  const dispatch = useDispatch();
  var converter = require('number-to-words');
  const profile = useSelector((state: RootState) => state.userReducer.profile);
  const circles = useSelector(
    (state: RootState) => state.circleReducer.circles,
  );
  const active = useSelector((state: RootState) => state.circleReducer.active);
  const token = useSelector((state: RootState) => state.authReducer.token);
  //@ts-ignore
  // const {round, expires, fee, capacity, members, _id} = active;
  const [roundEndDate, setRoundEndDate] = useState<string | number>(0);
  const [savings, setSavings] = useState(0);
  const [fundingDate, setFundingDate] = useState<number>(0);
  const [fundingRound, setFundingRound] = useState<string | number>(0);
  const [headline, setHeadline] = useState('');
  const [loading, setLoading] = useState(false);

  const [owner, setOwner] = useState(false);

  const navigation = useNavigation();
  const daysBetweenStartToEnd = (start: any, end: any) => {
    var now = moment(start, 'DD-MM-YYYY');
    var later = moment(end, 'DD-MM-YYYY');

    return Math.ceil(moment.duration(later.diff(now)).asDays());
  };

  useEffect(() => {
    if (active) {
      setOwner(active._creator?.toString() === profile._id?.toString());
    }
  }, []);

  useEffect(() => {
    if (active) {
      var waitTime;
      const lastRoundEndDate = moment(active.round.lastRoundEndDate).format(
        'DD-MM-YYYY',
      );

      //see who has paid and how much circle has saved
      var count = 0;
      active.members.map((member: any) => {
        if (member.paid) {
          count += 1;
        }
      });

      const savings = count * active.fee;

      //check if user has not been funded, if not, analyze when she'll be funded and in what round
      const userNotFunded = active.round.funding.some(
        (id: any) => id.toString() === profile._id.toString(),
      );

      if (userNotFunded) {
        const index = active.round.funding.findIndex((id: any) => {
          console.log(profile._id.toString(), id.toString());
          return id.toString() === profile._id.toString();
        });

        if (index != -1) {
          console.log(index);
          //see who's on the funding list and how long it'll take for that user to get funded
          var multiplier = index + 1;
          waitTime = active.round.duration * multiplier;
          console.log('idx: ', waitTime);
          const now = moment().format('DD-MM-YYYY');
          const fundingTime = moment(lastRoundEndDate, 'DD-MM-YYYY')
            .add(waitTime, 'seconds')
            .format('DD-MM-YYYY');

          waitTime = daysBetweenStartToEnd(now, fundingTime);
          setFundingRound(multiplier);
          setFundingDate(waitTime);
        } else {
        }
      }

      setSavings(savings);
      // setRoundEndDate(roundEndTimeCountdown.toString());
    }
  }, []);

  useEffect(() => {
    if (active) {
      const now = moment().format('DD-MM-YYYY');
      const lastRoundEndDate = moment(active.round.lastRoundEndDate).format(
        'DD-MM-YYYY',
      );
      const roundEndTime = moment(lastRoundEndDate, 'DD-MM-YYYY')
        .add(active.round.duration, 'seconds')
        .format('DD-MM-YYYY');

      var roundEndTimeCountdown = daysBetweenStartToEnd(now, roundEndTime);

      var index = 0;
      const slides = [
        `Round ${converter.toWords(active.round.count)} ends ${
          fundingDate == 0
            ? 'today'
            : 'in ' +
              converter.toWords(roundEndTimeCountdown.toString()) +
              `${fundingDate < 2 ? ' day' : ' days'}`
        }`,
        `Payout rate is ₦${separator(active.fee * active.capacity)}/member`,
        `We're paying ${active.round.fundingNow}`,
      ];
      setHeadline(slides[1]);
      const headlineInterval = setInterval(() => {
        index += 1;
        if (index == 3) {
          index = 0;
        }
        setHeadline(slides[index]);
      }, 6000);

      return () => {
        clearInterval(headlineInterval);
      };
    }
  }, [fundingDate]);

  useEffect(() => {}, []);

  useEffect(() => {
    if (active) {
      if (active.message) {
        Alert.alert(`${active.message}`);
        dispatch(circleActions.generateCircles(token, profile.circles, active));
      }
    }
  }, [active]);

  const circleDetails = () => {
    //update circle first
    const data = {
      circlename: active.circlename,
      expires: active.expires,
      round: {
        ...active.round,
        duration: active.round.duration,
      },
      fee: active.fee,
      capacity: active.members.length,
    };

    return data;
  };

  if (active) {
    return (
      <View style={styles.container}>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#E2A8FE40',
            paddingBottom: 40,

            height: 165,

            width: '100%',
            borderRadius: 5,
          }}>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <View style={styles.absolute}>
              <View
                style={{
                  flex: 1,

                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                {active.round.count - 1 == active.capacity ? (
                  <>
                    <Text
                      style={[
                        styles.header,
                        {textAlign: 'center', fontSize: 15, lineHeight: 30},
                      ]}>
                      This ajo has ended
                    </Text>
                  </>
                ) : (
                  <>
                    {active.started ? (
                      <>
                        <Text
                          style={{
                            fontFamily: 'Axiforma-MEDIUM',
                            fontSize: 15,
                            textAlign: 'center',

                            color: 'black',
                          }}>
                          {headline}
                        </Text>

                        {/* <Text
                        style={[
                          styles.header,
                          {textAlign: 'center', fontSize: 14, lineHeight: 30},
                        ]}>
                        We're paying {round.fundingNow}
                      </Text> */}
                      </>
                    ) : (
                      <Text
                        style={[
                          styles.header,
                          {textAlign: 'center', fontSize: 16, lineHeight: 30},
                        ]}>
                        This ajo hasn't started
                      </Text>
                    )}
                  </>
                )}
              </View>

              <View
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#E2A8FE50',
                  borderBottomLeftRadius: 3,
                  borderBottomRightRadius: 3,

                  paddingLeft: 20,
                  paddingRight: 20,
                  paddingTop: 15,
                  paddingBottom: 15,
                }}>
                {/* <View
            style={{
              backgroundColor: '#0A3C25',
              padding: 5,
              borderRadius: 2,
              marginBottom: 20,
            }}>
            <Text style={[styles.body, {fontSize: 13, color: '#ffffff'}]}>
              Information board
            </Text>
          </View> */}

                {active.round.count - 1 == active.capacity ? (
                  <>
                    <Text style={[styles.body, {color: 'black', fontSize: 15}]}>
                      Circle owner can decide to restart this ajo
                    </Text>
                  </>
                ) : (
                  <>
                    {!active.started ? (
                      <Text
                        style={[styles.body, {color: 'black', fontSize: 15}]}>
                        Circle owner can decide to start this ajo
                      </Text>
                    ) : (
                      <>
                        {fundingDate.toString().length >= 1 ? (
                          <>
                            <Text style={[styles.body, {fontSize: 13}]}>
                              Your wallet will be funded
                              {fundingDate == 0
                                ? 'today'
                                : ` in ${fundingDate} ${
                                    fundingDate < 2 ? 'day' : 'days'
                                  }`}{' '}
                              {/* (Round {converter.toWords(fundingRound)}) */}
                            </Text>
                          </>
                        ) : (
                          <>
                            <Text style={[styles.body, {fontSize: 13}]}>
                              You've already been funded, remember to keep
                              paying your dues.
                            </Text>
                          </>
                        )}
                      </>
                    )}
                  </>
                )}
              </View>
            </View>
          </View>
        </View>

        {active.started == false ? (
          <>
            <View style={{flex:0.95, alignItems:"center", justifyContent:"center"}}>
              <Image
                source={require('../../assets/images/waiting.png')}
                resizeMode="contain"
                style={{height: '60%'}}
              />
            </View>

            {owner && (
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                  setLoading(true);
                  if (active.members.length >= active.capacity) {
                    //start ajo
                    Alert.alert(
                      'Are you sure?',
                      "\nYou can't make changes \n if you start this ajo",
                      [
                        {
                          text: 'Start',
                          onPress: () => {
                            setLoading(false);
                            dispatch(circleActions.startAjo(token, active._id));
                          },
                        },
                        {
                          text: 'Go back',
                          onPress: () => {
                            setLoading(false);
                          },
                          style: 'cancel',
                        },
                      ],
                    );
                  } else {
                    Alert.alert(
                      'Important',
                      active.members.length < 2
                        ? `To start this ajo, your circle must\n have at least one other member.`
                        : `\nDo you want to start this ajo with only ${
                            active.members.length
                          }${
                            active.members.length > 1 ? ' members?' : ' member?'
                          } You can't make changes to an ajo once it starts\n\n`,

                      [
                        {
                          text:
                            active.members.length < 2
                              ? 'View Members'
                              : `Start the ajo `,
                          onPress: () => {
                            if (active.members.length < 2) {
                              navigation.navigate('ViewMembers', active);
                              setLoading(false);
                            } else {
                              //update circle with capacity of the current amount of members and start ajo
                              const form = {
                                circlename: active.circlename,
                                expires: active.expires,
                                round: {
                                  ...active.round,
                                  duration: active.round.duration,
                                },
                                fee: active.fee,
                                capacity: active.members.length,
                              };
                              dispatch(
                                circleActions.updateCircle(
                                  token,
                                  active._id,
                                  form,
                                  true,
                                ),
                              );

                              setLoading(false);
                            }
                          },
                        },
                        {
                          text: 'Invite Member',
                          onPress: () => {
                            //navigate to invite screen
                            navigation.navigate('InviteMembers');
                            setLoading(false);
                          },
                        },
                        {
                          text: 'Go back',
                          onPress: () => {
                            setLoading(false);
                            //navigate to invite screen
                          },
                          style: 'cancel',
                        },
                      ],
                    );
                  }
                }}
                style={[
                  styles.transBar,
                  {
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#E2A8FE',
                    marginTop: 50,
                    marginBottom: 0,
                  },
                ]}>
                {loading ? (
                  <>
                    <ActivityIndicator color={'white'} size="small" />
                  </>
                ) : (
                  <>
                    <Text
                      style={[
                        styles.body,
                        {fontSize: 15, textAlign: 'center', color: '#000'},
                      ]}>
                      Start Ajo
                    </Text>
                  </>
                )}

                {/* <Image
                  source={require('../../assets/images/forward-arrow.png')}
                  resizeMode="contain"
                  style={{width: 20, height: '60%'}}
                /> */}
              </TouchableOpacity>
            )}
          </>
        ) : (
          <>
            <View
              style={[
                {
                  width: '90%',
                  backgroundColor: '#02000A',
                  justifyContent: 'center',
                  padding: 20,
                  paddingTop: 30,
                  paddingBottom: 30,
                  marginTop: 60,
                },
              ]}>
              <SettingItem title="My Circles" next="Circles" params={active} />
              <SettingItem
                title="Debtors List"
                next="Debtors"
                params={active}
              />
              <SettingItem
                title="Funded Members"
                next="FundedMembers"
                params={active}
              />

              {active.members.map((member: any) => {
                if (member._id == profile._id && member.paid == true) {
                  return <React.Fragment key={profile._id}></React.Fragment>;
                  // if (member._id == _id && member.paid) {
                  //   return (
                  //     <>
                  //       <Text
                  //         style={[
                  //           styles.body,
                  //           {fontSize: 13, textAlign: 'center'},
                  //         ]}>
                  //         View this round’s transactions
                  //       </Text>
                  //     </>
                  //   );
                  // }
                }
                if (member._id == profile._id && member.paid == false) {
                  return (
                    <React.Fragment key={profile._id}>
                      <View style={{width: '100%'}}>
                        <TouchableOpacity
                          activeOpacity={0.8}
                          onPress={() => {
                            // trigger manual payment API
                            //localhost:5000/api/circles/pay/610e75ac62bc45cf6c266847
                            setLoading(true);
                            axios
                              .get(
                                `${Config.API_URL}/api/circles/pay/${active._id}`,
                                {
                                  headers: {
                                    Authorization: `Bearer ${token}`,
                                  },
                                },
                              )
                              .then(res => {
                                setLoading(false);
                                console.log(res.data);
                                Alert.alert(res.data.message.body);

                                dispatch(
                                  circleActions.generateCircles(
                                    token,
                                    profile.circles,
                                    active,
                                  ),
                                );
                              })
                              .catch(e => {
                                setLoading(false);
                                Alert.alert(
                                  `${e.response.data.message.body}`,
                                  '',
                                  [
                                    {
                                      text: 'Add funds to wallet',
                                      onPress: () => {
                                        navigation.navigate('Fund');
                                      },
                                    },
                                    {
                                      text: 'Go back',
                                      style: 'cancel',
                                    },
                                  ],
                                );
                              });
                          }}
                          style={[
                            {
                              marginTop: 55,
                              justifyContent: 'center',
                              alignItems: 'center',
                              height: 45,
                              width: '100%',
                              backgroundColor: '#E2A8FE',
                            },
                          ]}>
                          {loading ? (
                            <>
                              <ActivityIndicator
                                color={'#02000a'}
                                size={'small'}
                              />
                            </>
                          ) : (
                            <>
                              <Text
                                style={[
                                  styles.body,
                                  {fontSize: 15, color: '#02000A'},
                                ]}>
                                Pay Outstanding - ₦{separator(active.fee)}
                              </Text>
                            </>
                          )}
                        </TouchableOpacity>
                      </View>
                    </React.Fragment>
                  );
                }
              })}

              {/* <View
                style={{
                  backgroundColor: '#0A3C25',
                  borderRadius: 2,
                  height: '60%',
                  paddingLeft: 15,
                  paddingRight: 15,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Image
                  source={require('../../assets/images/forward-arrow.png')}
                  resizeMode="contain"
                  style={{width: 10, height: '40%'}}
                />
              </View> */}
            </View>
          </>
        )}
      </View>
    );
  } else {
    return (
      <View style={styles.container}>
        <ActivityIndicator color="white" size={'large'} />
      </View>
    );
  }
};

export default CircleDashboard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  absolute: {
    flexDirection: 'column',

    height: 150,
    width: '90%',
    borderRadius: 6,

    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 0,
  },
  transBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '90%',
    borderRadius: 5,
    backgroundColor: '#00000020',
    height: 50,
    marginTop: 20,

    paddingLeft: 20,
    paddingRight: 20,
  },
  incomeBg: {
    width: '50%',
    height: 30,
    borderRadius: 4,
    marginBottom: 15,
    paddingLeft: 20,
    paddingRight: 20,
    backgroundColor: '#42256D',
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
    fontFamily: 'Axiforma-Medium',
    fontSize: 29,
    color: 'black',
  },
  body: {
    fontFamily: 'Axiforma-Medium',
    fontSize: 14,
    color: '#000',
  },
});
