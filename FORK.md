# openclaw-zaion - Fork pessoal do openclaw

Fork de [openclaw/openclaw](https://github.com/openclaw/openclaw) (MIT) com extensoes proprias pro agente "Zaion" do Igor.

## Filosofia: ADD-ONLY via plugin system

O openclaw tem plugin system maduro. Nossa adicao usa esse sistema, **sem mexer no `src/` upstream**.

Cada feature nossa vira uma extension em `extensions/zaion-<feature>/`:
- `extensions/zaion-todowrite/` - task tracking interno (anti-drift)
- `extensions/zaion-toolsearch/` - schema deferido pra tools
- `extensions/zaion-coordinator/` - multi-agent orchestration

Padrao: cada pasta tem `package.json` + `openclaw.plugin.json` + `index.ts` (entry point que chama `definePluginEntry`).

## Como sincar com upstream

```bash
git remote add upstream https://github.com/openclaw/openclaw.git
git fetch upstream
git checkout main
git merge upstream/main
# conflitos só se houver pacote novo upstream com mesmo nome (extremamente raro)
git push origin main
```

## Build & deploy

GitHub Action `.github/workflows/zaion-build.yml` builda imagem Docker e empurra pra GHCR:
- Tag: `ghcr.io/igortulioia-a11y/openclaw-zaion:latest`
- Tag por commit: `ghcr.io/igortulioia-a11y/openclaw-zaion:sha-<short>`

Build inclui nossas extensions via `--build-arg OPENCLAW_EXTENSIONS=zaion-todowrite,zaion-toolsearch,zaion-coordinator`.

Easypanel pega essa imagem (configurado em `jarvis/openclaw-zaion` quando subir).

## Actions

Os 54 workflows herdados do upstream estao **desabilitados**. So o nosso `zaion-build.yml` roda. Pra religar algum herdado, ir em Settings > Actions > General + enable workflow individual.

## Regras pra contribuir

1. **Nao tocar em arquivo do upstream** (anything outside `extensions/zaion-*` and `.github/workflows/zaion-build.yml` and `FORK.md`).
2. **Cada feature = uma extension** sob `extensions/zaion-<feature>/`.
3. **Manifest declarativo** em `openclaw.plugin.json` (id, activation, configSchema).
4. **Sem deep import do core** - so de `openclaw/plugin-sdk/*`.
5. **Testar build local** via pnpm antes de push se possivel.

## Status

Iteracao atual:
- [x] Fork criado, Actions desabilitado nos herdados
- [x] Workflow `zaion-build.yml` criado e funcional
- [ ] Extension `zaion-todowrite` - em desenvolvimento
- [ ] Extension `zaion-toolsearch` - planejada
- [ ] Extension `zaion-coordinator` - planejada
