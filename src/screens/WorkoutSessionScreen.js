import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, Modal, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { theme } from '../utils/theme';
import { saveWorkoutToHistory } from '../utils/storage';
import { ExerciseItem } from '../components/ExerciseItem';
import { Button } from '../components/Button';

export const WorkoutSessionScreen = ({ route, navigation }) => {
  const { routine } = route.params;
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [currentSetIndex, setCurrentSetIndex] = useState(0);
  const [isResting, setIsResting] = useState(false);
  const [restTimeRemaining, setRestTimeRemaining] = useState(0);
  const [completedExercises, setCompletedExercises] = useState([]);
  const [skippedExercises, setSkippedExercises] = useState([]);
  const [startTime] = useState(new Date());
  const [showRepsModal, setShowRepsModal] = useState(false);
  const [currentExerciseReps, setCurrentExerciseReps] = useState([]);

  const currentExercise = routine.exercises[currentExerciseIndex];
  const isLastExercise = currentExerciseIndex === routine.exercises.length - 1;
  const totalSets = currentExercise?.sets || 3;
  const isLastSet = currentSetIndex === totalSets - 1;

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

  const handleCompleteSet = () => {
    // Show modal to enter reps for current set
    const plannedReps = currentExercise.reps || '10';
    setShowRepsModal(true);
  };

  const handleConfirmSetReps = (reps) => {
    // Store the reps for this set
    const updatedReps = [...currentExerciseReps];
    updatedReps[currentSetIndex] = reps;
    setCurrentExerciseReps(updatedReps);
    setShowRepsModal(false);

    // Check if this was the last set of the exercise
    if (isLastSet) {
      // Complete the exercise
      const exerciseWithReps = { 
        ...currentExercise, 
        skipped: false,
        actualReps: updatedReps 
      };
      const updatedCompleted = [...completedExercises, exerciseWithReps];
      setCompletedExercises(updatedCompleted);
      
      // Reset for next exercise
      setCurrentExerciseReps([]);
      setCurrentSetIndex(0);

      if (isLastExercise) {
        handleFinishWorkout(updatedCompleted, skippedExercises);
      } else {
        // Start rest period before next exercise
        setRestTimeRemaining(currentExercise.rest || 60);
        setIsResting(true);
      }
    } else {
      // Start rest before next set (don't increment set index yet)
      setRestTimeRemaining(currentExercise.rest || 60);
      setIsResting(true);
    }
  };

  const handleSkipExercise = () => {
    const updatedSkipped = [...skippedExercises, { ...currentExercise, skipped: true }];
    setSkippedExercises(updatedSkipped);
    
    // Reset set tracking
    setCurrentSetIndex(0);
    setCurrentExerciseReps([]);

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
    
    // Check if we're resting between sets or between exercises
    if (isLastSet && currentExerciseReps.length === currentSetIndex + 1) {
      // We're between exercises (just completed last set), move to next exercise
      setCurrentExerciseIndex((prev) => prev + 1);
    } else if (currentExerciseReps.length === currentSetIndex + 1) {
      // We're between sets (just completed a non-last set), move to next set
      setCurrentSetIndex((prev) => prev + 1);
    }
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

  // Helper function to determine when to automatically advance after rest period
  const shouldMoveToNextExercise = () => {
    // Only move to next exercise if we just completed the last set of current exercise
    return !isResting && restTimeRemaining === 0 && isLastSet && currentExerciseReps.length === currentSetIndex + 1 && !isLastExercise;
  };

  const shouldMoveToNextSet = () => {
    // Move to next set if we just completed a set that wasn't the last
    return !isResting && restTimeRemaining === 0 && !isLastSet && currentExerciseReps.length === currentSetIndex + 1;
  };

  useEffect(() => {
    if (shouldMoveToNextExercise()) {
      setCurrentExerciseIndex((prev) => prev + 1);
    } else if (shouldMoveToNextSet()) {
      setCurrentSetIndex((prev) => prev + 1);
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
              {isLastSet 
                ? `Next: ${routine.exercises[currentExerciseIndex + 1]?.name}` 
                : `Next: Set ${currentSetIndex + 2} of ${currentExercise.name}`
              }
            </Text>
          </View>
        ) : (
          <View style={styles.exerciseContainer}>
            <Text style={styles.exerciseTitle}>Current Exercise</Text>
            <ExerciseItem exercise={currentExercise} />
            
            <View style={styles.setProgressContainer}>
              <Text style={styles.setProgressTitle}>
                Set {currentSetIndex + 1} of {totalSets}
              </Text>
              <View style={styles.setsGrid}>
                {Array.from({ length: totalSets }, (_, index) => (
                  <View 
                    key={index} 
                    style={[
                      styles.setIndicator,
                      index < currentSetIndex && styles.setIndicatorCompleted,
                      index === currentSetIndex && styles.setIndicatorCurrent,
                    ]}
                  >
                    <Text 
                      style={[
                        styles.setIndicatorText,
                        index < currentSetIndex && styles.setIndicatorTextCompleted,
                        index === currentSetIndex && styles.setIndicatorTextCurrent,
                      ]}
                    >
                      {index + 1}
                    </Text>
                  </View>
                ))}
              </View>
              {currentExerciseReps.length > 0 && currentSetIndex > 0 && (
                <View style={styles.completedSetsInfo}>
                  <Text style={styles.completedSetsText}>
                    Completed: {currentExerciseReps.slice(0, currentSetIndex).map((r, i) => `Set ${i + 1}: ${r}`).join(', ')}
                  </Text>
                </View>
              )}
            </View>
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
              title={isLastSet && isLastExercise ? 'Finish Workout' : 'Complete Set'}
              onPress={handleCompleteSet}
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
              {currentExercise?.name} - Set {currentSetIndex + 1} of {totalSets}
            </Text>
            
            <View style={styles.repInputContainer}>
              <Text style={styles.repInputLabel}>Reps:</Text>
              <TextInput
                style={styles.repInput}
                value={currentExerciseReps[currentSetIndex] || currentExercise?.reps?.toString() || ''}
                onChangeText={(value) => {
                  const updated = [...currentExerciseReps];
                  updated[currentSetIndex] = value;
                  setCurrentExerciseReps(updated);
                }}
                keyboardType="numeric"
                placeholder={currentExercise?.reps?.toString() || "Reps"}
                placeholderTextColor={theme.colors.textSecondary}
                autoFocus={true}
              />
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.modalButtonOutline]}
                onPress={() => setShowRepsModal(false)}
              >
                <Text style={styles.modalButtonTextOutline}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.modalButtonPrimary]}
                onPress={() => {
                  const reps = currentExerciseReps[currentSetIndex] || currentExercise?.reps?.toString() || '0';
                  handleConfirmSetReps(reps);
                }}
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
  setProgressContainer: {
    marginTop: theme.spacing.lg,
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  setProgressTitle: {
    fontSize: theme.typography.subheading.fontSize,
    fontWeight: theme.typography.subheading.fontWeight,
    letterSpacing: theme.typography.subheading.letterSpacing,
    lineHeight: theme.typography.subheading.lineHeight,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
    textAlign: 'center',
  },
  setsGrid: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  setIndicator: {
    width: 44,
    height: 44,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.background,
    borderWidth: 2,
    borderColor: theme.colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  setIndicatorCompleted: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  setIndicatorCurrent: {
    borderColor: theme.colors.text,
    borderWidth: 2,
  },
  setIndicatorText: {
    fontSize: theme.typography.bodySemibold.fontSize,
    fontWeight: theme.typography.bodySemibold.fontWeight,
    letterSpacing: theme.typography.bodySemibold.letterSpacing,
    color: theme.colors.textSecondary,
  },
  setIndicatorTextCompleted: {
    color: theme.colors.background,
  },
  setIndicatorTextCurrent: {
    color: theme.colors.text,
  },
  completedSetsInfo: {
    marginTop: theme.spacing.md,
    paddingTop: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  completedSetsText: {
    fontSize: theme.typography.caption.fontSize,
    fontWeight: theme.typography.caption.fontWeight,
    letterSpacing: theme.typography.caption.letterSpacing,
    lineHeight: theme.typography.caption.lineHeight,
    color: theme.colors.textSecondary,
    textAlign: 'center',
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
  repInputContainer: {
    marginVertical: theme.spacing.lg,
  },
  repInputLabel: {
    fontSize: theme.typography.bodySemibold.fontSize,
    fontWeight: theme.typography.bodySemibold.fontWeight,
    letterSpacing: theme.typography.bodySemibold.letterSpacing,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
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
    backgroundColor: theme.colors.surfaceLight,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    fontSize: theme.typography.body.fontSize,
    fontWeight: theme.typography.body.fontWeight,
    letterSpacing: theme.typography.body.letterSpacing,
    color: theme.colors.text,
    textAlign: 'center',
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
