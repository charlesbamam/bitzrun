import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput, Platform } from 'react-native';
import { AlertTriangle, ChevronRight } from 'lucide-react-native';
import { theme } from '../theme/theme';
import { ScreenContainer } from '../components/ScreenContainer';
import { AppCard } from '../components/AppCard';
import { AppButton } from '../components/AppButton';
import { AppHeader } from '../components/AppHeader';
import { STOP_REASON_LABELS } from '../services/storage';

interface StopReasonScreenProps {
  onSave: (reasons: string[], note: string) => void;
  onSkip: () => void;
}

interface ReasonOption {
  id: string;
  label: string;
}

interface Category {
  title: string;
  options: ReasonOption[];
}

const CATEGORIES: Category[] = [
  {
    title: 'Corpo',
    options: [
      { id: 'knee_pain', label: STOP_REASON_LABELS.knee_pain },
      { id: 'back_pain', label: STOP_REASON_LABELS.back_pain },
      { id: 'foot_pain', label: STOP_REASON_LABELS.foot_pain },
      { id: 'shin_pain', label: STOP_REASON_LABELS.shin_pain },
      { id: 'ankle_pain', label: STOP_REASON_LABELS.ankle_pain },
      { id: 'cramps', label: STOP_REASON_LABELS.cramps },
      { id: 'muscle_pain', label: STOP_REASON_LABELS.muscle_pain },
    ],
  },
  {
    title: 'Respiração e energia',
    options: [
      { id: 'out_of_breath', label: STOP_REASON_LABELS.out_of_breath },
      { id: 'strong_tiredness', label: STOP_REASON_LABELS.strong_tiredness },
      { id: 'felt_bad', label: STOP_REASON_LABELS.felt_bad },
      { id: 'dizziness', label: STOP_REASON_LABELS.dizziness },
      { id: 'heat', label: STOP_REASON_LABELS.heat },
    ],
  },
  {
    title: 'Motivação e contexto',
    options: [
      { id: 'no_motivation', label: STOP_REASON_LABELS.no_motivation },
      { id: 'anxiety', label: STOP_REASON_LABELS.anxiety },
      { id: 'no_time', label: STOP_REASON_LABELS.no_time },
      { id: 'pace_too_hard', label: STOP_REASON_LABELS.pace_too_hard },
      { id: 'goal_too_high', label: STOP_REASON_LABELS.goal_too_high },
      { id: 'distraction', label: STOP_REASON_LABELS.distraction },
    ],
  },
  {
    title: 'Outro',
    options: [
      { id: 'other', label: STOP_REASON_LABELS.other },
    ],
  },
];

