import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../utils/theme';

export const ExerciseItem = ({ exercise, showSets = true }) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.name}>{exercise.name}</Text>
        {showSets && (
          <View style={styles.setsContainer}>
            <Text style={styles.sets}>
              {exercise.sets} × {exercise.reps}
            </Text>
          </View>
        )}
      </View>
      <View style={styles.metaContainer}>
        {exercise.rest && (
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>Rest</Text>
            <Text style={styles.metaValue}>{exercise.rest}s</Text>
          </View>
        )}
      </View>
      {exercise.notes && (
        <View style={styles.notesContainer}>
          <Text style={styles.notes}>{exercise.notes}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing.xs,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.xs,
  },
  name: {
    fontSize: theme.typography.bodySemibold.fontSize,
    fontWeight: theme.typography.bodySemibold.fontWeight,
    letterSpacing: theme.typography.bodySemibold.letterSpacing,
    lineHeight: theme.typography.bodySemibold.lineHeight,
    color: theme.colors.text,
    flex: 1,
    marginRight: theme.spacing.sm,
  },
  setsContainer: {
    backgroundColor: theme.colors.background,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.md,
  },
  sets: {
    fontSize: theme.typography.bodyMedium.fontSize,
    fontWeight: theme.typography.bodyMedium.fontWeight,
    letterSpacing: theme.typography.bodyMedium.letterSpacing,
    color: theme.colors.text,
  },
  metaContainer: {
    flexDirection: 'row',
    marginTop: theme.spacing.xs,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  metaLabel: {
    fontSize: theme.typography.small.fontSize,
    fontWeight: theme.typography.small.fontWeight,
    letterSpacing: theme.typography.small.letterSpacing,
    color: theme.colors.textSecondary,
    marginRight: theme.spacing.xs,
  },
  metaValue: {
    fontSize: theme.typography.small.fontSize,
    fontWeight: theme.typography.small.fontWeight,
    letterSpacing: theme.typography.small.letterSpacing,
    color: theme.colors.text,
  },
  notesContainer: {
    marginTop: theme.spacing.xs,
    paddingTop: theme.spacing.xs,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  notes: {
    fontSize: theme.typography.caption.fontSize,
    fontWeight: theme.typography.caption.fontWeight,
    letterSpacing: theme.typography.caption.letterSpacing,
    lineHeight: theme.typography.caption.lineHeight,
    color: theme.colors.textSecondary,
  },
});
