import React from 'react';
import { StyleSheet, Text, TouchableOpacity, SafeAreaView, View } from 'react-native';
import { Calendar, Award, TrendingUp } from 'lucide-react-native';
import { theme } from '../theme/theme';

type TabType = 'dashboard' | 'achievements' | 'journey';

interface BottomTabsProps {
  activeTab: TabType;
  onTabPress: (tab: TabType) => void;
}

export const BottomTabs: React.FC<BottomTabsProps> = ({
  activeTab,
  onTabPress,
}) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <TouchableOpacity
          style={[styles.tabItem, activeTab === 'dashboard' && styles.tabItemActive]}
          onPress={() => onTabPress('dashboard')}
          activeOpacity={0.7}
        >
          <Calendar size={20} color={activeTab === 'dashboard' ? theme.colors.primary : theme.colors.textSecondary} />
          <Text style={[styles.tabLabel, activeTab === 'dashboard' && styles.tabLabelActive]}>Hoje</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabItem, activeTab === 'achievements' && styles.tabItemActive]}
          onPress={() => onTabPress('achievements')}
          activeOpacity={0.7}
        >
          <Award size={20} color={activeTab === 'achievements' ? theme.colors.primary : theme.colors.textSecondary} />
          <Text style={[styles.tabLabel, activeTab === 'achievements' && styles.tabLabelActive]}>Conquistas</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabItem, activeTab === 'journey' && styles.tabItemActive]}
          onPress={() => onTabPress('journey')}
          activeOpacity={0.7}
        >
          <TrendingUp size={20} color={activeTab === 'journey' ? theme.colors.primary : theme.colors.textSecondary} />
          <Text style={[styles.tabLabel, activeTab === 'journey' && styles.tabLabelActive]}>Jornada</Text>
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
    height: 64,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingVertical: theme.spacing.xs,
  },
  tabItemActive: {
    transform: [{ scale: 1.02 }],
  },
  tabLabel: {
    color: theme.colors.textSecondary,
    fontSize: 11,
    fontWeight: '600',
    marginTop: 4,
  },
  tabLabelActive: {
    color: theme.colors.primary,
    fontWeight: 'bold',
  },
});
