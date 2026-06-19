# Bitzrun — MVP 0.1

Bitzrun é um companheiro de hábitos mobile desenvolvido em Expo, React Native e TypeScript para o ecossistema iOS. Diferente de aplicativos de performance competitiva, o Bitzrun foca na consistência, no suporte emocional e na valorização de pequenos progressos diários.

## Slogan
> "Consistência antes de performance."

---

## 🚀 Objetivo do MVP 0.1
Validar a aderência da experiência do usuário no desenvolvimento do hábito de correr aos poucos, sem pressão inicial, operando localmente no dispositivo (offline) e focado em simplicidade.

---

## 🛠️ Stack Tecnológica
*   **Framework**: Expo (SDK 54, compatível com Expo Go)
*   **Linguagem**: TypeScript
*   **Banco de Dados/Persistência**: AsyncStorage (`@react-native-async-storage/async-storage`)
*   **Biblioteca de Ícones**: `lucide-react-native`
*   **Gráficos**: `react-native-gifted-charts`

---

## ⚙️ Como Rodar Localmente

### Pré-requisitos
*   Node.js (versão LTS recomendada)
*   npm ou yarn
*   Expo Go instalado no seu iPhone

### Passos para Execução
1.  Instale as dependências:
    ```bash
    npm install
    ```
2.  Inicie o servidor de desenvolvimento limpando o cache do Metro:
    ```bash
    npx expo start -c
    ```
3.  Escaneie o QR Code gerado pelo terminal usando a câmera do seu iPhone para abrir o app diretamente no **Expo Go**.

---

## 🎯 Funcionalidades Atuais (Versão 0.1)
*   **Entrada como Visitante**: Acesso rápido sem burocracia de telas de login.
*   **Identificação Local**: Cadastro de apelido/nome salvo localmente.
*   **Meta da Semana**: Definição dinâmica de frequência de treinos semanais (de 2x a 6x) por seletor rápido no Perfil ou na Home.
*   **Meta da Corrida**: Preparação de corrida focada em distância em quilômetros (0.5 km, 1 km, 2 km, 3 km, 5 km ou Personalizada) com validações robustas.
*   **Cronômetro Ativo & Simulação**: Tela de corrida com suporte ao teclado, barra de progresso, botão de pause/play de alto contraste e simulação realista de distância percorrida.
*   **Humor antes e depois**: Registro emocional para monitorar o benefício mental do esporte.
*   **Motivo da Interrupção (Integrado)**: Seção opcional e sutil no fluxo de humor quando a meta de distância não é alcançada. Coleta fatores como cãibra, dor, falta de tempo ou ritmo pesado, sem gerar sensação de culpa no usuário.
*   **Diário de Corrida (Últimas Corridas)**: Histórico completo e detalhado exibido na aba Jornada. Lista todos os treinos em ordem decrescente, exibindo distância, metas, status ("Meta alcançada" ou "Hábito mantido"), humor e dificuldades.
*   **Detalhe do Registro**: Painel interativo de detalhes ao tocar em qualquer card de corrida na Jornada, exibindo duração, notas extras e observações sobre dificuldades registradas.
*   **Cartões de Memória**: Geração de registros marcantes baseados em superações reais de distância ou regularidade.
*   **Conquistas**: Desbloqueio e monitoramento com barra de progresso parcial de marcos de consistência e evolução.
*   **Perfil & Foto**: Escolha de foto de perfil real acessando a galeria nativa do iPhone.
*   **Limpeza de Dados**: Ação de segurança para redefinir dados de teste locais.

---

## ⚠️ Limitações Atuais (Versão 0.1)
*   **Sem GPS Real**: A distância percorrida é calculada de forma simulada para testes locais.
*   **Sem Autenticação Remota**: Todos os dados do usuário ficam armazenados estritamente na memória física local (`AsyncStorage`).
*   **Sem Servidor (Backend)**: Toda a lógica é processada no aparelho, o que significa que desinstalar o app zera o progresso.

---

## 📋 Próximos Passos Sugeridos
1.  **Fase 0.2**: Refinamento visual fino da UI e testes fechados com 3 a 5 usuários iniciais.
2.  **Fase 0.3**: Integração com GPS real para monitoramento físico verídico.
3.  **Fase 0.4**: Sincronização em nuvem e banco de dados remoto (ex: Supabase).
