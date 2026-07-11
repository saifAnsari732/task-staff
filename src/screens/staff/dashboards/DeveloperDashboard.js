import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import { colors } from '../../../theme/colors';
import useTaskStore from '../../../store/useTaskStore';

export default function DeveloperDashboard({ user, onActionPress }) {
  const { tasks, isLoading, fetchTasks } = useTaskStore();

  useEffect(() => {
    fetchTasks();
  }, []);

  const todayStr = new Date().toISOString().split('T')[0];
  const todayTasks = tasks.filter(t => t.date === todayStr);
  const tasksToday = todayTasks.length;
  const hoursToday = todayTasks.reduce((sum, t) => sum + (Number(t.details?.hoursWorked) || 0), 0);
  const bugsFixedToday = todayTasks.reduce((sum, t) => sum + (Number(t.details?.bugsFixed) || 0), 0);

  const initial = user?.email ? user.email.charAt(0).toUpperCase() : 'D';

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.topBar}>
        <View>
          <Text style={styles.greeting}>Welcome back,</Text>
          <Text style={styles.name}>{user?.name || user?.email?.split('@')[0] || 'Developer'}</Text>
        </View>
        <TouchableOpacity style={styles.avatarContainer}>
          {user?.profilePic ? (
            <Image source={{ uri: user.profilePic }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatar, {backgroundColor: colors.primary}]}>
              <Text style={styles.avatarText}>{initial}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
      <View style={styles.subHeaderRow}>
        <View style={styles.roleBadge}>
          <Feather name="code" size={12} color={colors.primary} />
          <Text style={styles.roleText}>Developer</Text>
        </View>
        <Text style={styles.dateText}>{new Date().toLocaleDateString('en-US', {weekday: 'long', month: 'short', day: 'numeric'})}</Text>
      </View>

      <TouchableOpacity style={styles.submitBtn} onPress={onActionPress}>
        <Feather name="check-circle" size={18} color={colors.card} />
        <Text style={styles.submitBtnText}>Submit Daily Task</Text>
      </TouchableOpacity>

      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>TASKS TODAY</Text>
          <Text style={styles.statValue}>{tasksToday}</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>HOURS TODAY</Text>
          <Text style={styles.statValue}>{hoursToday}</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>BUGS FIXED</Text>
          <Text style={styles.statValue}>{bugsFixedToday}</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>TOTAL TASKS</Text>
          <Text style={styles.statValue}>{tasks.length}</Text>
        </View>
      </View>

      <View style={styles.historyHeader}>
        <Text style={styles.sectionTitle}>Recent History</Text>
      </View>
      
      <View style={styles.historyCard}>
        {isLoading && tasks.length === 0 ? (
          <ActivityIndicator size="small" color={colors.primary} style={{padding: 16}} />
        ) : tasks.length === 0 ? (
          <Text style={{padding: 16, color: colors.textLight, textAlign: 'center'}}>No recent tasks</Text>
        ) : (
          tasks.slice(0, 5).map((item, idx) => (
            <View key={item._id} style={[styles.historyItem, idx > 0 && styles.historyBorder]}>
              <View style={styles.historyIconBox}>
                <Feather name="check-circle" size={16} color={colors.primary} />
              </View>
              <View style={{flex: 1}}>
                <Text style={styles.historyTitle} numberOfLines={1}>
                  {item.details?.projectName || item.details?.taskAssigned || 'Developer Task'}
                </Text>
                <Text style={styles.historyTime}>
                  {item.date} {item.details?.hoursWorked ? `• ${item.details.hoursWorked}h` : ''}
                </Text>
              </View>
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
  roleBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.roles.developer.bg, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6, gap: 6 },
  roleText: { color: colors.primary, fontSize: 12, fontWeight: '700' },
  dateText: { color: colors.textLight, fontSize: 12, fontWeight: '500' },
  
  submitBtn: { backgroundColor: colors.primary, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 14, borderRadius: 8, gap: 8, marginBottom: 24 },
  submitBtnText: { color: colors.card, fontWeight: '700', fontSize: 15 },

  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 12, marginBottom: 24 },
  statCard: { width: '48%', backgroundColor: colors.card, padding: 16, borderRadius: 12, borderWidth: 1, borderColor: colors.border },
  statLabel: { fontSize: 10, color: colors.textLight, fontWeight: '700', letterSpacing: 0.5, marginBottom: 4 },
  statValue: { fontSize: 28, fontWeight: '800', color: colors.primary },

  sectionTitle: { fontSize: 18, fontWeight: '800', color: colors.text, marginBottom: 12 },
  focusCard: { backgroundColor: colors.card, padding: 20, borderRadius: 12, borderWidth: 1, borderColor: colors.border, marginBottom: 24 },
  focusHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  tag: { backgroundColor: colors.primary, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 },
  tagText: { color: colors.card, fontSize: 10, fontWeight: '700' },
  estBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.roles.developer.bg, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4, gap: 4 },
  estText: { color: colors.text, fontSize: 11, fontWeight: '600' },
  focusTitle: { fontSize: 18, fontWeight: '700', color: colors.text, marginBottom: 8, lineHeight: 24 },
  focusDesc: { fontSize: 13, color: colors.textLight, lineHeight: 20, marginBottom: 16 },
  
  progressRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  progressLabel: { fontSize: 11, fontWeight: '600', color: colors.text },
  progressBarBg: { height: 4, backgroundColor: colors.border, borderRadius: 2, marginBottom: 20 },
  progressBarFill: { height: '100%', backgroundColor: colors.primary, borderRadius: 2 },
  
  focusActions: { flexDirection: 'row', gap: 12 },
  startBtn: { flex: 1, backgroundColor: '#000', paddingVertical: 12, borderRadius: 8, alignItems: 'center' },
  startBtnText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  detailsBtn: { flex: 1, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, paddingVertical: 12, borderRadius: 8, alignItems: 'center' },
  detailsBtnText: { color: colors.text, fontWeight: '600', fontSize: 14 },

  historyHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  viewAll: { fontSize: 12, fontWeight: '700', color: colors.primary },
  historyCard: { backgroundColor: colors.card, borderRadius: 12, borderWidth: 1, borderColor: colors.border, overflow: 'hidden' },
  historyItem: { flexDirection: 'row', alignItems: 'center', padding: 16, gap: 12 },
  historyBorder: { borderTopWidth: 1, borderColor: colors.border },
  historyIconBox: { backgroundColor: colors.roles.developer.bg, width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  historyTitle: { fontSize: 14, fontWeight: '600', color: colors.text, marginBottom: 4 },
  historyTime: { fontSize: 11, color: colors.textLight }
});
