import React from 'react';
import { View, StyleSheet } from 'react-native';
import useAuthStore from '../../store/useAuthStore';
import DeveloperDashboard from './dashboards/DeveloperDashboard';
import SocialMediaDashboard from './dashboards/SocialMediaDashboard';
import TelecallerDashboard from './dashboards/TelecallerDashboard';
import VideoEditorDashboardComponent from './dashboards/VideoEditorDashboard';

export default function StaffHomeScreen({ navigation }) {
  const { user, role } = useAuthStore();

  const handleActionPress = () => {
    navigation.navigate('Tasks');
  };

  const renderDashboard = () => {
    switch (role) {
      case 'developer':
        return <DeveloperDashboard user={user} onActionPress={handleActionPress} />;
      case 'social_media':
        return <SocialMediaDashboard user={user} onActionPress={handleActionPress} />;
      case 'telecaller':
        return <TelecallerDashboard user={user} onActionPress={handleActionPress} />;
      case 'video_editor':
        return <VideoEditorDashboardComponent user={user} onActionPress={handleActionPress} />;
      default:
        return <DeveloperDashboard user={user} onActionPress={handleActionPress} />;
    }
  };

  return (
    <View style={styles.container}>
      {renderDashboard()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 }
});
