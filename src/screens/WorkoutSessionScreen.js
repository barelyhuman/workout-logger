import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { theme } from '../utils/theme';
import { saveWorkoutToHistory } from '../utils/storage';
import { ExerciseItem } from '../components/ExerciseItem';
import { Button } from '../components/Button';

export const WorkoutSessionScreen = ({ route, navigation }) => {
  const { routine } = route.params;
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [isResting, setIsResting] = useState(false);
  const [restTimeRemaining, setRestTimeRemaining] = useState(0);
  const [completedExercises, setCompletedExercises] = useState([]);
  const [skippedExercises, setSkippedExercises] = useState([]);
  const [startTime] = useState(new Date());

  const currentExercise = routine.exercises[currentExerciseIndex];
  const isLastExercise = currentExerciseIndex === routine.exercises.length - 1;

  useEffect(() => {
    let interval;
    if (isResting && restTimeRemaining > 0) {
      interval = setInterval(() => {
        setRestTimeRemaining((prev) => {
          if (prev <= 1) {
            setIsResting(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isResting, restTimeRemaining]);

  const handleCompleteExercise = () => {
    const updatedCompleted = [...completedExercises, { ...currentExercise, skipped: false }];
    setCompletedExercises(updatedCompleted);

    if (isLastExercise) {
      handleFinishWorkout(updatedCompleted, skippedExercises);
    } else {
      // Start rest period
      setRestTimeRemaining(currentExercise.rest || 60);
      setIsResting(true);
      // Move to next exercise after rest is handled by useEffect
    }
  };

  const handleSkipExercise = () => {
    const updatedSkipped = [...skippedExercises, { ...currentExercise, skipped: true }];
    setSkippedExercises(updatedSkipped);

    if (isLastExercise) {
      handleFinishWorkout(completedExercises, updatedSkipped);
    } else {
      // Move to next exercise without rest
      setCurrentExerciseIndex((prev) => prev + 1);
    }
  };

  const handleSkipRest = () => {
    setIsResting(false);
    setRestTimeRemaining(0);
    setCurrentExerciseIndex((prev) => prev + 1);
  };

  const handleFinishWorkout = async (completed, skipped = []) => {
    const endTime = new Date();
    const duration = Math.round((endTime - startTime) / 1000 / 60); // minutes

    // Combine completed and skipped exercises
    const allExercises = [...completed, ...skipped];

    const workout = {
      id: Date.now().toString(),
      routineName: routine.name,
      exercises: allExercises,
      duration,
      completedAt: endTime.toISOString(),
    };

    await saveWorkoutToHistory(workout);

    Alert.alert(
      'Workout Complete! 💪',
      `Great job! You completed ${completed.length} exercises${skipped.length > 0 ? ` and skipped ${skipped.length}` : ''} in ${duration} minutes.`,
      [
        {
          text: 'OK',
          onPress: () => navigation.navigate('Home'),
        },
      ]
    );
  };

  // Helper function to determine when to automatically advance to the next exercise after rest period
  // Check for (completedExercises.length + skippedExercises.length) > 0 prevents auto-advance on initial mount
  const shouldMoveToNextExercise = () => {
    return !isResting && restTimeRemaining === 0 && (completedExercises.length + skippedExercises.length) > 0 && !isLastExercise;
  };

  useEffect(() => {
    if (shouldMoveToNextExercise()) {
      setCurrentExerciseIndex((prev) => prev + 1);
    }
  }, [isResting, restTimeRemaining]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>
            Exercise {currentExerciseIndex + 1} of {routine.exercises.length}
          </Text>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${((currentExerciseIndex + 1) / routine.exercises.length) * 100}%`,
                },
              ]}
            />
          </View>
        </View>

        {isResting ? (
          <View style={styles.restContainer}>
            <Text style={styles.restTitle}>Rest Time</Text>
            <Text style={styles.restTimer}>{restTimeRemaining}s</Text>
            <Text style={styles.restNext}>
              Next: {routine.exercises[currentExerciseIndex + 1]?.name}
            </Text>
          </View>
        ) : (
          <View style={styles.exerciseContainer}>
            <Text style={styles.exerciseTitle}>Current Exercise</Text>
            <ExerciseItem exercise={currentExercise} />
          </View>
        )}

        <View style={styles.upcomingContainer}>
          <Text style={styles.upcomingTitle}>Upcoming</Text>
          {routine.exercises.slice(currentExerciseIndex + 1).map((exercise, index) => (
            <ExerciseItem key={index} exercise={exercise} showSets={false} />
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        {isResting ? (
          <Button title="Skip Rest" onPress={handleSkipRest} />
        ) : (
          <View style={styles.buttonContainer}>
            <Button
              title={isLastExercise ? 'Finish Workout' : 'Complete Exercise'}
              onPress={handleCompleteExercise}
            />
            <Button
              title="Skip Exercise"
              onPress={handleSkipExercise}
              variant="outline"
            />
          </View>
        )}
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
  progressContainer: {
    marginBottom: theme.spacing.lg,
  },
  progressText: {
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
  },
  progressBar: {
    height: 8,
    backgroundColor: theme.colors.surface,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: theme.colors.primary,
  },
  restContainer: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.xl,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  restTitle: {
    fontSize: theme.typography.heading.fontSize,
    fontWeight: theme.typography.heading.fontWeight,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  restTimer: {
    fontSize: 64,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  restNext: {
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.textSecondary,
  },
  exerciseContainer: {
    marginBottom: theme.spacing.lg,
  },
  exerciseTitle: {
    fontSize: theme.typography.heading.fontSize,
    fontWeight: theme.typography.heading.fontWeight,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  upcomingContainer: {
    marginTop: theme.spacing.lg,
  },
  upcomingTitle: {
    fontSize: theme.typography.subheading.fontSize,
    fontWeight: theme.typography.subheading.fontWeight,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.md,
  },
  footer: {
    padding: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  buttonContainer: {
    gap: theme.spacing.sm,
  },
});
