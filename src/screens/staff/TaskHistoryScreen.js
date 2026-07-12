import React, { useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Image, TouchableOpacity } from 'react-native';
import { Video } from 'expo-av';
import { Feather } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import useTaskStore from '../../store/useTaskStore';

export default function TaskHistoryScreen() {
  const { tasks, isLoading, fetchTasks } = useTaskStore();

  useEffect(() => {
    fetchTasks();
  }, []);

  // Removed old renderDetailRow as we will use badge boxes now

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Task History</Text>
        <Text style={styles.subtitle}>Review your previously submitted tasks</Text>
      </View>

      {isLoading && tasks.length === 0 ? (
        <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={tasks}
          keyExtractor={item => item._id}
          contentContainerStyle={styles.listContent}
          renderItem={({item}) => {
            const roleTheme = colors.roles[item.role] || { bg: colors.background, text: colors.text };
            return (
              <View style={[styles.card, { borderLeftWidth: 4, borderLeftColor: roleTheme.text }]}>
                <View style={styles.cardHeader}>
                  <View style={styles.dateContainer}>
                    <Feather name="calendar" size={14} color={colors.primary} />
                    <Text style={styles.date}>{item.date}</Text>
                  </View>
                  <View style={[styles.roleBadge, {backgroundColor: roleTheme.bg}]}>
                    <Text style={[styles.roleText, {color: roleTheme.text}]}>
                      {item.role.replace('_', ' ').toUpperCase()}
                    </Text>
                  </View>
                </View>

                <View style={styles.divider} />

                <View style={styles.detailsBox}>
                  {item.details?.projectName && (
                    <View style={[styles.detailItemBox, {backgroundColor: roleTheme.bg}]}><Text style={[styles.detailItemText, {color: roleTheme.text}]}>Project: {item.details.projectName}</Text></View>
                  )}
                  {item.details?.taskAssigned && (
                    <View style={[styles.detailItemBox, {backgroundColor: roleTheme.bg}]}><Text style={[styles.detailItemText, {color: roleTheme.text}]}>Task: {item.details.taskAssigned}</Text></View>
                  )}
                  {item.details?.hoursWorked && (
                    <View style={[styles.detailItemBox, {backgroundColor: roleTheme.bg}]}><Text style={[styles.detailItemText, {color: roleTheme.text}]}>Hours: {item.details.hoursWorked}</Text></View>
                  )}
                  
                  {item.details?.customerName && (
                    <View style={[styles.detailItemBox, {backgroundColor: roleTheme.bg}]}><Text style={[styles.detailItemText, {color: roleTheme.text}]}>Customer: {item.details.customerName}</Text></View>
                  )}
                  {item.details?.outcome && (
                    <View style={[styles.detailItemBox, {backgroundColor: roleTheme.bg}]}><Text style={[styles.detailItemText, {color: roleTheme.text}]}>Outcome: {item.details.outcome}</Text></View>
                  )}
                  {item.details?.callsMade !== undefined && (
                    <View style={[styles.detailItemBox, {backgroundColor: roleTheme.bg}]}><Text style={[styles.detailItemText, {color: roleTheme.text}]}>Calls: {item.details.callsMade}</Text></View>
                  )}
                  {item.details?.connected !== undefined && (
                    <View style={[styles.detailItemBox, {backgroundColor: roleTheme.bg}]}><Text style={[styles.detailItemText, {color: roleTheme.text}]}>Connected: {item.details.connected}</Text></View>
                  )}
                  {item.details?.interested !== undefined && (
                    <View style={[styles.detailItemBox, {backgroundColor: roleTheme.bg}]}><Text style={[styles.detailItemText, {color: roleTheme.text}]}>Interested: {item.details.interested}</Text></View>
                  )}
                  {item.details?.followups !== undefined && (
                    <View style={[styles.detailItemBox, {backgroundColor: roleTheme.bg}]}><Text style={[styles.detailItemText, {color: roleTheme.text}]}>Follow-ups: {item.details.followups}</Text></View>
                  )}
                  
                  {item.details?.videoType && (
                    <View style={[styles.detailItemBox, {backgroundColor: roleTheme.bg}]}><Text style={[styles.detailItemText, {color: roleTheme.text}]}>Format: {item.details.videoType}</Text></View>
                  )}
                  {item.details?.channel && (
                    <View style={[styles.detailItemBox, {backgroundColor: roleTheme.bg}]}><Text style={[styles.detailItemText, {color: roleTheme.text}]}>Channel: {item.details.channel}</Text></View>
                  )}
                  {item.details?.duration && (
                    <View style={[styles.detailItemBox, {backgroundColor: roleTheme.bg}]}><Text style={[styles.detailItemText, {color: roleTheme.text}]}>Duration: {item.details.duration} mins</Text></View>
                  )}
                  {item.details?.editingStatus && (
                    <View style={[styles.detailItemBox, {backgroundColor: roleTheme.bg}]}><Text style={[styles.detailItemText, {color: roleTheme.text}]}>Status: {item.details.editingStatus}</Text></View>
                  )}
                  
                  {item.details?.contentType && (
                    <View style={[styles.detailItemBox, {backgroundColor: roleTheme.bg}]}><Text style={[styles.detailItemText, {color: roleTheme.text}]}>Content: {item.details.contentType}</Text></View>
                  )}
                  {item.details?.youtubeCount !== undefined && (
                    <View style={[styles.detailItemBox, {backgroundColor: roleTheme.bg}]}><Text style={[styles.detailItemText, {color: roleTheme.text}]}>YouTube: {item.details.youtubeCount} {item.details.youtubeChannel ? `(${item.details.youtubeChannel})` : ''}</Text></View>
                  )}
                  {item.details?.facebookCount !== undefined && (
                    <View style={[styles.detailItemBox, {backgroundColor: roleTheme.bg}]}><Text style={[styles.detailItemText, {color: roleTheme.text}]}>Facebook: {item.details.facebookCount} {item.details.facebookChannel ? `(${item.details.facebookChannel})` : ''}</Text></View>
                  )}
                  {item.details?.instagramCount !== undefined && (
                    <View style={[styles.detailItemBox, {backgroundColor: roleTheme.bg}]}><Text style={[styles.detailItemText, {color: roleTheme.text}]}>Instagram: {item.details.instagramCount} {item.details.instagramChannel ? `(${item.details.instagramChannel})` : ''}</Text></View>
                  )}
                  {item.details?.linkedinCount !== undefined && (
                    <View style={[styles.detailItemBox, {backgroundColor: roleTheme.bg}]}><Text style={[styles.detailItemText, {color: roleTheme.text}]}>LinkedIn: {item.details.linkedinCount} {item.details.linkedinChannel ? `(${item.details.linkedinChannel})` : ''}</Text></View>
                  )}
                  {item.details?.pinterestCount !== undefined && (
                    <View style={[styles.detailItemBox, {backgroundColor: roleTheme.bg}]}><Text style={[styles.detailItemText, {color: roleTheme.text}]}>Pinterest: {item.details.pinterestCount} {item.details.pinterestChannel ? `(${item.details.pinterestChannel})` : ''}</Text></View>
                  )}
                  {item.details?.postLink && (
                    <View style={[styles.detailItemBox, {backgroundColor: roleTheme.bg, width: '100%'}]}><Text style={[styles.detailItemText, {color: roleTheme.text}]} numberOfLines={1}>Link: {item.details.postLink}</Text></View>
                  )}
                </View>

                {item.details?.description && (
                  <View style={styles.descBox}>
                    <Text style={styles.descLabel}>Description:</Text>
                    <Text style={styles.descText}>{item.details.description}</Text>
                  </View>
                )}
                {item.details?.remarks && (
                  <View style={styles.descBox}>
                    <Text style={styles.descLabel}>Remarks:</Text>
                    <Text style={styles.descText}>{item.details.remarks}</Text>
                  </View>
                )}

                {(item.screenshotUrl || item.details?.screenshotUrl) && (
                  <View style={{ marginTop: 12, borderRadius: 8, overflow: 'hidden', height: 100, width: 150, backgroundColor: colors.background, borderWidth: 1, borderColor: colors.border }}>
                    <Image source={{ uri: item.screenshotUrl || item.details?.screenshotUrl }} style={{ width: '100%', height: '100%', resizeMode: 'cover' }} />
                  </View>
                )}
                
                {item.details?.videoFile && (
                  <View style={{ marginTop: 12, borderRadius: 8, overflow: 'hidden', height: 100, width: 150, backgroundColor: '#000' }}>
                    <Video 
                      source={{ uri: item.details.videoFile }}
                      style={{ width: '100%', height: '100%' }}
                      useNativeControls
                      resizeMode="cover"
                    />
                  </View>
                )}
              </View>
            );
          }}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Feather name="inbox" size={40} color={colors.textLight} />
              <Text style={styles.emptyStateText}>No tasks submitted yet.</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { padding: 20, paddingTop: 40, backgroundColor: colors.card, borderBottomWidth: 1, borderBottomColor: colors.border },
  title: { fontSize: 28, fontWeight: '800', color: colors.text, marginBottom: 4 },
  subtitle: { fontSize: 14, color: colors.textLight },
  listContent: { padding: 20, paddingBottom: 90 },
  
  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    marginBottom: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  dateContainer: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: colors.background, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 20 },
  date: { fontSize: 13, fontWeight: '700', color: colors.primary },
  roleBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
  roleText: { fontSize: 10, fontWeight: '800', letterSpacing: 0.5 },
  
  divider: { height: 1, backgroundColor: colors.border, marginBottom: 16 },
  
  detailsBox: { 
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 4,
    marginBottom: 8
  },
  detailItemBox: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'transparent'
  },
  detailItemText: { 
    fontSize: 12, 
    fontWeight: '600'
  },
  
  descBox: { backgroundColor: colors.background, padding: 12, borderRadius: 8, marginTop: 8 },
  descLabel: { fontSize: 12, fontWeight: '700', color: colors.text, marginBottom: 4 },
  descText: { fontSize: 13, color: colors.textLight, lineHeight: 20 },
  
  imageContainer: { marginTop: 16, borderRadius: 12, overflow: 'hidden', height: 160, backgroundColor: colors.background },
  screenshot: { width: '100%', height: '100%', resizeMode: 'cover' },
  imageOverlay: { position: 'absolute', bottom: 12, right: 12, backgroundColor: 'rgba(0,0,0,0.6)', flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20 },
  imageOverlayText: { color: '#fff', fontSize: 12, fontWeight: '600' },
  
  emptyState: { alignItems: 'center', justifyContent: 'center', marginTop: 80, opacity: 0.5 },
  emptyStateText: { marginTop: 12, fontSize: 16, fontWeight: '600', color: colors.textLight }
});
