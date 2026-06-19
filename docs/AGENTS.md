# Bitzrun — Regras do Projeto

Este é um app mobile iOS de teste feito com Expo, React Native e TypeScript.

## Nome do app

Bitzrun

Nunca usar Blitzrun. O nome correto é Bitzrun.

## Objetivo do produto

Bitzrun ajuda pessoas a criarem o hábito de correr aos poucos, sem pressão, com foco em consistência, evolução emocional e pequenas vitórias.

O app não deve parecer um app competitivo de corrida. Ele deve parecer um companheiro de hábito.

## Direção do produto

O foco do Bitzrun não é performance esportiva avançada.

O foco é:
- ajudar a pessoa a começar
- reduzir a resistência inicial
- valorizar corridas pequenas
- reforçar consistência
- registrar evolução emocional
- criar memória positiva do progresso

## Stack

- Expo
- React Native
- TypeScript
- Expo Router
- AsyncStorage para dados locais
- Sem backend nesta primeira versão
- Sem autenticação real nesta primeira versão
- Sem GPS real na versão 0.1

## Direção UX

Os screenshots existentes devem ser usados apenas como referência de fluxo e conteúdo, não como UI final.

Criar uma experiência mais profissional para iOS:
- visual premium
- dark mode refinado
- cards elegantes
- tipografia bem hierarquizada
- ícones profissionais no lugar de emojis
- espaçamentos consistentes
- navegação simples
- botões claros e grandes
- feedback positivo depois de cada corrida
- respeito à Safe Area do iPhone

## Direção visual

Usar uma identidade escura, energética e minimalista.

Base visual:
- fundo preto ou quase preto
- cards em cinza grafite
- verde-limão como cor principal de ação
- branco para títulos principais
- cinza claro para textos secundários
- bordas arredondadas
- sombras sutis
- ícones lineares e simples

Evitar:
- visual infantil
- excesso de neon
- telas poluídas
- emojis como elementos principais da interface
- copiar literalmente os screenshots

## Fluxo principal da versão 0.1

1. Splash
2. Login
3. Cadastro
4. Entrar como visitante
5. Home / Hoje
6. Preparar Corrida
7. Corrida em andamento
8. Encerrar corrida / resumo
9. Como estou me sentindo agora
10. Registro concluído
11. Conquistas
12. Jornada
13. Perfil

## Funcionalidades da versão 0.1

- entrar como visitante
- criar/editar nome local
- visualizar tela Hoje
- iniciar corrida
- registrar humor antes da corrida
- escolher meta rápida
- iniciar cronômetro
- pausar cronômetro
- encerrar corrida
- gerar distância simulada ou manual
- registrar humor depois da corrida
- adicionar nota curta
- salvar registro local
- atualizar estatísticas
- mostrar conquistas básicas
- mostrar jornada
- mostrar perfil
- limpar dados de teste

## Dados locais

Criar estruturas para:
- usuário visitante
- corridas registradas
- humor antes
- humor depois
- notas do dia
- conquistas
- cartões de memória
- configurações de meta semanal

## Regras técnicas

- Criar componentes reutilizáveis
- Usar TypeScript
- Usar dados locais inicialmente
- Não criar backend
- Não criar autenticação real
- Não configurar GPS ainda
- Não instalar bibliotecas sem explicar antes
- Não deletar arquivos sem autorização
- Garantir que rode no Expo Go
- Antes de grandes mudanças, apresentar plano de arquivos

## Componentes desejados

Criar componentes como:
- AppButton
- AppCard
- AppHeader
- ScreenContainer
- MetricCard
- MoodSelector
- RunSummaryCard
- SectionTitle
- BottomTabs
- ProgressRing
- AchievementCard
- MemoryCard

## Tom do app

O texto do Bitzrun deve ser humano, direto e motivador.

Evitar frases agressivas, competitivas ou culpabilizantes.

Exemplos de tom:
- “O importante é aparecer.”
- “Você manteve o hábito vivo.”
- “Uma corrida curta ainda conta.”
- “Hoje você venceu a resistência.”
- “Consistência antes de performance.”
