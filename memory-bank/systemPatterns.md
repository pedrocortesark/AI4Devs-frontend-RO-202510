# Arquitectura y Patrones del Sistema LTI

## Arquitectura General
**Tipo**: Full-Stack Web Application
**Patrón Principal**: Domain-Driven Design (DDD) con Clean Architecture
**Separación de Responsabilidades**: Estricta división en capas horizontales

## Estructura de Capas (Backend)

### 1. Domain Layer (`src/domain/`)
**Responsabilidad**: Lógica de negocio pura, entidades y reglas del dominio
**Patrones Implementados**:
- **Active Record**: Modelos con métodos estáticos para operaciones DB
- **Entity Pattern**: Clases con identidad única y comportamiento
- **Value Objects**: Educación, Experiencia Laboral (sin ID propio)

**Modelos Principales**:
- `Candidate`: Raíz del agregado, contiene educations, workExperiences, resumes
- `Position`: Entidad con relación a interviewFlow
- `Application`: Puente entre Candidate y Position con estado de entrevista
- `Interview`: Registro de entrevistas realizadas

**Relaciones Clave**:
```
Candidate (1) --> (*) Education
Candidate (1) --> (*) WorkExperience
Candidate (1) --> (*) Resume
Candidate (1) --> (*) Application
Position (1) --> (*) Application
Application (1) --> (*) Interview
```

### 2. Application Layer (`src/application/`)
**Responsabilidad**: Orquestación de lógica de negocio, validación, servicios
**Componentes**:
- **Services**: Lógica de aplicación (candidateService, positionService)
- **Validators**: Validación centralizada de entrada (validator.ts)
- **File Upload**: Gestión de archivos CV (fileUploadService.ts)

**Patrones**:
- **Service Layer**: Separación de lógica de negocio de infraestructura
- **Validation Pattern**: Validación antes de instanciación de modelos

### 3. Presentation Layer (`src/presentation/`)
**Responsabilidad**: Manejo de HTTP requests/responses
**Componentes**:
- **Controllers**: Lógica de endpoints (candidateController, positionController)
- **Error Handling**: Transformación de errores a respuestas HTTP

**Patrones**:
- **Controller Pattern**: Un controller por entidad principal
- **Middleware Pattern**: Inyección de Prisma en requests

### 4. Infrastructure Layer (`src/routes/`)
**Responsabilidad**: Definición de rutas y configuración Express
**Componentes**:
- **Routes**: Configuración de endpoints REST
- **Middleware**: CORS, JSON parsing, Prisma injection

## Arquitectura Frontend

### Framework: React con Create React App
**Estructura**:
- `src/components/`: Componentes UI (Positions, AddCandidateForm, etc.)
- `src/services/`: Llamadas a API REST
- `public/`: Assets estáticos

**Patrones**:
- **Component-Based Architecture**: Reutilización de componentes
- **Service Layer**: Abstracción de llamadas API

## Base de Datos y Persistencia

### ORM: Prisma con PostgreSQL
**Patrón**: Active Record en modelos de dominio
**Características**:
- **Schema-First**: Definición declarativa en `schema.prisma`
- **Migrations**: Versionado de cambios DB
- **Client Generation**: Tipos TypeScript automáticos

**Configuración**:
- **Connection**: Hardcoded en schema (desarrollo local)
- **Relations**: Foreign keys con cascada apropiada
- **Constraints**: Unique, required fields, lengths

## Patrones de Diseño Implementados

### SOLID Principles
- **SRP**: Cada clase/modelo tiene responsabilidad única
- **OCP**: Extensión vía herencia o composición
- **LSP**: Interfaces consistentes (planeado)
- **ISP**: Separación de concerns en capas
- **DIP**: Dependencia de abstracciones (PrismaClient inyectado)

### DDD Patterns
- **Aggregates**: Candidate como raíz de agregado
- **Repositories**: Métodos estáticos en modelos (Active Record)
- **Domain Services**: Lógica compleja en services
- **Value Objects**: Education, WorkExperience
- **Entities**: Con ID único y lifecycle

### Clean Architecture
- **Independence of Frameworks**: Lógica de dominio no depende de Express/React
- **Testability**: Separación permite mocking fácil
- **Independence of UI**: API REST desacopla frontend
- **Independence of Database**: Prisma abstrae PostgreSQL

## Comunicación entre Capas

### Backend Flow
```
HTTP Request → Routes → Controller → Service → Validator → Domain Model → Prisma → DB
Response ← Controller ← Service ← Domain Model ← Prisma ← DB
```

### Frontend Flow
```
User Action → Component → Service → API Call → Backend
Response ← Component ← Service ← API Response ← Backend
```

## Configuración y Despliegue

### Desarrollo
- **Scripts**: `npm run dev` (ts-node-dev), `npm run build` (tsc)
- **DB**: Docker Compose con PostgreSQL
- **Hot Reload**: Configurado para backend

### Producción
- **Build**: `npm run build` genera `dist/`
- **Start**: `npm start` ejecuta código compilado
- **Docker**: Contenedor para DB, app preparada para containerización

## Decisiones Arquitecturales Críticas

1. **Active Record vs Repository**: Elegido Active Record por simplicidad y consistencia con Prisma
2. **Single Transaction**: Creación de candidatos con relaciones en una transacción
3. **Validation Centralizada**: Un solo validador para mantener consistencia
4. **File Upload**: Integrado en backend con multer, separado de lógica de negocio
5. **CORS**: Configurado para desarrollo local (localhost:3000)

## Extensibilidad
- **Nuevos Modelos**: Seguir patrón DDD existente
- **Nuevos Endpoints**: Añadir routes, controllers, services siguiendo estructura
- **Nuevos Flujos**: Extender interviewFlows sin cambiar arquitectura core
- **Autenticación**: Preparado para añadir middleware de auth