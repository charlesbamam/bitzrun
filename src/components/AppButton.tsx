import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  View,
  StyleProp,
} from 'react-native';
import { theme } from '../theme/theme';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';

interface AppButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  disabled?: boolean;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  icon?: React.ReactNode;
}

export const AppButton: React.FC<AppButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  style,
  textStyle,
  icon,
}) => {
  const getButtonStyles = (): StyleProp<ViewStyle> => {
    const stylesArray: any[] = [styles.baseButton];

    if (variant === 'primary') {
      stylesArray.push(styles.primaryButton);
    } else if (variant === 'secondary') {
      stylesArray.push(styles.secondaryButton);
    } else if (variant === 'outline') {
      stylesArray.push(styles.outlineButton);
    } else if (variant === 'ghost') {
      stylesArray.push(styles.ghostButton);
    }

    if (disabled) {
      stylesArray.push(
        variant === 'primary' ? styles.primaryDisabledButton : styles.disabledButton
      );
    }

    if (style) {
      stylesArray.push(style);
    }

    return stylesArray;
  };

  const getTextStyles = (): StyleProp<TextStyle> => {
    const stylesArray: any[] = [styles.baseText];

    if (variant === 'primary') {
      stylesArray.push(styles.primaryText);
    } else if (variant === 'secondary') {
      stylesArray.push(styles.secondaryText);
    } else if (variant === 'outline') {
      stylesArray.push(styles.outlineText);
    } else if (variant === 'ghost') {
      stylesArray.push(styles.ghostText);
    }

    if (disabled) {
      stylesArray.push(styles.disabledText);
    }

    if (textStyle) {
      stylesArray.push(textStyle);
    }

    return stylesArray;
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
      style={getButtonStyles()}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'primary' ? theme.colors.background : theme.colors.primary}
          size="small"
        />
      ) : (
        <View style={styles.contentContainer}>
          {icon && <View style={styles.iconContainer}>{icon}</View>}
          <Text style={getTextStyles()}>{title}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  baseButton: {
    height: 52,
    borderRadius: theme.borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.lg,
    flexDirection: 'row',
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    marginRight: theme.spacing.sm,
  },
  baseText: {
    ...theme.typography.button,
  },
  primaryButton: {
    backgroundColor: theme.colors.primary,
  },
  primaryText: {
    color: theme.colors.background,
  },
  primaryDisabledButton: {
    backgroundColor: theme.colors.primaryDisabled,
  },
  secondaryButton: {
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  secondaryText: {
    color: theme.colors.text,
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: theme.colors.primary,
  },
  outlineText: {
    color: theme.colors.primary,
  },
  ghostButton: {
    backgroundColor: 'transparent',
  },
  ghostText: {
    color: theme.colors.textSecondary,
  },
  disabledButton: {
    opacity: 0.5,
  },
  disabledText: {
    color: theme.colors.textSecondary,
    opacity: 0.7,
  },
});
