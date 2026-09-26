import React, { useEffect, useState } from 'react';
import { 
  View, Text, StyleSheet, SafeAreaView, ScrollView, 
  TouchableOpacity, ActivityIndicator 
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppStackParamList } from '../../navigation/AppNavigator';
import { taskService } from '../../services/task.service';
import { Task, Status } from '../../types/task';
import { StatusBadge } from '../../components/StatusBadge';
import { PriorityBadge } from '../../components/PriorityBadge';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { EmptyState } from '../../components/EmptyState';
import { Button } from '../../components/Button';
import { formatDate } from '../../utils/date';
import { Colors } from '../../constants/colors';

type TaskDetailsRouteProp = RouteProp<AppStackParamList, 'TaskDetails'>;
type TaskDetailsNavigationProp = NativeStackNavigationProp<AppStackParamList, 'TaskDetails'>;

export const TaskDetailsScreen = () => {
  const route = useRoute<TaskDetailsRouteProp>();
  const navigation = useNavigation<TaskDetailsNavigationProp>();
  
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteVisible, setDeleteVisible] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const fetchTask = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await taskService.getTask(route.params.taskId);
      setTask(response.data);
    } catch (err) {
      setError('Failed to load task');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchTask();
    });
    return unsubscribe;
  }, [navigation, route.params.taskId]);

  const handleDelete = async () => {
    try {
      setDeleting(true);
      await taskService.deleteTask(route.params.taskId);
      setDeleteVisible(false);
      navigation.goBack();
    } catch (err) {
      // Handle error
    } finally {
      setDeleting(false);
    }
  };

  const cycleStatus = async () => {
    if (!task) return;
    
    const statuses: Status[] = ['Pending', 'In Progress', 'Completed'];
    const currentIndex = statuses.indexOf(task.status);
    const nextStatus = statuses[(currentIndex + 1) % statuses.length];
    
    try {
      await taskService.updateStatus(task._id, nextStatus);
      setTask({ ...task, status: nextStatus });
    } catch (err) {
      // Handle error
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (error || !task) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backButton}>←</Text>
          </TouchableOpacity>
        </View>
        <EmptyState 
          icon="⚠️" 
          title="Error" 
          subtitle={error || 'Task not found'} 
          actionLabel="Go Back"
          onAction={() => navigation.goBack()}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButtonContainer}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Task details</Text>
        <View style={styles.backButtonContainer} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>{task.title}</Text>
        
        <TouchableOpacity style={styles.statusContainer} onPress={cycleStatus}>
          <StatusBadge status={task.status} />
        </TouchableOpacity>

        <View style={styles.section}>
          <Text style={styles.label}>DESCRIPTION</Text>
          <Text style={[styles.value, !task.description && styles.placeholderText]}>
            {task.description || 'No description'}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>PRIORITY</Text>
          <PriorityBadge priority={task.priority} />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>DUE DATE</Text>
          <Text style={styles.value}>
            {task.dueDate ? formatDate(task.dueDate) : 'Not set'}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>CREATED</Text>
          <Text style={styles.value}>{formatDate(task.createdAt)}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>UPDATED</Text>
          <Text style={styles.value}>{formatDate(task.updatedAt)}</Text>
        </View>

        <View style={styles.actions}>
          <Button 
            title="Edit Task" 
            onPress={() => navigation.navigate('EditTask', { task })}
          />
          <TouchableOpacity 
            style={styles.deleteButton}
            onPress={() => setDeleteVisible(true)}
          >
            <Text style={styles.deleteButtonText}>Delete Task</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <ConfirmDialog
        visible={deleteVisible}
        title="Delete Task"
        message="Are you sure you want to delete this task? This action cannot be undone."
        confirmLabel="Delete"
        destructive
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteVisible(false)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8F9FB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  backButtonContainer: {
    width: 40,
  },
  backButton: {
    fontSize: 24,
    color: '#111827',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  statusContainer: {
    alignSelf: 'flex-start',
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  value: {
    fontSize: 16,
    color: '#111827',
    lineHeight: 24,
  },
  placeholderText: {
    color: '#9CA3AF',
    fontStyle: 'italic',
  },
  actions: {
    marginTop: 16,
    gap: 16,
  },
  deleteButton: {
    padding: 16,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#DC2626',
    fontSize: 16,
    fontWeight: '500',
  },
});
