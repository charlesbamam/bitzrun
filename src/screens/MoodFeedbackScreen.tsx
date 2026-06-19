import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { CheckCircle2, ChevronRight, Award, Bookmark, AlertTriangle } from 'lucide-react-native';
import { StorageService, Achievement, MemoryCard as MemoryCardType, STOP_REASON_LABELS } from '../services/storage';
import { theme } from '../theme/theme';
import { ScreenContainer } from '../components/ScreenContainer';
import { AppCard } from '../components/AppCard';
import { AppButton } from '../components/AppButton';
import { MoodSelector } from '../components/MoodSelector';
import { MemoryCard } from '../components/MemoryCard';
import { AchievementCard } from '../components/AchievementCard';
import { AppHeader } from '../components/AppHeader';

interface MoodFeedbackScreenProps {
  moodBefore: number;
  distanceKm: number;
  durationSeconds: number;
  onComplete: (unlockedAchievements: Achievement[], unlockedMemoryCards: MemoryCardType[]) => void;
  stoppedBeforeGoal?: boolean;
  stopReasons?: string[];
  stopNote?: string;
  targetDistanceKm?: number;
}

const REASONS_LIST = [
  'knee_pain', 'back_pain', 'foot_pain', 'shin_pain', 'ankle_pain',
  'cramps', 'muscle_pain', 'out_of_breath', 'strong_tiredness',
  'felt_bad', 'dizziness', 'heat', 'no_motivation', 'anxiety',
  'no_time', 'pace_too_hard', 'goal_too_high', 'distraction', 'other'
];

