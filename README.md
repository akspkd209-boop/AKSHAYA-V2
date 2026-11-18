# Akshaya Centre Management 2.0

Parallel v2 application for Akshaya Centre Thrikkadeeri. This project is based on the supplied original source and retains its existing modules and accounting engine.

## Local development

Requirements: Node.js 22+ and npm.

```bash
npm ci
npm run dev
```

Quality checks:

```bash
npm test
npm run typecheck
npm run lint
npm run build
```

The original app's environment configuration is intentionally not copied into this source package. Configure a separate Vercel project and a separate Neon test branch/database before deployment. Restore a fresh archive exported from the original app into the test database, verify the reports, and only then plan a production cutover.

See [V2-IMPLEMENTATION.md](./V2-IMPLEMENTATION.md) for the data-preservation and legacy-record policy.
