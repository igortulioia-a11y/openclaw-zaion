# zaionext — extensoes customizadas do Zaion

Adicoes do fork pessoal `openclaw-zaion`. **Nao modificar arquivos do upstream** — tudo novo aqui, registrado via plugin/extension system.

## Submodulos planejados

(em construcao — implementacao em andamento)

- `tools/TodoWriteTool/` — task tracking interno do agente (anti-drift em tarefas longas)
- `tools/ToolSearchTool/` — schema deferido pra tools (reduz prompt inicial)
- `coordinator/` — multi-agent orchestration

## Como adicionar nova feature

1. Criar pasta `src/zaionext/<feature>/`
2. Implementar isolado, sem dependencia de arquivo upstream especifico
3. Registrar via plugin/extension system do openclaw (ver `extensions/` e `src/plugins/` do upstream)
4. Documentar nesse README com 1-2 linhas
5. Testar localmente (build local com `pnpm`)
6. Push em `main` -> GitHub Action builda imagem nova -> Easypanel pega
