import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Register } from './src/pages';
import { RootZone } from './src/pages';
import { Login } from './src/pages'
import { MainPage } from './src/pages'
import { SingleItem } from './src/pages'
import { NavigationContainer, StackActions } from '@react-navigation/native'
import React, { useState } from 'react'
import { createStackNavigator } from '@react-navigation/stack';
const Stack = createStackNavigator();

function Home({ navigation }) {

  return (
    <View style={styles.container}>
      <Register navigation={navigation} />
      <StatusBar style="auto" />
    </View>
  )
}

export default function App() {


  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Login'>
        <Stack.Screen name='Login' component={Login} />
        <Stack.Screen name='Register' component={Register} />
        <Stack.Screen name='RootZone' component={RootZone}/>
        <Stack.Screen name='Home' component={Home} />
        <Stack.Screen name='MainPage' component={MainPage} />
        <Stack.Screen name='SingleItem' component={SingleItem} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },

});
