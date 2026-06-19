import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Run {
  id: string;
  date: string; // ISO Date String
  distance: number; // em km (ex: 4.8)
  duration: number; // em segundos
  moodBefore: number; // 1 a 5
  moodAfter: number; // 1 a 5
  notes?: string;
  isAfterLongBreak: boolean;
  stoppedBeforeGoal?: boolean;
  stopReasons?: string[];
  stopNote?: string;
  targetDistanceKm?: number;
}

export interface Achievement {
  id: string;
  icon: string; // nome do ícone (Lucide)
  title: string;
  description: string;
  date: string;
  type: 'consistency' | 'evolution';
}

export interface MemoryCard {
  id: string;
  date: string;
  text: string;
}

export interface UserProfile {
  name: string;
  consistencyScore: number; // 0 a 100
  streak: number; // sequência atual de corridas seguidas
  lastRunDate?: string;
  avatarUri?: string;
  weeklyRunGoal?: number;
}

export const STOP_REASON_LABELS: Record<string, string> = {
  knee_pain: "Joelho doeu",
  back_pain: "Costas doeram",
  foot_pain: "Pé doeu",
  shin_pain: "Canela doeu",
  ankle_pain: "Tornozelo doeu",
  cramps: "Cãibra",
  muscle_pain: "Dor muscular",
  out_of_breath: "Fiquei sem fôlego",
  strong_tiredness: "Cansaço forte",
  felt_bad: "Me senti mal",
  dizziness: "Tontura",
  heat: "Calor atrapalhou",
  no_motivation: "Sem vontade",
  anxiety: "Ansiedade",
  no_time: "Falta de tempo",
  pace_too_hard: "Ritmo pesado demais",
  goal_too_high: "Meta alta demais",
  distraction: "Distração",
  other: "Outro motivo"
};

const KEYS = {
  RUNS: 'bitzrun_runs',
  PROFILE: 'bitzrun_profile',
  ACHIEVEMENTS: 'bitzrun_achievements',
  MEMORY_CARDS: 'bitzrun_memory_cards',
};

// Funções Auxiliares
const getDaysBetween = (d1: Date, d2: Date): number => {
  const diffTime = Math.abs(d2.getTime() - d1.getTime());
  return diffTime / (1000 * 60 * 60 * 24);
};

// Formata data em formato BR amigável (Ex: "17 de Junho")
export const formatFriendlyDate = (dateString: string): string => {
  const date = new Date(dateString);
  const months = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];
  return `${date.getDate()} de ${months[date.getMonth()]}`;
};

export const getMoodEmoji = (mood: number): string => {
  const emojis = ['😭', '😔', '😐', '🙂', '😊'];
  return emojis[Math.min(4, Math.max(0, mood - 1))];
};

export const getMoodText = (mood: number): string => {
  const texts = ['Péssimo', 'Ruim', 'Regular', 'Bom', 'Excelente'];
  return texts[Math.min(4, Math.max(0, mood - 1))];
};

// Lógica de cálculo do Índice de Consistência
export const calculateConsistency = (runs: Run[]): number => {
  if (runs.length === 0) return 0;

  let score = 0;
  const now = new Date();

  // 1. Frequência nos últimos 30 dias (máx 45 pontos)
  // Alvo: 3 corridas por semana = 12 corridas por mês
  const runsLast30Days = runs.filter(run => {
    const runDate = new Date(run.date);
    return getDaysBetween(runDate, now) <= 30;
  });
  const frequencyPoints = Math.min((runsLast30Days.length / 12) * 45, 45);
  score += frequencyPoints;

  // 2. Regularidade / Ausência de pausas longas (máx 20 pontos)
  // Se a última corrida foi há menos de 4 dias, pontuação máxima.
  // Se foi há mais de 7 dias, perde pontuação.
  if (runs.length > 0) {
    const lastRun = runs[0]; // Assumindo ordenado decrescente (mais recente primeiro)
    const daysSinceLastRun = getDaysBetween(new Date(lastRun.date), now);
    if (daysSinceLastRun <= 4) {
      score += 20;
    } else if (daysSinceLastRun <= 7) {
      score += 10;
    } else {
      // Penalidade por inatividade
      score -= Math.min((daysSinceLastRun - 7) * 2, 15);
    }
  }

  // 3. Streak de consistência (máx 15 pontos)
  const streak = calculateCurrentStreak(runs);
  const streakPoints = Math.min(streak * 3, 15);
  score += streakPoints;

  // 4. Bônus por total de sessões registradas (máx 20 pontos)
  const totalSessionsPoints = Math.min(runs.length * 1.5, 20);
  score += totalSessionsPoints;

  // Limitar entre 0 e 100
  return Math.max(0, Math.min(100, Math.round(score)));
};

