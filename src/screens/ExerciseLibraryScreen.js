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
import { defaultExercises } from '../data/defaultExercises';
import { Button } from '../components/Button';

export const ExerciseLibraryScreen = ({ navigation }) => {
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingExercise, setEditingExercise] = useState(null);
  const [exerciseName, setExerciseName] = useState('');
  const [exerciseCategory, setExerciseCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadExercisesData();
  }, []);

  const loadExercisesData = async () => {
    setLoading(true);
    let data = await loadExerciseLibrary();

    // Initialize with defaults only once
    if (data.length === 0) {
      const initialized = await isExerciseLibraryInitialized();
      if (!initialized) {
        data = defaultExercises;
        await saveExerciseLibrary(data);
        await setExerciseLibraryInitialized();
      }
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

  const filteredExercises = exercises.filter((exercise) => {
    if (!searchQuery.trim()) return true;
    
    const query = searchQuery.toLowerCase();
    const name = exercise.name.toLowerCase();
    const category = (exercise.category || '').toLowerCase();
    
    return name.includes(query) || category.includes(query);
  });

  const renderExercise = ({ item }) => (
    <View style={styles.exerciseCard}>
      <TouchableOpacity
        style={styles.exerciseContent}
        onPress={() => handleEditExercise(item)}
        activeOpacity={0.8}
      >
        {item.category && (
          <Text style={styles.exerciseCategoryLabel}>{item.category}</Text>
        )}
        <Text style={styles.exerciseName}>{item.name}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDeleteExercise(item.id)}
        activeOpacity={0.8}
      >
        <Text style={styles.deleteButtonText}>DELETE</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <Text style={styles.title}>EXERCISE LIBRARY</Text>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search exercises..."
          placeholderTextColor={theme.colors.textTertiary}
          value={searchQuery}
          onChangeText={setSearchQuery}
          autoCapitalize="none"
          autoCorrect={false}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity
            style={styles.clearButton}
            onPress={() => setSearchQuery('')}
            activeOpacity={0.7}
          >
            <Text style={styles.clearButtonText}>✕</Text>
          </TouchableOpacity>
        )}
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
        <Button title="ADD EXERCISE" onPress={handleAddExercise} />
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
              {editingExercise ? 'EDIT EXERCISE' : 'ADD EXERCISE'}
            </Text>

            <View style={styles.modalSection}>
              <Text style={styles.label}>NAME *</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., Push-ups"
                placeholderTextColor={theme.colors.textTertiary}
                value={exerciseName}
                onChangeText={setExerciseName}
              />
            </View>

            <View style={styles.modalSection}>
              <Text style={styles.label}>CATEGORY</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., Upper Body, Lower Body, Core"
                placeholderTextColor={theme.colors.textTertiary}
                value={exerciseCategory}
                onChangeText={setExerciseCategory}
              />
            </View>

            <View style={styles.modalButtons}>
              <Button
                title="CANCEL"
                onPress={() => setModalVisible(false)}
                variant="outline"
                style={[styles.modalButton, styles.modalButtonLeft]}
              />
              <Button
                title="SAVE"
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
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.background,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  title: {
    fontSize: theme.typography.micro.fontSize,
    fontWeight: theme.typography.micro.fontWeight,
    letterSpacing: theme.typography.micro.letterSpacing,
    lineHeight: theme.typography.micro.lineHeight,
    color: theme.colors.textMicro,
    textTransform: 'uppercase',
  },
  searchContainer: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    backgroundColor: theme.colors.background,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    color: theme.colors.text,
    fontSize: theme.typography.body.fontSize,
    fontWeight: theme.typography.body.fontWeight,
    letterSpacing: theme.typography.body.letterSpacing,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  clearButton: {
    position: 'absolute',
    right: theme.spacing.md + theme.spacing.sm,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.border,
    borderRadius: theme.borderRadius.sm,
  },
  clearButtonText: {
    fontSize: 16,
    color: theme.colors.text,
    fontWeight: '600',
  },
  list: {
    padding: theme.spacing.md,
  },
  exerciseCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.surface,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing.sm,
    ...theme.elevation.low,
  },
  exerciseContent: {
    flex: 1,
  },
  exerciseCategoryLabel: {
    fontSize: theme.typography.micro.fontSize,
    fontWeight: theme.typography.micro.fontWeight,
    letterSpacing: theme.typography.micro.letterSpacing,
    lineHeight: theme.typography.micro.lineHeight,
    color: theme.colors.textMicro,
    marginBottom: theme.spacing.xs,
    textTransform: 'uppercase',
  },
  exerciseName: {
    fontSize: theme.typography.body.fontSize,
    fontWeight: theme.typography.bodyMedium.fontWeight,
    letterSpacing: theme.typography.body.letterSpacing,
    lineHeight: theme.typography.body.lineHeight,
    color: theme.colors.text,
  },
  deleteButton: {
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  deleteButtonText: {
    fontSize: theme.typography.micro.fontSize,
    fontWeight: theme.typography.micro.fontWeight,
    letterSpacing: theme.typography.micro.letterSpacing,
    color: theme.colors.textSecondary,
    textTransform: 'uppercase',
  },
  emptyContainer: {
    paddingVertical: theme.spacing.xxl,
    paddingHorizontal: theme.spacing.md,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: theme.typography.body.fontSize,
    fontWeight: theme.typography.bodyMedium.fontWeight,
    letterSpacing: theme.typography.body.letterSpacing,
    lineHeight: theme.typography.body.lineHeight,
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
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
    backgroundColor: theme.colors.background,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.sm,
    padding: theme.spacing.lg,
    width: '85%',
    maxWidth: 400,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  modalTitle: {
    fontSize: theme.typography.micro.fontSize,
    fontWeight: theme.typography.micro.fontWeight,
    letterSpacing: theme.typography.micro.letterSpacing,
    lineHeight: theme.typography.micro.lineHeight,
    color: theme.colors.textMicro,
    marginBottom: theme.spacing.lg,
    textTransform: 'uppercase',
  },
  modalSection: {
    marginBottom: theme.spacing.md,
  },
  label: {
    fontSize: theme.typography.micro.fontSize,
    fontWeight: theme.typography.micro.fontWeight,
    letterSpacing: theme.typography.micro.letterSpacing,
    lineHeight: theme.typography.micro.lineHeight,
    color: theme.colors.textMicro,
    marginBottom: theme.spacing.sm,
    textTransform: 'uppercase',
  },
  input: {
    backgroundColor: theme.colors.background,
    color: theme.colors.text,
    fontSize: theme.typography.body.fontSize,
    fontWeight: theme.typography.body.fontWeight,
    letterSpacing: theme.typography.body.letterSpacing,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: theme.spacing.lg,
    gap: theme.spacing.sm,
  },
  modalButton: {
    flex: 1,
  },
  modalButtonLeft: {
    marginRight: 0,
  },
  modalButtonRight: {
    marginLeft: 0,
  },
});
