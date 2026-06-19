import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Alert, Image } from 'react-native';
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
  const progressRatio = Math.min(runsThisWeekCount / WEEKLY_GOAL_RUNS, 1);

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
            value={`${runsThisWeekCount}/${WEEKLY_GOAL_RUNS}`}
            label="Corridas"
            size={110}
            strokeWidth={10}
          />
          <View style={styles.progressCardInfo}>
            <Text style={styles.progressTitle}>Meta Semanal</Text>
            <Text style={styles.progressDescription}>
              Completar pequenas sessões estimula a memória positiva e a persistência.
            </Text>
            <View style={styles.streakBadge}>
              <Zap size={14} color={theme.colors.primary} strokeWidth={2} />
              <Text style={styles.streakText}>
                {profile.streak > 0 
                  ? `${profile.streak} ${profile.streak === 1 ? 'dia seguido' : 'dias seguidos'}`
                  : 'Inicie sua sequência hoje'}
              </Text>
            </View>
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
            subtitle={`Meta: ${WEEKLY_GOAL_RUNS}`}
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
});
