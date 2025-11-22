import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { colors, CATEGORY_ICONS, DIFFICULTY_COLORS } from '../constants/theme';
import type { Question, AnswerResult } from '../types';
import Button from './Button';
import ProgressBar from './ProgressBar';

interface QuestionCardProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  timeRemaining: number;
  onAnswer: (selectedAnswer: number, timeSpent: number) => void;
  lastAnswer: AnswerResult | null;
  isAnswering: boolean;
}

export default function QuestionCard({
  question,
  questionNumber,
  totalQuestions,
  timeRemaining,
  onAnswer,
  lastAnswer,
  isAnswering,
}: QuestionCardProps) {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [startTime] = useState(Date.now());

  const hasAnswered = lastAnswer !== null;
  const timePercentage = timeRemaining / question.timeLimit;
  const isTimeLow = timeRemaining <= 10;

  useEffect(() => {
    setSelectedOption(null);
  }, [question.id]);

  const handleSelect = (index: number) => {
    if (hasAnswered || isAnswering) return;
    Haptics.selectionAsync();
    setSelectedOption(index);
  };

  const handleSubmit = () => {
    if (selectedOption === null || hasAnswered || isAnswering) return;
    const timeSpent = (Date.now() - startTime) / 1000;
    onAnswer(selectedOption, timeSpent);
  };

  const getOptionStyle = (index: number) => {
    if (hasAnswered) {
      if (index === lastAnswer.correctAnswer) {
        return [styles.option, styles.optionCorrect];
      }
      if (index === selectedOption && !lastAnswer.isCorrect) {
        return [styles.option, styles.optionWrong];
      }
      return [styles.option, styles.optionDisabled];
    }

    if (selectedOption === index) {
      return [styles.option, styles.optionSelected];
    }

    return [styles.option];
  };

  return (
    <Animated.View entering={FadeIn} style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.categoryInfo}>
          <Text style={styles.categoryIcon}>{CATEGORY_ICONS[question.category] || '📝'}</Text>
          <View>
            <Text style={styles.questionCount}>
              Question {questionNumber} of {totalQuestions}
            </Text>
            <Text style={[styles.difficulty, { color: DIFFICULTY_COLORS[question.difficulty] }]}>
              {question.difficulty.charAt(0).toUpperCase() + question.difficulty.slice(1)}
            </Text>
          </View>
        </View>

        {!hasAnswered && (
          <View style={[styles.timer, isTimeLow && styles.timerLow]}>
            <Text style={[styles.timerText, isTimeLow && styles.timerTextLow]}>
              {timeRemaining}s
            </Text>
          </View>
        )}
      </View>

      {/* Timer bar */}
      {!hasAnswered && (
        <View style={styles.timerBar}>
          <ProgressBar
            progress={timePercentage}
            height={4}
            color={isTimeLow ? 'error' : 'primary'}
          />
        </View>
      )}

      {/* Question */}
      <ScrollView style={styles.questionScroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.question}>{question.question}</Text>

        {/* Code block */}
        {question.code && (
          <View style={styles.codeBlock}>
            <Text style={styles.code}>{question.code}</Text>
          </View>
        )}

        {/* Options */}
        <View style={styles.options}>
          {question.options.map((option, index) => (
            <Animated.View key={index} entering={FadeInDown.delay(index * 100)}>
              <TouchableOpacity
                onPress={() => handleSelect(index)}
                disabled={hasAnswered || isAnswering}
                activeOpacity={0.7}
                style={getOptionStyle(index)}
              >
                <View
                  style={[
                    styles.optionLetter,
                    hasAnswered && index === lastAnswer.correctAnswer && styles.optionLetterCorrect,
                    hasAnswered && index === selectedOption && !lastAnswer.isCorrect && styles.optionLetterWrong,
                    selectedOption === index && !hasAnswered && styles.optionLetterSelected,
                  ]}
                >
                  <Text style={styles.optionLetterText}>
                    {String.fromCharCode(65 + index)}
                  </Text>
                </View>
                <Text style={styles.optionText}>{option}</Text>
                {hasAnswered && index === lastAnswer.correctAnswer && (
                  <Text style={styles.checkIcon}>✓</Text>
                )}
                {hasAnswered && index === selectedOption && !lastAnswer.isCorrect && (
                  <Text style={styles.crossIcon}>✗</Text>
                )}
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>

        {/* Submit button or feedback */}
        {!hasAnswered ? (
          <Button
            title={isAnswering ? 'Checking...' : 'Submit Answer'}
            onPress={handleSubmit}
            disabled={selectedOption === null || isAnswering}
            loading={isAnswering}
            style={styles.submitButton}
          />
        ) : (
          <View style={[styles.feedback, lastAnswer.isCorrect ? styles.feedbackCorrect : styles.feedbackWrong]}>
            <View style={styles.feedbackHeader}>
              <Text style={lastAnswer.isCorrect ? styles.feedbackTitleCorrect : styles.feedbackTitleWrong}>
                {lastAnswer.isCorrect ? `Correct! +${lastAnswer.pointsEarned} points` : 'Incorrect'}
              </Text>
            </View>
            <Text style={styles.explanation}>{lastAnswer.explanation}</Text>
            <Text style={styles.source}>Source: {lastAnswer.source}</Text>
          </View>
        )}

        {/* Points indicator */}
        <Text style={styles.points}>{question.points} points available</Text>
      </ScrollView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.quiz.card,
    borderRadius: 20,
    padding: 20,
    margin: 16,
    borderWidth: 1,
    borderColor: colors.quiz.border,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  categoryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  categoryIcon: {
    fontSize: 32,
  },
  questionCount: {
    fontSize: 14,
    color: colors.text.muted,
  },
  difficulty: {
    fontSize: 14,
    fontWeight: '600',
  },
  timer: {
    backgroundColor: colors.quiz.dark,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
  },
  timerLow: {
    backgroundColor: colors.quiz.error + '30',
  },
  timerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text.primary,
    fontFamily: 'monospace',
  },
  timerTextLow: {
    color: colors.quiz.error,
  },
  timerBar: {
    marginBottom: 20,
  },
  questionScroll: {
    flex: 1,
  },
  question: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 16,
    lineHeight: 28,
  },
  codeBlock: {
    backgroundColor: colors.quiz.darker,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.quiz.border,
  },
  code: {
    fontFamily: 'monospace',
    fontSize: 13,
    color: colors.text.secondary,
    lineHeight: 20,
  },
  options: {
    gap: 12,
    marginBottom: 20,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: colors.quiz.dark,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.quiz.border,
    gap: 12,
  },
  optionSelected: {
    borderColor: colors.quiz.primary,
    backgroundColor: colors.quiz.primary + '15',
  },
  optionCorrect: {
    borderColor: colors.quiz.success,
    backgroundColor: colors.quiz.success + '15',
  },
  optionWrong: {
    borderColor: colors.quiz.error,
    backgroundColor: colors.quiz.error + '15',
  },
  optionDisabled: {
    opacity: 0.5,
  },
  optionLetter: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.quiz.darker,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionLetterSelected: {
    backgroundColor: colors.quiz.primary,
  },
  optionLetterCorrect: {
    backgroundColor: colors.quiz.success,
  },
  optionLetterWrong: {
    backgroundColor: colors.quiz.error,
  },
  optionLetterText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  optionText: {
    flex: 1,
    fontSize: 15,
    color: colors.text.primary,
    lineHeight: 22,
  },
  checkIcon: {
    fontSize: 20,
    color: colors.quiz.success,
  },
  crossIcon: {
    fontSize: 20,
    color: colors.quiz.error,
  },
  submitButton: {
    marginBottom: 16,
  },
  feedback: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
  },
  feedbackCorrect: {
    backgroundColor: colors.quiz.success + '15',
    borderColor: colors.quiz.success + '40',
  },
  feedbackWrong: {
    backgroundColor: colors.quiz.error + '15',
    borderColor: colors.quiz.error + '40',
  },
  feedbackHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  feedbackTitleCorrect: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.quiz.success,
  },
  feedbackTitleWrong: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.quiz.error,
  },
  explanation: {
    fontSize: 14,
    color: colors.text.secondary,
    lineHeight: 22,
  },
  source: {
    fontSize: 12,
    color: colors.text.muted,
    marginTop: 8,
  },
  points: {
    fontSize: 13,
    color: colors.text.muted,
    textAlign: 'center',
  },
});