export const MoodFeedbackScreen: React.FC<MoodFeedbackScreenProps> = ({
  moodBefore,
  distanceKm,
  durationSeconds,
  onComplete,
  stoppedBeforeGoal,
  stopReasons,
  stopNote,
  targetDistanceKm,
}) => {
  const [moodAfter, setMoodAfter] = useState<number>(3); // Default 3 (Regular)
  const [notes, setNotes] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  
  const [selectedReasons, setSelectedReasons] = useState<string[]>([]);
  const [localStopNote, setLocalStopNote] = useState<string>('');

  const [newAchievements, setNewAchievements] = useState<Achievement[]>([]);
  const [newMemoryCards, setNewMemoryCards] = useState<MemoryCardType[]>([]);

  const toggleReason = (id: string) => {
    setSelectedReasons(prev =>
      prev.includes(id) ? prev.filter(r => r !== id) : [...prev, id]
    );
  };

  const showHealthWarning = selectedReasons.includes('felt_bad') || selectedReasons.includes('dizziness');

  const handleSave = async () => {
    setIsLoading(true);
    
    // Configurar dados de parada com base em stoppedBeforeGoal
    const finalStoppedBeforeGoal = !!stoppedBeforeGoal;
    const finalStopReasons = finalStoppedBeforeGoal ? selectedReasons : [];
    const finalStopNote = finalStoppedBeforeGoal ? (localStopNote.trim() || undefined) : undefined;

    try {
      const result = await StorageService.saveRun({
        distance: distanceKm,
        duration: durationSeconds,
        moodBefore: moodBefore,
        moodAfter: moodAfter,
        notes: notes.trim() || undefined,
        stoppedBeforeGoal: finalStoppedBeforeGoal,
        stopReasons: finalStopReasons,
        stopNote: finalStopNote,
        targetDistanceKm,
      });

      setNewAchievements(result.newAchievements);
      setNewMemoryCards(result.newMemoryCards);
      setIsLoading(false);
      setIsSuccess(true);
    } catch (error) {
      setIsLoading(false);
      alert('Erro ao salvar treino.');
    }
  };

  const handleFinish = () => {
    onComplete(newAchievements, newMemoryCards);
  };

  if (isSuccess) {
    return (
      <ScreenContainer scrollable style={styles.container}>
        <View style={styles.successHeader}>
          <View style={styles.successIconCircle}>
            <CheckCircle2 size={36} color={theme.colors.primary} strokeWidth={1.5} />
          </View>
          <Text style={styles.successTitle}>Registro concluído</Text>
          <Text style={styles.successSubtitle}>Você manteve o hábito vivo.</Text>
        </View>

        <View style={styles.successContent}>
          {/* Cartões de Memória Gerados */}
          {newMemoryCards.length > 0 ? (
            newMemoryCards.map(card => (
              <MemoryCard
                key={card.id}
                date={card.date}
                title="Corrida registrada"
                description={card.text}
                metrics={`${distanceKm.toFixed(2).replace('.', ',')} km em ${Math.round(durationSeconds / 60)} min`}
              />
            ))
          ) : (
            // Cartão de Memória Padrão solicitado nas especificações
            <MemoryCard
              date={new Date().toISOString()}
              title="Presença Registrada"
              description="Hoje você apareceu. Esse é o começo da consistência."
              metrics={`${distanceKm.toFixed(2).replace('.', ',')} km concluídos`}
            />
          )}

          {/* Conquistas Desbloqueadas */}
          {newAchievements.length > 0 && (
            <View style={styles.unlockedContainer}>
              <View style={styles.unlockedSectionTitleRow}>
                <Award size={16} color={theme.colors.primary} style={{ marginRight: 6 }} />
                <Text style={styles.unlockedTitle}>Marcos Desbloqueados ({newAchievements.length})</Text>
              </View>
              {newAchievements.map(ach => (
                <AchievementCard
                  key={ach.id}
                  title={ach.title}
                  description={ach.description}
                  isUnlocked={true}
                  unlockedDate={ach.date}
                />
              ))}
            </View>
          )}
        </View>

        <View style={styles.successFooter}>
          <AppButton
            title="Voltar para o início"
            onPress={handleFinish}
            variant="primary"
            style={styles.finishBtn}
            icon={<ChevronRight size={18} color={theme.colors.background} strokeWidth={2.5} />}
          />
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer scrollable avoidKeyboard>
      <AppHeader title="Como se sente?" />

      <View style={styles.formContainer}>
        <AppCard style={styles.formCard}>
          <Text style={styles.questionText}>Como você está se sentindo agora?</Text>
          <Text style={styles.subTitleText}>Compare com antes da corrida. Isso também é progresso.</Text>
          <View style={{ marginTop: theme.spacing.md }}>
            <MoodSelector selectedMood={moodAfter} onSelect={setMoodAfter} />
          </View>
        </AppCard>

        <AppCard style={styles.formCard}>
          <Text style={styles.label}>Alguma nota sobre hoje?</Text>
          <TextInput
            style={styles.input}
            multiline
            numberOfLines={3}
            placeholder="Ex: Superei a preguiça inicial. Pernas leves. (máx. 200 caracteres)"
            placeholderTextColor="#666666"
            value={notes}
            onChangeText={setNotes}
            maxLength={200}
            autoCorrect={false}
          />
          <Text style={styles.charCounter}>{notes.length}/200</Text>
        </AppCard>

        {/* Seção Secundária Opcional: apenas se goalAchieved === false / stoppedBeforeGoal === true */}
        {!!stoppedBeforeGoal && (
          <AppCard style={styles.formCard}>
            <Text style={styles.sectionTitle}>Algo dificultou chegar até a meta?</Text>
            <Text style={styles.sectionSubtitle}>
              Se quiser, registre o que atrapalhou hoje. Isso ajuda a entender seus padrões.
            </Text>

            <View style={styles.pillsContainer}>
              {REASONS_LIST.map(reasonId => {
                const isSelected = selectedReasons.includes(reasonId);
                const label = STOP_REASON_LABELS[reasonId] || reasonId;
                return (
                  <TouchableOpacity
                    key={reasonId}
                    style={[
                      styles.pill,
                      isSelected && styles.pillSelected
                    ]}
                    onPress={() => toggleReason(reasonId)}
                    activeOpacity={0.7}
                  >
                    <Text style={[
                      styles.pillText,
                      isSelected && styles.pillTextSelected
                    ]}>
                      {label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <Text style={[styles.label, { marginTop: theme.spacing.sm }]}>
              Quer explicar em poucas palavras?
            </Text>
            <TextInput
              style={styles.input}
              multiline
              numberOfLines={3}
              placeholder="Ex: senti dor no joelho depois de alguns minutos"
              placeholderTextColor="#666666"
              value={localStopNote}
              onChangeText={setLocalStopNote}
              maxLength={200}
              autoCorrect={false}
            />
            <Text style={styles.charCounter}>{localStopNote.length}/200</Text>

            {/* Aviso Preventivo de Saúde */}
            {showHealthWarning && (
              <View style={styles.warningContainer}>
                <AlertTriangle size={16} color={theme.colors.error} style={styles.warningIcon} />
                <Text style={styles.warningText}>
                  Se o desconforto for forte ou persistente, pare e procure orientação profissional.
                </Text>
              </View>
            )}
          </AppCard>
        )}

        <AppButton
          title="Salvar e concluir"
          onPress={handleSave}
          loading={isLoading}
          variant="primary"
          style={styles.saveBtn}
        />
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-between',
    paddingBottom: theme.spacing.lg,
  },
  formContainer: {
    gap: theme.spacing.md,
    paddingBottom: theme.spacing.xl,
  },
  formCard: {
    padding: theme.spacing.lg,
  },
  questionText: {
    color: theme.colors.text,
    fontSize: 15,
    fontWeight: 'bold',
  },
  subTitleText: {
    color: theme.colors.textSecondary,
    fontSize: 13,
    marginTop: 2,
    fontWeight: '500',
  },
  sectionTitle: {
    color: theme.colors.text,
    fontSize: 15,
    fontWeight: 'bold',
    marginTop: theme.spacing.xs,
  },
  sectionSubtitle: {
    color: theme.colors.textSecondary,
    fontSize: 12,
    lineHeight: 18,
    marginTop: 2,
    marginBottom: theme.spacing.md,
  },
  pillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: theme.spacing.md,
  },
  pill: {
    backgroundColor: theme.colors.card,
    borderRadius: 16,
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
  warningContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 59, 48, 0.1)',
    borderRadius: 12,
    padding: theme.spacing.md,
    marginTop: theme.spacing.sm,
    marginBottom: theme.spacing.md,
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
  label: {
    color: theme.colors.text,
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: theme.spacing.sm,
  },
  input: {
    backgroundColor: theme.colors.background,
    borderColor: theme.colors.border,
    borderWidth: 1,
    borderRadius: theme.borderRadius.md,
    height: 90,
    padding: theme.spacing.md,
    color: theme.colors.text,
    fontSize: 13,
    textAlignVertical: 'top',
  },
  charCounter: {
    color: theme.colors.textSecondary,
    fontSize: 11,
    textAlign: 'right',
    marginTop: 4,
    fontWeight: '600',
  },
  saveBtn: {
    marginTop: theme.spacing.sm,
  },

  // Success view styles
  successHeader: {
    alignItems: 'center',
    marginTop: theme.spacing.xl,
    paddingHorizontal: theme.spacing.md,
  },
  successIconCircle: {
    width: 64,
    height: 64,
    borderRadius: theme.borderRadius.round,
    backgroundColor: theme.colors.card,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
    borderWidth: 1.5,
    borderColor: theme.colors.primary,
  },
  successTitle: {
    color: theme.colors.text,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: theme.spacing.xs,
    textAlign: 'center',
  },
  successSubtitle: {
    color: theme.colors.textSecondary,
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '500',
  },
  successContent: {
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing.lg,
    gap: theme.spacing.md,
  },
  unlockedContainer: {
    marginTop: theme.spacing.sm,
  },
  unlockedSectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
    paddingLeft: theme.spacing.xs,
  },
  unlockedTitle: {
    color: theme.colors.text,
    fontSize: 13,
    fontWeight: 'bold',
  },
  successFooter: {
    width: '100%',
  },
  finishBtn: {
    width: '100%',
  },
});
