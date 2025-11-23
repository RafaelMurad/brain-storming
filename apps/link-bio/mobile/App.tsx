import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Switch, TextInput } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const links = [
  { id: '1', title: 'Portfolio Website', url: 'portfolio.com', icon: 'globe-outline', clicks: 1234, enabled: true },
  { id: '2', title: 'YouTube Channel', url: 'youtube.com/@creator', icon: 'logo-youtube', clicks: 892, enabled: true },
  { id: '3', title: 'Instagram', url: 'instagram.com/creator', icon: 'logo-instagram', clicks: 567, enabled: true },
  { id: '4', title: 'Book a Call', url: 'calendly.com/creator', icon: 'calendar-outline', clicks: 156, enabled: false },
];

export default function App() {
  const [linksState, setLinks] = useState(links);

  const toggleLink = (id: string) => setLinks(l => l.map(x => x.id === id ? { ...x, enabled: !x.enabled } : x));
  const totalClicks = linksState.reduce((a, l) => a + l.clicks, 0);

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* Header */}
      <LinearGradient colors={['#ec4899', '#8b5cf6']} style={styles.header}>
        <View style={styles.profileSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>CC</Text>
          </View>
          <Text style={styles.username}>@creativecoder</Text>
          <Text style={styles.bio}>Creative Developer & Designer</Text>
          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Text style={styles.statValue}>12.4K</Text>
              <Text style={styles.statLabel}>Views</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statValue}>{totalClicks.toLocaleString()}</Text>
              <Text style={styles.statLabel}>Clicks</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statValue}>24%</Text>
              <Text style={styles.statLabel}>CTR</Text>
            </View>
          </View>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content}>
        {/* Quick Actions */}
        <View style={styles.actions}>
          <TouchableOpacity style={styles.actionBtn}>
            <Ionicons name="qr-code" size={20} color="#ec4899" />
            <Text style={styles.actionText}>QR Code</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn}>
            <Ionicons name="share-outline" size={20} color="#ec4899" />
            <Text style={styles.actionText}>Share</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn}>
            <Ionicons name="color-palette-outline" size={20} color="#ec4899" />
            <Text style={styles.actionText}>Theme</Text>
          </TouchableOpacity>
        </View>

        {/* Links */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Your Links</Text>
            <TouchableOpacity style={styles.addBtn}>
              <Ionicons name="add" size={20} color="#fff" />
            </TouchableOpacity>
          </View>

          {linksState.map((link) => (
            <View key={link.id} style={[styles.linkCard, !link.enabled && styles.linkDisabled]}>
              <View style={styles.linkIcon}>
                <Ionicons name={link.icon as any} size={22} color="#ec4899" />
              </View>
              <View style={styles.linkInfo}>
                <Text style={styles.linkTitle}>{link.title}</Text>
                <Text style={styles.linkUrl}>{link.url}</Text>
              </View>
              <View style={styles.linkRight}>
                <Text style={styles.linkClicks}>{link.clicks}</Text>
                <Switch value={link.enabled} onValueChange={() => toggleLink(link.id)} trackColor={{ true: '#ec4899' }} />
              </View>
            </View>
          ))}
        </View>

        {/* Premium */}
        <LinearGradient colors={['#ec489920', '#8b5cf620']} style={styles.premium}>
          <Ionicons name="diamond" size={28} color="#ec4899" />
          <View style={styles.premiumText}>
            <Text style={styles.premiumTitle}>Go Pro</Text>
            <Text style={styles.premiumDesc}>Custom domain, analytics, themes</Text>
          </View>
          <TouchableOpacity style={styles.premiumBtn}>
            <Text style={styles.premiumBtnText}>$5/mo</Text>
          </TouchableOpacity>
        </LinearGradient>
      </ScrollView>

      {/* Tab Bar */}
      <View style={styles.tabBar}>
        {[
          { icon: 'link-outline', label: 'Links', active: true },
          { icon: 'bar-chart-outline', label: 'Analytics' },
          { icon: 'color-palette-outline', label: 'Theme' },
          { icon: 'settings-outline', label: 'Settings' },
        ].map((tab, i) => (
          <TouchableOpacity key={i} style={styles.tab}>
            <Ionicons name={tab.icon as any} size={22} color={tab.active ? '#ec4899' : '#6b7280'} />
            <Text style={[styles.tabLabel, tab.active && styles.tabLabelActive]}>{tab.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0a' },
  header: { paddingTop: 60, paddingBottom: 30, borderBottomLeftRadius: 30, borderBottomRightRadius: 30 },
  profileSection: { alignItems: 'center' },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#fff', fontSize: 28, fontWeight: 'bold' },
  username: { color: '#fff', fontSize: 20, fontWeight: 'bold', marginTop: 12 },
  bio: { color: 'rgba(255,255,255,0.8)', marginTop: 4 },
  statsRow: { flexDirection: 'row', marginTop: 20, gap: 32 },
  stat: { alignItems: 'center' },
  statValue: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  statLabel: { color: 'rgba(255,255,255,0.7)', fontSize: 12 },
  content: { flex: 1, padding: 16 },
  actions: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 24 },
  actionBtn: { alignItems: 'center', padding: 16, backgroundColor: '#1a1a1a', borderRadius: 16, width: '30%' },
  actionText: { color: '#fff', fontSize: 12, marginTop: 8 },
  section: {},
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { color: '#fff', fontSize: 18, fontWeight: '600' },
  addBtn: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#ec4899', alignItems: 'center', justifyContent: 'center' },
  linkCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1a1a1a', borderRadius: 16, padding: 16, marginBottom: 12 },
  linkDisabled: { opacity: 0.5 },
  linkIcon: { width: 44, height: 44, borderRadius: 12, backgroundColor: '#ec489915', alignItems: 'center', justifyContent: 'center' },
  linkInfo: { flex: 1, marginLeft: 12 },
  linkTitle: { color: '#fff', fontWeight: '600', fontSize: 15 },
  linkUrl: { color: '#6b7280', fontSize: 13, marginTop: 2 },
  linkRight: { alignItems: 'flex-end' },
  linkClicks: { color: '#ec4899', fontWeight: '600', marginBottom: 8 },
  premium: { marginTop: 24, padding: 20, borderRadius: 16, flexDirection: 'row', alignItems: 'center' },
  premiumText: { flex: 1, marginLeft: 16 },
  premiumTitle: { color: '#fff', fontWeight: '600', fontSize: 16 },
  premiumDesc: { color: '#6b7280', fontSize: 13 },
  premiumBtn: { backgroundColor: '#ec4899', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8 },
  premiumBtnText: { color: '#fff', fontWeight: '600' },
  tabBar: { flexDirection: 'row', backgroundColor: '#1a1a1a', paddingVertical: 12, borderTopWidth: 1, borderTopColor: '#333' },
  tab: { flex: 1, alignItems: 'center' },
  tabLabel: { color: '#6b7280', fontSize: 10, marginTop: 4 },
  tabLabelActive: { color: '#ec4899' },
});
