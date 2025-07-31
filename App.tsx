import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import HomeScreen from './screens/HomeScreen';
import DiscoverScreen from './screens/DiscoverScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer theme={{ colors: { background: '#000', card: '#000', text: '#fff', border: '#333', primary: '#0af', notification: '#0af' } } as any}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarStyle: { backgroundColor: '#000', borderTopColor: '#111' },
          tabBarActiveTintColor: '#fff',
          tabBarInactiveTintColor: '#555',
          tabBarIcon: ({ color, size }) => {
            let iconName: keyof typeof Ionicons.glyphMap = 'search';
            if (route.name === 'Home') iconName = 'search';
            else if (route.name === 'Discover') iconName = 'newspaper';
            else if (route.name === 'Placeholder') iconName = 'ellipse';
            return <Ionicons name={iconName} size={size} color={color} />;
          },
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Discover" component={DiscoverScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}