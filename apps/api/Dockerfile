# ── Base: shared pnpm setup ───────────────────────────────────────────────────
FROM node:20-alpine AS base
RUN corepack enable && corepack prepare pnpm@9.0.0 --activate


# ── Deps: install dependencies & generate Prisma client ──────────────────────
FROM base AS deps
# openssl required by Prisma engine on Alpine
RUN apk add --no-cache openssl
WORKDIR /app

# Copy manifests first — Docker caches this layer until deps change
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/api/package.json             ./apps/api/
COPY packages/shared/package.json      ./packages/shared/
# Schema must be present before install so @prisma/client postinstall can find it
COPY prisma                            ./prisma

RUN pnpm install --frozen-lockfile

# Generate the Prisma client here, where the pnpm workspace is fully intact
RUN cd apps/api && node_modules/.bin/prisma generate --schema=../../prisma/schema.prisma


# ── Builder: compile TypeScript ───────────────────────────────────────────────
FROM base AS builder
RUN apk add --no-cache openssl
WORKDIR /app

# Reuse the installed + generated node_modules from deps
COPY --from=deps /app/node_modules          ./node_modules
COPY --from=deps /app/apps/api/node_modules ./apps/api/node_modules

COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY prisma                           ./prisma
COPY packages/shared                  ./packages/shared
COPY apps/api                         ./apps/api

# Compile TypeScript → apps/api/dist/
RUN pnpm --filter=api build


# ── Runner: minimal production image ─────────────────────────────────────────
FROM node:20-alpine AS runner
RUN apk add --no-cache openssl
RUN addgroup -S app && adduser -S app -G app

WORKDIR /app

COPY --from=builder --chown=app:app /app/apps/api/dist       ./dist
COPY --from=builder --chown=app:app /app/node_modules        ./node_modules
COPY --from=builder --chown=app:app /app/prisma              ./prisma

USER app

EXPOSE 5001

HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD wget -qO- http://localhost:5001/api/health || exit 1

CMD ["node", "dist/index.js"]
