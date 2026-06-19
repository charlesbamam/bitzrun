import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Alert, TouchableOpacity } from 'react-native';
import { User, Flame } from 'lucide-react-native';
import { theme } from '../theme/theme';
import { ScreenContainer } from '../components/ScreenContainer';
import { AppButton } from '../components/AppButton';
import { AppCard } from '../components/AppCard';

interface RegisterScreenProps {
  onSuccess: (userName: string) => void;
  onNavigateToLogin: () => void;
}

export const RegisterScreen: React.FC<RegisterScreenProps> = ({ onSuccess, onNavigateToLogin }) => {
  const [name, setName] = useState('');
  const [nameFocused, setNameFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = () => {
    if (!name.trim()) {
      Alert.alert('Nome vazio', 'Por favor, informe como prefere ser chamado.');
      return;
    }

    setIsLoading(true);

    // Simulação rápida de cadastro local
    setTimeout(() => {
      setIsLoading(false);
      onSuccess(name.trim());
    }, 1000);
  };

  const handleGuestEntry = () => {
    onSuccess('Visitante');
  };

  return (
    <ScreenContainer scrollable avoidKeyboard>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.logoHeader}>
          <View style={styles.logoCircle}>
            <Flame size={32} color={theme.colors.primary} strokeWidth={1.5} />
          </View>
          <Text style={styles.logoText}>Bitzrun</Text>
        </View>

        {/* Headline */}
        <View style={styles.welcomeSection}>
          <Text style={styles.headline}>Crie seu ponto{"\n"}de partida</Text>
          <Text style={styles.subtitle}>
            Seu perfil local ajuda o Bitzrun a acompanhar sua consistência.
          </Text>
        </View>

        {/* Cadastro Card */}
        <AppCard style={styles.card}>
          <Text style={styles.cardTitle}>Identificação Local</Text>

          <View style={styles.inputWrapper}>
            <Text style={styles.label}>Como prefere ser chamado?</Text>
            <View style={[styles.inputContainer, nameFocused && styles.inputContainerFocused]}>
              <User size={18} color={nameFocused ? theme.colors.primary : theme.colors.textSecondary} strokeWidth={1.5} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Ex: Carlos, Ana, Corredor"
                placeholderTextColor="#666666"
                value={name}
                onChangeText={setName}
                maxLength={20}
                onFocus={() => setNameFocused(true)}
                onBlur={() => setNameFocused(false)}
                autoCorrect={false}
              />
            </View>
          </View>

          <AppButton
            title="Começar"
            onPress={handleRegister}
            loading={isLoading}
            variant="primary"
            style={styles.submitBtn}
          />
        </AppCard>

        {/* Ações inferiores */}
        <View style={styles.footer}>
          <AppButton
            title="Entrar como Visitante"
            onPress={handleGuestEntry}
            variant="ghost"
            style={styles.guestBtn}
          />

          <TouchableOpacity
            onPress={onNavigateToLogin}
            style={styles.backLink}
            activeOpacity={0.7}
          >
            <Text style={styles.backLinkText}>Voltar para o início</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingTop: 40,
    paddingBottom: 40,
    justifyContent: 'center',
  },
  logoHeader: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  logoCircle: {
    width: 68,
    height: 68,
    borderRadius: theme.borderRadius.round,
    backgroundColor: theme.colors.card,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
    borderWidth: 1.5,
    borderColor: theme.colors.primary,
  },
  logoText: {
    color: theme.colors.text,
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
  welcomeSection: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
    paddingHorizontal: theme.spacing.md,
  },
  headline: {
    color: theme.colors.text,
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 36,
    letterSpacing: -0.5,
    marginBottom: theme.spacing.md,
  },
  subtitle: {
    color: theme.colors.textSecondary,
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
    fontWeight: '400',
  },
  card: {
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  cardTitle: {
    color: theme.colors.text,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: theme.spacing.lg,
    letterSpacing: -0.2,
  },
  inputWrapper: {
    marginBottom: theme.spacing.lg,
  },
  label: {
    color: theme.colors.textSecondary,
    fontSize: 11,
    fontWeight: '700',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    height: 52,
    borderWidth: 1.5,
    borderColor: theme.colors.border,
  },
  inputContainerFocused: {
    borderColor: theme.colors.primary,
    borderWidth: 1.5,
  },
  inputIcon: {
    marginRight: theme.spacing.sm,
  },
  input: {
    flex: 1,
    color: theme.colors.text,
    fontSize: 14,
  },
  submitBtn: {
    width: '100%',
  },
  footer: {
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  guestBtn: {
    width: '100%',
  },
  backLink: {
    padding: theme.spacing.xs,
  },
  backLinkText: {
    color: theme.colors.primary,
    fontSize: 14,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});
