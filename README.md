# Grocery Tracker

> Plan your grocery shopping, track spending across shops, and analyse expenses over time.

A full-stack monorepo with a production-grade DevSecOps pipeline: automated security scanning, container hardening, GitOps deployments to AWS EKS, and cluster-wide observability.

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Local Development](#local-development)
- [DevSecOps Pipeline](#devsecops-pipeline)
- [Kubernetes Deployment](#kubernetes-deployment)
- [Monitoring](#monitoring)
- [Required Secrets](#required-secrets)

---

## Overview

Grocery Tracker has three core jobs:

1. **Plan** — build a shopping list before you leave home, with a live running total against your budget
2. **Track** — log prices per item per shop so you can compare where things are cheapest
3. **Analyse** — see monthly spending by shop and category

---

## Tech Stack

### Application

| Layer | Technology |
|---|---|
| Frontend | Next.js 14 (App Router) on port 3005 |
| UI | shadcn/ui + Tailwind CSS |
| Backend | Node.js 20 + Express on port 5001 |
| Database | PostgreSQL 16 + Prisma ORM |
| Cache | Redis 7.2 |
| Shared types | TypeScript package (`packages/shared`) |
| Monorepo | pnpm workspaces + Turborepo |

### Infrastructure & DevSecOps

| Concern | Tool |
|---|---|
| Cloud | AWS (EKS, ECR, VPC, ALB) |
| IaC | Terraform |
| Reverse proxy | Nginx |
| CI | GitHub Actions |
| Linting | ESLint, Hadolint |
| SAST | Snyk Code |
| SCA | npm audit + Snyk Open Source |
| Container scanning | Trivy |
| IaC scanning | Checkov |
| CD / GitOps | ArgoCD |
| Metrics | Prometheus (kube-prometheus-stack) |
| Dashboards | Grafana |

---

## Project Structure

```
grocery-tracker/
├── apps/
│   ├── api/                    # Node.js/Express backend
│   │   ├── src/
│   │   │   ├── controllers/
│   │   │   ├── routes/
│   │   │   ├── middlewares/
│   │   │   └── db/client.ts    # Prisma singleton
│   │   ├── prisma/
│   │   │   ├── schema.prisma
│   │   │   └── migrations/
│   │   └── Dockerfile
│   └── web/                    # Next.js 14 frontend
│       ├── src/app/
│       │   ├── (auth)/         # login, register
│       │   └── (app)/          # dashboard, lists, items, shops, expenses
│       ├── src/components/
│       └── Dockerfile
│
├── packages/
│   └── shared/                 # Shared TypeScript types
│
├── nginx/
│   ├── nginx.conf              # Reverse proxy + security headers + rate limiting
│   └── Dockerfile
│
├── terraform/
│   ├── main.tf                 # Provider config + S3 remote state
│   ├── vpc.tf                  # VPC, subnets, NAT gateways
│   ├── eks.tf                  # EKS cluster, ECR repos, OIDC IAM role
│   ├── variables.tf
│   └── outputs.tf
│
├── k8s/
│   ├── namespace.yaml
│   ├── secrets.yaml            # Template only — never commit real values
│   ├── ingress.yaml            # AWS ALB with HTTPS redirect
│   ├── api/                    # Deployment + Service
│   ├── web/                    # Deployment + Service
│   ├── postgres/               # StatefulSet + headless Service
│   ├── redis/                  # Deployment + Service
│   ├── nginx/                  # Deployment + Service + ConfigMap
│   ├── argocd/
│   │   ├── application.yaml    # ArgoCD Application (auto-sync + self-heal)
│   │   └── install-argocd.sh
│   └── monitoring/
│       ├── prometheus-values.yaml
│       ├── grafana-values.yaml
│       └── install-monitoring.sh
│
├── .github/workflows/
│   ├── ci.yml                  # 5 security quality gates
│   └── cd.yml                  # ArgoCD sync + smoke test
│
├── .hadolint.yaml              # Hadolint rules
├── .snyk                       # Snyk policy
└── docker-compose.yml          # Local dev: PostgreSQL + Redis + pgAdmin
```

---

## Local Development

### Prerequisites

- Node.js 20+
- pnpm 9+
- Docker + Docker Compose

### Setup

```bash
# 1. Clone and install
git clone https://github.com/YOUR_ORG/grocery-tracker
cd grocery-tracker
pnpm install

# 2. Start PostgreSQL + Redis + pgAdmin
docker compose up -d

# 3. Copy env files
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env
# Edit both files and fill in values

# 4. Run database migrations
pnpm --filter api exec prisma migrate dev

# 5. Seed with sample data (optional)
pnpm --filter api exec prisma db seed

# 6. Start all apps in parallel
pnpm dev
```

| Service | URL |
|---|---|
| Web | http://localhost:3005 |
| API | http://localhost:5001 |
| pgAdmin | http://localhost:80 |
| Prisma Studio | `pnpm --filter api exec prisma studio` |

### Environment Variables

**`apps/api/.env`**

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5433/grocery_tracker"
REDIS_URL="redis://localhost:6379"
JWT_SECRET="change-me"
PORT=5001
```

**`apps/web/.env`**

```env
NEXT_PUBLIC_API_URL="http://localhost:5001/api"
```

### Useful Commands

```bash
pnpm build          # Build all packages (Turborepo)
pnpm lint           # ESLint all packages
pnpm test           # Run all tests

pnpm --filter api <cmd>   # Run a command only in the API package
pnpm --filter web <cmd>   # Run a command only in the web package
```

---

## DevSecOps Pipeline

Every push triggers `.github/workflows/ci.yml`, which enforces five sequential security quality gates. A gate failure blocks all downstream steps.

```
Commit pushed
     │
     ▼
Gate 1 ── Lint
     │    ├─ ESLint (web + api)
     │    └─ Hadolint (all 3 Dockerfiles)
     │
     ├──────────────────────────────────────────┐
     ▼                                          ▼
Gate 2 ── SAST                         Gate 3 ── SCA
     │    └─ Snyk Code scan                 │    ├─ npm audit (high+)
     │       → GitHub Security tab          │    └─ Snyk Open Source
     │                                      │       → GitHub Security tab
     └──────────────┬───────────────────────┘
                    ▼
            Gate 4 ── IaC Scan
                 │    └─ Checkov (Terraform + K8s + Dockerfiles)
                 │       → GitHub Security tab
                 ▼
            Gate 5 ── Build & Container Scan
                      ├─ docker build (api + web)
                      ├─ Trivy scan (CRITICAL/HIGH → fail)
                      │  → GitHub Security tab
                      └─ [on main/master only]
                           ├─ Push images to ECR
                           └─ Update image tags in k8s/ manifests
                                └─ ArgoCD detects change → syncs cluster
```

### CD Pipeline

`.github/workflows/cd.yml` runs automatically after CI succeeds on `main`/`master`:

1. Authenticates to EKS via OIDC (no static AWS keys)
2. Runs `argocd app sync grocery-tracker --prune`
3. Waits for rollout health
4. Runs a smoke test against `/api/health`

Manual deploys are also supported via `workflow_dispatch` with an environment selector.

---

## Kubernetes Deployment

### First-time setup

**1. Provision infrastructure with Terraform**

```bash
cd terraform

# Create the S3 backend bucket + DynamoDB table first (one-time)
# Then:
terraform init
terraform plan
terraform apply
```

Terraform creates: VPC, EKS cluster, ECR repos, and an OIDC IAM role for GitHub Actions.

**2. Configure kubectl**

```bash
# Output by Terraform:
aws eks update-kubeconfig --name grocery-tracker-cluster --region us-east-1
```

**3. Create the namespace and secrets**

```bash
kubectl apply -f k8s/namespace.yaml

# Create the secret with real values (do not commit real values to git)
kubectl create secret generic grocery-tracker-secrets \
  --namespace grocery-tracker \
  --from-literal=database-url='postgresql://user:pass@postgres:5432/grocerytracker' \
  --from-literal=redis-url='redis://:pass@redis:6379' \
  --from-literal=redis-password='...' \
  --from-literal=jwt-secret='...' \
  --from-literal=postgres-db='grocerytracker' \
  --from-literal=postgres-user='...' \
  --from-literal=postgres-password='...'
```

**4. Install ArgoCD**

```bash
bash k8s/argocd/install-argocd.sh
```

**5. Update the ArgoCD Application manifest**

Edit `k8s/argocd/application.yaml` and set `spec.source.repoURL` to your repository URL, then apply:

```bash
kubectl apply -f k8s/argocd/application.yaml
```

ArgoCD will pull the `k8s/` directory and sync all resources. From this point on, every CI build that updates the image tags in the manifests will trigger an automatic rollout.

### Architecture on EKS

```
Internet
    │
    ▼
AWS ALB (Ingress) — HTTPS only, HTTP redirects to HTTPS
    │
    ▼
Nginx (2 replicas) — rate limiting, security headers
    ├──── /api/*  ──► API Deployment (2 replicas, port 5001)
    │                      └──► PostgreSQL StatefulSet (EBS volume)
    │                      └──► Redis Deployment
    └──── /*      ──► Web Deployment (2 replicas, port 3005)
```

All workload containers run as non-root with `readOnlyRootFilesystem: true` and dropped capabilities.

### Updating placeholders before deploying

| File | Replace |
|---|---|
| `terraform/eks.tf` | `YOUR_ORG/grocery-tracker` → your GitHub org/repo |
| `k8s/argocd/application.yaml` | `repoURL` → your repo URL |
| `k8s/ingress.yaml` | ACM certificate ARN + hostname |
| `k8s/api/deployment.yaml` | `REPLACE_WITH_ECR_URL` → ECR registry URL (from Terraform output) |
| `k8s/web/deployment.yaml` | `REPLACE_WITH_ECR_URL` → ECR registry URL |

---

## Monitoring

```bash
bash k8s/monitoring/install-monitoring.sh
```

This installs via Helm:

- **kube-prometheus-stack** — Prometheus, Alertmanager, and node-exporter. Metrics retained for 30 days on a 20 Gi EBS volume. Critical alerts route to Slack (configure webhook in `prometheus-values.yaml`).
- **Grafana** — pre-loaded dashboards for Kubernetes cluster health, node metrics, and Node.js application metrics. Prometheus is auto-configured as the default datasource.

**Get the Grafana URL:**

```bash
kubectl get svc grafana -n monitoring -o jsonpath='{.status.loadBalancer.ingress[0].hostname}'
```

**Get the Grafana admin password:**

```bash
kubectl get secret grafana -n monitoring -o jsonpath='{.data.admin-password}' | base64 -d
```

---

## Required Secrets

Set these in **GitHub → Settings → Secrets and variables → Actions**:

| Secret | Description |
|---|---|
| `AWS_ROLE_ARN` | ARN of the OIDC IAM role created by Terraform |
| `EKS_CLUSTER_NAME` | Name of the EKS cluster (default: `grocery-tracker-cluster`) |
| `SNYK_TOKEN` | Snyk API token (from snyk.io) |
| `ARGOCD_SERVER` | ArgoCD server hostname (no `https://`) |
| `ARGOCD_TOKEN` | ArgoCD API token |

For Slack alerts, set the webhook URL in:
- `k8s/monitoring/prometheus-values.yaml` → `alertmanager.config.receivers[slack-critical].slack_configs[0].api_url`
- `k8s/monitoring/grafana-values.yaml` → `alerting.contactpoints.yaml.secret.contactPoints[0].receivers[0].settings.url`
