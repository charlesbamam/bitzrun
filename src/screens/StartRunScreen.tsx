import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Alert, BackHandler, Modal, ScrollView, Dimensions, Vibration, Animated, Easing } from 'react-native';
import { X, Play, Pause, Square, Bell, Flame, Sparkles, Trophy } from 'lucide-react-native';
import { theme } from '../theme/theme';
import { ScreenContainer } from '../components/ScreenContainer';
import { AppCard } from '../components/AppCard';
import { AppButton } from '../components/AppButton';
import { MoodSelector } from '../components/MoodSelector';
import { AppHeader } from '../components/AppHeader';
import { BitzIcon } from '../components/BitzIcon';
import { useRunTrackerGPS } from '../hooks/useRunTrackerGPS';

const BEYOND_GOAL_MESSAGES = [
  "Você já venceu o treino. Agora está construindo confiança.",
  "Tudo agora é evolução além da meta.",
  "Você não precisava provar nada. Mesmo assim, escolheu continuar.",
  "Continue no seu ritmo. Você está indo além.",
  "Hoje você está reforçando o hábito."
];

export interface RunningNotification {
  id: string;
  time: string;
  message: string;
  isRead: boolean;
}

interface StartRunScreenProps {
  onCancel: () => void;
  onFinishRun: (durationSeconds: number, distanceKm: number, moodBefore: number, goalText: string, targetDistanceKm: number) => void;
}

