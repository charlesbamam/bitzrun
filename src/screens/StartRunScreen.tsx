import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Alert, BackHandler, Modal, ScrollView, Dimensions } from 'react-native';
import { X, Play, Pause, Square, Bell, Flame } from 'lucide-react-native';
import { theme } from '../theme/theme';
import { ScreenContainer } from '../components/ScreenContainer';
import { AppCard } from '../components/AppCard';
import { AppButton } from '../components/AppButton';
import { MoodSelector } from '../components/MoodSelector';
import { AppHeader } from '../components/AppHeader';

export interface RunningNotification {
  id: string;
  time: string;
  message: string;
  isRead: boolean;
}

interface StartRunScreenProps {
  onCancel: () => void;
  onFinishRun: (durationSeconds: number, distanceKm: number, moodBefore: number, goalText: string) => void;
}

export const StartRunScreen: React.FC<StartRunScreenProps> = ({ onCancel, onFinishRun }) => {
  // Estado 1: Preparação ('setup') ou Corrida ('running') ou Pausado ('paused')
  const [status, setStatus] = useState<'setup' | 'running' | 'paused'>('setup');
  
  // Dados de preparação
  const [moodBefore, setMoodBefore] = useState<number>(3); // 1 a 5, default 3 (Regular)
  const [selectedGoalOption, setSelectedGoalOption] = useState<string>('1 km');
  const [customGoalText, setCustomGoalText] = useState<string>('');
  const [targetKm, setTargetKm] = useState<number>(1.0);

  // Dados de corrida
  const [seconds, setSeconds] = useState<number>(0);
  const [distance, setDistance] = useState<number>(0);

  // Estados de Notificações Motivacionais
  const [notifications, setNotifications] = useState<RunningNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [activeBanner, setActiveBanner] = useState<RunningNotification | null>(null);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  // Referências para evitar problemas de closure no setInterval
  const timerRef = useRef<any>(null);
  const secondsRef = useRef<number>(0);
  const distanceRef = useRef<number>(0);
  const triggeredAlertsRef = useRef<string[]>([]);
  const notificationsRef = useRef<RunningNotification[]>([]);

  // Sincronizar referências com os estados
  secondsRef.current = seconds;
  distanceRef.current = distance;

  // Impedir voltar via botão físico do Android durante a corrida
  useEffect(() => {
    const backAction = () => {
      if (status !== 'setup') {
        Alert.alert('Corrida em andamento', 'Deseja realmente abandonar a corrida?', [
          { text: 'Não', onPress: () => null, style: 'cancel' },
          { text: 'Sim, abandonar', onPress: () => onCancel() },
        ]);
        return true;
      }
      return false;
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();
  }, [status]);

  // Dispara uma notificação motivacional
  const triggerMotivationalAlert = (id: string, message: string) => {
    if (triggeredAlertsRef.current.includes(id)) return;
    
    triggeredAlertsRef.current.push(id);
    
    const mins = Math.floor(secondsRef.current / 60);
    const secs = secondsRef.current % 60;
    const timeFormatted = `${pad(mins)}:${pad(secs)}`;
    
    const newNotification: RunningNotification = {
      id: Math.random().toString(),
      time: timeFormatted,
      message,
      isRead: false,
    };
    
    const updated = [newNotification, ...notificationsRef.current];
    notificationsRef.current = updated;
    setNotifications(updated);
    setUnreadCount(prev => prev + 1);
    
    // Exibir banner temporário
    setActiveBanner(newNotification);
    setTimeout(() => {
      setActiveBanner(current => (current?.id === newNotification.id ? null : current));
    }, 4000);
  };

  const checkTimeTriggers = (secs: number) => {
    if (secs === 10) {
      triggerMotivationalAlert('time_10s', 'Muito bem! Não pare agora.');
    } else if (secs === 30) {
      triggerMotivationalAlert('time_30s', 'Vai em frente, tá quase lá!');
    } else if (secs === 60) {
      triggerMotivationalAlert('time_60s', 'Você está no caminho certo! Consistência é o seu foco.');
    }
  };

  const checkDistanceTriggers = (dist: number) => {
    if (dist >= 1.0) {
      triggerMotivationalAlert('dist_1km', 'Que legal, você já passou de 1km!');
    }
    if (dist >= 2.0) {
      triggerMotivationalAlert('dist_2km', 'Excelente! Você já completou 2km!');
    }
    if (dist >= 5.0) {
      triggerMotivationalAlert('dist_5km', 'Incrível! 5km completados. Você é consistente!');
    }
  };

  const handleOpenNotifications = () => {
    setIsModalVisible(true);
    setUnreadCount(0);
    const updated = notifications.map(n => ({ ...n, isRead: true }));
    setNotifications(updated);
    notificationsRef.current = updated;
  };

  // Efeito do Cronômetro + Simulação de Distância + Alertas Motivacionais
  useEffect(() => {
    if (status === 'running') {
      timerRef.current = setInterval(() => {
        setSeconds(prev => {
          const nextSecs = prev + 1;
          checkTimeTriggers(nextSecs);
          return nextSecs;
        });
        
        const randomIncrement = 0.0022 + Math.random() * 0.0008;
        setDistance(prev => {
          const nextDist = prev + randomIncrement;
          checkDistanceTriggers(nextDist);
          return nextDist;
        });
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [status]);

  const handleStart = () => {
    let parsedKm = 1.0;

    if (selectedGoalOption === '0,5 km') {
      parsedKm = 0.5;
    } else if (selectedGoalOption === '1 km') {
      parsedKm = 1.0;
    } else if (selectedGoalOption === '2 km') {
      parsedKm = 2.0;
    } else if (selectedGoalOption === '3 km') {
      parsedKm = 3.0;
    } else if (selectedGoalOption === '5 km') {
      parsedKm = 5.0;
    } else if (selectedGoalOption === 'Personalizada') {
      const cleanInput = customGoalText.replace(',', '.').trim();
      const parsedValue = parseFloat(cleanInput);
      
      if (isNaN(parsedValue) || parsedValue <= 0 || parsedValue > 50) {
        Alert.alert(
          'Distância Inválida',
          'Informe uma distância válida para continuar.'
        );
        return;
      }
      parsedKm = parsedValue;
    }

    setTargetKm(parsedKm);
    setStatus('running');
    setSeconds(0);
    setDistance(0);
  };

  const handlePauseToggle = () => {
    setStatus(prev => (prev === 'running' ? 'paused' : 'running'));
  };

  const handleEndPress = () => {
    if (seconds < 5) {
      Alert.alert(
        'Treino muito curto',
        'Sua corrida durou menos de 5 segundos. Deseja realmente encerrar?',
        [
          { text: 'Continuar correndo', style: 'cancel' },
          { text: 'Encerrar', onPress: () => onCancel() }
        ]
      );
      return;
    }

    const goalLabel = `${targetKm.toFixed(1).replace('.', ',')} km`;
    onFinishRun(seconds, parseFloat(distance.toFixed(2)), moodBefore, goalLabel);
  };

  const formatTime = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${pad(mins)}:${pad(secs)}`;
  };

  const getProgressRatio = () => {
    if (targetKm <= 0) return 0;
    return Math.min(distance / targetKm, 1);
  };

  if (status === 'setup') {
    return (
      <ScreenContainer scrollable avoidKeyboard>
        <AppHeader title="Meta da corrida" onBack={onCancel} />

        <View style={styles.formContent}>
          <AppCard style={styles.setupCard}>
            <Text style={styles.questionText}>Como você está chegando hoje?</Text>
            <MoodSelector selectedMood={moodBefore} onSelect={setMoodBefore} />
          </AppCard>

          <AppCard style={styles.setupCard}>
            <Text style={styles.questionText}>Qual distância você quer tentar hoje?</Text>
            <Text style={styles.metaTipText}>
              Você escolhe uma distância-alvo. Nesta versão de teste, o app simula o avanço para validar o hábito e o fluxo.
            </Text>

            <View style={styles.quickGoalsRow}>
              {['0,5 km', '1 km', '2 km', '3 km', '5 km', 'Personalizada'].map((option) => {
                const isSelected = selectedGoalOption === option;
                return (
                  <TouchableOpacity
                    key={option}
                    style={[
                      styles.quickGoalCard,
                      isSelected && styles.quickGoalCardSelected
                    ]}
                    onPress={() => setSelectedGoalOption(option)}
                    activeOpacity={0.7}
                  >
                    <Text style={[
                      styles.quickGoalText,
                      isSelected && styles.quickGoalTextSelected
                    ]}>
                      {option}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {selectedGoalOption === 'Personalizada' && (
              <View style={styles.inputContainer}>
                <Text style={styles.subLabel}>Defina a distância em km</Text>
                <TextInput
                  style={styles.customInput}
                  placeholder="Ex: 1,5 ou 4.2"
                  placeholderTextColor="#666666"
                  keyboardType="numeric"
                  value={customGoalText}
                  onChangeText={setCustomGoalText}
                  maxLength={6}
                  autoCorrect={false}
                />
              </View>
            )}
          </AppCard>

          <Text style={styles.motivationText}>
            Escolha uma meta leve. O objetivo é manter o hábito vivo.
          </Text>

          <AppButton
            title="Começar corrida"
            onPress={handleStart}
            variant="primary"
            style={styles.startButton}
          />
        </View>
      </ScreenContainer>
    );
  }

  const progressRatio = getProgressRatio();

  // Tela de Corrida Ativa (Running / Paused)
  return (
    <ScreenContainer style={styles.activeContainer}>
      {/* Indicador de Status */}
      <View style={styles.activeHeaderContainer}>
        <View style={[
          styles.statusIndicator,
          { borderColor: status === 'running' ? theme.colors.primary : theme.colors.textSecondary }
        ]}>
          <Text style={[
            styles.statusText,
            { color: status === 'running' ? theme.colors.primary : theme.colors.textSecondary }
          ]}>
            {status === 'running' ? 'CORRENDO' : 'PAUSADO'}
          </Text>
        </View>

        {/* Notificações no Header */}
        <TouchableOpacity 
          style={styles.notificationHeaderBtn} 
          onPress={handleOpenNotifications}
          activeOpacity={0.7}
        >
          <Bell size={20} color={theme.colors.text} />
          {unreadCount > 0 && <View style={styles.badge} />}
        </TouchableOpacity>
      </View>

      {/* Banner de Notificação Ativa */}
      {activeBanner && (
        <View style={styles.notificationBanner}>
          <Text style={styles.bannerText}>{activeBanner.message}</Text>
        </View>
      )}

      {/* Visores Principais */}
      <View style={styles.dashboardContainer}>
        <Text style={styles.timerValue}>{formatTime(seconds)}</Text>
        <Text style={styles.timerLabel}>Tempo acumulado</Text>

        <View style={styles.distanceBlock}>
          <Text style={styles.distanceValue}>{distance.toFixed(2).replace('.', ',')} km</Text>
          <Text style={styles.distanceLabel}>Distância simulada</Text>
        </View>

        {/* Barra de Progresso e Meta */}
        <View style={styles.progressContainer}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressLabel}>Progresso da Meta</Text>
            <Text style={styles.progressMetaValue}>
              Meta: {targetKm.toFixed(1).replace('.', ',')} km
            </Text>
          </View>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: `${progressRatio * 100}%` }]} />
          </View>
          <Text style={styles.simulationText}>Simulação de treino ativa localmente</Text>
        </View>
      </View>

      {/* Rodapé com Ações */}
      <View style={styles.activeFooter}>
        <View style={styles.activeActionsRow}>
          {status === 'running' ? (
            <TouchableOpacity
              style={[styles.actionRoundButton, styles.pauseButton]}
              onPress={handlePauseToggle}
              activeOpacity={0.8}
            >
              <Pause size={24} color={theme.colors.text} />
            </TouchableOpacity>
          ) : (
            // Alto contraste para o botão Play/Continuar quando pausado (Verde-limão)
            <TouchableOpacity
              style={[styles.actionRoundButton, styles.playButtonActive]}
              onPress={handlePauseToggle}
              activeOpacity={0.8}
            >
              <Play size={24} color={theme.colors.background} fill={theme.colors.background} />
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={[styles.actionRoundButton, styles.stopButton]}
            onPress={handleEndPress}
            activeOpacity={0.8}
          >
            <Square size={20} color={theme.colors.error} fill={theme.colors.error} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Modal de Notificações */}
      <Modal visible={isModalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Mensagens Motivacionais</Text>
              <TouchableOpacity onPress={() => setIsModalVisible(false)} style={styles.modalCloseBtn}>
                <X size={20} color={theme.colors.text} />
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.modalList} showsVerticalScrollIndicator={false}>
              {notifications.length === 0 ? (
                <Text style={styles.noNotificationsText}>Nenhuma mensagem recebida ainda.</Text>
              ) : (
                notifications.map((n) => (
                  <View key={n.id} style={styles.notificationItem}>
                    <Text style={styles.notificationTime}>{n.time}</Text>
                    <Text style={styles.notificationMessage}>{n.message}</Text>
                  </View>
                ))
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: theme.spacing.lg,
  },
  formContent: {
    gap: theme.spacing.md,
    paddingBottom: theme.spacing.xl,
  },
  setupCard: {
    padding: theme.spacing.lg,
  },
  questionText: {
    color: theme.colors.text,
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: theme.spacing.xs,
  },
  metaTipText: {
    color: theme.colors.textSecondary,
    fontSize: 11,
    lineHeight: 16,
    marginBottom: theme.spacing.md,
  },
  label: {
    color: theme.colors.text,
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: theme.spacing.sm,
  },
  quickGoalsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  quickGoalCard: {
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  quickGoalCardSelected: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  quickGoalText: {
    color: theme.colors.textSecondary,
    fontSize: 12,
    fontWeight: '600',
  },
  quickGoalTextSelected: {
    color: theme.colors.background,
    fontWeight: 'bold',
  },
  inputContainer: {
    marginTop: theme.spacing.xs,
  },
  subLabel: {
    color: theme.colors.textSecondary,
    fontSize: 11,
    fontWeight: '600',
    marginBottom: theme.spacing.xs,
  },
  customInput: {
    backgroundColor: theme.colors.background,
    borderColor: theme.colors.border,
    borderWidth: 1,
    borderRadius: theme.borderRadius.md,
    height: 48,
    paddingHorizontal: theme.spacing.md,
    color: theme.colors.text,
    fontSize: 14,
  },
  motivationText: {
    color: theme.colors.textSecondary,
    fontSize: 13,
    fontStyle: 'italic',
    textAlign: 'center',
    marginVertical: theme.spacing.sm,
  },
  startButton: {
    marginTop: theme.spacing.sm,
  },
  // Active Run styles
  activeContainer: {
    justifyContent: 'space-between',
    paddingBottom: theme.spacing.xxl,
  },
  activeHeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.md,
    marginTop: theme.spacing.sm,
  },
  statusIndicator: {
    borderWidth: 1.5,
    borderRadius: 20,
    paddingVertical: 4,
    paddingHorizontal: 12,
    alignSelf: 'center',
  },
  statusText: {
    fontSize: 11,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  notificationHeaderBtn: {
    padding: 6,
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.primary,
  },
  notificationBanner: {
    position: 'absolute',
    top: 90,
    left: theme.spacing.md,
    right: theme.spacing.md,
    backgroundColor: theme.colors.cardSecondary,
    borderColor: theme.colors.primary,
    borderWidth: 1,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    zIndex: 99,
  },
  bannerText: {
    color: theme.colors.text,
    fontSize: 13,
    textAlign: 'center',
    fontWeight: '600',
  },
  dashboardContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    gap: theme.spacing.lg,
  },
  timerValue: {
    color: theme.colors.text,
    fontSize: 64,
    fontWeight: 'bold',
    letterSpacing: -1,
  },
  timerLabel: {
    color: theme.colors.textSecondary,
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: -theme.spacing.sm,
  },
  distanceBlock: {
    alignItems: 'center',
    marginVertical: theme.spacing.sm,
  },
  distanceValue: {
    color: theme.colors.text,
    fontSize: 32,
    fontWeight: 'bold',
  },
  distanceLabel: {
    color: theme.colors.textSecondary,
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  progressContainer: {
    width: '100%',
    paddingHorizontal: theme.spacing.lg,
    marginTop: theme.spacing.md,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  progressLabel: {
    color: theme.colors.textSecondary,
    fontSize: 11,
    fontWeight: '500',
  },
  progressMetaValue: {
    color: theme.colors.primary,
    fontSize: 11,
    fontWeight: 'bold',
  },
  progressBarBg: {
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.border,
    width: '100%',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: theme.colors.primary,
    borderRadius: 4,
  },
  simulationText: {
    color: theme.colors.textSecondary,
    fontSize: 9,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 8,
  },
  activeFooter: {
    width: '100%',
    alignItems: 'center',
  },
  activeActionsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: theme.spacing.xl,
  },
  actionRoundButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pauseButton: {
    backgroundColor: theme.colors.card,
    borderWidth: 1.5,
    borderColor: theme.colors.border,
  },
  playButtonActive: {
    backgroundColor: theme.colors.primary,
    ...theme.shadows.medium,
  },
  stopButton: {
    backgroundColor: theme.colors.card,
    borderWidth: 1.5,
    borderColor: theme.colors.border,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: theme.colors.backgroundSecondary,
    borderTopLeftRadius: theme.borderRadius.xl,
    borderTopRightRadius: theme.borderRadius.xl,
    padding: theme.spacing.lg,
    maxHeight: Dimensions.get('window').height * 0.7,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: theme.colors.border,
    paddingBottom: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  modalTitle: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalCloseBtn: {
    padding: 4,
  },
  modalList: {
    gap: theme.spacing.sm,
    paddingBottom: theme.spacing.xl,
  },
  noNotificationsText: {
    color: theme.colors.textSecondary,
    fontSize: 13,
    textAlign: 'center',
    marginTop: theme.spacing.xl,
  },
  notificationItem: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  notificationTime: {
    color: theme.colors.primary,
    fontSize: 11,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  notificationMessage: {
    color: theme.colors.text,
    fontSize: 13,
  },
});

const pad = (val: number) => val.toString().padStart(2, '0');
export default StartRunScreen;
