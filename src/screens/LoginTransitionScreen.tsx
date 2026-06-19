import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Animated, ActivityIndicator } from 'react-native';
import { Flame } from 'lucide-react-native';
import { theme } from '../theme/theme';
import { ScreenContainer } from '../components/ScreenContainer';

interface LoginTransitionScreenProps {
  userName: string;
  onFinish: () => void;
}

export const LoginTransitionScreen: React.FC<LoginTransitionScreenProps> = ({ userName, onFinish }) => {
  const [pulseAnim] = useState(new Animated.Value(1));
  const [fadeAnim] = useState(new Animated.Value(0));
  const [message, setMessage] = useState('Aquecendo os motores...');

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.12,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0.96,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ])
    ).start();

    const timer1 = setTimeout(() => {
      setMessage('Construindo sua consistência...');
    }, 600);

    const timer2 = setTimeout(() => {
      setMessage(`Seja bem-vindo, ${userName}!`);
    }, 1200);

    const timerFinish = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }).start(() => {
        onFinish();
      });
    }, 1800);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timerFinish);
    };
  }, []);

  return (
    <ScreenContainer style={styles.container}>
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <Animated.View style={[styles.logoCircle, { transform: [{ scale: pulseAnim }] }]}>
          <Flame size={48} color={theme.colors.primary} strokeWidth={1.5} />
        </Animated.View>
        
        <Text style={styles.welcomeText}>Preparando sua jornada</Text>
        <Text style={styles.statusText}>{message}</Text>
        <Text style={styles.subtext}>O importante é aparecer.</Text>
        
        <View style={styles.loader}>
          <ActivityIndicator size="small" color={theme.colors.primary} />
        </View>
      </Animated.View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: theme.spacing.xl,
  },
  logoCircle: {
    width: 96,
    height: 96,
    borderRadius: theme.borderRadius.round,
    backgroundColor: theme.colors.card,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
    borderWidth: 1.5,
    borderColor: theme.colors.primary,
  },
  welcomeText: {
    color: theme.colors.text,
    fontSize: 22,
    fontWeight: 'bold',
    letterSpacing: -0.3,
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
  },
  statusText: {
    color: theme.colors.primary,
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
    minHeight: 20,
  },
  subtext: {
    color: theme.colors.textSecondary,
    fontSize: 12,
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
  },
  loader: {
    height: 20,
  },
});
