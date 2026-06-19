# Roadmap de Desenvolvimento — Bitzrun

Este documento delineia a visão de evolução e as próximas fases de implementação recomendadas após o fechamento da versão MVP 0.1 do Bitzrun.

---

## 📈 Fases de Evolução do Produto

### 🎯 Fase 0.2 — Melhorias de MVP & Ajustes de UI
Focada em polimento visual fino e consolidação do fluxo de usabilidade offline.
*   **Refinamento Visual**: Ajustes de micro-espaçamentos na interface para layouts em telas com formatos diversos do iPhone (como entalhes de câmera e Safe Area inferior).
*   **Revisão de Microcopy**: Ajuste fino do tom de voz humano, motivador e focado em consistência em todas as mensagens do app.
*   **Melhorias no Onboarding**: Fluxo aprimorado para explicar o funcionamento da simulação de distância antes do primeiro treino.
*   **Testes Fechados**: Realização de testes de usabilidade em campo com grupo restrito de 3 a 5 usuários reais.

---

### 📍 Fase 0.3 — Funcionalidades Reais de Corrida
Introdução da leitura de dados físicos do aparelho e abandono da distância simulada.
*   **GPS Real**: Integração do serviço nativo de localização em background.
*   **Permissão de Localização**: Tratamento amigável e explicativo de concessão de permissão de geolocalização no iOS.
*   **Cálculo Físico de Distância**: Substituição do cronômetro de simulação pela leitura das coordenadas para incremento da quilometragem real percorrida.
*   **Histórico Detalhado**: Visualização de mapas de rota e gráficos parciais de ritmo (pace) ao longo do percurso.

---

### 🔐 Fase 0.4 — Conta e Sincronização Remota
Tornar o aplicativo seguro contra perda de aparelho ou reinstalação do aplicativo.
*   **Autenticação**: Introdução de cadastro remoto opcional (Login por E-mail, Apple Sign-in ou Google Sign-in).
*   **Banco de Dados Remoto**: Armazenamento e sincronização em nuvem (ex: Supabase ou Firebase) para preservação de histórico.
*   **Backup e Recuperação**: Permissão de sincronização de treinos em múltiplos dispositivos sob uma mesma identificação de usuário.

---

### 💡 Fase 0.5 — Retenção & Gamificação Saudável
Aprimoramento da fidelidade ao hábito de corrida de forma empática e sem gerar estresse.
*   **Notificações Push**: Lembretes gentis baseados no dia da meta da semana que o usuário costuma treinar (ex: *"Hoje é um bom dia para manter a consistência viva. O que acha de uma caminhada ou corrida leve?"*).
*   **Sugestão de Próxima Corrida**: Lógica preditiva sugerindo a meta ideal do dia baseando-se no humor inicial e distâncias completadas recentemente.
*   **Insights Semanais**: Feedbacks emocionais estruturados sobre a evolução da correlação de humor físico-mental obtidos através do histórico de treinos.
