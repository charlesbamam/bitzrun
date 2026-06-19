# Skill: redesign-ux-health-app

## Objetivo
Usar esta skill como guia de redesign para um app mobile de saúde, métricas e progresso pessoal, inspirado em uma linguagem visual calorosa, leve e editorial. O foco é reproduzir a sensação do app de referência: amigável, humano, premium e fácil de escanear.

## Contexto de produto
O app de referência combina acompanhamento de saúde com uma experiência emocionalmente positiva. A interface evita aparência clínica e técnica demais, usando ilustrações grandes, cartões suaves, tipografia expressiva e muito espaço em branco. As telas analisadas mostram um padrão consistente entre dashboard, score de progresso, medições recentes e navegação principal. [file:1][file:2][file:3][file:4]

## Princípios de UX

### 1. Progresso antes de complexidade
A hierarquia da experiência prioriza score, evolução e últimas medições, não menus, filtros ou dados densos. O usuário entende rapidamente “como estou hoje?” antes de explorar detalhes. [file:1][file:2][file:3][file:4]

Diretriz prática:
- Toda tela principal deve responder primeiro ao estado atual do usuário.
- O bloco mais importante precisa aparecer acima da dobra.
- Métricas secundárias entram em cartões resumidos, nunca competindo com o score principal.

### 2. Saúde com tom acolhedor
A UX transmite cuidado e incentivo, não vigilância. Mensagens como cumprimento pessoal, congratulações e textos curtos de apoio reduzem fricção emocional e tornam o acompanhamento mais humano. [file:1][file:2][file:3]

Diretriz prática:
- Usar microcopy positiva, curta e específica.
- Preferir linguagem de progresso a linguagem de erro.
- Mostrar feedback como “improved”, “stable”, “+points” em vez de alertas excessivos.

### 3. Escaneabilidade instantânea
As telas são pensadas para leitura em poucos segundos: títulos fortes, cartões separados, poucas ações por área e espaçamentos generosos. Isso reduz carga cognitiva e favorece uso recorrente. [file:1][file:2][file:3][file:4]

Diretriz prática:
- Uma ideia principal por bloco.
- Máximo de 3 níveis visuais por seção: título, valor, contexto.
- Evitar tabelas densas, linhas excessivas e componentes muito compactos.

### 4. Descoberta progressiva
O app não despeja todas as informações de uma vez. Ele apresenta resumos primeiro e usa cards, setas, tabs e sessões curtas para aprofundamento gradual. [file:1][file:3][file:4]

Diretriz prática:
- Dashboard mostra resumo; detalhe entra em tela secundária.
- Carrosséis e cartões podem introduzir features, desde que o primeiro item já entregue valor.
- Ícones de navegação e pequenas setas sinalizam continuidade sem poluir a interface.

## Princípios de UI

### 1. Estética Neo-Fitness e High-Contrast
La interface usa superfícies escuras com alto contraste, fontes robustas e realces em verde-limão para transmitir energia, dinamismo e uma estética tecnológica premium de alta performance.

