# Modular Health System

A production-ready, non-Dockerized microservices architecture with plug-and-play modules, similar to OpenMRS modules.

## Architecture

- **core-api**: NestJS service with module loader
- **modules/**: Plug-and-play modules directory
- **Database**: PostgreSQL with Prisma ORM
- **Process Management**: PM2 or systemd

## Quick Start

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Setup database**:
   ```bash
   # Update DATABASE_URL in .env
   npx prisma migrate dev
   npx prisma generate
   ```

3. **Build application**:
   ```bash
   npm run build
   ```

4. **Start with PM2**:
   ```bash
   npm install -g pm2
   pm2 start ecosystem.config.js
   ```

5. **Or start with systemd**:
   ```bash
   sudo cp health-system.service /etc/systemd/system/
   sudo systemctl enable health-system
   sudo systemctl start health-system
   ```

## Module Development

### Module Structure
```
modules/
  your-module/
    module.json          # Module manifest
    src/
      index.ts          # Module entry point
      routes.ts         # Express routes
      services/         # Business logic
      privileges.ts     # Security privileges
    migrations/         # SQL migrations
    dist/              # Compiled JS files
```

### Module Manifest (module.json)
```json
{
  "name": "your-module",
  "version": "1.0.0",
  "description": "Module description",
  "entry": "dist/index.js",
  "migrationsDir": "migrations",
  "privilegesFile": "privileges.js",
  "enabled": true,
  "dependencies": []
}
```

### Module Entry Point
```typescript
import type { ModuleContext } from '../../src/core/module-types';

export async function register(ctx: ModuleContext) {
  // Register routes
  const router = (await import('./routes')).default;
  ctx.app.use('/api/your-module', router);

  // Register services
  const { YourService } = await import('./services/your-service');
  ctx.registerService('YourService', new YourService(ctx.db));

  // Register privileges
  const { privileges } = await import('./privileges');
  await ctx.registerPrivileges(privileges);

  // Run migrations
  await ctx.runMigrations(__dirname + '/../migrations');
}

export async function onEnable(ctx: ModuleContext) {
  // Called when module is enabled
}

export async function onDisable(ctx: ModuleContext) {
  // Called when module is disabled
}

export async function onUninstall(ctx: ModuleContext) {
  // Called when module is uninstalled
}
```

## API Endpoints

- `GET /` - Health check
- `GET /health` - System health
- `GET /api/patients` - List patients (from patients module)
- `POST /api/patients` - Create patient
- `GET /api/patients/:id` - Get patient
- `PUT /api/patients/:id` - Update patient
- `DELETE /api/patients/:id` - Delete patient

## Security

### Privileges System
Modules register privileges that are stored in the database:
```typescript
export const privileges = [
  'View Patients',
  'Create Patients',
  'Edit Patients'
];
```

### Using Privileges in Routes
```typescript
import { Privileges } from '../../core/privilege-guard';

@Get()
@Privileges('View Patients')
async getPatients() {
  // Only users with 'View Patients' privilege can access
}
```

## Database Migrations

Each module can include SQL migrations in the `migrations/` directory:
```sql
-- migrations/001_create_patients.sql
CREATE TABLE patients (
  id VARCHAR(255) PRIMARY KEY,
  first_name VARCHAR(255) NOT NULL,
  -- ...
);
```

Migrations are automatically applied when modules load.

## Service Registry

Modules can register and access services:
```typescript
// Register a service
ctx.registerService('PatientService', patientService);

// Access a service from another module
const patientService = ctx.getService('PatientService');
```

## Production Deployment

### With PM2
```bash
npm run build
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### With systemd
```bash
sudo cp health-system.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable health-system
sudo systemctl start health-system
```

### Nginx Configuration
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## Module Lifecycle

1. **Install**: Copy module to `modules/` directory
2. **Enable**: Set `enabled: true` in module.json
3. **Load**: Module loader discovers and loads module
4. **Register**: Module registers routes, services, privileges
5. **Migrate**: Module migrations are applied
6. **Disable**: Set `enabled: false` to disable module
7. **Uninstall**: Remove module directory

## Monitoring

- **Logs**: Check PM2 logs with `pm2 logs`
- **Health**: Monitor `/health` endpoint
- **Database**: Monitor PostgreSQL performance
- **Modules**: Check module status in admin UI

## Development

```bash
# Development mode with hot reload
npm run dev

# Build for production
npm run build

# Run database migrations
npm run migrate

# Generate Prisma client
npm run generate
```