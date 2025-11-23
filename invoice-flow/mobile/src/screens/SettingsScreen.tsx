import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export function SettingsScreen() {
  const [notifications, setNotifications] = React.useState(true);
  const [darkMode, setDarkMode] = React.useState(true);

  const menuItems = [
    { icon: 'person-outline', label: 'Profile', subtitle: 'Edit your business info' },
    { icon: 'card-outline', label: 'Payment Methods', subtitle: 'Manage payment options' },
    { icon: 'document-text-outline', label: 'Invoice Templates', subtitle: 'Customize your invoices' },
    { icon: 'calculator-outline', label: 'Tax Settings', subtitle: 'Configure tax rates' },
    { icon: 'globe-outline', label: 'Currency', subtitle: 'USD ($)' },
    { icon: 'shield-checkmark-outline', label: 'Security', subtitle: 'Password & 2FA' },
  ];

  return (
    <ScrollView style={styles.container}>
      {/* Plan Card */}
      <View style={styles.planCard}>
        <View style={styles.planHeader}>
          <View>
            <Text style={styles.planName}>Pro Plan</Text>
            <Text style={styles.planPrice}>$19/month</Text>
          </View>
          <View style={styles.planBadge}>
            <Text style={styles.planBadgeText}>Active</Text>
          </View>
        </View>
        <View style={styles.planFeatures}>
          <View style={styles.planFeature}>
            <Ionicons name="checkmark-circle" size={18} color="#22c55e" />
            <Text style={styles.planFeatureText}>Unlimited invoices</Text>
          </View>
          <View style={styles.planFeature}>
            <Ionicons name="checkmark-circle" size={18} color="#22c55e" />
            <Text style={styles.planFeatureText}>Expense tracking</Text>
          </View>
          <View style={styles.planFeature}>
            <Ionicons name="checkmark-circle" size={18} color="#22c55e" />
            <Text style={styles.planFeatureText}>Client management</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.upgradeBtn}>
          <Text style={styles.upgradeBtnText}>Upgrade to Business</Text>
        </TouchableOpacity>
      </View>

      {/* Toggles */}
      <View style={styles.section}>
        <View style={styles.toggleRow}>
          <View style={styles.toggleInfo}>
            <Ionicons name="notifications-outline" size={22} color="#fff" />
            <Text style={styles.toggleLabel}>Push Notifications</Text>
          </View>
          <Switch value={notifications} onValueChange={setNotifications} trackColor={{ true: '#22c55e' }} />
        </View>
        <View style={styles.toggleRow}>
          <View style={styles.toggleInfo}>
            <Ionicons name="moon-outline" size={22} color="#fff" />
            <Text style={styles.toggleLabel}>Dark Mode</Text>
          </View>
          <Switch value={darkMode} onValueChange={setDarkMode} trackColor={{ true: '#22c55e' }} />
        </View>
      </View>

      {/* Menu Items */}
      <View style={styles.section}>
        {menuItems.map((item, i) => (
          <TouchableOpacity key={i} style={styles.menuItem}>
            <View style={styles.menuIcon}>
              <Ionicons name={item.icon as any} size={22} color="#22c55e" />
            </View>
            <View style={styles.menuInfo}>
              <Text style={styles.menuLabel}>{item.label}</Text>
              <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#6b7280" />
          </TouchableOpacity>
        ))}
      </View>

      {/* Support */}
      <View style={styles.section}>
        <TouchableOpacity style={styles.menuItem}>
          <View style={styles.menuIcon}>
            <Ionicons name="help-circle-outline" size={22} color="#3b82f6" />
          </View>
          <View style={styles.menuInfo}>
            <Text style={styles.menuLabel}>Help & Support</Text>
            <Text style={styles.menuSubtitle}>FAQs, contact us</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#6b7280" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <View style={styles.menuIcon}>
            <Ionicons name="log-out-outline" size={22} color="#ef4444" />
          </View>
          <Text style={[styles.menuLabel, { color: '#ef4444' }]}>Sign Out</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.version}>InvoiceFlow v1.0.0</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  planCard: { margin: 16, padding: 20, backgroundColor: '#1e293b', borderRadius: 16, borderWidth: 1, borderColor: '#22c55e30' },
  planHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
  planName: { color: '#fff', fontSize: 20, fontWeight: '600' },
  planPrice: { color: '#94a3b8', marginTop: 2 },
  planBadge: { backgroundColor: '#22c55e20', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20 },
  planBadgeText: { color: '#22c55e', fontWeight: '600', fontSize: 12 },
  planFeatures: { marginBottom: 16 },
  planFeature: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  planFeatureText: { color: '#94a3b8' },
  upgradeBtn: { backgroundColor: '#22c55e15', padding: 12, borderRadius: 8, alignItems: 'center' },
  upgradeBtnText: { color: '#22c55e', fontWeight: '600' },
  section: { paddingHorizontal: 16, marginBottom: 24 },
  toggleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#1e293b', padding: 16, borderRadius: 12, marginBottom: 8 },
  toggleInfo: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  toggleLabel: { color: '#fff', fontSize: 16 },
  menuItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1e293b', padding: 16, borderRadius: 12, marginBottom: 8 },
  menuIcon: { width: 40, height: 40, borderRadius: 10, backgroundColor: '#374151', alignItems: 'center', justifyContent: 'center' },
  menuInfo: { flex: 1, marginLeft: 12 },
  menuLabel: { color: '#fff', fontSize: 16, fontWeight: '500' },
  menuSubtitle: { color: '#6b7280', fontSize: 13, marginTop: 2 },
  version: { textAlign: 'center', color: '#6b7280', marginVertical: 20 },
});
