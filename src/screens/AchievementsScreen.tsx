import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { Award, Lock, Flame, Calendar, RefreshCw, Zap, Activity, Trophy, Smile, Check } from 'lucide-react-native';
import { Achievement, formatFriendlyDate, Run } from '../services/storage';
import { AchievementCard } from '../components/AchievementCard';
import { theme } from '../theme/theme';


interface AchievementsScreenProps {
  unlockedAchievements: Achievement[];
  runs: Run[];
}

interface AchievementDefinition {
  id: string;
  iconName: string;
  title: string;
  description: string;
  type: 'consistency' | 'evolution';
}

const ALL_ACHIEVEMENTS: AchievementDefinition[] = [
  // Consistência
  {
    id: 'ach_week_active',
    iconName: 'Calendar',
    title: 'Primeira semana ativa',
    description: 'Registrou pelo menos 2 corridas nos últimos 7 dias.',
    type: 'consistency',
  },
  {
    id: 'ach_runs_10',
    iconName: 'Award',
    title: '10 Corridas registradas',
    description: 'Completou 10 sessões de corrida. O hábito está se consolidando.',
    type: 'consistency',
  },
  {
    id: 'ach_first_return',
    iconName: 'RefreshCw',
    title: 'Primeiro retorno após pausa',
    description: 'Voltou a correr após passar mais de 7 dias inativo.',
    type: 'consistency',
  },
  {
    id: 'ach_runs_50',
    iconName: 'Flame',
    title: '50 Corridas registradas',
    description: '50 passos em direção ao seu novo eu. Incrível consistência.',
    type: 'consistency',
  },
  {
    id: 'ach_3_months',
    iconName: 'Calendar',
    title: '3 Meses ativos',
    description: 'Manteve a consistência de corrida ativa ao longo de 90 dias.',
    type: 'consistency',
  },
  // Evolução
  {
    id: 'ach_dist_3',
    iconName: 'Zap',
    title: 'Barreira dos 3 km',
    description: 'Completou sua primeira corrida de pelo menos 3 km.',
    type: 'evolution',
  },
  {
    id: 'ach_dist_5',
    iconName: 'Activity',
    title: 'Superação de 5 km',
    description: 'Correu 5 km ou mais em uma única sessão. Excelente marca!',
    type: 'evolution',
  },
  {
    id: 'ach_dist_10',
    iconName: 'Trophy',
    title: 'Os grandes 10 km',
    description: 'Atingiu a incrível marca de 10 km de corrida. Nível avançado de evolução.',
    type: 'evolution',
  },
  {
    id: 'ach_mood_boost',
    iconName: 'Smile',
    title: 'Mente resiliente',
    description: 'O humor melhorou em 8 das suas últimas 10 corridas.',
    type: 'evolution',
  },
];

