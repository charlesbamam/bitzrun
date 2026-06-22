import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Share2 } from 'lucide-react-native';
import { theme } from '../theme/theme';
import { AppCard } from './AppCard';
import { formatFriendlyDate } from '../services/storage';
import { BitzIcon } from './BitzIcon';

interface MemoryCardProps {
  date: string;
  title: string;
  description: string;
  metrics?: string;
  onShare?: () => void;
}

export const MemoryCard: React.FC<MemoryCardProps> = ({
  date,
  title,
  description,
  metrics,
  onShare,
}) => {
  return (
    <AppCard variant="secondary" style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.date}>{formatFriendlyDate(date)}</Text>
        {onShare && (
          <TouchableOpacity onPress={onShare} activeOpacity={0.7} style={styles.shareButton}>
            <BitzIcon icon={Share2} size={16} color={theme.colors.primary} />
          </TouchableOpacity>
        )}
      </View>
      
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>“{description}”</Text>
      
      {metrics && (
        <View style={styles.metricsContainer}>
          <Text style={styles.metricsText}>{metrics}</Text>
        </View>
      )}
    </AppCard>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: theme.spacing.md,
    padding: theme.spacing.lg,
    borderLeftWidth: 3,
    borderLeftColor: theme.colors.primary,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  date: {
    color: theme.colors.textSecondary,
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  shareButton: {
    padding: 4,
  },
  title: {
    color: theme.colors.text,
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  description: {
    color: theme.colors.textSecondary,
    fontSize: 13,
    fontStyle: 'italic',
    lineHeight: 18,
    fontWeight: '500',
  },
  metricsContainer: {
    marginTop: theme.spacing.sm,
    paddingTop: theme.spacing.xs,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  metricsText: {
    color: theme.colors.primary,
    fontSize: 11,
    fontWeight: '600',
  },
});
