# Deploy no Netlify — flexhome (Lovable TanStack Start / SSR)

Este projeto **NÃO é um site estático** de drag-and-drop. É um app **TanStack Start (SSR)**
com rotas de API server-side (`/api/public/receipt`, `/api/public/events`) que o funil usa.
Por isso o **Netlify precisa BUILDAR** o projeto — já deixei tudo configurado para isso.

O ajuste-chave: o Lovable gera o Nitro mirado em **Cloudflare**; o `netlify.toml` aqui força
`NITRO_PRESET=netlify`, que faz o build sair como função serverless do Netlify (SSR + API).

## Como importar (escolha UM)

### Opção A — Git (recomendado, rebuild automático)
1. Suba esta pasta para um repositório (GitHub/GitLab).
2. Netlify → **Add new site → Import an existing project** → escolha o repo.
3. O Netlify lê o `netlify.toml` sozinho (build `npm install && npm run build`, publish `dist`).
4. Defina as variáveis de ambiente abaixo e faça o deploy.

### Opção B — Netlify CLI (sem Git)
Na raiz desta pasta:
```
netlify deploy --build --prod
```
(ele roda o build e sobe a função SSR). Precisa estar logado no Netlify CLI.

> ⚠️ Arrastar um zip estático no "Deploy manually" **não funciona** aqui: as rotas `/api/public/*`
> são server-side e só rodam com o build do Netlify.

## Variáveis de ambiente (Netlify → Site configuration → Environment variables)

Defina com escopo **All** (build + functions). As 3 primeiras são **obrigatórias** para as
rotas de API funcionarem em runtime:

| Variável | Valor | Observação |
|---|---|---|
| `SUPABASE_URL` | `https://xdupzopxishcifhfafka.supabase.co` | pública |
| `SUPABASE_PUBLISHABLE_KEY` | `sb_publishable_-yHQmJP7IohsAZ4Q_uJxYw_EFhHCoqM` | pública (anon) |
| `SUPABASE_SERVICE_ROLE_KEY` | **(pegar no Supabase)** | 🔒 **SEGREDO** — só no painel do Netlify, nunca no código |

O `SUPABASE_SERVICE_ROLE_KEY` você copia em **Supabase → Project Settings → API → `service_role`**.
Ele dá acesso admin (bypassa RLS) — por isso nunca vai em arquivo/zip/git.

As variáveis `VITE_SUPABASE_*` (cliente) já estão no `.env` incluído e são injetadas no build pelo
Vite — não precisa recolocá-las no Netlify (mas se quiser, o escopo "All" cobre).

## Observações
- `public/` tem o funil estático (checkout/pago/up1-3/products.js) — servido junto, na raiz.
- `supabase/` (edge functions) é do lado do Supabase, **não** entra no deploy do Netlify.
- Gerenciador de pacotes: deixei `package-lock.json` (npm) — build testado com npm + Node 22.
