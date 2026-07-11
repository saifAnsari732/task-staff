import React from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import useAuthStore from '../../store/useAuthStore';
import useTaskStore from '../../store/useTaskStore';
import DynamicTaskForm from '../../components/DynamicTaskForm';
import { roleSchemas } from '../../utils/roleSchemas';
import { colors } from '../../theme/colors';

export default function TaskSubmissionScreen({ navigation }) {
  const { role } = useAuthStore();
  const { submitTask, isLoading } = useTaskStore();
  const schema = roleSchemas[role] || [];

  const handleSubmit = async (data) => {
    const success = await submitTask(data);
    if (success) {
      Alert.alert('Success', 'Task submitted successfully!');
      navigation.navigate('History');
    } else {
      Alert.alert('Error', useTaskStore.getState().error || 'Task submission failed');
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Daily Task Submission</Text>
      <Text style={styles.subtitle}>Fill in your task details for today</Text>
      
      {schema.length > 0 ? (
        <DynamicTaskForm schema={schema} onSubmit={handleSubmit} isLoading={isLoading} />
      ) : (
        <Text style={styles.errorText}>No schema found for role: {role}</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textLight,
    marginBottom: 20,
  },
  errorText: {
    color: colors.error,
    textAlign: 'center',
    marginTop: 20,
  }
});
