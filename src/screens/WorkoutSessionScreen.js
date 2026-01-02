import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, Alert, Modal, TextInput, TouchableOpacity } from 'react-native';
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
  const [showRepsModal, setShowRepsModal] = useState(false);
  const [actualReps, setActualReps] = useState([]);

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
    // Initialize actual reps array with planned reps as default
    const sets = currentExercise.sets || 3;
    const plannedReps = currentExercise.reps || '10';
    const defaultReps = Array(sets).fill(plannedReps.toString());
    setActualReps(defaultReps);
    setShowRepsModal(true);
  };

  const handleConfirmReps = () => {
    const exerciseWithReps = { 
      ...currentExercise, 
      skipped: false,
      actualReps: actualReps 
    };
    const updatedCompleted = [...completedExercises, exerciseWithReps];
    setCompletedExercises(updatedCompleted);
    setShowRepsModal(false);

    if (isLastExercise) {
      handleFinishWorkout(updatedCompleted, skippedExercises);
    } else {
      // Start rest period
      setRestTimeRemaining(currentExercise.rest || 60);
      setIsResting(true);
      // Move to next exercise after rest is handled by useEffect
    }
  };

  const handleUpdateRep = (index, value) => {
    const updated = [...actualReps];
    updated[index] = value;
    setActualReps(updated);
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
  // Check for (completedExercises.length + skippedExercises.length) > 0 prevents automatic advancement
  // to next exercise on component initial mount before user has interacted with any exercise
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

      <Modal
        visible={showRepsModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowRepsModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Enter Reps Completed</Text>
            <Text style={styles.modalSubtitle}>
              {currentExercise?.name} - {currentExercise?.sets} sets
            </Text>
            
            <ScrollView style={styles.modalScroll}>
              {actualReps.map((reps, index) => (
                <View key={index} style={styles.repInputRow}>
                  <Text style={styles.setLabel}>Set {index + 1}:</Text>
                  <TextInput
                    style={styles.repInput}
                    value={reps}
                    onChangeText={(value) => handleUpdateRep(index, value)}
                    keyboardType="numeric"
                    placeholder="Reps"
                    placeholderTextColor={theme.colors.textSecondary}
                  />
                </View>
              ))}
            </ScrollView>

            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.modalButtonOutline]}
                onPress={() => setShowRepsModal(false)}
              >
                <Text style={styles.modalButtonTextOutline}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.modalButtonPrimary]}
                onPress={handleConfirmReps}
              >
                <Text style={styles.modalButtonTextPrimary}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.lg,
  },
  modalContent: {
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    padding: theme.spacing.lg,
    width: '100%',
    maxHeight: '80%',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  modalTitle: {
    fontSize: theme.typography.heading.fontSize,
    fontWeight: theme.typography.heading.fontWeight,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.lg,
    textAlign: 'center',
  },
  modalScroll: {
    maxHeight: 300,
  },
  repInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
    gap: theme.spacing.md,
  },
  setLabel: {
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.text,
    fontWeight: '600',
    width: 60,
  },
  repInput: {
    flex: 1,
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 8,
    padding: theme.spacing.md,
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.text,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    marginTop: theme.spacing.lg,
  },
  modalButton: {
    flex: 1,
    padding: theme.spacing.md,
    borderRadius: 8,
    alignItems: 'center',
    minHeight: 50,
    justifyContent: 'center',
  },
  modalButtonOutline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: theme.colors.border,
  },
  modalButtonPrimary: {
    backgroundColor: theme.colors.primary,
  },
  modalButtonTextOutline: {
    color: theme.colors.text,
    fontSize: theme.typography.body.fontSize,
    fontWeight: '600',
  },
  modalButtonTextPrimary: {
    color: theme.colors.background,
    fontSize: theme.typography.body.fontSize,
    fontWeight: '600',
  },
});
