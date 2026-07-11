import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import { colors } from '../../../theme/colors';
import useTaskStore from '../../../store/useTaskStore';

export default function VideoEditorDashboard({ user, onActionPress }) {
  const { tasks, isLoading, fetchTasks } = useTaskStore();
  const accent = colors.roles.video_editor.text;

  useEffect(() => {
    fetchTasks();
  }, []);

  const todayStr = new Date().toISOString().split('T')[0];
  const todayTasks = tasks.filter(t => t.date === todayStr);
  
  const videosToday = todayTasks.length;
  const minutesToday = todayTasks.reduce((sum, t) => sum + (Number(t.details?.duration) || 0), 0);
  const reelsToday = todayTasks.filter(t => t.details?.videoType === 'Reel').length;
  const longToday = todayTasks.filter(t => t.details?.videoType === 'Long Video').length;

  const initial = user?.email ? user.email.charAt(0).toUpperCase() : 'V';
  const roleColor = colors.roles.video_editor.text;
  const roleBg = colors.roles.video_editor.bg;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.topBar}>
        <View>
          <Text style={styles.greeting}>Welcome back,</Text>
          <Text style={styles.name}>{user?.name || user?.email?.split('@')[0] || 'Editor'}</Text>
        </View>
        <TouchableOpacity style={styles.avatarContainer}>
          {user?.profilePic ? (
            <Image source={{ uri: user.profilePic }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatar, {backgroundColor: accent}]}>
              <Text style={styles.avatarText}>{initial}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
      
      <View style={styles.subHeaderRow}>
        <View style={styles.roleBadge}>
          <Feather name="video" size={12} color={roleColor} />
          <Text style={[styles.roleText, {color: roleColor}]}>Video Editor</Text>
        </View>
        <Text style={styles.dateText}>{new Date().toLocaleDateString('en-US', {weekday: 'long', month: 'short', day: 'numeric'})}</Text>
      </View>

      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>VIDEOS (TODAY)</Text>
          <View style={styles.statRow}>
            <Text style={styles.statValue}>{videosToday}</Text>
            <Feather name="check-circle" size={18} color={roleColor} />
          </View>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statLabel}>MINUTES (TODAY)</Text>
          <View style={styles.statRow}>
            <Text style={styles.statValue}>{minutesToday}</Text>
            <Feather name="clock" size={18} color={roleColor} />
          </View>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statLabel}>REELS (TODAY)</Text>
          <View style={styles.statRow}>
            <Text style={styles.statValue}>{reelsToday}</Text>
            <Feather name="smartphone" size={18} color={roleColor} />
          </View>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statLabel}>LONG VIDEOS (TODAY)</Text>
          <View style={styles.statRow}>
            <Text style={styles.statValue}>{longToday}</Text>
            <Feather name="monitor" size={18} color={roleColor} />
          </View>
        </View>
      </View>

      <TouchableOpacity style={[styles.submitBtn, {backgroundColor: roleColor}]} onPress={onActionPress}>
        <Feather name="edit" size={18} color="#fff" />
        <Text style={styles.submitBtnText}>Submit Daily Edit Log</Text>
      </TouchableOpacity>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Recent Edits</Text>
      </View>
      
      <View style={styles.taskList}>
        {isLoading && tasks.length === 0 ? (
          <ActivityIndicator size="small" color={accent} style={{padding: 20}} />
        ) : tasks.length === 0 ? (
          <Text style={{padding: 20, textAlign: 'center', color: colors.textLight}}>No videos logged yet.</Text>
        ) : (
          tasks.slice(0, 5).map((task) => (
            <View key={task._id} style={styles.taskItem}>
              <View style={[styles.taskStrip, {backgroundColor: accent}]} />
              <View style={styles.taskContent}>
                <Text style={styles.taskTitle}>{task.details?.projectName || 'Video Project'}</Text>
                <Text style={styles.taskSub}>{task.date} • {task.details?.duration || 0} mins ({task.details?.videoType || 'Video'})</Text>
              </View>
              <Feather name="check-circle" size={20} color={accent} />
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20, paddingTop: 40, paddingBottom: 90 },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  greeting: { fontSize: 14, color: colors.textLight, marginBottom: 2 },
  name: { fontSize: 24, fontWeight: '800', color: colors.text, textTransform: 'capitalize' },
  avatarContainer: { elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
  avatar: { width: 44, height: 44, borderRadius: 22, overflow: 'hidden', justifyContent: 'center', alignItems: 'center' },
  avatarText: { color: '#fff', fontSize: 18, fontWeight: '700' },
  
  subHeaderRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 },
  roleBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.roles.video_editor.bg, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20, gap: 6 },
  roleText: { fontSize: 12, fontWeight: '700' },
  dateText: { color: colors.textLight, fontSize: 12, fontWeight: '500' },
  
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 12, marginBottom: 24 },
  statCard: { width: '48%', backgroundColor: colors.card, padding: 16, borderRadius: 12, borderWidth: 1, borderColor: colors.border },
  statLabel: { fontSize: 10, color: colors.textLight, fontWeight: '700', letterSpacing: 0.5, marginBottom: 8 },
  statRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  statValue: { fontSize: 24, fontWeight: '800', color: colors.text },

  submitBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 14, borderRadius: 8, gap: 8, marginBottom: 24 },
  submitBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: colors.text },
  viewAll: { fontSize: 12, fontWeight: '700', color: colors.primary },

  projectCard: { backgroundColor: colors.card, borderRadius: 12, borderWidth: 1, borderColor: colors.border, overflow: 'hidden', marginBottom: 24 },
  thumbnailContainer: { height: 160, backgroundColor: '#1E293B', position: 'relative' },
  mockThumbnail: { flex: 1, opacity: 0.8 },
  timeBadge: { position: 'absolute', bottom: 12, left: 12, backgroundColor: 'rgba(0,0,0,0.6)', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  timeBadgeText: { color: '#fff', fontSize: 10, fontWeight: '600' },
  playBadge: { position: 'absolute', bottom: 12, right: 12 },
  projectInfo: { padding: 16 },
  projectTitleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  projectTitle: { fontSize: 15, fontWeight: '700', color: colors.text, flex: 1 },
  statusBadge: { backgroundColor: colors.roles.admin.bg, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 },
  statusText: { color: colors.primary, fontSize: 10, fontWeight: '600' },
  projectDesc: { fontSize: 12, color: colors.textLight, lineHeight: 18, marginBottom: 16 },
  outlineBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 12, borderRadius: 8, borderWidth: 1, gap: 8 },
  outlineBtnText: { fontWeight: '700', fontSize: 13 },

  queueList: { gap: 12 },
  queueItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.card, padding: 12, borderRadius: 12, borderWidth: 1, borderColor: colors.border, gap: 12 },
  queueIconBox: { width: 40, height: 40, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  queueContent: { flex: 1 },
  queueTitle: { fontSize: 14, fontWeight: '600', color: colors.text, marginBottom: 2 },
  queueMeta: { fontSize: 11, color: colors.textLight }
});
