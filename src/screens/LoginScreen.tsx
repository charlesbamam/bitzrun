import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ActivityIndicator, Alert, ScrollView } from 'react-native';
import { Flame, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react-native';
import { theme } from '../theme/theme';
import { ScreenContainer } from '../components/ScreenContainer';
import { AppButton } from '../components/AppButton';
import { AppCard } from '../components/AppCard';

interface LoginScreenProps {
  onSuccess: (userName: string) => void;
  onNavigateToRegister: () => void;
  onGuestEntry: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onSuccess, onNavigateToRegister, onGuestEntry }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [secureText, setSecureText] = useState(true);
  const [showLoginForm, setShowLoginForm] = useState(false);

  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const handleLogin = () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Campos vazios', 'Por favor, preencha o e-mail e a senha.');
      return;
    }

    setIsLoading(true);

    // Simulação curta de login
    setTimeout(() => {
      setIsLoading(false);
      const nickname = email.split('@')[0];
      const displayName = nickname.charAt(0).toUpperCase() + nickname.slice(1);
      onSuccess(displayName || 'Corredor');
    }, 1000);
  };

  return (
    <ScreenContainer scrollable avoidKeyboard>
      <View style={styles.content}>
        {/* Logo/Icon Circle */}
        <View style={styles.logoHeader}>
          <View style={styles.logoCircle}>
            <Flame size={32} color={theme.colors.primary} strokeWidth={1.5} />
          </View>
          <Text style={styles.logoText}>Bitzrun</Text>
        </View>

        {/* Headline & Subtitle */}
        <View style={styles.welcomeSection}>
          <Text style={styles.headline}>Comece pequeno.{"\n"}Continue correndo.</Text>
          <Text style={styles.subtitle}>
            Bitzrun ajuda você a criar o hábito de correr sem pressão, uma corrida curta de cada vez.
          </Text>
        </View>

        {/* Ações principais (Visitante e Cadastro) */}
        {!showLoginForm && (
          <View style={styles.actionsContainer}>
            <AppButton
              title="Entrar como Visitante"
              onPress={onGuestEntry}
              variant="primary"
              style={styles.mainBtn}
            />

            <AppButton
              title="Criar meu perfil"
              onPress={onNavigateToRegister}
              variant="secondary"
              style={styles.secondaryBtn}
            />

            <TouchableOpacity
              onPress={() => setShowLoginForm(true)}
              style={styles.discreetLink}
              activeOpacity={0.7}
            >
              <Text style={styles.discreetLinkText}>Já tenho perfil</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Formulário discreto de Login */}
        {showLoginForm && (
          <AnimatedLoginForm
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            secureText={secureText}
            setSecureText={setSecureText}
            emailFocused={emailFocused}
            setEmailFocused={setEmailFocused}
            passwordFocused={passwordFocused}
            setPasswordFocused={setPasswordFocused}
            isLoading={isLoading}
            onLogin={handleLogin}
            onCancel={() => setShowLoginForm(false)}
          />
        )}
      </View>
    </ScreenContainer>
  );
};

// Subcomponente auxiliar de login para manter o App.tsx e esta tela limpos
interface LoginFormProps {
  email: string;
  setEmail: (t: string) => void;
  password: string;
  setPassword: (t: string) => void;
  secureText: boolean;
  setSecureText: (b: boolean) => void;
  emailFocused: boolean;
  setEmailFocused: (b: boolean) => void;
  passwordFocused: boolean;
  setPasswordFocused: (b: boolean) => void;
  isLoading: boolean;
  onLogin: () => void;
  onCancel: () => void;
}

const AnimatedLoginForm: React.FC<LoginFormProps> = ({
  email,
  setEmail,
  password,
  setPassword,
  secureText,
  setSecureText,
  emailFocused,
  setEmailFocused,
  passwordFocused,
  setPasswordFocused,
  isLoading,
  onLogin,
  onCancel,
}) => {
  return (
    <AppCard style={styles.formCard}>
      <Text style={styles.cardTitle}>Acessar Conta</Text>

      {/* Input Email */}
      <View style={styles.inputWrapper}>
        <Text style={styles.label}>E-mail</Text>
        <View style={[styles.inputContainer, emailFocused && styles.inputContainerFocused]}>
          <Mail size={18} color={emailFocused ? theme.colors.primary : theme.colors.textSecondary} strokeWidth={1.5} style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="seuemail@exemplo.com"
            placeholderTextColor="#666666"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            onFocus={() => setEmailFocused(true)}
            onBlur={() => setEmailFocused(false)}
          />
        </View>
      </View>

      {/* Input Senha */}
      <View style={styles.inputWrapper}>
        <Text style={styles.label}>Senha</Text>
        <View style={[styles.inputContainer, passwordFocused && styles.inputContainerFocused]}>
          <Lock size={18} color={passwordFocused ? theme.colors.primary : theme.colors.textSecondary} strokeWidth={1.5} style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Digite sua senha"
            placeholderTextColor="#666666"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={secureText}
            autoCapitalize="none"
            autoCorrect={false}
            onFocus={() => setPasswordFocused(true)}
            onBlur={() => setPasswordFocused(false)}
          />
          <TouchableOpacity onPress={() => setSecureText(!secureText)} style={styles.eyeBtn} activeOpacity={0.7}>
            {secureText ? <Eye size={18} color={theme.colors.textSecondary} strokeWidth={1.5} /> : <EyeOff size={18} color={theme.colors.textSecondary} strokeWidth={1.5} />}
          </TouchableOpacity>
        </View>
      </View>

      {/* Botões */}
      <AppButton
        title="Entrar"
        onPress={onLogin}
        loading={isLoading}
        variant="primary"
        style={styles.formSubmitBtn}
        icon={<ArrowRight size={18} color={theme.colors.background} strokeWidth={2.5} />}
      />

      <TouchableOpacity
        onPress={onCancel}
        style={styles.formCancelBtn}
        activeOpacity={0.7}
      >
        <Text style={styles.formCancelText}>Voltar</Text>
      </TouchableOpacity>
    </AppCard>
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
    marginBottom: theme.spacing.xxl,
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
  actionsContainer: {
    paddingHorizontal: theme.spacing.md,
    gap: theme.spacing.md,
  },
  mainBtn: {
    width: '100%',
  },
  secondaryBtn: {
    width: '100%',
  },
  discreetLink: {
    alignItems: 'center',
    marginTop: theme.spacing.md,
    padding: theme.spacing.xs,
  },
  discreetLinkText: {
    color: theme.colors.primary,
    fontSize: 14,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  formCard: {
    padding: theme.spacing.lg,
    marginTop: -theme.spacing.lg,
  },
  cardTitle: {
    color: theme.colors.text,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: theme.spacing.lg,
    letterSpacing: -0.2,
  },
  inputWrapper: {
    marginBottom: theme.spacing.md,
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
  eyeBtn: {
    padding: 6,
  },
  formSubmitBtn: {
    marginTop: theme.spacing.sm,
  },
  formCancelBtn: {
    alignItems: 'center',
    marginTop: theme.spacing.md,
    padding: theme.spacing.xs,
  },
  formCancelText: {
    color: theme.colors.textSecondary,
    fontSize: 14,
    fontWeight: '600',
  },
});
