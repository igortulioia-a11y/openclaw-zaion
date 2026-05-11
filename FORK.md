# openclaw-zaion — Fork pessoal do openclaw

Fork de [openclaw/openclaw](https://github.com/openclaw/openclaw) (MIT) com adicoes proprias pro agente "Zaion" do Igor.

## Filosofia: ADD-ONLY

Nao modificamos arquivos do upstream. Toda adicao vai em `src/zaionext/` e e registrada via pontos de extensao existentes do openclaw (plugin system, extensions, skill loader).

Razao: manter merge upstream trivial. Conflitos so nos poucos arquivos de registro (se houver).

## O que tem aqui que nao tem no upstream

Ver `src/zaionext/README.md` pra lista atualizada. Por enquanto, so a infra do fork.

## Como sincar com upstream

```bash
git remote add upstream https://github.com/openclaw/openclaw.git
git fetch upstream
git checkout main
git merge upstream/main
# resolver conflitos (se houver - geralmente so em arquivos de registro)
git push origin main
```

## Build & deploy

GitHub Action `.github/workflows/zaion-build.yml` builda imagem Docker e empurra pra GHCR:
- Tag: `ghcr.io/igortulioia-a11y/openclaw-zaion:latest`
- Tag por commit: `ghcr.io/igortulioia-a11y/openclaw-zaion:sha-<short>`

Trigger: push em `main` (manual via `workflow_dispatch` tambem ok).

Easypanel puxa essa imagem (configurado em `jarvis/openclaw-zaion` quando subir).

## Regras pra contribuir aqui

1. **Nao tocar em arquivo do upstream.** Se precisar alterar comportamento existente, abrir issue/discussion no upstream.
2. **Tudo novo em `src/zaionext/`** — pasta isolada.
3. **Registrar via plugin/extension system existente.**
4. **Atualizar `src/zaionext/README.md`** com o que cada submodulo faz.

## Actions

Workflows herdados do upstream estao **desabilitados** (50+ pipelines do projeto openclaw que nao se aplicam ao fork pessoal). So o nosso `zaion-build.yml` deve rodar. Pra religar Actions: Settings > Actions > General > "Allow all actions and reusable workflows".
