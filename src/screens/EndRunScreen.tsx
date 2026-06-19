import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Sparkles, Calendar, Clock, Compass, Heart } from 'lucide-react-native';
import { Run, formatFriendlyDate, getMoodText } from '../services/storage';
import { theme } from '../theme/theme';
import { ScreenContainer } from '../components/ScreenContainer';
import { AppCard } from '../components/AppCard';
import { AppButton } from '../components/AppButton';
import { MetricCard } from '../components/MetricCard';

interface EndRunScreenProps {
  durationSeconds: number;
  distanceKm: number;
  runs: Run[];
  onNext: () => void;
}

export const EndRunScreen: React.FC<EndRunScreenProps> = ({
  durationSeconds,
  distanceKm,
  runs,
  onNext,
}) => {
  // Lógica de validação emocional e comparativo narrativo
  const getComparisonMessage = () => {
    if (runs.length === 0) {
      return 'Você deu o primeiro passo. Isso é o mais importante.';
    }

    const lastRun = runs[0];
    const diffTime = Math.abs(new Date().getTime() - new Date(lastRun.date).getTime());
    const diffDays = diffTime / (1000 * 60 * 60 * 24);
    
    if (diffDays > 7) {
      return 'Você voltou depois de uma pausa. Mantenha o hábito aceso.';
    }

    if (distanceKm > lastRun.distance) {
      return 'Você aumentou o volume hoje. Evolução gradual e sem pressão.';
    }

    return 'Você apareceu e garantiu seu dia. A consistência reside na presença.';
  };

  const formatTime = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins}m ${secs}s`;
  };

  // Buscar humor antes da última corrida (ou da corrida atual se disponível, mas como é passado pelo fluxo, apenas ilustrativo)
  const lastRunMoodBefore = runs.length > 0 ? runs[0].moodBefore : 3;

  return (
    <ScreenContainer style={styles.container}>
      <View style={styles.header}>
        <View style={styles.sparkleIconCircle}>
          <Sparkles size={28} color={theme.colors.primary} strokeWidth={1.5} />
        </View>
        <Text style={styles.title}>Corrida registrada</Text>
        <Text style={styles.headline}>Uma corrida curta ainda conta.</Text>
        <Text style={styles.subtitle}>{getComparisonMessage()}</Text>
      </View>

      <View style={styles.metricsWrapper}>
        <View style={styles.metricsRow}>
          <MetricCard
            title="Distância"
            value={`${distanceKm.toFixed(2).replace('.', ',')} km`}
            icon={<Compass size={16} color={theme.colors.textSecondary} />}
          />
          <MetricCard
            title="Tempo"
            value={formatTime(durationSeconds)}
            icon={<Clock size={16} color={theme.colors.textSecondary} />}
          />
        </View>

        <AppCard variant="secondary" style={styles.detailsCard}>
          <View style={styles.detailItem}>
            <Calendar size={16} color={theme.colors.textSecondary} style={styles.detailIcon} />
            <Text style={styles.detailText}>{formatFriendlyDate(new Date().toISOString())}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.detailItem}>
            <Heart size={16} color={theme.colors.textSecondary} style={styles.detailIcon} />
            <Text style={styles.detailText}>
              Humor inicial: {getMoodText(lastRunMoodBefore)}
            </Text>
          </View>
        </AppCard>
      </View>

      <View style={styles.footer}>
        <AppButton
          title="Registrar como me sinto agora"
          onPress={onNext}
          variant="primary"
          style={styles.nextBtn}
        />
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-between',
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.lg,
  },
  header: {
    alignItems: 'center',
    marginTop: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
  },
  sparkleIconCircle: {
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
  title: {
    color: theme.colors.textSecondary,
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: theme.spacing.xs,
  },
  headline: {
    color: theme.colors.text,
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    color: theme.colors.textSecondary,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: theme.spacing.md,
  },
  metricsWrapper: {
    gap: theme.spacing.md,
  },
  metricsRow: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  detailsCard: {
    padding: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailIcon: {
    marginRight: theme.spacing.sm,
  },
  detailText: {
    color: theme.colors.text,
    fontSize: 13,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.border,
  },
  footer: {
    width: '100%',
  },
  nextBtn: {
    width: '100%',
  },
});
