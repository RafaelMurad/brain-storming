import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '@/constants/theme';

interface ProjectCardProps {
  title: string;
  description: string;
  tags: string[];
  year: string;
}

export default function ProjectCard({ title, description, tags, year }: ProjectCardProps) {
  return (
    <TouchableOpacity activeOpacity={0.9} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.year}>{year}</Text>
        <Text style={styles.arrow}>→</Text>
      </View>

      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>

      <View style={styles.tags}>
        {tags.map((tag, index) => (
          <Text key={index} style={styles.tag}>
            {tag}{index < tags.length - 1 ? ' · ' : ''}
          </Text>
        ))}
      </View>

      <View style={styles.divider} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  year: {
    fontSize: 12,
    color: colors.text.muted,
    letterSpacing: 1,
  },
  arrow: {
    fontSize: 18,
    color: colors.text.muted,
  },
  title: {
    fontSize: 22,
    fontWeight: '400',
    color: colors.text.primary,
    marginBottom: 8,
  },
  description: {
    fontSize: 15,
    color: colors.text.secondary,
    lineHeight: 22,
    marginBottom: 16,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    fontSize: 13,
    color: colors.text.muted,
  },
  divider: {
    height: 1,
    backgroundColor: colors.nordic.stone,
    marginTop: 24,
  },
});
