import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView, TouchableOpacity, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { theme } from '../utils/theme';
import { loadRoutines, saveRoutines } from '../utils/storage';
import { defaultRoutines } from '../data/defaultRoutines';
import { RoutineCard } from '../components/RoutineCard';
import { Button } from '../components/Button';

export const HomeScreen = ({ navigation }) => {
  const [routines, setRoutines] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRoutinesData();
  }, []);

  const loadRoutinesData = async () => {
    setLoading(true);
    let data = await loadRoutines();
    
    // If no routines, initialize with defaults
    if (data.length === 0) {
      data = defaultRoutines;
      await saveRoutines(data);
    }
    
    setRoutines(data);
    setLoading(false);
  };

  const handleDeleteRoutine = (routineId) => {
    Alert.alert(
      'Delete Routine',
      'Are you sure you want to delete this routine?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const updatedRoutines = routines.filter(r => r.id !== routineId);
            await saveRoutines(updatedRoutines);
            setRoutines(updatedRoutines);
          },
        },
      ]
    );
  };

  const renderRoutine = ({ item }) => (
    <RoutineCard
      routine={item}
      onPress={() => navigation.navigate('RoutineDetail', { routine: item })}
      onLongPress={() => handleDeleteRoutine(item.id)}
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.header}>
        <Text style={styles.title}>Workout Logger</Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => navigation.navigate('ExerciseLibrary')}
          >
            <Text style={styles.headerButtonText}>Library</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => navigation.navigate('History')}
          >
            <Text style={styles.headerButtonText}>History</Text>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={routines}
        renderItem={renderRoutine}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        refreshing={loading}
        onRefresh={loadRoutinesData}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No routines yet. Create your first one!</Text>
        }
      />

      <View style={styles.footer}>
        <Button
          title="Create New Routine"
          onPress={() => navigation.navigate('CreateRoutine', { onSave: loadRoutinesData })}
        />
      </View>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  title: {
    fontSize: theme.typography.title.fontSize,
    fontWeight: theme.typography.title.fontWeight,
    color: theme.colors.text,
  },
  headerButtons: {
    flexDirection: 'row',
  },
  headerButton: {
    padding: theme.spacing.sm,
    marginLeft: theme.spacing.sm,
  },
  headerButtonText: {
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.text,
    fontWeight: '600',
  },
  list: {
    padding: theme.spacing.md,
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
});
