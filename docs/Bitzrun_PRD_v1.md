BITZRUN
Product Requirements Document
Versão 1.0  •  iOS MVP
Documento de especificação para construção via IA (Antigravity)

1. Visão Geral do Produto
Nome do App
Bitzrun
Plataforma
iOS (iPhone)
Categoria
Health & Fitness / Lifestyle
Público-alvo
Corredores amadores iniciantes (corrida de 500m a 10km)
Proposta central
Desenvolver o hábito de correr através de consistência e evolução pessoal
Modelo de negócio
Freemium — funcionalidades core gratuitas, premium para insights avançados
Versão
MVP 1.0

Declaração de Posicionamento
Bitzrun não é um app de performance. É um app de consistência.
O corredor não vê pace, frequência cardíaca ou calorias em destaque. Ele vê: 'Você apareceu.'
Enquanto Strava e Garmin medem performance, o Bitzrun mede a única coisa que importa para o corredor amador: ele está conseguindo continuar?

2. Problema Resolvido
O Ciclo do Corredor Amador
O principal problema do corredor iniciante não é falta de treino, técnica ou equipamento. É a inconsistência.
O padrão típico:
Segunda, quarta, sexta: corre.
Semana seguinte: não corre nenhuma vez.
Domingo isolado: corre.
15 dias parado.
Recomeça do zero — com culpa e desmotivação.

Esse ciclo se repete indefinidamente. O usuário não abandona a corrida por falta de vontade — ele abandona por falta de estrutura emocional e de registro de progresso.
O que o Bitzrun resolve
Transformar 'Estou tentando correr' em 'Sou uma pessoa que corre.'
Isso é construção de identidade, não treinamento de performance.

3. Proposta de Valor Central
A diferenciação do Bitzrun está em 3 pilares:

1. Corrida
O nicho — focado exclusivamente em corredores amadores
2. Consistência
O problema resolvido — a métrica principal é frequência, não velocidade
3. Evolução
A recompensa — o usuário vê quem está se tornando, não apenas o que correu

Linguagem de Interface
O app nunca exibe dados brutos como principal mensagem. Sempre transforma número em narrativa:

Em vez de:
O app mostra:
Você correu 4,8 km.
Você foi mais longe do que há 3 semanas.
Pace médio: 6:32/km
Hoje você completou um percurso que parecia impossível há 2 meses.
FC média: 152 bpm
Você correu mesmo sem vontade. Isso está virando um hábito.
Treino concluído.
Você apareceu.

4. Perfil do Usuário
Persona Principal
Homem ou mulher, 25–45 anos
Corre entre 1 km e 10 km por sessão
Não tem treinador, treina sozinho
Já tentou correr antes e parou
Busca motivação e consistência, não performance técnica
Sonha completar uma corrida de 5 km ou 10 km

Cenários de Uso
Saindo para correr cedo pela manhã, quer registrar antes e depois
Voltando de uma pausa de 10 dias, quer registrar o retorno sem culpa
Revisando sua evolução no fim do mês para se motivar
Compartilhando um cartão de memória com amigos

5. Telas do MVP — Especificação Detalhada
O MVP é composto por exatamente 6 telas. Nada além disso deve ser implementado na v1.0.

Tela 1  Dashboard — Hoje
Tela principal. Abre ao iniciar o app.
Saudação personalizada: 'Bom dia, [nome].'
Índice de Consistência: número grande (ex: 87/100) com label 'Sua consistência'
Streak atual: 'Você está em uma sequência de X corridas'
Botão principal CTA: 'INICIAR CORRIDA' — grande, centralizado, cor de destaque
Card resumo: última corrida registrada (data + distância narrativa)
Link rápido para 'Minha Jornada'

Tela 2  Iniciar Corrida
Fluxo de pré-corrida. Aparece ao tocar o botão principal.
Pergunta: 'Como você está se sentindo antes de correr?'
Opções de humor: 5 emojis (péssimo → ótimo) — seleção por toque
Campo opcional: 'Meta de hoje (distância ou tempo)' — sem obrigatoriedade
Botão: 'COMEÇAR' — inicia o tracking
Timer visível em tela cheia durante a corrida (minutos e segundos)
Botão secundário discreto: 'Pausar' e 'Encerrar corrida'

Tela 3  Finalizar Corrida
Tela de resumo pós-corrida. Aparece ao encerrar.
Mensagem de validação emocional (não técnica): ex: 'Você apareceu. Isso é tudo.'
Dados simples: Distância | Tempo | Data
Comparativo narrativo automático: 'Você correu X% mais do que na última sessão'
Se foi após pausa longa: 'Você voltou. Isso conta muito.'
Botão: 'REGISTRAR COMO ME SINTO AGORA'

Tela 4  Como Estou Me Sentindo
Registro emocional pós-corrida.
Pergunta: 'Como você está se sentindo agora?'
Mesmas 5 opções de humor do pré-corrida
Campo de texto livre opcional: 'Alguma nota sobre hoje?' (máx. 200 caracteres)
O delta humor (antes vs depois) é salvo e exibido nos insights mensais
Botão: 'SALVAR E CONCLUIR'
Animação simples de confirmação: '+1 corrida registrada. Sua consistência aumentou.'

