# Stack Tecnológico y Comandos - LTI Talent Tracking System

## Backend Stack

### Lenguaje y Framework
- **TypeScript**: 4.9+ (configurado en `tsconfig.json`)
- **Node.js**: 18+ (recomendado)
- **Express.js**: Framework web con middleware pattern
- **Prisma**: ORM moderno con schema-first approach

### Base de Datos
- **PostgreSQL**: 13+ con Docker
- **Prisma Client**: Generado automáticamente desde schema
- **Prisma Migrate**: Versionado de esquema DB

### Testing
- **Jest**: Framework de testing con ts-jest preset
- **Configuración**: `jest.config.js` con coverage

### Desarrollo y Build
- **ts-node-dev**: Hot reload para desarrollo (`npm run dev`)
- **TypeScript Compiler**: Build a JavaScript (`npm run build`)
- **ESLint/Prettier**: Code quality (no configurado aún)

## Frontend Stack

### Framework y Librerías
- **React**: 18+ con Create React App
- **React Bootstrap**: Componentes UI responsivos
- **@dnd-kit/core**: Librería moderna para Drag & Drop (recomendada para Vista Kanban)
- **Axios**: Cliente HTTP para API calls (implícito en services)

### Build y Desarrollo
- **Create React App**: Configuración estándar
- **Webpack**: Bundling automático
- **Babel**: Transpilación JSX/TypeScript

## Infraestructura y DevOps

### Contenerización
- **Docker**: Base de datos PostgreSQL
- **Docker Compose**: Orquestación de servicios

### API Documentation
- **OpenAPI 3.0**: Especificación en `api-spec.yaml`
- **Swagger UI**: Generable desde spec

## Comandos Críticos

### Setup Inicial
```bash
# Instalar dependencias
cd backend && npm install
cd ../frontend && npm install

# Configurar base de datos
docker-compose up -d
cd backend
npx prisma generate
npx prisma migrate dev
```

### Desarrollo
```bash
# Backend dev con hot reload
cd backend && npm run dev

# Backend build
cd backend && npm run build

# Backend producción
cd backend && npm start

# Frontend dev
cd frontend && npm start

# Tests
cd backend && npm test
```

### Base de Datos
```bash
# Generar Prisma client
npx prisma generate

# Crear migración
npx prisma migrate dev

# Reset DB
npx prisma migrate reset

# Seed data
npx prisma db seed

# Studio (GUI)
npx prisma studio
```

### Docker
```bash
# Levantar DB
docker-compose up -d

# Detener DB
docker-compose down

# Logs DB
docker-compose logs -f
```

## Configuración de Desarrollo

### Variables de Entorno
- **DATABASE_URL**: PostgreSQL connection string (hardcoded en schema.prisma)
- **PORT**: 3010 (backend)
- **CORS_ORIGIN**: http://localhost:3000 (frontend)

### Estructura de Archivos
```
backend/
├── src/
│   ├── domain/models/     # Entidades DDD
│   ├── application/services/  # Lógica de negocio
│   ├── presentation/controllers/  # HTTP handlers
│   ├── routes/            # Express routes
│   └── index.ts           # App entry point
├── prisma/
│   ├── schema.prisma      # DB schema
│   └── migrations/        # DB migrations
└── package.json

frontend/
├── src/
│   ├── components/        # React components
│   ├── services/          # API clients
│   └── App.tsx            # Main app
└── package.json
```

## Herramientas de Desarrollo

### IDE y Extensiones
- **VS Code**: Editor principal
- **TypeScript Importer**: Auto-imports
- **Prisma Extension**: Syntax highlighting y comandos
- **ESLint**: Code linting

### Debugging
- **Chrome DevTools**: Frontend debugging
- **Node.js Inspector**: Backend debugging
- **Prisma Studio**: DB inspection

### Versionado
- **Git**: Control de versiones
- **Conventional Commits**: Estándar de commits (no aplicado aún)

## Dependencias Clave

### Backend (`package.json`)
```json
{
  "dependencies": {
    "@prisma/client": "^5.0.0",
    "express": "^4.18.0",
    "cors": "^2.8.5",
    "multer": "^1.4.5"
  },
  "devDependencies": {
    "@types/express": "^4.17.0",
    "@types/cors": "^2.8.0",
    "@types/multer": "^1.4.0",
    "@types/node": "^20.0.0",
    "typescript": "^5.0.0",
    "ts-node-dev": "^2.0.0",
    "jest": "^29.0.0",
    "ts-jest": "^29.0.0",
    "prisma": "^5.0.0"
  }
}
```

### Frontend (`package.json`)
```json
{
  "dependencies": {
    "react": "^18.0.0",
    "react-bootstrap": "^2.7.0",
    "bootstrap": "^5.2.0"
  }
}
```

## Limitaciones y Consideraciones

### Rendimiento
- **Single Thread**: Node.js limita concurrencia (usar PM2 en prod)
- **DB Connections**: Prisma maneja pool automáticamente
- **File Uploads**: Sin límites configurados (agregar validación)

### Seguridad
- **CORS**: Configurado solo para desarrollo
- **Input Validation**: Regex básico, no sanitización XSS
- **Authentication**: No implementada (JWT planeado)

### Escalabilidad
- **Monolito**: Arquitectura preparada para microservicios
- **DB**: PostgreSQL escala vertical/horizontal
- **API**: REST, preparada para GraphQL

## Próximas Mejoras Técnicas
- **Autenticación**: JWT con middleware
- **Testing**: Cobertura completa con mocks
- **CI/CD**: GitHub Actions pipeline
- **Monitoring**: Logs estructurados, métricas
- **Containerización**: Dockerfile para app completa