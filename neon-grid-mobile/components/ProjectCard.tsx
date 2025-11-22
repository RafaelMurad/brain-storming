import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '@/constants/theme';

interface ProjectCardProps {
  title: string;
  description: string;
  tags: string[];
  status: string;
}

export default function ProjectCard({ title, description, tags, status }: ProjectCardProps) {
  const getStatusColor = () => {
    switch (status) {
      case 'ONLINE':
        return colors.neon.green;
      case 'ACTIVE':
        return colors.neon.cyan;
      case 'SECURE':
        return colors.neon.purple;
      default:
        return colors.neon.magenta;
    }
  };

  return (
    <TouchableOpacity activeOpacity={0.9} style={styles.container}>
      <View style={styles.card}>
        {/* Header with status */}
        <View style={styles.header}>
          <View style={styles.statusContainer}>
            <View style={[styles.statusDot, { backgroundColor: getStatusColor() }]} />
            <Text style={[styles.statusText, { color: getStatusColor() }]}>{status}</Text>
          </View>
          <Text style={styles.icon}>→</Text>
        </View>

        {/* Title */}
        <Text style={styles.title}>{title}</Text>

        {/* Description */}
        <Text style={styles.description}>{description}</Text>

        {/* Tags */}
        <View style={styles.tags}>
          {tags.map((tag, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>

        {/* Border glow effect */}
        <LinearGradient
          colors={[colors.neon.magenta + '40', 'transparent']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.borderGlow}
        />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  card: {
    backgroundColor: colors.neon.dark,
    borderRadius: 8,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.neon.magenta + '40',
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
  },
  icon: {
    color: colors.neon.cyan,
    fontSize: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: colors.text.secondary,
    lineHeight: 20,
    marginBottom: 16,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: colors.neon.purple + '30',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.neon.purple + '50',
  },
  tagText: {
    fontSize: 11,
    color: colors.neon.cyan,
    fontWeight: '600',
  },
  borderGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 2,
  },
});
