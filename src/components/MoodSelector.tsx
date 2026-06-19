import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Feather, Battery, Sparkles, Frown, Target, TrendingUp } from 'lucide-react-native';
import { theme } from '../theme/theme';

interface MoodSelectorProps {
  selectedMood: number;
  onSelect: (mood: number) => void;
}

export const MoodSelector: React.FC<MoodSelectorProps> = ({
  selectedMood,
  onSelect,
}) => {
  // Lista de 6 sentimentos/estados profissionais
  const moods = [
    { value: 1, label: 'Sem vontade', icon: Frown },
    { value: 2, label: 'Cansado', icon: Battery },
    { value: 3, label: 'Leve', icon: Feather },
    { value: 4, label: 'Focado', icon: Target },
    { value: 5, label: 'Animado', icon: Sparkles },
    { value: 6, label: 'Melhor agora', icon: TrendingUp },
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
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  moodButton: {
    width: '30%', // Grid de 3 colunas
    alignItems: 'center',
    marginBottom: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
  },
  moodButtonSelected: {
    transform: [{ scale: 1.05 }],
  },
  iconWrapper: {
    width: 52,
    height: 52,
    borderRadius: theme.borderRadius.lg,
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
    fontSize: 11,
    color: theme.colors.textSecondary,
    fontWeight: '500',
    textAlign: 'center',
  },
  moodLabelSelected: {
    color: theme.colors.primary,
    fontWeight: 'bold',
  },
});
