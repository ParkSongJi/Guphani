import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AppContent from './AppContent';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false }}> 
        <Stack.Screen name="AppContent" component={AppContent}/>
        </Stack.Navigator>
    </NavigationContainer>
  );
};  

export default App;



