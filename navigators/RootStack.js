import React from 'react';

import { Colors } from './../components/styles'
const { primary, tertiary } = Colors;

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Login from './../screens/Login';
import Signup from './../screens/Signup';
import Welcome from './../screens/Welcome';

const Stack = createStackNavigator();

const RootStack = () => {
	return (
		<NavigationContainer>
			<Stack.Navigator
				screenOptions={{
					headerStyled: {
						backgroundColour: 'transparent'
					},
					headerTintColor: tertiary,
					headerTransparent: true,
					headerTitle: '',
					headerLeftContaierStyle: {
						paddingLeft: 20
					}
				}}
				initialRouteName="login"
			>
				<Stack.Screen name="Login" component={Login} />
				<Stack.Screen name="Signup" component={Signup} />
				<Stack.Screen name="Welcome" component={Welcome} />
			</Stack.Navigator>
		</NavigationContainer>
	)
}

export default RootStack;