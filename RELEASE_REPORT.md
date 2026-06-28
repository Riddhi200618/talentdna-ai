# TalentDNA AI Release Candidate Report

## Intentional File Changes

- `.gitignore` - fixed malformed `.tmp` ignore entry and added dependency/build/cache ignores.
- `API_CONTRACT.md` - replaced hardcoded loopback base URL with deployment-neutral API base URL guidance.
- `seed.py` - replaced hardcoded loopback base URL with `TALENTDNA_API_BASE_URL` and a production placeholder fallback.
- `Frontend/.env.example` - added production API URL placeholder for `VITE_API_BASE_URL`.
- `Frontend/DEPLOYMENT.md` - documented Vercel settings and required environment variable.
- `Frontend/vercel.json` - added SPA rewrite to `/index.html` for React Router refresh support.
- `Frontend/package-lock.json` - added npm lockfile for reproducible Vercel installs.
- `Frontend/src/components/CandidateCard.tsx` - retained score/gap formatting cleanup.
- `Frontend/src/components/CandidateTable.tsx` - retained score/gap formatting cleanup.
- `Frontend/src/components/DetailModal.tsx` - retained ATS vs TalentDNA comparison/fallback presentation cleanup.
- `Frontend/src/pages/CandidateUpload/index.tsx` - retained `collegeTier` upload field and payload support.
- `Frontend/src/services/api.ts` - retained API base URL hardening, response normalization, detail fallbacks, and upload payload mapping.
- `Frontend/src/types/index.ts` - retained `collegeTier` upload type.
- `Frontend/tsconfig.app.json` - moved TS build info out of `node_modules`.
- `Frontend/tsconfig.node.json` - moved TS build info out of `node_modules`.

## Files Reverted Or Removed From Git Tracking

No legitimate source files were reverted.

Generated/dependency artifacts were removed from the Git index only:

- `Frontend/node_modules/` - 7,219 files untracked from Git.
- `Frontend/dist/` - 3 build files untracked from Git.
- `Frontend/.vite/` - 2 cache files untracked from Git.
- `venv/` - 3,702 Python virtualenv files untracked from Git.

The local working copies remain on disk; they are now ignored.

## Git Cleanup Actions

- Confirmed there was no active `.git/index.lock`.
- Fixed `.gitignore` so `node_modules`, `dist`, `.tmp`, `.vite`, `.cache`, `coverage`, `venv`, and TS build info files are ignored.
- Ran `git rm -r --cached --ignore-unmatch Frontend/node_modules Frontend/dist Frontend/.vite venv`.
- Verified `git ls-files` no longer reports generated dependency/build/cache paths.
- Verified ignored generated files with `git check-ignore`.

## Vercel Readiness

- Root directory: `Frontend`
- Build command: `npm run build`
- Output directory: `dist`
- Required env var: `VITE_API_BASE_URL=https://your-production-api.example.com/api`
- React Router refresh support: `Frontend/vercel.json` rewrites all routes to `/index.html`
- Loopback URL scan: no local-only URL references remain in repo-owned checked paths outside ignored dependencies.

## Validation

- `npm run build` passes.
- `npx tsc --noEmit --noUnusedLocals --noUnusedParameters -p tsconfig.app.json` passes.
- `npx tsc --noEmit --noUnusedLocals --noUnusedParameters -p tsconfig.node.json` passes.
- Search for debug logging markers, task markers, fix markers, and loopback URL patterns passes.
- Local app shell returns `200` for `/`, `/diamonds`, `/upload`, and a deep refresh path.
- Leaderboard route verified at `/` through route wiring and app shell response.
- Diamond Panel route verified at `/diamonds` through route wiring and app shell response.
- Candidate Upload route verified at `/upload` through route wiring and app shell response.
- Candidate Detail Modal verified through Leaderboard/DiamondPanel selection wiring and fallback data path.
- Stats Dashboard verified through Leaderboard `getStats` wiring with derived-stats fallback.

## Remaining Backend Dependencies

- A deployed backend API is still required for live candidate, diamond, detail, stats, and upload data.
- Set frontend `VITE_API_BASE_URL` in Vercel to the deployed backend `/api` base URL.
- For local seeding, set `TALENTDNA_API_BASE_URL` before running `seed.py`.
- Backend runtime dependencies should be recreated from the backend dependency manifest, not committed via `venv/`.

## Deployment Checklist

- Commit this release candidate.
- Configure the Vercel project root directory as `Frontend`.
- Confirm Vercel build command is `npm run build`.
- Confirm Vercel output directory is `dist`.
- Add `VITE_API_BASE_URL` in Vercel environment variables.
- Deploy and smoke test `/`, `/diamonds`, `/upload`, and browser refresh on a nested route.
- Confirm backend CORS allows the Vercel frontend domain.

## Exact Git Commands To Run Next

```bash
git status --short --branch
git add .gitignore API_CONTRACT.md seed.py RELEASE_REPORT.md Frontend/.env.example Frontend/DEPLOYMENT.md Frontend/vercel.json Frontend/package-lock.json Frontend/src/components/CandidateCard.tsx Frontend/src/components/CandidateTable.tsx Frontend/src/components/DetailModal.tsx Frontend/src/pages/CandidateUpload/index.tsx Frontend/src/services/api.ts Frontend/src/types/index.ts Frontend/tsconfig.app.json Frontend/tsconfig.node.json
git add -u Frontend/node_modules Frontend/dist Frontend/.vite venv
git status --short --branch
git commit -m "Prepare frontend release candidate"
git push origin main
```
