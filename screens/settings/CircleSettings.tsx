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
import {useSelector} from 'react-redux';
import {RootState} from '../../src/reducers';
import {Props, SettingItemProps} from '../../types';
import SettingItem from './SettingItem';

const CircleSettings = ({navigation, route}: Props) => {
  const active = useSelector((state: RootState) => state.circleReducer.active);
  const profile = useSelector((state: RootState) => state.userReducer.profile);
  const [paused, setPaused] = useState(false);
  const [started, setStarted] = useState(false);
  const [owner, setOwner] = useState(false);
  //@ts-ignore
  const {round, expires, fee, capacity, members, _id} = active;

  useEffect(() => {
    // if (round.count - 1 == capacity) {
    //   setEnded(true);
    // }
    setStarted(active.started);
    if (active.paused) {
      setPaused(true);
    }
    setOwner(active._creator?.toString() == profile._id?.toString());
  }, [active]);

  return (
    <View style={styles.container}>
      <View style={{marginTop: 30}}>
        {owner && paused == true ? (
          <>
            <SettingItem
              title={`Edit ${active.circlename}`}
              next="EditCircle"
              params={active}
            />
          </>
        ) : (
          <></>
        )}

        {/* <SettingItem title="Lock Circle" toggle={true} /> */}
        <SettingItem title="Members" next="ViewMembers" params={active} />
        <SettingItem
          title="Invite a member"
          next="InviteMembers"
          params={active}
        />

        {started && !paused && owner ? (
          <View
            style={{
              marginTop: 20,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text
              style={[
                styles.body,
                {
                  lineHeight: 25,
                  textAlign: 'center',
                  color: '#FFFFFF',

                  marginBottom: 5,
                  marginTop: 5,
                },
              ]}>
              You can't edit or delete this circle until the ajo ends.
            </Text>
          </View>
        ) : (
          <>
            {owner && (
              <>
                <SettingItem
                  title="Delete Circle"
                  owner={owner}
                  deletable
                  paused={paused}
                />
              </>
            )}
          </>
        )}

        {started && !paused && !owner ? (
          <View
            style={{
              marginTop: 20,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text
              style={[
                styles.body,
                {
                  lineHeight: 25,
                  textAlign: 'center',
                  color: '#FFFFFF',

                  marginBottom: 5,
                  marginTop: 5,
                },
              ]}>
              You can't leave this circle until the ajo ends.
            </Text>
          </View>
        ) : (
          <>
            {!owner && (
              <>
                <SettingItem
                  title="Leave Circle"
                  owner={owner}
                  deletable
                  paused={paused}
                />
              </>
            )}
          </>
        )}
      </View>
    </View>
  );
};

export default CircleSettings;

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
