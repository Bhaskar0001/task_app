import React, { useState } from 'react';
import { 
  View, Text, StyleSheet, SafeAreaView, ScrollView, 
  TouchableOpacity, KeyboardAvoidingView, Platform 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppStackParamList } from '../../navigation/AppNavigator';
import { taskService } from '../../services/task.service';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { DateField } from '../../components/DateField';
import { Colors } from '../../constants/colors';

import { Priority, Status } from '../../types/task';

type CreateTaskNavigationProp = NativeStackNavigationProp<AppStackParamList, 'CreateTask'>;

const PRIORITIES: Priority[] = ['Low', 'Medium', 'High'];
const STATUSES: Status[] = ['Pending', 'In Progress', 'Completed'];

export const CreateTaskScreen = () => {
  const navigation = useNavigation<CreateTaskNavigationProp>();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('Medium');
  const [status, setStatus] = useState<Status>('Pending');
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCreate = async () => {
    if (!title.trim()) {
      setError('Task title is required');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      await taskService.createTask({
        title,
        description,
        priority,
        status,
        dueDate: dueDate ? dueDate.toISOString() : undefined,
      });
      
      navigation.goBack();
    } catch (err: any) {
      const message = err?.response?.data?.message || err?.message || 'Failed to create task';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const cycleStatus = () => {
    const currentIndex = STATUSES.indexOf(status);
    const nextStatus = STATUSES[(currentIndex + 1) % STATUSES.length];
    setStatus(nextStatus);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        style={styles.keyboardView} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerLeft}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>New Task</Text>
          <View style={styles.headerRight} />
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          <Input
            label="Task title *"
            placeholder="What needs to be done?"
            value={title}
            onChangeText={(text) => {
              setTitle(text);
              if (error) setError('');
            }}
            error={error}
          />

          <Input
            label="Description"
            placeholder="Add some details..."
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
          />

          <View style={styles.section}>
            <Text style={styles.label}>Priority</Text>
            <View style={styles.priorityContainer}>
              {PRIORITIES.map((p) => {
                const isActive = priority === p;
                return (
                  <TouchableOpacity
                    key={p}
                    style={[styles.priorityButton, isActive && styles.priorityButtonActive]}
                    onPress={() => setPriority(p)}
                  >
                    <Text style={[styles.priorityText, isActive && styles.priorityTextActive]}>
                      {p}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          <DateField
            label="Due Date"
            value={dueDate}
            onChange={setDueDate}
          />

          <View style={styles.section}>
            <Text style={styles.label}>Status</Text>
            <TouchableOpacity style={styles.statusSelector} onPress={cycleStatus}>
              <Text style={styles.statusText}>{status}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.buttonContainer}>
            <Button 
              title="Create Task" 
              onPress={handleCreate} 
              loading={loading}
              disabled={loading}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8F9FB',
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  headerLeft: {
    width: 60,
  },
  headerRight: {
    width: 60,
  },
  cancelText: {
    fontSize: 16,
    color: '#6B7280',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  content: {
    padding: 24,
  },
  section: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  priorityContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  priorityButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
  },
  priorityButtonActive: {
    backgroundColor: '#EFF6FF',
    borderColor: Colors.primary,
  },
  priorityText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  priorityTextActive: {
    color: Colors.primary,
  },
  statusSelector: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  statusText: {
    fontSize: 16,
    color: '#111827',
  },
  buttonContainer: {
    marginTop: 24,
    marginBottom: 40,
  },
});