export const StartRunScreen: React.FC<StartRunScreenProps> = ({ onCancel, onFinishRun }) => {
  // Controle de tela de preparação x tela de corrida ativa
  const [isSetupActive, setIsSetupActive] = useState<boolean>(true);
  
  // Dados de preparação
  const [moodBefore, setMoodBefore] = useState<number>(3); // 1 a 5, default 3 (Regular)
  const [selectedGoalOption, setSelectedGoalOption] = useState<string>('1 km');
  const [customGoalText, setCustomGoalText] = useState<string>('');
  const [targetKm, setTargetKm] = useState<number>(1.0);

  // Hook do GPS Real
  const {
    status: gpsStatus,
    distanceKm,
    durationSeconds,
    currentPace,
    gpsAccuracy,
    startTracking,
    pauseTracking,
    resumeTracking,
    stopTracking,
  } = useRunTrackerGPS();

  // Estados de Celebração e Modo Além da Meta
  const [hasCelebrated, setHasCelebrated] = useState<boolean>(false);
  const [showCelebrationModal, setShowCelebrationModal] = useState<boolean>(false);
  const [isBeyondGoalMode, setIsBeyondGoalMode] = useState<boolean>(false);
  const [beyondGoalMessage, setBeyondGoalMessage] = useState<string>('');

  // Estados de Notificações Motivacionais
  const [notifications, setNotifications] = useState<RunningNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [activeBanner, setActiveBanner] = useState<RunningNotification | null>(null);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  // Referências para triggers
  const secondsRef = useRef<number>(0);
  const distanceRef = useRef<number>(0);
  const triggeredAlertsRef = useRef<string[]>([]);
  const notificationsRef = useRef<RunningNotification[]>([]);
  const hasCelebratedRef = useRef<boolean>(false);

  // Sincronizar referências com os estados do GPS
  secondsRef.current = durationSeconds;
  distanceRef.current = distanceKm;

  // Impedir voltar via botão físico do Android durante a corrida
  useEffect(() => {
    const backAction = () => {
      if (!isSetupActive) {
        Alert.alert('Corrida em andamento', 'Deseja realmente abandonar a corrida?', [
          { text: 'Não', onPress: () => null, style: 'cancel' },
          { text: 'Sim, abandonar', onPress: () => {
              stopTracking();
              onCancel();
            }
          },
        ]);
        return true;
      }
      return false;
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();
  }, [isSetupActive]);

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

  // Triggers reativos baseados nos valores reais do GPS
  useEffect(() => {
    if (gpsStatus === 'running') {
      checkTimeTriggers(durationSeconds);
    }
  }, [durationSeconds, gpsStatus]);

  useEffect(() => {
    if (gpsStatus === 'running') {
      checkDistanceTriggers(distanceKm);
      
      // Celebração: quando atinge ou ultrapassa a meta e ainda não celebrou
      if (distanceKm >= targetKm && !hasCelebratedRef.current) {
        hasCelebratedRef.current = true;
        setHasCelebrated(true);
        setShowCelebrationModal(true);
        try {
          Vibration.vibrate([0, 150, 100, 400]);
        } catch (e) {
          console.log('Sem suporte a vibração:', e);
        }
      }
    }
  }, [distanceKm, gpsStatus, targetKm]);

  const handleStart = async () => {
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
    
    // Limpar estados de metas da corrida anterior
    setHasCelebrated(false);
    hasCelebratedRef.current = false;
    setShowCelebrationModal(false);
    setIsBeyondGoalMode(false);
    setBeyondGoalMessage('');

    // Iniciar o rastreamento GPS
    setIsSetupActive(false);
    await startTracking();
  };

  const handleContinueBeyond = () => {
    const randomMsg = BEYOND_GOAL_MESSAGES[Math.floor(Math.random() * BEYOND_GOAL_MESSAGES.length)];
    setBeyondGoalMessage(randomMsg);
    setIsBeyondGoalMode(true);
    setShowCelebrationModal(false);
  };

  const handlePauseToggle = () => {
    if (gpsStatus === 'running') {
      pauseTracking();
    } else if (gpsStatus === 'paused') {
      resumeTracking();
    }
  };

  const handleEndPress = () => {
    if (durationSeconds < 5) {
      Alert.alert(
        'Treino muito curto',
        'Sua corrida durou menos de 5 segundos. Deseja realmente abandonar?',
        [
          { text: 'Continuar correndo', style: 'cancel' },
          { text: 'Abandonar', onPress: () => {
              stopTracking();
              onCancel();
            }
          }
        ]
      );
      return;
    }

    const goalLabel = `${targetKm.toFixed(1).replace('.', ',')} km`;
    stopTracking();
    onFinishRun(durationSeconds, parseFloat(distanceKm.toFixed(2)), moodBefore, goalLabel, targetKm);
  };

  const formatTime = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${pad(mins)}:${pad(secs)}`;
  };

  const getProgressRatio = () => {
    if (targetKm <= 0) return 0;
    return Math.min(distanceKm / targetKm, 1);
  };

  const getGpsStatusLabel = () => {
    switch (gpsStatus) {
      case 'permissions_pending':
        return 'PERMISSÃO';
      case 'searching':
        return 'BUSCANDO GPS';
      case 'running':
        return 'CORRENDO';
      case 'paused':
        return 'PAUSADO';
      case 'denied':
        return 'PERMISSÃO NEGADA';
      case 'unavailable':
        return 'SEM SINAL GPS';
      default:
        return 'INICIANDO';
    }
  };

  const getGpsStatusColor = () => {
    switch (gpsStatus) {
      case 'permissions_pending':
      case 'searching':
        return '#FFA500';
      case 'running':
        return theme.colors.primary;
      case 'paused':
        return theme.colors.textSecondary;
      case 'denied':
      case 'unavailable':
        return theme.colors.error;
      default:
        return theme.colors.textSecondary;
    }
  };

  if (isSetupActive) {
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

  const scaleAnim = useRef(new Animated.Value(0.3)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (showCelebrationModal) {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 40,
          friction: 6,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 350,
          useNativeDriver: true,
        })
      ]).start();
    } else {
      scaleAnim.setValue(0.3);
      opacityAnim.setValue(0);
    }
  }, [showCelebrationModal]);

  const getExtraDistanceText = () => {
    const extra = distanceKm - targetKm;
    if (extra <= 0) return '+0 m';
    if (extra < 1.0) {
      const meters = Math.round(extra * 1000);
      return `+${meters} m`;
    } else {
      return `+${extra.toFixed(1).replace('.', ',')} km`;
    }
  };

  // Tela de Corrida Ativa (Running / Paused)
  return (
    <ScreenContainer style={styles.activeContainer}>
      {/* Indicador de Status */}
      <View style={styles.activeHeaderContainer}>
        <View style={[
          styles.statusIndicator,
          { borderColor: getGpsStatusColor() }
        ]}>
          <Text style={[
            styles.statusText,
            { color: getGpsStatusColor() }
          ]}>
            {getGpsStatusLabel()}
          </Text>
        </View>

        {/* Notificações no Header */}
        <TouchableOpacity 
          style={styles.notificationHeaderBtn} 
          onPress={handleOpenNotifications}
          activeOpacity={0.7}
        >
          <BitzIcon icon={Bell} size={20} color={theme.colors.text} />
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
        <Text style={styles.timerValue}>{formatTime(durationSeconds)}</Text>
        <Text style={styles.timerLabel}>Tempo acumulado</Text>

        {/* Métricas reais (Distância + Ritmo Lado a Lado) */}
        <View style={styles.metricsRow}>
          <View style={styles.metricBlock}>
            <Text style={styles.metricValue}>{distanceKm.toFixed(2).replace('.', ',')}</Text>
            <Text style={styles.metricLabel}>{isBeyondGoalMode ? 'Progresso Total (km)' : 'Distância real (km)'}</Text>
          </View>
          
          <View style={styles.divider} />

          <View style={styles.metricBlock}>
            <Text style={styles.metricValue}>{currentPace}</Text>
            <Text style={styles.metricLabel}>Ritmo médio (/km)</Text>
          </View>
        </View>

        {/* Barra de Progresso e Meta / Modo Além da Meta */}
        {isBeyondGoalMode ? (
          <View style={[styles.progressContainer, styles.beyondContainer]}>
            <View style={styles.beyondHeader}>
              <View style={styles.beyondBadge}>
                <Text style={styles.beyondTitle}>MODO ALÉM DA META</Text>
              </View>
              <Text style={styles.beyondTargetLabel}>Meta batida: {targetKm.toFixed(1).replace('.', ',')} km</Text>
            </View>
            <View style={styles.beyondMetersBlock}>
              <Text style={styles.beyondMetersText}>{getExtraDistanceText()}</Text>
              <Text style={styles.beyondMetersSubtext}>de evolução extra</Text>
            </View>
            {beyondGoalMessage ? (
              <Text style={styles.beyondQuoteText}>“{beyondGoalMessage}”</Text>
            ) : null}
          </View>
        ) : (
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
            
            {/* Informações reais da qualidade do sinal do GPS */}
            {gpsStatus === 'running' && gpsAccuracy !== null && (
              <Text style={styles.gpsAccuracyText}>
                Sinal do GPS ativo (precisão: {gpsAccuracy.toFixed(1)}m)
              </Text>
            )}
            {gpsStatus === 'searching' && (
              <Text style={styles.gpsAccuracyText}>
                Procurando sinal do GPS... Fique em céu aberto.
              </Text>
            )}
            {gpsStatus === 'denied' && (
              <Text style={[styles.gpsAccuracyText, { color: theme.colors.error }]}>
                Permissão de GPS negada. Ative nas configurações do iPhone.
              </Text>
            )}
            {gpsStatus === 'unavailable' && (
              <Text style={[styles.gpsAccuracyText, { color: theme.colors.error }]}>
                GPS indisponível. Verifique se a localização está ativa.
              </Text>
            )}
          </View>
        )}
      </View>

      {/* Rodapé com Ações */}
      <View style={styles.activeFooter}>
        <View style={styles.activeActionsRow}>
          {gpsStatus === 'running' ? (
            <TouchableOpacity
              style={[styles.actionRoundButton, styles.pauseButton]}
              onPress={handlePauseToggle}
              activeOpacity={0.8}
            >
              <BitzIcon icon={Pause} size={24} color={theme.colors.text} />
            </TouchableOpacity>
          ) : (
            // Exibir Play se estiver pausado ou buscando sinal, permitindo re-iniciar se necessário
            <TouchableOpacity
              style={[styles.actionRoundButton, styles.playButtonActive]}
              onPress={handlePauseToggle}
              activeOpacity={0.8}
              disabled={gpsStatus === 'denied' || gpsStatus === 'unavailable'}
            >
              <BitzIcon icon={Play} size={24} color={theme.colors.background} fill={theme.colors.background} />
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={[styles.actionRoundButton, styles.stopButton]}
            onPress={handleEndPress}
            activeOpacity={0.8}
          >
            <BitzIcon icon={Square} size={20} color={theme.colors.error} fill={theme.colors.error} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Modal de Celebração de Meta Alcançada */}
      <Modal visible={showCelebrationModal} animationType="fade" transparent>
        <View style={styles.celebrationOverlay}>
          <Animated.View style={[
            styles.celebrationBox,
            {
              transform: [{ scale: scaleAnim }],
              opacity: opacityAnim
            }
          ]}>
            <View style={styles.celebrationIconContainer}>
              <BitzIcon icon={Trophy} size={42} color={theme.colors.primary} />
            </View>
            
            <Text style={styles.celebrationTitle}>Meta alcançada!</Text>
            
            <Text style={styles.celebrationSubtitle}>
              Você cumpriu o combinado de hoje. Agora, tudo que vier é evolução.
            </Text>

            <View style={styles.celebrationActions}>
              <AppButton
                title="Continuar e ir além"
                onPress={handleContinueBeyond}
                variant="primary"
                style={styles.celebrationBtn}
              />
              <TouchableOpacity
                style={styles.celebrationSecondaryBtn}
                onPress={handleEndPress}
                activeOpacity={0.7}
              >
                <Text style={styles.celebrationSecondaryText}>Finalizar corrida</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </Modal>

      {/* Modal de Notificações */}
      <Modal visible={isModalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Mensagens Motivacionais</Text>
              <TouchableOpacity onPress={() => setIsModalVisible(false)} style={styles.modalCloseBtn}>
                <BitzIcon icon={X} size={20} color={theme.colors.text} />
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
  metricsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '100%',
    marginVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.xl,
  },
  metricBlock: {
    alignItems: 'center',
    flex: 1,
  },
  metricValue: {
    color: theme.colors.text,
    fontSize: 28,
    fontWeight: 'bold',
  },
  metricLabel: {
    color: theme.colors.textSecondary,
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: 4,
    textAlign: 'center',
  },
  divider: {
    width: 1,
    height: 36,
    backgroundColor: theme.colors.border,
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
  gpsAccuracyText: {
    color: theme.colors.textSecondary,
    fontSize: 10,
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
  distanceBlockBeyond: {
    borderColor: theme.colors.primary,
    borderWidth: 1.5,
    borderRadius: theme.borderRadius.lg,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.xl,
    backgroundColor: 'rgba(204, 255, 0, 0.05)',
  },
  beyondContainer: {
    backgroundColor: '#161616',
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: '#262626',
    alignItems: 'center',
  },
  beyondHeader: {
    alignItems: 'center',
    gap: 4,
    marginBottom: theme.spacing.sm,
  },
  beyondBadge: {
    backgroundColor: 'rgba(204, 255, 0, 0.15)',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  beyondTitle: {
    color: theme.colors.primary,
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  beyondTargetLabel: {
    color: theme.colors.textSecondary,
    fontSize: 12,
  },
  beyondMetersBlock: {
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  beyondMetersText: {
    color: theme.colors.primary,
    fontSize: 28,
    fontWeight: 'bold',
  },
  beyondMetersSubtext: {
    color: theme.colors.textSecondary,
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  beyondQuoteText: {
    color: theme.colors.text,
    fontSize: 12,
    fontStyle: 'italic',
    textAlign: 'center',
    paddingHorizontal: theme.spacing.sm,
    lineHeight: 16,
  },
  celebrationOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  celebrationBox: {
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.xl,
    width: '100%',
    maxWidth: 340,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: theme.colors.primary,
  },
  celebrationIconContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(204, 255, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },
  celebrationTitle: {
    color: theme.colors.text,
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: theme.spacing.xs,
  },
  celebrationSubtitle: {
    color: theme.colors.textSecondary,
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: theme.spacing.lg,
  },
  celebrationActions: {
    width: '100%',
    gap: theme.spacing.sm,
  },
  celebrationBtn: {
    width: '100%',
  },
  celebrationSecondaryBtn: {
    width: '100%',
    paddingVertical: 12,
    alignItems: 'center',
  },
  celebrationSecondaryText: {
    color: theme.colors.textSecondary,
    fontSize: 13,
    fontWeight: '600',
  },
});

const pad = (val: number) => val.toString().padStart(2, '0');
export default StartRunScreen;
