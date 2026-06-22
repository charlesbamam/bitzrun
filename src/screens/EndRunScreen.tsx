import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Sparkles, CalendarDays, Clock, Route, Heart } from 'lucide-react-native';
import { Run, formatFriendlyDate, getMoodText } from '../services/storage';
import { theme } from '../theme/theme';
import { ScreenContainer } from '../components/ScreenContainer';
import { AppCard } from '../components/AppCard';
import { AppButton } from '../components/AppButton';
import { MetricCard } from '../components/MetricCard';
import { BitzIcon } from '../components/BitzIcon';

interface EndRunScreenProps {
  durationSeconds: number;
  distanceKm: number;
  runs: Run[];
  targetDistanceKm?: number;
  onNext: () => void;
}

export const EndRunScreen: React.FC<EndRunScreenProps> = ({
  durationSeconds,
  distanceKm,
  runs,
  targetDistanceKm,
  onNext,
}) => {
  const isBeyond = targetDistanceKm ? (distanceKm >= targetDistanceKm) : false;

  // Lógica de validação emocional e comparativo narrativo
  const getComparisonMessage = () => {
    if (isBeyond) {
      return 'Esse é o tipo de vitória que constrói constância.';
    }

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

  const getExtraText = () => {
    if (!targetDistanceKm) return '+0 m';
    const extra = distanceKm - targetDistanceKm;
    if (extra <= 0) return '+0 m';
    if (extra < 1.0) {
      return `+${Math.round(extra * 1000)} m`;
    } else {
      return `+${extra.toFixed(1).replace('.', ',')} km`;
    }
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
          <BitzIcon icon={Sparkles} size={28} color={theme.colors.primary} />
        </View>
        <Text style={styles.title}>{isBeyond ? 'Você foi além.' : 'Corrida registrada'}</Text>
        <Text style={styles.headline}>
          {isBeyond ? 'Hoje você não apenas apareceu. Você avançou.' : 'Uma corrida curta ainda conta.'}
        </Text>
        <Text style={styles.subtitle}>{getComparisonMessage()}</Text>
      </View>

      <View style={styles.metricsWrapper}>
        <View style={styles.metricsRow}>
          <MetricCard
            title="Distância"
            value={`${distanceKm.toFixed(2).replace('.', ',')} km`}
            icon={<BitzIcon icon={Route} size={16} color={theme.colors.textSecondary} />}
          />
          <MetricCard
            title="Tempo"
            value={formatTime(durationSeconds)}
            icon={<BitzIcon icon={Clock} size={16} color={theme.colors.textSecondary} />}
          />
        </View>

        {isBeyond && targetDistanceKm ? (
          <AppCard variant="secondary" style={styles.beyondSummaryCard}>
            <Text style={styles.beyondSummaryTitle}>Métricas da Superação</Text>
            <View style={styles.beyondSummaryRow}>
              <Text style={styles.beyondSummaryLabel}>Meta definida:</Text>
              <Text style={styles.beyondSummaryValue}>{targetDistanceKm.toFixed(1).replace('.', ',')} km</Text>
            </View>
            <View style={styles.beyondSummaryDivider} />
            <View style={styles.beyondSummaryRow}>
              <Text style={styles.beyondSummaryLabel}>Corrida total:</Text>
              <Text style={styles.beyondSummaryValue}>{distanceKm.toFixed(2).replace('.', ',')} km</Text>
            </View>
            <View style={styles.beyondSummaryDivider} />
            <View style={styles.beyondSummaryRow}>
              <Text style={styles.beyondSummaryLabel}>Extra:</Text>
              <Text style={[styles.beyondSummaryValue, { color: theme.colors.primary }]}>{getExtraText()}</Text>
            </View>
          </AppCard>
        ) : null}

        <AppCard variant={isBeyond ? 'secondary' : 'secondary'} style={styles.detailsCard}>
          <View style={styles.detailItem}>
            <BitzIcon icon={CalendarDays} size={16} color={theme.colors.textSecondary} style={styles.detailIcon} />
            <Text style={styles.detailText}>{formatFriendlyDate(new Date().toISOString())}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.detailItem}>
            <BitzIcon icon={Heart} size={16} color={theme.colors.textSecondary} style={styles.detailIcon} />
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
  beyondSummaryCard: {
    padding: theme.spacing.md,
    gap: theme.spacing.xs,
    borderWidth: 1,
    borderColor: 'rgba(204, 255, 0, 0.3)',
  },
  beyondSummaryTitle: {
    color: theme.colors.text,
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: theme.spacing.xs,
  },
  beyondSummaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 2,
  },
  beyondSummaryLabel: {
    color: theme.colors.textSecondary,
    fontSize: 13,
  },
  beyondSummaryValue: {
    color: theme.colors.text,
    fontSize: 13,
    fontWeight: '600',
  },
  beyondSummaryDivider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    marginVertical: 4,
  },
});
