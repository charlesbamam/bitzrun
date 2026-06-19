import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, ScrollView, Alert } from 'react-native';
import { ChevronLeft, LogOut, User, Activity, Clock, ShieldAlert, Award, Calendar, Flame } from 'lucide-react-native';
import { UserProfile, Run } from '../services/storage';

interface ProfileScreenProps {
  profile: UserProfile;
  runs: Run[];
  onBack: () => void;
  onSignOut: () => void;
  onProfileUpdate: (updatedProfile: UserProfile) => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  profile,
  runs,
  onBack,
  onSignOut,
  onProfileUpdate,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(profile.name);
  const [weeklyGoal, setWeeklyGoal] = useState('3'); // Padrão: 3 corridas por semana

  // Estatísticas acumuladas
  const totalRuns = runs.length;
  const totalDistance = runs.reduce((acc, run) => acc + run.distance, 0);
  const totalDurationSeconds = runs.reduce((acc, run) => acc + run.duration, 0);
  
  const formatTotalTime = (secs: number) => {
    const hrs = Math.floor(secs / 3600);
    const mins = Math.floor((secs % 3600) / 60);
    if (hrs > 0) {
      return `${hrs}h ${mins}m`;
    }
    return `${mins} min`;
  };

  const getAveragePace = () => {
    if (totalDistance === 0) return '0:00';
    const totalMinutes = totalDurationSeconds / 60;
    const paceDecimal = totalMinutes / totalDistance;
    const mins = Math.floor(paceDecimal);
    const secs = Math.round((paceDecimal - mins) * 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSave = () => {
    if (!name.trim()) {
      Alert.alert('Erro', 'O nome não pode estar em branco.');
      return;
    }
    onProfileUpdate({
      ...profile,
      name: name.trim()
    });
    setIsEditing(false);
  };

  return (
    <View style={styles.container}>
      {/* Cabeçalho */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <ChevronLeft size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Meu Perfil</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
        {/* Info do Usuário */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarCircle}>
            <User size={48} color="#CCFF00" strokeWidth={1.5} />
          </View>

          {isEditing ? (
            <View style={styles.editNameWrapper}>
              <TextInput
                style={styles.nameInput}
                value={name}
                onChangeText={setName}
                maxLength={20}
                placeholder="Seu nome"
                placeholderTextColor="#666666"
                autoFocus
              />
              <TouchableOpacity style={styles.saveNameBtn} onPress={handleSave}>
                <Text style={styles.saveBtnText}>SALVAR</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.nameWrapper}>
              <Text style={styles.userName}>{profile.name}</Text>
              <TouchableOpacity style={styles.editButton} onPress={() => setIsEditing(true)}>
                <Text style={styles.editButtonText}>Editar nome</Text>
              </TouchableOpacity>
            </View>
          )}

          <View style={styles.badgeRow}>
            <View style={styles.streakBadge}>
              <Flame size={14} color="#000000" strokeWidth={2} />
              <Text style={styles.streakText}>{profile.streak} dias de ofensiva</Text>
            </View>
          </View>
        </View>

        {/* Estatísticas Acumuladas */}
        <Text style={styles.sectionTitle}>Estatísticas Gerais</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Activity size={20} color="#CCFF00" strokeWidth={1.5} style={styles.statIcon} />
            <Text style={styles.statVal}>{totalDistance.toFixed(1).replace('.', ',')} km</Text>
            <Text style={styles.statLbl}>Distância Total</Text>
          </View>

          <View style={styles.statCard}>
            <Clock size={20} color="#CCFF00" strokeWidth={1.5} style={styles.statIcon} />
            <Text style={styles.statVal}>{formatTotalTime(totalDurationSeconds)}</Text>
            <Text style={styles.statLbl}>Tempo Total</Text>
          </View>

          <View style={styles.statCard}>
            <Award size={20} color="#CCFF00" strokeWidth={1.5} style={styles.statIcon} />
            <Text style={styles.statVal}>{totalRuns}</Text>
            <Text style={styles.statLbl}>Corridas Feitas</Text>
          </View>

          <View style={styles.statCard}>
            <Flame size={20} color="#CCFF00" strokeWidth={1.5} style={styles.statIcon} />
            <Text style={styles.statVal}>{getAveragePace()} /km</Text>
            <Text style={styles.statLbl}>Pace Médio</Text>
          </View>
        </View>

        {/* Metas Semanais */}
        <Text style={styles.sectionTitle}>Configurações de Metas</Text>
        <View style={styles.card}>
          <View style={styles.goalRow}>
            <View>
              <Text style={styles.cardItemTitle}>Meta de Treinos Semanal</Text>
              <Text style={styles.cardItemDesc}>Corridas planejadas por semana</Text>
            </View>
            <View style={styles.goalSelector}>
              {['2', '3', '4', '5'].map(num => (
                <TouchableOpacity
                  key={num}
                  style={[
                    styles.goalNumBtn,
                    weeklyGoal === num && styles.goalNumBtnActive
                  ]}
                  onPress={() => setWeeklyGoal(num)}
                >
                  <Text style={[
                    styles.goalNumText,
                    weeklyGoal === num && styles.goalNumTextActive
                  ]}>{num}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.goalRow}>
            <View>
              <Text style={styles.cardItemTitle}>Foco da Consistência</Text>
              <Text style={styles.cardItemDesc}>Pontuação atual: {profile.consistencyScore}/100</Text>
            </View>
            <View style={styles.scoreIndicator}>
              <Text style={styles.scoreText}>{profile.consistencyScore}%</Text>
            </View>
          </View>
        </View>

        {/* Botão de Logout */}
        <TouchableOpacity style={styles.logoutButton} onPress={onSignOut} activeOpacity={0.85}>
          <LogOut size={18} color="#FF4444" strokeWidth={2} style={{ marginRight: 8 }} />
          <Text style={styles.logoutText}>SAIR DA CONTA</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1E1E1E',
  },
  backButton: {
    padding: 8,
    backgroundColor: '#1E1E1E',
    borderRadius: 16,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '900',
    fontFamily: 'System',
  },
  headerSpacer: {
    width: 40,
  },
  contentContainer: {
    padding: 24,
    paddingBottom: 40,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 36,
  },
  avatarCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#1E1E1E',
    borderWidth: 1.5,
    borderColor: '#262626',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  nameWrapper: {
    alignItems: 'center',
  },
  userName: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '900',
    fontFamily: 'System',
  },
  editButton: {
    marginTop: 6,
    paddingVertical: 4,
    paddingHorizontal: 12,
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
  },
  editButtonText: {
    color: '#CCFF00',
    fontSize: 12,
    fontWeight: '700',
  },
  editNameWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E1E1E',
    borderRadius: 16,
    paddingHorizontal: 12,
    width: '100%',
    height: 52,
    borderWidth: 1,
    borderColor: '#CCFF00',
  },
  nameInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  saveNameBtn: {
    backgroundColor: '#CCFF00',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  saveBtnText: {
    color: '#000000',
    fontSize: 12,
    fontWeight: '900',
  },
  badgeRow: {
    marginTop: 12,
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#CCFF00',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  streakText: {
    color: '#000000',
    fontSize: 11,
    fontWeight: '900',
    marginLeft: 4,
  },
  sectionTitle: {
    color: '#CCFF00',
    fontSize: 12,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 16,
    marginTop: 12,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statCard: {
    width: '48%',
    backgroundColor: '#1E1E1E',
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#262626',
  },
  statIcon: {
    marginBottom: 8,
  },
  statVal: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '900',
  },
  statLbl: {
    color: '#A0A0A0',
    fontSize: 12,
    fontWeight: '300',
    marginTop: 2,
  },
  card: {
    backgroundColor: '#1E1E1E',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#262626',
    marginBottom: 28,
  },
  goalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardItemTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '900',
  },
  cardItemDesc: {
    color: '#A0A0A0',
    fontSize: 12,
    fontWeight: '300',
    marginTop: 2,
  },
  goalSelector: {
    flexDirection: 'row',
    backgroundColor: '#000000',
    borderRadius: 12,
    padding: 4,
  },
  goalNumBtn: {
    width: 28,
    height: 28,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 2,
  },
  goalNumBtnActive: {
    backgroundColor: '#CCFF00',
  },
  goalNumText: {
    color: '#A0A0A0',
    fontSize: 12,
    fontWeight: '900',
  },
  goalNumTextActive: {
    color: '#000000',
  },
  divider: {
    height: 1,
    backgroundColor: '#262626',
    marginVertical: 16,
  },
  scoreIndicator: {
    backgroundColor: 'rgba(204, 255, 0, 0.1)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  scoreText: {
    color: '#CCFF00',
    fontSize: 13,
    fontWeight: '900',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1E1E1E',
    borderWidth: 1.5,
    borderColor: '#FF4444',
    borderRadius: 24,
    paddingVertical: 14,
    width: '100%',
  },
  logoutText: {
    color: '#FF4444',
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 1,
  },
});
