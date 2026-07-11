import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Feather } from '@expo/vector-icons';
import StaffHomeScreen from '../screens/staff/StaffHomeScreen';
import TaskSubmissionScreen from '../screens/staff/TaskSubmissionScreen';
import TaskHistoryScreen from '../screens/staff/TaskHistoryScreen';
import ProfileScreen from '../screens/staff/ProfileScreen';
import { colors } from '../theme/colors';

const Tab = createBottomTabNavigator();

export default function StaffNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'Home') iconName = 'home';
          else if (route.name === 'Tasks') iconName = 'clipboard';
          else if (route.name === 'History') iconName = 'clock';
          else if (route.name === 'Profile') iconName = 'user';
          return <Feather name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textLight,
        tabBarStyle: { paddingBottom: 5, paddingTop: 5, height: 60, elevation: 8 }
      })}
    >
      <Tab.Screen name="Home" component={StaffHomeScreen} />
      <Tab.Screen name="Tasks" component={TaskSubmissionScreen} />
      <Tab.Screen name="History" component={TaskHistoryScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
