import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeIn, FadeInRight } from 'react-native-reanimated';
import { colors } from '../constants/theme';
import { useGameStore } from '../store/gameStore';
import * as api from '../services/api';
import type { LeaderboardEntry } from '../types';

export default function LeaderboardScreen() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useGameStore();

  useEffect(() => {
    loadLeaderboard();
  }, []);

  const loadLeaderboard = async () => {
    try {
      const data = await api.getLeaderboard(20);
      setEntries(data);
    } catch (error) {
      console.error('Failed to load leaderboard:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1: return '#FFD700';
      case 2: return '#C0C0C0';
      case 3: return '#CD7F32';
      default: return colors.text.muted;
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.quiz.primary} />
        </View>
      </SafeAreaView>
    );
  }

  const top3 = entries.slice(0, 3);
  const rest = entries.slice(3);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <Animated.View entering={FadeIn} style={styles.header}>
          <LinearGradient
            colors={['#FFD700', '#FFA500']}
            style={styles.trophy}
          >
            <Text style={styles.trophyIcon}>🏆</Text>
          </LinearGradient>
          <Text style={styles.title}>Leaderboard</Text>
          <Text style={styles.subtitle}>Top frontend developers worldwide</Text>
        </Animated.View>

        {/* Top 3 Podium */}
        <Animated.View entering={FadeIn.delay(100)} style={styles.podium}>
          {/* 2nd Place */}
          {top3[1] && (
            <View style={[styles.podiumItem, styles.podiumSecond]}>
              <Image source={{ uri: top3[1].avatar }} style={styles.podiumAvatar} />
              <View style={styles.podiumRank}>
                <Text style={styles.podiumRankText}>2</Text>
              </View>
              <Text style={styles.podiumName} numberOfLines={1}>{top3[1].username}</Text>
              <Text style={styles.podiumXp}>{top3[1].totalXp.toLocaleString()} XP</Text>
            </View>
          )}

          {/* 1st Place */}
          {top3[0] && (
            <View style={[styles.podiumItem, styles.podiumFirst]}>
              <Text style={styles.crown}>👑</Text>
              <Image source={{ uri: top3[0].avatar }} style={[styles.podiumAvatar, styles.podiumAvatarFirst]} />
              <View style={[styles.podiumRank, styles.podiumRankFirst]}>
                <Text style={styles.podiumRankText}>1</Text>
              </View>
              <Text style={styles.podiumName} numberOfLines={1}>{top3[0].username}</Text>
              <Text style={styles.podiumXp}>{top3[0].totalXp.toLocaleString()} XP</Text>
            </View>
          )}

          {/* 3rd Place */}
          {top3[2] && (
            <View style={[styles.podiumItem, styles.podiumThird]}>
              <Image source={{ uri: top3[2].avatar }} style={styles.podiumAvatar} />
              <View style={[styles.podiumRank, styles.podiumRankThird]}>
                <Text style={styles.podiumRankText}>3</Text>
              </View>
              <Text style={styles.podiumName} numberOfLines={1}>{top3[2].username}</Text>
              <Text style={styles.podiumXp}>{top3[2].totalXp.toLocaleString()} XP</Text>
            </View>
          )}
        </Animated.View>

        {/* Rest of leaderboard */}
        <View style={styles.list}>
          {rest.map((entry, index) => (
            <Animated.View
              key={entry.userId}
              entering={FadeInRight.delay(index * 50)}
              style={[
                styles.listItem,
                entry.userId === user?.id && styles.listItemHighlight,
              ]}
            >
              <Text style={styles.listRank}>{entry.rank}</Text>
              <Image source={{ uri: entry.avatar }} style={styles.listAvatar} />
              <View style={styles.listInfo}>
                <View style={styles.listNameRow}>
                  <Text style={styles.listName}>{entry.username}</Text>
                  {entry.userId === user?.id && (
                    <View style={styles.youBadge}>
                      <Text style={styles.youBadgeText}>You</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.listLevel}>Level {entry.level}</Text>
              </View>
              <View style={styles.listStats}>
                <View style={styles.listStat}>
                  <Text style={styles.listStatIcon}>🔥</Text>
                  <Text style={styles.listStatValue}>{entry.streak}</Text>
                </View>
                <View style={styles.listStat}>
                  <Text style={styles.listStatIcon}>🎯</Text>
                  <Text style={styles.listStatValue}>{entry.accuracy.toFixed(0)}%</Text>
                </View>
              </View>
              <View style={styles.listXp}>
                <Text style={styles.listXpValue}>{entry.totalXp.toLocaleString()}</Text>
                <Text style={styles.listXpLabel}>XP</Text>
              </View>
            </Animated.View>
          ))}
        </View>

        {entries.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🏆</Text>
            <Text style={styles.emptyText}>No entries yet. Be the first!</Text>
          </View>
        )}

        <View style={styles.footer} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.quiz.darker,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    padding: 24,
    paddingBottom: 16,
  },
  trophy: {
    width: 70,
    height: 70,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  trophyIcon: {
    fontSize: 36,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.text.secondary,
  },
  podium: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  podiumItem: {
    alignItems: 'center',
    width: '30%',
  },
  podiumFirst: {
    marginBottom: 20,
  },
  podiumSecond: {
    marginBottom: 0,
  },
  podiumThird: {
    marginBottom: 0,
  },
  crown: {
    fontSize: 28,
    marginBottom: 4,
  },
  podiumAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 3,
    borderColor: colors.quiz.border,
  },
  podiumAvatarFirst: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderColor: '#FFD700',
  },
  podiumRank: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#C0C0C0',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -12,
    marginBottom: 8,
  },
  podiumRankFirst: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FFD700',
  },
  podiumRankThird: {
    backgroundColor: '#CD7F32',
  },
  podiumRankText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#000',
  },
  podiumName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 4,
  },
  podiumXp: {
    fontSize: 12,
    color: colors.quiz.primary,
    fontWeight: '600',
  },
  list: {
    paddingHorizontal: 16,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.quiz.card,
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.quiz.border,
  },
  listItemHighlight: {
    backgroundColor: colors.quiz.primary + '15',
    borderColor: colors.quiz.primary + '40',
  },
  listRank: {
    width: 32,
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text.muted,
    textAlign: 'center',
  },
  listAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 12,
  },
  listInfo: {
    flex: 1,
  },
  listNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  listName: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text.primary,
  },
  youBadge: {
    backgroundColor: colors.quiz.primary + '30',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  youBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.quiz.primary,
  },
  listLevel: {
    fontSize: 12,
    color: colors.text.muted,
    marginTop: 2,
  },
  listStats: {
    flexDirection: 'row',
    gap: 12,
    marginRight: 12,
  },
  listStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  listStatIcon: {
    fontSize: 14,
  },
  listStatValue: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  listXp: {
    alignItems: 'flex-end',
  },
  listXpValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.quiz.primary,
  },
  listXpLabel: {
    fontSize: 10,
    color: colors.text.muted,
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
    opacity: 0.5,
  },
  emptyText: {
    fontSize: 16,
    color: colors.text.muted,
  },
  footer: {
    height: 40,
  },
});
