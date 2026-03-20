# ── Base: shared pnpm setup ───────────────────────────────────────────────────
FROM node:20-alpine AS base
RUN corepack enable && corepack prepare pnpm@9.0.0 --activate


# ── Deps: install all workspace dependencies ──────────────────────────────────
FROM base AS deps
WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/web/package.json        ./apps/web/
COPY packages/shared/package.json ./packages/shared/

RUN pnpm install --frozen-lockfile


# ── Builder: produce Next.js standalone build ─────────────────────────────────
FROM base AS builder
WORKDIR /app

COPY --from=deps /app/node_modules          ./node_modules
COPY --from=deps /app/apps/web/node_modules ./apps/web/node_modules

COPY package.json pnpm-workspace.yaml ./
COPY packages/shared                  ./packages/shared
COPY apps/web                         ./apps/web

# Build args become env vars only at build time (safe for NEXT_PUBLIC_ values)
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

RUN pnpm --filter=web build


# ── Runner: minimal production image ─────────────────────────────────────────
FROM node:20-alpine AS runner

RUN addgroup -S app && adduser -S app -G app

WORKDIR /app

ENV NODE_ENV=production
# Disable Next.js telemetry inside containers
ENV NEXT_TELEMETRY_DISABLED=1

# next.config `output: standalone` produces a self-contained server.js
# with only the files it needs — no node_modules required.
COPY --from=builder --chown=app:app /app/apps/web/.next/standalone ./
COPY --from=builder --chown=app:app /app/apps/web/.next/static     ./apps/web/.next/static
COPY --from=builder --chown=app:app /app/apps/web/public           ./apps/web/public

USER app

EXPOSE 3005

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD wget -qO- http://localhost:3005/ || exit 1

CMD ["node", "apps/web/server.js"]
