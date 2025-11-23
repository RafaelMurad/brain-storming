import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { colors, CATEGORY_ICONS, DIFFICULTY_COLORS } from '../constants/theme';
import { useGameStore } from '../store/gameStore';
import type { Category, Difficulty } from '../types';
import Button from '../components/Button';
import QuestionCard from '../components/QuestionCard';
import StatCard from '../components/StatCard';
import ProgressBar from '../components/ProgressBar';

const categories: { id: Category | 'mixed'; name: string }[] = [
  { id: 'mixed', name: 'Mixed' },
  { id: 'react', name: 'React' },
  { id: 'typescript', name: 'TypeScript' },
  { id: 'javascript', name: 'JavaScript' },
  { id: 'css', name: 'CSS' },
  { id: 'nextjs', name: 'Next.js' },
  { id: 'testing', name: 'Testing' },
];

const difficulties: { id: Difficulty; name: string }[] = [
  { id: 'beginner', name: 'Beginner' },
  { id: 'intermediate', name: 'Intermediate' },
  { id: 'advanced', name: 'Advanced' },
  { id: 'expert', name: 'Expert' },
];

export default function PlayScreen() {
  const {
    isAuthenticated,
    session,
    currentQuestion,
    answers,
    timeRemaining,
    lastAnswer,
    gameResult,
    isLoading,
    isAnswering,
    startGame,
    submitAnswer,
    nextQuestion,
    completeGame,
    resetGame,
    setTimeRemaining,
  } = useGameStore();

  const [selectedCategory, setSelectedCategory] = useState<Category | 'mixed'>('mixed');
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>('intermediate');
  const [questionCount, setQuestionCount] = useState(10);

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/login');
    }
  }, [isAuthenticated]);

  // Timer logic
  useEffect(() => {
    if (!session || session.isComplete || lastAnswer) return;

    const timer = setInterval(() => {
      setTimeRemaining(Math.max(0, timeRemaining - 1));
    }, 1000);

    if (timeRemaining === 0 && !lastAnswer && !isAnswering) {
      handleAnswer(-1, session.questions[currentQuestion].timeLimit);
    }

    return () => clearInterval(timer);
  }, [session, timeRemaining, lastAnswer, isAnswering, currentQuestion]);

  const handleStartGame = async () => {
    await startGame(selectedCategory, selectedDifficulty, questionCount);
  };

  const handleAnswer = async (selected: number, timeSpent: number) => {
    await submitAnswer(selected, timeSpent);
  };

  const handleNext = () => {
    if (currentQuestion >= (session?.questions.length || 0) - 1) {
      completeGame();
    } else {
      nextQuestion();
    }
  };

  // Result screen
  if (gameResult) {
    const isPerfect = gameResult.accuracy === 100;
    const isGreat = gameResult.accuracy >= 80;

    return (
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.resultContainer}>
          <Animated.View entering={FadeIn} style={styles.resultHeader}>
            <View style={[styles.resultBadge, isPerfect ? styles.resultBadgePerfect : isGreat ? styles.resultBadgeGreat : {}]}>
              <Text style={styles.resultBadgeIcon}>🏆</Text>
            </View>
            <Text style={styles.resultTitle}>
              {isPerfect ? 'Perfect Score!' : isGreat ? 'Great Job!' : 'Quiz Complete!'}
            </Text>
            <Text style={styles.resultSubtitle}>
              You answered {gameResult.correctAnswers} out of {gameResult.totalQuestions} correctly
            </Text>
          </Animated.View>

          {gameResult.levelUp && (
            <Animated.View entering={FadeInDown.delay(100)} style={styles.levelUpBanner}>
              <Text style={styles.levelUpText}>⭐ LEVEL UP! ⭐</Text>
              <Text style={styles.levelUpLevel}>Level {gameResult.newLevel}</Text>
            </Animated.View>
          )}

          <Animated.View entering={FadeInDown.delay(200)} style={styles.statsGrid}>
            <StatCard icon="🎯" value={`${gameResult.accuracy.toFixed(0)}%`} label="Accuracy" color={colors.quiz.primary} />
            <StatCard icon="⭐" value={`+${gameResult.xpEarned}`} label="XP Earned" color={colors.quiz.success} />
            <StatCard icon="🔥" value={gameResult.newStreak} label="Day Streak" color={colors.quiz.accent} />
            <StatCard icon="🏆" value={gameResult.totalScore} label="Score" color={colors.quiz.secondary} />
          </Animated.View>

          {gameResult.newAchievements.length > 0 && (
            <Animated.View entering={FadeInDown.delay(300)} style={styles.achievementsSection}>
              <Text style={styles.achievementsTitle}>🎖️ New Achievements!</Text>
              {gameResult.newAchievements.map((achievement) => (
                <View key={achievement.id} style={styles.achievementCard}>
                  <Text style={styles.achievementIcon}>{achievement.icon}</Text>
                  <View style={styles.achievementInfo}>
                    <Text style={styles.achievementName}>{achievement.name}</Text>
                    <Text style={styles.achievementDesc}>{achievement.description}</Text>
                  </View>
                </View>
              ))}
            </Animated.View>
          )}

          <Animated.View entering={FadeInDown.delay(400)} style={styles.resultActions}>
            <Button title="Play Again" onPress={resetGame} />
            <Button title="Leaderboard" onPress={() => router.push('/leaderboard')} variant="secondary" />
          </Animated.View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // Game screen
  if (session && !session.isComplete) {
    const question = session.questions[currentQuestion];

    return (
      <SafeAreaView style={styles.container}>
        {/* Progress header */}
        <View style={styles.gameHeader}>
          <Text style={styles.progressText}>Score: {session.score}</Text>
          <ProgressBar
            progress={(currentQuestion + (lastAnswer ? 1 : 0)) / session.questions.length}
            height={6}
          />
        </View>

        <QuestionCard
          question={question}
          questionNumber={currentQuestion + 1}
          totalQuestions={session.questions.length}
          timeRemaining={timeRemaining}
          onAnswer={handleAnswer}
          lastAnswer={lastAnswer}
          isAnswering={isAnswering}
        />

        {lastAnswer && (
          <Animated.View entering={FadeIn} style={styles.nextButtonContainer}>
            <Button
              title={currentQuestion >= session.questions.length - 1 ? 'See Results' : 'Next Question →'}
              onPress={handleNext}
            />
          </Animated.View>
        )}
      </SafeAreaView>
    );
  }

  // Setup screen
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.setupContainer}>
        <Animated.View entering={FadeIn}>
          <Text style={styles.setupTitle}>Start a Quiz</Text>
          <Text style={styles.setupSubtitle}>Choose your category and difficulty</Text>
        </Animated.View>

        {/* Category Selection */}
        <Animated.View entering={FadeInDown.delay(100)} style={styles.section}>
          <Text style={styles.sectionTitle}>Category</Text>
          <View style={styles.optionsGrid}>
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                onPress={() => setSelectedCategory(cat.id)}
                style={[
                  styles.optionCard,
                  selectedCategory === cat.id && styles.optionCardSelected,
                ]}
              >
                <Text style={styles.optionIcon}>{CATEGORY_ICONS[cat.id]}</Text>
                <Text style={styles.optionName}>{cat.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>

        {/* Difficulty Selection */}
        <Animated.View entering={FadeInDown.delay(200)} style={styles.section}>
          <Text style={styles.sectionTitle}>Difficulty</Text>
          <View style={styles.difficultyGrid}>
            {difficulties.map((diff) => (
              <TouchableOpacity
                key={diff.id}
                onPress={() => setSelectedDifficulty(diff.id)}
                style={[
                  styles.difficultyCard,
                  selectedDifficulty === diff.id && styles.difficultyCardSelected,
                ]}
              >
                <Text style={[styles.difficultyName, { color: DIFFICULTY_COLORS[diff.id] }]}>
                  {diff.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>

        {/* Question Count */}
        <Animated.View entering={FadeInDown.delay(300)} style={styles.section}>
          <Text style={styles.sectionTitle}>Questions</Text>
          <View style={styles.countGrid}>
            {[5, 10, 15, 20].map((count) => (
              <TouchableOpacity
                key={count}
                onPress={() => setQuestionCount(count)}
                style={[
                  styles.countCard,
                  questionCount === count && styles.countCardSelected,
                ]}
              >
                <Text style={styles.countText}>{count}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>

        {/* Start Button */}
        <Animated.View entering={FadeInDown.delay(400)} style={styles.startSection}>
          <Button
            title="🎮  Start Quiz"
            onPress={handleStartGame}
            loading={isLoading}
          />
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.quiz.darker,
  },
  setupContainer: {
    padding: 20,
  },
  setupTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: 8,
  },
  setupSubtitle: {
    fontSize: 16,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 12,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  optionCard: {
    width: '31%',
    backgroundColor: colors.quiz.card,
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.quiz.border,
  },
  optionCardSelected: {
    borderColor: colors.quiz.primary,
    backgroundColor: colors.quiz.primary + '15',
  },
  optionIcon: {
    fontSize: 24,
    marginBottom: 6,
  },
  optionName: {
    fontSize: 12,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  difficultyGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  difficultyCard: {
    flex: 1,
    backgroundColor: colors.quiz.card,
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.quiz.border,
  },
  difficultyCardSelected: {
    borderColor: colors.quiz.primary,
    backgroundColor: colors.quiz.primary + '15',
  },
  difficultyName: {
    fontSize: 13,
    fontWeight: '600',
  },
  countGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  countCard: {
    flex: 1,
    backgroundColor: colors.quiz.card,
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.quiz.border,
  },
  countCardSelected: {
    borderColor: colors.quiz.primary,
    backgroundColor: colors.quiz.primary + '15',
  },
  countText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  startSection: {
    marginTop: 8,
  },
  gameHeader: {
    padding: 16,
    paddingTop: 8,
    gap: 8,
  },
  progressText: {
    fontSize: 14,
    color: colors.text.muted,
    textAlign: 'right',
  },
  nextButtonContainer: {
    padding: 16,
    paddingTop: 0,
  },
  resultContainer: {
    padding: 20,
  },
  resultHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  resultBadge: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.quiz.card,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  resultBadgePerfect: {
    backgroundColor: colors.quiz.accent + '30',
  },
  resultBadgeGreat: {
    backgroundColor: colors.quiz.primary + '30',
  },
  resultBadgeIcon: {
    fontSize: 48,
  },
  resultTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 8,
  },
  resultSubtitle: {
    fontSize: 16,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  levelUpBanner: {
    backgroundColor: colors.quiz.primary + '20',
    borderWidth: 1,
    borderColor: colors.quiz.primary + '40',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    marginBottom: 24,
  },
  levelUpText: {
    fontSize: 16,
    color: colors.quiz.accent,
    fontWeight: 'bold',
  },
  levelUpLevel: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginTop: 4,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  achievementsSection: {
    marginBottom: 24,
  },
  achievementsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 12,
  },
  achievementCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.quiz.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    gap: 16,
    borderWidth: 1,
    borderColor: colors.quiz.border,
  },
  achievementIcon: {
    fontSize: 32,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
  },
  achievementDesc: {
    fontSize: 13,
    color: colors.text.muted,
    marginTop: 2,
  },
  resultActions: {
    gap: 12,
  },
});
