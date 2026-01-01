import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { theme } from '../utils/theme';
import { loadRoutines, saveRoutines } from '../utils/storage';
import { Button } from '../components/Button';

export const CreateRoutineScreen = ({ route, navigation }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [exercises, setExercises] = useState([
    { name: '', sets: '3', reps: '10', rest: '60', notes: '' },
  ]);

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
        <Text style={styles.title}>Create Routine</Text>

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

              <TextInput
                style={styles.input}
                placeholder="Exercise name *"
                placeholderTextColor={theme.colors.textSecondary}
                value={exercise.name}
                onChangeText={(value) => handleUpdateExercise(index, 'name', value)}
              />

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
    marginBottom: theme.spacing.lg,
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
    color: theme.colors.text,
  },
  label: {
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  input: {
    backgroundColor: theme.colors.surface,
    color: theme.colors.text,
    fontSize: theme.typography.body.fontSize,
    padding: theme.spacing.md,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  addButton: {
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.text,
    fontWeight: '600',
  },
  exerciseCard: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing.md,
  },
  exerciseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  exerciseNumber: {
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.text,
    fontWeight: '600',
  },
  removeButton: {
    fontSize: theme.typography.caption.fontSize,
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
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  footer: {
    padding: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
});
