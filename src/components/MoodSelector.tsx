import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Frown, Meh, Smile, Laugh, SmilePlus } from 'lucide-react-native';
import { theme } from '../theme/theme';

interface MoodSelectorProps {
  selectedMood: number;
  onSelect: (mood: number) => void;
}

export const MoodSelector: React.FC<MoodSelectorProps> = ({
  selectedMood,
  onSelect,
}) => {
  // Mapeamento numérico exato de 1 a 5 conforme regras do banco e especificações do usuário
  const moods = [
    { value: 1, label: 'Muito difícil', icon: Frown },
    { value: 2, label: 'Cansado', icon: Meh },
    { value: 3, label: 'Regular', icon: Smile },
    { value: 4, label: 'Bem', icon: Laugh },
    { value: 5, label: 'Excelente', icon: SmilePlus },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.grid}>
        {moods.map((mood) => {
          const isSelected = selectedMood === mood.value;
          const IconComponent = mood.icon;
          
          return (
            <TouchableOpacity
              key={mood.value}
              style={[
                styles.moodButton,
                isSelected && styles.moodButtonSelected,
              ]}
              onPress={() => onSelect(mood.value)}
              activeOpacity={0.7}
            >
              <View style={[
                styles.iconWrapper,
                isSelected && styles.iconWrapperSelected
              ]}>
                <IconComponent
                  size={24}
                  color={isSelected ? theme.colors.background : theme.colors.textSecondary}
                  strokeWidth={isSelected ? 2.2 : 1.5}
                />
              </View>
              <Text style={[
                styles.moodLabel,
                isSelected && styles.moodLabelSelected
              ]} numberOfLines={1}>
                {mood.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginVertical: theme.spacing.sm,
  },
  grid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  moodButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: theme.spacing.xs,
  },
  moodButtonSelected: {
    transform: [{ scale: 1.05 }],
  },
  iconWrapper: {
    width: 48,
    height: 48,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.xs,
  },
  iconWrapperSelected: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
    ...theme.shadows.subtle,
  },
  moodLabel: {
    fontSize: 10,
    color: theme.colors.textSecondary,
    fontWeight: '500',
    textAlign: 'center',
  },
  moodLabelSelected: {
    color: theme.colors.primary,
    fontWeight: 'bold',
  },
});
