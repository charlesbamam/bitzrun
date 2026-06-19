# Bitzrun — Checklist de Teste Manual (QA)

Este documento contém o checklist de verificação para guiar os testes manuais da versão MVP 0.1 do Bitzrun no iPhone ou simulador iOS.

---

## 🔐 1. Fluxo de Boas-Vindas e Identificação
*   [ ] **Entrar como Visitante**: Ao abrir o app pela primeira vez, tocar no botão de visitante e verificar se o fluxo segue sem pedir login.
*   [ ] **Cadastro de Nome**: Registrar o nome e verificar se o app prossegue corretamente para a animação de boas-vindas.
*   [ ] **Animação de Transição**: Checar se a tela de carregamento após a identificação transiciona suavemente para o Dashboard principal.

---

## 🏠 2. Dashboard / Home
*   [ ] **Nome de Usuário**: Validar se o nome cadastrado é exibido na Home.
*   [ ] **Índice de Consistência**: Verificar se o círculo de progresso ou pontuação é exibido corretamente (inicia em 0).
*   [ ] **Texto de Meta da Semana**:
    *   Verificar se exibe `"Meta da semana"` como título.
    *   Exibir `"X de Y corridas feitas"`.
    *   Texto de apoio: `"Sua meta: Y corridas por semana."`
*   [ ] **Mudança Dinâmica de Meta Semanal**:
    *   Tocar no card de Meta e alterar a meta (valores 2, 3, 4, 5 ou 6).
    *   Verificar se o dashboard atualiza o texto de apoio imediatamente (ex: se selecionou 4, deve exibir "Sua meta: 4 corridas por semana.").
    *   Validar os textos dinâmicos de falta: se faltar 1, deve exibir "Falta 1 corrida para fechar sua semana.", se faltar mais, "Faltam X corridas para fechar sua semana.".

---

## 🏃 3. Fluxo de Corrida (Setup e Ativo)
*   [ ] **Abertura do Fluxo**: Tocar no botão "Correr" no menu inferior.
*   [ ] **Escolha de Meta da Corrida**:
    *   Verificar seleção de distâncias predefinidas (0,5 km, 1 km, 2 km, 3 km, 5 km).
    *   Tocar em "Personalizada" e testar digitação de metas com vírgula e ponto (ex: `1,5` ou `2.5`). Validar se o app aceita o início normalmente sem gerar erros ou valores `NaN`.
*   [ ] **Humor de Entrada**: Selecionar humor inicial no seletor de emojis antes de iniciar a corrida.
*   [ ] **Cronômetro e Simulação**:
    *   Iniciar treino e observar se o tempo de corrida avança de segundo em segundo.
    *   Verificar se a distância percorrida é incrementada gradualmente.
    *   Verificar se a barra de progresso da corrida avança condizente com a distância alvo.
*   [ ] **Botão Pausar / Continuar**:
    *   Pausar a corrida. Verificar se o cronômetro e a simulação de quilômetros congelam.
    *   Tocar no play (de alto contraste verde-limão) e confirmar que o cronômetro volta a rodar.
*   [ ] **Mensagens Motivacionais**: Checar se banners e notificações internas disparam nos gatilhos pré-estabelecidos de tempo ou distância (ex: aos 10s e ao cruzar 1km).
*   [ ] **Encerrar Corrida**: Tocar no botão de Stop quadrado. Confirmar alerta caso o treino tenha menos de 5 segundos.

---

## 📊 4. Conclusão, Humor e Motivos
*   [ ] **Resumo (EndRunScreen)**: Verificar se exibe a distância e o tempo finais perfeitamente formatados em português.
*   [ ] **Tela de Humor Pós-Corrida (MoodFeedbackScreen)**:
    *   Verificar pergunta principal: *"Como você está se sentindo agora?"* e subtexto *"Compare com antes da corrida. Isso também é progresso."*
    *   Escolher humor e preencher campo de observações (limite de 200 caracteres).
*   [ ] **Seção Secundária de Interrupção**:
    *   **Se a meta FOI atingida**: Confirmar que a seção *"Algo dificultou chegar até a meta?"* **NÃO** aparece.
    *   **Se a meta NÃO foi atingida**: Confirmar que a seção *"Algo dificultou chegar até a meta?"* **APARECE** abaixo das notas.
    *   Tocar nas pills de dificuldade. Validar se o comportamento de seleção múltipla funciona.
    *   Testar se os labels das pills aparecem traduzidos em português (Joelho doeu, Falta de tempo, etc.).
    *   Confirmar que o aviso visual de saúde preventiva aparece ao marcar *"Tontura"* ou *"Me senti mal"*.
    *   Testar botão "Salvar e concluir" sem selecionar nenhum motivo. Verificar se o app salva com sucesso.
*   [ ] **Registro Concluído**: Confirmar exibição dos cartões de memória gerados e marcos conquistados na tela final.

---

## 📖 5. Jornada e Diário de Corrida
*   [ ] **Gráfico Semanal**: Validar a exibição da barra correspondente à semana atual.
*   [ ] **Seção Últimas Corridas**:
    *   Validar se o novo treino aparece no topo da lista.
    *   Confirmar exibição de: Data, distância, meta, humor antes/depois por extenso e motivos de interrupção salvos.
    *   Confirmar que a meta batida mostra o tag verde-limão `"Meta alcançada"` e metas parciais exibem `"Hábito mantido"`.
*   [ ] **Detalhe do Registro**:
    *   Tocar no card de corrida. Confirmar abertura do modal de detalhe.
    *   Validar exibição de todos os dados salvos: Duração formatada, notas extras, observação descritiva de interrupção e data com hora.
*   [ ] **Marcos e Cartões de Memória**: Validar se os cartões gerados aparecem na seção de momentos marcantes na Jornada e se o compartilhamento via API nativa funciona.

---

## ⚙️ 6. Perfil e Testes Gerais
*   [ ] **Visualização do Perfil**: Acessar perfil e verificar dados do score e histórico.
*   [ ] **Foto de Perfil**: Trocar avatar escolhendo uma imagem da galeria do iPhone.
*   [ ] **Limpeza de Dados de Teste**:
    *   Tocar em "Limpar testes" no cabeçalho ou no botão correspondente do Perfil.
    *   Confirmar exclusão e redefinição dos dados para o estado inicial padrão de fábrica.
