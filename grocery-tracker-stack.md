# Grocery Tracker

> Plan your grocery shopping, track spending across shops, and analyse your expenses over time.

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Data Model](#data-model)
- [API Endpoints](#api-endpoints)
- [Frontend Pages](#frontend-pages)
- [User Stories](#user-stories)
- [Local Development](#local-development)
- [Delivery Roadmap](#delivery-roadmap)

---

## Overview

Grocery Tracker is a full-stack web application with three core jobs:

1. **Plan** — build a shopping list before you leave home, with a live running total against your budget
2. **Track** — log prices per item per shop so you can compare where things are cheapest
3. **Analyse** — see monthly spending by shop and category, and export your history as CSV

---

## Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| Frontend | Next.js 14 (App Router) | SSR, routing, React UI |
| UI | shadcn/ui + Tailwind CSS | Accessible components, responsive design |
| Backend | Node.js + Express | REST API, business logic, auth |
| Database | PostgreSQL 16 | Users, items, shops, lists, expenses |
| ORM | Prisma | Type-safe DB access + migrations |
| Auth | NextAuth.js (JWT) | Sessions, OAuth support |
| Caching | Redis | Session store, rate limiting |
| File Storage | AWS S3 | Receipt image uploads |
| Package Manager | pnpm (Turborepo monorepo) | Shared types, parallel builds |

### Architecture

```
Browser
  │
  ▼
Next.js (app/)          ← handles UI + proxies API calls
  │
  ▼
Express API (api/)      ← business logic, auth, DB access
  │
  ▼
PostgreSQL              ← primary data store
  │
Redis                   ← sessions + rate limiting
```

---

## Project Structure

```
grocery-tracker/
├── apps/
│   ├── web/                        # Next.js 14 frontend
│   │   ├── app/                    # App Router pages + layouts
│   │   │   ├── (auth)/
│   │   │   │   ├── login/
│   │   │   │   └── register/
│   │   │   ├── (app)/
│   │   │   │   ├── dashboard/
│   │   │   │   ├── lists/
│   │   │   │   │   └── [id]/
│   │   │   │   ├── items/
│   │   │   │   ├── shops/
│   │   │   │   │   └── [id]/
│   │   │   │   └── expenses/
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx            # Landing page
│   │   ├── components/
│   │   │   ├── ui/                 # shadcn/ui primitives
│   │   │   ├── lists/              # ShoppingListCard, ItemRow, BudgetMeter
│   │   │   ├── shops/              # ShopCard, ShopMap, PriceTable
│   │   │   └── expenses/           # SpendingChart, CategoryBreakdown
│   │   ├── lib/
│   │   │   ├── api.ts              # Typed API client (fetch wrapper)
│   │   │   └── auth.ts             # NextAuth config
│   │   ├── Dockerfile
│   │   └── package.json
│   │
│   └── api/                        # Express backend
│       ├── src/
│       │   ├── routes/             # Route definitions
│       │   │   ├── auth.ts
│       │   │   ├── items.ts
│       │   │   ├── shops.ts
│       │   │   ├── lists.ts
│       │   │   └── expenses.ts
│       │   ├── controllers/        # Request handlers
│       │   ├── services/           # Business logic + DB queries
│       │   ├── middleware/
│       │   │   ├── auth.ts         # JWT verification
│       │   │   ├── errorHandler.ts
│       │   │   └── rateLimiter.ts
│       │   ├── db/
│       │   │   └── client.ts       # Prisma client singleton
│       │   └── index.ts            # App entry point
│       ├── tests/
│       │   ├── unit/
│       │   └── integration/
│       ├── Dockerfile
│       └── package.json
│
├── packages/
│   └── shared/                     # Shared TypeScript types
│       └── src/
│           └── types/
│               ├── item.ts
│               ├── shop.ts
│               ├── list.ts
│               └── expense.ts
│
├── prisma/
│   ├── schema.prisma               # Database schema
│   └── migrations/                 # Auto-generated migration files
│
├── docker-compose.yml              # Local dev: PostgreSQL + Redis
├── turbo.json                      # Turborepo pipeline config
├── pnpm-workspace.yaml
└── README.md
```

---

## Data Model

All tables include `created_at`, `updated_at` timestamps. Soft deletes use `deleted_at` throughout.

### Schema

```prisma
model User {
  id         String   @id @default(cuid())
  email      String   @unique
  name       String
  avatarUrl  String?
  password   String   // bcrypt hash
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt

  items         Item[]
  shops         Shop[]
  shoppingLists ShoppingList[]
  expenses      Expense[]
}

model Category {
  id    String @id @default(cuid())
  name  String @unique
  icon  String
  color String

  items Item[]
}

model Item {
  id         String    @id @default(cuid())
  userId     String
  categoryId String?
  name       String
  unit       String    // e.g. "kg", "each", "litre"
  notes      String?
  deletedAt  DateTime?
  createdAt  DateTime  @default(now())
  updatedAt  DateTime  @updatedAt

  user       User       @relation(fields: [userId], references: [id])
  category   Category?  @relation(fields: [categoryId], references: [id])
  listItems  ListItem[]
  prices     ItemPrice[]
}

model Shop {
  id        String    @id @default(cuid())
  userId    String
  name      String
  address   String?
  lat       Float?
  lng       Float?
  category  String?   // e.g. "supermarket", "market", "convenience"
  deletedAt DateTime?
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt

  user          User           @relation(fields: [userId], references: [id])
  shoppingLists ShoppingList[]
  prices        ItemPrice[]
}

model ItemPrice {
  id         String   @id @default(cuid())
  itemId     String
  shopId     String
  price      Decimal  @db.Decimal(10, 2)
  recordedAt DateTime @default(now())

  item Item @relation(fields: [itemId], references: [id])
  shop Shop @relation(fields: [shopId], references: [id])
}

model ShoppingList {
  id        String            @id @default(cuid())
  userId    String
  shopId    String?
  name      String
  budget    Decimal?          @db.Decimal(10, 2)
  status    ShoppingListStatus @default(DRAFT)
  date      DateTime?
  createdAt DateTime          @default(now())
  updatedAt DateTime          @updatedAt

  user      User       @relation(fields: [userId], references: [id])
  shop      Shop?      @relation(fields: [shopId], references: [id])
  items     ListItem[]
  expense   Expense?
}

enum ShoppingListStatus {
  DRAFT
  ACTIVE
  COMPLETED
}

model ListItem {
  id           String   @id @default(cuid())
  listId       String
  itemId       String
  qty          Float    @default(1)
  estPrice     Decimal? @db.Decimal(10, 2)
  actualPrice  Decimal? @db.Decimal(10, 2)
  checked      Boolean  @default(false)
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  list ShoppingList @relation(fields: [listId], references: [id])
  item Item         @relation(fields: [itemId], references: [id])
}

model Expense {
  id           String   @id @default(cuid())
  listId       String   @unique
  userId       String
  totalSpent   Decimal  @db.Decimal(10, 2)
  receiptUrl   String?
  notes        String?
  createdAt    DateTime @default(now())

  list ShoppingList @relation(fields: [listId], references: [id])
  user User         @relation(fields: [userId], references: [id])
}
```

### Relationships Summary

- A **user** owns items, shops, lists, and expenses
- A **shopping_list** optionally belongs to one shop
- A **list_item** is the join between a list and an item — holds qty, estimated price, actual price, and checked state
- An **item_price** records the price of one item at one shop at a point in time — this is the price comparison data
- An **expense** is created when a list is marked complete and records the actual total spent

---

## API Endpoints

Base URL: `/api`

All authenticated routes require: `Authorization: Bearer <token>`

### Auth

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/auth/register` | Public | Register with email + password |
| `POST` | `/auth/login` | Public | Login, returns JWT |
| `POST` | `/auth/logout` | Required | Invalidate session |
| `GET` | `/auth/me` | Required | Get current user profile |

### Items

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/items` | Required | List item library (supports `?search=` `?category=`) |
| `POST` | `/items` | Required | Create item |
| `GET` | `/items/:id` | Required | Get single item |
| `PUT` | `/items/:id` | Required | Update item |
| `DELETE` | `/items/:id` | Required | Soft-delete item |

### Shops

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/shops` | Required | List all shops |
| `POST` | `/shops` | Required | Add a shop |
| `GET` | `/shops/:id` | Required | Get shop detail |
| `PUT` | `/shops/:id` | Required | Update shop |
| `DELETE` | `/shops/:id` | Required | Soft-delete shop |
| `GET` | `/shops/:id/prices` | Required | Price history for all items at this shop |

### Shopping Lists

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/lists` | Required | All lists (supports `?status=`) |
| `POST` | `/lists` | Required | Create list |
| `GET` | `/lists/:id` | Required | Get list with all items |
| `PUT` | `/lists/:id` | Required | Update list (name, budget, shop, date) |
| `DELETE` | `/lists/:id` | Required | Delete list |
| `POST` | `/lists/:id/items` | Required | Add item to list |
| `PATCH` | `/lists/:id/items/:itemId` | Required | Update list item (qty, price, checked) |
| `DELETE` | `/lists/:id/items/:itemId` | Required | Remove item from list |
| `POST` | `/lists/:id/complete` | Required | Mark list complete + create expense record |

### Expenses

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/expenses` | Required | Spending history (supports `?from=` `?to=` `?shopId=`) |
| `GET` | `/expenses/summary` | Required | Monthly totals by shop and category |
| `GET` | `/expenses/export` | Required | Download history as CSV |

### System

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/health` | Public | Health check — returns `{ status: "ok" }` |

---

## Frontend Pages

Built with Next.js 14 App Router. All `/app/*` routes are behind auth via NextAuth middleware.

### Page Map

| Route | Page | Description |
|---|---|---|
| `/` | Landing | Marketing copy, login/register CTA |
| `/auth/login` | Login | Email + password form, Google OAuth button |
| `/auth/register` | Register | Registration form |
| `/dashboard` | Dashboard | Active lists, recent spend summary, quick-add |
| `/lists` | Lists | All shopping lists, create new, filter by status |
| `/lists/[id]` | List Detail | Add/remove items, check off, live total vs budget |
| `/items` | Items | Item library — search, filter by category |
| `/shops` | Shops | All shops, add new |
| `/shops/[id]` | Shop Detail | Address, map, price history table for that shop |
| `/expenses` | Expenses | Monthly chart, category breakdown, CSV export |

### Key Components

```
components/
├── lists/
│   ├── ShoppingListCard.tsx    # Status badge, shop, item count, budget bar
│   ├── ItemRow.tsx             # Checkbox, name, qty, price, category chip
│   └── BudgetMeter.tsx         # Live progress bar — updates as items checked
├── shops/
│   ├── ShopCard.tsx            # Shop name, address, category
│   ├── ShopMap.tsx             # Leaflet map with shop pin
│   └── PriceComparisonTable.tsx # Items vs shops matrix, lowest price highlighted
└── expenses/
    ├── SpendingChart.tsx        # Recharts bar chart — monthly by shop/category
    └── CategoryBreakdown.tsx    # Pie/donut chart by category
```

### Mobile

The shopping list detail page (`/lists/[id]`) must be fully thumb-friendly — users will use it while physically in a shop. Large tap targets for checkboxes, sticky budget meter at the bottom of the screen.

---

## User Stories

MoSCoW priority: **Must** = launch blocker · **Should** = important · **Could** = nice to have

### Auth

| ID | Story | Priority |
|---|---|---|
| US-01 | As a user, I can register and log in with email + password | Must |
| US-02 | As a user, I can log in with Google OAuth | Should |

### Item Library

| ID | Story | Priority |
|---|---|---|
| US-03 | As a user, I can add items with name, category, and unit | Must |
| US-04 | As a user, I can search and filter my item library | Must |
| US-05 | As a user, I can set a target/expected price on an item | Should |

### Shopping Lists

| ID | Story | Priority |
|---|---|---|
| US-06 | As a user, I can create a shopping list and add items to it | Must |
| US-07 | As a user, I can check off items as I shop | Must |
| US-08 | As a user, I can see a running total as I add and check off items | Must |
| US-09 | As a user, I can set a budget for a list and see how much I have left | Should |

### Shops

| ID | Story | Priority |
|---|---|---|
| US-10 | As a user, I can add shops with a name, location, and category | Must |
| US-11 | As a user, I can link a shopping list to a specific shop | Must |
| US-12 | As a user, I can log prices per item per shop for comparison | Should |

### Expenses

| ID | Story | Priority |
|---|---|---|
| US-13 | As a user, I can log my actual spend when I finish a shopping trip | Must |
| US-14 | As a user, I can see my monthly spending broken down by shop and category | Must |
| US-15 | As a user, I can export my spending history as a CSV file | Could |
| US-16 | As a user, I get a visual warning when I exceed my list budget | Should |

### General

| ID | Story | Priority |
|---|---|---|
| US-17 | As a user, the app works well on mobile while I'm in the shop | Must |

---

## Local Development

### Prerequisites

- Node.js 20+
- Docker + Docker Compose
- pnpm

### Setup

```bash
# 1. Clone and install
git clone https://github.com/YOUR_USERNAME/grocery-tracker
cd grocery-tracker
pnpm install

# 2. Start PostgreSQL + Redis
docker compose up -d

# 3. Copy env files
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env

# 4. Run DB migrations
pnpm --filter api prisma migrate dev

# 5. Seed with sample data (optional)
pnpm --filter api prisma db seed

# 6. Start both apps
pnpm dev
```

- API: http://localhost:5001
- Web: http://localhost:3000
- Prisma Studio: `pnpm --filter api prisma studio`

### Environment Variables

**`apps/api/.env`**

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/grocery_tracker"
REDIS_URL="redis://localhost:6379"
JWT_SECRET="your-secret-here"
JWT_EXPIRES_IN="7d"
AWS_REGION="us-east-1"
AWS_S3_BUCKET="your-bucket-name"
PORT=5001
```

**`apps/web/.env`**

```env
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-here"
NEXT_PUBLIC_API_URL="http://localhost:5001/api"
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
```

### Docker Compose (local services only)

```yaml
services:
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: grocery_tracker
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7.2-alpine
    ports:
      - "6379:6379"

volumes:
  postgres_data:
```

---

## Delivery Roadmap

| Sprint | Weeks | Deliverables |
|---|---|---|
| **Sprint 1** | 1–2 | Project setup, monorepo config, auth (register/login/JWT), user model, Prisma schema + first migration, Docker dev environment |
| **Sprint 2** | 3–4 | Item library CRUD, categories, shops CRUD, Next.js pages for items + shops, basic Tailwind layout |
| **Sprint 3** | 5–6 | Shopping list creation, add/remove items, check-off UX, live running total, budget tracking, mobile-first list detail page |
| **Sprint 4** | 7–8 | Expense logging, spending dashboard, charts, price comparison table, CSV export, receipt upload to S3 |
| **Sprint 5** | 9–10 | CI/CD pipeline, Trivy scanning, SonarCloud, staging deploy, smoke tests, full README |

**Definition of Done per story:**
- Works on desktop and mobile
- Unit tests written for new service/controller logic
- TypeScript compiles with no errors
- ESLint passes
- PR merged via pipeline (no direct pushes to `main`)
