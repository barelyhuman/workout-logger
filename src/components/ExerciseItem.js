import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../utils/theme';

export const ExerciseItem = ({ exercise, showSets = true }) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.name}>{exercise.name}</Text>
        {showSets && (
          <Text style={styles.sets}>
            {exercise.sets} × {exercise.reps}
          </Text>
        )}
      </View>
      {exercise.notes && (
        <Text style={styles.notes}>{exercise.notes}</Text>
      )}
      {exercise.rest && (
        <Text style={styles.rest}>Rest: {exercise.rest}s</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing.sm,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  name: {
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.text,
    fontWeight: '600',
    flex: 1,
  },
  sets: {
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.text,
    marginLeft: theme.spacing.sm,
  },
  notes: {
    fontSize: theme.typography.caption.fontSize,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  rest: {
    fontSize: theme.typography.small.fontSize,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
});
