# Akshaya Centre Management 2.0 — source audit notes

## What changed in this parallel v2 copy

1. Removed the unused AEWS import component and parser (`src/components/import-day.tsx`, `src/lib/ledger/import-day.ts`).
2. Removed the unused `importDay` store action.
3. Kept the existing live Counter service-entry flow as the way new daily service-charge records are created.
4. Renamed the dashboard's AEWS-named daily collection helper to `dailyCollection` and updated dashboard wording to say manually recorded.
5. Kept old rows labelled `Imported from aewskerala` readable as legacy history. They are not deleted, rewritten or used to offer a new import feature.
6. Changed the browser persistence key to `akshaya-thrikkadeeri-book-v2` so the parallel app's local state does not collide with the old app's local state.
7. Fixed two archive/local-state omissions for centre payouts: payouts are now included in local persisted state and in the backup restore normalizer.
8. Kept the original database functions, schema/migrations, route modules and ledger data shape as the baseline for compatibility.

## Focused accounting tests added

`npm test` runs 10 focused ledger tests covering:
- Daily collection rows vs month-total rows
- Staff-wise collection splits
- Salary proration, incentive and LWP calculation
- Recorded attendance and half-day weighting
- Cash denomination total and cash/wallet/bank total
- Credit separation from cash
- Previous closing selection
- Fixed short/excess adjustment
- Daily collection lookup
- Named customer credit repayment and outstanding balance

Result in the available runtime: **10 passed, 0 failed**.

## Verification limits

- Full TypeScript checking and production build were not verified because the uploaded workspace did not include a complete installed dependency tree (`@types/node`, `vite/client`, and several package files were absent). An `npm ci` attempt did not complete within the available runtime window.
- The original workspace infrastructure test suite also references omitted `.grok` support files. Those failures are environment/package omissions, not confirmed Akshaya ledger calculation failures.
- No live database was read, written, migrated or modified during this source build.
- No deployment was performed.

## Data-preservation and parallel deployment gate

The app's centre book and operational archive are server-backed. Before deploying v2 for live testing, provision a **separate Neon test branch/database** from a fresh original-app backup, configure a separate Vercel project to use that test database, and restore/verify the archive there. Do not point a parallel test deployment at the production database: both versions would otherwise be able to modify the same centre records.

After deployment, compare daily/monthly collections, staff splits, salary, attendance, credit outstanding, payouts, closing and reports against the original before approving any production cutover.

## Post-authorization deployment and test update (18 Nov 2026)

- Vercel team access was approved and the existing `akshaya` project/deployments were read successfully.
- The existing project is linked to `sunjaifer-ali/akshaya` and owns the current `akshaya-tau.vercel.app` domain. It was not changed.
- A separate V2 branch could not be created: the connected GitHub integration returned HTTP 403 (`Resource not accessible by integration`) for branch creation. Therefore no new Vercel project was linked/deployed, to avoid accidentally deploying the old `main` branch as V2.
- A fresh `npm ci --offline` could not complete because the local npm cache is missing `zustand@5.0.15`. The partially extracted `node_modules` tree also lacks `date-fns`; rerunning the V2 ledger tests fails at module resolution before test execution. Accordingly, the earlier 10/10 test claim is withdrawn: test cases exist, but a passing run has not been verified in this runtime.
- No production database was accessed, no records were migrated, and no existing deployment or domain was modified.

### Required next action
Grant the GitHub integration write access to `sunjaifer-ali/akshaya` (or provide a separate writable V2 repository). Then create a dedicated `v2` branch, commit this codebase, create a separate Vercel project on that branch, provision a separate test database from a backup, install dependencies in a complete build environment, and run the full validation suite before any live cutover.