Tela 5  Conquistas
Linha do tempo de marcos do usuário.
Layout: linha do tempo vertical (cronológica)
Cada conquista exibe: ícone, título, data, descrição curta
Conquistas por CONSISTÊNCIA (não distância):
  → Primeira semana ativa
  → 10 corridas registradas
  → Primeiro retorno após pausa
  → 50 corridas registradas
  → 3 meses ativos
Conquistas por EVOLUÇÃO pessoal:
  → Primeira vez correndo X km sem parar
  → Humor melhorou em 8 de cada 10 corridas
Cartões de memória especiais (compartilháveis como imagem)

Tela 6  Minha Jornada
Central de evolução e insights automáticos.
Seção 'Antes x Agora': comparativo mensal de distância máxima + humor predominante
Seção 'O que mudou em você' (ativa após 30 dias): lista narrativa de evolução
Seção 'Cartões de Memória': histórico de momentos marcantes gerados automaticamente
Gráfico simples de frequência semanal (barras — sem números técnicos, só visual)
Frase de fechamento mensal gerada automaticamente: ex: 'Você manteve o hábito por 42 dias.'
Botão: 'Compartilhar minha evolução' — exporta card visual para redes sociais

6. Métricas e Lógica de Dados
Índice de Consistência
A métrica central do app. Um número de 0 a 100 que representa o comportamento do usuário ao longo do tempo. NÃO é baseado em velocidade ou distância.

Fatores considerados no cálculo:
Frequência de corridas por semana
Regularidade (ausência de longas pausas)
Retornos após pausas (valorizado positivamente)
Quantidade total de sessões registradas

Cartões de Memória
Gerados automaticamente pelo sistema quando:
Primeira vez atingindo nova distância máxima
Primeira corrida após pausa de mais de 7 dias
Sequência de X corridas consecutivas alcançada
Melhora de humor detectada em mais de 70% das sessões recentes
Formato do cartão: data + fato narrativo. Ex: '15 de março — Primeira vez correndo 3 km sem parar.'

7. O que NÃO Implementar no MVP
Para manter o escopo enxuto e o produto coerente com sua proposta, as seguintes funcionalidades são EXPLICITAMENTE excluídas da v1.0:

Funcionalidade
Motivo da exclusão
Rede social / Feed
Aumenta complexidade e desvia do foco individual
Curtidas e comentários
Cria comparação social — prejudica o corredor iniciante
Chat ou grupos
Fora do escopo do MVP
Treinador IA
Requer dados de performance — fora da proposta
Planilhas automáticas de treino
Aumenta fricção; o usuário quer simplicidade
Integração Garmin / Apple Watch
Custo técnico alto para MVP; adicionar na v2
Mapa de percurso detalhado
Requer GPS contínuo; não é o foco da v1
Marketplace ou loja
Completamente fora do escopo
Notificações agressivas
Contra a proposta emocional do produto

8. Diretrizes de Design
Identidade Visual
Paleta principal
Fundo escuro (#1A1A2E) com acento verde-água (#00C896)
Paleta secundária
Cards em cinza-escuro suave (#2D2D44), texto em branco
Tipografia
Display: sem serifa bold e condensada. Body: sans-serif limpa e legível
Estilo geral
Minimalista, limpo, emocional — sem gráficos técnicos em destaque
Ícones
SF Symbols (iOS nativo) — consistência visual garantida
Animações
Micro-animações sutis. Evitar excesso — o peso emocional vem do texto

Tom de Voz da Interface
Primeira pessoa: 'Você apareceu.' — nunca 'Parabéns, o treino foi concluído.'
Sem jargão técnico na tela principal
Frases curtas, diretas, com peso emocional
Nunca pressionar o usuário — sempre validar o retorno

9. Momento 'Uau' — Ativação em 30 Dias
O momento de maior impacto emocional ocorre após 30 dias de uso. Uma tela especial é desbloqueada automaticamente:

O que mudou em você
Nos últimos 30 dias:
• Você correu 11 vezes.
• Correu 42 km no total.
• Superou sua maior distância em 3 ocasiões.
• Saiu para correr 4 vezes sem estar motivado.
• Terminou melhor do que começou em 9 corridas.
Você não está apenas correndo. Você está construindo consistência.

10. Mensagens para Landing Page / App Store
Headline Principal
Cada corrida muda um pouco quem você é. Registre essa evolução.
Headline Alternativa
A maioria das pessoas desiste. Você só precisa continuar aparecendo.
Subtítulo
Bitzrun é o app para corredores amadores que querem desenvolver consistência — não bater recordes. Registre cada corrida, acompanhe sua evolução e descubra até onde você consegue chegar.
Frases de Suporte
Não medimos pace. Medimos presença.
Cada retorno após uma pausa conta tanto quanto a melhor corrida.
Transforme 'estou tentando correr' em 'sou uma pessoa que corre.'

11. Funcionalidades para Versão 2.0
Após validação do MVP, as seguintes funcionalidades podem ser consideradas:
Integração com Apple Health para importar dados de GPS automaticamente
Mapa de percurso simplificado (apenas visualização, sem métricas técnicas em destaque)
Notificações inteligentes baseadas no padrão do usuário (sem pressão)
Compartilhamento de cartões de memória como imagem para redes sociais
Plano de consistência sugerido (não obrigatório) baseado no histórico
Versão premium com insights semanais personalizados

Bitzrun — PRD v1.0 — Documento para construção iOS via IA
