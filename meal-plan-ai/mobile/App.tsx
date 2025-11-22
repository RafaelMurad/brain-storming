import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const meals = [
  { id: '1', type: 'Breakfast', name: 'Avocado Toast', emoji: '🥑', calories: 420, time: 15 },
  { id: '2', type: 'Lunch', name: 'Grilled Chicken Salad', emoji: '🥗', calories: 380, time: 20 },
  { id: '3', type: 'Dinner', name: 'Salmon & Veggies', emoji: '🐟', calories: 520, time: 35 },
];

const groceryItems = [
  { id: '1', name: 'Avocados', qty: 4, checked: false },
  { id: '2', name: 'Eggs (dozen)', qty: 1, checked: true },
  { id: '3', name: 'Chicken Breast', qty: '2 lbs', checked: false },
  { id: '4', name: 'Salmon Fillets', qty: 4, checked: false },
  { id: '5', name: 'Mixed Greens', qty: '2 bags', checked: true },
];

export default function App() {
  const [day, setDay] = useState('Mon');
  const [items, setItems] = useState(groceryItems);
  const [tab, setTab] = useState<'plan' | 'grocery'>('plan');

  const toggleItem = (id: string) => setItems(i => i.map(x => x.id === id ? { ...x, checked: !x.checked } : x));
  const checkedCount = items.filter(i => i.checked).length;

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* Header */}
      <LinearGradient colors={['#f97316', '#ea580c']} style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.title}>MealPlanAI</Text>
            <Text style={styles.subtitle}>Your smart kitchen assistant</Text>
          </View>
          <TouchableOpacity style={styles.aiBtn}>
            <Ionicons name="sparkles" size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Tabs */}
        <View style={styles.tabs}>
          <TouchableOpacity style={[styles.tab, tab === 'plan' && styles.tabActive]} onPress={() => setTab('plan')}>
            <Ionicons name="calendar" size={18} color={tab === 'plan' ? '#f97316' : '#fff'} />
            <Text style={[styles.tabText, tab === 'plan' && styles.tabTextActive]}>Meal Plan</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.tab, tab === 'grocery' && styles.tabActive]} onPress={() => setTab('grocery')}>
            <Ionicons name="cart" size={18} color={tab === 'grocery' ? '#f97316' : '#fff'} />
            <Text style={[styles.tabText, tab === 'grocery' && styles.tabTextActive]}>Grocery</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content}>
        {tab === 'plan' ? (
          <>
            {/* Day Selector */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.daySelector}>
              {days.map(d => (
                <TouchableOpacity key={d} style={[styles.dayBtn, day === d && styles.dayBtnActive]} onPress={() => setDay(d)}>
                  <Text style={[styles.dayText, day === d && styles.dayTextActive]}>{d}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Meals */}
            {meals.map(meal => (
              <TouchableOpacity key={meal.id} style={styles.mealCard}>
                <Text style={styles.mealEmoji}>{meal.emoji}</Text>
                <View style={styles.mealInfo}>
                  <Text style={styles.mealType}>{meal.type}</Text>
                  <Text style={styles.mealName}>{meal.name}</Text>
                  <View style={styles.mealMeta}>
                    <Text style={styles.mealMetaText}><Ionicons name="flame" size={12} /> {meal.calories} cal</Text>
                    <Text style={styles.mealMetaText}><Ionicons name="time" size={12} /> {meal.time}m</Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#6b7280" />
              </TouchableOpacity>
            ))}

            {/* Generate Button */}
            <TouchableOpacity style={styles.generateBtn}>
              <Ionicons name="sparkles" size={20} color="#fff" />
              <Text style={styles.generateText}>Generate New Plan</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            {/* Grocery Progress */}
            <View style={styles.progressCard}>
              <Text style={styles.progressText}>{checkedCount} of {items.length} items</Text>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${(checkedCount / items.length) * 100}%` }]} />
              </View>
            </View>

            {/* Items */}
            {items.map(item => (
              <TouchableOpacity key={item.id} style={styles.itemCard} onPress={() => toggleItem(item.id)}>
                <View style={[styles.checkbox, item.checked && styles.checkboxChecked]}>
                  {item.checked && <Ionicons name="checkmark" size={16} color="#fff" />}
                </View>
                <Text style={[styles.itemName, item.checked && styles.itemChecked]}>{item.name}</Text>
                <Text style={styles.itemQty}>{item.qty}</Text>
              </TouchableOpacity>
            ))}
          </>
        )}

        {/* Premium */}
        <LinearGradient colors={['#f9731620', '#f9731605']} style={styles.premium}>
          <Ionicons name="leaf" size={28} color="#f97316" />
          <View style={styles.premiumText}>
            <Text style={styles.premiumTitle}>Go Premium</Text>
            <Text style={styles.premiumDesc}>Unlimited AI, nutrition tracking</Text>
          </View>
          <TouchableOpacity style={styles.premiumBtn}>
            <Text style={styles.premiumBtnText}>$9.99/mo</Text>
          </TouchableOpacity>
        </LinearGradient>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0a' },
  header: { paddingTop: 60, paddingBottom: 20, paddingHorizontal: 20 },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { color: '#fff', fontSize: 28, fontWeight: 'bold' },
  subtitle: { color: 'rgba(255,255,255,0.8)', fontSize: 14 },
  aiBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  tabs: { flexDirection: 'row', marginTop: 20, backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: 12, padding: 4 },
  tab: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 10, borderRadius: 8, gap: 6 },
  tabActive: { backgroundColor: '#fff' },
  tabText: { color: '#fff', fontWeight: '500' },
  tabTextActive: { color: '#f97316' },
  content: { flex: 1, padding: 16 },
  daySelector: { marginBottom: 16 },
  dayBtn: { paddingHorizontal: 16, paddingVertical: 10, marginRight: 8, borderRadius: 12, backgroundColor: '#1a1a1a' },
  dayBtnActive: { backgroundColor: '#f97316' },
  dayText: { color: '#6b7280', fontWeight: '500' },
  dayTextActive: { color: '#fff' },
  mealCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1a1a1a', borderRadius: 16, padding: 16, marginBottom: 12 },
  mealEmoji: { fontSize: 40 },
  mealInfo: { flex: 1, marginLeft: 16 },
  mealType: { color: '#f97316', fontSize: 12, fontWeight: '600' },
  mealName: { color: '#fff', fontSize: 16, fontWeight: '600', marginTop: 2 },
  mealMeta: { flexDirection: 'row', gap: 12, marginTop: 4 },
  mealMetaText: { color: '#6b7280', fontSize: 12 },
  generateBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#f97316', padding: 16, borderRadius: 12, marginTop: 8 },
  generateText: { color: '#fff', fontWeight: '600', fontSize: 16 },
  progressCard: { backgroundColor: '#1a1a1a', borderRadius: 12, padding: 16, marginBottom: 16 },
  progressText: { color: '#fff', fontWeight: '500', marginBottom: 8 },
  progressBar: { height: 6, backgroundColor: '#333', borderRadius: 3 },
  progressFill: { height: '100%', backgroundColor: '#f97316', borderRadius: 3 },
  itemCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1a1a1a', borderRadius: 12, padding: 16, marginBottom: 8 },
  checkbox: { width: 24, height: 24, borderRadius: 6, borderWidth: 2, borderColor: '#333', alignItems: 'center', justifyContent: 'center' },
  checkboxChecked: { backgroundColor: '#f97316', borderColor: '#f97316' },
  itemName: { flex: 1, color: '#fff', marginLeft: 12, fontSize: 16 },
  itemChecked: { textDecorationLine: 'line-through', color: '#6b7280' },
  itemQty: { color: '#6b7280' },
  premium: { margin: 16, marginTop: 24, padding: 20, borderRadius: 16, flexDirection: 'row', alignItems: 'center' },
  premiumText: { flex: 1, marginLeft: 16 },
  premiumTitle: { color: '#fff', fontWeight: '600', fontSize: 16 },
  premiumDesc: { color: '#6b7280', fontSize: 13 },
  premiumBtn: { backgroundColor: '#f97316', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8 },
  premiumBtnText: { color: '#fff', fontWeight: '600' },
});
