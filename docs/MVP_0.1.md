# Documentação do MVP 0.1 — Bitzrun

Este documento apresenta a análise de escopo, visão do produto, arquitetura e decisões de negócio adotadas para a primeira versão (MVP 0.1) do Bitzrun.

---

## 🧭 Visão do Produto
O Bitzrun é projetado para atuar como um companheiro de hábitos e saúde mental. O seu principal direcionador é eliminar a resistência inicial da corrida para pessoas sedentárias ou que lutam para manter rotinas ativas. Não há tabelas de classificação, comparações com atletas de elite ou cobrança por alta performance competitiva.

---

## ⚡ Problema que o app resolve
*   **Falta de Consistência**: Aplicativos comuns de corrida focam em desempenho e distâncias longas, desmotivando iniciantes após poucos dias.
*   **Ansiedade de Desempenho**: Usuários sentem-se intimidados ao competir com o histórico de outras pessoas.
*   **Ausência de Retorno Emocional**: Aplicativos focam estritamente em números brutos (pace/ritmo) em vez do bem-estar mental.

---

## 👥 Público Inicial
*   Pessoas iniciando a prática de atividade física.
*   Sedentários buscando desenvolver consistência e disciplina.
*   Pessoas que valorizam o bem-estar mental e a superação emocional através da corrida.

---

## 📲 Telas e Fluxos Implementados
1.  **Splash & Entrada**: Apresentação da marca, login de identificação local e entrada expressa como visitante.
2.  **Home / Hoje**: Dashboard central com o anel de progresso circular (`ProgressRing`) monitorando a consistência da semana, botão de ação rápida "Iniciar Corrida" e exibição das estatísticas acumuladas.
3.  **Configuração de Meta da Semana**: Modal e seletor rápido (2x a 6x treinos semanais) que altera dinamicamente os textos da Home e o anel sem necessidade de digitação.
4.  **Preparação da Corrida (Meta da Corrida)**: Seleção de humor antes de correr e definição da meta diária em quilômetros (KM) com validações contra valores incorretos.
5.  **Corrida Ativa**: Cronômetro em tempo real, simulação de distância, banner com alertas motivacionais de acordo com tempo/distância e controles de Pause, Play e Concluir.
6.  **Humor depois & Registro final**: Inserção de nota curta do dia e feedback visual de humor pós-corrida.
7.  **Conclusão & Sucesso**: Tela com resumo do treino atual, exibindo conquistas e o cartão de memória gerado para a corrida.
8.  **Jornada**: Histórico contendo cards Antes x Agora, cartões de memórias e gráfico semanal de treinos com estados vazios dedicados a usuários sem histórico longo.
9.  **Conquistas**: Timeline de conquistas com progresso parcial dinâmico (modo read-only) para motivar o atingimento das conquistas bloqueadas.
10. **Perfil**: Alteração de foto de avatar puxando a galeria de imagens nativa do iPhone, edição de apelido e limpeza de dados de teste locais.

---

## 💾 Dados Locais Salvos (AsyncStorage)
*   `bitzrun_profile`: Objeto contendo nome, pontuação de consistência, streak atual, data da última corrida, URI do avatar e a propriedade `weeklyRunGoal`.
*   `bitzrun_runs`: Lista contendo o histórico de sessões com IDs, distâncias decimais em km, durações em segundos, humor inicial/final, notas textuais e indicadores de retorno de atividade.
*   `bitzrun_achievements`: Registro de conquistas desbloqueadas contendo o identificador do marco e a data correspondente.
*   `bitzrun_memory_cards`: Coleção de notas motivacionais geradas pelo storage após treinos representativos.

---

## 🧠 Decisões Importantes de Produto
*   **Decisão 1: Distância por KM**: Substituição das metas de tempo por distâncias em KM para dar maior tangibilidade física ao progresso, mesmo operando em modo de simulação inicial.
*   **Decisão 2: Sem GPS e Backend**: Foco na validação visual e de fluxo antes de investir em custos de nuvem ou consumo excessivo de bateria por localização.
*   **Decisão 3: Contraste Visual Escuro**: Visual premium de base preta e verde-limão energético de forma a valorizar o aspecto iOS moderno e profissional do aplicativo Bitzrun.
