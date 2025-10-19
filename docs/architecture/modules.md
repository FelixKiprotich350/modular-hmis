# Module System Architecture

## Overview

The module system is the core architectural pattern that enables plug-and-play functionality, allowing healthcare facilities to customize their system by enabling only the modules they need.

## Module Structure

```
modules/
├── core/                    # Essential healthcare modules
│   ├── patients/           # Patient management
│   ├── providers/          # Healthcare provider management
│   ├── encounters/         # Patient encounters
│   ├── auth/              # Authentication
│   └── ...
└── custom/                 # Extended functionality modules
    ├── billing/           # Billing and invoicing
    ├── pharmacy/          # Pharmacy management
    ├── telemedicine/      # Remote consultations
    └── ...
```

## Module Lifecycle

### 1. Discovery
- Module loader scans `modules/` directory
- Reads `module.json` manifest files
- Validates module structure and dependencies

### 2. Loading
- Imports module entry point
- Registers routes, services, and middleware
- Applies database migrations
- Sets up privileges and permissions

### 3. Runtime
- Modules operate independently
- Communicate through service registry
- Share data through database models
- Emit and listen to events

### 4. Management
- Enable/disable modules dynamically
- Update module configurations
- Monitor module health and performance

## Module Manifest (module.json)

```json
{
  "name": "patients",
  "version": "1.0.0",
  "description": "Patient management module",
  "entry": "dist/patients.controller.js",
  "dependencies": ["auth", "users"],
  "privileges": [
    "View Patients",
    "Create Patients",
    "Edit Patients",
    "Delete Patients"
  ],
  "routes": {
    "prefix": "/api/patients",
    "middleware": ["auth", "audit"]
  },
  "database": {
    "models": ["Patient", "PatientIdentifier"],
    "migrations": "migrations/"
  },
  "enabled": true,
  "required": true
}
```

## Module Entry Point

```typescript
import { ModuleContext } from '../../core/module-types';

export class PatientsModule {
  async register(ctx: ModuleContext) {
    // Register routes
    ctx.app.use('/api/patients', this.getRoutes());
    
    // Register services
    ctx.registerService('PatientsService', new PatientsService(ctx.db));
    
    // Register privileges
    await ctx.registerPrivileges([
      'View Patients',
      'Create Patients',
      'Edit Patients'
    ]);
    
    // Run migrations
    await ctx.runMigrations(__dirname + '/migrations');
  }

  async onEnable(ctx: ModuleContext) {
    console.log('Patients module enabled');
  }

  async onDisable(ctx: ModuleContext) {
    console.log('Patients module disabled');
  }
}
```

## Service Registry

The service registry enables modules to share functionality:

```typescript
// Register a service
ctx.registerService('PatientService', patientService);

// Access service from another module
const patientService = ctx.getService('PatientService');
const patient = await patientService.findById(patientId);
```

## Inter-Module Communication

### 1. Service Dependencies
```typescript
// Module A provides a service
ctx.registerService('NotificationService', notificationService);

// Module B uses the service
const notifications = ctx.getService('NotificationService');
await notifications.send('Patient registered', userId);
```

### 2. Event System
```typescript
// Module A emits an event
ctx.emit('patient.created', { patientId, data });

// Module B listens for the event
ctx.on('patient.created', async (event) => {
  await billingService.createAccount(event.patientId);
});
```

### 3. Database Relationships
```typescript
// Modules can reference each other's models
model Billing {
  patientId String
  patient   Patient @relation(fields: [patientId], references: [id])
}
```

## Module Categories

### Core Modules (Required)
- **auth**: Authentication and session management
- **users**: User account management
- **roleprivileges**: Role-based access control
- **patients**: Patient registration and management
- **providers**: Healthcare provider management
- **encounters**: Patient-provider interactions
- **locations**: Facility and location management

### Clinical Modules
- **observations**: Vital signs and clinical observations
- **forms**: Clinical forms and data collection
- **concepts**: Medical concepts and terminology
- **appointments**: Appointment scheduling
- **visits**: Patient visit tracking

### Administrative Modules
- **audit**: Activity logging and compliance
- **settings**: System configuration
- **idgen**: Identifier generation
- **address-hierarchy**: Geographic address management

### Custom Modules
- **billing**: Financial management
- **pharmacy**: Medication management
- **inventory**: Supply chain management
- **telemedicine**: Remote consultation
- **reports**: Analytics and reporting
- **insurance**: Insurance claim processing

## Module Dependencies

Modules can declare dependencies on other modules:

```json
{
  "name": "billing",
  "dependencies": ["patients", "providers", "encounters"],
  "optionalDependencies": ["insurance", "inventory"]
}
```

The module loader ensures dependencies are loaded first and handles circular dependencies.

## Security Integration

Each module integrates with the security system:

```typescript
@Controller('patients')
export class PatientsController {
  @Get()
  @Privileges('View Patients')
  async findAll() {
    // Only users with 'View Patients' privilege can access
  }

  @Post()
  @Privileges('Create Patients')
  @Audit('CREATE_PATIENT')
  async create(@Body() data: CreatePatientDto) {
    // Automatically audited and privilege-checked
  }
}
```

## Module Configuration

Modules can have their own configuration:

```typescript
// Module-specific settings
const config = await ctx.getModuleConfig('billing');
const taxRate = config.get('taxRate', 0.1);

// Global system settings
const globalConfig = await ctx.getSystemConfig();
const timezone = globalConfig.get('timezone', 'UTC');
```

## Hot Module Reloading

In development, modules support hot reloading:

```typescript
// Disable module
await moduleLoader.disable('billing');

// Update module code
// ...

// Re-enable module
await moduleLoader.enable('billing');
```

## Module Health Monitoring

Each module can report its health status:

```typescript
export class PatientsModule {
  async healthCheck(): Promise<HealthStatus> {
    return {
      status: 'healthy',
      checks: {
        database: await this.checkDatabase(),
        services: await this.checkServices()
      }
    };
  }
}
```

## Best Practices

1. **Single Responsibility**: Each module should have a clear, focused purpose
2. **Loose Coupling**: Minimize dependencies between modules
3. **Clear Interfaces**: Define clear APIs for inter-module communication
4. **Error Handling**: Handle failures gracefully without affecting other modules
5. **Documentation**: Document module APIs and dependencies
6. **Testing**: Include comprehensive tests for each module
7. **Versioning**: Use semantic versioning for module releases