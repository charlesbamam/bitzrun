import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { CheckCircle2, ChevronRight, Award, Bookmark } from 'lucide-react-native';
import { StorageService, Achievement, MemoryCard as MemoryCardType } from '../services/storage';
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
}

export const MoodFeedbackScreen: React.FC<MoodFeedbackScreenProps> = ({
  moodBefore,
  distanceKm,
  durationSeconds,
  onComplete,
}) => {
  const [moodAfter, setMoodAfter] = useState<number>(3); // Default 3 (Regular)
  const [notes, setNotes] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  
  const [newAchievements, setNewAchievements] = useState<Achievement[]>([]);
  const [newMemoryCards, setNewMemoryCards] = useState<MemoryCardType[]>([]);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const result = await StorageService.saveRun({
        distance: distanceKm,
        duration: durationSeconds,
        moodBefore: moodBefore,
        moodAfter: moodAfter,
        notes: notes.trim() || undefined,
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
                title="Novo Cartão de Memória"
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
    <ScreenContainer scrollable>
      <AppHeader title="Como se sente?" />

      <View style={styles.formContainer}>
        <AppCard style={styles.formCard}>
          <Text style={styles.questionText}>Como você está se sentindo agora?</Text>
          <MoodSelector selectedMood={moodAfter} onSelect={setMoodAfter} />
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
    marginBottom: theme.spacing.md,
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
