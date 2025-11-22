import React from 'react';
import { View, Text, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import GridBackground from '@/components/GridBackground';
import GlitchText from '@/components/GlitchText';
import NeonButton from '@/components/NeonButton';
import Section from '@/components/Section';
import ProjectCard from '@/components/ProjectCard';
import SkillBar from '@/components/SkillBar';
import Terminal from '@/components/Terminal';
import { colors, projects, skills, stats } from '@/constants/theme';

const { height } = Dimensions.get('window');

export default function HomeScreen() {
  const terminalLines = [
    'initializing neural interface...',
    'loading portfolio_v2.0...',
    'connecting to mainframe...',
    'system ready.',
  ];

  return (
    <View style={styles.container}>
      <GridBackground />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <SafeAreaView style={styles.hero}>
          <View style={styles.statusBar}>
            <View style={styles.statusItem}>
              <View style={styles.statusDot} />
              <Text style={styles.statusText}>SYSTEM ONLINE</Text>
            </View>
            <Text style={styles.version}>v2.0.25</Text>
          </View>

          <GlitchText text="NEON" style={styles.heroTitle} />
          <GlitchText text="GRID" style={styles.heroTitle} />

          <Text style={styles.heroSubtitle}>
            {'<'} FULL-STACK DEVELOPER {'/>'}
          </Text>

          <Text style={styles.heroDescription}>
            Building next-gen digital experiences with cutting-edge technology.
            Specializing in high-performance applications and immersive interfaces.
          </Text>

          {/* Stats Grid */}
          <View style={styles.statsGrid}>
            {stats.map((stat, index) => (
              <View key={index} style={styles.statCard}>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>

          <View style={styles.buttons}>
            <NeonButton title="Initialize" onPress={() => {}} />
            <NeonButton title="Scan" onPress={() => {}} variant="outline" />
          </View>
        </SafeAreaView>

        {/* Terminal Section */}
        <Section title="System" code="SYS_001">
          <Terminal lines={terminalLines} />
        </Section>

        {/* Projects Section */}
        <Section title="Projects" code="PRJ_002">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              title={project.title}
              description={project.description}
              tags={project.tags}
              status={project.status}
            />
          ))}
        </Section>

        {/* Skills Section */}
        <Section title="Skills" code="SKL_003">
          {skills.map((skill, index) => (
            <SkillBar
              key={index}
              name={skill.name}
              level={skill.level}
              category={skill.category}
              index={index}
            />
          ))}
        </Section>

        {/* Contact Section */}
        <Section title="Connect" code="CNT_004">
          <View style={styles.contactCard}>
            <View style={styles.contactHeader}>
              <Text style={styles.contactIcon}>◈</Text>
              <Text style={styles.contactTitle}>TRANSMISSION READY</Text>
            </View>
            <Text style={styles.contactEmail}>dev@neongrid.io</Text>
            <Text style={styles.contactText}>
              Ready to collaborate on your next project?
              Send a transmission and let's create something extraordinary.
            </Text>
            <NeonButton
              title="Send Transmission"
              onPress={() => {}}
              variant="secondary"
              style={{ marginTop: 20 }}
            />
          </View>
        </Section>

        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.footerGrid}>
            <View style={styles.footerLine} />
            <Text style={styles.footerLogo}>◇ NEONGRID ◇</Text>
            <View style={styles.footerLine} />
          </View>
          <Text style={styles.footerCopy}>© 2025 NeonGrid. All systems reserved.</Text>
          <Text style={styles.footerVersion}>BUILD 2.0.25 | STATUS: OPERATIONAL</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.neon.black,
  },
  hero: {
    minHeight: height,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
    justifyContent: 'center',
  },
  statusBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 40,
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.neon.green,
  },
  statusText: {
    fontSize: 10,
    color: colors.neon.green,
    fontWeight: '700',
    letterSpacing: 1,
  },
  version: {
    fontSize: 10,
    color: colors.text.muted,
    fontFamily: 'monospace',
  },
  heroTitle: {
    fontSize: 72,
    fontWeight: '900',
    color: '#fff',
    letterSpacing: 8,
  },
  heroSubtitle: {
    fontSize: 14,
    color: colors.neon.magenta,
    fontFamily: 'monospace',
    marginTop: 16,
    marginBottom: 20,
  },
  heroDescription: {
    fontSize: 16,
    color: colors.text.secondary,
    lineHeight: 24,
    marginBottom: 32,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 32,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: colors.neon.dark,
    padding: 16,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.neon.purple + '40',
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.neon.cyan,
  },
  statLabel: {
    fontSize: 10,
    color: colors.text.muted,
    marginTop: 4,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  buttons: {
    flexDirection: 'row',
    gap: 16,
  },
  contactCard: {
    backgroundColor: colors.neon.dark,
    borderRadius: 8,
    padding: 24,
    borderWidth: 1,
    borderColor: colors.neon.cyan + '40',
    alignItems: 'center',
  },
  contactHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  contactIcon: {
    fontSize: 16,
    color: colors.neon.cyan,
  },
  contactTitle: {
    fontSize: 12,
    color: colors.neon.cyan,
    fontWeight: '700',
    letterSpacing: 1,
  },
  contactEmail: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.neon.magenta,
    marginBottom: 12,
  },
  contactText: {
    fontSize: 14,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  footer: {
    paddingVertical: 40,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.neon.magenta + '30',
  },
  footerGrid: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 16,
  },
  footerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.neon.purple + '40',
  },
  footerLogo: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.neon.magenta,
    letterSpacing: 4,
  },
  footerCopy: {
    fontSize: 12,
    color: colors.text.muted,
    marginBottom: 4,
  },
  footerVersion: {
    fontSize: 10,
    color: colors.neon.cyan + '80',
    fontFamily: 'monospace',
  },
});
