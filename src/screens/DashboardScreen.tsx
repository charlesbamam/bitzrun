import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Alert, Image, Modal } from 'react-native';
import { Flame, Check, Edit2, User, Trophy, Calendar, Zap, AlertCircle } from 'lucide-react-native';
import { StorageService, UserProfile, Run } from '../services/storage';
import { theme } from '../theme/theme';
import { ScreenContainer } from '../components/ScreenContainer';
import { AppCard } from '../components/AppCard';
import { AppButton } from '../components/AppButton';
import { MetricCard } from '../components/MetricCard';
import { ProgressRing } from '../components/ProgressRing';
import { SectionTitle } from '../components/SectionTitle';

interface DashboardScreenProps {
  onStartRunPress: () => void;
  onNavigateToJourney: () => void;
  lastRun: Run | null;
  profile: UserProfile;
  runs: Run[];
  onProfileUpdate: (updatedProfile: UserProfile) => void;
  onSignOut: () => void;
}

const WEEKLY_GOAL_RUNS = 3; // Facilmente configurável

export const DashboardScreen: React.FC<DashboardScreenProps> = ({
  onStartRunPress,
  onNavigateToJourney,
  lastRun,
  profile,
  runs,
  onProfileUpdate,
  onSignOut,
}) => {
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState(profile.name);
  const [greeting, setGreeting] = useState('Bom ver você aqui');
  
  const [isGoalModalVisible, setIsGoalModalVisible] = useState(false);
  const weeklyGoal = profile.weeklyRunGoal ?? 3;
  const [selectedGoal, setSelectedGoal] = useState(weeklyGoal);

  useEffect(() => {
    setSelectedGoal(weeklyGoal);
  }, [weeklyGoal]);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
      setGreeting('Bom dia');
    } else if (hour >= 12 && hour < 18) {
      setGreeting('Boa tarde');
    } else {
      setGreeting('Boa noite');
    }
  }, []);

  useEffect(() => {
    setEditedName(profile.name);
  }, [profile.name]);

  const handleSaveName = async () => {
    if (editedName.trim()) {
      const updated = await StorageService.updateProfileName(editedName.trim());
      onProfileUpdate(updated);
    }
    setIsEditingName(false);
  };

  const handleSaveGoal = async () => {
    const updated = await StorageService.updateWeeklyRunGoal(selectedGoal);
    onProfileUpdate(updated);
    setIsGoalModalVisible(false);
  };

  // Calcular métricas reais do usuário baseadas no histórico local
  const now = new Date();
  
  // 1. Corridas na semana (últimos 7 dias)
  const runsThisWeekList = (runs || []).filter(run => {
    const runDate = new Date(run.date);
    const diffTime = Math.abs(now.getTime() - runDate.getTime());
    const diffDays = diffTime / (1000 * 60 * 60 * 24);
    return diffDays <= 7;
  });
  const runsThisWeekCount = runsThisWeekList.length;

  // 2. Distância total (km)
  const totalDistance = (runs || []).reduce((acc, run) => acc + run.distance, 0);

  // 3. Progresso semanal de 0 a 1
  const progressRatio = Math.min(runsThisWeekCount / weeklyGoal, 1);

  const remainingRuns = weeklyGoal - runsThisWeekCount;
  let supportText = '';
  if (remainingRuns <= 0) {
    supportText = 'Meta da semana concluída.';
  } else if (remainingRuns === 1) {
    supportText = 'Falta 1 corrida para fechar sua semana.';
  } else {
    supportText = `Faltam ${remainingRuns} corridas para fechar sua semana.`;
  }

  return (
    <ScreenContainer scrollable style={styles.container}>
      {/* Header com Saudação e Perfil */}
      <View style={styles.header}>
        <View style={styles.userInfo}>
          {isEditingName ? (
            <View style={styles.editNameContainer}>
              <TextInput
                style={styles.nameInput}
                value={editedName}
                onChangeText={setEditedName}
                autoFocus
                maxLength={18}
                placeholderTextColor={theme.colors.textSecondary}
              />
              <TouchableOpacity style={styles.iconButton} onPress={handleSaveName}>
                <Check size={20} color={theme.colors.primary} />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity style={styles.nameClickable} onPress={() => setIsEditingName(true)} activeOpacity={0.7}>
              <Text style={styles.greetingText}>{greeting},</Text>
              <View style={styles.nameRow}>
                <Text style={styles.nameText}>{profile.name}.</Text>
                <Edit2 size={14} color={theme.colors.textSecondary} style={styles.editIcon} />
              </View>
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity style={styles.avatar} onPress={onSignOut} activeOpacity={0.7}>
          {profile.avatarUri ? (
            <Image source={{ uri: profile.avatarUri }} style={styles.avatarImage} />
          ) : (
            <User size={20} color={theme.colors.primary} strokeWidth={1.5} />
          )}
        </TouchableOpacity>
      </View>

      {/* Card Principal: CTA Diária */}
      <AppCard style={styles.mainCtaCard}>
        <View style={styles.ctaBadge}>
          <Flame size={12} color={theme.colors.background} strokeWidth={2.5} />
          <Text style={styles.ctaBadgeText}>Foco de hoje</Text>
        </View>
        <Text style={styles.ctaCardTitle}>Uma corrida curta ainda conta.</Text>
        <Text style={styles.ctaCardText}>
          O objetivo de hoje é manter o hábito vivo. Vá devagar, corra no seu tempo.
        </Text>
        <AppButton
          title="Iniciar corrida"
          onPress={onStartRunPress}
          variant="primary"
          style={styles.ctaBtn}
        />
      </AppCard>

      {/* Seção: Consistência Semanal */}
      <SectionTitle title="Consistência da Semana" />
      <AppCard style={styles.progressCard}>
        <View style={styles.progressCardContent}>
          <ProgressRing
            progress={progressRatio}
            value={`${runsThisWeekCount}/${weeklyGoal}`}
            label="corridas"
            size={110}
            strokeWidth={10}
          />
          <View style={styles.progressCardInfo}>
            <Text style={styles.progressTitle}>Meta da semana</Text>
            <Text style={styles.progressMainText}>{runsThisWeekCount} de {weeklyGoal} corridas feitas</Text>
            <Text style={styles.progressSupportText}>Sua meta: {weeklyGoal} corridas por semana.</Text>
            <Text style={styles.progressRemainingText}>{supportText}</Text>
            
            <TouchableOpacity style={styles.changeGoalBtn} onPress={() => setIsGoalModalVisible(true)} activeOpacity={0.7}>
              <Text style={styles.changeGoalBtnText}>Alterar meta</Text>
            </TouchableOpacity>
          </View>
        </View>
      </AppCard>

      {/* Seção: Minhas Métricas */}
      <SectionTitle title="Minhas Estatísticas" />
      <View style={styles.metricsGrid}>
        <View style={styles.metricsRow}>
          <MetricCard
            title="Corridas / Semana"
            value={runsThisWeekCount}
            subtitle={`Meta: ${weeklyGoal}`}
            icon={<Calendar size={16} color={theme.colors.textSecondary} />}
          />
          <MetricCard
            title="Sequência Atual"
            value={profile.streak}
            subtitle={profile.streak > 0 ? "Em ritmo!" : "Foco em começar"}
            icon={<Flame size={16} color={theme.colors.textSecondary} />}
          />
        </View>
        <View style={styles.metricsRow}>
          <MetricCard
            title="Distância Total"
            value={`${totalDistance.toFixed(1)} km`}
            subtitle="Acumulado"
            icon={<Trophy size={16} color={theme.colors.textSecondary} />}
          />
          <MetricCard
            title="Último Treino"
            value={lastRun ? `${lastRun.distance.toFixed(1)} km` : "—"}
            subtitle={lastRun ? "Corrida salva" : "Nenhum registro"}
            icon={<Zap size={16} color={theme.colors.textSecondary} />}
          />
        </View>
      </View>

      {/* Estado Vazio de Corrida se não houver histórico */}
      {(runs || []).length === 0 && (
        <AppCard variant="outlined" style={styles.emptyStateCard}>
          <AlertCircle size={20} color={theme.colors.textSecondary} style={styles.emptyIcon} />
          <Text style={styles.emptyText}>
            Sua primeira corrida aparecerá aqui. Dê o primeiro passo para construir sua consistência!
          </Text>
        </AppCard>
      )}

      {/* Card de Incentivo Adicional (Comece Leve) */}
      <AppCard variant="secondary" style={styles.incentiveCard}>
        <Text style={styles.incentiveTitle}>Comece leve</Text>
        <Text style={styles.incentiveText}>
          Você não precisa correr muito hoje. Só precisa vestir o tênis e começar.
        </Text>
        <TouchableOpacity style={styles.incentiveCta} onPress={onStartRunPress} activeOpacity={0.7}>
          <Text style={styles.incentiveCtaText}>Preparar corrida</Text>
        </TouchableOpacity>
      </AppCard>

      {/* Atalho rápido */}
      <TouchableOpacity style={styles.shortcutLink} onPress={onNavigateToJourney} activeOpacity={0.7}>
        <Text style={styles.shortcutText}>Ver minha jornada completa</Text>
      </TouchableOpacity>

      {/* Modal de Escolha da Meta Semanal */}
      <Modal
        visible={isGoalModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsGoalModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Escolha sua meta semanal</Text>
            <Text style={styles.modalText}>Quantas vezes você quer correr por semana?</Text>
            <Text style={styles.modalSupportText}>Escolha uma meta realista. Você pode mudar depois.</Text>

            <View style={styles.modalOptionsContainer}>
              {[
                { val: 2, label: '2x por semana', desc: 'Leve' },
                { val: 3, label: '3x por semana', desc: 'Equilibrado' },
                { val: 4, label: '4x por semana', desc: 'Firme' },
                { val: 5, label: '5x por semana', desc: 'Forte' },
                { val: 6, label: '6x por semana', desc: 'Intenso' },
              ].map(opt => (
                <TouchableOpacity
                  key={opt.val}
                  style={[
                    styles.modalOptionBtn,
                    selectedGoal === opt.val && styles.modalOptionBtnActive
                  ]}
                  onPress={() => setSelectedGoal(opt.val)}
                  activeOpacity={0.7}
                >
                  <Text style={[
                    styles.modalOptionText,
                    selectedGoal === opt.val && styles.modalOptionTextActive
                  ]}>
                    {opt.label} <Text style={[
                      styles.modalOptionDesc,
                      selectedGoal === opt.val && styles.modalOptionDescActive
                    ]}>— {opt.desc}</Text>
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={() => setIsGoalModalVisible(false)}
                activeOpacity={0.7}
              >
                <Text style={styles.modalCancelText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalSaveBtn}
                onPress={handleSaveGoal}
                activeOpacity={0.7}
              >
                <Text style={styles.modalSaveText}>Salvar meta</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: theme.spacing.sm,
    paddingBottom: theme.spacing.xl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
    paddingHorizontal: theme.spacing.xs,
  },
  userInfo: {
    flex: 1,
  },
  nameClickable: {
    paddingVertical: 2,
  },
  greetingText: {
    color: theme.colors.textSecondary,
    fontSize: 14,
    fontWeight: '400',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  nameText: {
    color: theme.colors.text,
    fontSize: 24,
    fontWeight: 'bold',
  },
  editIcon: {
    marginLeft: theme.spacing.sm,
    opacity: 0.8,
  },
  editNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nameInput: {
    color: theme.colors.text,
    fontSize: 24,
    fontWeight: 'bold',
    borderBottomWidth: 1.5,
    borderBottomColor: theme.colors.primary,
    paddingVertical: 2,
    width: '75%',
  },
  iconButton: {
    padding: theme.spacing.xs,
    marginLeft: theme.spacing.xs,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: theme.borderRadius.round,
    backgroundColor: theme.colors.card,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  mainCtaCard: {
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.card,
    marginBottom: theme.spacing.sm,
  },
  ctaBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: theme.colors.primary,
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: theme.borderRadius.sm,
    marginBottom: theme.spacing.sm,
  },
  ctaBadgeText: {
    color: theme.colors.background,
    fontSize: 9,
    fontWeight: '800',
    textTransform: 'uppercase',
    marginLeft: 3,
  },
  ctaCardTitle: {
    color: theme.colors.text,
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: theme.spacing.xs,
  },
  ctaCardText: {
    color: theme.colors.textSecondary,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: theme.spacing.md,
  },
  ctaBtn: {
    height: 48,
  },
  progressCard: {
    padding: theme.spacing.md,
  },
  progressCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressCardInfo: {
    flex: 1,
    marginLeft: theme.spacing.md,
  },
  progressTitle: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  progressDescription: {
    color: theme.colors.textSecondary,
    fontSize: 12,
    lineHeight: 16,
    marginBottom: theme.spacing.sm,
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: theme.borderRadius.md,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  streakText: {
    color: theme.colors.text,
    fontSize: 11,
    fontWeight: '600',
    marginLeft: 6,
  },
  metricsGrid: {
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
  },
  metricsRow: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  emptyStateCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    borderColor: theme.colors.border,
  },
  emptyIcon: {
    marginRight: theme.spacing.md,
    opacity: 0.6,
  },
  emptyText: {
    color: theme.colors.textSecondary,
    fontSize: 12,
    flex: 1,
    lineHeight: 16,
  },
  incentiveCard: {
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  incentiveTitle: {
    color: theme.colors.text,
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  incentiveText: {
    color: theme.colors.textSecondary,
    fontSize: 12,
    lineHeight: 18,
    marginBottom: theme.spacing.sm,
  },
  incentiveCta: {
    alignSelf: 'flex-start',
  },
  incentiveCtaText: {
    color: theme.colors.primary,
    fontSize: 12,
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
  shortcutLink: {
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  shortcutText: {
    color: theme.colors.primary,
    fontSize: 14,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  progressMainText: {
    color: theme.colors.text,
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  progressSupportText: {
    color: theme.colors.textSecondary,
    fontSize: 12,
    marginBottom: 4,
  },
  progressRemainingText: {
    color: theme.colors.primary,
    fontSize: 12,
    fontWeight: '600',
    marginBottom: theme.spacing.sm,
  },
  changeGoalBtn: {
    alignSelf: 'flex-start',
  },
  changeGoalBtnText: {
    color: theme.colors.primary,
    fontSize: 12,
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.lg,
  },
  modalContent: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.md, // 16px
    padding: theme.spacing.lg,
    width: '100%',
    maxWidth: 340,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  modalTitle: {
    color: theme.colors.text,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: theme.spacing.xs,
  },
  modalText: {
    color: theme.colors.text,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  modalSupportText: {
    color: theme.colors.textSecondary,
    fontSize: 12,
    marginBottom: theme.spacing.md,
    lineHeight: 16,
  },
  modalOptionsContainer: {
    gap: theme.spacing.xs,
    marginBottom: theme.spacing.lg,
  },
  modalOptionBtn: {
    backgroundColor: theme.colors.background,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  modalOptionBtnActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  modalOptionText: {
    color: theme.colors.text,
    fontSize: 14,
    fontWeight: 'bold',
  },
  modalOptionTextActive: {
    color: theme.colors.background,
  },
  modalOptionDesc: {
    color: theme.colors.textSecondary,
    fontWeight: '400',
    fontSize: 12,
  },
  modalOptionDescActive: {
    color: 'rgba(0,0,0,0.6)',
    fontWeight: '600',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: theme.spacing.sm,
  },
  modalCancelBtn: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: theme.borderRadius.md,
  },
  modalCancelText: {
    color: theme.colors.textSecondary,
    fontSize: 14,
    fontWeight: 'bold',
  },
  modalSaveBtn: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: theme.borderRadius.md,
  },
  modalSaveText: {
    color: theme.colors.background,
    fontSize: 14,
    fontWeight: 'bold',
  },
});
