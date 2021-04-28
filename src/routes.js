import React from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const { Navigator, Screen } = createStackNavigator();

import Main from './pages/Landing/index';
import Query from './pages/SearchPokemon/index';

export default function Routes() {
  return (
    <NavigationContainer>
      <Navigator
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: '#F2F3F5' }
        }}>

        <Screen
          name="Main"
          component={Main}
        //options={{headerShown: false}}
        />

        <Screen
          name="Query"
          component={Query}
        />
      </Navigator>
    </NavigationContainer>
  );
}