# Adedonha

Adedonha é uma versão digital do jogo clássico “Stop/Adedonha”, com foco em partidas rápidas entre amigos.  
A proposta do projeto é manter a dinâmica tradicional do papel e caneta, mas com apoio de cronômetro, sorteio de letras, controle de pontuação e histórico de partidas.

## O que o app entrega

- Sorteio de letras por rodada
- Cronômetro configurável (30s a 180s)
- Quantidade de rodadas configurável
- Partidas com 2 a 7 jogadores
- Bloqueio de letras indesejadas antes do sorteio
- Sugestões de temas para jogar (modo beta)
- Placar com pontuação por jogador
- Histórico de jogos anteriores salvo localmente
- Visualização de detalhes de partidas passadas
- Geração e download de imagem do leaderboard
- Geração e download de template em PDF para impressão
- Tema claro/escuro
- Compartilhamento rápido via WhatsApp e X (Twitter)

## Fluxo principal da experiência

1. O jogador inicia a partida na tela inicial.
2. Define rodadas, tempo, quantidade de jogadores e preferências.
3. Gera a letra da rodada (com opção de contagem regressiva inicial).
4. Ao fim do tempo, registra os pontos de cada jogador.
5. O app soma a pontuação, avança para a próxima rodada e repete o ciclo.
6. No fim do jogo, mostra ranking final e permite baixar o resultado.

## Como executar localmente

### Pré-requisitos

- Node.js 18+ (recomendado)
- npm

### Passos

```bash
npm ci
npm run dev
```

Aplicação disponível em: `http://localhost:5173`

## Scripts úteis

- `npm run dev` — inicia ambiente de desenvolvimento
- `npm run build` — gera build de produção
- `npm run preview` — serve o build localmente
- `npm run lint` — executa lint do projeto

## Arquitetura funcional (visão rápida)

- **Entrada da partida:** tela inicial com botão “Começar”.
- **Tela principal:** painel único com configurações, letra atual, timer e pontuação.
- **Modais de apoio:** sugestões de temas, histórico, template e fim de jogo.
- **Persistência local:** histórico salvo no `localStorage` do navegador.
- **Sem backend próprio:** experiência toda focada no cliente.

## Tecnologias base

- React + TypeScript + Vite
- Tailwind CSS + componentes Radix UI/Shadcn
- Zustand para estado de letras excluídas
- Bibliotecas para exportação de imagem/PDF e compartilhamento

## Status atual

Projeto funcional para partidas casuais de Adedonha, com foco em experiência mobile/desktop, personalização rápida e compartilhamento dos resultados.
