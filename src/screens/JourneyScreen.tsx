import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Share, Alert, Dimensions } from 'react-native';
import { Share2, ArrowUpRight } from 'lucide-react-native';
import { BarChart } from 'react-native-gifted-charts';
import { Run, MemoryCard, getMoodEmoji } from '../services/storage';

interface JourneyScreenProps {
  runs: Run[];
  memoryCards: MemoryCard[];
  onShareAll: () => void;
}

export const JourneyScreen: React.FC<JourneyScreenProps> = ({ runs, memoryCards, onShareAll }) => {
  const now = new Date();

  // 1. Filtragem por períodos (Últimos 30 dias vs Anterior 30-60 dias)
  const runsLast30 = runs.filter(r => {
    const diff = (now.getTime() - new Date(r.date).getTime()) / (1000 * 60 * 60 * 24);
    return diff <= 30;
  });

  const runsPrior = runs.filter(r => {
    const diff = (now.getTime() - new Date(r.date).getTime()) / (1000 * 60 * 60 * 24);
    return diff > 30 && diff <= 60;
  });

  // 2. Antes x Agora
  // Distância Máxima
  const maxDistNow = runsLast30.length > 0 ? Math.max(...runsLast30.map(r => r.distance)) : 0;
  const maxDistPrior = runsPrior.length > 0 ? Math.max(...runsPrior.map(r => r.distance)) : 0;

  // Humor Predominante (Média de humor antes/depois)
  const getAverageMood = (selectedRuns: Run[]) => {
    if (selectedRuns.length === 0) return 0;
    const sum = selectedRuns.reduce((acc, r) => acc + (r.moodBefore + r.moodAfter) / 2, 0);
    return Math.round(sum / selectedRuns.length);
  };
  const avgMoodNow = getAverageMood(runsLast30);
  const avgMoodPrior = getAverageMood(runsPrior);

  // 3. O que mudou em você (Seção "Uau" de 30 dias - ativa se tiver ao menos 1 corrida para testes)
  const totalKmLast30 = runsLast30.reduce((acc, r) => acc + r.distance, 0);
  
  // Superou distância anterior em X ocasiões
  let superacoesCount = 0;
  for (let i = runs.length - 1; i >= 0; i--) {
    const currentRun = runs[i];
    const previousRuns = runs.slice(i + 1);
    if (previousRuns.length > 0) {
      const maxBefore = Math.max(...previousRuns.map(r => r.distance));
      if (currentRun.distance > maxBefore) {
        superacoesCount++;
      }
    }
  }

  // Correu sem estar motivado (humorBefore <= 2)
  const runsWithoutMotivation = runsLast30.filter(r => r.moodBefore <= 2).length;

  // Terminou melhor do que começou (moodAfter > moodBefore)
  const improvedMoodCount = runsLast30.filter(r => r.moodAfter > r.moodBefore).length;

  // 4. Lógica do Gráfico Semanal (Últimas 4 semanas)
  const getRunsInWeek = (startDay: number, endDay: number) => {
    return runs.filter(r => {
      const diff = (now.getTime() - new Date(r.date).getTime()) / (1000 * 60 * 60 * 24);
      return diff >= startDay && diff < endDay;
    }).length;
  };

  const week1Runs = getRunsInWeek(0, 7);
  const week2Runs = getRunsInWeek(7, 14);
  const week3Runs = getRunsInWeek(14, 21);
  const week4Runs = getRunsInWeek(21, 28);

  const maxRunsInAWeek = Math.max(week1Runs, week2Runs, week3Runs, week4Runs, 1);

  // Dados para o Gráfico do Design System
  const barData = [
    { value: week1Runs, label: 'S1', frontColor: '#CCFF00' },
    { value: week2Runs, label: 'S2', frontColor: '#CCFF00' },
    { value: week3Runs, label: 'S3', frontColor: '#CCFF00' },
    { value: week4Runs, label: 'S4', frontColor: '#CCFF00' },
  ];

  // 5. Frase de Fechamento Mensal
  const getClosingText = () => {
    if (runs.length === 0) return 'Você ainda não iniciou sua jornada.';
    
    // Total de dias ativos (diferença entre primeiro treino e hoje)
    const firstRun = runs[runs.length - 1];
    const diffDays = Math.ceil((now.getTime() - new Date(firstRun.date).getTime()) / (1000 * 60 * 60 * 24));
    return `Você manteve o hábito ativo por ${diffDays === 0 ? 1 : diffDays} ${diffDays === 1 ? 'dia' : 'dias'} desde sua estreia no app.`;
  };

  // Compartilhar um cartão de memória específico
  const handleShareCard = async (text: string) => {
    try {
      await Share.share({
        message: `${text}\n\nCompartilhado via Bitzrun — Consistência é a nossa métrica.`,
      });
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível compartilhar o cartão.');
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>Minha Jornada</Text>
      <Text style={styles.subtitle}>Acompanhe sua consistência de hábitos e evolução</Text>

      {/* Seção Antes x Agora */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Antes x Agora</Text>
        <Text style={styles.cardSubtitle}>Comparação dos últimos 30 dias com o mês anterior</Text>
        
        <View style={styles.comparisonGrid}>
          <View style={styles.comparisonCol}>
            <Text style={styles.gridHeader}>Métrica</Text>
            <Text style={styles.gridRowLabel}>Distância Máxima</Text>
            <Text style={styles.gridRowLabel}>Humor Médio</Text>
          </View>
          
          <View style={styles.comparisonCol}>
            <Text style={styles.gridHeader}>Antes</Text>
            <Text style={styles.gridValue}>
              {maxDistPrior > 0 ? `${maxDistPrior.toFixed(1).replace('.', ',')} km` : '—'}
            </Text>
            <Text style={styles.gridValue}>
              {avgMoodPrior > 0 ? getMoodEmoji(avgMoodPrior) : '—'}
            </Text>
          </View>

          <View style={styles.comparisonCol}>
            <Text style={[styles.gridHeader, { color: '#CCFF00' }]}>Agora</Text>
            <Text style={[styles.gridValue, { color: '#FFFFFF', fontWeight: '900' }]}>
              {maxDistNow > 0 ? `${maxDistNow.toFixed(1).replace('.', ',')} km` : '—'}
            </Text>
            <Text style={[styles.gridValue, { fontSize: 20 }]}>
              {avgMoodNow > 0 ? getMoodEmoji(avgMoodNow) : '—'}
            </Text>
          </View>
        </View>
      </View>

      {/* Gráfico Simples de Frequência Semanal */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Frequência Semanal</Text>
        <Text style={styles.cardSubtitle}>Presença nas últimas 4 semanas (mais recente à esquerda)</Text>
        
        <View style={styles.chartContainer}>
          <BarChart
            data={barData}
            barWidth={24}
            spacing={20}
            roundedTop
            hideRules
            yAxisThickness={0}
            xAxisThickness={0}
            yAxisTextStyle={{ color: '#A0A0A0', fontSize: 12, fontWeight: '300' }}
            xAxisLabelTextStyle={{ color: '#A0A0A0', fontSize: 12, fontWeight: '900' }}
            noOfSections={3}
            maxValue={maxRunsInAWeek > 0 ? maxRunsInAWeek : 4}
            height={120}
            width={Dimensions.get('window').width - 100}
            backgroundColor="transparent"
            initialSpacing={16}
            stepValue={Math.ceil((maxRunsInAWeek > 0 ? maxRunsInAWeek : 4) / 3)}
          />
        </View>
      </View>

      {/* Seção O que mudou em você */}
      {runs.length > 0 ? (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>O que mudou em você</Text>
          <Text style={styles.cardSubtitle}>Sua consistência em números narrativos (últimos 30 dias)</Text>
          
          <View style={styles.bulletsContainer}>
            <View style={styles.bulletRow}>
              <Text style={styles.bulletDot}>•</Text>
              <Text style={styles.bulletText}>Você correu <Text style={styles.boldText}>{runsLast30.length} vezes</Text>.</Text>
            </View>
            <View style={styles.bulletRow}>
              <Text style={styles.bulletDot}>•</Text>
              <Text style={styles.bulletText}>Correu <Text style={styles.boldText}>{totalKmLast30.toFixed(1).replace('.', ',')} km</Text> no total.</Text>
            </View>
            <View style={styles.bulletRow}>
              <Text style={styles.bulletDot}>•</Text>
              <Text style={styles.bulletText}>Superou sua maior distância em <Text style={styles.boldText}>{superacoesCount} ocasiões</Text>.</Text>
            </View>
            <View style={styles.bulletRow}>
              <Text style={styles.bulletDot}>•</Text>
              <Text style={styles.bulletText}>Saiu para correr <Text style={styles.boldText}>{runsWithoutMotivation} vezes</Text> sem estar motivado.</Text>
            </View>
            <View style={styles.bulletRow}>
              <Text style={styles.bulletDot}>•</Text>
              <Text style={styles.bulletText}>Terminou melhor do que começou em <Text style={styles.boldText}>{improvedMoodCount} corridas</Text>.</Text>
            </View>
          </View>
          <Text style={styles.evolutionFooter}>Você não está apenas correndo. Você está construindo consistência.</Text>
        </View>
      ) : null}

      {/* Seção Cartões de Memória */}
      <View style={styles.memorySection}>
        <Text style={styles.sectionTitle}>Cartões de Memória</Text>
        {memoryCards.length === 0 ? (
          <View style={styles.emptyMemoryCard}>
            <Text style={styles.emptyMemoryText}>
              Seus momentos mais marcantes e conquistas de regularidade serão transformados em cartões de memória aqui.
            </Text>
          </View>
        ) : (
          memoryCards.map(card => (
            <View key={card.id} style={styles.memoryCard}>
              <Text style={styles.memoryText}>{card.text}</Text>
              <TouchableOpacity style={styles.shareCardBtn} onPress={() => handleShareCard(card.text)} activeOpacity={0.7}>
                <Share2 size={16} color="#CCFF00" strokeWidth={1.5} />
              </TouchableOpacity>
            </View>
          ))
        )}
      </View>

      {/* Fechamento & Compartilhamento de Evolução */}
      {runs.length > 0 && (
        <View style={styles.closingSection}>
          <Text style={styles.closingText}>{getClosingText()}</Text>
          <TouchableOpacity style={styles.shareAllBtn} onPress={onShareAll} activeOpacity={0.85}>
            <Text style={styles.shareAllBtnText}>COMPARTILHAR MINHA EVOLUÇÃO</Text>
            <ArrowUpRight size={18} color="#000000" strokeWidth={2.5} />
          </TouchableOpacity>
        </View>
      )}
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
    paddingTop: 68,
    paddingBottom: 100,
  },
  title: {
    color: '#FFFFFF', // Alto contraste
    fontSize: 24,
    fontWeight: '900', // Roboto Black
    fontFamily: 'System',
  },
  subtitle: {
    color: '#A0A0A0', // Cinza claro
    fontSize: 13,
    marginTop: 4,
    marginBottom: 24,
    fontWeight: '300', // Roboto Light
    fontFamily: 'System',
  },
  card: {
    backgroundColor: '#1E1E1E', // Cinza escuro
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#262626',
  },
  cardTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900', // Roboto Black
    fontFamily: 'System',
  },
  cardSubtitle: {
    color: '#A0A0A0',
    fontSize: 11,
    fontWeight: '300', // Roboto Light
    marginTop: 2,
    marginBottom: 16,
  },
  comparisonGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  comparisonCol: {
    flex: 1,
  },
  gridHeader: {
    color: '#A0A0A0',
    fontSize: 11,
    fontWeight: '900', // Roboto Black
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  gridRowLabel: {
    color: '#A0A0A0',
    fontSize: 13,
    fontWeight: '300', // Roboto Light
    marginVertical: 8,
  },
  gridValue: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
    marginVertical: 8,
  },
  chartContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    paddingRight: 16,
  },
  bulletsContainer: {
    marginTop: 8,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginVertical: 6,
  },
  bulletDot: {
    color: '#CCFF00', // Verde-limão
    fontSize: 18,
    marginRight: 8,
    lineHeight: 18,
  },
  bulletText: {
    color: '#FFFFFF',
    fontSize: 14,
    lineHeight: 20,
    flex: 1,
    fontWeight: '300', // Roboto Light
    fontFamily: 'System',
  },
  boldText: {
    fontWeight: '900', // Roboto Black
    color: '#CCFF00',
  },
  evolutionFooter: {
    color: '#CCFF00', // Verde-limão
    fontSize: 13,
    fontWeight: '900', // Roboto Black
    textAlign: 'center',
    marginTop: 18,
    fontStyle: 'italic',
  },
  memorySection: {
    marginTop: 12,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '900', // Roboto Black
    marginBottom: 16,
    fontFamily: 'System',
  },
  emptyMemoryCard: {
    backgroundColor: '#1E1E1E',
    borderRadius: 18,
    padding: 24,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#262626',
    alignItems: 'center',
  },
  emptyMemoryText: {
    color: '#A0A0A0',
    fontSize: 13,
    lineHeight: 20,
    textAlign: 'center',
    fontWeight: '300',
  },
  memoryCard: {
    backgroundColor: '#1E1E1E', // Cinza escuro
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#262626',
    borderLeftWidth: 4,
    borderLeftColor: '#CCFF00', // Verde-limão
  },
  memoryText: {
    color: '#FFFFFF',
    fontSize: 14,
    lineHeight: 20,
    flex: 1,
    fontStyle: 'italic',
    paddingRight: 12,
    fontWeight: '300',
  },
  shareCardBtn: {
    padding: 8,
    backgroundColor: '#000000', // Fundo preto puro para contraste
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#262626',
  },
  closingSection: {
    marginTop: 20,
    alignItems: 'center',
  },
  closingText: {
    color: '#A0A0A0',
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 16,
    fontWeight: '300',
  },
  shareAllBtn: {
    backgroundColor: '#CCFF00', // Verde-limão
    borderRadius: 28,
    paddingVertical: 18,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  shareAllBtnText: {
    color: '#000000', // Texto preto puro
    fontSize: 14,
    fontWeight: '900', // Roboto Black
    letterSpacing: 1,
    marginRight: 8,
    fontFamily: 'System',
  },
});
