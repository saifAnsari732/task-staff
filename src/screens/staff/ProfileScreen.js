import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, ActivityIndicator, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import useAuthStore from '../../store/useAuthStore';
import { colors } from '../../theme/colors';

export default function ProfileScreen() {
  const { user, role, logout } = useAuthStore();

  const getRoleTheme = () => {
    if (role === 'admin') return colors.roles.admin;
    if (role === 'developer') return colors.roles.developer;
    if (role === 'telecaller') return colors.roles.telecaller;
    if (role === 'video_editor') return colors.roles.video_editor;
    if (role === 'social_media') return colors.roles.social_media;
    return { text: colors.primary, bg: colors.secondary };
  };

  const theme = getRoleTheme();
  const initial = user?.name ? user.name.charAt(0).toUpperCase() : (user?.email ? user.email.charAt(0).toUpperCase() : 'U');

  const handleImagePick = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });
    
    if (!result.canceled && result.assets[0].uri) {
      const success = await useAuthStore.getState().updateProfilePic(result.assets[0].uri);
      if (success) {
        Alert.alert('Success', 'Profile picture updated successfully');
      } else {
        Alert.alert('Error', useAuthStore.getState().error || 'Failed to update picture');
      }
    }
  };

  const renderOption = (icon, title, subtitle) => (
    <TouchableOpacity style={styles.optionRow}>
      <View style={[styles.iconWrapper, { backgroundColor: theme.bg }]}>
        <Feather name={icon} size={18} color={theme.text} />
      </View>
      <View style={styles.optionTextContainer}>
        <Text style={styles.optionTitle}>{title}</Text>
        {subtitle && <Text style={styles.optionSubtitle}>{subtitle}</Text>}
      </View>
      <Feather name="chevron-right" size={20} color={colors.textLight} />
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingTop: 40, paddingBottom: 90 }} showsVerticalScrollIndicator={false}>
      {/* Header Profile Section */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.avatarContainer} onPress={handleImagePick}>
          {useAuthStore.getState().isLoading ? (
            <View style={[styles.avatar, { backgroundColor: theme.text, opacity: 0.7 }]}>
              <ActivityIndicator color="#fff" />
            </View>
          ) : user?.profilePic ? (
            <Image source={{ uri: user.profilePic }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatar, { backgroundColor: theme.text }]}>
              <Text style={styles.avatarText}>{initial}</Text>
            </View>
          )}
          
          <View style={styles.editBadge}>
            <Feather name="camera" size={12} color="#fff" />
          </View>
        </TouchableOpacity>
        <Text style={styles.name}>{user?.email?.split('@')[0] || 'User'}</Text>
        <Text style={styles.email}>{user?.email}</Text>
        <View style={[styles.roleBadge, { backgroundColor: theme.bg }]}>
          <Text style={[styles.roleBadgeText, { color: theme.text }]}>
            {role ? role.replace('_', ' ').toUpperCase() : 'STAFF'}
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>General Settings</Text>
        <View style={styles.card}>
          {renderOption('user', 'Account Details', 'Update your personal info')}
          <View style={styles.divider} />
          {renderOption('bell', 'Notifications', 'Manage alerts & reminders')}
          <View style={styles.divider} />
          {renderOption('shield', 'Privacy & Security', 'Password and authentication')}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preferences & Support</Text>
        <View style={styles.card}>
          {renderOption('moon', 'Theme', 'System default')}
          <View style={styles.divider} />
          {renderOption('help-circle', 'Help & Support', 'FAQs and contact info')}
        </View>
      </View>

      <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
        <Feather name="log-out" size={18} color="#EF4444" />
        <Text style={styles.logoutBtnText}>Sign Out from TaskFlow</Text>
      </TouchableOpacity>
      
      <Text style={styles.versionText}>TaskFlow App Version 1.0.0</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { alignItems: 'center', paddingVertical: 40, backgroundColor: colors.card, borderBottomWidth: 1, borderBottomColor: colors.border },
  avatarContainer: { position: 'relative', marginBottom: 16 },
  avatar: { width: 90, height: 90, borderRadius: 45, justifyContent: 'center', alignItems: 'center', elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.15, shadowRadius: 4, backgroundColor: '#E2E8F0' },
  avatarText: { fontSize: 36, fontWeight: 'bold', color: '#FFF' },
  editBadge: { position: 'absolute', bottom: 0, right: 0, width: 28, height: 28, backgroundColor: colors.primary, borderRadius: 14, borderWidth: 3, borderColor: colors.card, justifyContent: 'center', alignItems: 'center', elevation: 5 },
  name: { fontSize: 24, fontWeight: '800', color: colors.text, marginBottom: 4, textTransform: 'capitalize' },
  email: { fontSize: 14, color: colors.textLight, marginBottom: 12 },
  roleBadge: { paddingHorizontal: 16, paddingVertical: 6, borderRadius: 20 },
  roleBadgeText: { fontSize: 11, fontWeight: '700', letterSpacing: 0.5 },
  
  section: { paddingHorizontal: 20, marginTop: 24 },
  sectionTitle: { fontSize: 13, fontWeight: '700', color: colors.textLight, letterSpacing: 0.5, marginBottom: 10, textTransform: 'uppercase', marginLeft: 4 },
  card: { backgroundColor: colors.card, borderRadius: 16, borderWidth: 1, borderColor: colors.border, overflow: 'hidden' },
  optionRow: { flexDirection: 'row', alignItems: 'center', padding: 16 },
  iconWrapper: { width: 36, height: 36, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  optionTextContainer: { flex: 1, marginLeft: 16 },
  optionTitle: { fontSize: 15, fontWeight: '600', color: colors.text, marginBottom: 2 },
  optionSubtitle: { fontSize: 12, color: colors.textLight },
  divider: { height: 1, backgroundColor: colors.border, marginLeft: 68 },
  
  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FEF2F2', marginHorizontal: 20, marginTop: 30, paddingVertical: 16, borderRadius: 12, borderWidth: 1, borderColor: '#FCA5A5', gap: 10 },
  logoutBtnText: { color: '#EF4444', fontWeight: '700', fontSize: 15 },
  versionText: { textAlign: 'center', marginTop: 20, fontSize: 12, color: colors.textLight, fontWeight: '500' }
});
