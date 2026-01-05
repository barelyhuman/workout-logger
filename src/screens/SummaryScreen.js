import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SectionList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { theme } from '../utils/theme';
import { loadExerciseLogs } from '../utils/storage';
import { formatDate, formatTime } from '../utils/dateFormatter';
import { formatDuration } from '../utils/durationFormatter';

export const SummaryScreen = ({ navigation }) => {
  const [groupedLogs, setGroupedLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSummary();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadSummary();
    });
    return unsubscribe;
  }, [navigation]);

  const loadSummary = async () => {
    setLoading(true);
    const logs = await loadExerciseLogs();
    const grouped = groupLogsByDay(logs);
    setGroupedLogs(grouped);
    setLoading(false);
  };

  const groupLogsByDay = (logs) => {
    // Group logs by date
    const groups = {};
    
    logs.forEach((log) => {
      const date = new Date(log.timestamp);
      const dateKey = date.toDateString();
      
      if (!groups[dateKey]) {
        groups[dateKey] = {
          date: date,
          dateKey: dateKey,
          logs: [],
        };
      }
      
      groups[dateKey].logs.push(log);
    });

    // Convert to array and sort by date (most recent first)
    const sectionsArray = Object.values(groups).sort((a, b) => b.date - a.date);

    return sectionsArray;
  };

  const renderSectionHeader = ({ section }) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionHeaderText}>{formatDate(section.date)}</Text>
      <Text style={styles.sectionHeaderCount}>{section.logs.length} exercise{section.logs.length !== 1 ? 's' : ''}</Text>
    </View>
  );

  const renderExerciseLog = ({ item }) => {
    const trackingType = item.trackingType || 'reps';
    let displayValue = '';
    let displayLabel = '';
    
    if (trackingType === 'reps') {
      displayValue = item.reps;
      displayLabel = 'reps';
    } else {
      displayValue = formatDuration(item.duration);
      displayLabel = '';
    }
    
    return (
      <View style={styles.exerciseCard}>
        <View style={styles.exerciseInfo}>
          <Text style={styles.exerciseName}>{item.exerciseName}</Text>
          {item.category && (
            <Text style={styles.category}>{item.category}</Text>
          )}
        </View>
        <View style={styles.exerciseStats}>
          <View style={styles.repsContainer}>
            <Text style={styles.repsValue}>{displayValue}</Text>
            {displayLabel && <Text style={styles.repsLabel}>{displayLabel}</Text>}
          </View>
          <Text style={styles.time}>{formatTime(item.timestamp)}</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <Text style={styles.title}>Summary</Text>
      </View>

      <SectionList
        sections={groupedLogs}
        renderItem={renderExerciseLog}
        renderSectionHeader={renderSectionHeader}
        keyExtractor={(item, index) => item.id || `${item.timestamp}-${index}`}
        contentContainerStyle={styles.list}
        refreshing={loading}
        onRefresh={loadSummary}
        stickySectionHeadersEnabled={true}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No exercise logs yet.</Text>
            <Text style={styles.emptySubtext}>
              Log some exercises to see your daily summary!
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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.sm,
    marginTop: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
    borderBottomWidth: 2,
    borderBottomColor: theme.colors.border,
  },
  sectionHeaderText: {
    fontSize: theme.typography.subheading.fontSize,
    fontWeight: theme.typography.subheading.fontWeight,
    letterSpacing: theme.typography.subheading.letterSpacing,
    lineHeight: theme.typography.subheading.lineHeight,
    color: theme.colors.text,
  },
  sectionHeaderCount: {
    fontSize: theme.typography.caption.fontSize,
    fontWeight: theme.typography.caption.fontWeight,
    letterSpacing: theme.typography.caption.letterSpacing,
    lineHeight: theme.typography.caption.lineHeight,
    color: theme.colors.textSecondary,
  },
  exerciseCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing.sm,
    ...theme.elevation.low,
  },
  exerciseInfo: {
    flex: 1,
    marginRight: theme.spacing.sm,
  },
  exerciseName: {
    fontSize: theme.typography.bodySemibold.fontSize,
    fontWeight: theme.typography.bodySemibold.fontWeight,
    letterSpacing: theme.typography.bodySemibold.letterSpacing,
    lineHeight: theme.typography.bodySemibold.lineHeight,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  category: {
    fontSize: theme.typography.caption.fontSize,
    fontWeight: theme.typography.caption.fontWeight,
    letterSpacing: theme.typography.caption.letterSpacing,
    lineHeight: theme.typography.caption.lineHeight,
    color: theme.colors.textSecondary,
  },
  exerciseStats: {
    alignItems: 'flex-end',
  },
  repsContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: theme.spacing.xs,
  },
  repsValue: {
    fontSize: theme.typography.heading.fontSize,
    fontWeight: theme.typography.heading.fontWeight,
    letterSpacing: theme.typography.heading.letterSpacing,
    lineHeight: theme.typography.heading.lineHeight,
    color: theme.colors.text,
    marginRight: theme.spacing.xs,
  },
  repsLabel: {
    fontSize: theme.typography.caption.fontSize,
    fontWeight: theme.typography.caption.fontWeight,
    letterSpacing: theme.typography.caption.letterSpacing,
    lineHeight: theme.typography.caption.lineHeight,
    color: theme.colors.textSecondary,
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
