import {useNavigation} from '@react-navigation/native';
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
import {Props} from '../../types';

const CreateCircle = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.body}>Circle Name</Text>
      <TextInput
        style={[styles.input, styles.body]}
        placeholder="Circle Name"
        placeholderTextColor="#ffffff60"
      />
      <Text style={styles.body}>Circle Duration</Text>
      <TextInput
        style={[styles.input, styles.body]}
        placeholder="Circle Duration"
        placeholderTextColor="#ffffff60"
      />
      <Text style={styles.body}>Round Duration</Text>
      <TextInput
        style={[styles.input, styles.body]}
        placeholder="Round Duration"
        placeholderTextColor="#ffffff60"
      />

      <Text style={styles.body}>Contribution Frequency</Text>
      <TextInput
        style={[styles.input, styles.body]}
        placeholder="Contribution Frequency"
        placeholderTextColor="#ffffff60"
      />
      <Text style={styles.body}>Contribution Fee</Text>
      <TextInput
        style={[styles.input, styles.body]}
        placeholder="Contribution Fee"
        placeholderTextColor="#ffffff60"
      />
      <Text style={styles.body}>Circle Capacity</Text>
      <TextInput
        style={[styles.input, styles.body]}
        placeholder="Circle Capacity"
        placeholderTextColor="#ffffff60"
      />
    </View>
  );
};

export default CreateCircle;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#1C1C1C',
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
