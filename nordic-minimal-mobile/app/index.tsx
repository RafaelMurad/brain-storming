import React from 'react';
import { View, Text, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MinimalButton from '@/components/MinimalButton';
import Section from '@/components/Section';
import ProjectCard from '@/components/ProjectCard';
import SkillBar from '@/components/SkillBar';
import ValueCard from '@/components/ValueCard';
import Divider from '@/components/Divider';
import { colors, projects, skills, values } from '@/constants/theme';

const { height } = Dimensions.get('window');

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <SafeAreaView style={styles.hero}>
          <Text style={styles.logo}>nordic</Text>

          <View style={styles.heroContent}>
            <Text style={styles.heroTitle}>
              Thoughtful{'\n'}design for{'\n'}modern web
            </Text>

            <Text style={styles.heroDescription}>
              Creating digital experiences with Scandinavian simplicity.
              Focus on what matters, remove the rest.
            </Text>

            <View style={styles.buttons}>
              <MinimalButton title="View Work" onPress={() => {}} />
              <MinimalButton title="About Me" onPress={() => {}} variant="secondary" />
            </View>
          </View>

          <View style={styles.scrollIndicator}>
            <View style={styles.scrollLine} />
            <Text style={styles.scrollText}>scroll</Text>
          </View>
        </SafeAreaView>

        <Divider withSymbol />

        {/* Values Section */}
        <Section subtitle="Philosophy" title="Design Principles" centered>
          <View style={styles.valuesGrid}>
            {values.map((value, index) => (
              <ValueCard
                key={index}
                title={value.title}
                description={value.description}
                icon={value.icon}
              />
            ))}
          </View>
        </Section>

        <Divider />

        {/* Projects Section */}
        <Section subtitle="Selected Work" title="Projects">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              title={project.title}
              description={project.description}
              tags={project.tags}
              year={project.year}
            />
          ))}
        </Section>

        <Divider />

        {/* Skills Section */}
        <Section subtitle="Expertise" title="Skills">
          {skills.map((skill, index) => (
            <SkillBar
              key={index}
              name={skill.name}
              level={skill.level}
              index={index}
            />
          ))}
        </Section>

        <Divider withSymbol />

        {/* Contact Section */}
        <Section subtitle="Get in Touch" title="Let's Work Together" centered>
          <View style={styles.contactContent}>
            <Text style={styles.contactText}>
              Have a project in mind? I'd love to hear about it.
              Let's create something meaningful together.
            </Text>
            <Text style={styles.contactEmail}>hello@nordic.design</Text>
            <MinimalButton
              title="Start a Conversation"
              onPress={() => {}}
              style={{ marginTop: 24 }}
            />
          </View>
        </Section>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerLogo}>nordic</Text>
          <Text style={styles.footerCopy}>© 2025 Nordic Minimal</Text>
          <Text style={styles.footerTagline}>Designed with intention</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.nordic.snow,
  },
  hero: {
    minHeight: height,
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  logo: {
    fontSize: 18,
    fontWeight: '300',
    color: colors.text.primary,
    letterSpacing: 2,
  },
  heroContent: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 60,
  },
  heroTitle: {
    fontSize: 42,
    fontWeight: '300',
    color: colors.text.primary,
    lineHeight: 52,
    letterSpacing: -1,
    marginBottom: 24,
  },
  heroDescription: {
    fontSize: 16,
    color: colors.text.secondary,
    lineHeight: 26,
    marginBottom: 40,
    maxWidth: 300,
  },
  buttons: {
    flexDirection: 'row',
    gap: 16,
  },
  scrollIndicator: {
    alignItems: 'center',
    paddingBottom: 40,
  },
  scrollLine: {
    width: 1,
    height: 40,
    backgroundColor: colors.nordic.stone,
    marginBottom: 8,
  },
  scrollText: {
    fontSize: 11,
    color: colors.text.muted,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  valuesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  contactContent: {
    alignItems: 'center',
    maxWidth: 320,
    alignSelf: 'center',
  },
  contactText: {
    fontSize: 16,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 26,
    marginBottom: 20,
  },
  contactEmail: {
    fontSize: 20,
    fontWeight: '400',
    color: colors.text.primary,
  },
  footer: {
    paddingVertical: 60,
    paddingHorizontal: 24,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.nordic.stone,
  },
  footerLogo: {
    fontSize: 16,
    fontWeight: '300',
    color: colors.text.primary,
    letterSpacing: 2,
    marginBottom: 16,
  },
  footerCopy: {
    fontSize: 12,
    color: colors.text.muted,
    marginBottom: 4,
  },
  footerTagline: {
    fontSize: 11,
    color: colors.text.muted,
    fontStyle: 'italic',
  },
});
