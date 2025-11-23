import React from 'react';
import { View, Text, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import StarField from '@/components/StarField';
import Button from '@/components/Button';
import Section from '@/components/Section';
import ProjectCard from '@/components/ProjectCard';
import SkillBar from '@/components/SkillBar';
import { colors, projects, skills } from '@/constants/theme';

const { height } = Dimensions.get('window');

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <StarField />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <SafeAreaView style={styles.hero}>
          <View style={styles.badge}>
            <View style={styles.badgeDot} />
            <Text style={styles.badgeText}>Full-Stack Developer</Text>
          </View>

          <Text style={styles.heroTitle}>
            Crafting{'\n'}Digital{'\n'}
            <Text style={styles.heroHighlight}>Experiences</Text>
          </Text>

          <Text style={styles.heroDescription}>
            I build scalable, performant web applications with modern technologies.
            From concept to deployment, I transform ideas into elegant digital solutions.
          </Text>

          <View style={styles.stats}>
            <View style={styles.stat}>
              <Text style={styles.statNumber}>50+</Text>
              <Text style={styles.statLabel}>Projects</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statNumber}>5+</Text>
              <Text style={styles.statLabel}>Years</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statNumber}>100%</Text>
              <Text style={styles.statLabel}>Satisfaction</Text>
            </View>
          </View>

          <View style={styles.buttons}>
            <Button title="View Work" onPress={() => {}} />
            <Button title="Contact" onPress={() => {}} variant="secondary" />
          </View>
        </SafeAreaView>

        {/* About Section */}
        <Section title="About Me" subtitle="Passionate about creating impactful experiences">
          <View style={styles.aboutCards}>
            {[
              { icon: '🎯', title: 'Mission', text: 'Building digital experiences that push boundaries.' },
              { icon: '⚡', title: 'Approach', text: 'Clean code, optimal performance, user-centered design.' },
              { icon: '✨', title: 'Values', text: 'Quality, transparency, and continuous learning.' },
            ].map((card, index) => (
              <View key={index} style={styles.aboutCard}>
                <Text style={styles.aboutIcon}>{card.icon}</Text>
                <Text style={styles.aboutTitle}>{card.title}</Text>
                <Text style={styles.aboutText}>{card.text}</Text>
              </View>
            ))}
          </View>
        </Section>

        {/* Projects Section */}
        <Section title="Selected Work" subtitle="Recent projects I've worked on">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              title={project.title}
              description={project.description}
              tags={project.tags}
            />
          ))}
        </Section>

        {/* Skills Section */}
        <Section title="Skills" subtitle="Technologies I work with">
          {skills.map((skill, index) => (
            <SkillBar
              key={index}
              name={skill.name}
              level={skill.level}
              icon={skill.icon}
            />
          ))}
        </Section>

        {/* Contact Section */}
        <Section title="Get in Touch" subtitle="Let's create something amazing">
          <View style={styles.contactCard}>
            <Text style={styles.contactEmail}>hello@cosmicvoid.dev</Text>
            <Text style={styles.contactText}>
              Have a project in mind? I'd love to hear about it.
              Drop me a message and let's build something great together.
            </Text>
            <Button title="Send Message" onPress={() => {}} style={{ marginTop: 20 }} />
          </View>
        </Section>

        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.footerLogo}>
            <Text style={styles.footerIcon}>✦</Text>
            <Text style={styles.footerTitle}>
              Cosmic<Text style={{ color: colors.cosmic.cyan }}>Void</Text>
            </Text>
          </View>
          <Text style={styles.footerCopy}>© 2025 CosmicVoid. All rights reserved.</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.cosmic.void,
  },
  hero: {
    minHeight: height,
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 40,
    justifyContent: 'center',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cosmic.purple + '30',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.cosmic.purple + '50',
  },
  badgeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.cosmic.cyan,
    marginRight: 8,
  },
  badgeText: {
    color: colors.cosmic.cyan,
    fontSize: 14,
    fontWeight: '500',
  },
  heroTitle: {
    fontSize: 48,
    fontWeight: '800',
    color: '#fff',
    lineHeight: 56,
    marginBottom: 20,
  },
  heroHighlight: {
    color: colors.cosmic.cyan,
  },
  heroDescription: {
    fontSize: 16,
    color: colors.text.secondary,
    lineHeight: 24,
    marginBottom: 32,
  },
  stats: {
    flexDirection: 'row',
    gap: 32,
    marginBottom: 32,
  },
  stat: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
  },
  statLabel: {
    fontSize: 12,
    color: colors.text.muted,
    marginTop: 4,
  },
  buttons: {
    flexDirection: 'row',
    gap: 16,
  },
  aboutCards: {
    gap: 16,
  },
  aboutCard: {
    backgroundColor: colors.cosmic.dark + 'cc',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
  },
  aboutIcon: {
    fontSize: 32,
    marginBottom: 12,
  },
  aboutTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 8,
  },
  aboutText: {
    fontSize: 14,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  contactCard: {
    backgroundColor: colors.cosmic.dark + 'cc',
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
  },
  contactEmail: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.cosmic.cyan,
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
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  footerLogo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  footerIcon: {
    fontSize: 24,
    color: colors.cosmic.cyan,
  },
  footerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
  },
  footerCopy: {
    fontSize: 12,
    color: colors.text.muted,
  },
});
