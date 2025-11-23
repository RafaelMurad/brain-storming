import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const invoices = [
  { id: '1', number: 'INV-001', client: 'Acme Corporation', amount: 6000, status: 'paid', date: 'Mar 1, 2024' },
  { id: '2', number: 'INV-002', client: 'TechStart Inc', amount: 2400, status: 'sent', date: 'Mar 10, 2024' },
  { id: '3', number: 'INV-003', client: 'Global Media', amount: 800, status: 'overdue', date: 'Feb 15, 2024' },
  { id: '4', number: 'INV-004', client: 'Design Studio', amount: 1500, status: 'draft', date: 'Mar 15, 2024' },
  { id: '5', number: 'INV-005', client: 'Marketing Pro', amount: 3200, status: 'paid', date: 'Mar 8, 2024' },
];

const statusColors: Record<string, { bg: string; text: string }> = {
  paid: { bg: '#22c55e20', text: '#22c55e' },
  sent: { bg: '#3b82f620', text: '#3b82f6' },
  overdue: { bg: '#ef444420', text: '#ef4444' },
  draft: { bg: '#6b728020', text: '#9ca3af' },
};

export function InvoicesScreen() {
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  const filtered = invoices.filter(i =>
    (filter === 'all' || i.status === filter) &&
    (i.client.toLowerCase().includes(search.toLowerCase()) || i.number.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <View style={styles.container}>
      {/* Search */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#6b7280" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search invoices..."
          placeholderTextColor="#6b7280"
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* Filters */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filters}>
        {['all', 'draft', 'sent', 'paid', 'overdue'].map((f) => (
          <TouchableOpacity
            key={f}
            onPress={() => setFilter(f)}
            style={[styles.filterBtn, filter === f && styles.filterActive]}
          >
            <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Invoice List */}
      <ScrollView style={styles.list}>
        {filtered.map((invoice) => (
          <TouchableOpacity key={invoice.id} style={styles.invoiceCard}>
            <View style={styles.invoiceTop}>
              <View>
                <Text style={styles.invoiceNumber}>{invoice.number}</Text>
                <Text style={styles.invoiceClient}>{invoice.client}</Text>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: statusColors[invoice.status].bg }]}>
                <Text style={[styles.statusText, { color: statusColors[invoice.status].text }]}>
                  {invoice.status}
                </Text>
              </View>
            </View>
            <View style={styles.invoiceBottom}>
              <Text style={styles.invoiceDate}>{invoice.date}</Text>
              <Text style={styles.invoiceAmount}>${invoice.amount.toLocaleString()}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* FAB */}
      <TouchableOpacity style={styles.fab}>
        <Ionicons name="add" size={28} color="#000" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1e293b', margin: 16, borderRadius: 12, paddingHorizontal: 12 },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, paddingVertical: 14, color: '#fff', fontSize: 16 },
  filters: { paddingHorizontal: 16, marginBottom: 8 },
  filterBtn: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: '#1e293b', marginRight: 8 },
  filterActive: { backgroundColor: '#22c55e' },
  filterText: { color: '#9ca3af', fontWeight: '500' },
  filterTextActive: { color: '#000' },
  list: { flex: 1, paddingHorizontal: 16 },
  invoiceCard: { backgroundColor: '#1e293b', borderRadius: 12, padding: 16, marginBottom: 12 },
  invoiceTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  invoiceNumber: { color: '#fff', fontWeight: '600', fontSize: 16 },
  invoiceClient: { color: '#94a3b8', fontSize: 14, marginTop: 2 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  statusText: { fontSize: 12, fontWeight: '600', textTransform: 'capitalize' },
  invoiceBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 12, borderTopWidth: 1, borderTopColor: '#374151' },
  invoiceDate: { color: '#6b7280', fontSize: 14 },
  invoiceAmount: { color: '#fff', fontSize: 18, fontWeight: '700' },
  fab: { position: 'absolute', right: 20, bottom: 20, width: 56, height: 56, borderRadius: 28, backgroundColor: '#22c55e', alignItems: 'center', justifyContent: 'center', elevation: 4 },
});