Diretriz visual:
- Fundo em preto puro (#000000) ou grafite escuro (#121212).
- Cards em cinza escuro (#1E1E1E) com cantos arredondados expressivos (16 a 24px).
- Destaques pontuais em verde-limão vibrante (#CCFF00) para ações, progresso e status.
- Divisões sutis por tom, evitando sombras pesadas.

### 2. Ilustração como elemento de valor
As ilustrações ocupam área nobre e ajudam a criar personalidade, pausa visual e contexto emocional. Elas não são apenas decorativas; funcionam como banner de boas-vindas e como âncora de identidade. [file:2][file:4]

Diretriz visual:
- Usar ilustrações editoriais grandes no topo de telas-chave.
- Preferir formas orgânicas, personagens em movimento e cores complementares ao fundo.
- Não misturar ilustrações complexas com excesso de dados na mesma dobra.

### 3. Tipografia com Extrema Dinâmica de Peso (Roboto)
A UI utiliza a fonte Roboto em múltiplos pesos para criar um ritmo visual dinâmico e marcante. Alterna títulos e números proeminentes em peso pesado (Black 900 / Bold 700) com subtextos e labels finos e leves (Light 300 / Thin), gerando alto contraste de peso.

Diretriz visual:
- Títulos e métricas com peso herói em Roboto Black (900).
- Subtextos e labels auxiliares em Roboto Light (300) ou Thin.
- Contraste agressivo de pesos para guiar a leitura instantânea.
- Visual esportivo de alta performance.

### 4. Componentes com aparência tátil e ícones outline
Os cartões parecem "tocáveis" por causa do padding generoso, raio alto e separação por tons de cor. Os ícones seguem exclusivamente o estilo outline para manter a limpeza visual da interface.

Diretriz visual:
- Cards com 16 a 24px de padding interno.
- Radius entre 16 e 24px como base.
- Ícones exclusivamente no estilo outline (sem preenchimento) com linhas finas/médias.
- Divisões por variação de tom cinza/preto, mantendo a tela organizada.

## Padrões observados nas telas

### Home de boas-vindas
A tela de greeting usa saudação com nome, card hero ilustrado e bloco de medições logo abaixo. Essa composição cria uma entrada emocional primeiro e funcional depois. [file:1]

Padrão para reproduzir:
- Cabeçalho pessoal com avatar e ações rápidas.
- Hero card grande com imagem/ilustração.
- Texto curto de contexto semanal.
- Sessão de medições recentes com cards verticais.

### Tela de score principal
A tela “Measure” destaca o score central com visual circular e reduz ruído ao redor. O número domina a composição, enquanto os cards inferiores segmentam domínios como Activity, Body e Heart. [file:2]

Padrão para reproduzir:
- Um indicador principal por tela.
- Visualização gráfica simples e memorável.
- Blocos temáticos coloridos, pequenos e escaneáveis.
- Navegação inferior sempre visível.

### Tela de categoria com ilustração
A tela “Activity” usa fundo temático, ilustração grande e score logo abaixo para contextualizar aquela dimensão do app. Isso reforça senso de área/foco sem exigir explicação longa. [file:3]

Padrão para reproduzir:
- Cada área do produto pode ter cor e ilustração próprias.
- O score da categoria deve ficar logo após o header visual.
- Medições específicas aparecem em lista resumida abaixo.

### Tela de métricas corporais
A tela “Body” organiza medições recentes em cartões compactos, com label, valor, horário e mini-gráfico. Isso mostra densidade de dados sem perder leveza. [file:4]

Padrão para reproduzir:
- Mostrar valor principal em destaque.
- Exibir contexto temporal com baixa ênfase.
- Usar mini sparklines ou linhas simples para tendência.
- Associar status como stable/gaining/perda com ícone e cor suave.

## Sistema visual recomendado

### Paleta
A paleta baseia-se em uma estética de alta energia e esportividade, focada em preto, cinza e verde-limão de alto contraste.

Tokens sugeridos:
- `bg.app`: #000000 (Preto puro para profundidade e apelo tecnológico).
- `bg.surface`: #121212 ou #1E1E1E (Preto chumbo/grafite para cartões e blocos).
- `bg.surface-alt`: #262626 (Cinza escuro para componentes secundários ou estados inativos).
- `text.primary`: #FFFFFF (Branco puro para contraste máximo nos textos).
- `text.secondary`: #A0A0A0 (Cinza claro para textos de apoio).
- `accent.lime`: #CCFF00 (Verde-limão vibrante/neon para status ativos, conquistas, barras de progresso e realces).
- `accent.gray`: #404040 (Cinza médio para elementos bloqueados ou trancados).

### Tipografia
Uso exclusivo da fonte Roboto com extrema variação de peso (dinâmica tipográfica) para organizar a tela e guiar os olhos do usuário.

Diretriz tipográfica:
- Título de tela: 28–34px, Roboto Black (900) ou Bold (700).
- Número principal: 48–64px, Roboto Black (900).
- Título de card: 16–20px, Roboto Bold (700) ou Medium (500).
- Corpo auxiliar: 12–14px, Roboto Regular (400) ou Light (300).
- Labels e metadata: 11–12px, Roboto Light (300) em uppercase com espaçamento entre letras.

### Ícones
Todos os ícones devem usar exclusivamente o estilo outline (sem preenchimento), com traços finos/médios (strokeWidth 1.5 ou 2), priorizando leveza visual.

### Espaçamento e grid
A composição das referências depende de respiro visual consistente. O layout parece trabalhar com blocos simples, margens laterais amplas e empilhamento vertical previsível. [file:1][file:2][file:3][file:4]

Diretriz de layout:
- Margem lateral: 16 a 20px.
- Gap vertical entre seções: 20 a 28px.
- Gap interno de cartões: 12 a 16px.
- Altura mínima de toque: 44px.

## Regras de componentes

### Header
- Avatar ou contexto pessoal à esquerda.
- 1 ou 2 ações rápidas à direita.
- Título grande e caloroso.
- Select/dropdown discreto quando houver troca de perfil ou período. [file:1][file:2]

### Score card
- Número principal em maior destaque da tela.
- Subtexto curto explicando progresso recente.
- Ícone de informação pequeno.
- Visual gráfico simples; evitar dashboards complexos. [file:2][file:3]

### Cards de medição
- Label acima, valor abaixo com forte contraste.
- Horário alinhado à direita com baixa ênfase.
- Mini-gráfico horizontal simples.
- Estado resumido com microícone e texto curto. [file:4]

### Bottom navigation
- Quatro destinos no máximo.
- Ícone preenchido ou mais escuro no estado ativo.
- Labels curtos de 1 palavra.
- Área de toque generosa e persistente. [file:1][file:2][file:3]

## Heurísticas para o redesign

### Manter
- Sensação humana e otimista.
- Forte foco em progresso individual.
- Uso de ilustração como assinatura visual.
- Cards arredondados e leitura rápida. [file:1][file:2][file:3][file:4]

### Evitar
- Visual hospitalar ou excessivamente técnico.
- Excesso de azul escuro, cinza frio ou aparência enterprise.
- Cards com informação demais.
- Muitas ações concorrendo no topo da tela. [file:1][file:2][file:3][file:4]

### Melhorar no seu app
- Transformar métricas complexas em blocos com narrativa clara.
- Dar identidade visual por categoria sem quebrar consistência.
- Criar um score central que funcione como âncora do produto.
- Usar textos de apoio para orientar sem parecer tutorial. [file:1][file:2][file:3][file:4]

## Prompt operacional para usar no Antigravity
Copie e use este bloco como instrução-base no redesign:

```txt
Redesign this mobile app using a high-contrast modern fitness tech UX/UI system. The experience must feel energetic, highly structured, clean and punchy.

Use these principles:
- Prioritize high typographic contrast and weight dynamics using Roboto font (Light to Black weights).
- Make the main score or indicator stand out using neon lime green accenting (#CCFF00).
- Use outline icons exclusively for a clean, technical, yet premium feel.
- Card containers should be dark gray (#1E1E1E) over a pure black background (#000000).
- Organize content for instant scan: high contrast typography, lime highlights, clear metadata.
- Keep bottom navigation simple, using outline icons with lime active states.
- Avoid a clinical soft cream look, filled icons, light pastel backgrounds and overly soft typography.

Component rules:
- 16–20px card radius with subtle border lines instead of heavy shadows
- 16–20px horizontal page padding
- Roboto font with high weight contrast (thin text near heavy bold titles)
- Accent lime green (#CCFF00) for active/unlocked elements, gray for locked
- Pure black background (#000000) for high visual energy
```

## Checklist de validação
- A primeira dobra comunica estado atual em menos de 3 segundos.
- Existe apenas um foco principal por tela.
- Os números mais importantes são visualmente dominantes.
- A interface parece acolhedora, não clínica.
- Os cards são fáceis de tocar e escanear.
- A cor ajuda a segmentar, sem virar ruído.
- O app mantém consistência entre home, score, categoria e detalhes.
- A navegação inferior continua simples e previsível.

## Forma de uso
Use esta skill como documento-guia de UX e UI durante o redesign. Ao gerar novas telas, valide cada uma contra estes princípios antes de aprovar layout, componentes, microcopy e hierarquia visual.
