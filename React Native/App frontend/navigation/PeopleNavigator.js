import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';

// Import navigation and screens
import ViewPeopleScreen from '../screens/ViewPeopleScreen';

// Import styling and components
import Styles from "../styles/MainStyle";
import ViewPersonScreen from '../screens/Viewpersonscreen';
import EditPersonScreen from '../screens/EditPersonscreen';

const Stack = createStackNavigator();

export default function PeopleNavigator() {
  return (
    <Stack.Navigator 
      initialRouteName="ViewPeople"
      screenOptions={{
        headerShown: true,
        headerBackTitle: "Back",
        headerStyle: Styles.headerBar,
        headerTitleStyle: Styles.headerBarTitle,
      }}>
      <Stack.Screen
        name="ViewPeople"
        component={ViewPeopleScreen}
        options={{ title: 'View All People' }} />
        <Stack.Screen
        name="ViewPerson"
        component={ViewPersonScreen}
        options={{ title: 'View Person' }} />
        <Stack.Screen
        name="EditPerson"
        component={EditPersonScreen}
        options={{ title: 'Edit Person' }} />
    </Stack.Navigator>
  );
}