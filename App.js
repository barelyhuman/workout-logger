import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { theme } from './src/utils/theme';
import { migrateIdsToUUID } from './src/utils/storage';

// Screens
import { LogExerciseScreen } from './src/screens/LogExerciseScreen';
import { HistoryScreen } from './src/screens/HistoryScreen';
import { ExerciseLibraryScreen } from './src/screens/ExerciseLibraryScreen';
import { SummaryScreen } from './src/screens/SummaryScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  useEffect(() => {
    // Run migration on app startup
    const runMigration = async () => {
      const result = await migrateIdsToUUID();
      if (result.success && !result.alreadyMigrated) {
        console.log('Migration completed:', {
          migratedLogs: result.migratedLogs,
          migratedExercises: result.migratedExercises
        });
      } else if (result.success && result.alreadyMigrated) {
        console.log('Migration already completed');
      } else {
        console.error('Migration failed:', result.error);
      }
    };
    
    runMigration();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: theme.colors.background,
          },
          headerTintColor: theme.colors.text,
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          contentStyle: {
            backgroundColor: theme.colors.background,
          },
        }}
      >
        <Stack.Screen
          name="Home"
          component={LogExerciseScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="History"
          component={HistoryScreen}
          options={{ title: 'History' }}
        />
        <Stack.Screen
          name="ExerciseLibrary"
          component={ExerciseLibraryScreen}
          options={{ title: 'Exercise Library' }}
        />
        <Stack.Screen
          name="Summary"
          component={SummaryScreen}
          options={{ title: 'Summary' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
