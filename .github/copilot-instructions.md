# LTI - Talent Tracking System

## Architecture Overview

This is a **full-stack recruitment management system** with a **React frontend** and **Express/TypeScript backend** using **Prisma ORM** with PostgreSQL. The backend follows **Domain-Driven Design (DDD)** with clear layering:

- **Domain Layer** ([backend/src/domain/models/](../backend/src/domain/models/)): Entities with business logic and static methods for database operations (e.g., `Candidate.save()`, `Candidate.findOne()`)
- **Application Layer** ([backend/src/application/services/](../backend/src/application/services/)): Business logic orchestration and validation
- **Presentation Layer** ([backend/src/presentation/controllers/](../backend/src/presentation/controllers/)): HTTP request handling and response formatting
- **Routes** ([backend/src/routes/](../backend/src/routes/)): Express route definitions

Key architectural detail: Domain models act as **Active Record pattern**, encapsulating database operations via Prisma within the model classes themselves rather than using separate repositories.

## Critical Workflows

### First-Time Setup
```bash
# Start PostgreSQL via Docker
docker-compose up -d

# Backend setup
cd backend
npm install
npx prisma generate    # Generate Prisma client
npx prisma migrate dev # Run migrations
npm run build          # MUST run before 'npm start'

# Frontend setup  
cd frontend
npm install
```

### Development Commands
- **Backend dev**: `npm run dev` (uses ts-node-dev with hot reload)
- **Backend build**: `npm run build` (compiles TypeScript to dist/)
- **Backend prod**: `npm start` (requires compiled dist/ folder)
- **Run tests**: `npm test` (Jest with ts-jest preset)

**Important**: The `start` script runs compiled JavaScript from `dist/`. Always run `npm run build` first, or use `npm run dev` for development.

## Database & Prisma Patterns

- **Schema**: [backend/prisma/schema.prisma](../backend/prisma/schema.prisma) - single source of truth
- **Connection**: Hardcoded in schema.prisma (not using .env for DATABASE_URL currently)
- **Migrations**: Run `npx prisma migrate dev` when schema changes
- **Model operations**: Domain entities expose static methods (`await Candidate.findOne(id)`) and instance methods (`await candidate.save()`)
- **Prisma access**: Available via `req.prisma` in controllers (attached via Express middleware in [index.ts](../backend/src/index.ts))

See [ModeloDatos.md](../backend/ModeloDatos.md) for complete entity relationship documentation.

## Project-Specific Conventions

### Validation Pattern
Input validation uses a centralized validator ([backend/src/application/validator.ts](../backend/src/application/validator.ts)) called from services before model instantiation:
```typescript
validateCandidateData(candidateData); // Throws error if invalid
const candidate = new Candidate(candidateData);
```

### Error Handling
- Services throw descriptive errors (e.g., `throw new Error('The email already exists')`)
- Controllers catch and format as JSON responses with appropriate status codes
- Prisma error codes are caught and transformed (e.g., `P2002` → "email already exists")

### Testing Strategy
- **Location**: Co-located with source files (e.g., `candidateService.test.ts`)
- **Framework**: Jest with ts-jest
- **Pattern**: Mock Prisma calls and test business logic in isolation
- Run via `npm test` in backend directory

### API Design
- **Spec**: [backend/api-spec.yaml](../backend/api-spec.yaml) (OpenAPI 3.0)
- **CORS**: Configured for `http://localhost:3000` (frontend)
- **Routes**: Prefixed (`/candidates`, `/position`)
- **File uploads**: Handled via `/upload` endpoint using multer

## Best Practices Reference

See [ManifestoBuenasPracticas.md](../backend/ManifestoBuenasPracticas.md) for detailed DDD guidance including:
- Entity vs Value Object distinctions
- Proper use of domain models
- Separation of concerns across layers

## Known Patterns

1. **Nested creation**: Candidates created with related entities (educations, workExperiences) in single transaction
2. **Prisma extension**: Express Request type extended globally to include `prisma: PrismaClient`
3. **Date handling**: Dates stored as DateTime in Prisma, validated as ISO strings in API spec
4. **Active Record**: Models contain both data and persistence logic (not repository pattern)

## Docker / Postgres troubleshooting

- Preferred command: the repository docs assume Docker Compose, but many modern Docker installs use the Compose plugin. Try the newer command first:

	- `docker compose up -d` (note the space)

- If you get `zsh: command not found: docker-compose`, that means the legacy `docker-compose` binary is not installed. Options:

	- Use the Compose plugin (recommended):
		- Check: `docker --version` and `docker compose version`
		- Start DB: run `docker compose up -d` from the project root (where `docker-compose.yml` lives).

	- Install Docker Desktop (macOS recommended):

```bash
brew install --cask docker
# then open Docker.app and wait until it starts
```

	- (Alternative) Install legacy binary (if you need it):

```bash
brew install docker-compose
# or
pip3 install docker-compose
```

- If `docker compose up -d` fails with permission or plugin errors, open Docker Desktop and ensure the Compose CLI plugin is enabled, or use the legacy `docker-compose` after installing it.

- After the DB is up, run from `backend/`:

```bash
npm install
npx prisma generate
npx prisma migrate dev
npm run build
npm start
```

Add this section if you want me to expand with screenshots or CI-specific commands.
