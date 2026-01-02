import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  Alert,
  Modal,
  FlatList,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { theme } from '../utils/theme';
import { loadRoutines, saveRoutines, loadExerciseLibrary } from '../utils/storage';
import { Button } from '../components/Button';

export const CreateRoutineScreen = ({ route, navigation }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [exercises, setExercises] = useState([
    { name: '', sets: '3', reps: '10', rest: '60', notes: '' },
  ]);
  const [libraryModalVisible, setLibraryModalVisible] = useState(false);
  const [currentEditingIndex, setCurrentEditingIndex] = useState(null);
  const [exerciseLibrary, setExerciseLibrary] = useState([]);

  useEffect(() => {
    loadLibrary();
  }, []);

  const loadLibrary = async () => {
    const library = await loadExerciseLibrary();
    setExerciseLibrary(library);
  };

  const handleSelectFromLibrary = (index) => {
    setCurrentEditingIndex(index);
    setLibraryModalVisible(true);
  };

  const handleExerciseSelected = (exercise) => {
    if (currentEditingIndex !== null) {
      handleUpdateExercise(currentEditingIndex, 'name', exercise.name);
    }
    setLibraryModalVisible(false);
    setCurrentEditingIndex(null);
  };

  const handleAddExercise = () => {
    setExercises([...exercises, { name: '', sets: '3', reps: '10', rest: '60', notes: '' }]);
  };

  const handleRemoveExercise = (index) => {
    if (exercises.length > 1) {
      const updated = exercises.filter((_, i) => i !== index);
      setExercises(updated);
    }
  };

  const handleUpdateExercise = (index, field, value) => {
    const updated = [...exercises];
    updated[index][field] = value;
    setExercises(updated);
  };

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter a routine name');
      return;
    }

    const hasEmptyExercise = exercises.some((ex) => !ex.name.trim());
    if (hasEmptyExercise) {
      Alert.alert('Error', 'Please fill in all exercise names');
      return;
    }

    const routine = {
      id: Date.now().toString(),
      name: name.trim(),
      description: description.trim(),
      exercises: exercises.map((ex) => ({
        name: ex.name.trim(),
        sets: parseInt(ex.sets, 10) || 3,
        reps: ex.reps.trim(),
        rest: parseInt(ex.rest, 10) || 60,
        notes: ex.notes.trim(),
      })),
      createdAt: new Date().toISOString(),
    };

    const routines = await loadRoutines();
    routines.push(routine);
    await saveRoutines(routines);

    if (route.params?.onSave) {
      route.params.onSave();
    }

    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Create Routine</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Routine Name *</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., Morning Workout"
            placeholderTextColor={theme.colors.textSecondary}
            value={name}
            onChangeText={setName}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Optional description"
            placeholderTextColor={theme.colors.textSecondary}
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={3}
          />
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Exercises</Text>
            <TouchableOpacity onPress={handleAddExercise}>
              <Text style={styles.addButton}>+ Add</Text>
            </TouchableOpacity>
          </View>

          {exercises.map((exercise, index) => (
            <View key={index} style={styles.exerciseCard}>
              <View style={styles.exerciseHeader}>
                <Text style={styles.exerciseNumber}>Exercise {index + 1}</Text>
                {exercises.length > 1 && (
                  <TouchableOpacity onPress={() => handleRemoveExercise(index)}>
                    <Text style={styles.removeButton}>Remove</Text>
                  </TouchableOpacity>
                )}
              </View>

              <View style={styles.exerciseInputRow}>
                <TextInput
                  style={[styles.input, styles.exerciseNameInput]}
                  placeholder="Exercise name *"
                  placeholderTextColor={theme.colors.textSecondary}
                  value={exercise.name}
                  onChangeText={(value) => handleUpdateExercise(index, 'name', value)}
                />
                <TouchableOpacity
                  style={styles.libraryButton}
                  onPress={() => handleSelectFromLibrary(index)}
                >
                  <Text style={styles.libraryButtonText}>Library</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.row}>
                <View style={styles.smallInput}>
                  <Text style={styles.smallLabel}>Sets</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="3"
                    placeholderTextColor={theme.colors.textSecondary}
                    value={exercise.sets}
                    onChangeText={(value) => handleUpdateExercise(index, 'sets', value)}
                    keyboardType="numeric"
                  />
                </View>

                <View style={styles.smallInput}>
                  <Text style={styles.smallLabel}>Reps</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="10"
                    placeholderTextColor={theme.colors.textSecondary}
                    value={exercise.reps}
                    onChangeText={(value) => handleUpdateExercise(index, 'reps', value)}
                  />
                </View>

                <View style={styles.smallInput}>
                  <Text style={styles.smallLabel}>Rest (s)</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="60"
                    placeholderTextColor={theme.colors.textSecondary}
                    value={exercise.rest}
                    onChangeText={(value) => handleUpdateExercise(index, 'rest', value)}
                    keyboardType="numeric"
                  />
                </View>
              </View>

              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Notes (optional)"
                placeholderTextColor={theme.colors.textSecondary}
                value={exercise.notes}
                onChangeText={(value) => handleUpdateExercise(index, 'notes', value)}
                multiline
                numberOfLines={2}
              />
            </View>
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button title="Save Routine" onPress={handleSave} />
      </View>

      <Modal
        visible={libraryModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setLibraryModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select from Library</Text>
              <TouchableOpacity 
                onPress={() => setLibraryModalVisible(false)}
                accessibilityLabel="Close exercise library"
                accessibilityRole="button"
              >
                <Text style={styles.modalCloseButton}>✕</Text>
              </TouchableOpacity>
            </View>

            {exerciseLibrary.length === 0 ? (
              <View style={styles.emptyLibrary}>
                <Text style={styles.emptyLibraryText}>
                  No exercises in library yet.
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    setLibraryModalVisible(false);
                    navigation.navigate('ExerciseLibrary');
                  }}
                >
                  <Text style={styles.addToLibraryLink}>Go to Library</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <FlatList
                data={exerciseLibrary}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.libraryExerciseItem}
                    onPress={() => handleExerciseSelected(item)}
                  >
                    <Text style={styles.libraryExerciseName}>{item.name}</Text>
                    {item.category && (
                      <Text style={styles.libraryExerciseCategory}>
                        {item.category}
                      </Text>
                    )}
                  </TouchableOpacity>
                )}
              />
            )}
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
  header: {
    marginBottom: theme.spacing.lg,
  },
  title: {
    fontSize: theme.typography.title.fontSize,
    fontWeight: theme.typography.title.fontWeight,
    letterSpacing: theme.typography.title.letterSpacing,
    lineHeight: theme.typography.title.lineHeight,
    color: theme.colors.text,
  },
  section: {
    marginBottom: theme.spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: theme.typography.heading.fontSize,
    fontWeight: theme.typography.heading.fontWeight,
    letterSpacing: theme.typography.heading.letterSpacing,
    lineHeight: theme.typography.heading.lineHeight,
    color: theme.colors.text,
  },
  label: {
    fontSize: theme.typography.bodyMedium.fontSize,
    fontWeight: theme.typography.bodyMedium.fontWeight,
    letterSpacing: theme.typography.bodyMedium.letterSpacing,
    lineHeight: theme.typography.bodyMedium.lineHeight,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  input: {
    backgroundColor: theme.colors.surface,
    color: theme.colors.text,
    fontSize: theme.typography.body.fontSize,
    fontWeight: theme.typography.body.fontWeight,
    letterSpacing: theme.typography.body.letterSpacing,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
    paddingTop: theme.spacing.sm,
  },
  addButton: {
    fontSize: theme.typography.bodySemibold.fontSize,
    fontWeight: theme.typography.bodySemibold.fontWeight,
    letterSpacing: theme.typography.bodySemibold.letterSpacing,
    color: theme.colors.text,
  },
  exerciseInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  exerciseNameInput: {
    flex: 1,
    marginRight: theme.spacing.sm,
  },
  libraryButton: {
    backgroundColor: theme.colors.background,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  libraryButtonText: {
    fontSize: theme.typography.captionMedium.fontSize,
    fontWeight: theme.typography.captionMedium.fontWeight,
    letterSpacing: theme.typography.captionMedium.letterSpacing,
    color: theme.colors.text,
  },
  exerciseCard: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing.md,
    ...theme.elevation.low,
  },
  exerciseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
    paddingBottom: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  exerciseNumber: {
    fontSize: theme.typography.bodySemibold.fontSize,
    fontWeight: theme.typography.bodySemibold.fontWeight,
    letterSpacing: theme.typography.bodySemibold.letterSpacing,
    lineHeight: theme.typography.bodySemibold.lineHeight,
    color: theme.colors.text,
  },
  removeButton: {
    fontSize: theme.typography.caption.fontSize,
    fontWeight: theme.typography.caption.fontWeight,
    letterSpacing: theme.typography.caption.letterSpacing,
    color: theme.colors.textSecondary,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
  },
  smallInput: {
    flex: 1,
    marginHorizontal: theme.spacing.xs,
  },
  smallLabel: {
    fontSize: theme.typography.caption.fontSize,
    fontWeight: theme.typography.caption.fontWeight,
    letterSpacing: theme.typography.caption.letterSpacing,
    lineHeight: theme.typography.caption.lineHeight,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  footer: {
    padding: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: theme.colors.surface,
    borderTopLeftRadius: theme.borderRadius.xl,
    borderTopRightRadius: theme.borderRadius.xl,
    maxHeight: '75%',
    paddingBottom: theme.spacing.lg,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  modalTitle: {
    fontSize: theme.typography.heading.fontSize,
    fontWeight: theme.typography.heading.fontWeight,
    letterSpacing: theme.typography.heading.letterSpacing,
    lineHeight: theme.typography.heading.lineHeight,
    color: theme.colors.text,
  },
  modalCloseButton: {
    fontSize: 28,
    color: theme.colors.text,
    fontWeight: '300',
    lineHeight: 28,
  },
  libraryExerciseItem: {
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  libraryExerciseName: {
    fontSize: theme.typography.bodySemibold.fontSize,
    fontWeight: theme.typography.bodySemibold.fontWeight,
    letterSpacing: theme.typography.bodySemibold.letterSpacing,
    lineHeight: theme.typography.bodySemibold.lineHeight,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  libraryExerciseCategory: {
    fontSize: theme.typography.caption.fontSize,
    fontWeight: theme.typography.caption.fontWeight,
    letterSpacing: theme.typography.caption.letterSpacing,
    lineHeight: theme.typography.caption.lineHeight,
    color: theme.colors.textSecondary,
  },
  emptyLibrary: {
    padding: theme.spacing.xxl,
    alignItems: 'center',
  },
  emptyLibraryText: {
    fontSize: theme.typography.body.fontSize,
    fontWeight: theme.typography.body.fontWeight,
    letterSpacing: theme.typography.body.letterSpacing,
    lineHeight: theme.typography.body.lineHeight,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: theme.spacing.md,
  },
  addToLibraryLink: {
    fontSize: theme.typography.bodySemibold.fontSize,
    fontWeight: theme.typography.bodySemibold.fontWeight,
    letterSpacing: theme.typography.bodySemibold.letterSpacing,
    color: theme.colors.text,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.text,
  },
});
