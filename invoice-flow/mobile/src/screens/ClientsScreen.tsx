import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const clients = [
  { id: '1', name: 'Acme Corporation', email: 'billing@acme.com', totalRevenue: 18500, invoices: 5 },
  { id: '2', name: 'TechStart Inc', email: 'pay@techstart.io', totalRevenue: 7200, invoices: 3 },
  { id: '3', name: 'Global Media', email: 'ap@globalmedia.com', totalRevenue: 4800, invoices: 6 },
  { id: '4', name: 'Design Studio', email: 'finance@designstudio.co', totalRevenue: 12000, invoices: 4 },
  { id: '5', name: 'Marketing Pro', email: 'accounts@marketingpro.com', totalRevenue: 9600, invoices: 8 },
];

export function ClientsScreen() {
  return (
    <View style={styles.container}>
      {/* Search */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#6b7280" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search clients..."
          placeholderTextColor="#6b7280"
        />
      </View>

      {/* Stats */}
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{clients.length}</Text>
          <Text style={styles.statLabel}>Total Clients</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>${(clients.reduce((a, c) => a + c.totalRevenue, 0) / 1000).toFixed(1)}k</Text>
          <Text style={styles.statLabel}>Total Revenue</Text>
        </View>
      </View>

      {/* Client List */}
      <ScrollView style={styles.list}>
        {clients.map((client) => (
          <TouchableOpacity key={client.id} style={styles.clientCard}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{client.name.charAt(0)}</Text>
            </View>
            <View style={styles.clientInfo}>
              <Text style={styles.clientName}>{client.name}</Text>
              <Text style={styles.clientEmail}>{client.email}</Text>
            </View>
            <View style={styles.clientRight}>
              <Text style={styles.clientRevenue}>${client.totalRevenue.toLocaleString()}</Text>
              <Text style={styles.clientInvoices}>{client.invoices} invoices</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#6b7280" />
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* FAB */}
      <TouchableOpacity style={styles.fab}>
        <Ionicons name="person-add" size={24} color="#000" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1e293b', margin: 16, borderRadius: 12, paddingHorizontal: 12, gap: 8 },
  searchInput: { flex: 1, paddingVertical: 14, color: '#fff', fontSize: 16 },
  statsRow: { flexDirection: 'row', paddingHorizontal: 16, gap: 12, marginBottom: 16 },
  statCard: { flex: 1, backgroundColor: '#1e293b', borderRadius: 12, padding: 16, alignItems: 'center' },
  statValue: { color: '#22c55e', fontSize: 28, fontWeight: 'bold' },
  statLabel: { color: '#94a3b8', fontSize: 13, marginTop: 4 },
  list: { flex: 1, paddingHorizontal: 16 },
  clientCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1e293b', borderRadius: 12, padding: 16, marginBottom: 12 },
  avatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#22c55e20', alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#22c55e', fontSize: 20, fontWeight: '600' },
  clientInfo: { flex: 1, marginLeft: 12 },
  clientName: { color: '#fff', fontWeight: '600', fontSize: 16 },
  clientEmail: { color: '#6b7280', fontSize: 13, marginTop: 2 },
  clientRight: { alignItems: 'flex-end', marginRight: 8 },
  clientRevenue: { color: '#fff', fontWeight: '600' },
  clientInvoices: { color: '#6b7280', fontSize: 12 },
  fab: { position: 'absolute', right: 20, bottom: 20, width: 56, height: 56, borderRadius: 28, backgroundColor: '#22c55e', alignItems: 'center', justifyContent: 'center' },
});
