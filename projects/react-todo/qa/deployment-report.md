# Deployment Report: React Todo Application

**Author:** DevOps Engineer
**Date:** 2026-03-18
**Build reference:** commit `0b634d4`
**QA sign-off:** ✅ Approved (see `qa/sign-off.md`)

---

## Deployment Summary

- **Status:** ✅ Ready — all pre-build checks passed
- **Type:** Static frontend SPA (no server required)
- **Deployment target:** Any static file host (Netlify, Vercel, GitHub Pages, Nginx, S3+CloudFront)
- **Build output:** `projects/react-todo/app/dist/`

---

## Pre-Build Checklist

| Check | Result |
|---|---|
| QA sign-off present | ✅ |
| Correct build reference (0b634d4) | ✅ |
| All config files present | ✅ (package.json, tsconfig.json, vite.config.ts, tailwind.config.js, postcss.config.js, index.html) |
| No `.env` files committed | ✅ |
| `node_modules` not in repo | ✅ |
| No secrets in source | ✅ (verified by QA) |
| `.gitignore` correctly excludes `dist/` and `node_modules/` | ✅ |

---

## Build Instructions

### Local Development

```bash
cd projects/react-todo/app
npm install
npm run dev
# → http://localhost:5173
```

### Run Tests

```bash
cd projects/react-todo/app
npm install
npm run test
# → 26 test cases; all expected to pass
```

### Production Build

```bash
cd projects/react-todo/app
npm install
npm run build
# → Output in dist/
npm run preview
# → Serves production build at http://localhost:4173
```

### Deploy to Netlify (Recommended for quick deployment)

```bash
# One-time: install Netlify CLI
npm install -g netlify-cli

cd projects/react-todo/app
npm install && npm run build
netlify deploy --prod --dir=dist
```

### Deploy to Vercel

```bash
npm install -g vercel
cd projects/react-todo/app
vercel --prod
# Vercel auto-detects Vite; set output dir to 'dist'
```

### Deploy to GitHub Pages

Add to `vite.config.ts`:
```ts
export default defineConfig({
  base: '/react-todo/',   // replace with your repo name
  ...
})
```
Then:
```bash
npm run build
# Push dist/ to gh-pages branch
```

### Deploy behind Nginx

```nginx
server {
    listen 80;
    server_name yourdomain.com;
    root /var/www/react-todo/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;  # Required for SPA routing
    }
}
```

---

## Environment Variables

None required. This is a fully static application. No `.env` file needed.

---

## Post-Deployment Smoke Test

After deploying, verify:

- [ ] App loads at the deployment URL (HTTP 200)
- [ ] Input field accepts text
- [ ] Add a todo — appears in list
- [ ] Refresh page — todo still present (localStorage)
- [ ] Toggle, edit, delete — all functional
- [ ] Filter tabs switch correctly
- [ ] Footer count updates

---

## Rollback Plan

This is a static SPA. Rollback is a redeployment of the previous build:

```bash
git checkout <previous-commit-hash>
npm install && npm run build
# Redeploy dist/ using whichever method above
```

For Netlify/Vercel: use the platform's deploy history UI to roll back to a previous deployment in one click.

---

## Known Caveats

- `node_modules` must be installed before build — not bundled in repo (correct behaviour)
- localStorage data is per-browser; clearing browser data resets todos (expected behaviour, documented in UI)
- No offline/PWA support in this version — app requires initial load from server

---

## Handoff to: Project Manager

[READY FOR REVIEW]

**Deployment status:** ✅ Ready to ship
**Build reference:** `0b634d4`
**How to run:** `npm install && npm run dev` (dev) or `npm run build` (prod)
**Post-deployment checks:** All pre-build verifications passed
**Rollback:** Redeploy from previous git commit or use platform deploy history
