# Giovanna Ribeiro — Yoga & Autoconhecimento

Portfólio estático em português, com fotografias e conteúdo do Canva fornecido e direção visual do moodboard Figma.

Execute `npm run dev` e abra http://127.0.0.1:4173. Verificação de sintaxe: `npm run check`. Não requer instalação de dependências.

Arquivos: `index.html` (conteúdo), `style.css` (tokens e responsividade), `script.js` (interações) e `assets/` (arquivos locais). Fontes e pendências editoriais estão em `docs/referencias.md`.

## Varredura de design — Impeccable

Skill 4.7.0 e detector 0.1.16 instalados localmente em `.agents/skills/impeccable/`. O detector é um executável independente; não requer dependências npm. Os atalhos abaixo usam o launcher Windows deste projeto.

- `npm run design:hooks`: consultar configuração.
- `npm run design:hooks:on`: ativar ou reparar hooks.
- `npm run design:check`: executar detector nos arquivos atuais, sem incluir backups.
- `npm run check:all`: verificar sintaxe e depois design.

Os hooks oficiais estão em `.codex/hooks.json`: `PostToolUse` para Edit/Write/apply_patch e `Stop` para revisão aprofundada dos arquivos de interface alterados na sessão. A configuração compartilhada fica em `.impeccable/config.json`.

Na primeira utilização, aprove os hooks pelo comando `/hooks` no Codex. A instalação em disco e o estado enabled não comprovam que uma sessão já aberta carregou e aprovou a integração. Se necessário, reabra o projeto após essa aprovação.

É uma varredura mecânica de design, não uma captura contínua de screenshots. No Codex, os hooks reportam problemas após a edição; não bloqueiam a gravação. Escritas por comandos de shell podem não disparar o matcher oficial: nesses casos, execute `npm run design:check`. Achados reais podem fazer o detector retornar código diferente de zero; mantenha-os visíveis até corrigir ou analisar cada ocorrência.
