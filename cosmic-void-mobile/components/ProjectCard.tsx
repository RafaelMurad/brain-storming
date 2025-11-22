import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '@/constants/theme';

interface ProjectCardProps {
  title: string;
  description: string;
  tags: string[];
  onPress?: () => void;
}

export default function ProjectCard({ title, description, tags, onPress }: ProjectCardProps) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <View style={styles.card}>
        {/* Gradient header */}
        <LinearGradient
          colors={[colors.cosmic.purple + '40', colors.cosmic.blue + '20']}
          style={styles.header}
        >
          <View style={styles.glow} />
        </LinearGradient>

        {/* Content */}
        <View style={styles.content}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description}>{description}</Text>

          {/* Tags */}
          <View style={styles.tags}>
            {tags.map((tag, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.cosmic.dark + 'cc',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    marginBottom: 16,
  },
  header: {
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  glow: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.cosmic.cyan + '30',
  },
  content: {
    padding: 20,
  },
  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  description: {
    color: colors.text.secondary,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: colors.cosmic.cyan + '20',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.cosmic.cyan + '40',
  },
  tagText: {
    color: colors.cosmic.cyan,
    fontSize: 12,
    fontWeight: '500',
  },
});
