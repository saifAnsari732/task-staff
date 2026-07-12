import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { Video } from 'expo-av';
import { Feather, MaterialIcons, Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { colors } from '../../theme/colors';
import useAuthStore from '../../store/useAuthStore';
import useTaskStore from '../../store/useTaskStore';

const API_URL = 'https://task-staff.onrender.com/api';

export default function AdminDashboardScreen({ navigation }) {
  const { user, token } = useAuthStore();
  const { tasks, isLoading, fetchTasks } = useTaskStore();
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    fetchTasks();
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get(`${API_URL}/users`, {
        headers: { 'x-auth-token': token }
      });
      
      // Filter to show ONLY the 4 specific test users requested
      const targetEmails = [
        'telecaller@company.com',
        'video@company.com',
        'socialmedia@kisan.com',
        'developer@company.com'
      ];
      
      const staffList = response.data.filter(u => targetEmails.includes(u.email));
      
      setEmployees(staffList);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  const adminInitial = user?.email ? user.email.charAt(0).toUpperCase() : 'A';
  
  // Real data calculations
  const totalEmployees = employees.length;
  
  const today = new Date().toISOString().split('T')[0];
  const tasksToday = tasks.filter(t => t.date === today).length;
  
  const totalTasks = tasks.length;
  const completionRate = totalTasks > 0 ? ((tasksToday / totalTasks) * 100).toFixed(1) : '0.0';
  
  // Pending tasks logic (custom logic depending on how tasks are structured, let's assume those assigned by admin are pending)
  const pendingApprovals = tasks.filter(t => t.details?.assignedByAdmin && t.details?.status === 'Pending').length;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.topBar}>
        <View>
          <Text style={styles.header}>System Overview</Text>
          <Text style={styles.subtitle}>Real-time performance metrics</Text>
        </View>
        <TouchableOpacity style={styles.adminAvatarContainer} onPress={() => navigation.navigate('Profile')}>
          {user?.profilePic ? (
            <Image source={{ uri: user.profilePic }} style={styles.adminAvatar} />
          ) : (
            <View style={[styles.adminAvatar, {backgroundColor: colors.primary}]}>
              <Text style={styles.adminAvatarText}>{adminInitial}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
      
      <TouchableOpacity style={styles.assignBtn} onPress={() => navigation.navigate('Tasks')}>
        <Feather name="check-circle" size={18} color={colors.card} />
        <Text style={styles.assignBtnText}>Assign New Task</Text>
      </TouchableOpacity>

      <View style={styles.statsGrid}>
        {/* Card 1: Total Employees */}
        <View style={styles.statCard}>
          <View style={styles.cardHeader}>
            <View style={[styles.iconBox, {backgroundColor: colors.roles.admin.bg}]}><Feather name="users" size={18} color={colors.primary} /></View>
            <View style={[styles.badge, {backgroundColor: colors.roles.admin.bg}]}><Text style={[styles.badgeText, {color: colors.primary}]}>Active Now</Text></View>
          </View>
          <Text style={styles.statValue}>{totalEmployees}</Text>
          <Text style={styles.statLabel}>Total Employees</Text>
          <View style={styles.progressBarBg}><View style={[styles.progressBarFill, {width: '100%'}]} /></View>
        </View>

        {/* Card 2: Tasks Assigned */}
        <View style={styles.statCard}>
          <View style={styles.cardHeader}>
            <View style={[styles.iconBox, {backgroundColor: colors.roles.admin.bg}]}><Feather name="check-square" size={18} color={colors.primary} /></View>
            <View style={[styles.badge, {backgroundColor: '#FEF3C7'}]}><Text style={[styles.badgeText, {color: '#D97706'}]}>Today</Text></View>
          </View>
          <Text style={styles.statValue}>{tasksToday}</Text>
          <Text style={styles.statLabel}>Tasks Today</Text>
          <View style={styles.miniChart}>
             {[40,60,80,100,70,90,50].map((h, i) => <View key={i} style={[styles.bar, {height: h/3}]} />)}
          </View>
        </View>

        {/* Card 3: Completion Rate */}
        <View style={styles.statCard}>
          <View style={styles.cardHeader}>
            <View style={[styles.iconBox, {backgroundColor: colors.roles.admin.bg}]}><Feather name="bar-chart-2" size={18} color={colors.primary} /></View>
            <View style={[styles.badge, {backgroundColor: colors.roles.admin.bg}]}><Text style={[styles.badgeText, {color: colors.primary}]}>Avg</Text></View>
          </View>
          <Text style={styles.statValue}>{completionRate}%</Text>
          <Text style={styles.statLabel}>Volume % (Today/Total)</Text>
          <View style={styles.avatarRow}>
            <View style={styles.mockAvatar} />
            <View style={[styles.mockAvatar, {left: -10, backgroundColor: '#E2E8F0'}]} />
            <Text style={styles.avatarText}>+{tasksToday} today</Text>
          </View>
        </View>

        {/* Card 4: Pending Approvals */}
        <View style={styles.statCard}>
          <View style={styles.cardHeader}>
            <View style={[styles.iconBox, {backgroundColor: colors.roles.social_media.bg}]}><Feather name="clipboard" size={18} color={colors.error} /></View>
            <View style={[styles.badge, {backgroundColor: colors.roles.social_media.bg}]}><Text style={[styles.badgeText, {color: colors.error}]}>Action</Text></View>
          </View>
          <Text style={styles.statValue}>{pendingApprovals}</Text>
          <Text style={styles.statLabel}>Pending Tasks</Text>
          <View style={styles.warningRow}>
            <Ionicons name="warning-outline" size={14} color={colors.error} />
            <Text style={styles.warningText}>Check Tasks</Text>
          </View>
        </View>
      </View>

      {/* Recent Activity */}
      <View style={styles.recentActivityContainer}>
        <View style={styles.recentHeader}>
          <Text style={styles.recentTitle}>Recent Activity</Text>
          <Text style={styles.viewAll}>View All</Text>
        </View>
        
        {isLoading && tasks.length === 0 ? (
          <ActivityIndicator size="small" color={colors.primary} />
        ) : tasks.length === 0 ? (
          <Text style={{color: colors.textLight, textAlign: 'center'}}>No recent activity</Text>
        ) : (
          tasks.slice(0, 10).map((task, index) => {
            const userInitial = task.user?.email ? task.user.email.charAt(0).toUpperCase() : 'U';
            const roleTheme = colors.roles[task.role] || { bg: colors.primary, text: '#fff' };
            
            return (
                <View key={task._id || index} style={[styles.activityItemBox, { borderLeftColor: roleTheme.text }]}>
                  {task.user?.profilePic ? (
                    <Image source={{ uri: task.user.profilePic }} style={styles.activityAvatar} />
                  ) : (
                    <View style={[styles.activityAvatar, {backgroundColor: roleTheme.bg}]}>
                      <Text style={[styles.activityAvatarText, {color: roleTheme.text}]}>{userInitial}</Text>
                    </View>
                  )}
                  <View style={styles.activityContent}>
                    <Text style={styles.activityText}><Text style={styles.boldText}>{task.user?.name || task.user?.email?.split('@')[0] || 'User'}</Text> submitted <Text style={[styles.linkText, {color: roleTheme.text}]}>a {task.role.replace('_', ' ')} task</Text></Text>
                    <Text style={styles.activityTime}>{task.date}</Text>
                    
                    <View style={[styles.detailsBox, { borderLeftColor: roleTheme.text }]}>
                      {task.details?.projectName && (
                        <View style={[styles.detailItemBox, {backgroundColor: roleTheme.bg}]}><Text style={[styles.detailItemText, {color: roleTheme.text}]}>Project: {task.details.projectName}</Text></View>
                      )}
                      {task.details?.taskAssigned && (
                        <View style={[styles.detailItemBox, {backgroundColor: roleTheme.bg}]}><Text style={[styles.detailItemText, {color: roleTheme.text}]}>Task: {task.details.taskAssigned}</Text></View>
                      )}
                      {task.details?.customerName && (
                        <View style={[styles.detailItemBox, {backgroundColor: roleTheme.bg}]}><Text style={[styles.detailItemText, {color: roleTheme.text}]}>Customer: {task.details.customerName} ({task.details.outcome})</Text></View>
                      )}
                      {task.details?.callsMade !== undefined && (
                        <View style={[styles.detailItemBox, {backgroundColor: roleTheme.bg}]}><Text style={[styles.detailItemText, {color: roleTheme.text}]}>Calls: {task.details.callsMade} (Conn: {task.details.connected}, Int: {task.details.interested})</Text></View>
                      )}
                      
                      {task.details?.videoType && (
                        <View style={[styles.detailItemBox, {backgroundColor: roleTheme.bg}]}><Text style={[styles.detailItemText, {color: roleTheme.text}]}>Format: {task.details.videoType} ({task.details.duration}m)</Text></View>
                      )}
                      {task.details?.channel && (
                        <View style={[styles.detailItemBox, {backgroundColor: roleTheme.bg}]}><Text style={[styles.detailItemText, {color: roleTheme.text}]}>Channel: {task.details.channel}</Text></View>
                      )}
                      
                      {task.details?.contentType && (
                        <View style={[styles.detailItemBox, {backgroundColor: roleTheme.bg}]}><Text style={[styles.detailItemText, {color: roleTheme.text}]}>Content: {task.details.contentType}</Text></View>
                      )}
                      {task.details?.youtubeCount !== undefined && (
                        <View style={[styles.detailItemBox, {backgroundColor: roleTheme.bg}]}><Text style={[styles.detailItemText, {color: roleTheme.text}]}>YouTube: {task.details.youtubeCount} {task.details.youtubeChannel ? `(${task.details.youtubeChannel})` : ''}</Text></View>
                      )}
                      {task.details?.facebookCount !== undefined && (
                        <View style={[styles.detailItemBox, {backgroundColor: roleTheme.bg}]}><Text style={[styles.detailItemText, {color: roleTheme.text}]}>Facebook: {task.details.facebookCount} {task.details.facebookChannel ? `(${task.details.facebookChannel})` : ''}</Text></View>
                      )}
                      {task.details?.instagramCount !== undefined && (
                        <View style={[styles.detailItemBox, {backgroundColor: roleTheme.bg}]}><Text style={[styles.detailItemText, {color: roleTheme.text}]}>Instagram: {task.details.instagramCount} {task.details.instagramChannel ? `(${task.details.instagramChannel})` : ''}</Text></View>
                      )}
                      {task.details?.linkedinCount !== undefined && (
                        <View style={[styles.detailItemBox, {backgroundColor: roleTheme.bg}]}><Text style={[styles.detailItemText, {color: roleTheme.text}]}>LinkedIn: {task.details.linkedinCount} {task.details.linkedinChannel ? `(${task.details.linkedinChannel})` : ''}</Text></View>
                      )}
                      {task.details?.pinterestCount !== undefined && (
                        <View style={[styles.detailItemBox, {backgroundColor: roleTheme.bg}]}><Text style={[styles.detailItemText, {color: roleTheme.text}]}>Pinterest: {task.details.pinterestCount} {task.details.pinterestChannel ? `(${task.details.pinterestChannel})` : ''}</Text></View>
                      )}
                      
                      {task.details?.description && (
                        <View style={[styles.detailItemBox, {backgroundColor: roleTheme.bg, width: '100%'}]}><Text style={[styles.detailItemText, {color: roleTheme.text}]} numberOfLines={1}>Desc: {task.details.description}</Text></View>
                      )}
                    </View>

                    {(task.screenshotUrl || task.details?.screenshotUrl) && (
                      <View style={{ marginTop: 12, borderRadius: 8, overflow: 'hidden', height: 100, width: 150, backgroundColor: colors.background, borderWidth: 1, borderColor: colors.border }}>
                        <Image source={{ uri: task.screenshotUrl || task.details?.screenshotUrl }} style={{ width: '100%', height: '100%', resizeMode: 'cover' }} />
                      </View>
                    )}
                    {task.details?.videoFile && (
                      <View style={{ marginTop: 12, borderRadius: 8, overflow: 'hidden', height: 100, width: 150, backgroundColor: '#000' }}>
                        <Video 
                          source={{ uri: task.details.videoFile }}
                          style={{ width: '100%', height: '100%' }}
                          useNativeControls
                          resizeMode="cover"
                        />
                      </View>
                    )}
                  </View>
                </View>
            )
          })
        )}

      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20, paddingTop: 40, paddingBottom: 90 },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  header: { fontSize: 24, fontWeight: '800', color: colors.text, marginBottom: 4 },
  subtitle: { fontSize: 13, color: colors.textLight },
  adminAvatarContainer: { elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
  adminAvatar: { width: 44, height: 44, borderRadius: 22, overflow: 'hidden', justifyContent: 'center', alignItems: 'center' },
  adminAvatarText: { color: '#fff', fontSize: 18, fontWeight: '700' },
  
  assignBtn: { backgroundColor: colors.primary, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 14, borderRadius: 8, gap: 8, marginBottom: 24 },
  assignBtnText: { color: colors.card, fontWeight: '600', fontSize: 15 },
  
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 24, gap: 12 },
  statCard: { width: '48%', backgroundColor: colors.card, padding: 16, borderRadius: 12, borderWidth: 1, borderColor: colors.border, elevation: 1, marginBottom: 0 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  iconBox: { width: 36, height: 36, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  badge: { paddingHorizontal: 6, paddingVertical: 4, borderRadius: 4 },
  badgeText: { fontSize: 9, fontWeight: '800', textTransform: 'uppercase' },
  statValue: { fontSize: 26, fontWeight: '800', color: colors.text, marginBottom: 4 },
  statLabel: { fontSize: 11, color: colors.textLight, fontWeight: '600' },
  
  progressBarBg: { height: 4, backgroundColor: colors.border, borderRadius: 2, marginTop: 12, overflow: 'hidden' },
  progressBarFill: { height: '100%', backgroundColor: colors.primary },
  
  miniChart: { flexDirection: 'row', alignItems: 'flex-end', gap: 3, marginTop: 12, height: 24 },
  bar: { width: 5, backgroundColor: colors.primary, borderRadius: 3 },
  
  avatarRow: { flexDirection: 'row', alignItems: 'center', marginTop: 12 },
  mockAvatar: { width: 22, height: 22, borderRadius: 11, backgroundColor: '#94A3B8', borderWidth: 2, borderColor: colors.card },
  avatarText: { fontSize: 10, color: colors.textLight, marginLeft: -4 },
  
  warningRow: { flexDirection: 'row', alignItems: 'center', marginTop: 12, gap: 4 },
  warningText: { fontSize: 11, color: colors.error, fontWeight: '600' },

  recentActivityContainer: { marginTop: 16 },
  recentHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  recentTitle: { fontSize: 16, fontWeight: '700', color: colors.text },
  viewAll: { fontSize: 12, fontWeight: '600', color: colors.primary },
  
  activityItemBox: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    borderLeftWidth: 5,
  },
  activityAvatar: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.border },
  activityAvatarText: { color: '#fff', fontSize: 14, fontWeight: '700' },
  activityContent: { flex: 1, paddingBottom: 0 },
  activityText: { fontSize: 13, color: colors.textLight, lineHeight: 18 },
  boldText: { fontWeight: '700', color: colors.text },
  linkText: { color: colors.primary },
  errorText: { color: colors.error, fontWeight: '600' },
  activityTime: { fontSize: 10, color: '#A0A0A0', marginTop: 4, textTransform: 'uppercase', fontWeight: '600' },
  activityLine: { position: 'absolute', left: 11, top: 24, bottom: 0, width: 2, backgroundColor: colors.border },
  
  detailsBox: { 
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 8,
    backgroundColor: '#F8FAFC',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 3
  },
  detailItemBox: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'transparent'
  },
  detailItemText: { 
    fontSize: 11, 
    fontWeight: '600'
  }
});
