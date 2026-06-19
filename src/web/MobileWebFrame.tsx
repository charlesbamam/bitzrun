import React from 'react';
import { StyleSheet, View, Dimensions, Platform } from 'react-native';

interface MobileWebFrameProps {
  children: React.ReactNode;
}

export const MobileWebFrame: React.FC<MobileWebFrameProps> = ({ children }) => {
  if (Platform.OS !== 'web') {
    return <>{children}</>;
  }

  return (
    <View style={styles.outerContainer}>
      <View style={styles.innerContainer}>
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: '#0A0A0A',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: Platform.OS === 'web' ? ('100vh' as any) : '100%',
  },
  innerContainer: {
    width: '100%',
    maxWidth: 393,
    minWidth: 360,
    height: Platform.OS === 'web' ? ('100vh' as any) : '100%',
    backgroundColor: '#000000',
    overflow: 'hidden',
    position: 'relative',
    // Adiciona uma moldura elegante simulando o celular em telas maiores (desktop)
    ...Platform.select({
      web: {
        boxShadow: '0px 8px 32px rgba(0, 0, 0, 0.5)',
        borderLeftWidth: 1,
        borderRightWidth: 1,
        borderColor: '#262626',
      }
    }) as any,
  },
});
