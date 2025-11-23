import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const expenses = [
  { id: '1', description: 'Adobe Creative Cloud', amount: 54.99, category: 'Software', date: 'Mar 1', icon: 'color-palette' },
  { id: '2', description: 'AWS Hosting', amount: 127.50, category: 'Hosting', date: 'Mar 5', icon: 'cloud' },
  { id: '3', description: 'Figma Pro', amount: 15, category: 'Software', date: 'Mar 10', icon: 'brush' },
  { id: '4', description: 'Domain Renewal', amount: 14.99, category: 'Services', date: 'Mar 12', icon: 'globe' },
  { id: '5', description: 'Office Supplies', amount: 89.50, category: 'Office', date: 'Mar 14', icon: 'briefcase' },
];

const categories = [
  { name: 'Software', amount: 69.99, color: '#8b5cf6', budget: 100 },
  { name: 'Hosting', amount: 127.50, color: '#3b82f6', budget: 150 },
  { name: 'Services', amount: 14.99, color: '#22c55e', budget: 50 },
  { name: 'Office', amount: 89.50, color: '#f97316', budget: 100 },
];

export function ExpensesScreen() {
  const totalExpenses = expenses.reduce((a, e) => a + e.amount, 0);

  return (
    <ScrollView style={styles.container}>
      {/* Total Card */}
      <View style={styles.totalCard}>
        <Text style={styles.totalLabel}>Total Expenses (March)</Text>
        <Text style={styles.totalAmount}>${totalExpenses.toFixed(2)}</Text>
        <View style={styles.totalMeta}>
          <Ionicons name="trending-down" size={16} color="#22c55e" />
          <Text style={styles.totalChange}>12% less than last month</Text>
        </View>
      </View>

      {/* Categories */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>By Category</Text>
        {categories.map((cat) => (
          <View key={cat.name} style={styles.categoryCard}>
            <View style={[styles.categoryIcon, { backgroundColor: cat.color + '20' }]}>
              <View style={[styles.categoryDot, { backgroundColor: cat.color }]} />
            </View>
            <View style={styles.categoryInfo}>
              <Text style={styles.categoryName}>{cat.name}</Text>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${(cat.amount / cat.budget) * 100}%`, backgroundColor: cat.color }]} />
              </View>
            </View>
            <View style={styles.categoryRight}>
              <Text style={styles.categoryAmount}>${cat.amount.toFixed(2)}</Text>
              <Text style={styles.categoryBudget}>of ${cat.budget}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Recent Expenses */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Expenses</Text>
        {expenses.map((expense) => (
          <TouchableOpacity key={expense.id} style={styles.expenseCard}>
            <View style={styles.expenseIcon}>
              <Ionicons name={expense.icon as any} size={20} color="#22c55e" />
            </View>
            <View style={styles.expenseInfo}>
              <Text style={styles.expenseDesc}>{expense.description}</Text>
              <Text style={styles.expenseCategory}>{expense.category} • {expense.date}</Text>
            </View>
            <Text style={styles.expenseAmount}>-${expense.amount.toFixed(2)}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* FAB */}
      <TouchableOpacity style={styles.fab}>
        <Ionicons name="add" size={28} color="#000" />
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  totalCard: { margin: 16, padding: 24, backgroundColor: '#1e293b', borderRadius: 16, alignItems: 'center' },
  totalLabel: { color: '#94a3b8', fontSize: 14 },
  totalAmount: { color: '#fff', fontSize: 40, fontWeight: 'bold', marginVertical: 8 },
  totalMeta: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  totalChange: { color: '#22c55e', fontSize: 14 },
  section: { paddingHorizontal: 16, marginBottom: 24 },
  sectionTitle: { color: '#fff', fontSize: 18, fontWeight: '600', marginBottom: 12 },
  categoryCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1e293b', borderRadius: 12, padding: 16, marginBottom: 10 },
  categoryIcon: { width: 40, height: 40, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  categoryDot: { width: 12, height: 12, borderRadius: 6 },
  categoryInfo: { flex: 1, marginLeft: 12 },
  categoryName: { color: '#fff', fontWeight: '500', marginBottom: 6 },
  progressBar: { height: 4, backgroundColor: '#374151', borderRadius: 2 },
  progressFill: { height: '100%', borderRadius: 2 },
  categoryRight: { alignItems: 'flex-end' },
  categoryAmount: { color: '#fff', fontWeight: '600' },
  categoryBudget: { color: '#6b7280', fontSize: 12 },
  expenseCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1e293b', borderRadius: 12, padding: 16, marginBottom: 10 },
  expenseIcon: { width: 44, height: 44, borderRadius: 12, backgroundColor: '#22c55e15', alignItems: 'center', justifyContent: 'center' },
  expenseInfo: { flex: 1, marginLeft: 12 },
  expenseDesc: { color: '#fff', fontWeight: '500', fontSize: 15 },
  expenseCategory: { color: '#6b7280', fontSize: 13, marginTop: 2 },
  expenseAmount: { color: '#ef4444', fontWeight: '600', fontSize: 16 },
  fab: { position: 'absolute', right: 20, bottom: 20, width: 56, height: 56, borderRadius: 28, backgroundColor: '#22c55e', alignItems: 'center', justifyContent: 'center' },
});
