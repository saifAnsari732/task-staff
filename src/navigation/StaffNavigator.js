import React, { useEffect } from 'react';
import { View, Text, Image } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Feather } from '@expo/vector-icons';
import StaffHomeScreen from '../screens/staff/StaffHomeScreen';
import TaskSubmissionScreen from '../screens/staff/TaskSubmissionScreen';
import TaskHistoryScreen from '../screens/staff/TaskHistoryScreen';
import ProfileScreen from '../screens/staff/ProfileScreen';
import { colors } from '../theme/colors';
import useAuthStore from '../store/useAuthStore';

const Tab = createBottomTabNavigator();

const ProfileAvatar = () => {
  const { user, role } = useAuthStore();
  const bg = colors.roles[role]?.accent || colors.roles[role]?.text || colors.primary;
  return (
    <View style={{ marginRight: 15, width: 36, height: 36, borderRadius: 18, backgroundColor: bg, justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>
      {user?.profilePic ? (
        <Image source={{ uri: user.profilePic }} style={{ width: 36, height: 36 }} />
      ) : (
        <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>{user?.name?.charAt(0) || 'U'}</Text>
      )}
    </View>
  );
};

export default function StaffNavigator() {
  const fetchProfile = useAuthStore(state => state.fetchProfile);

  useEffect(() => {
    fetchProfile();
  }, []);

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
          else if (route.name === 'History') iconName = 'clock';
          else if (route.name === 'Profile') iconName = 'user';
          return <Feather name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textLight,
        tabBarStyle: { 
          height: 99,
          paddingBottom: 15,
          paddingTop: 10,
          elevation: 8,
          backgroundColor: '#ffffff',
          borderTopWidth: 1,
          borderColor: colors.border
        }
      })}
    >
      <Tab.Screen name="Home" component={StaffHomeScreen} />
      <Tab.Screen name="Tasks" component={TaskSubmissionScreen} />
      <Tab.Screen name="History" component={TaskHistoryScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
