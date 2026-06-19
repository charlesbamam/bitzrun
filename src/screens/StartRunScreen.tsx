import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Alert, BackHandler, Modal, ScrollView, Dimensions } from 'react-native';
import { X, Play, Pause, Square, Award, Bell } from 'lucide-react-native';
import { getMoodEmoji, getMoodText } from '../services/storage';

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
  const [moodBefore, setMoodBefore] = useState<number>(3); // 1 a 5, default 3 (Neutro)
  const [goal, setGoal] = useState<string>('');

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
    const timeFormatted = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    
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
    setStatus('running');
    setSeconds(0);
    setDistance(0);
  };

  const handlePauseToggle = () => {
    setStatus(prev => (prev === 'running' ? 'paused' : 'running'));
  };

  const handleEndRun = () => {
    if (seconds < 5) {
      Alert.alert(
        'Corrida muito curta',
        'Sua corrida durou menos de 5 segundos. Deseja encerrar mesmo assim?',
        [
          { text: 'Continuar correndo', style: 'cancel' },
          { text: 'Encerrar', onPress: () => onCancel() }
        ]
      );
      return;
    }

    // Encerrar e mandar os dados para a tela de conclusão
    onFinishRun(seconds, parseFloat(distance.toFixed(2)), moodBefore, goal.trim());
  };

  const formatTime = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const moods = [1, 2, 3, 4, 5];

  if (status === 'setup') {
    return (
      <View style={styles.container}>
        {/* Cabeçalho */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.closeButton} onPress={onCancel}>
            <X size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Preparar Corrida</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Formulário de Humor */}
        <ScrollView style={styles.formContainer} contentContainerStyle={styles.formContent} showsVerticalScrollIndicator={false}>
          <Text style={styles.questionText}>Como você está se sentindo antes de correr?</Text>
          
          <View style={styles.moodSelector}>
            {moods.map(mood => {
              const isSelected = moodBefore === mood;
              return (
                <TouchableOpacity
                  key={mood}
                  style={[
                    styles.moodButton,
                    isSelected && styles.moodButtonSelected
                  ]}
                  onPress={() => setMoodBefore(mood)}
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

          {/* Distâncias Rápidas */}
          <View style={styles.quickGoalsContainer}>
            <Text style={styles.label}>Metas de Distância Rápida</Text>
            <View style={styles.quickGoalsRow}>
              {['1 km', '2 km', '5 km', '10 km', '20 km'].map((quickGoal) => {
                const isSelected = goal === quickGoal;
                return (
                  <TouchableOpacity
                    key={quickGoal}
                    style={[
                      styles.quickGoalCard,
                      isSelected && styles.quickGoalCardSelected
                    ]}
                    onPress={() => setGoal(quickGoal)}
                    activeOpacity={0.7}
                  >
                    <Text style={[
                      styles.quickGoalText,
                      isSelected && styles.quickGoalTextSelected
                    ]}>
                      {quickGoal}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Campo de Meta Personalizada */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Meta personalizada (opcional)</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: 8 km ou 30 minutos"
              placeholderTextColor="#666666"
              value={goal}
              onChangeText={setGoal}
              maxLength={40}
            />
          </View>
        </ScrollView>

        {/* Botão de Começar */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.startButton} onPress={handleStart} activeOpacity={0.85}>
            <Text style={styles.startButtonText}>COMEÇAR</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // Tela de Corrida Ativa (Running / Paused)
  return (
    <View style={[styles.container, styles.activeContainer]}>
      {/* Indicador de Status & Ícone de Notificações */}
      <View style={styles.activeHeaderContainer}>
        {/* Placeholder para balanceamento do flexbox */}
        <View style={styles.headerSpacer} />
        
        {/* Status */}
        <View style={[styles.statusIndicator, { backgroundColor: '#1E1E1E', borderColor: status === 'running' ? '#CCFF00' : '#A0A0A0' }]}>
          <Text style={[styles.statusText, { color: status === 'running' ? '#CCFF00' : '#A0A0A0' }]}>
            {status === 'running' ? 'CORRENDO' : 'PAUSADO'}
          </Text>
        </View>

        {/* Ícone Sino de Notificação */}
        <TouchableOpacity 
          style={styles.notificationHeaderBtn} 
          onPress={handleOpenNotifications}
          activeOpacity={0.7}
        >
          <Bell size={22} color="#CCFF00" strokeWidth={1.5} />
          {unreadCount > 0 && (
            <View style={styles.notificationBadge}>
              <Text style={styles.badgeText}>{unreadCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Cronômetro e Distância em Destaque */}
      <View style={styles.metricsContainer}>
        {goal ? (
          <View style={styles.goalIndicator}>
            <Award size={16} color="#CCFF00" strokeWidth={1.5} />
            <Text style={styles.goalIndicatorText}>Meta: {goal}</Text>
          </View>
        ) : null}

        <Text style={styles.timerValue}>{formatTime(seconds)}</Text>
        <Text style={styles.timerLabel}>Tempo de Corrida</Text>

        <View style={styles.divider} />

        <Text style={styles.distanceValue}>{distance.toFixed(2).replace('.', ',')}</Text>
        <Text style={styles.distanceLabel}>Quilômetros (km)</Text>
      </View>

      {/* Controles de Ação na parte inferior */}
      <View style={styles.controlsFooter}>
        {/* Botão de Pausar / Retomar */}
        <TouchableOpacity 
          style={[styles.controlButton, styles.pauseButton]} 
          onPress={handlePauseToggle}
          activeOpacity={0.8}
        >
          {status === 'running' ? (
            <>
              <Pause size={20} color="#CCFF00" strokeWidth={1.5} />
              <Text style={[styles.controlButtonText, { color: '#CCFF00' }]}>Pausar</Text>
            </>
          ) : (
            <>
              <Play size={20} color="#CCFF00" strokeWidth={1.5} />
              <Text style={[styles.controlButtonText, { color: '#CCFF00' }]}>Retomar</Text>
            </>
          )}
        </TouchableOpacity>

        {/* Botão de Encerrar Corrida */}
        <TouchableOpacity 
          style={[styles.controlButton, styles.endButton]} 
          onPress={handleEndRun}
          activeOpacity={0.8}
        >
          <Square size={18} color="#000000" strokeWidth={1.5} />
          <Text style={[styles.controlButtonText, { color: '#000000' }]}>Encerrar</Text>
        </TouchableOpacity>
      </View>

      {/* Banner Flutuante de Notificação Motivacional */}
      {activeBanner && (
        <View style={styles.bannerContainer}>
          <View style={styles.bannerContent}>
            <View style={styles.bannerIconCircle}>
              <Bell size={16} color="#CCFF00" strokeWidth={1.5} />
            </View>
            <View style={styles.bannerTextContainer}>
              <Text style={styles.bannerTitle}>Bitzrun</Text>
              <Text style={styles.bannerMessage}>{activeBanner.message}</Text>
            </View>
          </View>
        </View>
      )}

      {/* Modal / Histórico de Notificações Motivacionais */}
      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Mensagens da Corrida</Text>
              <TouchableOpacity style={styles.modalCloseBtn} onPress={() => setIsModalVisible(false)}>
                <X size={20} color="#FFFFFF" strokeWidth={1.5} />
              </TouchableOpacity>
            </View>
            
            <ScrollView contentContainerStyle={styles.modalScrollContent} showsVerticalScrollIndicator={false}>
              {notifications.length === 0 ? (
                <View style={styles.emptyNotifications}>
                  <Text style={styles.emptyText}>Nenhuma mensagem recebida ainda.</Text>
                  <Text style={styles.emptySubtext}>As mensagens motivacionais surgirão conforme você avança.</Text>
                </View>
              ) : (
                notifications.map(item => (
                  <View key={item.id} style={styles.notificationItem}>
                    <View style={styles.notificationTimeBadge}>
                      <Text style={styles.notificationTimeText}>{item.time}</Text>
                    </View>
                    <Text style={styles.notificationItemText}>{item.message}</Text>
                  </View>
                ))
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    paddingTop: 50,
  },
  activeContainer: {
    justifyContent: 'space-between',
    paddingBottom: 60,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    height: 56,
  },
  closeButton: {
    padding: 8,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '900',
    fontFamily: 'System',
  },
  placeholder: {
    width: 40,
  },
  formContainer: {
    flex: 1,
  },
  formContent: {
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  questionText: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '300',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 30,
    fontFamily: 'System',
  },
  moodSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  moodButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 16,
    backgroundColor: '#1E1E1E',
    marginHorizontal: 4,
    borderWidth: 1.5,
    borderColor: '#262626',
  },
  moodButtonSelected: {
    backgroundColor: '#262626',
    borderColor: '#CCFF00',
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
    color: '#A0A0A0',
    fontSize: 12,
    fontWeight: '300',
    marginTop: 8,
  },
  moodLabelSelected: {
    color: '#CCFF00',
    fontWeight: '700',
  },
  inputContainer: {
    backgroundColor: '#1E1E1E',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#262626',
  },
  label: {
    color: '#A0A0A0',
    fontSize: 12,
    fontWeight: '300',
    marginBottom: 10,
    textTransform: 'uppercase',
  },
  input: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '300',
    paddingVertical: 4,
  },
  footer: {
    padding: 24,
    paddingBottom: 40,
  },
  startButton: {
    backgroundColor: '#CCFF00',
    borderRadius: 28,
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#CCFF00',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  startButtonText: {
    color: '#000000',
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 1.5,
    fontFamily: 'System',
  },
  activeHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 12,
    width: '100%',
  },
  headerSpacer: {
    width: 40,
  },
  statusIndicator: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1.5,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1,
  },
  notificationHeaderBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1E1E1E',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    borderWidth: 1.5,
    borderColor: '#262626',
  },
  notificationBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#CCFF00',
    borderRadius: 9,
    width: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#121212',
  },
  badgeText: {
    color: '#000000',
    fontSize: 9,
    fontWeight: '900',
  },
  metricsContainer: {
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  goalIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E1E1E',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    marginBottom: 24,
    borderWidth: 1.5,
    borderColor: '#262626',
  },
  goalIndicatorText: {
    color: '#CCFF00',
    fontSize: 13,
    fontWeight: '300',
    marginLeft: 6,
  },
  timerValue: {
    color: '#FFFFFF',
    fontSize: 64,
    fontWeight: '900',
    fontVariant: ['tabular-nums'],
    fontFamily: 'System',
  },
  timerLabel: {
    color: '#A0A0A0',
    fontSize: 14,
    fontWeight: '300',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginTop: 8,
  },
  divider: {
    width: 60,
    height: 2,
    backgroundColor: '#262626',
    marginVertical: 32,
  },
  distanceValue: {
    color: '#CCFF00',
    fontSize: 54,
    fontWeight: '900',
    fontVariant: ['tabular-nums'],
    fontFamily: 'System',
  },
  distanceLabel: {
    color: '#A0A0A0',
    fontSize: 14,
    fontWeight: '300',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginTop: 8,
  },
  controlsFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
  },
  controlButton: {
    flex: 1,
    flexDirection: 'row',
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 8,
  },
  pauseButton: {
    backgroundColor: '#1E1E1E',
    borderWidth: 1.5,
    borderColor: '#262626',
  },
  endButton: {
    backgroundColor: '#CCFF00',
    shadowColor: '#CCFF00',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  controlButtonText: {
    fontSize: 16,
    fontWeight: '900',
    marginLeft: 8,
    fontFamily: 'System',
  },
  quickGoalsContainer: {
    marginBottom: 24,
    marginTop: 8,
  },
  quickGoalsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  quickGoalCard: {
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 8,
    minWidth: '18%',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#262626',
  },
  quickGoalCardSelected: {
    backgroundColor: '#262626',
    borderColor: '#CCFF00',
  },
  quickGoalText: {
    color: '#A0A0A0',
    fontSize: 12,
    fontWeight: '300',
  },
  quickGoalTextSelected: {
    color: '#CCFF00',
    fontWeight: '700',
  },
  bannerContainer: {
    position: 'absolute',
    top: 60,
    left: 20,
    right: 20,
    backgroundColor: '#1E1E1E',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
    zIndex: 9999,
    borderWidth: 1.5,
    borderColor: '#CCFF00',
  },
  bannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bannerIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  bannerTextContainer: {
    flex: 1,
  },
  bannerTitle: {
    color: '#A0A0A0',
    fontSize: 12,
    fontWeight: '300',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  bannerMessage: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    marginTop: 1,
    fontFamily: 'System',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#1E1E1E',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: '75%',
    paddingBottom: 40,
    borderTopWidth: 1.5,
    borderTopColor: '#262626',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#262626',
  },
  modalTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '900',
    fontFamily: 'System',
  },
  modalCloseBtn: {
    padding: 8,
    backgroundColor: '#262626',
    borderRadius: 16,
  },
  modalScrollContent: {
    padding: 24,
  },
  emptyNotifications: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
  emptySubtext: {
    color: '#A0A0A0',
    fontSize: 13,
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 20,
    fontWeight: '300',
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#000000',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 3.5,
    borderLeftColor: '#CCFF00',
  },
  notificationTimeBadge: {
    backgroundColor: '#1E1E1E',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#262626',
  },
  notificationTimeText: {
    color: '#CCFF00',
    fontSize: 11,
    fontWeight: 'bold',
    fontVariant: ['tabular-nums'],
  },
  notificationItemText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '300',
    flex: 1,
    fontFamily: 'System',
  },
});
