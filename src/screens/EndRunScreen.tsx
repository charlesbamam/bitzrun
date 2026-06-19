import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Sparkles, Calendar, Clock, Navigation } from 'lucide-react-native';
import { Run, formatFriendlyDate } from '../services/storage';

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
      return 'Você começou! O primeiro passo é o mais difícil e você apareceu hoje.';
    }

    const lastRun = runs[0];
    
    // Se a última corrida foi há mais de 7 dias (pausa longa)
    const diffTime = Math.abs(new Date().getTime() - new Date(lastRun.date).getTime());
    const diffDays = diffTime / (1000 * 60 * 60 * 24);
    if (diffDays > 7) {
      return 'Você voltou após uma longa pausa. Manter a presença após parar é o que constrói a consistência.';
    }

    // Comparativo de distância
    if (distanceKm > lastRun.distance) {
      const percentage = Math.round(((distanceKm - lastRun.distance) / lastRun.distance) * 100);
      return `Você correu ${percentage}% mais distância do que na sua última corrida. Um progresso gradual e sólido.`;
    }

    return 'Você correu e manteve a sua rotina ativa. A consistência reside na presença, não na velocidade.';
  };

  const getEmotionalMessage = () => {
    if (distanceKm >= 5) {
      return 'Você foi longe hoje. Mas o mais importante: você apareceu.';
    }
    if (durationSeconds < 600) {
      return 'Uma corrida rápida ainda é uma corrida. Você manteve o hábito vivo.';
    }
    return 'Você apareceu. Isso é tudo.';
  };

  const formatTime = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins}m ${secs}s`;
  };

  return (
    <View style={styles.container}>
      {/* Mensagem Principal */}
      <View style={styles.messageSection}>
        <View style={styles.sparkleIconContainer}>
          <Sparkles size={32} color="#CCFF00" strokeWidth={1.5} />
        </View>
        <Text style={styles.emotionalHeadline}>{getEmotionalMessage()}</Text>
        <Text style={styles.comparisonText}>{getComparisonMessage()}</Text>
      </View>

      {/* Dados Simples da Corrida */}
      <View style={styles.metricsSection}>
        <View style={styles.metricRow}>
          <View style={styles.metricItem}>
            <Navigation size={18} color="#CCFF00" strokeWidth={1.5} style={styles.metricIcon} />
            <Text style={styles.metricValue}>{distanceKm.toFixed(2).replace('.', ',')}</Text>
            <Text style={styles.metricLabel}>Km corridos</Text>
          </View>
          
          <View style={styles.verticalDivider} />

          <View style={styles.metricItem}>
            <Clock size={18} color="#CCFF00" strokeWidth={1.5} style={styles.metricIcon} />
            <Text style={styles.metricValue}>{formatTime(durationSeconds)}</Text>
            <Text style={styles.metricLabel}>Duração</Text>
          </View>
        </View>

        <View style={styles.dateCard}>
          <Calendar size={16} color="#A0A0A0" strokeWidth={1.5} style={{ marginRight: 8 }} />
          <Text style={styles.dateText}>{formatFriendlyDate(new Date().toISOString())}</Text>
        </View>
      </View>

      {/* CTA Footer */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.ctaButton} onPress={onNext} activeOpacity={0.85}>
          <Text style={styles.ctaButtonText}>REGISTRAR COMO ME SINTO AGORA</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 80,
    paddingBottom: 40,
  },
  messageSection: {
    alignItems: 'center',
    marginTop: 20,
  },
  sparkleIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#1E1E1E',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 2,
    borderColor: '#CCFF00',
  },
  emotionalHeadline: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: '900',
    textAlign: 'center',
    lineHeight: 34,
    marginBottom: 16,
    paddingHorizontal: 16,
    fontFamily: 'System',
  },
  comparisonText: {
    color: '#A0A0A0',
    fontSize: 16,
    fontWeight: '300',
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 24,
    fontFamily: 'System',
  },
  metricsSection: {
    backgroundColor: '#1E1E1E',
    borderRadius: 24,
    padding: 24,
    marginVertical: 40,
    borderWidth: 1,
    borderColor: '#262626',
  },
  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  metricItem: {
    alignItems: 'center',
    flex: 1,
  },
  metricIcon: {
    marginBottom: 8,
  },
  metricValue: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '900',
    fontFamily: 'System',
  },
  metricLabel: {
    color: '#A0A0A0',
    fontSize: 12,
    fontWeight: '300',
    marginTop: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  verticalDivider: {
    width: 1.5,
    height: 50,
    backgroundColor: '#262626',
  },
  dateCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    backgroundColor: '#000000',
    paddingVertical: 10,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#262626',
  },
  dateText: {
    color: '#A0A0A0',
    fontSize: 13,
    fontWeight: '300',
  },
  footer: {
    width: '100%',
  },
  ctaButton: {
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
  ctaButtonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 1,
    fontFamily: 'System',
  },
});
