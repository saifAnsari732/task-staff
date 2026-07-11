import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Feather } from '@expo/vector-icons';
import AdminDashboardScreen from '../screens/admin/AdminDashboardScreen';
import AssignTaskScreen from '../screens/admin/AssignTaskScreen';
import ManageEmployeesScreen from '../screens/admin/ManageEmployeesScreen';
import ProfileScreen from '../screens/staff/ProfileScreen'; 
import { colors } from '../theme/colors';

const Tab = createBottomTabNavigator();

export default function AdminNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'Home') iconName = 'home';
          else if (route.name === 'Tasks') iconName = 'clipboard';
          else if (route.name === 'Employees') iconName = 'users';
          else if (route.name === 'Profile') iconName = 'user';
          return <Feather name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textLight,
        tabBarStyle: { paddingBottom: 5, paddingTop: 5, height: 60, elevation: 8 }
      })}
    >
      <Tab.Screen name="Home" component={AdminDashboardScreen} />
      <Tab.Screen name="Tasks" component={AssignTaskScreen} />
      <Tab.Screen name="Employees" component={ManageEmployeesScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
