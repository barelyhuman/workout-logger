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
          <View style={styles.progressHeader}>
            <Text style={styles.progressText}>
              Exercise {currentExerciseIndex + 1} of {routine.exercises.length}
            </Text>
            <Text style={styles.progressPercentage}>
              {Math.round(((currentExerciseIndex + 1) / routine.exercises.length) * 100)}%
            </Text>
          </View>
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
            <Text style={styles.restTimer}>{restTimeRemaining}</Text>
            <Text style={styles.restUnit}>seconds</Text>
            <View style={styles.restDivider} />
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

        {routine.exercises.slice(currentExerciseIndex + 1).length > 0 && (
          <View style={styles.upcomingContainer}>
            <Text style={styles.upcomingTitle}>Upcoming</Text>
            <View style={styles.upcomingList}>
              {routine.exercises.slice(currentExerciseIndex + 1).map((exercise, index) => (
                <ExerciseItem key={index} exercise={exercise} showSets={false} />
              ))}
            </View>
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        {isResting ? (
          <Button title="Skip Rest" onPress={handleSkipRest} variant="outline" />
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
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  progressText: {
    fontSize: theme.typography.bodyMedium.fontSize,
    fontWeight: theme.typography.bodyMedium.fontWeight,
    letterSpacing: theme.typography.bodyMedium.letterSpacing,
    color: theme.colors.textSecondary,
  },
  progressPercentage: {
    fontSize: theme.typography.bodySemibold.fontSize,
    fontWeight: theme.typography.bodySemibold.fontWeight,
    letterSpacing: theme.typography.bodySemibold.letterSpacing,
    color: theme.colors.text,
  },
  progressBar: {
    height: 8,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.md,
  },
  restContainer: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  restTitle: {
    fontSize: theme.typography.subheading.fontSize,
    fontWeight: theme.typography.subheading.fontWeight,
    letterSpacing: theme.typography.subheading.letterSpacing,
    lineHeight: theme.typography.subheading.lineHeight,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.md,
    textTransform: 'uppercase',
  },
  restTimer: {
    fontSize: 56,
    fontWeight: '700',
    letterSpacing: -0.5,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  restUnit: {
    fontSize: theme.typography.caption.fontSize,
    fontWeight: theme.typography.caption.fontWeight,
    letterSpacing: theme.typography.caption.letterSpacing,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.lg,
  },
  restDivider: {
    width: '100%',
    height: 1,
    backgroundColor: theme.colors.border,
    marginBottom: theme.spacing.lg,
  },
  restNext: {
    fontSize: theme.typography.body.fontSize,
    fontWeight: theme.typography.body.fontWeight,
    letterSpacing: theme.typography.body.letterSpacing,
    lineHeight: theme.typography.body.lineHeight,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  exerciseContainer: {
    marginBottom: theme.spacing.lg,
  },
  exerciseTitle: {
    fontSize: theme.typography.heading.fontSize,
    fontWeight: theme.typography.heading.fontWeight,
    letterSpacing: theme.typography.heading.letterSpacing,
    lineHeight: theme.typography.heading.lineHeight,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  upcomingContainer: {
    marginTop: theme.spacing.md,
  },
  upcomingTitle: {
    fontSize: theme.typography.subheading.fontSize,
    fontWeight: theme.typography.subheading.fontWeight,
    letterSpacing: theme.typography.subheading.letterSpacing,
    lineHeight: theme.typography.subheading.lineHeight,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.md,
    textTransform: 'uppercase',
  },
  upcomingList: {
    // Gap handled by marginBottom in ExerciseItem
  },
  footer: {
    padding: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  buttonContainer: {
    // Gap handled by marginBottom in Button
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.lg,
  },
  modalContent: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.lg,
    width: '100%',
    maxHeight: '80%',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  modalTitle: {
    fontSize: theme.typography.heading.fontSize,
    fontWeight: theme.typography.heading.fontWeight,
    letterSpacing: theme.typography.heading.letterSpacing,
    lineHeight: theme.typography.heading.lineHeight,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: theme.typography.body.fontSize,
    fontWeight: theme.typography.body.fontWeight,
    letterSpacing: theme.typography.body.letterSpacing,
    lineHeight: theme.typography.body.lineHeight,
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
  },
  setLabel: {
    fontSize: theme.typography.bodySemibold.fontSize,
    fontWeight: theme.typography.bodySemibold.fontWeight,
    letterSpacing: theme.typography.bodySemibold.letterSpacing,
    color: theme.colors.text,
    width: 60,
    marginRight: theme.spacing.md,
  },
  repInput: {
    flex: 1,
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    fontSize: theme.typography.body.fontSize,
    fontWeight: theme.typography.body.fontWeight,
    letterSpacing: theme.typography.body.letterSpacing,
    color: theme.colors.text,
  },
  modalButtons: {
    flexDirection: 'row',
    marginTop: theme.spacing.lg,
  },
  modalButton: {
    flex: 1,
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.lg,
    alignItems: 'center',
    minHeight: 44,
    justifyContent: 'center',
    marginHorizontal: theme.spacing.xs,
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
    fontSize: theme.typography.bodySemibold.fontSize,
    fontWeight: theme.typography.bodySemibold.fontWeight,
    letterSpacing: theme.typography.bodySemibold.letterSpacing,
  },
  modalButtonTextPrimary: {
    color: theme.colors.background,
    fontSize: theme.typography.bodySemibold.fontSize,
    fontWeight: theme.typography.bodySemibold.fontWeight,
    letterSpacing: theme.typography.bodySemibold.letterSpacing,
  },
});
