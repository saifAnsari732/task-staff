import React from 'react';
import { View, Text, Image } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Feather } from '@expo/vector-icons';
import AdminDashboardScreen from '../screens/admin/AdminDashboardScreen';
import AssignTaskScreen from '../screens/admin/AssignTaskScreen';
import ManageEmployeesScreen from '../screens/admin/ManageEmployeesScreen';
import ProfileScreen from '../screens/staff/ProfileScreen'; 
import { colors } from '../theme/colors';
import useAuthStore from '../store/useAuthStore';

const Tab = createBottomTabNavigator();

const ProfileAvatar = () => {
  const { user, role } = useAuthStore();
  const bg = colors.roles[role]?.accent || colors.roles[role]?.text || colors.primary;
  return (
    <View style={{ marginRight: 15, width: 36, height: 36, borderRadius: 18, backgroundColor: bg, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>{user?.name?.charAt(0) || 'U'}</Text>
    </View>
  );
};

export default function AdminNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: true,
        headerTitle: () => (
          <View style={{flexDirection: 'row', alignItems: 'center', marginLeft: 15}}>
            <Image source={require('../../assets/logo.png')} style={{width: 44, height: 44, marginRight: 0}} resizeMode="contain" />
            <Text style={{fontSize: 22, fontWeight: '800', color: colors.text, letterSpacing: 0.5}}>digiStaff</Text>
          </View>
        ),
        headerRight: () => <ProfileAvatar />,
        headerStyle: { 
          backgroundColor: '#A9F5E9',
          borderBottomLeftRadius: 20,
          borderBottomRightRadius: 20,
          elevation: 5,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 3 },
          shadowOpacity: 0.1,
          shadowRadius: 5,
        },
        headerTitleAlign: 'left',
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
        tabBarStyle: { 
          position: 'absolute',
          bottom: 15,
          left: 15,
          right: 15,
          backgroundColor: '#fff',
          borderRadius: 15,
          height: 60,
          paddingBottom: 5,
          paddingTop: 5,
          elevation: 10,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          borderTopWidth: 0
        }
      })}
    >
      <Tab.Screen name="Home" component={AdminDashboardScreen} />
      <Tab.Screen name="Tasks" component={AssignTaskScreen} />
      <Tab.Screen name="Employees" component={ManageEmployeesScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
