import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, ScrollView, Alert, Image } from 'react-native';
import { ChevronLeft, UserRound, Activity, Clock, Trophy, Flame, Route } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { UserProfile, Run, StorageService } from '../services/storage';
import { theme } from '../theme/theme';
import { ScreenContainer } from '../components/ScreenContainer';
import { AppCard } from '../components/AppCard';
import { AppButton } from '../components/AppButton';
import { BitzIcon } from '../components/BitzIcon';

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
  const [weeklyGoal, setWeeklyGoal] = useState<number>(profile.weeklyRunGoal ?? 3);

  React.useEffect(() => {
    setWeeklyGoal(profile.weeklyRunGoal ?? 3);
  }, [profile.weeklyRunGoal]);

  const handleUpdateWeeklyGoal = async (goal: number) => {
    const updated = await StorageService.updateWeeklyRunGoal(goal);
    onProfileUpdate(updated);
    setWeeklyGoal(goal);
  };

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

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Erro', 'O nome não pode estar em branco.');
      return;
    }
    const updated = await StorageService.updateProfileName(name.trim());
    onProfileUpdate(updated);
    setIsEditing(false);
  };

  const handleSelectImage = async () => {
    try {
      // Solicitar permissão da galeria de forma amigável
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permissão necessária',
          'Precisamos da permissão para acessar a galeria de fotos para alterar sua foto de perfil.'
        );
        return;
      }

      // Abrir o seletor de imagens
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const uri = result.assets[0].uri;
        const updated = await StorageService.updateProfileAvatar(uri);
        onProfileUpdate(updated);
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar a imagem selecionada.');
    }
  };

  return (
    <ScreenContainer scrollable avoidKeyboard>
      {/* Cabeçalho */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <BitzIcon icon={ChevronLeft} size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Meu Perfil</Text>
        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.contentContainer}>
        {/* Info do Usuário */}
        <View style={styles.avatarSection}>
          <TouchableOpacity style={styles.avatarCircle} onPress={handleSelectImage} activeOpacity={0.8}>
            {profile.avatarUri ? (
              <Image source={{ uri: profile.avatarUri }} style={styles.avatarImage} />
            ) : (
              <BitzIcon icon={UserRound} size={40} color={theme.colors.primary} />
            )}
          </TouchableOpacity>
          <TouchableOpacity onPress={handleSelectImage} activeOpacity={0.7} style={styles.avatarLink}>
            <Text style={styles.avatarLinkText}>Alterar foto</Text>
          </TouchableOpacity>

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
              <BitzIcon icon={Flame} size={14} color={theme.colors.background} strokeWidth={2.5} />
              <Text style={styles.streakText}>{profile.streak} dias de ofensiva</Text>
            </View>
          </View>
        </View>

        {/* Estatísticas Acumuladas */}
        <Text style={styles.sectionTitle}>Estatísticas Gerais</Text>
        <View style={styles.statsGrid}>
          <AppCard style={styles.statCard}>
            <BitzIcon icon={Route} size={20} color={theme.colors.primary} style={styles.statIcon} />
            <Text style={styles.statVal}>{totalDistance.toFixed(1).replace('.', ',')} km</Text>
            <Text style={styles.statLbl}>Distância Total</Text>
          </AppCard>

          <AppCard style={styles.statCard}>
            <BitzIcon icon={Clock} size={20} color={theme.colors.primary} style={styles.statIcon} />
            <Text style={styles.statVal}>{formatTotalTime(totalDurationSeconds)}</Text>
            <Text style={styles.statLbl}>Tempo Total</Text>
          </AppCard>

          <AppCard style={styles.statCard}>
            <BitzIcon icon={Trophy} size={20} color={theme.colors.primary} style={styles.statIcon} />
            <Text style={styles.statVal}>{totalRuns}</Text>
            <Text style={styles.statLbl}>Corridas Feitas</Text>
          </AppCard>

          <AppCard style={styles.statCard}>
            <BitzIcon icon={Activity} size={20} color={theme.colors.primary} style={styles.statIcon} />
            <Text style={styles.statVal}>{getAveragePace()} /km</Text>
            <Text style={styles.statLbl}>Pace Médio</Text>
          </AppCard>
        </View>

        {/* Metas Semanais */}
        <Text style={styles.sectionTitle}>Meta da semana</Text>
        <AppCard style={styles.card}>
          <View style={styles.goalRow}>
            <View style={styles.goalTextContainer}>
              <Text style={styles.cardItemTitle}>Meta da semana</Text>
              <Text style={styles.cardItemDesc}>{weeklyGoal} corridas por semana</Text>
            </View>
            <View style={styles.goalSelector}>
              {[2, 3, 4, 5, 6].map(num => (
                <TouchableOpacity
                  key={num}
                  style={[
                    styles.goalNumBtn,
                    weeklyGoal === num && styles.goalNumBtnActive
                  ]}
                  onPress={() => handleUpdateWeeklyGoal(num)}
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
        </AppCard>

        {/* Botão de Sair da Conta */}
        <AppButton
          title="SAIR DA CONTA"
          onPress={onSignOut}
          variant="outline"
          style={styles.logoutButton}
          textStyle={styles.logoutText}
        />

        {/* Identificação de Versão/Build */}
        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>Bitzrun v0.1.0 (Teste Público 01)</Text>
          <Text style={styles.buildDateText}>Build: 22/06/2026</Text>
        </View>
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    color: theme.colors.text,
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerSpacer: {
    width: 40,
  },
  contentContainer: {
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.xxl,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  avatarCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: theme.colors.card,
    borderWidth: 1.5,
    borderColor: theme.colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  avatarLink: {
    marginTop: theme.spacing.xs,
    paddingVertical: theme.spacing.xs,
  },
  avatarLinkText: {
    color: theme.colors.primary,
    fontSize: 12,
    fontWeight: '700',
  },
  nameWrapper: {
    alignItems: 'center',
    marginTop: theme.spacing.sm,
  },
  userName: {
    color: theme.colors.text,
    fontSize: 24,
    fontWeight: 'bold',
  },
  editButton: {
    marginTop: 6,
    paddingVertical: 4,
    paddingHorizontal: 12,
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.md,
  },
  editButtonText: {
    color: theme.colors.primary,
    fontSize: 12,
    fontWeight: '700',
  },
  editNameWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: 12,
    width: '100%',
    height: 52,
    borderWidth: 1,
    borderColor: theme.colors.primary,
    marginTop: theme.spacing.sm,
  },
  nameInput: {
    flex: 1,
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
  saveNameBtn: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: theme.borderRadius.sm,
  },
  saveBtnText: {
    color: theme.colors.background,
    fontSize: 12,
    fontWeight: 'bold',
  },
  badgeRow: {
    marginTop: 12,
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: theme.borderRadius.sm,
  },
  streakText: {
    color: theme.colors.background,
    fontSize: 11,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  sectionTitle: {
    color: theme.colors.primary,
    fontSize: 11,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: theme.spacing.md,
    marginTop: theme.spacing.lg,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.sm,
  },
  statCard: {
    width: '48%',
    marginBottom: theme.spacing.md,
    padding: theme.spacing.md,
  },
  statIcon: {
    marginBottom: 8,
  },
  statVal: {
    color: theme.colors.text,
    fontSize: 18,
    fontWeight: 'bold',
  },
  statLbl: {
    color: theme.colors.textSecondary,
    fontSize: 11,
    fontWeight: '500',
    marginTop: 2,
  },
  card: {
    marginBottom: theme.spacing.lg,
    padding: theme.spacing.lg,
  },
  goalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  goalTextContainer: {
    flex: 1,
    marginRight: theme.spacing.sm,
  },
  cardItemTitle: {
    color: theme.colors.text,
    fontSize: 14,
    fontWeight: 'bold',
  },
  cardItemDesc: {
    color: theme.colors.textSecondary,
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2,
  },
  goalSelector: {
    flexDirection: 'row',
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.md,
    padding: 4,
  },
  goalNumBtn: {
    width: 28,
    height: 28,
    borderRadius: theme.borderRadius.sm,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 2,
  },
  goalNumBtnActive: {
    backgroundColor: theme.colors.primary,
  },
  goalNumText: {
    color: theme.colors.textSecondary,
    fontSize: 12,
    fontWeight: 'bold',
  },
  goalNumTextActive: {
    color: theme.colors.background,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginVertical: theme.spacing.md,
  },
  scoreIndicator: {
    backgroundColor: 'rgba(204, 255, 0, 0.1)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: theme.borderRadius.sm,
  },
  scoreText: {
    color: theme.colors.primary,
    fontSize: 13,
    fontWeight: 'bold',
  },
  logoutButton: {
    borderColor: theme.colors.error,
    marginTop: theme.spacing.md,
  },
  logoutText: {
    color: theme.colors.error,
  },
  versionContainer: {
    alignItems: 'center',
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing.sm,
    opacity: 0.5,
  },
  versionText: {
    color: theme.colors.textSecondary,
    fontSize: 12,
    fontWeight: '600',
  },
  buildDateText: {
    color: theme.colors.textSecondary,
    fontSize: 10,
    marginTop: 2,
  },
});
