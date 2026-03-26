# Grocery Tracker — DevOps Explained for Beginners

This document walks through every layer of the DevOps setup for this project — from writing code to having it running live on the internet, monitored around the clock.

---

## The Big Picture

Think of the journey like mailing a package:

```
You write code
     ↓
GitHub Actions tests and packages it    (CI — Continuous Integration)
     ↓
A Docker image is shipped to GHCR       (the warehouse shelf)
     ↓
Trivy checks for safety issues          (customs inspection)
     ↓
Prisma migrates the database            (updating the filing cabinet)
     ↓
ArgoCD sees the new version in Git      (the delivery driver)
     ↓
Kubernetes runs it on AWS              (the destination building)
     ↓
Prometheus + Grafana watch it live      (the security cameras)
```

---

## Layer 1 — Infrastructure: Terraform

**What it is:** Terraform is a tool that creates AWS cloud resources by reading `.tf` config files.
Instead of clicking through the AWS console, you write code and Terraform builds everything for you.

**What it creates for this project:**

| Resource | What it is |
|---|---|
| VPC | A private network in AWS (like your office building) |
| EKS | A Kubernetes cluster — the platform that runs your containers |
| RDS (PostgreSQL 16) | A managed database — no need to maintain a server yourself |
| ElastiCache (Redis 7) | A managed in-memory cache — fast storage for session data |
| Secrets Manager | A vault where passwords are stored safely |

**File map:**
```
terraform/
├── backend.tf              ← where Terraform saves its state (S3 + DynamoDB)
├── variables.tf            ← tunable settings (region, instance sizes, etc.)
├── main.tf                 ← wires all modules together
├── outputs.tf              ← prints useful values after apply (cluster name, etc.)
└── modules/
    ├── vpc/                ← VPC, subnets, NAT gateways
    ├── eks/                ← EKS cluster + worker node group + IAM roles
    ├── rds/                ← PostgreSQL database + security group
    └── elasticache/        ← Redis cluster + security group
```

**How to use it:**
```bash
cd terraform
terraform init              # download providers
terraform plan              # preview what will be created
terraform apply             # build it (takes ~15 min)
terraform destroy           # tear everything down when done
```

> **Portfolio tip:** Spin up for a demo, then `terraform destroy` to avoid AWS costs. Each project has its own separate infrastructure to show you can manage them independently.

---

## Layer 2 — Containers: Docker

**What it is:** Docker packages your app and everything it needs (Node.js, dependencies, config)
into a single file called an **image**. That image runs the same way everywhere — your laptop,
a teammate's machine, or AWS.

**This project's images:**

| Image | Dockerfile | Built from |
|---|---|---|
| `grocery-tracker-api` | `apps/api/Dockerfile` | Express + Prisma |
| `grocery-tracker-web` | `apps/web/Dockerfile` | Next.js (standalone) |

**Multi-stage build (why it matters):**
```
Stage 1 (deps)    — install pnpm packages with full toolchain
Stage 2 (builder) — compile TypeScript → JavaScript
Stage 3 (runner)  — tiny Alpine image, only the compiled output
```
The final image is ~80% smaller than a naive single-stage build because it doesn't carry
the TypeScript compiler, dev dependencies, or build cache.

**Turborepo context:** Both Dockerfiles use the **monorepo root** as the build context
(`context: .`) so Docker can see the shared `packages/shared` workspace that both apps depend on.

**Local development:**
```bash
docker-compose up       # starts Postgres, Redis, API, Web, pgAdmin
```

---

## Layer 3 — CI/CD: GitHub Actions

**What it is:** GitHub Actions automatically runs a pipeline every time you push to `main`.
No manual steps — it builds, scans, migrates, and deploys for you.

**Two workflow files:**

### `pr-checks.yml` — Runs on every Pull Request
```
lint (all packages via Turborepo)
typecheck (api + web)
```
This catches bugs *before* they reach `main`.

### `ci-cd.yml` — Runs on every push to `main`

