import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import useAuthStore from '../store/useAuthStore';
import AuthNavigator from './AuthNavigator';
import StaffNavigator from './StaffNavigator';
import AdminNavigator from './AdminNavigator';

export default function AppNavigator() {
  const { user, role } = useAuthStore();

  return (
    <NavigationContainer>
      {!user ? (
        <AuthNavigator />
      ) : role === 'admin' ? (
        <AdminNavigator />
      ) : (
        <StaffNavigator />
      )}
    </NavigationContainer>
  );
}
