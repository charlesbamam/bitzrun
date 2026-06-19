import React, { useState, useEffect } from 'react';
import { StyleSheet, View, SafeAreaView, TouchableOpacity, Text, StatusBar, Alert, Share } from 'react-native';
import { Calendar, Award, TrendingUp, RotateCcw } from 'lucide-react-native';

import { StorageService, Run, Achievement, MemoryCard, UserProfile } from './src/services/storage';

// Telas
import { LoginScreen } from './src/screens/LoginScreen';
import { RegisterScreen } from './src/screens/RegisterScreen';
import { LoginTransitionScreen } from './src/screens/LoginTransitionScreen';
import { DashboardScreen } from './src/screens/DashboardScreen';
import { StartRunScreen } from './src/screens/StartRunScreen';
import { EndRunScreen } from './src/screens/EndRunScreen';
import { MoodFeedbackScreen } from './src/screens/MoodFeedbackScreen';
import { AchievementsScreen } from './src/screens/AchievementsScreen';
import { JourneyScreen } from './src/screens/JourneyScreen';
import { ProfileScreen } from './src/screens/ProfileScreen';

// Componentes
import { BottomTabs } from './src/components/BottomTabs';

type TabType = 'dashboard' | 'achievements' | 'journey';
type FlowType = 'setup' | 'running' | 'end_run' | 'mood_feedback' | 'profile' | null;

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [activeFlow, setActiveFlow] = useState<FlowType>(null);

  // Fluxo: Login → animação → Dashboard
  // isAuthenticated começa false → app abre no Login
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [pendingUserName, setPendingUserName] = useState('');

  // Dados Globais
  const [runs, setRuns] = useState<Run[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [memoryCards, setMemoryCards] = useState<MemoryCard[]>([]);
  const [profile, setProfile] = useState<UserProfile>({ name: 'Corredor', consistencyScore: 0, streak: 0 });

  // Dados Temporários da Corrida Ativa
  const [tempRunData, setTempRunData] = useState<{
    durationSeconds: number;
    distanceKm: number;
    moodBefore: number;
    goalText: string;
  } | null>(null);

  // Carregar dados do storage (histórico, conquistas, perfil)
  const loadData = async () => {
    try {
      const loadedRuns = await StorageService.getRuns();
      const loadedAchievements = await StorageService.getAchievements();
      const loadedMemoryCards = await StorageService.getMemoryCards();
      const loadedProfile = await StorageService.getProfile();

      setRuns(loadedRuns);
      setAchievements(loadedAchievements);
      setMemoryCards(loadedMemoryCards);
      setProfile(loadedProfile);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Após login ou cadastro: dispara a animação de transição
  const handleAuthSuccess = (userName: string) => {
    setPendingUserName(userName);
    setIsTransitioning(true);
  };

  // Fim da animação: vai ao Dashboard
  const handleTransitionFinish = async () => {
    try {
      const updatedProfile = await StorageService.updateProfileName(pendingUserName);
      setProfile(updatedProfile);
      setIsAuthenticated(true);
      setIsTransitioning(false);
      setActiveTab('dashboard');
    } catch (error) {
      Alert.alert('Erro', 'Ocorreu um erro ao salvar o perfil.');
      setIsTransitioning(false);
    }
  };

  // Entrada como visitante
  const handleGuestEntry = () => {
    handleAuthSuccess('Visitante');
  };

  // Atualizar perfil do Dashboard
  const handleProfileUpdate = (updatedProfile: UserProfile) => {
    setProfile(updatedProfile);
  };

  // Logout: volta ao Login
  const handleSignOut = () => {
    Alert.alert(
      'Sair da conta',
      'Deseja realmente sair?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sair',
          style: 'destructive',
          onPress: () => {
            setIsAuthenticated(false);
            setIsTransitioning(false);
            setAuthMode('login');
            setActiveFlow(null);
            setTempRunData(null);
            setActiveTab('dashboard');
          },
        },
      ]
    );
  };

  // --- Fluxo de Corrida ---
  const handleStartRunFlow = () => setActiveFlow('setup');

  const handleCancelRunFlow = () => {
    setActiveFlow(null);
    setTempRunData(null);
  };

  const handleFinishRun = (durationSeconds: number, distanceKm: number, moodBefore: number, goalText: string) => {
    setTempRunData({ durationSeconds, distanceKm, moodBefore, goalText });
    setActiveFlow('end_run');
  };

  const handleGoToMoodFeedback = () => setActiveFlow('mood_feedback');

  const handleCompleteRunFlow = async (unlockedAchievements: Achievement[], unlockedMemoryCards: MemoryCard[]) => {
    await loadData();
    setActiveFlow(null);
    setTempRunData(null);
    if (unlockedAchievements.length > 0) {
      setActiveTab('achievements');
    } else {
      setActiveTab('dashboard');
    }
  };

  // Compartilhamento geral
  const handleShareAll = async () => {
    try {
      const message = `Bitzrun — Minha Consistência de Corrida está em ${profile.consistencyScore}/100! Já completei ${runs.length} sessões.\n\nDesenvolva consistência você também!`;
      await Share.share({ message });
    } catch {
      Alert.alert('Erro', 'Não foi possível compartilhar.');
    }
  };

  // Resetar dados de teste
  const handleResetData = () => {
    Alert.alert(
      'Resetar dados de teste',
      'Isso limpará todo o histórico de corridas, conquistas e cartões de memória.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Resetar tudo',
          style: 'destructive',
          onPress: async () => {
            await StorageService.clearAll();
            await loadData();
            setActiveTab('dashboard');
            setActiveFlow(null);
            setTempRunData(null);
            Alert.alert('Sucesso', 'Dados de teste apagados.');
          },
        },
      ]
    );
  };

  // ---- RENDER ----

  // 1. Animação curta após login/cadastro
  if (isTransitioning) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#000000" />
        <LoginTransitionScreen
          userName={pendingUserName}
          onFinish={handleTransitionFinish}
        />
      </View>
    );
  }

  // 2. Telas de autenticação (Login ou Cadastro)
  if (!isAuthenticated) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#000000" />
        {authMode === 'login' ? (
          <LoginScreen
            onSuccess={handleAuthSuccess}
            onNavigateToRegister={() => setAuthMode('register')}
            onGuestEntry={handleGuestEntry}
          />
        ) : (
          <RegisterScreen
            onSuccess={handleAuthSuccess}
            onNavigateToLogin={() => setAuthMode('login')}
          />
        )}
      </View>
    );
  }

  // 3. Aplicativo autenticado
  const showTabBar = activeFlow === null;

  const renderScreen = () => {
    if (activeFlow === 'profile') {
      return (
        <ProfileScreen
          profile={profile}
          runs={runs}
          onBack={() => setActiveFlow(null)}
          onSignOut={handleSignOut}
          onProfileUpdate={handleProfileUpdate}
        />
      );
    }

    if (activeFlow === 'setup' || activeFlow === 'running') {
      return (
        <StartRunScreen
          onCancel={handleCancelRunFlow}
          onFinishRun={handleFinishRun}
        />
      );
    }

    if (activeFlow === 'end_run' && tempRunData) {
      return (
        <EndRunScreen
          durationSeconds={tempRunData.durationSeconds}
          distanceKm={tempRunData.distanceKm}
          runs={runs}
          onNext={handleGoToMoodFeedback}
        />
      );
    }

    if (activeFlow === 'mood_feedback' && tempRunData) {
      return (
        <MoodFeedbackScreen
          moodBefore={tempRunData.moodBefore}
          distanceKm={tempRunData.distanceKm}
          durationSeconds={tempRunData.durationSeconds}
          onComplete={handleCompleteRunFlow}
        />
      );
    }

    switch (activeTab) {
      case 'dashboard':
        return (
          <DashboardScreen
            onStartRunPress={handleStartRunFlow}
            onNavigateToJourney={() => setActiveTab('journey')}
            lastRun={runs.length > 0 ? runs[0] : null}
            profile={profile}
            runs={runs}
            onProfileUpdate={handleProfileUpdate}
            onSignOut={() => setActiveFlow('profile')}
          />
        );
      case 'achievements':
        return <AchievementsScreen unlockedAchievements={achievements} />;
      case 'journey':
        return (
          <JourneyScreen
            runs={runs}
            memoryCards={memoryCards}
            onShareAll={handleShareAll}
          />
        );
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />

      {/* Botão de reset para testes */}
      {showTabBar && (
        <TouchableOpacity style={styles.resetButton} onPress={handleResetData} activeOpacity={0.7}>
          <RotateCcw size={14} color="#A0A0A0" />
          <Text style={styles.resetButtonText}>Limpar testes</Text>
        </TouchableOpacity>
      )}

      {/* Conteúdo Principal */}
      <View style={styles.mainContent}>
        {renderScreen()}
      </View>

      {/* Barra de Navegação Inferior */}
      {showTabBar && (
        <BottomTabs
          activeTab={activeTab}
          activeFlow={activeFlow}
          onTabPress={setActiveTab}
          onStartRunPress={handleStartRunFlow}
          onProfilePress={() => setActiveFlow('profile')}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  mainContent: {
    flex: 1,
  },
  resetButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 999,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E1E1E',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#262626',
  },
  resetButtonText: {
    color: '#A0A0A0',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 6,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#121212',
    height: 80,
    borderTopWidth: 1,
    borderTopColor: '#262626',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: 12,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingVertical: 8,
  },
  tabItemActive: {
    transform: [{ scale: 1.05 }],
  },
  tabLabel: {
    color: '#A0A0A0',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
    fontFamily: 'System',
  },
  tabLabelActive: {
    color: '#CCFF00',
    fontWeight: 'bold',
  },
});