```
build-and-push
  ├── Build api image  → push to GHCR
  └── Build web image  → push to GHCR
          ↓
trivy-scan (gates deployment)
  ├── Scan api for CRITICAL/HIGH CVEs
  └── Scan web for CRITICAL/HIGH CVEs
          ↓
migrate
  └── Run `prisma migrate deploy` as a Kubernetes Job
          ↓
gitops-update
  ├── Update image tags in k8s/kustomization.yaml
  ├── Commit + push to Git
  └── Wait for ArgoCD rollout to complete
```

**Key decisions explained:**

| Decision | Why |
|---|---|
| GHCR (GitHub Container Registry) | Free with GitHub — no separate registry needed |
| `sha-<7char>` image tags | Every deploy is traceable to an exact Git commit |
| Trivy gates deployment | If a critical vulnerability is found, the deploy stops |
| Turborepo for builds | Only rebuilds packages that changed — faster CI |
| `build-args: NEXT_PUBLIC_API_URL` | Next.js bakes public env vars at build time, not runtime |

**Secrets needed (set in GitHub → Settings → Secrets):**

| Secret | Value |
|---|---|
| `AWS_DEPLOY_ROLE_ARN` | IAM role ARN that GitHub can assume (OIDC) |

**Variables needed (Settings → Variables):**

| Variable | Value |
|---|---|
| `AWS_REGION` | e.g. `us-east-1` |
| `EKS_CLUSTER_NAME` | from `terraform output eks_cluster_name` |
| `API_URL` | e.g. `https://grocery-tracker.yourdomain.com/api` |

---

## Layer 4 — GitOps: ArgoCD

**What it is:** ArgoCD watches your Git repository. When it sees a change to `k8s/kustomization.yaml`
(the file that holds the current image tags), it automatically updates the cluster to match.

**The flow:**
```
CI pushes new image tag to kustomization.yaml
             ↓
ArgoCD detects the Git commit (polls every 3 min)
             ↓
ArgoCD applies the new manifests to Kubernetes
             ↓
Kubernetes rolls out the new pods, keeps old ones until new ones are healthy
```

**Why Git is the source of truth:**
If you manually change something in the cluster (e.g. scale down a deployment), ArgoCD
will notice it doesn't match Git and revert it. This is called **selfHeal**. Your cluster
always reflects what's in Git — no mystery manual changes.

**File:** `argocd/application.yaml`

**One-time setup:**
```bash
kubectl apply -f argocd/application.yaml
```

---

## Layer 5 — Kubernetes: Running the App

**What it is:** Kubernetes (K8s) is the platform that runs your containers. It handles:
- Starting/stopping containers
- Replacing crashed containers automatically
- Spreading load across multiple copies
- Routing traffic to healthy containers only

**File map:**
```
k8s/
├── namespace.yaml          ← isolated environment named "grocery-tracker"
├── external-secrets.yaml   ← pulls DB password etc. from AWS Secrets Manager
├── api-deployment.yaml     ← runs the Express API (Deployment + Service + HPA)
├── web-deployment.yaml     ← runs the Next.js frontend (Deployment + Service + HPA)
├── db-migration-job.yaml   ← one-off Job: `prisma migrate deploy` before each deploy
├── ingress.yaml            ← AWS ALB routes traffic to api or web based on path
├── monitoring.yaml         ← Prometheus + Alertmanager + Grafana
└── kustomization.yaml      ← tells ArgoCD which files to apply, holds image tags
```

**How traffic flows:**
```
User → AWS ALB (ingress)
          ├── /api/*  → api Service → api Pod(s) (port 5001)
          └── /*      → web Service → web Pod(s) (port 3005)
```

**Health probes (why they matter):**
Kubernetes checks `/api/health` every 10 seconds. If the API crashes or hangs, K8s
automatically restarts it and stops routing traffic to it until it recovers.

**HPA (Horizontal Pod Autoscaler):**
If CPU on the API pods exceeds 70%, Kubernetes adds more pods automatically — up to 6.
Traffic drops → pods scale back down. You pay for what you use.

**External Secrets:**
Passwords never live in Git. `external-secrets.yaml` tells K8s to fetch them from
AWS Secrets Manager and inject them as environment variables into the pods.

---

## Layer 6 — Observability: Prometheus + Grafana + Alertmanager

