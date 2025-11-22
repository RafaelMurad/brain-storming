import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { colors, CATEGORY_ICONS, XP_PER_LEVEL } from '../constants/theme';
import { useGameStore } from '../store/gameStore';
import Button from '../components/Button';
import ProgressBar from '../components/ProgressBar';

export default function HomeScreen() {
  const { user, isAuthenticated } = useGameStore();

  const categories = [
    { id: 'react', name: 'React' },
    { id: 'typescript', name: 'TypeScript' },
    { id: 'javascript', name: 'JavaScript' },
    { id: 'css', name: 'CSS' },
    { id: 'nextjs', name: 'Next.js' },
    { id: 'testing', name: 'Testing' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <Animated.View entering={FadeIn} style={styles.header}>
          <View style={styles.logo}>
            <LinearGradient
              colors={[colors.quiz.primary, colors.quiz.secondary]}
              style={styles.logoGradient}
            >
              <Text style={styles.logoIcon}>🎯</Text>
            </LinearGradient>
            <Text style={styles.logoText}>Frontend Quiz</Text>
          </View>

          {isAuthenticated && user && (
            <View style={styles.userInfo}>
              <View style={styles.streakBadge}>
                <Text style={styles.streakIcon}>🔥</Text>
                <Text style={styles.streakCount}>{user.streak}</Text>
              </View>
              <Image
                source={{ uri: user.avatar }}
                style={styles.avatar}
              />
            </View>
          )}
        </Animated.View>

        {/* User Stats (if logged in) */}
        {isAuthenticated && user && (
          <Animated.View entering={FadeInDown.delay(100)} style={styles.statsCard}>
            <LinearGradient
              colors={[colors.quiz.primary + '20', colors.quiz.secondary + '20']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.statsGradient}
            >
              <View style={styles.statsHeader}>
                <View>
                  <Text style={styles.welcomeText}>Welcome back,</Text>
                  <Text style={styles.usernameText}>{user.username}</Text>
                </View>
                <View style={styles.levelBadge}>
                  <Text style={styles.levelText}>Lv. {user.level}</Text>
                </View>
              </View>

              <View style={styles.xpSection}>
                <View style={styles.xpLabels}>
                  <Text style={styles.xpLabel}>XP Progress</Text>
                  <Text style={styles.xpValue}>{user.xp} / {XP_PER_LEVEL}</Text>
                </View>
                <ProgressBar progress={user.xp / XP_PER_LEVEL} height={8} />
              </View>

              <View style={styles.statsRow}>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{user.stats.totalQuestions}</Text>
                  <Text style={styles.statLabel}>Questions</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{user.stats.accuracy.toFixed(0)}%</Text>
                  <Text style={styles.statLabel}>Accuracy</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{user.longestStreak}</Text>
                  <Text style={styles.statLabel}>Best Streak</Text>
                </View>
              </View>
            </LinearGradient>
          </Animated.View>
        )}

        {/* Hero */}
        <Animated.View entering={FadeInDown.delay(200)} style={styles.hero}>
          <Text style={styles.heroTitle}>
            Master Frontend{'\n'}
            <Text style={styles.heroTitleGradient}>One Quiz at a Time</Text>
          </Text>
          <Text style={styles.heroSubtitle}>
            AI-generated questions from React, TypeScript, CSS, and more.
            Build streaks and climb the leaderboard.
          </Text>
        </Animated.View>

        {/* Main Action */}
        <Animated.View entering={FadeInDown.delay(300)} style={styles.actions}>
          <Button
            title={isAuthenticated ? '🎮  Start Quiz' : '👋  Get Started'}
            onPress={() => router.push(isAuthenticated ? '/play' : '/login')}
            style={styles.mainButton}
          />
          <Button
            title="🏆  Leaderboard"
            onPress={() => router.push('/leaderboard')}
            variant="secondary"
            style={styles.secondaryButton}
          />
        </Animated.View>

        {/* Categories */}
        <Animated.View entering={FadeInDown.delay(400)} style={styles.categoriesSection}>
          <Text style={styles.sectionTitle}>Choose Your Challenge</Text>
          <View style={styles.categoriesGrid}>
            {categories.map((cat, index) => (
              <View key={cat.id} style={styles.categoryCard}>
                <Text style={styles.categoryIcon}>{CATEGORY_ICONS[cat.id as keyof typeof CATEGORY_ICONS]}</Text>
                <Text style={styles.categoryName}>{cat.name}</Text>
              </View>
            ))}
          </View>
        </Animated.View>

        {/* Features */}
        <Animated.View entering={FadeInDown.delay(500)} style={styles.featuresSection}>
          <Text style={styles.sectionTitle}>Why Frontend Quiz?</Text>
          <View style={styles.featuresList}>
            <View style={styles.featureItem}>
              <Text style={styles.featureIcon}>🧠</Text>
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>AI-Generated Questions</Text>
                <Text style={styles.featureDesc}>Based on official documentation</Text>
              </View>
            </View>
            <View style={styles.featureItem}>
              <Text style={styles.featureIcon}>🔥</Text>
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>Daily Streaks</Text>
                <Text style={styles.featureDesc}>Build habits and earn bonuses</Text>
              </View>
            </View>
            <View style={styles.featureItem}>
              <Text style={styles.featureIcon}>⭐</Text>
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>Level System</Text>
                <Text style={styles.featureDesc}>Track your progress over time</Text>
              </View>
            </View>
          </View>
        </Animated.View>

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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  logo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logoGradient: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoIcon: {
    fontSize: 24,
  },
  logoText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.quiz.dark,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
  },
  streakIcon: {
    fontSize: 16,
  },
  streakCount: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: colors.quiz.primary,
  },
  statsCard: {
    margin: 20,
    marginTop: 12,
    borderRadius: 20,
    overflow: 'hidden',
  },
  statsGradient: {
    padding: 20,
    borderWidth: 1,
    borderColor: colors.quiz.primary + '30',
    borderRadius: 20,
  },
  statsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  welcomeText: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  usernameText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  levelBadge: {
    backgroundColor: colors.quiz.accent,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },
  levelText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  xpSection: {
    marginBottom: 16,
  },
  xpLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  xpLabel: {
    fontSize: 13,
    color: colors.text.muted,
  },
  xpValue: {
    fontSize: 13,
    color: colors.quiz.primary,
    fontWeight: '600',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  statLabel: {
    fontSize: 12,
    color: colors.text.muted,
    marginTop: 4,
  },
  hero: {
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  heroTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: colors.text.primary,
    lineHeight: 44,
    marginBottom: 12,
  },
  heroTitleGradient: {
    color: colors.quiz.primary,
  },
  heroSubtitle: {
    fontSize: 16,
    color: colors.text.secondary,
    lineHeight: 24,
  },
  actions: {
    paddingHorizontal: 20,
    gap: 12,
  },
  mainButton: {
    marginBottom: 0,
  },
  secondaryButton: {
    marginBottom: 0,
  },
  categoriesSection: {
    padding: 20,
    paddingTop: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 16,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  categoryCard: {
    width: '30%',
    backgroundColor: colors.quiz.card,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.quiz.border,
  },
  categoryIcon: {
    fontSize: 28,
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 12,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  featuresSection: {
    padding: 20,
    paddingTop: 8,
  },
  featuresList: {
    gap: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.quiz.card,
    padding: 16,
    borderRadius: 16,
    gap: 16,
    borderWidth: 1,
    borderColor: colors.quiz.border,
  },
  featureIcon: {
    fontSize: 32,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 4,
  },
  featureDesc: {
    fontSize: 13,
    color: colors.text.muted,
  },
  footer: {
    height: 40,
  },
});
