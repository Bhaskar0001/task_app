import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface StatusBadgeProps {
  status: 'Pending' | 'In Progress' | 'Completed' | string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const getStyles = () => {
    switch (status) {
      case 'Pending':
        return { bg: '#F3F4F6', text: '#6B7280' };
      case 'In Progress':
        return { bg: '#EFF6FF', text: '#2563EB' };
      case 'Completed':
        return { bg: '#F0FDF4', text: '#16A34A' };
      default:
        return { bg: '#F3F4F6', text: '#6B7280' };
    }
  };

  const stylesTheme = getStyles();

  return (
    <View style={[styles.container, { backgroundColor: stylesTheme.bg }]}>
      <Text style={[styles.text, { color: stylesTheme.text }]}>{status}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'uppercase',
  },
});
