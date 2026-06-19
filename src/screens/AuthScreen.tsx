import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ActivityIndicator, ScrollView, Alert } from 'react-native';
import { Flame, Mail, Lock, User, Eye, EyeOff } from 'lucide-react-native';
import { StorageService } from '../services/storage';

interface AuthScreenProps {
  onSuccess: (userName: string) => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onSuccess }) => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('register');
  const [isLoading, setIsLoading] = useState(false);
  const [secureText, setSecureText] = useState(true);

  // Estados dos Campos
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleAuth = async () => {
    // Validações básicas
    if (!email.trim() || !password.trim()) {
      Alert.alert('Campos vazios', 'Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    if (activeTab === 'register') {
      if (!name.trim()) {
        Alert.alert('Campos vazios', 'Por favor, preencha o seu nome.');
        return;
      }
      if (password !== confirmPassword) {
        Alert.alert('Erro de validação', 'As senhas não coincidem.');
        return;
      }
      if (password.length < 6) {
        Alert.alert('Erro de validação', 'A senha deve possuir pelo menos 6 caracteres.');
        return;
      }
    }

    setIsLoading(true);

    // Simulação de delay de rede
    setTimeout(async () => {
      try {
        setIsLoading(false);
        const resolvedName = activeTab === 'register' ? name.trim() : 'Corredor';
        
        // Salvar nome no perfil global do aplicativo
        if (activeTab === 'register') {
          await StorageService.updateProfileName(resolvedName);
        }
        
        onSuccess(resolvedName);
      } catch (error) {
        setIsLoading(false);
        Alert.alert('Erro', 'Ocorreu um erro ao processar a autenticação.');
      }
    }, 1500);
  };

  const handleGuestEntry = async () => {
    setIsLoading(true);
    setTimeout(async () => {
      setIsLoading(false);
      onSuccess('Visitante');
    }, 800);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer} keyboardShouldPersistTaps="handled">
      {/* Logo e Cabeçalho */}
      <View style={styles.header}>
        <View style={styles.logoCircle}>
          <Flame size={32} color="#CCFF00" strokeWidth={1.5} />
        </View>
        <Text style={styles.logoText}>BITZRUN</Text>
        <Text style={styles.subtitleText}>A sua identidade de corrida começa aqui.</Text>
      </View>

      {/* Seletor de Abas (Entrar / Cadastrar) */}
      <View style={styles.tabSelector}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'register' && styles.tabButtonActive]}
          onPress={() => setActiveTab('register')}
          activeOpacity={0.8}
        >
          <Text style={[styles.tabButtonText, activeTab === 'register' && styles.tabButtonTextActive]}>
            Criar Conta
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'login' && styles.tabButtonActive]}
          onPress={() => setActiveTab('login')}
          activeOpacity={0.8}
        >
          <Text style={[styles.tabButtonText, activeTab === 'login' && styles.tabButtonTextActive]}>
            Entrar
          </Text>
        </TouchableOpacity>
      </View>

      {/* Formulários */}
      <View style={styles.formCard}>
        {activeTab === 'register' && (
          <View style={styles.inputWrapper}>
            <Text style={styles.label}>Como prefere ser chamado?</Text>
            <View style={styles.inputContainer}>
              <User size={18} color="#A0A0A0" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Nome ou apelido"
                placeholderTextColor="#666666"
                value={name}
                onChangeText={setName}
                maxLength={24}
              />
            </View>
          </View>
        )}

        <View style={styles.inputWrapper}>
          <Text style={styles.label}>E-mail</Text>
          <View style={styles.inputContainer}>
            <Mail size={18} color="#A0A0A0" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="exemplo@email.com"
              placeholderTextColor="#666666"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>
        </View>

        <View style={styles.inputWrapper}>
          <Text style={styles.label}>Senha</Text>
          <View style={styles.inputContainer}>
            <Lock size={18} color="#A0A0A0" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Mínimo 6 caracteres"
              placeholderTextColor="#666666"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={secureText}
              autoCapitalize="none"
              autoCorrect={false}
            />
            <TouchableOpacity onPress={() => setSecureText(!secureText)} style={styles.eyeBtn}>
              {secureText ? <Eye size={18} color="#A0A0A0" /> : <EyeOff size={18} color="#A0A0A0" />}
            </TouchableOpacity>
          </View>
        </View>

        {activeTab === 'register' && (
          <View style={styles.inputWrapper}>
            <Text style={styles.label}>Confirme a sua Senha</Text>
            <View style={styles.inputContainer}>
              <Lock size={18} color="#A0A0A0" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Digite a senha novamente"
                placeholderTextColor="#666666"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={secureText}
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
          </View>
        )}

        {/* Botão de Ação Principal */}
        <TouchableOpacity
          style={[styles.actionButton, isLoading && styles.actionButtonDisabled]}
          onPress={handleAuth}
          disabled={isLoading}
          activeOpacity={0.85}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#000000" />
          ) : (
            <Text style={styles.actionButtonText}>
              {activeTab === 'register' ? 'CRIAR MINHA CONTA' : 'ACESSAR CONTA'}
            </Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Acesso rápido Visitante */}
      <View style={styles.guestSection}>
        <Text style={styles.guestText}>Deseja apenas testar o MVP?</Text>
        <TouchableOpacity style={styles.guestBtn} onPress={handleGuestEntry} disabled={isLoading}>
          <Text style={styles.guestBtnText}>Entrar como Visitante</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  contentContainer: {
    padding: 24,
    paddingTop: 60,
    paddingBottom: 40,
    justifyContent: 'center',
    minHeight: '100%',
  },
  header: {
    alignItems: 'center',
    marginBottom: 36,
  },
  logoCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#1E1E1E',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#CCFF00',
  },
  logoText: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: 2,
    fontFamily: 'System',
  },
  subtitleText: {
    color: '#A0A0A0',
    fontSize: 13,
    fontWeight: '300',
    textAlign: 'center',
    marginTop: 6,
    fontFamily: 'System',
  },
  tabSelector: {
    flexDirection: 'row',
    backgroundColor: '#1E1E1E',
    borderRadius: 16,
    padding: 4,
    marginBottom: 28,
    borderWidth: 1,
    borderColor: '#262626',
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 12,
  },
  tabButtonActive: {
    backgroundColor: '#262626',
  },
  tabButtonText: {
    color: '#A0A0A0',
    fontSize: 14,
    fontWeight: '300',
  },
  tabButtonTextActive: {
    color: '#CCFF00',
    fontWeight: '700',
  },
  formCard: {
    backgroundColor: '#1E1E1E',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: '#262626',
  },
  inputWrapper: {
    marginBottom: 20,
  },
  label: {
    color: '#A0A0A0',
    fontSize: 12,
    fontWeight: '300',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#000000',
    borderRadius: 14,
    paddingHorizontal: 16,
    height: 52,
    borderWidth: 1.5,
    borderColor: '#262626',
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  eyeBtn: {
    padding: 6,
  },
  actionButton: {
    backgroundColor: '#CCFF00',
    borderRadius: 28,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    shadowColor: '#CCFF00',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  actionButtonDisabled: {
    backgroundColor: 'rgba(204, 255, 0, 0.3)',
  },
  actionButtonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 1.5,
    fontFamily: 'System',
  },
  guestSection: {
    alignItems: 'center',
    marginTop: 36,
  },
  guestText: {
    color: '#A0A0A0',
    fontSize: 13,
    fontWeight: '300',
  },
  guestBtn: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginTop: 6,
  },
  guestBtnText: {
    color: '#CCFF00',
    fontSize: 14,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
});