**What it is:** Once the app is live, you need to know if it's healthy, slow, or broken.
This layer watches the app and alerts you to problems before users notice.

**How metrics get collected:**
```
Express API (/api/metrics endpoint)
       ↓
Prometheus scrapes every 15 seconds
       ↓
Grafana reads from Prometheus and draws charts
       ↓
Alertmanager sends Slack alerts if rules are triggered
```

**The `/api/metrics` endpoint:**
The API uses `prom-client` (a Node.js library) to expose metrics at `/api/metrics`.
This is the same format Prometheus expects — it reads numbers like:
- How many requests per second
- How long each request took
- How much memory Node.js is using

**Alert rules (when you get paged):**

| Alert | Trigger |
|---|---|
| ApiDown | API unreachable for 2 minutes |
| HighRestartRate | Pods restarting more than once per 15 min |
| HighHttpErrorRate | More than 5% of requests returning 5xx errors |
| HighP95Latency | 95th percentile response time above 2 seconds |
| HighHeapUsage | Node.js heap memory above 85% |
| HighEventLoopLag | Event loop blocked for more than 500ms |

**Pre-built Grafana dashboards:**

| Dashboard | Panels |
|---|---|
| HTTP Overview | Request rate, error rate, p50/p95/p99 latency, API up/down |
| Node.js Runtime | Heap used, heap %, event loop lag, active handles |

**To access locally:**
```bash
kubectl port-forward svc/grafana      -n grocery-tracker 3001:3000
kubectl port-forward svc/prometheus   -n grocery-tracker 9090:9090
kubectl port-forward svc/alertmanager -n grocery-tracker 9093:9093
```

---

## End-to-End Deploy Walkthrough

Here's what happens from `git push` to your users seeing the new version:

```
1. git push origin main
2. GitHub Actions triggers ci-cd.yml
3. Docker builds api and web images using the monorepo root as context
4. Images pushed to GHCR: ghcr.io/deucesdevops/grocery-tracker-api:sha-abc1234
5. Trivy scans both images — stops deploy if CRITICAL/HIGH CVEs found
6. K8s Job runs: prisma migrate deploy (applies any new DB schema changes)
7. kustomize edit set image → updates kustomization.yaml with new SHA tags
8. git commit + push → ArgoCD detects the change within 3 minutes
9. ArgoCD applies the updated manifests
10. Kubernetes starts new pods with the new image
11. Health probes pass → traffic switches to new pods → old pods terminate
12. GitHub Actions confirms: kubectl rollout status deployment/api ✓
13. Prometheus begins scraping new pods
14. You see the updated charts in Grafana
```

---

## Monorepo Notes

This project uses **Turborepo** with **pnpm workspaces**. Key implications:

- `pnpm turbo lint` — runs lint across all packages in parallel
- Docker build context must be the monorepo root so Docker can see `packages/shared`
- `NEXT_PUBLIC_API_URL` is a build-time arg for the web image (Next.js bakes it in at build)
- The shared `packages/shared` package must be built before `api` or `web` can typecheck

---

## Glossary

| Term | Plain English |
|---|---|
| **Container** | A packaged app that runs the same way everywhere |
| **Image** | The recipe for a container (stored in GHCR) |
| **Pod** | A running container inside Kubernetes |
| **Deployment** | Tells K8s how many pods to run and what image to use |
| **Service** | A stable address to reach a group of pods |
| **Ingress** | The front door — routes incoming traffic to the right service |
| **HPA** | Auto-scales pod count based on CPU load |
| **ArgoCD** | Keeps the cluster in sync with Git automatically |
| **Kustomize** | Patches K8s YAML without duplicating files (used for image tags) |
| **Terraform** | Creates AWS resources from code |
| **Prometheus** | Collects and stores metrics (numbers over time) |
| **Grafana** | Draws charts from Prometheus data |
| **Alertmanager** | Sends Slack alerts when metrics cross thresholds |
| **OIDC** | Lets GitHub Actions authenticate to AWS without storing passwords |
| **External Secrets** | Pulls secrets from AWS Secrets Manager into K8s |
| **Turborepo** | Build system that caches and parallelises tasks across the monorepo |
