import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { theme } from '../utils/theme';
import { loadExerciseLogs, updateExerciseLog, deleteExerciseLog } from '../utils/storage';
import { formatDate, formatTime } from '../utils/dateFormatter';
import { formatDuration } from '../utils/durationFormatter';
import { Button } from '../components/Button';

// Constants
const DEFAULT_TRACKING_TYPE = 'reps';

export const HistoryScreen = ({ navigation }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedLog, setSelectedLog] = useState(null);
  const [reps, setReps] = useState('');
  const [minutes, setMinutes] = useState('');
  const [seconds, setSeconds] = useState('');

  useEffect(() => {
    loadHistory();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadHistory();
    });
    return unsubscribe;
  }, [navigation]);

  const loadHistory = async () => {
    setLoading(true);
    const data = await loadExerciseLogs();
    setHistory(data);
    setLoading(false);
  };

  const handleLogPress = (log) => {
    setSelectedLog(log);
    const trackingType = log.trackingType || DEFAULT_TRACKING_TYPE;
    
    if (trackingType === 'reps') {
      setReps(log.reps?.toString() || '');
      setMinutes('');
      setSeconds('');
    } else {
      const totalSeconds = log.duration || 0;
      const mins = Math.floor(totalSeconds / 60);
      const secs = totalSeconds % 60;
      setMinutes(mins.toString());
      setSeconds(secs.toString());
      setReps('');
    }
    
    setModalVisible(true);
  };

  const handleSaveEdit = async () => {
    const trackingType = selectedLog.trackingType || DEFAULT_TRACKING_TYPE;
    let parsedReps, parsedMinutes, parsedSeconds;
    
    if (trackingType === 'reps') {
      if (!reps.trim() || isNaN(reps)) {
        Alert.alert('Error', 'Please enter a valid number of reps');
        return;
      }
      parsedReps = parseInt(reps, 10);
    } else {
      parsedMinutes = parseInt(minutes || '0', 10);
      parsedSeconds = parseInt(seconds || '0', 10);
      
      if (isNaN(parsedMinutes) || isNaN(parsedSeconds)) {
        Alert.alert('Error', 'Please enter valid numbers for duration');
        return;
      }
      
      if (parsedMinutes < 0 || parsedSeconds < 0) {
        Alert.alert('Error', 'Duration cannot be negative');
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

    const updatedLog = { ...selectedLog };
    
    if (trackingType === 'reps') {
      updatedLog.reps = parsedReps;
    } else {
      updatedLog.duration = parsedMinutes * 60 + parsedSeconds;
    }

    const success = await updateExerciseLog(updatedLog);
    if (success) {
      Alert.alert('Success', 'Exercise log updated successfully');
      setModalVisible(false);
      setSelectedLog(null);
      loadHistory();
    } else {
      Alert.alert('Error', 'Failed to update exercise log. Please try again.');
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Log',
      'Are you sure you want to delete this exercise log?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const success = await deleteExerciseLog(selectedLog.id);
            if (success) {
              Alert.alert('Success', 'Exercise log deleted successfully');
              setModalVisible(false);
              setSelectedLog(null);
              loadHistory();
            } else {
              Alert.alert('Error', 'Failed to delete exercise log');
            }
          },
        },
      ]
    );
  };

  const renderExerciseLog = ({ item }) => {
    const trackingType = item.trackingType || DEFAULT_TRACKING_TYPE;
    let displayValue = '';
    let displayLabel = '';
    
    if (trackingType === 'reps') {
      displayValue = item.reps;
      displayLabel = 'REPS';
    } else {
      displayValue = formatDuration(item.duration);
      displayLabel = 'DURATION';
    }
    
    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => handleLogPress(item)}
        activeOpacity={0.8}
      >
        <View style={styles.cardHeader}>
          {item.category && (
            <Text style={styles.categoryLabel}>{item.category}</Text>
          )}
        </View>
        <Text style={styles.exerciseName}>{item.exerciseName}</Text>
        <View style={styles.cardFooter}>
          <View style={styles.repsContainer}>
            <Text style={styles.repsLabel}>{displayLabel}</Text>
            <Text style={styles.repsValue}>{displayValue}</Text>
          </View>
          <View style={styles.dateInfo}>
            <Text style={styles.dateLabel}>LOGGED</Text>
            <Text style={styles.date}>{formatDate(item.timestamp)}</Text>
            <Text style={styles.time}>{formatTime(item.timestamp)}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.header}>
        <Text style={styles.title}>HISTORY</Text>
      </View>

      <FlatList
        data={history}
        renderItem={renderExerciseLog}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        refreshing={loading}
        onRefresh={loadHistory}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              No exercise logs yet.
            </Text>
            <Text style={styles.emptySubtext}>
              Log an exercise to see it here!
            </Text>
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
            <Text style={styles.modalTitle}>EDIT EXERCISE LOG</Text>
            {selectedLog && (
              <>
                <Text style={styles.modalExerciseName}>
                  {selectedLog.exerciseName}
                </Text>
                {selectedLog.category && (
                  <Text style={styles.modalExerciseCategory}>
                    {selectedLog.category}
                  </Text>
                )}

                {(!selectedLog.trackingType || selectedLog.trackingType === 'reps') ? (
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
                    title="DELETE"
                    onPress={handleDelete}
                    variant="outline"
                    style={styles.deleteButton}
                  />
                  <View style={styles.modalButtonsRight}>
                    <Button
                      title="CANCEL"
                      onPress={() => setModalVisible(false)}
                      variant="outline"
                      style={styles.modalButton}
                    />
                    <Button
                      title="SAVE"
                      onPress={handleSaveEdit}
                      style={styles.modalButton}
                    />
                  </View>
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
  list: {
    padding: theme.spacing.md,
  },
  card: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing.sm,
    ...theme.elevation.low,
  },
  cardHeader: {
    marginBottom: theme.spacing.xs,
  },
  categoryLabel: {
    fontSize: theme.typography.micro.fontSize,
    fontWeight: theme.typography.micro.fontWeight,
    letterSpacing: theme.typography.micro.letterSpacing,
    lineHeight: theme.typography.micro.lineHeight,
    color: theme.colors.textMicro,
    textTransform: 'uppercase',
  },
  exerciseName: {
    fontSize: theme.typography.heading.fontSize,
    fontWeight: theme.typography.heading.fontWeight,
    letterSpacing: theme.typography.heading.letterSpacing,
    lineHeight: theme.typography.heading.lineHeight,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingTop: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  repsContainer: {
    flex: 1,
  },
  repsLabel: {
    fontSize: theme.typography.micro.fontSize,
    fontWeight: theme.typography.micro.fontWeight,
    letterSpacing: theme.typography.micro.letterSpacing,
    lineHeight: theme.typography.micro.lineHeight,
    color: theme.colors.textMicro,
    marginBottom: theme.spacing.xs,
    textTransform: 'uppercase',
  },
  repsValue: {
    fontSize: theme.typography.numeric.fontSize,
    fontWeight: theme.typography.numeric.fontWeight,
    letterSpacing: theme.typography.numeric.letterSpacing,
    lineHeight: theme.typography.numeric.lineHeight,
    color: theme.colors.text,
  },
  dateInfo: {
    alignItems: 'flex-end',
  },
  dateLabel: {
    fontSize: theme.typography.micro.fontSize,
    fontWeight: theme.typography.micro.fontWeight,
    letterSpacing: theme.typography.micro.letterSpacing,
    lineHeight: theme.typography.micro.lineHeight,
    color: theme.colors.textMicro,
    marginBottom: theme.spacing.xs,
    textTransform: 'uppercase',
  },
  date: {
    fontSize: theme.typography.caption.fontSize,
    fontWeight: theme.typography.caption.fontWeight,
    letterSpacing: theme.typography.caption.letterSpacing,
    lineHeight: theme.typography.caption.lineHeight,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.micro,
  },
  time: {
    fontSize: theme.typography.microRegular.fontSize,
    fontWeight: theme.typography.microRegular.fontWeight,
    letterSpacing: theme.typography.microRegular.letterSpacing,
    lineHeight: theme.typography.microRegular.lineHeight,
    color: theme.colors.textTertiary,
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
    marginTop: theme.spacing.lg,
  },
  modalButtonsRight: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: theme.spacing.sm,
    gap: theme.spacing.sm,
  },
  modalButton: {
    flex: 1,
  },
  deleteButton: {
    width: '100%',
  },
});