// Calcula streak atual de corridas seguidas
// Considera uma sequência contínua onde a diferença entre corridas sucessivas é de no máximo 4 dias
export const calculateCurrentStreak = (runs: Run[]): number => {
  if (runs.length === 0) return 0;
  let streak = 1;
  const now = new Date();
  
  // Verifica se a última corrida foi há mais de 4 dias (quebra de streak atual)
  const daysSinceLastRun = getDaysBetween(new Date(runs[0].date), now);
  if (daysSinceLastRun > 4) {
    return 0;
  }

  for (let i = 0; i < runs.length - 1; i++) {
    const currentRunDate = new Date(runs[i].date);
    const nextRunDate = new Date(runs[i + 1].date);
    const diffDays = getDaysBetween(nextRunDate, currentRunDate);
    if (diffDays <= 4) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
};

// Serviço de Armazenamento
export const StorageService = {
  async getProfile(): Promise<UserProfile> {
    try {
      const data = await AsyncStorage.getItem(KEYS.PROFILE);
      if (data) {
        const profile: UserProfile = JSON.parse(data);
        const goal = profile.weeklyRunGoal;
        if (goal === undefined || typeof goal !== 'number' || goal < 2 || goal > 6) {
          profile.weeklyRunGoal = 3;
        }
        return profile;
      }
      
      const defaultProfile: UserProfile = {
        name: 'Corredor',
        consistencyScore: 0,
        streak: 0,
        weeklyRunGoal: 3,
      };
      await AsyncStorage.setItem(KEYS.PROFILE, JSON.stringify(defaultProfile));
      return defaultProfile;
    } catch {
      return { name: 'Corredor', consistencyScore: 0, streak: 0, weeklyRunGoal: 3 };
    }
  },

  async updateProfileName(name: string): Promise<UserProfile> {
    const profile = await this.getProfile();
    profile.name = name;
    await AsyncStorage.setItem(KEYS.PROFILE, JSON.stringify(profile));
    return profile;
  },

  async updateProfileAvatar(avatarUri: string): Promise<UserProfile> {
    const profile = await this.getProfile();
    profile.avatarUri = avatarUri;
    await AsyncStorage.setItem(KEYS.PROFILE, JSON.stringify(profile));
    return profile;
  },

  async updateWeeklyRunGoal(goal: number): Promise<UserProfile> {
    const validGoal = (typeof goal === 'number' && goal >= 2 && goal <= 6) ? goal : 3;
    const profile = await this.getProfile();
    profile.weeklyRunGoal = validGoal;
    await AsyncStorage.setItem(KEYS.PROFILE, JSON.stringify(profile));
    return profile;
  },

  async getRuns(): Promise<Run[]> {
    try {
      const data = await AsyncStorage.getItem(KEYS.RUNS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  async getAchievements(): Promise<Achievement[]> {
    try {
      const data = await AsyncStorage.getItem(KEYS.ACHIEVEMENTS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  async getMemoryCards(): Promise<MemoryCard[]> {
    try {
      const data = await AsyncStorage.getItem(KEYS.MEMORY_CARDS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  async saveRun(newRunData: {
    distance: number;
    duration: number;
    moodBefore: number;
    moodAfter: number;
    notes?: string;
    stoppedBeforeGoal?: boolean;
    stopReasons?: string[];
    stopNote?: string;
    targetDistanceKm?: number;
  }): Promise<{ run: Run; newAchievements: Achievement[]; newMemoryCards: MemoryCard[] }> {
    const runs = await this.getRuns();
    const achievements = await this.getAchievements();
    const memoryCards = await this.getMemoryCards();
    const profile = await this.getProfile();

    const now = new Date();
    
    // Determinar se foi após pausa longa (> 7 dias)
    let isAfterLongBreak = false;
    if (runs.length > 0) {
      const lastRunDate = new Date(runs[0].date);
      const daysSinceLast = getDaysBetween(lastRunDate, now);
      if (daysSinceLast > 7) {
        isAfterLongBreak = true;
      }
    }

    const run: Run = {
      id: Math.random().toString(36).substring(2, 9),
      date: now.toISOString(),
      ...newRunData,
      isAfterLongBreak,
    };

    // Adicionar a nova corrida no início (ordenado por mais recente)
    const updatedRuns = [run, ...runs];
    
    // Recalcular métricas
    const newStreak = calculateCurrentStreak(updatedRuns);
    const newScore = calculateConsistency(updatedRuns);

    // Salvar corridas e atualizar perfil
    await AsyncStorage.setItem(KEYS.RUNS, JSON.stringify(updatedRuns));
    
    const updatedProfile: UserProfile = {
      ...profile,
      consistencyScore: newScore,
      streak: newStreak,
      lastRunDate: run.date,
    };
    await AsyncStorage.setItem(KEYS.PROFILE, JSON.stringify(updatedProfile));

    // LÓGICA DE CARTÕES DE MEMÓRIA (Geração Automática)
    const newMemoryCards: MemoryCard[] = [];
    const dateFriendly = formatFriendlyDate(run.date);

    // 1. Nova distância máxima
    const maxDistanceBefore = runs.length > 0 ? Math.max(...runs.map(r => r.distance)) : 0;
    if (run.distance > maxDistanceBefore) {
      newMemoryCards.push({
        id: `card_dist_${run.id}`,
        date: run.date,
        text: runs.length === 0 
          ? `${dateFriendly} — Primeira corrida concluída. Começando com ${run.distance} km.`
          : `${dateFriendly} — Primeira vez correndo ${run.distance} km sem parar.`,
      });
    }

    // 2. Primeira corrida após pausa longa
    if (isAfterLongBreak && runs.length > 0) {
      const lastRunDate = new Date(runs[0].date);
      const days = Math.round(getDaysBetween(lastRunDate, now));
      newMemoryCards.push({
        id: `card_break_${run.id}`,
        date: run.date,
        text: `${dateFriendly} — Você voltou após ${days} dias. O retorno conta mais do que a velocidade.`,
      });
    }

    // 3. Sequência consecutiva (Streak de 3, 5, 10, 20...)
    if (newStreak >= 3 && newStreak !== profile.streak) {
      const streakMilestones = [3, 5, 10, 20, 50];
      if (streakMilestones.includes(newStreak)) {
        newMemoryCards.push({
          id: `card_streak_${newStreak}_${run.id}`,
          date: run.date,
          text: `${dateFriendly} — Sequência de ${newStreak} corridas seguidas. A consistência se tornou hábito.`,
        });
      }
    }

    // 4. Melhora acentuada de humor (antes <= 2 e depois >= 4)
    if (run.moodBefore <= 2 && run.moodAfter >= 4) {
      newMemoryCards.push({
        id: `card_mood_${run.id}`,
        date: run.date,
        text: `${dateFriendly} — Você saiu sem vontade e voltou melhor. Isso muda o seu dia.`,
      });
    }

    // 5. Corrida interrompida antes da meta
    if (run.stoppedBeforeGoal) {
      const mappedReasons = run.stopReasons
        ? run.stopReasons.map(reasonId => STOP_REASON_LABELS[reasonId] || reasonId)
        : [];
      const reasonsText = mappedReasons.length > 0
        ? `Dificuldade registrada: ${mappedReasons.join(', ')}`
        : 'Interrompida antes da meta';
      const noteText = run.stopNote ? ` (${run.stopNote})` : '';
      newMemoryCards.push({
        id: `card_stop_${run.id}`,
        date: run.date,
        text: `${dateFriendly} — ${reasonsText}${noteText}.`,
      });
    }

    if (newMemoryCards.length > 0) {
      const updatedMemoryCards = [...newMemoryCards, ...memoryCards];
      await AsyncStorage.setItem(KEYS.MEMORY_CARDS, JSON.stringify(updatedMemoryCards));
    }

    // LÓGICA DE CONQUISTAS (Desbloqueio Automático)
    const newAchievements: Achievement[] = [];

    // Função interna para registrar conquista se não existir
    const checkAndAward = (id: string, icon: string, title: string, description: string, type: 'consistency' | 'evolution') => {
      const alreadyHas = achievements.some(a => a.id === id);
      if (!alreadyHas) {
        newAchievements.push({
          id,
          icon,
          title,
          description,
          date: run.date,
          type,
        });
      }
    };

    // 1. Primeira semana ativa: se completou no mínimo 2 corridas em 7 dias
    const runsFirst7Days = updatedRuns.filter(r => getDaysBetween(new Date(r.date), now) <= 7);
    if (runsFirst7Days.length >= 2) {
      checkAndAward('ach_week_active', 'Calendar', 'Primeira semana ativa', 'Registrou pelo menos 2 corridas nos últimos 7 dias.', 'consistency');
    }

    // 2. Marcos de quantidade de sessões (10, 50 corridas)
    if (updatedRuns.length >= 10) {
      checkAndAward('ach_runs_10', 'Award', '10 Corridas registradas', 'Completou 10 sessões de corrida. O hábito está se consolidando.', 'consistency');
    }
    if (updatedRuns.length >= 50) {
      checkAndAward('ach_runs_50', 'Flame', '50 Corridas registradas', '50 passos em direção ao seu novo eu. Incrível consistência.', 'consistency');
    }

    // 3. Primeiro retorno após pausa
    if (isAfterLongBreak) {
      checkAndAward('ach_first_return', 'RefreshCw', 'Primeiro retorno após pausa', 'Voltou a correr após passar mais de 7 dias inativo.', 'consistency');
    }

    // 4. Marcos de evolução (Primeira vez atingindo 3km, 5km, 10km)
    if (run.distance >= 3) {
      checkAndAward('ach_dist_3', 'Zap', 'Barreira dos 3 km', 'Completou sua primeira corrida de pelo menos 3 km.', 'evolution');
    }
    if (run.distance >= 5) {
      checkAndAward('ach_dist_5', 'Activity', 'Superação de 5 km', 'Correu 5 km ou mais em uma única sessão. Excelente marca!', 'evolution');
    }
    if (run.distance >= 10) {
      checkAndAward('ach_dist_10', 'Trophy', 'Os grandes 10 km', 'Atingiu a incrível marca de 10 km de corrida. Nível avançado de evolução.', 'evolution');
    }

    // 5. Humor melhorou em 8 de cada 10 corridas
    if (updatedRuns.length >= 10) {
      const last10Runs = updatedRuns.slice(0, 10);
      const improvedMoodCount = last10Runs.filter(r => r.moodAfter > r.moodBefore).length;
      if (improvedMoodCount >= 8) {
        checkAndAward('ach_mood_boost', 'Smile', 'Mente resiliente', 'O humor melhorou em 8 das suas últimas 10 corridas.', 'evolution');
      }
    }

    if (newAchievements.length > 0) {
      const updatedAchievements = [...newAchievements, ...achievements];
      await AsyncStorage.setItem(KEYS.ACHIEVEMENTS, JSON.stringify(updatedAchievements));
    }

    return {
      run,
      newAchievements,
      newMemoryCards,
    };
  },

  async clearAll(): Promise<void> {
    await AsyncStorage.removeItem(KEYS.RUNS);
    await AsyncStorage.removeItem(KEYS.PROFILE);
    await AsyncStorage.removeItem(KEYS.ACHIEVEMENTS);
    await AsyncStorage.removeItem(KEYS.MEMORY_CARDS);
  }
};
