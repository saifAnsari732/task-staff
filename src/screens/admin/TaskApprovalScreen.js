import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { colors } from '../../theme/colors';

const mockSubmissions = [
  { id: '1', taskName: 'Fix Login Bug', submittedBy: 'Alice (Dev)', status: 'pending' },
  { id: '2', taskName: 'Call 50 leads', submittedBy: 'Bob (Sales)', status: 'pending' },
];

export default function TaskApprovalScreen() {
  const handleApprove = (id) => Alert.alert('Approved', `Task submission ${id} approved`);
  const handleReject = (id) => Alert.alert('Rejected', `Task submission ${id} rejected`);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Pending Approvals</Text>
      
      <FlatList
        data={mockSubmissions}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <View style={styles.card}>
            <Text style={styles.taskName}>{item.taskName}</Text>
            <Text style={styles.submittedBy}>Submitted by: {item.submittedBy}</Text>
            
            <View style={styles.actions}>
              <TouchableOpacity style={[styles.btn, styles.approveBtn]} onPress={() => handleApprove(item.id)}>
                <Text style={styles.btnText}>Approve</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.btn, styles.rejectBtn]} onPress={() => handleReject(item.id)}>
                <Text style={styles.btnText}>Reject</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: 20 },
  header: { fontSize: 24, fontWeight: 'bold', color: colors.primary, marginBottom: 20 },
  card: { backgroundColor: colors.card, padding: 16, borderRadius: 8, elevation: 2, marginBottom: 12 },
  taskName: { fontSize: 16, fontWeight: 'bold', color: colors.text },
  submittedBy: { fontSize: 14, color: colors.textLight, marginTop: 4, marginBottom: 12 },
  actions: { flexDirection: 'row', gap: 10 },
  btn: { flex: 1, paddingVertical: 8, borderRadius: 6, alignItems: 'center' },
  approveBtn: { backgroundColor: colors.success },
  rejectBtn: { backgroundColor: colors.error },
  btnText: { color: colors.card, fontWeight: 'bold' }
});
