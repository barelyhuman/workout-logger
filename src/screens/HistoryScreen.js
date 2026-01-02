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

  const renderWorkout = ({ item }) => {
    const { completedCount, skippedCount } = item.exercises.reduce(
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
          {item.exercises.map((exercise, index) => (
            <Text 
              key={index} 
              style={[
                styles.exerciseText,
                exercise.skipped === true && styles.skippedExerciseText
              ]}
            >
              • {exercise.name}{exercise.skipped === true ? ' (skipped)' : ''}
            </Text>
          ))}
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
          <Text style={styles.emptyText}>
            No workout history yet. Complete a workout to see it here!
          </Text>
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
    color: theme.colors.text,
  },
  list: {
    padding: theme.spacing.md,
  },
  card: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing.md,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  routineName: {
    fontSize: theme.typography.subheading.fontSize,
    fontWeight: theme.typography.subheading.fontWeight,
    color: theme.colors.text,
    flex: 1,
  },
  date: {
    fontSize: theme.typography.caption.fontSize,
    color: theme.colors.textSecondary,
    marginLeft: theme.spacing.sm,
  },
  stats: {
    marginBottom: theme.spacing.sm,
  },
  statText: {
    fontSize: theme.typography.caption.fontSize,
    color: theme.colors.textSecondary,
  },
  exercisesList: {
    marginTop: theme.spacing.sm,
  },
  exerciseText: {
    fontSize: theme.typography.small.fontSize,
    color: theme.colors.textSecondary,
    marginBottom: 2,
  },
  skippedExerciseText: {
    textDecorationLine: 'line-through',
    opacity: 0.5,
  },
  emptyText: {
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginTop: theme.spacing.xl,
  },
});
