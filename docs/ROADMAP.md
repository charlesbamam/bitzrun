# Bitzrun — Roadmap de Evolução

Este documento projeta as fases de evolução do Bitzrun após o fechamento e aprovação do MVP 0.1.

---

## ⚡ Fase 0.2 — Teste com Usuários (Validação de Microcopy e UX)
Foco em refinamento de usabilidade e coleta qualitativa sem adicionar funcionalidades complexas ou de infraestrutura.

*   **Testes Qualitativos**: Convidar de 3 a 5 usuários representativos do público-alvo (sedentários e iniciantes) para usar o aplicativo no Expo Go por 7 dias.
*   **Mapeamento de Dúvidas**: Avaliar se os usuários compreendem os termos de Índice de Consistência e metas sem estranheza.
*   **Refinamento de Texto (Microcopy)**: Ajustar mensagens de incentivo e cards com base na resposta emocional dos participantes.
*   **Melhorias Visuais Finas**: Refinar paddings, tamanhos de fonte no iPhone SE/telas menores e feedback tátil nativo (`Haptics`).
*   **Ajuste do Onboarding**: Criar fluxo básico de onboarding ilustrando o tom do aplicativo de "não-competição" nas primeiras telas.

---

## 🗺️ Fase 0.3 — Corrida Real (Integração Nativa)
Foco em substituir dados simulados por telemetria verídica do smartphone.

*   **GPS Real**: Integração com a biblioteca nativa `expo-location` para escutar coordenadas geográficas do sensor do dispositivo.
*   **Permissões Nativas**: Estruturar fluxos de permissão de geolocalização em primeiro e segundo plano de forma amigável.
*   **Cálculo Físico de Distância**: Substituir a simulação matemática de distância por cálculo de distância Euclidiana/Haversine baseado nos pontos de GPS coletados em tempo real.
*   **Histórico de Rota**: Salvar coordenadas da corrida para possibilitar a renderização futura do trajeto da corrida em mapa simples.

---

## ☁️ Fase 0.4 — Conta e Sincronização (Infraestrutura)
Foco em backup de dados e persistência multiplataforma.

*   **Autenticação**: Introdução de login social nativo simplificado (Apple Sign-In e Google Sign-In).
*   **Banco de Dados Remoto**: Conexão com banco de dados em nuvem leve (ex: **Supabase** ou Firebase Firestore) para sincronizar treinos e conquistas.
*   **Segurança e Privacidade**: Implementação de termos de uso em conformidade com a LGPD/GDPR, permitindo que o usuário delete sua conta e dados com um toque.
*   **Modo Offline First**: Sincronização inteligente que permite ao usuário iniciar e salvar corridas mesmo sem acesso à internet, sincronizando na nuvem assim que restabelecer conexão.

---

## 📈 Fase 0.5 — Retenção, Insights e Hábitos
Foco em inteligência de hábitos e estímulo de consistência a longo prazo.

*   **Lembretes Inteligentes (Notificações)**: Envio de notificações push personalizadas sugerindo corridas em dias com maior probabilidade histórica de treino do usuário.
*   **Insights de Progresso**: Relatório semanal ilustrando a evolução emocional (ex: "Você começou 80% das corridas desmotivado e terminou bem!").
*   **Recomendação de Corrida Leve**: Se o usuário registrou muitas dificuldades ou cansaço no último treino, o app sugere uma meta leve automática para o dia seguinte (ex: "Que tal tentarmos 0,5 km hoje apenas para manter o hábito?").
*   **Identificação de Padrões de Dificuldade**: Análise dos motivos de parada frequentes com dicas práticas de cuidado corporal e mental (ex: se o joelho doeu 3 vezes seguidas, exibir dica sobre calçados ou postura).
