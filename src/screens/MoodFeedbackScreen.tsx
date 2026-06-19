import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, ActivityIndicator, ScrollView } from 'react-native';
import { Award, CheckCircle2, ChevronRight, MessageSquare, Smile } from 'lucide-react-native';
import { StorageService, getMoodEmoji, getMoodText, Achievement, MemoryCard } from '../services/storage';

interface MoodFeedbackScreenProps {
  moodBefore: number;
  distanceKm: number;
  durationSeconds: number;
  onComplete: (unlockedAchievements: Achievement[], unlockedMemoryCards: MemoryCard[]) => void;
}

export const MoodFeedbackScreen: React.FC<MoodFeedbackScreenProps> = ({
  moodBefore,
  distanceKm,
  durationSeconds,
  onComplete,
}) => {
  const [moodAfter, setMoodAfter] = useState<number>(3); // default neutro
  const [notes, setNotes] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  
  const [newAchievements, setNewAchievements] = useState<Achievement[]>([]);
  const [newMemoryCards, setNewMemoryCards] = useState<MemoryCard[]>([]);

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

  const moods = [1, 2, 3, 4, 5];

  if (isSuccess) {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.successContentContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.successIconContainer}>
          <CheckCircle2 size={64} color="#CCFF00" strokeWidth={1.5} />
        </View>

        <Text style={styles.successTitle}>Registro Concluído</Text>
        <Text style={styles.successSubtitle}>
          +1 corrida registrada. Sua consistência aumentou!
        </Text>

        {/* Exibição de Conquistas Desbloqueadas */}
        {newAchievements.length > 0 && (
          <View style={styles.unlockedSection}>
            <Text style={styles.sectionTitle}>
              <Award size={16} color="#CCFF00" strokeWidth={1.5} style={{ marginRight: 6 }} />
              Conquistas Desbloqueadas ({newAchievements.length})
            </Text>
            {newAchievements.map(ach => (
              <View key={ach.id} style={styles.achievementCard}>
                <View style={styles.achievementIconCircle}>
                  <Smile size={20} color="#CCFF00" strokeWidth={1.5} />
                </View>
                <View style={styles.achievementTextContainer}>
                  <Text style={styles.achievementTitleText}>{ach.title}</Text>
                  <Text style={styles.achievementDescText}>{ach.description}</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Exibição de Cartões de Memória Gerados */}
        {newMemoryCards.length > 0 && (
          <View style={styles.unlockedSection}>
            <Text style={styles.sectionTitle}>
              <MessageSquare size={16} color="#CCFF00" strokeWidth={1.5} style={{ marginRight: 6 }} />
              Novo Cartão de Memória
            </Text>
            {newMemoryCards.map(card => (
              <View key={card.id} style={styles.memoryCard}>
                <Text style={styles.memoryCardText}>{card.text}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Botão de Fechamento */}
        <TouchableOpacity style={styles.finishButton} onPress={handleFinish} activeOpacity={0.85}>
          <Text style={styles.finishButtonText}>VOLTAR PARA O INÍCIO</Text>
          <ChevronRight size={18} color="#000000" strokeWidth={2} />
        </TouchableOpacity>
      </ScrollView>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
      <View style={styles.formSection}>
        <Text style={styles.questionText}>Como você está se sentindo agora?</Text>
        
        {/* Seletor de Humor */}
        <View style={styles.moodSelector}>
          {moods.map(mood => {
            const isSelected = moodAfter === mood;
            return (
              <TouchableOpacity
                key={mood}
                style={[
                  styles.moodButton,
                  isSelected && styles.moodButtonSelected
                ]}
                onPress={() => setMoodAfter(mood)}
                activeOpacity={0.7}
              >
                <Text style={[styles.moodEmoji, isSelected && styles.moodEmojiSelected]}>
                  {getMoodEmoji(mood)}
                </Text>
                <Text style={[styles.moodLabel, isSelected && styles.moodLabelSelected]}>
                  {getMoodText(mood)}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Campo de Notas */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Alguma nota sobre hoje?</Text>
          <TextInput
            style={styles.input}
            multiline
            numberOfLines={3}
            placeholder="Como foi o treino? Algum obstáculo superado? (máx. 200 caracteres)"
            placeholderTextColor="#A0A0A0"
            value={notes}
            onChangeText={setNotes}
            maxLength={200}
          />
          <Text style={styles.charCount}>{notes.length}/200</Text>
        </View>
      </View>

      {/* Footer com Botão de Ação */}
      <View style={styles.footer}>
        <TouchableOpacity 
          style={[styles.ctaButton, isLoading && styles.ctaButtonDisabled]} 
          onPress={handleSave} 
          disabled={isLoading}
          activeOpacity={0.85}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#000000" />
          ) : (
            <Text style={styles.ctaButtonText}>SALVAR E CONCLUIR</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000', // Preto puro
  },
  contentContainer: {
    padding: 24,
    paddingTop: 80,
    justifyContent: 'space-between',
    minHeight: '85%',
  },
  successContentContainer: {
    padding: 24,
    paddingTop: 80,
    paddingBottom: 40,
    alignItems: 'center',
  },
  formSection: {
    flex: 1,
    justifyContent: 'center',
    marginVertical: 20,
  },
  questionText: {
    color: '#FFFFFF', // Branco de alto contraste
    fontSize: 22,
    fontWeight: '900', // Roboto Black
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 30,
    fontFamily: 'System',
  },
  moodSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 40,
  },
  moodButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 16,
    backgroundColor: '#1E1E1E', // Cinza escuro
    marginHorizontal: 4,
    borderWidth: 1.5,
    borderColor: '#262626',
  },
  moodButtonSelected: {
    borderColor: '#CCFF00', // Verde-limão ativo
    borderWidth: 2,
  },
  moodEmoji: {
    fontSize: 28,
    opacity: 0.6,
  },
  moodEmojiSelected: {
    opacity: 1,
    transform: [{ scale: 1.15 }],
  },
  moodLabel: {
    color: '#A0A0A0', // Cinza claro
    fontSize: 12,
    fontWeight: '300', // Roboto Light
    marginTop: 8,
  },
  moodLabelSelected: {
    color: '#CCFF00', // Verde-limão
    fontWeight: '900', // Roboto Black
  },
  inputContainer: {
    backgroundColor: '#1E1E1E', // Cinza escuro
    borderRadius: 16,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#262626',
  },
  label: {
    color: '#CCFF00', // Verde-limão
    fontSize: 12,
    fontWeight: '900', // Roboto Black
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  input: {
    color: '#FFFFFF', // Branco
    fontSize: 16,
    fontWeight: '300', // Roboto Light
    minHeight: 60,
    textAlignVertical: 'top',
  },
  charCount: {
    color: '#A0A0A0',
    fontSize: 11,
    textAlign: 'right',
    marginTop: 8,
  },
  footer: {
    marginTop: 40,
    width: '100%',
  },
  ctaButton: {
    backgroundColor: '#CCFF00', // Verde-limão
    borderRadius: 28,
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaButtonDisabled: {
    backgroundColor: 'rgba(204, 255, 0, 0.5)',
  },
  ctaButtonText: {
    color: '#000000', // Texto preto puro
    fontSize: 16,
    fontWeight: '900', // Roboto Black
    letterSpacing: 1.5,
    fontFamily: 'System',
  },
  // Estilos de Sucesso
  successIconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#1E1E1E',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 1.5,
    borderColor: '#CCFF00',
  },
  successTitle: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: '900', // Roboto Black
    textAlign: 'center',
    marginBottom: 8,
    fontFamily: 'System',
  },
  successSubtitle: {
    color: '#CCFF00', // Verde-limão
    fontSize: 16,
    fontWeight: '300', // Roboto Light
    textAlign: 'center',
    marginBottom: 40,
    paddingHorizontal: 24,
  },
  unlockedSection: {
    width: '100%',
    backgroundColor: '#1E1E1E', // Cinza escuro
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#262626',
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '900', // Roboto Black
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    letterSpacing: 0.5,
  },
  achievementCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#000000', // Fundo preto puro para contraste dentro do card
    padding: 12,
    borderRadius: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#262626',
  },
  achievementIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#1E1E1E',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  achievementTextContainer: {
    flex: 1,
  },
  achievementTitleText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '900', // Roboto Black
  },
  achievementDescText: {
    color: '#A0A0A0', // Roboto Light ou Regular
    fontSize: 11,
    fontWeight: '300',
    marginTop: 2,
  },
  memoryCard: {
    backgroundColor: '#000000',
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#262626',
    borderLeftWidth: 3.5,
    borderLeftColor: '#CCFF00', // Verde-limão
    marginBottom: 12,
  },
  memoryCardText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontStyle: 'italic',
    lineHeight: 18,
    fontWeight: '300',
  },
  finishButton: {
    backgroundColor: '#CCFF00', // Verde-limão
    borderRadius: 28,
    paddingVertical: 18,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  finishButtonText: {
    color: '#000000', // Texto preto puro
    fontSize: 16,
    fontWeight: '900', // Roboto Black
    letterSpacing: 1,
    marginRight: 8,
    fontFamily: 'System',
  },
});
