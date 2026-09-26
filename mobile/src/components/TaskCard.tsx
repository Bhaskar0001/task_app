import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Task } from '../types/task';
import { PriorityBadge } from './PriorityBadge';
import { StatusBadge } from './StatusBadge';
import { formatDate } from '../utils/date';
import { Colors } from '../constants/colors';

interface TaskCardProps {
  task: Task;
  onPress: () => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onPress }) => {
  const isCompleted = task.status === 'Completed';

  return (
    <TouchableOpacity 
      style={styles.card} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text 
        style={[styles.title, isCompleted && styles.titleCompleted]} 
        numberOfLines={2}
      >
        {task.title}
      </Text>
      
      {!!task.description && (
        <Text style={styles.description} numberOfLines={1}>
          {task.description}
        </Text>
      )}

      <View style={styles.bottomRow}>
        <View style={styles.leftBottom}>
          <PriorityBadge priority={task.priority} />
        </View>
        <View style={styles.rightBottom}>
          {!!task.dueDate && (
            <Text style={styles.dueDate}>{formatDate(task.dueDate)}</Text>
          )}
          <StatusBadge status={task.status} />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E5E7EB',
    borderWidth: 1,
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  titleCompleted: {
    textDecorationLine: 'line-through',
    color: '#6B7280',
  },
  description: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 12,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  leftBottom: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rightBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dueDate: {
    fontSize: 12,
    color: '#6B7280',
    marginRight: 8,
  },
});
