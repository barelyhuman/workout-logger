import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  TextInput,
  Modal,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { theme } from '../utils/theme';
import { loadExerciseLibrary, saveExerciseLibrary } from '../utils/storage';
import { defaultExercises } from '../data/defaultExercises';
import { Button } from '../components/Button';

export const ExerciseLibraryScreen = ({ navigation }) => {
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingExercise, setEditingExercise] = useState(null);
  const [exerciseName, setExerciseName] = useState('');
  const [exerciseCategory, setExerciseCategory] = useState('');

  useEffect(() => {
    loadExercisesData();
  }, []);

  const loadExercisesData = async () => {
    setLoading(true);
    let data = await loadExerciseLibrary();

    // If no exercises, initialize with defaults
    if (data.length === 0) {
      data = defaultExercises;
      await saveExerciseLibrary(data);
    }

    setExercises(data);
    setLoading(false);
  };

  const handleAddExercise = () => {
    setEditingExercise(null);
    setExerciseName('');
    setExerciseCategory('');
    setModalVisible(true);
  };

  const handleEditExercise = (exercise) => {
    setEditingExercise(exercise);
    setExerciseName(exercise.name);
    setExerciseCategory(exercise.category || '');
    setModalVisible(true);
  };

  const handleSaveExercise = async () => {
    if (!exerciseName.trim()) {
      Alert.alert('Error', 'Please enter an exercise name');
      return;
    }

    let updatedExercises;
    if (editingExercise) {
      // Edit existing exercise
      updatedExercises = exercises.map((ex) =>
        ex.id === editingExercise.id
          ? { ...ex, name: exerciseName.trim(), category: exerciseCategory.trim() }
          : ex
      );
    } else {
      // Add new exercise
      const newExercise = {
        id: Date.now().toString(),
        name: exerciseName.trim(),
        category: exerciseCategory.trim() || 'Other',
      };
      updatedExercises = [...exercises, newExercise];
    }

    await saveExerciseLibrary(updatedExercises);
    setExercises(updatedExercises);
    setModalVisible(false);
  };

  const handleDeleteExercise = (exerciseId) => {
    Alert.alert(
      'Delete Exercise',
      'Are you sure you want to delete this exercise from the library?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const updatedExercises = exercises.filter((ex) => ex.id !== exerciseId);
            await saveExerciseLibrary(updatedExercises);
            setExercises(updatedExercises);
          },
        },
      ]
    );
  };

  const renderExercise = ({ item }) => (
    <View style={styles.exerciseCard}>
      <TouchableOpacity
        style={styles.exerciseContent}
        onPress={() => handleEditExercise(item)}
      >
        <Text style={styles.exerciseName}>{item.name}</Text>
        {item.category && (
          <Text style={styles.exerciseCategory}>{item.category}</Text>
        )}
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDeleteExercise(item.id)}
      >
        <Text style={styles.deleteButtonText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      <FlatList
        data={exercises}
        renderItem={renderExercise}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        refreshing={loading}
        onRefresh={loadExercisesData}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            No exercises in library. Add your first one!
          </Text>
        }
      />

      <View style={styles.footer}>
        <Button title="Add Exercise" onPress={handleAddExercise} />
      </View>

      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {editingExercise ? 'Edit Exercise' : 'Add Exercise'}
            </Text>

            <View style={styles.modalSection}>
              <Text style={styles.label}>Exercise Name *</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., Push-ups"
                placeholderTextColor={theme.colors.textSecondary}
                value={exerciseName}
                onChangeText={setExerciseName}
              />
            </View>

            <View style={styles.modalSection}>
              <Text style={styles.label}>Category</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., Upper Body, Lower Body, Core"
                placeholderTextColor={theme.colors.textSecondary}
                value={exerciseCategory}
                onChangeText={setExerciseCategory}
              />
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonPrimary]}
                onPress={handleSaveExercise}
              >
                <Text style={[styles.modalButtonText, styles.modalButtonPrimaryText]}>Save</Text>
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
  list: {
    padding: theme.spacing.md,
  },
  exerciseCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing.sm,
  },
  exerciseContent: {
    flex: 1,
  },
  exerciseName: {
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.text,
    fontWeight: '600',
    marginBottom: theme.spacing.xs,
  },
  exerciseCategory: {
    fontSize: theme.typography.caption.fontSize,
    color: theme.colors.textSecondary,
  },
  deleteButton: {
    padding: theme.spacing.sm,
  },
  deleteButtonText: {
    fontSize: theme.typography.caption.fontSize,
    color: theme.colors.textSecondary,
  },
  emptyText: {
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginTop: theme.spacing.xl,
  },
  footer: {
    padding: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    padding: theme.spacing.lg,
    width: '85%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: theme.typography.heading.fontSize,
    fontWeight: theme.typography.heading.fontWeight,
    color: theme.colors.text,
    marginBottom: theme.spacing.lg,
  },
  modalSection: {
    marginBottom: theme.spacing.md,
  },
  label: {
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  input: {
    backgroundColor: theme.colors.background,
    color: theme.colors.text,
    fontSize: theme.typography.body.fontSize,
    padding: theme.spacing.md,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: theme.spacing.lg,
  },
  modalButton: {
    flex: 1,
    padding: theme.spacing.md,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginHorizontal: theme.spacing.xs,
    alignItems: 'center',
  },
  modalButtonPrimary: {
    backgroundColor: theme.colors.text,
  },
  modalButtonText: {
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.text,
    fontWeight: '600',
  },
  modalButtonPrimaryText: {
    color: theme.colors.background,
  },
});
