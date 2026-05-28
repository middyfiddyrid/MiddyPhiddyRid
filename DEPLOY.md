# PsDiary — Deploy & Iterate Runbook

Everything needed to ship changes to the live site. No secrets in this file.

## Coordinates

| Thing | Value |
|---|---|
| Local app | `C:\Users\Union Terminal\Desktop\psdiary-app` |
| GitHub repo | https://github.com/middyfiddyrid/MiddyPhiddyRid (public) |
| Netlify project | `pagesixdiary` (team `matt-b7-tf0`) |
| **Live URL** | https://pagesixdiary.netlify.app |
| Deploy branch | `main` |
| Build command | `npm run build` → publishes `.next` (Next.js Runtime) |
| node/npm | `C:\Program Files\nodejs` (not always on PATH in a bare shell) |

## Netlify environment variables (already set)

- `DEMO_MODE=true`
- `NEXT_PUBLIC_DEMO_MODE=true`

These keep the live site in demo mode (no real Clerk/Supabase/Grok keys needed).
Add real keys later under: Netlify → project → Site configuration → Environment variables,
then trigger a redeploy.

## The iteration loop (this is the frictionless part)

Netlify auto-builds on every push to `main`. So shipping a change is just:

```powershell
# from the app folder
cd "C:\Users\Union Terminal\Desktop\psdiary-app"
git add .
git commit -m "describe the change"
git push
```

`git push` → Netlify detects it → builds → live site updates in ~1–2 min.
**No browser, no dashboard clicks, no drag-and-drop.**

### Authentication

The repo uses **Git Credential Manager** (`credential.helper = manager`).
- The **first** `git push` opens a one-time GitHub login in the browser.
- After you authorize once, Windows stores it and **every future push is silent.**
- The remote URL contains **no token** (verify: `git remote -v` shows a clean https URL).

## Verify a deploy

- Netlify dashboard → project `middyphiddyrid` → Deploys (watch build log).
- Or just load https://pagesixdiary.netlify.app after ~2 min.

## Local preview before pushing

```powershell
cd "C:\Users\Union Terminal\Desktop\psdiary-app"
npm run dev     # http://localhost:3000
npm run build   # full production build check (run this before pushing big changes)
```

## Build config files (committed)

- `netlify.toml` — build command, publish dir, `@netlify/plugin-nextjs`
- `tailwind.config.ts` + `postcss.config.js` — REQUIRED; without these Tailwind emits no CSS
- `.gitignore` — excludes `node_modules`, `.next`, and all `.env*` files (secrets never ship)

## Security TODO

- The Personal Access Token used for the very first push was shared in plaintext.
  **Revoke it** at https://github.com/settings/tokens — it is no longer needed
  (GCM handles auth, Netlify uses its own GitHub OAuth).
