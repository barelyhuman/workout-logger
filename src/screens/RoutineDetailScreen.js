import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { theme } from '../utils/theme';
import { ExerciseItem } from '../components/ExerciseItem';
import { Button } from '../components/Button';

export const RoutineDetailScreen = ({ route, navigation }) => {
  const { routine } = route.params;

  const handleStartWorkout = () => {
    navigation.navigate('WorkoutSession', { routine });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>{routine.name}</Text>
        {routine.description && (
          <Text style={styles.description}>{routine.description}</Text>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Exercises</Text>
          {routine.exercises.map((exercise, index) => (
            <ExerciseItem key={index} exercise={exercise} />
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button title="Start Workout" onPress={handleStartWorkout} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    padding: theme.spacing.md,
  },
  title: {
    fontSize: theme.typography.title.fontSize,
    fontWeight: theme.typography.title.fontWeight,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  description: {
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.lg,
  },
  section: {
    marginTop: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: theme.typography.heading.fontSize,
    fontWeight: theme.typography.heading.fontWeight,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  footer: {
    padding: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
});
