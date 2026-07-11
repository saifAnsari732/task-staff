import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { Feather, FontAwesome5 } from '@expo/vector-icons';
import { colors } from '../../../theme/colors';
import useTaskStore from '../../../store/useTaskStore';

export default function SocialMediaDashboard({ user, onActionPress }) {
  const { tasks, isLoading, fetchTasks } = useTaskStore();

  useEffect(() => {
    fetchTasks();
  }, []);

  const todayStr = new Date().toISOString().split('T')[0];
  const todayTasks = tasks.filter(t => t.date === todayStr);
  const postsToday = todayTasks.reduce((sum, t) => sum + 
    (Number(t.details?.youtubeCount) || 0) + 
    (Number(t.details?.facebookCount) || 0) + 
    (Number(t.details?.instagramCount) || 0) + 
    (Number(t.details?.linkedinCount) || 0)
  , 0);

  let activePlatforms = new Set();
  todayTasks.forEach(t => {
    if (Number(t.details?.youtubeCount) > 0) activePlatforms.add('YouTube');
    if (Number(t.details?.facebookCount) > 0) activePlatforms.add('Facebook');
    if (Number(t.details?.instagramCount) > 0) activePlatforms.add('Instagram');
    if (Number(t.details?.linkedinCount) > 0) activePlatforms.add('LinkedIn');
  });
  const platformsUsed = activePlatforms.size;

  const initial = user?.email ? user.email.charAt(0).toUpperCase() : 'S';
  const roleColor = colors.roles.social_media.text;
  const roleBg = colors.roles.social_media.bg;
  const accent = colors.roles.social_media.accent;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.topBar}>
        <View>
          <Text style={styles.greeting}>Welcome back,</Text>
          <Text style={styles.name}>{user?.name || user?.email?.split('@')[0] || 'Manager'}</Text>
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
          <Feather name="speaker" size={12} color={roleColor} />
          <Text style={[styles.roleText, {color: roleColor}]}>Social Media Manager</Text>
        </View>
        <Text style={styles.dateText}>{new Date().toLocaleDateString('en-US', {weekday: 'long', month: 'short', day: 'numeric'})}</Text>
      </View>

      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <View style={styles.statIconRow}>
            <Feather name="edit-3" size={16} color={colors.text} />
          </View>
          <Text style={styles.statValue}>{postsToday}</Text>
          <Text style={styles.statLabel}>Posts Today</Text>
        </View>

        <View style={styles.statCard}>
          <View style={styles.statIconRow}>
            <Feather name="share-2" size={16} color={colors.text} />
          </View>
          <Text style={styles.statValue}>{platformsUsed}</Text>
          <Text style={styles.statLabel}>Platforms Used</Text>
        </View>

        <View style={styles.statCard}>
          <View style={styles.statIconRow}>
            <Feather name="list" size={16} color={colors.text} />
          </View>
          <Text style={styles.statValue}>{tasks.length}</Text>
          <Text style={styles.statLabel}>Total Tasks</Text>
        </View>

        <View style={styles.statCard}>
          <View style={styles.statIconRow}>
            <Feather name="trending-up" size={16} color={colors.text} />
          </View>
          <Text style={styles.statValue}>{todayTasks.length}</Text>
          <Text style={styles.statLabel}>Tasks Today</Text>
        </View>
      </View>

      <TouchableOpacity style={[styles.submitBtn, {backgroundColor: accent}]} onPress={onActionPress}>
        <Feather name="file-text" size={18} color="#fff" />
        <Text style={styles.submitBtnText}>Submit Daily Posting Log</Text>
      </TouchableOpacity>

      <View style={styles.historyHeader}>
        <Text style={styles.sectionTitle}>Recent Posts</Text>
      </View>
      
      <View style={styles.taskList}>
        {isLoading && tasks.length === 0 ? (
          <ActivityIndicator size="small" color={accent} style={{padding: 20}} />
        ) : tasks.length === 0 ? (
          <Text style={{padding: 20, textAlign: 'center', color: colors.textLight}}>No posts logged yet.</Text>
        ) : (
          tasks.slice(0, 5).map((task) => (
            <View key={task._id} style={styles.taskItem}>
              <View style={[styles.taskStrip, {backgroundColor: accent}]} />
              <View style={styles.taskContent}>
                <Text style={styles.taskTitle}>{task.details?.contentType || 'Post'} Published</Text>
                <Text style={styles.taskSub}>{task.date}</Text>
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
  roleBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.roles.social_media.bg, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20, gap: 6 },
  roleText: { fontSize: 12, fontWeight: '700' },
  dateText: { color: colors.textLight, fontSize: 12, fontWeight: '500' },
  
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 12, marginBottom: 24 },
  statCard: { width: '48%', backgroundColor: colors.card, padding: 16, borderRadius: 12, borderWidth: 1, borderColor: colors.border },
  statIconRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  statSub: { fontSize: 10, color: colors.textLight, fontWeight: '600' },
  statValue: { fontSize: 24, fontWeight: '800', color: colors.text, marginBottom: 4 },
  statLabel: { fontSize: 11, color: colors.textLight, fontWeight: '600' },

  submitBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 14, borderRadius: 8, gap: 8, marginBottom: 24 },
  submitBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  
  chartCard: { backgroundColor: colors.card, padding: 20, borderRadius: 12, borderWidth: 1, borderColor: colors.border, marginBottom: 24, height: 200 },
  chartHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: colors.text },
  chartPlaceholder: { flex: 1, justifyContent: 'flex-end', paddingTop: 20 },
  chartAxis: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, marginBottom: 4 },
  axisLabel: { fontSize: 10, color: colors.textLight, fontWeight: '600' },
  chartLine: { height: 1, backgroundColor: colors.border },

  postCard: { backgroundColor: colors.card, padding: 12, borderRadius: 12, borderWidth: 1, borderColor: colors.border, flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 24 },
  mockImage: { width: 60, height: 60, borderRadius: 8, backgroundColor: '#E2E8F0' },
  postContent: { flex: 1 },
  postMeta: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 4 },
  postMetaText: { fontSize: 10, color: colors.textLight, fontWeight: '600' },
  postTitle: { fontSize: 14, fontWeight: '700', color: colors.text, marginBottom: 8 },
  postStatsRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  postStatText: { fontSize: 11, color: colors.textLight, fontWeight: '600' },

  historyHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  viewAll: { fontSize: 12, fontWeight: '700', color: colors.primary },
  
  taskList: { gap: 10 },
  taskItem: { backgroundColor: colors.card, borderRadius: 8, borderWidth: 1, borderColor: colors.border, flexDirection: 'row', alignItems: 'center', paddingRight: 16, overflow: 'hidden' },
  taskStrip: { width: 4, height: '100%' },
  taskContent: { flex: 1, paddingVertical: 12, paddingHorizontal: 12 },
  taskTitle: { fontSize: 14, fontWeight: '600', color: colors.text, marginBottom: 4 },
  taskSub: { fontSize: 11, color: colors.textLight },
  radioOutline: { width: 20, height: 20, borderRadius: 10, borderWidth: 1, borderColor: colors.border }
});
