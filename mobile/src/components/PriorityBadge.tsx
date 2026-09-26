import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface PriorityBadgeProps {
  priority: 'Low' | 'Medium' | 'High' | string;
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority }) => {
  const getStyles = () => {
    switch (priority) {
      case 'Low':
        return { bg: '#F3F4F6', text: '#6B7280' };
      case 'Medium':
        return { bg: '#FFFBEB', text: '#D97706' };
      case 'High':
        return { bg: '#FEF2F2', text: '#DC2626' };
      default:
        return { bg: '#F3F4F6', text: '#6B7280' };
    }
  };

  const stylesTheme = getStyles();

  return (
    <View style={[styles.container, { backgroundColor: stylesTheme.bg }]}>
      <Text style={[styles.text, { color: stylesTheme.text }]}>{priority}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
});
