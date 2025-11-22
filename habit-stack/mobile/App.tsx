import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { format, startOfWeek, addDays, isToday, isSameDay } from 'date-fns';

const { width } = Dimensions.get('window');

const habits = [
  { id: '1', name: 'Morning Meditation', icon: '🧘', color: '#8b5cf6', streak: 14, completed: true },
  { id: '2', name: 'Exercise', icon: '💪', color: '#22c55e', streak: 7, completed: true },
  { id: '3', name: 'Read 30 minutes', icon: '📚', color: '#3b82f6', streak: 21, completed: false },
  { id: '4', name: 'Drink Water', icon: '💧', color: '#06b6d4', streak: 5, completed: false },
  { id: '5', name: 'No Social Media', icon: '📵', color: '#f43f5e', streak: 3, completed: true },
];

export default function App() {
  const [habitsState, setHabits] = useState(habits);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const toggleHabit = (id: string) => {
    setHabits(h => h.map(habit => habit.id === id ? { ...habit, completed: !habit.completed } : habit));
  };

  const completedCount = habitsState.filter(h => h.completed).length;
  const totalStreak = habitsState.reduce((a, h) => a + h.streak, 0);

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <ScrollView>
        {/* Header */}
        <LinearGradient colors={['#8b5cf6', '#7c3aed']} style={styles.header}>
          <View style={styles.headerTop}>
            <Text style={styles.greeting}>Good Morning! 👋</Text>
            <TouchableOpacity style={styles.profileBtn}>
              <Ionicons name="person" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
          <Text style={styles.date}>{format(new Date(), 'EEEE, MMMM d')}</Text>

          {/* Stats */}
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Ionicons name="flame" size={24} color="#f97316" />
              <Text style={styles.statValue}>{totalStreak}</Text>
              <Text style={styles.statLabel}>Total Streak</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Ionicons name="checkmark-circle" size={24} color="#22c55e" />
              <Text style={styles.statValue}>{completedCount}/{habitsState.length}</Text>
              <Text style={styles.statLabel}>Completed</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Ionicons name="trophy" size={24} color="#eab308" />
              <Text style={styles.statValue}>21</Text>
              <Text style={styles.statLabel}>Best Streak</Text>
            </View>
          </View>
        </LinearGradient>

        {/* Week Selector */}
        <View style={styles.weekContainer}>
          {weekDays.map((day) => (
            <TouchableOpacity
              key={day.toISOString()}
              onPress={() => setSelectedDate(day)}
              style={[styles.dayBtn, isSameDay(day, selectedDate) && styles.dayBtnActive]}
            >
              <Text style={[styles.dayName, isSameDay(day, selectedDate) && styles.dayTextActive]}>{format(day, 'EEE')}</Text>
              <Text style={[styles.dayNum, isSameDay(day, selectedDate) && styles.dayTextActive]}>{format(day, 'd')}</Text>
              {isToday(day) && <View style={styles.todayDot} />}
            </TouchableOpacity>
          ))}
        </View>

        {/* Habits */}
        <View style={styles.habitsSection}>
          <Text style={styles.sectionTitle}>Today's Habits</Text>
          {habitsState.map((habit) => (
            <TouchableOpacity key={habit.id} style={styles.habitCard} onPress={() => toggleHabit(habit.id)}>
              <View style={[styles.checkbox, habit.completed && { backgroundColor: habit.color, borderColor: habit.color }]}>
                {habit.completed && <Ionicons name="checkmark" size={18} color="#fff" />}
              </View>
              <Text style={styles.habitIcon}>{habit.icon}</Text>
              <View style={styles.habitInfo}>
                <Text style={[styles.habitName, habit.completed && styles.habitCompleted]}>{habit.name}</Text>
                <View style={styles.streakBadge}>
                  <Ionicons name="flame" size={14} color="#f97316" />
                  <Text style={styles.streakText}>{habit.streak} day streak</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Premium */}
        <LinearGradient colors={['#8b5cf620', '#8b5cf605']} style={styles.premiumCard}>
          <Ionicons name="diamond" size={32} color="#8b5cf6" />
          <View style={styles.premiumText}>
            <Text style={styles.premiumTitle}>Go Premium</Text>
            <Text style={styles.premiumDesc}>Unlimited habits, stats & reminders</Text>
          </View>
          <TouchableOpacity style={styles.premiumBtn}>
            <Text style={styles.premiumBtnText}>$4.99/mo</Text>
          </TouchableOpacity>
        </LinearGradient>
      </ScrollView>

      {/* FAB */}
      <TouchableOpacity style={styles.fab}>
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0a' },
  header: { paddingTop: 60, paddingBottom: 30, paddingHorizontal: 20, borderBottomLeftRadius: 30, borderBottomRightRadius: 30 },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  greeting: { color: '#fff', fontSize: 24, fontWeight: 'bold' },
  profileBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  date: { color: 'rgba(255,255,255,0.8)', marginTop: 4 },
  statsRow: { flexDirection: 'row', marginTop: 24, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 16, padding: 16 },
  statItem: { flex: 1, alignItems: 'center' },
  statValue: { color: '#fff', fontSize: 20, fontWeight: 'bold', marginTop: 4 },
  statLabel: { color: 'rgba(255,255,255,0.7)', fontSize: 12, marginTop: 2 },
  statDivider: { width: 1, backgroundColor: 'rgba(255,255,255,0.2)' },
  weekContainer: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 16 },
  dayBtn: { alignItems: 'center', padding: 10, borderRadius: 12, width: (width - 44) / 7 },
  dayBtnActive: { backgroundColor: '#8b5cf6' },
  dayName: { color: '#6b7280', fontSize: 12 },
  dayNum: { color: '#fff', fontSize: 16, fontWeight: '600', marginTop: 4 },
  dayTextActive: { color: '#fff' },
  todayDot: { width: 4, height: 4, borderRadius: 2, backgroundColor: '#8b5cf6', marginTop: 4 },
  habitsSection: { paddingHorizontal: 16 },
  sectionTitle: { color: '#fff', fontSize: 20, fontWeight: '600', marginBottom: 16 },
  habitCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1a1a1a', borderRadius: 16, padding: 16, marginBottom: 12 },
  checkbox: { width: 28, height: 28, borderRadius: 8, borderWidth: 2, borderColor: '#333', alignItems: 'center', justifyContent: 'center' },
  habitIcon: { fontSize: 28, marginLeft: 12 },
  habitInfo: { flex: 1, marginLeft: 12 },
  habitName: { color: '#fff', fontSize: 16, fontWeight: '500' },
  habitCompleted: { textDecorationLine: 'line-through', color: '#6b7280' },
  streakBadge: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  streakText: { color: '#f97316', fontSize: 12, marginLeft: 4 },
  premiumCard: { margin: 16, padding: 20, borderRadius: 16, flexDirection: 'row', alignItems: 'center' },
  premiumText: { flex: 1, marginLeft: 16 },
  premiumTitle: { color: '#fff', fontWeight: '600', fontSize: 16 },
  premiumDesc: { color: '#6b7280', fontSize: 13 },
  premiumBtn: { backgroundColor: '#8b5cf6', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8 },
  premiumBtnText: { color: '#fff', fontWeight: '600' },
  fab: { position: 'absolute', right: 20, bottom: 30, width: 56, height: 56, borderRadius: 28, backgroundColor: '#8b5cf6', alignItems: 'center', justifyContent: 'center' },
});
