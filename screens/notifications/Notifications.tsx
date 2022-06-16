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
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../src/reducers';
import {Props, SettingItemProps} from '../../types';
import NotificationItem from './NotificationItem';

const Notifications = () => {
  const dispatch = useDispatch();
  const token = useSelector(state => state.authReducer.token);
  const _id = useSelector((state: RootState) => state.authReducer.userId);
  const profile = useSelector((state: RootState) => state.userReducer.profile);
  const requesting = useSelector(
    (state: RootState) => state.userReducer.requesting,
  );

  useEffect(() => {}, []);
  return (
    <View style={styles.container}>
      {profile.notifications.length == 0 && (
        <>
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
                marginTop: 20,
              },
            ]}>
            It's really quiet in here. You don't have any notifications yet.
          </Text>
        </>
      )}
      <ScrollView>
        {profile.notifications.sort((a: any, b: any) => new Date(b.createdAt) - new Date(a.createdAt)).map((notification: any, idx: number) => {
          return (
            <NotificationItem
              key={idx}
              title={notification.title}
              content={notification.content}
              day={notification.createdAt}
            />
          );
        })}
      </ScrollView>
    </View>
  );
};

export default Notifications;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
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
