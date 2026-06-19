import React from 'react';
import { StyleSheet, Text, TouchableOpacity, SafeAreaView, View } from 'react-native';
import { Calendar, Award, TrendingUp, Flame, User } from 'lucide-react-native';
import { theme } from '../theme/theme';

type TabType = 'dashboard' | 'achievements' | 'journey';
type FlowType = 'setup' | 'running' | 'end_run' | 'mood_feedback' | 'profile' | null;

interface BottomTabsProps {
  activeTab: TabType;
  activeFlow: FlowType;
  onTabPress: (tab: TabType) => void;
  onStartRunPress: () => void;
  onProfilePress: () => void;
}

export const BottomTabs: React.FC<BottomTabsProps> = ({
  activeTab,
  activeFlow,
  onTabPress,
  onStartRunPress,
  onProfilePress,
}) => {
  const isProfileActive = activeFlow === 'profile';
  const isHomeActive = activeFlow === null && activeTab === 'dashboard';
  const isJourneyActive = activeFlow === null && activeTab === 'journey';
  const isAchievementsActive = activeFlow === null && activeTab === 'achievements';

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Hoje */}
        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => {
            onTabPress('dashboard');
            // Fechar qualquer fluxo de tela cheia que esteja aberto
            if (activeFlow) {
              onTabPress('dashboard');
            }
          }}
          activeOpacity={0.7}
        >
          <Calendar size={18} color={isHomeActive ? theme.colors.primary : theme.colors.textSecondary} />
          <Text style={[styles.tabLabel, isHomeActive && styles.tabLabelActive]}>Hoje</Text>
        </TouchableOpacity>

        {/* Jornada */}
        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => onTabPress('journey')}
          activeOpacity={0.7}
        >
          <TrendingUp size={18} color={isJourneyActive ? theme.colors.primary : theme.colors.textSecondary} />
          <Text style={[styles.tabLabel, isJourneyActive && styles.tabLabelActive]}>Jornada</Text>
        </TouchableOpacity>

        {/* Central: Correr */}
        <TouchableOpacity
          style={styles.centerTabContainer}
          onPress={onStartRunPress}
          activeOpacity={0.8}
        >
          <View style={styles.centerButton}>
            <Flame size={24} color={theme.colors.background} strokeWidth={2} />
          </View>
          <Text style={[styles.tabLabel, styles.centerLabel]}>Correr</Text>
        </TouchableOpacity>

        {/* Conquistas */}
        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => onTabPress('achievements')}
          activeOpacity={0.7}
        >
          <Award size={18} color={isAchievementsActive ? theme.colors.primary : theme.colors.textSecondary} />
          <Text style={[styles.tabLabel, isAchievementsActive && styles.tabLabelActive]}>Conquistas</Text>
        </TouchableOpacity>

        {/* Perfil */}
        <TouchableOpacity
          style={styles.tabItem}
          onPress={onProfilePress}
          activeOpacity={0.7}
        >
          <User size={18} color={isProfileActive ? theme.colors.primary : theme.colors.textSecondary} />
          <Text style={[styles.tabLabel, isProfileActive && styles.tabLabelActive]}>Perfil</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#0F0F10',
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  container: {
    flexDirection: 'row',
    height: 68,
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.xs,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    height: '100%',
    paddingVertical: theme.spacing.xs,
  },
  tabLabel: {
    color: theme.colors.textSecondary,
    fontSize: 10,
    fontWeight: '600',
    marginTop: 4,
  },
  tabLabelActive: {
    color: theme.colors.primary,
    fontWeight: 'bold',
  },
  centerTabContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginTop: -16, // Elevação suave para destaque visual no iOS
  },
  centerButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadows.medium,
  },
  centerLabel: {
    color: theme.colors.primary,
    fontWeight: 'bold',
    marginTop: 2,
  },
});
