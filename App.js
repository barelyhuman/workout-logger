import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { theme } from './src/utils/theme';

// Screens
import { HomeScreen } from './src/screens/HomeScreen';
import { RoutineDetailScreen } from './src/screens/RoutineDetailScreen';
import { WorkoutSessionScreen } from './src/screens/WorkoutSessionScreen';
import { CreateRoutineScreen } from './src/screens/CreateRoutineScreen';
import { HistoryScreen } from './src/screens/HistoryScreen';
import { ExerciseLibraryScreen } from './src/screens/ExerciseLibraryScreen';

const Stack = createNativeStackNavigator();

export default function App() {
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
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="RoutineDetail"
          component={RoutineDetailScreen}
          options={{ title: 'Routine' }}
        />
        <Stack.Screen
          name="WorkoutSession"
          component={WorkoutSessionScreen}
          options={{ 
            title: 'Workout',
            headerBackVisible: false,
          }}
        />
        <Stack.Screen
          name="CreateRoutine"
          component={CreateRoutineScreen}
          options={{ title: 'Create Routine' }}
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
      </Stack.Navigator>
    </NavigationContainer>
  );
}