export const StopReasonScreen: React.FC<StopReasonScreenProps> = ({ onSave, onSkip }) => {
  const [selectedReasons, setSelectedReasons] = useState<string[]>([]);
  const [note, setNote] = useState('');
  const noteInputRef = useRef<TextInput>(null);

  // Monitora se "Outro motivo" foi selecionado para focar o input
  const isOtherSelected = selectedReasons.includes('other');

  useEffect(() => {
    if (isOtherSelected) {
      setTimeout(() => {
        noteInputRef.current?.focus();
      }, 100);
    }
  }, [isOtherSelected]);

  const toggleReason = (id: string) => {
    setSelectedReasons(prev =>
      prev.includes(id) ? prev.filter(r => r !== id) : [...prev, id]
    );
  };

  const handleSave = () => {
    onSave(selectedReasons, note.trim());
  };

  // Verifica se selecionou "Me senti mal" ou "Tontura" para exibir o aviso de saúde
  const showHealthWarning = selectedReasons.includes('felt_bad') || selectedReasons.includes('dizziness');

  return (
    <ScreenContainer scrollable avoidKeyboard style={styles.container}>
      <AppHeader title="O que dificultou hoje?" />

      <View style={styles.content}>
        <Text style={styles.subtitle}>
          Não é sobre culpa. É sobre entender o que atrapalhou sua corrida.
        </Text>
        
        <Text style={styles.textSupport}>Escolha uma ou mais opções.</Text>

        {CATEGORIES.map(category => (
          <View key={category.title} style={styles.categorySection}>
            <Text style={styles.categoryTitle}>{category.title}</Text>
            <View style={styles.pillsContainer}>
              {category.options.map(opt => {
                const isSelected = selectedReasons.includes(opt.id);
                return (
                  <TouchableOpacity
                    key={opt.id}
                    style={[
                      styles.pill,
                      isSelected && styles.pillSelected
                    ]}
                    onPress={() => toggleReason(opt.id)}
                    activeOpacity={0.7}
                  >
                    <Text style={[
                      styles.pillText,
                      isSelected && styles.pillTextSelected
                    ]}>
                      {opt.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        ))}

        {/* Campo opcional de observação */}
        <AppCard style={styles.noteCard}>
          <Text style={styles.noteLabel}>Quer deixar uma observação?</Text>
          <TextInput
            ref={noteInputRef}
            style={styles.textInput}
            value={note}
            onChangeText={setNote}
            placeholder="Ex: senti dor no joelho depois de alguns minutos"
            placeholderTextColor="#666666"
            maxLength={200}
            multiline
            numberOfLines={3}
          />
          <Text style={styles.charCount}>{note.length}/200</Text>
        </AppCard>

        {/* Alerta preventivo de saúde */}
        {showHealthWarning && (
          <View style={styles.warningContainer}>
            <AlertTriangle size={18} color={theme.colors.error} style={styles.warningIcon} />
            <Text style={styles.warningText}>
              Se o desconforto for forte ou persistente, pare e procure orientação profissional.
            </Text>
          </View>
        )}

        {/* Ações */}
        <View style={styles.actionsContainer}>
          <AppButton
            title="Salvar motivo"
            onPress={handleSave}
            variant="primary"
            style={styles.btnSave}
          />
          <AppButton
            title="Pular"
            onPress={onSkip}
            variant="ghost"
            style={styles.btnSkip}
          />
        </View>
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: theme.spacing.xl,
  },
  content: {
    paddingTop: theme.spacing.sm,
    paddingBottom: 40,
  },
  subtitle: {
    color: theme.colors.textSecondary,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: theme.spacing.md,
  },
  textSupport: {
    color: theme.colors.text,
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: theme.spacing.md,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  categorySection: {
    marginBottom: theme.spacing.md,
  },
  categoryTitle: {
    color: theme.colors.textSecondary,
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: theme.spacing.xs,
  },
  pillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  pill: {
    backgroundColor: theme.colors.card,
    borderRadius: 16, // Padrão solicitado de 16px
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  pillSelected: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  pillText: {
    color: theme.colors.text,
    fontSize: 12,
    fontWeight: '600',
  },
  pillTextSelected: {
    color: theme.colors.background,
    fontWeight: 'bold',
  },
  noteCard: {
    marginTop: theme.spacing.md,
    padding: theme.spacing.md,
  },
  noteLabel: {
    color: theme.colors.text,
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: theme.spacing.xs,
  },
  textInput: {
    color: theme.colors.text,
    fontSize: 14,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 12,
    backgroundColor: theme.colors.background,
    padding: theme.spacing.sm,
    height: 72,
    textAlignVertical: 'top',
  },
  charCount: {
    color: theme.colors.textSecondary,
    fontSize: 10,
    alignSelf: 'flex-end',
    marginTop: 4,
  },
  warningContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 59, 48, 0.1)',
    borderRadius: 12,
    padding: theme.spacing.md,
    marginTop: theme.spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 59, 48, 0.2)',
  },
  warningIcon: {
    marginRight: theme.spacing.sm,
  },
  warningText: {
    color: theme.colors.text,
    fontSize: 12,
    flex: 1,
    lineHeight: 16,
  },
  actionsContainer: {
    marginTop: theme.spacing.lg,
    gap: theme.spacing.sm,
  },
  btnSave: {
    height: 48,
  },
  btnSkip: {
    height: 48,
  },
});
