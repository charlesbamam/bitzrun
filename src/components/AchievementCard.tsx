import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Lock, Check } from 'lucide-react-native';
import { theme } from '../theme/theme';
import { AppCard } from './AppCard';
import { formatFriendlyDate } from '../services/storage';

interface AchievementCardProps {
  title: string;
  description: string;
  isUnlocked: boolean;
  icon?: React.ReactNode;
  unlockedDate?: string;
}

export const AchievementCard: React.FC<AchievementCardProps> = ({
  title,
  description,
  isUnlocked,
  icon,
  unlockedDate,
}) => {
  return (
    <AppCard
      variant={isUnlocked ? 'default' : 'outlined'}
      style={[styles.card, !isUnlocked && styles.cardLocked]}
    >
      <View style={styles.contentRow}>
        <View style={[
          styles.iconContainer,
          isUnlocked ? styles.iconContainerUnlocked : styles.iconContainerLocked
        ]}>
          {isUnlocked && icon ? (
            icon
          ) : (
            <Lock size={18} color={theme.colors.textMuted} strokeWidth={2} />
          )}
        </View>

        <View style={styles.textContainer}>
          <View style={styles.titleRow}>
            <Text style={[
              styles.title,
              !isUnlocked && styles.titleLocked
            ]}>
              {title}
            </Text>
            {isUnlocked && (
              <View style={styles.unlockedBadge}>
                <Check size={8} color={theme.colors.background} strokeWidth={3.5} />
              </View>
            )}
          </View>
          <Text style={styles.description}>{description}</Text>
          {isUnlocked && unlockedDate && (
            <Text style={styles.date}>
              Conquistado em {formatFriendlyDate(unlockedDate)}
            </Text>
          )}
        </View>
      </View>
    </AppCard>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: theme.spacing.sm,
    padding: theme.spacing.md,
  },
  cardLocked: {
    opacity: 0.5,
    borderStyle: 'dashed',
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
  },
  iconContainerUnlocked: {
    backgroundColor: 'rgba(204, 255, 0, 0.1)',
  },
  iconContainerLocked: {
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  textContainer: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  title: {
    color: theme.colors.text,
    fontSize: 14,
    fontWeight: 'bold',
  },
  titleLocked: {
    color: theme.colors.textSecondary,
  },
  unlockedBadge: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.round,
    padding: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  description: {
    color: theme.colors.textSecondary,
    fontSize: 12,
    lineHeight: 16,
  },
  date: {
    color: theme.colors.primary,
    fontSize: 10,
    fontWeight: '600',
    marginTop: 4,
  },
});
