import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { theme } from '../utils/theme';
import { loadWorkoutHistory } from '../utils/storage';

export const HistoryScreen = ({ navigation }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    setLoading(true);
    const data = await loadWorkoutHistory();
    setHistory(data);
    setLoading(false);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = now - date;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const calculateExerciseCounts = (exercises) => {
    return exercises.reduce(
      (acc, ex) => {
        if (ex.skipped === true) {
          acc.skippedCount++;
        } else {
          acc.completedCount++;
        }
        return acc;
      },
      { completedCount: 0, skippedCount: 0 }
    );
  };

  const renderWorkout = ({ item }) => {
    const { completedCount, skippedCount } = calculateExerciseCounts(item.exercises);
    
    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.routineName}>{item.routineName}</Text>
          <Text style={styles.date}>{formatDate(item.completedAt)}</Text>
        </View>
        <View style={styles.stats}>
          <Text style={styles.statText}>
            {completedCount} completed{skippedCount > 0 ? ` • ${skippedCount} skipped` : ''} • {item.duration} min
          </Text>
        </View>
        <View style={styles.exercisesList}>
          {item.exercises.map((exercise, index) => {
            return (
              <View key={index}>
                <Text 
                  style={[
                    styles.exerciseText,
                    exercise.skipped === true && styles.skippedExerciseText
                  ]}
                >
                  • {exercise.name}{exercise.skipped === true ? ' (skipped)' : ''}
                </Text>
                {!exercise.skipped && exercise.actualReps && (
                  <Text style={styles.repsDetail}>
                    {`  Actual: ${exercise.actualReps.join(', ')} | Target: ${exercise.sets} × ${exercise.reps}`}
                  </Text>
                )}
              </View>
            );
          })}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.header}>
        <Text style={styles.title}>Workout History</Text>
      </View>

      <FlatList
        data={history}
        renderItem={renderWorkout}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        refreshing={loading}
        onRefresh={loadHistory}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              No workout history yet.
            </Text>
            <Text style={styles.emptySubtext}>
              Complete a workout to see it here!
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  title: {
    fontSize: theme.typography.title.fontSize,
    fontWeight: theme.typography.title.fontWeight,
    letterSpacing: theme.typography.title.letterSpacing,
    lineHeight: theme.typography.title.lineHeight,
    color: theme.colors.text,
  },
  list: {
    padding: theme.spacing.md,
  },
  card: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing.sm,
    ...theme.elevation.low,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.md,
    paddingBottom: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  routineName: {
    fontSize: theme.typography.subheading.fontSize,
    fontWeight: theme.typography.subheading.fontWeight,
    letterSpacing: theme.typography.subheading.letterSpacing,
    lineHeight: theme.typography.subheading.lineHeight,
    color: theme.colors.text,
    flex: 1,
    marginRight: theme.spacing.sm,
  },
  date: {
    fontSize: theme.typography.caption.fontSize,
    fontWeight: theme.typography.caption.fontWeight,
    letterSpacing: theme.typography.caption.letterSpacing,
    lineHeight: theme.typography.caption.lineHeight,
    color: theme.colors.textSecondary,
  },
  stats: {
    marginBottom: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  statText: {
    fontSize: theme.typography.caption.fontSize,
    fontWeight: theme.typography.caption.fontWeight,
    letterSpacing: theme.typography.caption.letterSpacing,
    lineHeight: theme.typography.caption.lineHeight,
    color: theme.colors.textSecondary,
  },
  exercisesList: {
    marginTop: theme.spacing.xs,
    paddingTop: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  exerciseText: {
    fontSize: theme.typography.caption.fontSize,
    fontWeight: theme.typography.caption.fontWeight,
    letterSpacing: theme.typography.caption.letterSpacing,
    lineHeight: theme.typography.caption.lineHeight,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  repsDetail: {
    fontSize: theme.typography.small.fontSize,
    fontWeight: theme.typography.small.fontWeight,
    letterSpacing: theme.typography.small.letterSpacing,
    lineHeight: theme.typography.small.lineHeight,
    color: theme.colors.textSecondary,
    marginLeft: theme.spacing.md,
    marginBottom: theme.spacing.xs,
    opacity: 0.8,
  },
  skippedExerciseText: {
    textDecorationLine: 'line-through',
    opacity: 0.5,
  },
  emptyContainer: {
    paddingVertical: theme.spacing.xxl,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: theme.typography.bodySemibold.fontSize,
    fontWeight: theme.typography.bodySemibold.fontWeight,
    letterSpacing: theme.typography.bodySemibold.letterSpacing,
    lineHeight: theme.typography.bodySemibold.lineHeight,
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: theme.spacing.xs,
  },
  emptySubtext: {
    fontSize: theme.typography.caption.fontSize,
    fontWeight: theme.typography.caption.fontWeight,
    letterSpacing: theme.typography.caption.letterSpacing,
    lineHeight: theme.typography.caption.lineHeight,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
});
