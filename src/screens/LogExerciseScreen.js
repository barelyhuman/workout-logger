import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { theme } from '../utils/theme';
import { loadExerciseLibrary, saveExerciseLog } from '../utils/storage';
import { formatDuration } from '../utils/durationFormatter';
import { Button } from '../components/Button';

export const LogExerciseScreen = ({ navigation }) => {
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [reps, setReps] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [minutes, setMinutes] = useState('');
  const [seconds, setSeconds] = useState('');

  useEffect(() => {
    loadExercisesData();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadExercisesData();
    });
    return unsubscribe;
  }, [navigation]);

  const loadExercisesData = async () => {
    setLoading(true);
    const data = await loadExerciseLibrary();
    setExercises(data);
    setLoading(false);
  };

  const handleExercisePress = (exercise) => {
    setSelectedExercise(exercise);
    setReps('');
    setMinutes('');
    setSeconds('');
    setModalVisible(true);
  };

  const handleLogExercise = async () => {
    const trackingType = selectedExercise.trackingType || 'reps';
    let parsedReps, parsedMinutes, parsedSeconds;
    
    if (trackingType === 'reps') {
      if (!reps.trim() || isNaN(reps)) {
        Alert.alert('Error', 'Please enter a valid number of reps');
        return;
      }
      parsedReps = parseInt(reps, 10);
    } else {
      // Duration tracking - parse and validate
      parsedMinutes = parseInt(minutes || '0', 10);
      parsedSeconds = parseInt(seconds || '0', 10);
      
      if (isNaN(parsedMinutes) || isNaN(parsedSeconds) || parsedMinutes < 0 || parsedSeconds < 0) {
        Alert.alert('Error', 'Please enter valid positive numbers for duration');
        return;
      }
      
      if (parsedMinutes === 0 && parsedSeconds === 0) {
        Alert.alert('Error', 'Duration must be at least 1 second');
        return;
      }
      
      if (parsedSeconds >= 60) {
        Alert.alert('Error', 'Seconds must be less than 60');
        return;
      }
    }

    const log = {
      id: Date.now().toString(),
      exerciseId: selectedExercise.id,
      exerciseName: selectedExercise.name,
      category: selectedExercise.category,
      trackingType,
      timestamp: new Date().toISOString(),
    };

    if (trackingType === 'reps') {
      log.reps = parsedReps;
    } else {
      log.duration = parsedMinutes * 60 + parsedSeconds;
    }

    const success = await saveExerciseLog(log);
    if (success) {
      if (trackingType === 'reps') {
        Alert.alert('Success', `Logged ${reps} reps of ${selectedExercise.name}`);
      } else {
        Alert.alert('Success', `Logged ${formatDuration(log.duration)} of ${selectedExercise.name}`);
      }
      setModalVisible(false);
      setReps('');
      setMinutes('');
      setSeconds('');
      setSelectedExercise(null);
    } else {
      Alert.alert('Error', 'Failed to log exercise');
    }
  };

  const filteredExercises = exercises.filter((exercise) => {
    if (!searchQuery.trim()) return true;
    
    const query = searchQuery.toLowerCase();
    const name = exercise.name.toLowerCase();
    const category = (exercise.category || '').toLowerCase();
    
    return name.includes(query) || category.includes(query);
  });

  const renderExercise = ({ item }) => (
    <TouchableOpacity
      style={styles.exerciseCard}
      onPress={() => handleExercisePress(item)}
      activeOpacity={0.8}
    >
      <View style={styles.exerciseContent}>
        <View style={styles.exerciseHeader}>
          {item.category && (
            <Text style={styles.exerciseCategoryLabel}>{item.category}</Text>
          )}
        </View>
        <Text style={styles.exerciseName}>{item.name}</Text>
      </View>
      <View style={styles.logButton}>
        <Text style={styles.logButtonText}>LOG</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <View style={styles.headerButtons}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => navigation.navigate('ExerciseLibrary')}
            activeOpacity={0.7}
          >
            <Text style={styles.headerButtonText}>LIBRARY</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => navigation.navigate('Summary')}
            activeOpacity={0.7}
          >
            <Text style={styles.headerButtonText}>Summary</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => navigation.navigate('History')}
            activeOpacity={0.7}
          >
            <Text style={styles.headerButtonText}>HISTORY</Text>
          </TouchableOpacity>
        </View>
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
                : 'Add exercises to your library to start logging workouts!'}
            </Text>
            {!searchQuery && (
              <Button
                title="GO TO LIBRARY"
                onPress={() => navigation.navigate('ExerciseLibrary')}
                style={styles.emptyButton}
              />
            )}
          </View>
        }
      />

      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>LOG EXERCISE</Text>
            {selectedExercise && (
              <>
                <Text style={styles.modalExerciseName}>
                  {selectedExercise.name}
                </Text>
                {selectedExercise.category && (
                  <Text style={styles.modalExerciseCategory}>
                    {selectedExercise.category}
                  </Text>
                )}

                {(!selectedExercise.trackingType || selectedExercise.trackingType === 'reps') ? (
                  <View style={styles.modalSection}>
                    <Text style={styles.label}>REPS *</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Enter number of reps"
                      placeholderTextColor={theme.colors.textTertiary}
                      value={reps}
                      onChangeText={setReps}
                      keyboardType="numeric"
                      autoFocus
                    />
                  </View>
                ) : (
                  <View style={styles.modalSection}>
                    <Text style={styles.label}>DURATION *</Text>
                    <View style={styles.durationContainer}>
                      <View style={styles.durationInputGroup}>
                        <TextInput
                          style={styles.durationInput}
                          placeholder="0"
                          placeholderTextColor={theme.colors.textTertiary}
                          value={minutes}
                          onChangeText={setMinutes}
                          keyboardType="numeric"
                          autoFocus
                        />
                        <Text style={styles.durationLabel}>min</Text>
                      </View>
                      <View style={styles.durationInputGroup}>
                        <TextInput
                          style={styles.durationInput}
                          placeholder="0"
                          placeholderTextColor={theme.colors.textTertiary}
                          value={seconds}
                          onChangeText={setSeconds}
                          keyboardType="numeric"
                        />
                        <Text style={styles.durationLabel}>sec</Text>
                      </View>
                    </View>
                  </View>
                )}

                <View style={styles.modalButtons}>
                  <Button
                    title="CANCEL"
                    onPress={() => setModalVisible(false)}
                    variant="outline"
                    style={[styles.modalButton, styles.modalButtonLeft]}
                  />
                  <Button
                    title="LOG"
                    onPress={handleLogExercise}
                    style={[styles.modalButton, styles.modalButtonRight]}
                  />
                </View>
              </>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.background,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  headerButtons: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  headerButton: {
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  headerButtonText: {
    fontSize: theme.typography.micro.fontSize,
    fontWeight: theme.typography.micro.fontWeight,
    letterSpacing: theme.typography.micro.letterSpacing,
    color: theme.colors.text,
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
  exerciseHeader: {
    marginBottom: theme.spacing.xs,
  },
  exerciseCategoryLabel: {
    fontSize: theme.typography.micro.fontSize,
    fontWeight: theme.typography.micro.fontWeight,
    letterSpacing: theme.typography.micro.letterSpacing,
    lineHeight: theme.typography.micro.lineHeight,
    color: theme.colors.textMicro,
    textTransform: 'uppercase',
  },
  exerciseName: {
    fontSize: theme.typography.body.fontSize,
    fontWeight: theme.typography.bodyMedium.fontWeight,
    letterSpacing: theme.typography.body.letterSpacing,
    lineHeight: theme.typography.body.lineHeight,
    color: theme.colors.text,
  },
  logButton: {
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.sm,
    minWidth: 60,
    alignItems: 'center',
  },
  logButtonText: {
    fontSize: theme.typography.micro.fontSize,
    fontWeight: theme.typography.micro.fontWeight,
    letterSpacing: theme.typography.micro.letterSpacing,
    color: theme.colors.surface,
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
    marginBottom: theme.spacing.lg,
  },
  emptyButton: {
    marginTop: theme.spacing.md,
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
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  modalExerciseName: {
    fontSize: theme.typography.heading.fontSize,
    fontWeight: theme.typography.heading.fontWeight,
    letterSpacing: theme.typography.heading.letterSpacing,
    lineHeight: theme.typography.heading.lineHeight,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
    textAlign: 'center',
  },
  modalExerciseCategory: {
    fontSize: theme.typography.caption.fontSize,
    fontWeight: theme.typography.caption.fontWeight,
    letterSpacing: theme.typography.caption.letterSpacing,
    lineHeight: theme.typography.caption.lineHeight,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.lg,
    textAlign: 'center',
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
  durationContainer: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  durationInputGroup: {
    flex: 1,
    alignItems: 'center',
  },
  durationInput: {
    backgroundColor: theme.colors.background,
    color: theme.colors.text,
    fontSize: theme.typography.body.fontSize,
    fontWeight: theme.typography.body.fontWeight,
    letterSpacing: theme.typography.body.letterSpacing,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
    width: '100%',
    textAlign: 'center',
  },
  durationLabel: {
    fontSize: theme.typography.caption.fontSize,
    fontWeight: theme.typography.caption.fontWeight,
    letterSpacing: theme.typography.caption.letterSpacing,
    lineHeight: theme.typography.caption.lineHeight,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
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
