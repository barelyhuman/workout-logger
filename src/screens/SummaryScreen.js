import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SectionList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { theme } from '../utils/theme';
import { loadExerciseLogs } from '../utils/storage';
import { formatDate, formatTime, formatDateKey } from '../utils/dateFormatter';

export const SummaryScreen = ({ navigation }) => {
  const [groupedLogs, setGroupedLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLogsData();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadLogsData();
    });
    return unsubscribe;
  }, [navigation]);

  const loadLogsData = async () => {
    setLoading(true);
    const logs = await loadExerciseLogs();

    // Group logs by date
    const grouped = {};
    logs.forEach((log) => {
      const dateKey = formatDateKey(log.timestamp);
      if (!grouped[dateKey]) {
        grouped[dateKey] = {
          dateKey,
          date: new Date(log.timestamp),
          logs: [],
        };
      }
      grouped[dateKey].logs.push(log);
    });

    // Convert to array and sort by date (most recent first)
    const sections = Object.values(grouped).sort((a, b) => b.date - a.date);

    setGroupedLogs(sections);
    setLoading(false);
  };

  const renderExerciseLog = ({ item }) => (
    <View style={styles.logCard}>
      <View style={styles.logHeader}>
        {item.category && (
          <Text style={styles.categoryLabel}>{item.category}</Text>
        )}
      </View>
      <Text style={styles.exerciseName}>{item.exerciseName}</Text>
      <View style={styles.logDetails}>
        <View style={styles.repsContainer}>
          <Text style={styles.repsLabel}>REPS</Text>
          <Text style={styles.repsValue}>{item.reps}</Text>
        </View>
        <View style={styles.timeContainer}>
          <Text style={styles.timeLabel}>TIME</Text>
          <Text style={styles.timeValue}>{formatTime(item.timestamp)}</Text>
        </View>
      </View>
    </View>
  );

  const renderSectionHeader = ({ section }) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{formatDate(section.date)}</Text>
      <Text style={styles.sectionCount}>{section.logs.length} exercises</Text>
    </View>
  );

  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>No workout logs yet.</Text>
      <Text style={styles.emptySubtext}>
        Start logging exercises to see your summary here!
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <Text style={styles.title}>SUMMARY</Text>
      </View>

      <SectionList
        sections={groupedLogs}
        renderItem={renderExerciseLog}
        renderSectionHeader={renderSectionHeader}
        keyExtractor={(item, index) => `${item.id || index}`}
        contentContainerStyle={styles.list}
        refreshing={loading}
        onRefresh={loadLogsData}
        ListEmptyComponent={!loading ? renderEmptyComponent() : null}
        stickySectionHeadersEnabled={false}
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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  sectionTitle: {
    fontSize: theme.typography.bodyMedium.fontSize,
    fontWeight: theme.typography.bodyMedium.fontWeight,
    letterSpacing: theme.typography.body.letterSpacing,
    lineHeight: theme.typography.body.lineHeight,
    color: theme.colors.text,
  },
  sectionCount: {
    fontSize: theme.typography.micro.fontSize,
    fontWeight: theme.typography.micro.fontWeight,
    letterSpacing: theme.typography.micro.letterSpacing,
    color: theme.colors.textMicro,
    textTransform: 'uppercase',
  },
  logCard: {
    backgroundColor: theme.colors.surface,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing.sm,
    ...theme.elevation.low,
  },
  logHeader: {
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
    fontSize: theme.typography.body.fontSize,
    fontWeight: theme.typography.bodyMedium.fontWeight,
    letterSpacing: theme.typography.body.letterSpacing,
    lineHeight: theme.typography.body.lineHeight,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  logDetails: {
    flexDirection: 'row',
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
  timeContainer: {
    alignItems: 'flex-end',
  },
  timeLabel: {
    fontSize: theme.typography.micro.fontSize,
    fontWeight: theme.typography.micro.fontWeight,
    letterSpacing: theme.typography.micro.letterSpacing,
    lineHeight: theme.typography.micro.lineHeight,
    color: theme.colors.textMicro,
    marginBottom: theme.spacing.xs,
    textTransform: 'uppercase',
  },
  timeValue: {
    fontSize: theme.typography.caption.fontSize,
    fontWeight: theme.typography.caption.fontWeight,
    letterSpacing: theme.typography.caption.letterSpacing,
    lineHeight: theme.typography.caption.lineHeight,
    color: theme.colors.textSecondary,
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
