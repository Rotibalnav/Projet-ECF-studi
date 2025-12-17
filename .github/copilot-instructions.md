# Copilot Instructions for Projet-ECF-studi (EcoRide)

This repository is a static website (HTML/CSS/JS) for an eco‑carpooling project. It contains no backend server; a lightweight API client exists and points to `/api/*` endpoints that are not implemented here. There is also a MySQL schema file for reference. Use the notes below to work productively and avoid common pitfalls.

## Architecture Overview
- Frontend only: static pages in `index.html` and `page/*.html`, styles in `style.css`, scripts in `public/*.js` and `scripts/*.js`.
- Visual libraries: Bootstrap 5 CDN and Font Awesome are loaded in pages; no build toolchain.
- API client: `public/api.js` exposes `apiFetch(url, options)` to call JSON APIs with `credentials: "include"` and JSON headers.
- Contact form module: `scripts/formulaire.js` defines class `Formulaire` that manages DOM state for the contact form. Event wiring is in `scripts/evenements.js`.
- Assets: images under `Asset/` (referenced from HTML).
- SQL: `database.sql` contains a MySQL schema and sample data for a table `Utilisateurs`. It is not wired to the frontend.
- Docker: `dockerfile` (lowercase) uses `nginx:latest` but currently copies only `index.html`.

## File/Module Conventions
- ES Modules: Some scripts use `import`/`export` (e.g., `public/login.js`, `public/logout.js`, `scripts/evenements.js`). When adding or fixing script tags for these files, ensure `type="module"` in HTML. Example:
  - `<script type="module" src="/public/login.js"></script>`
- Relative paths: Prefer relative paths over absolute `/public/...` when deploying under subpaths (e.g., GitHub Pages). Example replacement: `../public/login.js` from files under `page/`.
- CSS interaction: `Formulaire` relies on CSS classes `.masque`, `.app`, `.disp` in `style.css` to animate show/hide of fields. Keep class names stable when editing styles or JS.
- Filenames with spaces: `page/mentions légales.html` is linked as `mentions%20légales.html` from `index.html`. Preserve encoding when creating links.

## Key Flows and Where to Look
- Login: `page/connexion_inscription.html` includes the login UI; behavior is handled by `public/login.js` which calls `apiFetch("/api/auth/login", { method: "POST", body: JSON.stringify({ email, password }) })` then redirects to `../connexion_inscription.html`.
- Logout: Pages may include `public/logout.js`; it triggers `POST /api/auth/logout` and redirects to `../index.html`.
- Contact form: `page/formulaire.html` loads `scripts/evenements.js` (as a module) which imports `Formulaire` from `scripts/formulaire.js`. It dynamically shows `vehicule` and `email` fields and aggregates answers with `Formulaire.getAnswers()`.
- Home search panel: UI only in `index.html` and `page/page_covoiturage.html`; no search backend is implemented here.

## Development Workflow
- Local preview: Use a static server to avoid module import issues and to serve assets.
  - Quick option (Node): `npx serve .` then open the reported URL.
  - VS Code: the “Live Server” extension also works.
- Script loading:
  - For `public/login.js` and `public/logout.js`, update HTML tags to `type="module"` if you see import errors in the console (these files use `import { apiFetch } from "./api.js"`). Ensure both files live in the same folder.
  - `page/formulaire.html` already loads `scripts/evenements.js` with `type="module"`.
- Branches: development happens on `dev` (default branch is `main`). Open PRs from `dev` → `main`.

## Docker Notes
- The provided `dockerfile` currently copies only `index.html`. To serve the whole site with nginx, copy all static assets into `/usr/share/nginx/html` (and consider renaming to `Dockerfile`):
  ```dockerfile
  FROM nginx:alpine
  COPY . /usr/share/nginx/html
  ```
  Ensure module script paths are relative so they resolve under nginx.

## Data Model Reference (Not Wired)
- `database.sql` creates database `Ecoride` and a table `Utilisateurs` with constraints and sample `INSERT`s. It ends with `DROP DATABASE Ecoride;` — treat it as a learning/demo script. Do not run as‑is in production.

## Known Gaps and Gotchas
- Missing script reference: multiple pages include `./page/script.js` which does not exist. Remove or add a real file if needed.
- API backend not present: `/api/auth/login` and `/api/auth/logout` are placeholders. If you implement a backend, keep CORS and cookie/session handling consistent with `apiFetch` (uses `credentials: "include"`).
- Absolute vs relative imports: using `/public/...` can break when hosted under a subpath; prefer `../public/...` from files in `page/`.

## Examples
- Use `apiFetch` in a module script:
  ```js
  import { apiFetch } from "./api.js";
  const res = await apiFetch("/api/auth/login", { method: "POST", body: JSON.stringify({ email, password }) });
  ```
- Toggle a field with `Formulaire`:
  ```js
  import Formulaire from "./formulaire.js";
  const f = new Formulaire("formulaire");
  f.isSelected("objet", "annulation_de_trajet", () => f.showChamp("email"), () => f.hideChamp("email"));
  ```

If anything above is unclear (e.g., desired Docker behavior, hosting path, or planned API contract), tell me what’s missing and I’ll refine these instructions.
