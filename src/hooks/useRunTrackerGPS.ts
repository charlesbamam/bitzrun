import { useState, useEffect, useRef } from 'react';
import * as Location from 'expo-location';
import { Alert } from 'react-native';

export type TrackerStatus =
  | 'setup'
  | 'permissions_pending'
  | 'searching'
  | 'running'
  | 'paused'
  | 'denied'
  | 'unavailable'
  | 'stopped';

interface LocationCoords {
  latitude: number;
  longitude: number;
  timestamp: number;
  accuracy: number | null;
}

export function useRunTrackerGPS() {
  const [status, setStatus] = useState<TrackerStatus>('setup');
  const [distanceKm, setDistanceKm] = useState<number>(0);
  const [durationSeconds, setDurationSeconds] = useState<number>(0);
  const [currentPace, setCurrentPace] = useState<string>("--'--");
  const [gpsAccuracy, setGpsAccuracy] = useState<number | null>(null);

  // Referências para o cronômetro baseado em timestamps reais
  const startTimeRef = useRef<number | null>(null);
  const elapsedBeforePauseRef = useRef<number>(0);
  const intervalTimerRef = useRef<any>(null);

  // Referências para o GPS
  const subscriptionRef = useRef<Location.LocationSubscription | null>(null);
  const lastLocationRef = useRef<LocationCoords | null>(null);

  // Sincronizar referências mutáveis para uso dentro de callbacks assíncronos
  const statusRef = useRef<TrackerStatus>(status);
  useEffect(() => {
    statusRef.current = status;
  }, [status]);

  // Função para calcular a distância entre duas coordenadas usando a fórmula de Haversine
  const calculateHaversineDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number => {
    const R = 6371; // Raio da Terra em Km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distância em km
  };

  // Pedir permissão de acesso à localização
  const requestPermission = async (): Promise<boolean> => {
    try {
      setStatus('permissions_pending');
      const { status: authStatus } = await Location.requestForegroundPermissionsAsync();
      
      if (authStatus !== 'granted') {
        setStatus('denied');
        return false;
      }
      
      const isEnabled = await Location.isProviderEnabledAsync();
      if (!isEnabled) {
        setStatus('unavailable');
        return false;
      }

      setStatus('searching');
      return true;
    } catch (error) {
      console.error('Erro ao pedir permissão de GPS:', error);
      setStatus('unavailable');
      return false;
    }
  };

  // Atualizar o cronômetro baseado no tempo real de forma precisa
  const startTimer = () => {
    if (startTimeRef.current === null) {
      startTimeRef.current = Date.now();
    }

    if (intervalTimerRef.current) {
      clearInterval(intervalTimerRef.current);
    }

    intervalTimerRef.current = setInterval(() => {
      if (statusRef.current === 'running' && startTimeRef.current !== null) {
        const totalElapsedMs = elapsedBeforePauseRef.current + (Date.now() - startTimeRef.current);
        const totalSeconds = Math.floor(totalElapsedMs / 1000);
        setDurationSeconds(totalSeconds);

        // Calcular Pace Médio Atual (min/km)
        // Pace = Minutos / Distância
        setDistanceKm(currentDist => {
          if (currentDist > 0 && totalSeconds > 0) {
            const totalMinutes = totalSeconds / 60;
            const paceDecimal = totalMinutes / currentDist;
            const paceMins = Math.floor(paceDecimal);
            const paceSecs = Math.floor((paceDecimal - paceMins) * 60);
            
            // Filtrar ritmos irreais (ex: muito lentos)
            if (paceMins < 99) {
              const formattedSecs = paceSecs < 10 ? `0${paceSecs}` : paceSecs;
              const formattedMins = paceMins < 10 ? `0${paceMins}` : paceMins;
              setCurrentPace(`${formattedMins}'${formattedSecs}"`);
            } else {
              setCurrentPace("--'--");
            }
          } else {
            setCurrentPace("--'--");
          }
          return currentDist;
        });
      }
    }, 200);
  };

  const stopTimer = () => {
    if (intervalTimerRef.current) {
      clearInterval(intervalTimerRef.current);
      intervalTimerRef.current = null;
    }
  };

  // Iniciar rastreamento de fato
  const startTracking = async () => {
    const hasPermission = await requestPermission();
    if (!hasPermission) {
      Alert.alert(
        'Permissão Necessária',
        'O Bitzrun precisa de permissão de localização para calcular a distância e o ritmo das suas corridas com o app aberto.'
      );
      return;
    }

    // Reset de dados de corrida
    setDistanceKm(0);
    setDurationSeconds(0);
    setCurrentPace("--'--");
    setGpsAccuracy(null);
    lastLocationRef.current = null;
    elapsedBeforePauseRef.current = 0;
    startTimeRef.current = Date.now();
    
    setStatus('running');
    startTimer();

    try {
      // Iniciar monitoramento do GPS
      subscriptionRef.current = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 1000, // Atualiza a cada 1 segundo
          distanceInterval: 2, // Atualiza a cada 2 metros percorridos
        },
        (location) => {
          // Atualiza sinal e precisão
          const accuracy = location.coords.accuracy;
          setGpsAccuracy(accuracy);

          // Filtro 1: Descartar sinal ruim (acima de 25m de margem de erro)
          if (accuracy && accuracy > 25) {
            console.log(`Ponto descartado: precisão ruim (${accuracy}m)`);
            return;
          }

          // Se estiver pausado ou não estiver no estado running, ignora a soma de distância
          if (statusRef.current !== 'running') {
            return;
          }

          const currentPoint: LocationCoords = {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            timestamp: location.timestamp,
            accuracy: accuracy,
          };

          if (lastLocationRef.current) {
            const timeDiffSec = (currentPoint.timestamp - lastLocationRef.current.timestamp) / 1000;
            
            // Prevenir cálculos esquisitos se o timestamp for idêntico
            if (timeDiffSec <= 0) return;

            const deltaDist = calculateHaversineDistance(
              lastLocationRef.current.latitude,
              lastLocationRef.current.longitude,
              currentPoint.latitude,
              currentPoint.longitude
            );

            // Filtro 2: Velocidade impossível a pé (mais de 10 m/s ou 36 km/h)
            // Velocidade (m/s) = (deltaDist * 1000) / timeDiffSec
            const speedMps = (deltaDist * 1000) / timeDiffSec;
            if (speedMps > 10) {
              console.log(`Desvio de GPS ignorado. Velocidade irreal: ${speedMps.toFixed(2)} m/s`);
              // Atualiza o último ponto para evitar que o salto acumule na próxima atualização
              lastLocationRef.current = currentPoint;
              return;
            }

            // Somar apenas distâncias significativas (acima de 1 metro)
            if (deltaDist > 0.001) {
              setDistanceKm((prev) => prev + deltaDist);
            }
          }

          lastLocationRef.current = currentPoint;
        }
      );
    } catch (error) {
      console.error('Erro ao assinar Location.watchPositionAsync:', error);
      setStatus('unavailable');
    }
  };

  // Pausar rastreamento
  const pauseTracking = () => {
    if (statusRef.current !== 'running') return;

    setStatus('paused');
    stopTimer();

    // Guardar o tempo acumulado até a pausa
    if (startTimeRef.current !== null) {
      elapsedBeforePauseRef.current += Date.now() - startTimeRef.current;
      startTimeRef.current = null;
    }

    // Resetar o último ponto ao pausar para não conectar um salto ao retomar
    lastLocationRef.current = null;
  };

  // Retomar rastreamento
  const resumeTracking = () => {
    if (statusRef.current !== 'paused') return;

    setStatus('running');
    startTimeRef.current = Date.now();
    startTimer();
    
    // Garantir que não conecta a posição anterior
    lastLocationRef.current = null;
  };

  // Parar/Encerrar rastreamento
  const stopTracking = () => {
    setStatus('stopped');
    stopTimer();

    if (subscriptionRef.current) {
      subscriptionRef.current.remove();
      subscriptionRef.current = null;
    }

    lastLocationRef.current = null;
    startTimeRef.current = null;
    elapsedBeforePauseRef.current = 0;
  };

  // Limpeza ao desmontar
  useEffect(() => {
    return () => {
      stopTimer();
      if (subscriptionRef.current) {
        subscriptionRef.current.remove();
      }
    };
  }, []);

  return {
    status,
    distanceKm,
    durationSeconds,
    currentPace,
    gpsAccuracy,
    requestPermission,
    startTracking,
    pauseTracking,
    resumeTracking,
    stopTracking,
  };
}