export const AchievementsScreen: React.FC<AchievementsScreenProps> = ({ unlockedAchievements, runs }) => {
  const [activeTab, setActiveTab] = useState<'all' | 'consistency' | 'evolution'>('all');

  const renderIcon = (iconName: string, isUnlocked: boolean) => {
    const color = isUnlocked ? '#CCFF00' : '#606060';
    const size = 20;

    switch (iconName) {
      case 'Calendar':
        return <Calendar size={size} color={color} strokeWidth={1.5} />;
      case 'Award':
        return <Award size={size} color={color} strokeWidth={1.5} />;
      case 'RefreshCw':
        return <RefreshCw size={size} color={color} strokeWidth={1.5} />;
      case 'Flame':
        return <Flame size={size} color={color} strokeWidth={1.5} />;
      case 'Zap':
        return <Zap size={size} color={color} strokeWidth={1.5} />;
      case 'Activity':
        return <Activity size={size} color={color} strokeWidth={1.5} />;
      case 'Trophy':
        return <Trophy size={size} color={color} strokeWidth={1.5} />;
      case 'Smile':
        return <Smile size={size} color={color} strokeWidth={1.5} />;
      default:
        return <Award size={size} color={color} strokeWidth={1.5} />;
    }
  };

  const getAchievementProgress = (id: string): string | undefined => {
    const totalRuns = runs.length;
    const now = new Date();

    switch (id) {
      case 'ach_week_active': {
        const runsLast7Days = runs.filter(r => {
          const diff = (now.getTime() - new Date(r.date).getTime()) / (1000 * 60 * 60 * 24);
          return diff <= 7;
        }).length;
        return `${runsLast7Days}/2 corridas na semana`;
      }
      case 'ach_runs_10': {
        return `${totalRuns}/10 corridas`;
      }
      case 'ach_runs_50': {
        return `${totalRuns}/50 corridas`;
      }
      case 'ach_first_return': {
        return 'Continue correndo para desbloquear';
      }
      case 'ach_3_months': {
        if (totalRuns === 0) return '0/90 dias ativos';
        const firstRunDate = new Date(runs[runs.length - 1].date);
        const diffDays = Math.ceil((now.getTime() - firstRunDate.getTime()) / (1000 * 60 * 60 * 24));
        const currentDays = Math.min(diffDays, 90);
        return `${currentDays}/90 dias ativos`;
      }
      case 'ach_dist_3': {
        const maxDist = totalRuns > 0 ? Math.max(...runs.map(r => r.distance)) : 0;
        return `${maxDist.toFixed(1).replace('.', ',')}/3 km`;
      }
      case 'ach_dist_5': {
        const maxDist = totalRuns > 0 ? Math.max(...runs.map(r => r.distance)) : 0;
        return `${maxDist.toFixed(1).replace('.', ',')}/5 km`;
      }
      case 'ach_dist_10': {
        const maxDist = totalRuns > 0 ? Math.max(...runs.map(r => r.distance)) : 0;
        return `${maxDist.toFixed(1).replace('.', ',')}/10 km`;
      }
      case 'ach_mood_boost': {
        const last10 = runs.slice(0, 10);
        const improvements = last10.filter(r => r.moodAfter > r.moodBefore).length;
        return `${improvements}/8 melhoras`;
      }
      default:
        return undefined;
    }
  };

  const filteredDefinitions = ALL_ACHIEVEMENTS.filter(def => {
    if (activeTab === 'all') return true;
    return def.type === activeTab;
  });

  const unlockedCount = unlockedAchievements.length;
  const totalCount = ALL_ACHIEVEMENTS.length;
  const percentageUnlocked = Math.round((unlockedCount / totalCount) * 100);

  return (
    <View style={styles.container}>
      {/* Header com Progresso Geral */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Conquistas</Text>
        <Text style={styles.headerSubtitle}>Marcos de consistência e evolução pessoal</Text>
        
        {/* Barra de Progresso */}
        <View style={styles.progressContainer}>
          <View style={styles.progressTextRow}>
            <Text style={styles.progressLabel}>{unlockedCount} de {totalCount} conquistas desbloqueadas</Text>
            <Text style={styles.progressValue}>{percentageUnlocked}%</Text>
          </View>
          <View style={styles.progressBarBackground}>
            <View style={[styles.progressBarFill, { width: `${percentageUnlocked}%` }]} />
          </View>
        </View>
      </View>

      {/* Seletor de Abas */}
      <View style={styles.tabSelector}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'all' && styles.tabButtonActive]}
          onPress={() => setActiveTab('all')}
        >
          <Text style={[styles.tabButtonText, activeTab === 'all' && styles.tabButtonTextActive]}>
            Todas
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'consistency' && styles.tabButtonActive]}
          onPress={() => setActiveTab('consistency')}
        >
          <Text style={[styles.tabButtonText, activeTab === 'consistency' && styles.tabButtonTextActive]}>
            Consistência
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'evolution' && styles.tabButtonActive]}
          onPress={() => setActiveTab('evolution')}
        >
          <Text style={[styles.tabButtonText, activeTab === 'evolution' && styles.tabButtonTextActive]}>
            Evolução
          </Text>
        </TouchableOpacity>
      </View>

      {/* Linha do tempo de Conquistas */}
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {filteredDefinitions.map((def, index) => {
          const unlockInfo = unlockedAchievements.find(a => a.id === def.id);
          const isUnlocked = !!unlockInfo;
          
          return (
            <View key={def.id} style={styles.timelineItem}>
              {/* Linha vertical esquerda */}
              <View style={styles.timelineIndicator}>
                <View style={[
                  styles.timelineDot,
                  isUnlocked ? styles.timelineDotUnlocked : styles.timelineDotLocked
                ]}>
                  {isUnlocked ? (
                    <Check size={12} color="#000000" strokeWidth={3} />
                  ) : (
                    <Lock size={10} color="#606060" strokeWidth={1.5} />
                  )}
                </View>
                {index < filteredDefinitions.length - 1 && (
                  <View style={[
                    styles.timelineLine,
                    isUnlocked && filteredDefinitions[index + 1] && unlockedAchievements.some(a => a.id === filteredDefinitions[index + 1].id)
                      ? styles.timelineLineUnlocked
                      : styles.timelineLineLocked
                  ]} />
                )}
              </View>

              {/* Card da Conquista */}
              <View style={{ flex: 1 }}>
                <AchievementCard
                  title={def.title}
                  description={def.description}
                  isUnlocked={isUnlocked}
                  icon={renderIcon(def.iconName, isUnlocked)}
                  unlockedDate={unlockInfo?.date}
                  progressText={getAchievementProgress(def.id)}
                />
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000', // Preto puro
  },
  header: {
    padding: 24,
    paddingTop: 68,
    backgroundColor: '#000000',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '900', // Roboto Black
    fontFamily: 'System',
  },
  headerSubtitle: {
    color: '#A0A0A0',
    fontSize: 13,
    marginTop: 4,
    fontWeight: '300', // Roboto Light
    fontFamily: 'System',
  },
  progressContainer: {
    marginTop: 20,
  },
  progressTextRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressLabel: {
    color: '#A0A0A0',
    fontSize: 12,
    fontWeight: '300',
  },
  progressValue: {
    color: '#CCFF00', // Verde-limão
    fontSize: 12,
    fontWeight: '900', // Roboto Black
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: '#1E1E1E',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#CCFF00', // Verde-limão
    borderRadius: 4,
  },
  tabSelector: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    marginTop: 10,
    marginBottom: 10,
  },
  tabButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: theme.borderRadius.md,
    marginRight: 8,
    backgroundColor: '#1E1E1E',
    borderWidth: 1,
    borderColor: '#262626',
  },
  tabButtonActive: {
    backgroundColor: '#CCFF00',
    borderColor: '#CCFF00',
  },
  tabButtonText: {
    color: '#A0A0A0',
    fontSize: 13,
    fontWeight: '300',
  },
  tabButtonTextActive: {
    color: '#000000',
    fontWeight: '900',
  },
  scrollContainer: {
    padding: 24,
    paddingTop: 8,
    paddingBottom: 100,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  timelineIndicator: {
    width: 24,
    alignItems: 'center',
    marginRight: 16,
  },
  timelineDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  timelineDotUnlocked: {
    backgroundColor: '#CCFF00', // Verde-limão
  },
  timelineDotLocked: {
    backgroundColor: '#1E1E1E',
    borderWidth: 1.5,
    borderColor: '#262626',
  },
  timelineLine: {
    width: 2,
    flex: 1,
    marginTop: 4,
    marginBottom: -24,
  },
  timelineLineUnlocked: {
    backgroundColor: '#CCFF00', // Verde-limão
  },
  timelineLineLocked: {
    backgroundColor: '#262626',
  },
  card: {
    flex: 1,
    borderRadius: theme.borderRadius.md,
    padding: 16,
    borderWidth: 1,
  },
  cardUnlocked: {
    backgroundColor: '#1E1E1E',
    borderColor: '#CCFF00', // Borda verde-limão fina para unlocked
  },
  cardLocked: {
    backgroundColor: 'rgba(30, 30, 30, 0.4)',
    borderColor: '#262626',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  iconCircleUnlocked: {
    backgroundColor: '#000000',
  },
  iconCircleLocked: {
    backgroundColor: '#000000',
  },
  cardTitleContainer: {
    flex: 1,
  },
  cardTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900', // Roboto Black
    fontFamily: 'System',
  },
  cardTitleLocked: {
    color: '#606060',
  },
  unlockDate: {
    color: '#CCFF00',
    fontSize: 12,
    fontWeight: '900', // Roboto Black
    marginTop: 2,
  },
  cardDescription: {
    color: '#A0A0A0',
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '300', // Roboto Light
    fontFamily: 'System',
  },
  cardDescriptionLocked: {
    color: '#606060',
  },
});
