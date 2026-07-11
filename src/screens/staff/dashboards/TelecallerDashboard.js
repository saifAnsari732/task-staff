import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Image, ActivityIndicator, Alert } from 'react-native';
import { Feather, FontAwesome5 } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { colors } from '../../../theme/colors';
import useTaskStore from '../../../store/useTaskStore';

export default function TelecallerDashboard({ user, onActionPress }) {
  const { tasks, isLoading, fetchTasks, submitTask } = useTaskStore();
  
  // Stats Form State
  const [calls, setCalls] = useState('');
  const [connected, setConnected] = useState('');
  const [interested, setInterested] = useState('');
  const [followups, setFollowups] = useState('');

  // Daily Call Log Form State
  const [customerName, setCustomerName] = useState('');
  const [outcome, setOutcome] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    fetchTasks();
  }, []);

  const todayStr = new Date().toISOString().split('T')[0];
  const todayTasks = tasks.filter(t => t.date === todayStr);
  
  const callsToday = todayTasks.reduce((sum, t) => sum + (Number(t.details?.callsMade) || 0), 0);
  const connectedToday = todayTasks.reduce((sum, t) => sum + (Number(t.details?.connected) || 0), 0);
  const interestedToday = todayTasks.reduce((sum, t) => sum + (Number(t.details?.interested) || 0), 0);
  const followupsToday = todayTasks.reduce((sum, t) => sum + (Number(t.details?.followups) || 0), 0);

  const handleSubmitStats = async () => {
    if (!calls || !connected) {
      Alert.alert('Error', 'Please enter at least Total Calls and Connected Calls');
      return;
    }
    
    const success = await submitTask({
      type: 'daily_stats',
      callsMade: Number(calls),
      connected: Number(connected),
      interested: Number(interested || 0),
      followups: Number(followups || 0)
    });
    
    if (success) {
      setCalls('');
      setConnected('');
      setInterested('');
      setFollowups('');
      Alert.alert('Success', 'Daily stats saved successfully!');
    }
  };

  const handleSubmitLog = async () => {
    if (!customerName || !outcome) {
      Alert.alert('Error', 'Customer Name and Call Outcome are required');
      return;
    }

    const success = await submitTask({
      type: 'call_log',
      customerName,
      outcome,
      notes
    });

    if (success) {
      setCustomerName('');
      setOutcome('');
      setNotes('');
      Alert.alert('Success', 'Call log saved successfully!');
    }
  };

  const initial = user?.email ? user.email.charAt(0).toUpperCase() : 'T';
  const roleColor = colors.roles.telecaller.text;
  const roleBg = colors.roles.telecaller.bg;
  const accent = colors.roles.telecaller.text;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.topBar}>
        <View>
          <Text style={styles.greeting}>Welcome back,</Text>
          <Text style={styles.name}>{user?.name || user?.email?.split('@')[0] || 'Caller'}</Text>
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
          <Feather name="phone-call" size={12} color={roleColor} />
          <Text style={[styles.roleText, {color: roleColor}]}>Telecaller</Text>
        </View>
        <Text style={styles.dateText}>{new Date().toLocaleDateString('en-US', {weekday: 'long', month: 'short', day: 'numeric'})}</Text>
      </View>

      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <View style={styles.statIconCol}>
            <Feather name="phone-call" size={16} color={roleColor} />
            <Text style={styles.statLabel}>TOTAL CALLS</Text>
            <Text style={styles.statValue}>{callsToday}</Text>
          </View>
        </View>

        <View style={styles.statCard}>
          <View style={styles.statIconCol}>
            <Feather name="check-circle" size={16} color={colors.success || '#10B981'} />
            <Text style={styles.statLabel}>CONNECTED</Text>
            <Text style={styles.statValue}>{connectedToday}</Text>
          </View>
        </View>

        <View style={styles.statCard}>
          <View style={styles.statIconCol}>
            <Feather name="target" size={16} color="#F59E0B" />
            <Text style={styles.statLabel}>INTERESTED</Text>
            <Text style={styles.statValue}>{interestedToday}</Text>
          </View>
        </View>

        <View style={styles.statCard}>
          <View style={styles.statIconCol}>
            <Feather name="refresh-cw" size={16} color="#3B82F6" />
            <Text style={styles.statLabel}>FOLLOW-UPS</Text>
            <Text style={styles.statValue}>{followupsToday}</Text>
          </View>
        </View>
      </View>



      <View style={styles.formCard}>
        <View style={styles.formHeaderRow}>
          <Text style={styles.sectionTitle}>Submit Daily Stats</Text>
        </View>
        
        <View style={styles.inputRow}>
          <View style={styles.inputCol}>
            <Text style={styles.inputLabel}>Total Calls</Text>
            <TextInput style={styles.input} keyboardType="numeric" placeholder="e.g. 127" placeholderTextColor="#A0A0A0" value={calls} onChangeText={setCalls} />
          </View>
          <View style={styles.inputCol}>
            <Text style={styles.inputLabel}>Connected</Text>
            <TextInput style={styles.input} keyboardType="numeric" placeholder="e.g. 58" placeholderTextColor="#A0A0A0" value={connected} onChangeText={setConnected} />
          </View>
        </View>

        <View style={styles.inputRow}>
          <View style={styles.inputCol}>
            <Text style={styles.inputLabel}>Interested (🎯)</Text>
            <TextInput style={styles.input} keyboardType="numeric" placeholder="e.g. 6" placeholderTextColor="#A0A0A0" value={interested} onChangeText={setInterested} />
          </View>
          <View style={styles.inputCol}>
            <Text style={styles.inputLabel}>Follow-ups (🔄)</Text>
            <TextInput style={styles.input} keyboardType="numeric" placeholder="e.g. 45" placeholderTextColor="#A0A0A0" value={followups} onChangeText={setFollowups} />
          </View>
        </View>
        
        <TouchableOpacity style={[styles.submitBtn, {backgroundColor: roleColor}]} onPress={handleSubmitStats}>
          <Text style={styles.submitBtnText}>Submit Stats Entry</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.formCard}>
        <View style={styles.formHeaderRow}>
          <Text style={styles.sectionTitle}>Daily Call Log</Text>
        </View>
        
        <Text style={styles.inputLabel}>Customer Name</Text>
        <TextInput style={styles.input} placeholder="Enter name..." placeholderTextColor="#A0A0A0" value={customerName} onChangeText={setCustomerName} />
        
        <Text style={styles.inputLabel}>Call Outcome</Text>
        <View style={styles.selectContainer}>
          <Picker
            selectedValue={outcome}
            onValueChange={(itemValue) => setOutcome(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Select outcome..." value="" />
            <Picker.Item label="Interested" value="interested" />
            <Picker.Item label="Not Interested" value="not_interested" />
            <Picker.Item label="Call Back Later" value="call_back" />
            <Picker.Item label="Wrong Number" value="wrong_number" />
          </Picker>
        </View>
        
        <Text style={styles.inputLabel}>Detailed Notes</Text>
        <TextInput style={[styles.input, styles.textArea]} placeholder="Summarize the conversation key points..." placeholderTextColor="#A0A0A0" multiline value={notes} onChangeText={setNotes} />
        
        <TouchableOpacity style={[styles.submitBtn, {backgroundColor: roleColor}]} onPress={handleSubmitLog}>
          <Text style={styles.submitBtnText}>Submit Log Entry</Text>
        </TouchableOpacity>
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
  roleBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.roles.telecaller.bg, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20, gap: 6 },
  roleText: { fontSize: 12, fontWeight: '700' },
  dateText: { color: colors.textLight, fontSize: 12, fontWeight: '500' },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 12, marginBottom: 24 },
  statCard: { width: '48%', backgroundColor: colors.card, padding: 16, borderRadius: 12, borderWidth: 1, borderColor: colors.border },
  statCardRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', backgroundColor: colors.card, padding: 16, borderRadius: 12, borderWidth: 1, borderColor: colors.border, marginBottom: 12 },
  statIconCol: { alignItems: 'flex-start' },
  statLabel: { fontSize: 10, color: colors.textLight, fontWeight: '700', letterSpacing: 0.5, marginTop: 8, marginBottom: 4 },
  statValue: { fontSize: 24, fontWeight: '800', color: colors.text },
  badgeText: { fontSize: 10, fontWeight: '700' },

  darkCard: { backgroundColor: '#111827', padding: 20, borderRadius: 12, marginBottom: 16 },
  darkHeaderRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 12 },
  darkHeader: { color: '#A0A0A0', fontSize: 10, fontWeight: '700', letterSpacing: 0.5 },
  darkTitle: { fontSize: 16, fontWeight: '700', color: '#fff', marginBottom: 12 },
  darkMetaRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 20 },
  darkMetaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  darkMetaText: { color: '#D1D5DB', fontSize: 11 },
  darkMetaDivider: { color: '#4B5563', fontSize: 12 },
  primaryBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 12, borderRadius: 8, gap: 8 },
  primaryBtnText: { color: '#fff', fontWeight: '700', fontSize: 14 },

  goalCard: { backgroundColor: colors.roles.telecaller.bg, padding: 24, borderRadius: 12, alignItems: 'center', marginBottom: 24 },
  circularProgress: { width: 80, height: 80, borderRadius: 40, borderWidth: 6, borderColor: colors.roles.telecaller.text, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  circularInner: { width: 68, height: 68, borderRadius: 34, backgroundColor: colors.card, justifyContent: 'center', alignItems: 'center' },
  circularText: { fontSize: 16, fontWeight: '800', color: colors.text },
  goalText: { fontSize: 12, fontWeight: '700', color: colors.text },

  formCard: { backgroundColor: colors.card, padding: 20, borderRadius: 12, borderWidth: 1, borderColor: colors.border, marginBottom: 24 },
  formHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: colors.text },
  historyBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  viewAll: { fontSize: 12, fontWeight: '700' },
  inputRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 12, marginBottom: 16 },
  inputCol: { flex: 1 },
  inputLabel: { fontSize: 11, fontWeight: '700', color: colors.text, marginBottom: 8 },
  input: { borderWidth: 1, borderColor: colors.border, borderRadius: 8, padding: 12, fontSize: 14, color: colors.text },
  selectContainer: { borderWidth: 1, borderColor: colors.border, borderRadius: 8, marginBottom: 16, overflow: 'hidden' },
  picker: { height: 50, width: '100%' },
  textArea: { height: 80, textAlignVertical: 'top', marginTop: 8 },
  submitBtn: { paddingVertical: 14, borderRadius: 8, alignItems: 'center', marginTop: 8 },
  submitBtnText: { color: '#fff', fontWeight: '700', fontSize: 14 },

  insightCard: { flexDirection: 'row', alignItems: 'flex-start', padding: 16, borderBottomWidth: 1, borderColor: colors.border, gap: 12 },
  insightIcon: { marginTop: 2 },
  insightContent: { flex: 1 },
  insightTitle: { fontSize: 13, fontWeight: '700', color: colors.text, marginBottom: 4 },
  insightDesc: { fontSize: 12, color: colors.textLight, lineHeight: 18 },

  taskList: { backgroundColor: colors.card, borderRadius: 12, borderWidth: 1, borderColor: colors.border, overflow: 'hidden', marginBottom: 24 },
  taskItem: { flexDirection: 'row', alignItems: 'center', padding: 16, gap: 12, borderBottomWidth: 1, borderBottomColor: colors.border },
  taskAvatar: { backgroundColor: colors.roles.telecaller.bg, width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  taskContent: { flex: 1 },
  taskTitle: { fontSize: 14, fontWeight: '600', color: colors.text, marginBottom: 4 },
  taskSub: { fontSize: 11, color: colors.textLight }
});
