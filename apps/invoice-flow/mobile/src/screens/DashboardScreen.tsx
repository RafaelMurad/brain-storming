import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const stats = [
  { label: 'Revenue', value: '$12,450', icon: 'cash', color: '#22c55e', bg: ['#22c55e20', '#22c55e10'] },
  { label: 'Pending', value: '$3,200', icon: 'time', color: '#3b82f6', bg: ['#3b82f620', '#3b82f610'] },
  { label: 'Overdue', value: '$800', icon: 'alert-circle', color: '#ef4444', bg: ['#ef444420', '#ef444410'] },
  { label: 'Expenses', value: '$1,847', icon: 'trending-down', color: '#f97316', bg: ['#f9731620', '#f9731610'] },
];

const recentInvoices = [
  { id: '1', client: 'Acme Corp', amount: 6000, status: 'paid' },
  { id: '2', client: 'TechStart Inc', amount: 2400, status: 'sent' },
  { id: '3', client: 'Global Media', amount: 800, status: 'overdue' },
];

export function DashboardScreen() {
  return (
    <ScrollView style={styles.container}>
      {/* Stats Grid */}
      <View style={styles.statsGrid}>
        {stats.map((stat) => (
          <View key={stat.label} style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: stat.color + '20' }]}>
              <Ionicons name={stat.icon as any} size={20} color={stat.color} />
            </View>
            <Text style={styles.statValue}>{stat.value}</Text>
            <Text style={styles.statLabel}>{stat.label}</Text>
          </View>
        ))}
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsRow}>
          <TouchableOpacity style={styles.actionBtn}>
            <LinearGradient colors={['#22c55e', '#16a34a']} style={styles.actionGradient}>
              <Ionicons name="add" size={24} color="#fff" />
              <Text style={styles.actionText}>New Invoice</Text>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn}>
            <View style={styles.actionSecondary}>
              <Ionicons name="receipt-outline" size={24} color="#22c55e" />
              <Text style={styles.actionTextSecondary}>Add Expense</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* Recent Invoices */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Invoices</Text>
          <TouchableOpacity>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>
        {recentInvoices.map((invoice) => (
          <TouchableOpacity key={invoice.id} style={styles.invoiceCard}>
            <View style={styles.invoiceAvatar}>
              <Text style={styles.avatarText}>{invoice.client.charAt(0)}</Text>
            </View>
            <View style={styles.invoiceInfo}>
              <Text style={styles.invoiceClient}>{invoice.client}</Text>
              <Text style={styles.invoiceId}>INV-00{invoice.id}</Text>
            </View>
            <View style={styles.invoiceRight}>
              <Text style={styles.invoiceAmount}>${invoice.amount.toLocaleString()}</Text>
              <View style={[styles.statusBadge, styles[`status_${invoice.status}` as keyof typeof styles]]}>
                <Text style={styles.statusText}>{invoice.status}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Upgrade Banner */}
      <LinearGradient colors={['#22c55e20', '#22c55e05']} style={styles.upgradeBanner}>
        <Ionicons name="rocket" size={32} color="#22c55e" />
        <View style={styles.upgradeText}>
          <Text style={styles.upgradeTitle}>Upgrade to Pro</Text>
          <Text style={styles.upgradeDesc}>Get recurring invoices, reports & more</Text>
        </View>
        <TouchableOpacity style={styles.upgradeBtn}>
          <Text style={styles.upgradeBtnText}>Upgrade</Text>
        </TouchableOpacity>
      </LinearGradient>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', padding: 16, gap: 12 },
  statCard: { width: '47%', backgroundColor: '#1e293b', borderRadius: 16, padding: 16 },
  statIcon: { width: 40, height: 40, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  statValue: { fontSize: 24, fontWeight: 'bold', color: '#fff' },
  statLabel: { fontSize: 14, color: '#94a3b8', marginTop: 4 },
  section: { padding: 16 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: '#fff' },
  seeAll: { color: '#22c55e', fontSize: 14 },
  actionsRow: { flexDirection: 'row', gap: 12 },
  actionBtn: { flex: 1 },
  actionGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 16, borderRadius: 12 },
  actionSecondary: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 16, borderRadius: 12, backgroundColor: '#1e293b', borderWidth: 1, borderColor: '#22c55e30' },
  actionText: { color: '#fff', fontWeight: '600', fontSize: 16 },
  actionTextSecondary: { color: '#22c55e', fontWeight: '600', fontSize: 16 },
  invoiceCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1e293b', borderRadius: 12, padding: 16, marginBottom: 10 },
  invoiceAvatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#374151', alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#fff', fontWeight: '600', fontSize: 18 },
  invoiceInfo: { flex: 1, marginLeft: 12 },
  invoiceClient: { color: '#fff', fontWeight: '500', fontSize: 16 },
  invoiceId: { color: '#94a3b8', fontSize: 13, marginTop: 2 },
  invoiceRight: { alignItems: 'flex-end' },
  invoiceAmount: { color: '#fff', fontWeight: '600', fontSize: 16 },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 20, marginTop: 4 },
  status_paid: { backgroundColor: '#22c55e20' },
  status_sent: { backgroundColor: '#3b82f620' },
  status_overdue: { backgroundColor: '#ef444420' },
  statusText: { fontSize: 12, fontWeight: '500', color: '#fff', textTransform: 'capitalize' },
  upgradeBanner: { margin: 16, padding: 20, borderRadius: 16, flexDirection: 'row', alignItems: 'center' },
  upgradeText: { flex: 1, marginLeft: 16 },
  upgradeTitle: { color: '#fff', fontWeight: '600', fontSize: 16 },
  upgradeDesc: { color: '#94a3b8', fontSize: 13, marginTop: 2 },
  upgradeBtn: { backgroundColor: '#22c55e', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8 },
  upgradeBtnText: { color: '#000', fontWeight: '600' },
});
