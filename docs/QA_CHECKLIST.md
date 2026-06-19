# Checklist de Testes Manuais (QA) — Bitzrun MVP 0.1

Este guia define o roteiro de testes para validação e homologação do aplicativo Bitzrun em um iPhone real via **Expo Go**.

---

## 📱 Fluxo de Entrada e Identificação
- [ ] **Entrada como Visitante**:
    *   Abrir o aplicativo e tocar no botão "Entrar como Visitante".
    *   Verificar se o aplicativo redireciona o usuário para a Home (Dashboard) passando pela tela de transição com slogan.
- [ ] **Cadastro de Nome**:
    *   Na tela inicial, selecionar "Crie seu ponto de partida" (Cadastro).
    *   Tentar avançar com o campo de nome vazio e checar se há alerta de restrição.
    *   Inserir um nome (máximo 20 caracteres) e verificar se o teclado se comporta corretamente (não cobrindo o botão "Começar").
    *   Confirmar se o Dashboard carrega exibindo o nome inserido no cabeçalho.

---

## 🏠 Dashboard (Hoje) & Configurações de Metas
- [ ] **Interface da Home**:
    *   Verificar se o anel de progresso é renderizado perfeitamente.
    *   Checar se as estatísticas iniciais exibem zeros de forma elegante caso o perfil seja novo.
- [ ] **Alteração da Meta da Semana (Home)**:
    *   Tocar no link "Alterar meta" no card de progresso.
    *   Verificar se o modal nativo desliza da parte inferior da tela.
    *   Selecionar uma das opções (ex: 4x por semana — Firme) e tocar em "Salvar meta".
    *   Confirmar se a Home atualiza o texto de apoio para "Sua meta: 4 corridas por semana" e se o anel reflete a proporção.
- [ ] **Alteração da Meta da Semana (Perfil)**:
    *   Ir para a aba Perfil, clicar no seletor rápido `2 | 3 | 4 | 5 | 6` de meta semanal.
    *   Verificar se o valor atualiza na tela de perfil instantaneamente e se, ao voltar para a Home, a alteração foi sincronizada.

---

## 🏃 Fluxo de Corrida
- [ ] **Footer "Correr"**:
    *   Clicar no botão central verde-limão "Correr" no rodapé.
    *   Verificar se o fluxo de preparação de corrida é acionado de imediato.
- [ ] **Preparar Corrida**:
    *   Verificar se a pergunta *"Como você está chegando hoje?"* e o seletor de humor de 1 a 5 funcionam por toque.
    *   Confirmar que o título exibe *"Meta da corrida"* e a pergunta de distância exibe *"Qual distância você quer tentar hoje?"*.
- [ ] **Meta da Corrida (Distâncias Fixas)**:
    *   Selecionar a meta de "2 km" e tocar em iniciar.
    *   Verificar se a corrida ativa se inicia com a distância-alvo configurada em 2.0 km.
- [ ] **Meta da Corrida (Meta Personalizada)**:
    *   Selecionar a opção "Personalizada".
    *   Tentar iniciar a corrida com o campo de texto vazio e verificar o alerta *"Informe uma distância válida para continuar."*.
    *   Digitar valores inválidos (0, negativos, maiores que 50) e verificar se há barreira de validação.
    *   Digitar uma distância válida usando vírgula (ex: `2,5`) ou ponto (ex: `3.5`). Confirmar se a meta é reconhecida e o treino inicia sem erros de NaN.
- [ ] **Corrida em Andamento (Ativa)**:
    *   Verificar se o cronômetro avança de 1 em 1 segundo.
    *   Checar se a distância avança de forma simulada a cada segundo.
    *   Verificar se a barra de progresso horizontal se preenche proporcionalmente à distância percorrida.
    *   Confirmar a exibição de banners motivacionais quando o tempo ou a distância atingem marcas específicas.
- [ ] **Pausar e Continuar**:
    *   Tocar no botão "Pausar" e verificar se o cronômetro e a distância param.
    *   Confirmar se o botão muda para "Continuar" com preenchimento em verde-limão e alto contraste de texto.
    *   Tocar em "Continuar" e verificar se o treino retoma a contagem normalmente.
- [ ] **Encerrar Corrida**:
    *   Tocar no botão de Stop (quadrado) e confirmar a finalização da corrida.
    *   Se o treino tiver menos de 5 segundos, checar se há alerta de descarte por tempo curto.

---

## 📊 Pós-Corrida & Telas de Fechamento
- [ ] **Resumo da Corrida**:
    *   Verificar se a tela de resumo exibe a distância exata, o tempo percorrido e o pace médio calculados do treino.
- [ ] **Humor Pós-Corrida & Notas**:
    *   Na tela de feedback de humor, checar se é possível selecionar o sentimento final de 1 a 5.
    *   Digitar uma nota curta de treino no campo de texto e confirmar se o teclado não impede a visualização dos botões inferiores.
- [ ] **Registro Concluído (Sucesso)**:
    *   Checar se a tela final exibe o título *"Registro concluído"* com o subtítulo *"Você manteve o hábito vivo."*.
    *   Confirmar se o card apresenta o título *"Corrida registrada"* com as métricas de KM e tempo formatadas.
    *   Tocar no botão "Voltar para Hoje" e verificar se os dados acumulados de treinos foram atualizados na Home.

---

## 📂 Jornada, Conquistas e Perfil
- [ ] **Jornada**:
    *   Verificar se o gráfico semanal exibe as colunas com a contagem de treinos.
    *   Se for um usuário novo, atestar que as seções de comparação e gráfico exibem os estados vazios e explicações adequados em vez de traços quebrados.
- [ ] **Conquistas**:
    *   Verificar se a barra de progresso no cabeçalho exibe a contagem correta (ex: *1 de 9 conquistas*).
    *   Verificar se as conquistas bloqueadas exibem a mensagem de progresso parcial correspondente (ex: *1/10 corridas*) de forma legível.
- [ ] **Perfil**:
    *   Tocar em "Alterar foto" e selecionar uma imagem real da galeria do iPhone. Verificar se o avatar é atualizado no Perfil e no topo da Home.
    *   Editar o nome de usuário local e confirmar a persistência dos dados.
    *   Clicar em "Limpar dados de teste" e confirmar a caixa de diálogo de segurança. Checar se todo o histórico de corridas, conquistas e fotos é excluído e o app retorna ao estado inicial limpo.
