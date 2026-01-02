import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { theme } from '../utils/theme';
import { loadRoutines, saveRoutines } from '../utils/storage';
import { defaultRoutines } from '../data/defaultRoutines';
import { RoutineCard } from '../components/RoutineCard';
import { Button } from '../components/Button';
import {SafeAreaView} from "react-native-safe-area-context"

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
        <View style={styles.headerButtons}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => navigation.navigate('ExerciseLibrary')}
            activeOpacity={0.7}
          >
            <Text style={styles.headerButtonText}>Library</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => navigation.navigate('History')}
            activeOpacity={0.7}
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
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No routines yet.</Text>
            <Text style={styles.emptySubtext}>Create your first one to get started!</Text>
          </View>
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
    letterSpacing: theme.typography.title.letterSpacing,
    lineHeight: theme.typography.title.lineHeight,
    color: theme.colors.text,
  },
  headerButtons: {
    flexDirection: 'row',
  },
  headerButton: {
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    marginLeft: theme.spacing.xs,
  },
  headerButtonText: {
    fontSize: theme.typography.bodyMedium.fontSize,
    fontWeight: theme.typography.bodyMedium.fontWeight,
    letterSpacing: theme.typography.bodyMedium.letterSpacing,
    color: theme.colors.text,
  },
  list: {
    padding: theme.spacing.md,
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
});
