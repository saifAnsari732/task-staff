import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, TextInput, ScrollView, ActivityIndicator, Alert, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import { colors } from '../../theme/colors';
import useAuthStore from '../../store/useAuthStore';
import useTaskStore from '../../store/useTaskStore';

// Assuming your backend URL from useAuthStore
const API_URL = 'https://task-staff.onrender.com/api';

export default function ManageEmployeesScreen() {
  const { token } = useAuthStore();
  const { tasks, fetchTasks } = useTaskStore();
  const [employees, setEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [editingUserId, setEditingUserId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'developer',
    age: '',
    salary: '',
    phone: '',
    address: ''
  });

  const fetchEmployees = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${API_URL}/users`, {
        headers: { 'x-auth-token': token }
      });
      setEmployees(response.data);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to fetch employees');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
    fetchTasks();
  }, []);

  const handleEditPress = (employee) => {
    setEditingUserId(employee._id);
    setFormData({
      name: employee.name || '',
      email: employee.email || '',
      password: '',
      role: employee.role || 'developer',
      age: employee.age?.toString() || '',
      salary: employee.salary?.toString() || '',
      phone: employee.phone || '',
      address: employee.address || ''
    });
    setModalVisible(true);
  };

  const handleDeletePress = (employee) => {
    Alert.alert(
      'Delete Employee',
      `Are you sure you want to delete ${employee.name || employee.email}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => deleteEmployee(employee._id) }
      ]
    );
  };

  const deleteEmployee = async (id) => {
    try {
      await axios.delete(`${API_URL}/users/${id}`, {
        headers: { 'x-auth-token': token }
      });
      fetchEmployees();
      Alert.alert('Success', 'Employee deleted successfully');
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to delete employee');
    }
  };

  const handleSubmitUser = async () => {
    if (!formData.email || !formData.role) {
      Alert.alert('Error', 'Email and Role are required.');
      return;
    }

    setSubmitting(true);
    try {
      if (editingUserId) {
        await axios.put(`${API_URL}/users/${editingUserId}`, formData, {
          headers: { 'x-auth-token': token }
        });
        Alert.alert('Success', 'Employee updated successfully!');
      } else {
        await axios.post(`${API_URL}/users`, formData, {
          headers: { 'x-auth-token': token }
        });
        Alert.alert('Success', 'Employee added successfully!');
      }
      setModalVisible(false);
      setEditingUserId(null);
      setFormData({ name: '', email: '', password: '', role: 'developer', age: '', salary: '', phone: '', address: '' });
      fetchEmployees();
    } catch (error) {
      console.error(error);
      Alert.alert('Error', error.response?.data?.error || 'Failed to save employee');
    } finally {
      setSubmitting(false);
    }
  };

  const getRoleColor = (role) => {
    return colors.roles[role]?.text || colors.primary;
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.header}>Employees</Text>
        <TouchableOpacity style={styles.addBtn} onPress={() => {
          setEditingUserId(null);
          setFormData({ name: '', email: '', password: '', role: 'developer', age: '', salary: '', phone: '', address: '' });
          setModalVisible(true);
        }}>
          <Feather name="plus" size={16} color={colors.card} />
          <Text style={styles.addBtnText}>Add New</Text>
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <ActivityIndicator size="large" color={colors.primary} style={{marginTop: 50}} />
      ) : (
        <FlatList
          data={employees}
          keyExtractor={item => item._id}
          contentContainerStyle={{ paddingBottom: 100 }}
          renderItem={({item}) => {
            const initial = item.name ? item.name.charAt(0).toUpperCase() : (item.email ? item.email.charAt(0).toUpperCase() : 'U');
            const rColor = getRoleColor(item.role);
            return (
              <TouchableOpacity activeOpacity={0.7} onPress={() => { setSelectedEmployee(item); setDetailsModalVisible(true); }}>
                <View style={[styles.card, { borderLeftColor: rColor }]}>
                  <View style={styles.cardLeft}>
                    {item.profilePic ? (
                      <Image source={{ uri: item.profilePic }} style={styles.avatar} />
                    ) : (
                      <View style={[styles.avatar, {backgroundColor: rColor}]}>
                        <Text style={styles.avatarText}>{initial}</Text>
                      </View>
                    )}
                    <View style={styles.cardInfo}>
                      <Text style={styles.name}>{item.name || item.email.split('@')[0]}</Text>
                      <Text style={styles.role}>{item.role.replace('_', ' ')}</Text>
                      <View style={styles.metaRow}>
                        <Feather name="mail" size={12} color={colors.textLight} />
                        <Text style={styles.metaText}>{item.email}</Text>
                      </View>
                      {item.phone ? (
                        <View style={styles.metaRow}>
                          <Feather name="phone" size={12} color={colors.textLight} />
                          <Text style={styles.metaText}>{item.phone}</Text>
                        </View>
                      ) : null}
                    </View>
                  </View>
                  <View style={{flexDirection: 'row', gap: 8, alignItems: 'center'}}>
                    <TouchableOpacity style={styles.editBtn} onPress={() => handleEditPress(item)}>
                      <Text style={styles.editBtnText}>Edit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.editBtn, {borderColor: colors.error, paddingHorizontal: 8}]} onPress={() => handleDeletePress(item)}>
                      <Feather name="trash-2" size={14} color={colors.error} />
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            );
          }}
          ListEmptyComponent={<Text style={{textAlign: 'center', marginTop: 50, color: colors.textLight}}>No employees found.</Text>}
        />
      )}

      {/* Add User Modal */}
      <Modal visible={modalVisible} animationType="slide" presentationStyle="pageSheet">
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{editingUserId ? 'Edit Employee' : 'Add New Employee'}</Text>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Feather name="x" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>
          
          <ScrollView contentContainerStyle={styles.modalScroll}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput style={styles.input} placeholder="John Doe" value={formData.name} onChangeText={t => setFormData({...formData, name: t})} />

            <Text style={styles.label}>Email Address *</Text>
            <TextInput style={styles.input} placeholder="john@company.com" keyboardType="email-address" autoCapitalize="none" value={formData.email} onChangeText={t => setFormData({...formData, email: t})} />

            <Text style={styles.label}>Temporary Password</Text>
            <TextInput style={styles.input} placeholder="Leave blank for '111111'" secureTextEntry value={formData.password} onChangeText={t => setFormData({...formData, password: t})} />

            <Text style={styles.label}>Position / Role *</Text>
            <View style={styles.pickerContainer}>
              <Picker selectedValue={formData.role} onValueChange={(v) => setFormData({...formData, role: v})} style={styles.picker}>
                <Picker.Item label="Developer" value="developer" />
                <Picker.Item label="Telecaller" value="telecaller" />
                <Picker.Item label="Video Editor" value="video_editor" />
                <Picker.Item label="Social Media Manager" value="social_media" />
                <Picker.Item label="Admin" value="admin" />
              </Picker>
            </View>

            <View style={styles.row}>
              <View style={{flex: 1, marginRight: 10}}>
                <Text style={styles.label}>Age</Text>
                <TextInput style={styles.input} placeholder="e.g. 28" keyboardType="numeric" value={formData.age} onChangeText={t => setFormData({...formData, age: t})} />
              </View>
              <View style={{flex: 1}}>
                <Text style={styles.label}>Salary</Text>
                <TextInput style={styles.input} placeholder="e.g. 50000" keyboardType="numeric" value={formData.salary} onChangeText={t => setFormData({...formData, salary: t})} />
              </View>
            </View>

            <Text style={styles.label}>Phone Number</Text>
            <TextInput style={styles.input} placeholder="+1 234 567 890" keyboardType="phone-pad" value={formData.phone} onChangeText={t => setFormData({...formData, phone: t})} />

            <Text style={styles.label}>Address</Text>
            <TextInput style={[styles.input, {height: 80, textAlignVertical: 'top'}]} placeholder="Full residential address" multiline value={formData.address} onChangeText={t => setFormData({...formData, address: t})} />

            <TouchableOpacity style={styles.submitBtn} onPress={handleSubmitUser} disabled={submitting}>
              {submitting ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitBtnText}>{editingUserId ? 'Update Employee' : 'Create Employee'}</Text>}
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>

      {/* Employee Details Modal */}
      <Modal visible={detailsModalVisible} animationType="slide" presentationStyle="pageSheet">
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{selectedEmployee?.name || 'Employee Details'}</Text>
            <TouchableOpacity onPress={() => setDetailsModalVisible(false)}>
              <Feather name="x" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>
          
          <ScrollView contentContainerStyle={{padding: 20}}>
            {selectedEmployee && (
              <>
                <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 20}}>
                  {selectedEmployee.profilePic ? (
                    <Image source={{ uri: selectedEmployee.profilePic }} style={[styles.avatar, {width: 60, height: 60, borderRadius: 30}]} />
                  ) : (
                    <View style={[styles.avatar, {width: 60, height: 60, borderRadius: 30, backgroundColor: getRoleColor(selectedEmployee.role)}]}>
                      <Text style={{color: '#fff', fontSize: 24, fontWeight: 'bold'}}>{selectedEmployee.name ? selectedEmployee.name.charAt(0).toUpperCase() : selectedEmployee.email.charAt(0).toUpperCase()}</Text>
                    </View>
                  )}
                  <View style={{marginLeft: 16}}>
                    <Text style={{fontSize: 20, fontWeight: '800', color: colors.text, textTransform: 'capitalize'}}>{selectedEmployee.name}</Text>
                    <Text style={{fontSize: 14, color: getRoleColor(selectedEmployee.role), textTransform: 'capitalize', fontWeight: '600'}}>{selectedEmployee.role.replace('_', ' ')}</Text>
                    <Text style={{fontSize: 13, color: colors.textLight, marginTop: 4}}>{selectedEmployee.email}</Text>
                  </View>
                </View>

                <Text style={{fontSize: 18, fontWeight: '800', color: colors.text, marginBottom: 12, marginTop: 10, borderTopWidth: 1, borderTopColor: colors.border, paddingTop: 20}}>Task History</Text>
                
                {tasks.filter(t => t.user?._id === selectedEmployee._id).length === 0 ? (
                  <Text style={{color: colors.textLight, textAlign: 'center', marginTop: 20}}>No tasks submitted by this employee yet.</Text>
                ) : (
                  tasks.filter(t => t.user?._id === selectedEmployee._id).map((task, idx) => {
                    const roleTheme = colors.roles[task.role] || { bg: colors.primary, text: '#fff' };
                    return (
                      <View key={task._id || idx} style={[styles.taskHistoryCard, { borderLeftWidth: 4, borderLeftColor: roleTheme.text }]}>
                        <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12}}>
                          <Text style={{fontWeight: '800', color: colors.text, fontSize: 13, textTransform: 'capitalize'}}>Submitted a {task.role.replace('_', ' ')} task</Text>
                          <Text style={{fontSize: 11, color: colors.textLight, fontWeight: '600'}}>{task.date}</Text>
                        </View>
                        
                        <View style={styles.detailsBox}>
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
                            <View style={[styles.detailItemBox, {backgroundColor: roleTheme.bg}]}><Text style={[styles.detailItemText, {color: roleTheme.text}]}>YouTube: {task.details.youtubeCount}</Text></View>
                          )}
                          {task.details?.facebookCount !== undefined && (
                            <View style={[styles.detailItemBox, {backgroundColor: roleTheme.bg}]}><Text style={[styles.detailItemText, {color: roleTheme.text}]}>Facebook: {task.details.facebookCount}</Text></View>
                          )}
                          {task.details?.instagramCount !== undefined && (
                            <View style={[styles.detailItemBox, {backgroundColor: roleTheme.bg}]}><Text style={[styles.detailItemText, {color: roleTheme.text}]}>Instagram: {task.details.instagramCount}</Text></View>
                          )}
                          {task.details?.linkedinCount !== undefined && (
                            <View style={[styles.detailItemBox, {backgroundColor: roleTheme.bg}]}><Text style={[styles.detailItemText, {color: roleTheme.text}]}>LinkedIn: {task.details.linkedinCount}</Text></View>
                          )}
                          {task.details?.description && (
                            <View style={[styles.detailItemBox, {backgroundColor: roleTheme.bg, width: '100%'}]}><Text style={[styles.detailItemText, {color: roleTheme.text}]} numberOfLines={2}>Desc: {task.details.description}</Text></View>
                          )}
                        </View>
                        
                        {(task.screenshotUrl || task.details?.videoFile || task.details?.screenshotUrl) && (
                            <Text style={{color: roleTheme.text, fontSize: 12, marginTop: 8, fontWeight: '700'}}>
                              <Feather name="paperclip" size={12} /> View Attachment
                            </Text>
                        )}
                      </View>
                    );
                  })
                )}
              </>
            )}
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, paddingTop: 40 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, paddingHorizontal: 20 },
  header: { fontSize: 24, fontWeight: '800', color: colors.text },
  addBtn: { backgroundColor: colors.primary, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8, gap: 6 },
  addBtnText: { color: colors.card, fontWeight: '700', fontSize: 14 },
  
  card: { backgroundColor: colors.card, padding: 16, marginHorizontal: 20, borderRadius: 12, elevation: 2, shadowColor: '#000', shadowOffset: {width: 0, height: 1}, shadowOpacity: 0.1, shadowRadius: 2, marginBottom: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderLeftWidth: 4 },
  cardLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  avatar: { width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  avatarText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  cardInfo: { flex: 1 },
  name: { fontSize: 16, fontWeight: '700', color: colors.text, textTransform: 'capitalize' },
  role: { fontSize: 12, color: colors.textLight, textTransform: 'capitalize', marginTop: 2, marginBottom: 6 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 2 },
  metaText: { fontSize: 11, color: colors.textLight },
  
  editBtn: { borderWidth: 1, borderColor: colors.border, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6 },
  editBtnText: { color: colors.text, fontWeight: '600', fontSize: 12 },

  modalContainer: { flex: 1, backgroundColor: colors.background },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, backgroundColor: colors.card, borderBottomWidth: 1, borderBottomColor: colors.border },
  modalTitle: { fontSize: 18, fontWeight: '800', color: colors.text },
  modalScroll: { padding: 20, paddingBottom: 40 },
  
  label: { fontSize: 12, fontWeight: '700', color: colors.text, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 },
  input: { backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, borderRadius: 8, padding: 12, fontSize: 15, color: colors.text, marginBottom: 20 },
  row: { flexDirection: 'row' },
  pickerContainer: { backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, borderRadius: 8, marginBottom: 20, overflow: 'hidden' },
  picker: { height: 50 },
  
  submitBtn: { backgroundColor: colors.primary, padding: 16, borderRadius: 8, alignItems: 'center', marginTop: 10 },
  submitBtnText: { color: colors.card, fontWeight: '700', fontSize: 16 },

  taskHistoryCard: { backgroundColor: '#fff', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: colors.border, marginBottom: 12 },
  detailsBox: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    gap: 8, 
    marginTop: 4 
  },
  detailItemBox: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 8, borderWidth: 1, borderColor: 'transparent' },
  detailItemText: { fontSize: 11, fontWeight: '600' }
});
