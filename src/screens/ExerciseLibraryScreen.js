import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  TextInput,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { theme } from '../utils/theme';
import { loadExerciseLibrary, saveExerciseLibrary, isExerciseLibraryInitialized, setExerciseLibraryInitialized } from '../utils/storage';
import { applySearchFilter } from '../utils/searchUtils';
import { defaultExercises } from '../data/defaultExercises';
import { Button } from '../components/Button';

export const ExerciseLibraryScreen = ({ navigation }) => {
  const [exercises, setExercises] = useState([]);
  const [filteredExercises, setFilteredExercises] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
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

    // Initialize with defaults only once
    if (!data || data.length === 0) {
      const initialized = await isExerciseLibraryInitialized();
      if (!initialized) {
        data = defaultExercises;
        await saveExerciseLibrary(data);
        await setExerciseLibraryInitialized();
      }
    }

    setExercises(data || []);
    setFilteredExercises(data || []);
    setLoading(false);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    setFilteredExercises(applySearchFilter(exercises, query));
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
      // Add new exercise with more robust ID generation
      const newExercise = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`,
        name: exerciseName.trim(),
        category: exerciseCategory.trim() || 'Other',
      };
      updatedExercises = [...exercises, newExercise];
    }

    await saveExerciseLibrary(updatedExercises);
    setExercises(updatedExercises);
    setFilteredExercises(applySearchFilter(updatedExercises, searchQuery));
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
            setFilteredExercises(applySearchFilter(updatedExercises, searchQuery));
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
      <View style={styles.header}>
        <Text style={styles.title}>Exercise Library</Text>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search exercises..."
          placeholderTextColor={theme.colors.textSecondary}
          value={searchQuery}
          onChangeText={handleSearch}
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>

      <FlatList
        data={filteredExercises}
        renderItem={renderExercise}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        refreshing={loading}
        onRefresh={loadExercisesData}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {searchQuery ? 'No exercises found.' : 'No exercises in library.'}
            </Text>
            <Text style={styles.emptySubtext}>
              {searchQuery
                ? 'Try a different search term.'
                : 'Add your first one to get started!'}
            </Text>
          </View>
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
              <Button
                title="Cancel"
                onPress={() => setModalVisible(false)}
                variant="outline"
                style={[styles.modalButton, styles.modalButtonLeft]}
              />
              <Button
                title="Save"
                onPress={handleSaveExercise}
                style={[styles.modalButton, styles.modalButtonRight]}
              />
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
  searchContainer: {
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.sm,
  },
  searchInput: {
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
  list: {
    padding: theme.spacing.md,
  },
  exerciseCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing.sm,
    ...theme.elevation.low,
  },
  exerciseContent: {
    flex: 1,
  },
  exerciseName: {
    fontSize: theme.typography.bodySemibold.fontSize,
    fontWeight: theme.typography.bodySemibold.fontWeight,
    letterSpacing: theme.typography.bodySemibold.letterSpacing,
    lineHeight: theme.typography.bodySemibold.lineHeight,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  exerciseCategory: {
    fontSize: theme.typography.caption.fontSize,
    fontWeight: theme.typography.caption.fontWeight,
    letterSpacing: theme.typography.caption.letterSpacing,
    lineHeight: theme.typography.caption.lineHeight,
    color: theme.colors.textSecondary,
  },
  deleteButton: {
    padding: theme.spacing.sm,
    paddingLeft: theme.spacing.md,
  },
  deleteButtonText: {
    fontSize: theme.typography.caption.fontSize,
    fontWeight: theme.typography.caption.fontWeight,
    letterSpacing: theme.typography.caption.letterSpacing,
    color: theme.colors.textSecondary,
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
  footer: {
    padding: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.lg,
    width: '85%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: theme.typography.heading.fontSize,
    fontWeight: theme.typography.heading.fontWeight,
    letterSpacing: theme.typography.heading.letterSpacing,
    lineHeight: theme.typography.heading.lineHeight,
    color: theme.colors.text,
    marginBottom: theme.spacing.lg,
  },
  modalSection: {
    marginBottom: theme.spacing.md,
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
    backgroundColor: theme.colors.background,
    color: theme.colors.text,
    fontSize: theme.typography.body.fontSize,
    fontWeight: theme.typography.body.fontWeight,
    letterSpacing: theme.typography.body.letterSpacing,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
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
  },
  modalButtonLeft: {
    marginRight: theme.spacing.xs,
  },
  modalButtonRight: {
    marginLeft: theme.spacing.xs,
  },
});
