import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { ChevronLeft } from 'lucide-react-native';
import { theme } from '../theme/theme';
import { BitzIcon } from './BitzIcon';

interface AppHeaderProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  rightAction?: React.ReactNode;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  title,
  subtitle,
  onBack,
  rightAction,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        {onBack ? (
          <TouchableOpacity onPress={onBack} activeOpacity={0.7} style={styles.backButton}>
            <BitzIcon icon={ChevronLeft} size={24} color={theme.colors.text} />
          </TouchableOpacity>
        ) : (
          <View style={styles.placeholder} />
        )}

        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>

        {rightAction ? (
          <View style={styles.rightActionContainer}>{rightAction}</View>
        ) : (
          <View style={styles.placeholder} />
        )}
      </View>

      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.background,
    borderBottomWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing.md,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 44,
  },
  backButton: {
    padding: theme.spacing.xs,
    marginLeft: -theme.spacing.xs,
  },
  title: {
    color: theme.colors.text,
    ...theme.typography.titleSmall,
    textAlign: 'center',
    flex: 1,
    marginHorizontal: theme.spacing.sm,
  },
  rightActionContainer: {
    alignItems: 'flex-end',
    minWidth: 32,
  },
  placeholder: {
    width: 32,
  },
  subtitle: {
    color: theme.colors.textSecondary,
    ...theme.typography.bodySmall,
    textAlign: 'center',
    marginTop: 4,
  },
});
