import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { theme } from '../utils/theme';
import { loadExerciseLogs } from '../utils/storage';
import { formatDate, formatTime } from '../utils/dateFormatter';

export const HistoryScreen = ({ navigation }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadHistory();
    });
    return unsubscribe;
  }, [navigation]);

  const loadHistory = async () => {
    setLoading(true);
    const data = await loadExerciseLogs();
    setHistory(data);
    setLoading(false);
  };

  const renderExerciseLog = ({ item }) => {
    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          {item.category && (
            <Text style={styles.categoryLabel}>{item.category}</Text>
          )}
        </View>
        <Text style={styles.exerciseName}>{item.exerciseName}</Text>
        <View style={styles.cardFooter}>
          <View style={styles.repsContainer}>
            <Text style={styles.repsLabel}>REPS</Text>
            <Text style={styles.repsValue}>{item.reps}</Text>
          </View>
          <View style={styles.dateInfo}>
            <Text style={styles.dateLabel}>LOGGED</Text>
            <Text style={styles.date}>{formatDate(item.timestamp)}</Text>
            <Text style={styles.time}>{formatTime(item.timestamp)}</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <Text style={styles.title}>HISTORY</Text>
      </View>

      <FlatList
        data={history}
        renderItem={renderExerciseLog}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        refreshing={loading}
        onRefresh={loadHistory}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              No exercise logs yet.
            </Text>
            <Text style={styles.emptySubtext}>
              Log an exercise to see it here!
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
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.background,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  title: {
    fontSize: theme.typography.micro.fontSize,
    fontWeight: theme.typography.micro.fontWeight,
    letterSpacing: theme.typography.micro.letterSpacing,
    lineHeight: theme.typography.micro.lineHeight,
    color: theme.colors.textMicro,
    textTransform: 'uppercase',
  },
  list: {
    padding: theme.spacing.md,
  },
  card: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing.sm,
    ...theme.elevation.low,
  },
  cardHeader: {
    marginBottom: theme.spacing.xs,
  },
  categoryLabel: {
    fontSize: theme.typography.micro.fontSize,
    fontWeight: theme.typography.micro.fontWeight,
    letterSpacing: theme.typography.micro.letterSpacing,
    lineHeight: theme.typography.micro.lineHeight,
    color: theme.colors.textMicro,
    textTransform: 'uppercase',
  },
  exerciseName: {
    fontSize: theme.typography.heading.fontSize,
    fontWeight: theme.typography.heading.fontWeight,
    letterSpacing: theme.typography.heading.letterSpacing,
    lineHeight: theme.typography.heading.lineHeight,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingTop: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  repsContainer: {
    flex: 1,
  },
  repsLabel: {
    fontSize: theme.typography.micro.fontSize,
    fontWeight: theme.typography.micro.fontWeight,
    letterSpacing: theme.typography.micro.letterSpacing,
    lineHeight: theme.typography.micro.lineHeight,
    color: theme.colors.textMicro,
    marginBottom: theme.spacing.xs,
    textTransform: 'uppercase',
  },
  repsValue: {
    fontSize: theme.typography.numeric.fontSize,
    fontWeight: theme.typography.numeric.fontWeight,
    letterSpacing: theme.typography.numeric.letterSpacing,
    lineHeight: theme.typography.numeric.lineHeight,
    color: theme.colors.text,
  },
  dateInfo: {
    alignItems: 'flex-end',
  },
  dateLabel: {
    fontSize: theme.typography.micro.fontSize,
    fontWeight: theme.typography.micro.fontWeight,
    letterSpacing: theme.typography.micro.letterSpacing,
    lineHeight: theme.typography.micro.lineHeight,
    color: theme.colors.textMicro,
    marginBottom: theme.spacing.xs,
    textTransform: 'uppercase',
  },
  date: {
    fontSize: theme.typography.caption.fontSize,
    fontWeight: theme.typography.caption.fontWeight,
    letterSpacing: theme.typography.caption.letterSpacing,
    lineHeight: theme.typography.caption.lineHeight,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.micro,
  },
  time: {
    fontSize: theme.typography.microRegular.fontSize,
    fontWeight: theme.typography.microRegular.fontWeight,
    letterSpacing: theme.typography.microRegular.letterSpacing,
    lineHeight: theme.typography.microRegular.lineHeight,
    color: theme.colors.textTertiary,
  },
  emptyContainer: {
    paddingVertical: theme.spacing.xxl,
    paddingHorizontal: theme.spacing.md,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: theme.typography.body.fontSize,
    fontWeight: theme.typography.bodyMedium.fontWeight,
    letterSpacing: theme.typography.body.letterSpacing,
    lineHeight: theme.typography.body.lineHeight,
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
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
