import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Switch, Alert, ActivityIndicator } from 'react-native';
import { Feather, MaterialIcons, Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { colors } from '../../theme/colors';
import useAuthStore from '../../store/useAuthStore';

const API_URL = 'https://task-staff.onrender.com/api';

export default function AssignTaskScreen({ navigation }) {
  const { token } = useAuthStore();
  const [isBulk, setIsBulk] = useState(false);
  const [priority, setPriority] = useState('Medium');
  const [role, setRole] = useState('Engineering');
  
  const [employees, setEmployees] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDesc, setTaskDesc] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [subTime, setSubTime] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/users`, {
        headers: { 'x-auth-token': token }
      });
      setEmployees(response.data);
    } catch (error) {
      console.error('Error fetching employees:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectUser = (user) => {
    if (isBulk) {
      if (selectedUsers.find(u => u._id === user._id)) {
        setSelectedUsers(selectedUsers.filter(u => u._id !== user._id));
      } else {
        setSelectedUsers([...selectedUsers, user]);
      }
    } else {
      setSelectedUsers([user]);
      setSearchQuery('');
    }
  };

  const handleRemoveUser = (userId) => {
    setSelectedUsers(selectedUsers.filter(u => u._id !== userId));
  };

  const handleSubmit = async () => {
    if (selectedUsers.length === 0) {
      return Alert.alert('Error', 'Please select at least one employee.');
    }
    if (!taskTitle) {
      return Alert.alert('Error', 'Please enter a task title.');
    }

    setSubmitting(true);
    try {
      const payload = {
        userIds: selectedUsers.map(u => u._id),
        taskDetails: { title: taskTitle, description: taskDesc },
        roleCategory: role,
        priority: priority,
        dueDate: dueDate,
        submissionTime: subTime
      };

      await axios.post(`${API_URL}/admin/assign-tasks`, payload, {
        headers: { 'x-auth-token': token }
      });
      
      Alert.alert('Success', 'Task(s) assigned successfully!');
      
      // Reset form
      setSelectedUsers([]);
      setTaskTitle('');
      setTaskDesc('');
      setDueDate('');
      setSubTime('');
    } catch (error) {
      console.error(error);
      Alert.alert('Error', error.response?.data?.error || 'Failed to assign tasks.');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredEmployees = employees.filter(e => 
    (e.name && e.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
    e.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      
      <View style={styles.pageHeader}>
        <View style={styles.portalBadge}>
          <MaterialIcons name="admin-panel-settings" size={14} color={colors.primary} />
          <Text style={styles.portalText}>ADMINISTRATOR PORTAL</Text>
        </View>
        <Text style={styles.header}>Assign New Task</Text>
        <Text style={styles.subtitle}>Configure and dispatch tasks to your team members or departments.</Text>
      </View>

      {/* Assignee Details Card */}
      <View style={styles.card}>
        <View style={styles.cardHeaderRow}>
          <View style={styles.cardHeaderTitle}>
            <Feather name="users" size={18} color={colors.text} />
            <Text style={styles.cardTitle}>Assignee Details</Text>
          </View>
          <View style={styles.switchRow}>
            <Text style={styles.switchLabel}>Bulk{"\n"}Assign</Text>
            <Switch 
              value={isBulk} 
              onValueChange={(val) => {
                setIsBulk(val);
                if (!val && selectedUsers.length > 1) {
                  setSelectedUsers([selectedUsers[0]]);
                }
              }} 
              trackColor={{false: '#E2E8F0', true: colors.primary}} 
            />
          </View>
        </View>
        
        <Text style={styles.label}>Select Employee {isBulk ? '(Multiple)' : ''}</Text>
        <View style={styles.inputBox}>
          <Feather name="search" size={16} color={colors.textLight} style={styles.inputIcon} />
          <TextInput 
            style={styles.input} 
            placeholder="Search by name or email..." 
            placeholderTextColor="#94A3B8"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {searchQuery.length > 0 && (
          <View style={styles.searchResults}>
            {filteredEmployees.slice(0, 4).map(emp => (
              <TouchableOpacity key={emp._id} style={styles.searchItem} onPress={() => handleSelectUser(emp)}>
                <View style={styles.searchAvatar}>
                  <Text style={{color: '#fff', fontSize: 10}}>{emp.name ? emp.name.charAt(0) : emp.email.charAt(0)}</Text>
                </View>
                <Text style={styles.searchText}>{emp.name || emp.email}</Text>
              </TouchableOpacity>
            ))}
            {filteredEmployees.length === 0 && <Text style={{padding: 10, color: colors.textLight}}>No users found.</Text>}
          </View>
        )}
        
        <View style={styles.chipRow}>
          {selectedUsers.map(user => (
            <View key={user._id} style={styles.chip}>
              <View style={styles.avatarMini}>
                <Text style={{color: '#fff', fontSize: 9, textAlign: 'center', marginTop: 2}}>{user.name ? user.name.charAt(0) : user.email.charAt(0)}</Text>
              </View>
              <Text style={styles.chipText}>{user.name || user.email.split('@')[0]}</Text>
              <TouchableOpacity onPress={() => handleRemoveUser(user._id)}>
                <Feather name="x" size={14} color={colors.primary} />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </View>

      {/* Task Specifications */}
      <View style={styles.card}>
        <View style={styles.cardHeaderRow}>
          <View style={styles.cardHeaderTitle}>
            <Feather name="edit-3" size={18} color={colors.text} />
            <Text style={styles.cardTitle}>Task Specifications</Text>
          </View>
        </View>
        
        <Text style={styles.label}>Task Title *</Text>
        <TextInput 
          style={[styles.inputBox, {padding: 12}]} 
          placeholder="e.g., Q3 Financial Review" 
          placeholderTextColor="#94A3B8" 
          value={taskTitle}
          onChangeText={setTaskTitle}
        />
        
        <Text style={styles.label}>Description</Text>
        <TextInput 
          style={[styles.inputBox, styles.textArea]} 
          placeholder="Detail the objectives and expected outcomes..." 
          placeholderTextColor="#94A3B8" 
          multiline 
          value={taskDesc}
          onChangeText={setTaskDesc}
        />
      </View>

      {/* Role Category */}
      <View style={styles.card}>
        <Text style={styles.label}>Role Category</Text>
        <View style={styles.roleGrid}>
          {['Engineering', 'Design', 'Marketing', 'Finance'].map((r, i) => {
            const colorsMap = ['#3B82F6', '#8B5CF6', '#F97316', '#10B981'];
            return (
              <TouchableOpacity key={r} style={[styles.rolePill, role === r && styles.rolePillActive]} onPress={() => setRole(r)}>
                <View style={[styles.dot, {backgroundColor: colorsMap[i]}]} />
                <Text style={styles.rolePillText}>{r}</Text>
              </TouchableOpacity>
            )
          })}
        </View>
      </View>

      {/* Priority Level */}
      <View style={styles.card}>
        <Text style={styles.label}>Priority Level</Text>
        {['Low', 'Medium', 'High'].map(p => {
          const colorsMap = {Low: '#94A3B8', Medium: '#EAB308', High: '#EF4444'};
          return (
            <TouchableOpacity key={p} style={[styles.radioRow, priority === p && styles.radioRowActive]} onPress={() => setPriority(p)}>
              <View style={styles.radioLeft}>
                <View style={[styles.radioCircle, priority === p && styles.radioCircleActive]}>
                  {priority === p && <View style={styles.radioInner} />}
                </View>
                <Text style={styles.radioText}>{p} Priority</Text>
              </View>
              <View style={[styles.dot, {backgroundColor: colorsMap[p]}]} />
            </TouchableOpacity>
          )
        })}
      </View>

      {/* Date & Time */}
      <View style={styles.dateCard}>
        <View style={styles.dateCol}>
          <Text style={styles.label}>Due Date</Text>
          <View style={styles.inputBox}>
            <Feather name="calendar" size={16} color={colors.textLight} style={styles.inputIcon} />
            <TextInput style={styles.input} placeholder="YYYY-MM-DD" placeholderTextColor="#94A3B8" value={dueDate} onChangeText={setDueDate} />
          </View>
        </View>
        <View style={styles.dateCol}>
          <Text style={styles.label}>Submission Time</Text>
          <View style={styles.inputBox}>
            <Feather name="clock" size={16} color={colors.textLight} style={styles.inputIcon} />
            <TextInput style={styles.input} placeholder="e.g. 5:00 PM" placeholderTextColor="#94A3B8" value={subTime} onChangeText={setSubTime} />
          </View>
        </View>
      </View>

      {/* Actions */}
      <View style={styles.actionRow}>
        <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit} disabled={submitting}>
          {submitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitBtnText}>Create & Assign Task</Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity style={styles.discardBtn} onPress={() => { setSelectedUsers([]); setTaskTitle(''); setTaskDesc(''); }}>
          <Text style={styles.discardBtnText}>Discard</Text>
        </TouchableOpacity>
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20, paddingBottom: 40 },
  pageHeader: { marginBottom: 20 },
  portalBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 },
  portalText: { color: colors.primary, fontSize: 11, fontWeight: '700', letterSpacing: 0.5 },
  header: { fontSize: 24, fontWeight: '800', color: colors.text, marginBottom: 4 },
  subtitle: { fontSize: 13, color: colors.textLight, lineHeight: 18 },
  
  card: { backgroundColor: colors.card, padding: 20, borderRadius: 12, borderWidth: 1, borderColor: colors.border, marginBottom: 16 },
  cardHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  cardHeaderTitle: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  cardTitle: { fontSize: 16, fontWeight: '700', color: colors.text },
  switchRow: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#F8FAFC', padding: 6, borderRadius: 20 },
  switchLabel: { fontSize: 10, color: colors.text, fontWeight: '600', textAlign: 'right' },
  
  label: { fontSize: 12, fontWeight: '700', color: colors.text, marginBottom: 8 },
  inputBox: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: colors.border, borderRadius: 8, backgroundColor: colors.card, marginBottom: 16 },
  inputIcon: { padding: 12 },
  input: { flex: 1, paddingVertical: 12, fontSize: 14, color: colors.text },
  textArea: { height: 100, textAlignVertical: 'top', padding: 12 },
  
  chipRow: { flexDirection: 'row', marginTop: 4, flexWrap: 'wrap', gap: 8 },
  chip: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.roles.admin.bg, paddingVertical: 6, paddingHorizontal: 10, borderRadius: 20, gap: 8 },
  avatarMini: { width: 20, height: 20, borderRadius: 10, backgroundColor: '#94A3B8' },
  chipText: { fontSize: 13, fontWeight: '600', color: colors.primary },
  
  searchResults: { backgroundColor: '#fff', borderWidth: 1, borderColor: colors.border, borderRadius: 8, marginTop: -12, marginBottom: 16, elevation: 2, shadowColor: '#000', shadowOffset: {width: 0, height: 2}, shadowOpacity: 0.1, shadowRadius: 4, maxHeight: 150 },
  searchItem: { flexDirection: 'row', alignItems: 'center', padding: 10, borderBottomWidth: 1, borderBottomColor: colors.border },
  searchAvatar: { width: 24, height: 24, borderRadius: 12, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  searchText: { fontSize: 13, color: colors.text, fontWeight: '500' },
  
  roleGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  rolePill: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: colors.border, paddingVertical: 10, paddingHorizontal: 16, borderRadius: 8, gap: 8, width: '47%' },
  rolePillActive: { borderColor: colors.primary, backgroundColor: colors.roles.admin.bg },
  rolePillText: { fontSize: 13, fontWeight: '600', color: colors.text },
  dot: { width: 8, height: 8, borderRadius: 4 },
  
  radioRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderWidth: 1, borderColor: colors.border, borderRadius: 8, padding: 14, marginBottom: 10 },
  radioRowActive: { borderColor: colors.primary, backgroundColor: colors.roles.admin.bg },
  radioLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  radioCircle: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  radioCircleActive: { borderColor: colors.primary },
  radioInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.primary },
  radioText: { fontSize: 14, color: colors.text, fontWeight: '500' },
  
  dateCard: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24 },
  dateCol: { width: '48%' },
  
  actionRow: { flexDirection: 'row', gap: 12 },
  submitBtn: { flex: 2, backgroundColor: colors.primary, paddingVertical: 16, borderRadius: 8, alignItems: 'center' },
  submitBtnText: { color: colors.card, fontWeight: '700', fontSize: 15 },
  discardBtn: { flex: 1, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, paddingVertical: 16, borderRadius: 8, alignItems: 'center' },
  discardBtnText: { color: colors.text, fontWeight: '600', fontSize: 15 }
});
