# Bitzrun — MVP 0.1

Este documento detalha o escopo conceitual, as decisões de produto e a especificação técnica da versão 0.1 do Bitzrun.

---

## 👁️ Visão Geral do Produto
O Bitzrun é um companheiro digital móvel projetado para ajudar pessoas a construírem e manterem o hábito de correr sem sofrerem com a pressão de performance, velocidade ou competição esportiva. É um app voltado para iniciantes, sedentários ou indivíduos com dificuldades psicológicas para treinar.

*   **Slogan**: "Consistência antes de performance."
*   **Tom**: Humanizado, acolhedor, motivador e não punitivo. 

---

## 🎯 Problema e Público-Alvo
*   **Problema**: A maioria dos aplicativos de corrida foca em desempenho competitivo (PACE, velocidade, comparação com amigos, ranking). Isso afasta e desmotiva iniciantes que sentem vergonha, dores ou desistem com facilidade.
*   **Público**: Pessoas que desejam criar o hábito da corrida, mas sofrem de resistência mental, cansaço frequente, pressões de agenda e buscam apenas consistência e bem-estar.

---

## 🔄 Fluxo Principal de Telas (MVP 0.1)

1.  **Tela de Apresentação (Login/Cadastro/Visitante)**:
    *   Entrada simplificada sem autenticação remota. O usuário cadastra seu nome de preferência que fica gravado na memória do dispositivo.
2.  **Home / Hoje (Dashboard)**:
    *   Exibe o Índice de Consistência (0 a 100).
    *   Exibe a sequência de dias ativos (Streak).
    *   Exibe o painel de progresso semanal da meta (ex: "2 de 3 corridas feitas" / "Sua meta: 3 corridas por semana").
3.  **Preparação de Corrida**:
    *   O usuário seleciona o humor de entrada (1 a 5) e escolhe sua distância-alvo em KM (0,5 km, 1 km, 2 km, 3 km, 5 km ou Personalizada).
4.  **Corrida em Andamento**:
    *   Exibição do cronômetro ativo e simulação gradual de distância.
    *   Controles de pausa e finalização.
    *   Mensagens motivacionais baseadas em tempo ou distância atingida.
5.  **Resumo da Corrida**:
    *   Exibe as estatísticas gerais do treino concluído, com uma frase de apoio positiva e comparativos narrativos não-agressivos sobre sua evolução.
6.  **Humor Pós-Corrida & Interrupção (Integrados)**:
    *   Coleta do humor pós-treino (1 a 5).
    *   Campo de anotações gerais limitado a 200 caracteres.
    *   **Se a corrida for encerrada antes da meta**: Exibição da seção secundária sutil de interrupção contendo Pills de seleção múltipla (Joelho doeu, Falta de tempo, Fiquei sem fôlego, etc.) e aviso de cuidado de saúde preventivo caso selecionado sintomas como Tontura ou Me senti mal.
7.  **Jornada & Histórico**:
    *   Gráfico semanal das últimas 4 semanas.
    *   Seção de Últimas Corridas (Diário de Corrida) detalhando o histórico com cards interativos. Ao clicar, exibe os detalhes completos de cada registro.
    *   Cartões de Memória gerados automaticamente com conquistas notáveis do dia.

---

## 💾 Modelagem de Dados Locais (AsyncStorage)
Toda a persistência é mantida no celular do usuário através do AsyncStorage, estruturada sob as seguintes entidades:

*   **UserProfile**:
    *   `name`: string
    *   `consistencyScore`: number
    *   `streak`: number
    *   `weeklyRunGoal`: number (2 a 6, padrão 3)
    *   `avatarUri`: string (opcional)
    *   `lastRunDate`: string (opcional)
*   **Run**:
    *   `id`: string
    *   `date`: string (ISO Date)
    *   `distance`: number (km)
    *   `duration`: number (segundos)
    *   `moodBefore`: number
    *   `moodAfter`: number
    *   `notes`: string (opcional)
    *   `stoppedBeforeGoal`: boolean (opcional)
    *   `stopReasons`: string[] (opcional)
    *   `stopNote`: string (opcional)
    *   `targetDistanceKm`: number (opcional)

---

## 🧠 Decisões Importantes de Produto

1.  **Consistência é a Métrica Principal**: O score da home incentiva o usuário a sair de casa com frequência. A distância e o tempo são secundários.
2.  **Não-punição de interrupção**: Se o usuário não bater a meta, o app não diz "Você falhou". O app exibe "Hábito mantido" e abre espaço opcional para coletar de forma sutil o que atrapalhou (sempre após coletar o humor dele, priorizando a saúde mental).
3.  **Segurança em Primeiro Lugar**: Se o usuário registra dor forte como "Tontura" ou "Me senti mal", mostramos um aviso visual de cuidado de saúde e orientação profissional.

---

## 🛑 O que ficou de fora do MVP 0.1
*   **GPS e Acompanhamento de Rotas verídicas**: Apenas simulação ativa de treino para validação conceitual e UX de botões de corrida.
*   **Autenticação e Nuvem**: Não há cadastro remoto ou login por e-mail/senha.
*   **Compartilhamento Social Real**: Integração apenas com a API nativa de compartilhamento de texto do celular, sem feeds sociais no app.
