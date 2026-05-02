# BE-Pharmacy

Express.js 5 REST API backend for the Smart Pharmacy Application. Provides product catalogue management, order processing, user authentication, and the MediGenius OTC consultation engine.

## Prerequisites

- Node.js 20 or higher
- PostgreSQL 14 or higher (running locally or via a connection string)
- Ollama (required for MediGenius LLM responses; see LLM Setup below)
- pnpm (recommended) or npm

## Project Structure

```
BE-Pharmacy/
├── controllers/        # HTTP request/response handlers (extend BaseController)
├── services/           # Business logic layer
├── repositories/       # Data access layer (extend BaseRepository via Prisma)
├── routes/             # Express route definitions; auto-registered under /api/v1
├── middlewares/        # JWT auth, Zod validation, error handling
├── validators/input/   # Zod schemas for request bodies
├── mappers/            # Transform Prisma models to API response shapes
├── config/             # CORS and other app config
├── utils/              # JWT helpers and utility functions
├── prisma/
│   ├── schema.prisma   # Single source of truth for the database schema
│   ├── seed.js         # Base data (roles, admin user, demo products)
│   └── demoFlow.seed.js # Demo patient, orders, and ProductAI context strings
└── index.js            # Application entry point
```

## Environment Variables

Create a `.env` file in the project root. All variables below are required unless marked optional.

```env
# PostgreSQL connection string
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/pharmadb?schema=public"

# JWT signing key (any long random string)
JWT_SECRET="your-secret-key-here"

# Optional: server port (default 5000)
PORT=5000

# Optional: JWT expiry (default "7d")
EXPIRED_JWT="7d"

# LLM configuration for MediGenius
# Option A: Ollama (local, no cost)
LLM_BASE_URL=http://localhost:11434/v1
LLM_API_KEY=ollama
LLM_MODEL=llama3.2:3b

# Option B: Groq cloud (free tier) -- comment out Option A and use these
# LLM_BASE_URL=https://api.groq.com/openai/v1
# LLM_API_KEY=gsk_your_groq_key_here
# LLM_MODEL=llama-3.3-70b-versatile
```

## LLM Setup

MediGenius calls an OpenAI-compatible API for keyword extraction and response generation. The default is a local Ollama instance.

**Ollama (local):**

```bash
# Install Ollama from https://ollama.com, then:
ollama pull llama3.2:3b
ollama serve          # starts at http://localhost:11434
```

**Groq (cloud, free tier alternative):**

Sign up at https://console.groq.com, copy your API key, and set the Groq variables in `.env` as shown above. No local install required.

## Installation and Running

```bash
# 1. Install dependencies
pnpm install

# 2. Run database migrations (creates all tables)
npx prisma migrate dev

# 3. Seed base data (admin user, product categories, brands, demo products)
pnpm seed

# 4. Seed demo data (patient account, orders, ProductAI context strings for MediGenius)
pnpm seed:demo

# 5. Start the development server with hot reload
npm run dev
```

The API will be available at `http://localhost:5000/api/v1`.

## Demo Credentials

After seeding, the following accounts are ready to use:

| Role | Email | Password |
| ---- | ----- | -------- |
| Admin | admin@demo.local | Admin@123 |
| Patient | patient@demo.local | Patient@123 |

## API Routes

All routes are prefixed with `/api/v1`.

| Prefix | Description |
| ------ | ----------- |
| `/auth` | Register, login |
| `/users` | Patient profile, addresses, health profile |
| `/products` | Product catalogue (public read, admin write) |
| `/brands` | Brand listing and management |
| `/categories` | Category listing and management |
| `/cart` | Cart operations (authenticated patients) |
| `/orders` | Order placement and history |
| `/chat` | MediGenius consultation endpoint |
| `/admin` | Admin-only dashboard operations |

## Database Management

```bash
# Open Prisma Studio (visual database browser)
npx prisma studio

# Run a new migration after editing prisma/schema.prisma
npx prisma migrate dev --name describe-your-change

# Regenerate Prisma client after schema changes
npx prisma generate
```

## Architecture Notes

Request flow: **Route -> Middleware (auth + validation) -> Controller -> Service -> Repository -> Prisma**

- Controllers extend `BaseController` for standardized `success()` / `error()` JSON responses.
- Services contain all business logic and return `{ data, message }` objects.
- Repositories extend `BaseRepository` for generic CRUD; domain-specific queries are added per repository.
- Authentication middleware (`verifyUser`, `verifyRoles`) is applied per-route, not globally.
- Zod validation runs before the controller on any route that accepts a request body.
