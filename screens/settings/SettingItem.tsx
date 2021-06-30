import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  ImageBackground,
  Text,
  Alert,
  TextInput,
  useColorScheme,
  View,
  Switch,
  Button,
  TouchableOpacity,
  TouchableHighlight,
  Image,
} from 'react-native';
import {Props, SettingItemProps} from '../../types';

const SettingItem = ({
  title,
  toggle,
  next,
  deletable,
  member,
  params,
}: SettingItemProps) => {
  const navigation = useNavigation();
  const [isEnabled, setIsEnabled] = useState<boolean>(false);
  const [p, setP] = useState<object>({});
  const toggleSwitch = () => {
    setIsEnabled(!isEnabled);
  };

  useEffect(() => {
    if (params) {
      setP(params);
    }
  }, [params]);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => {
          if (toggle) {
            setIsEnabled(!isEnabled);
            // `${p ? ',' + {...p} : null}`
          }
          if (member) {
            Alert.alert(`${title}`, '', [
              {
                text: 'Issue Payment Warning (1)',
                onPress: () =>
                  Alert.alert(
                    "You've issued a first warning ",
                    `This member will be deactivated from your circle 72 hours after a second warning`,
                  
                    ),
              },
              {
                text: `Deactivate ${title}`,
                onPress: () => console.log('Deactivated'),
              },
              {
                text: `Remove ${title}`,
                style: 'destructive',
                onPress: () => console.log('Removed'),
              },
              {
                text: 'Cancel',
                onPress: () => console.log('Canceled'),
                style: 'cancel',
              },
            ]);
          } else {
            navigation.navigate(`${next}`, params ? params : undefined);
          }
        }}
        activeOpacity={0.8}
        style={styles.highlighter}>
        <Text
          style={!deletable ? styles.body : [styles.body, {color: '#D03B3B'}]}>
          {title}
        </Text>
        {toggle ? (
          <>
            <Switch
              trackColor={{false: 'red', true: '#0A3C25'}}
              thumbColor={isEnabled ? '#ffffff' : '#f4f3f4'}
              ios_backgroundColor="#ffffff90"
              onValueChange={toggleSwitch}
              value={isEnabled}
            />
          </>
        ) : (
          <>
            <Image
              source={require('../../assets/images/forward-arrow.png')}
              resizeMode="contain"
              style={{width: 10, height: '60%'}}
            />
          </>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default SettingItem;

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
  },
  highlighter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    width: '100%',
    height: 60,
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
    fontFamily: 'Axiforma Heavy',
    fontSize: 29,
    color: 'white',
  },
  body: {
    fontFamily: 'Axiforma Medium',
    fontSize: 14,
    color: 'white',
  },
});
