# Creating Custom Modules

## Overview

This guide walks you through creating a custom module for the Modular Health System. We'll create a simple "Appointments Reminder" module as an example.

## Module Structure

Create your module directory:
```
modules/custom/appointment-reminder/
├── module.json              # Module manifest
├── src/
│   ├── appointment-reminder.controller.ts
│   ├── appointment-reminder.service.ts
│   ├── dto/
│   │   └── create-reminder.dto.ts
│   └── models/
│       └── reminder.model.ts
├── migrations/
│   └── 001_create_reminders.sql
└── dist/                    # Compiled JavaScript
```

## Step 1: Module Manifest

Create `module.json`:
```json
{
  "name": "appointment-reminder",
  "version": "1.0.0",
  "description": "Automated appointment reminder system",
  "author": "Your Name",
  "entry": "dist/appointment-reminder.controller.js",
  "dependencies": ["appointments", "patients", "providers"],
  "privileges": [
    "View Reminders",
    "Create Reminders",
    "Send Reminders"
  ],
  "routes": {
    "prefix": "/api/reminders"
  },
  "database": {
    "models": ["AppointmentReminder"],
    "migrations": "migrations/"
  },
  "config": {
    "defaultReminderTime": "24h",
    "maxReminders": 3,
    "enableSMS": false,
    "enableEmail": true
  },
  "enabled": true,
  "required": false
}
```

## Step 2: Database Migration

Create `migrations/001_create_reminders.sql`:
```sql
-- Create appointment reminders table
CREATE TABLE appointment_reminders (
  id VARCHAR(255) PRIMARY KEY,
  appointment_id VARCHAR(255) NOT NULL,
  reminder_type VARCHAR(50) NOT NULL, -- 'email', 'sms', 'push'
  reminder_time TIMESTAMP NOT NULL,
  sent_at TIMESTAMP NULL,
  status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'sent', 'failed'
  message TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (appointment_id) REFERENCES appointments(id) ON DELETE CASCADE
);

-- Create indexes
CREATE INDEX idx_reminders_appointment ON appointment_reminders(appointment_id);
CREATE INDEX idx_reminders_time ON appointment_reminders(reminder_time);
CREATE INDEX idx_reminders_status ON appointment_reminders(status);
```

## Step 3: Data Models

Create `src/models/reminder.model.ts`:
```typescript
export interface AppointmentReminder {
  id: string;
  appointmentId: string;
  reminderType: 'email' | 'sms' | 'push';
  reminderTime: Date;
  sentAt?: Date;
  status: 'pending' | 'sent' | 'failed';
  message?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateReminderRequest {
  appointmentId: string;
  reminderType: 'email' | 'sms' | 'push';
  reminderTime: Date;
  message?: string;
}
```

## Step 4: DTOs

Create `src/dto/create-reminder.dto.ts`:
```typescript
import { IsString, IsEnum, IsDateString, IsOptional } from 'class-validator';

export class CreateReminderDto {
  @IsString()
  appointmentId: string;

  @IsEnum(['email', 'sms', 'push'])
  reminderType: 'email' | 'sms' | 'push';

  @IsDateString()
  reminderTime: string;

  @IsOptional()
  @IsString()
  message?: string;
}
```

## Step 5: Service Layer

Create `src/appointment-reminder.service.ts`:
```typescript
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../core/prisma.service';
import { CreateReminderDto } from './dto/create-reminder.dto';
import { AppointmentReminder } from './models/reminder.model';

@Injectable()
export class AppointmentReminderService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateReminderDto): Promise<AppointmentReminder> {
    return this.prisma.appointmentReminder.create({
      data: {
        id: `reminder_${Date.now()}`,
        appointmentId: data.appointmentId,
        reminderType: data.reminderType,
        reminderTime: new Date(data.reminderTime),
        message: data.message,
        status: 'pending'
      }
    });
  }

  async findAll(): Promise<AppointmentReminder[]> {
    return this.prisma.appointmentReminder.findMany({
      include: {
        appointment: {
          include: {
            patient: true,
            provider: true
          }
        }
      }
    });
  }

  async findPending(): Promise<AppointmentReminder[]> {
    return this.prisma.appointmentReminder.findMany({
      where: {
        status: 'pending',
        reminderTime: {
          lte: new Date()
        }
      },
      include: {
        appointment: {
          include: {
            patient: true,
            provider: true
          }
        }
      }
    });
  }

  async markAsSent(id: string): Promise<AppointmentReminder> {
    return this.prisma.appointmentReminder.update({
      where: { id },
      data: {
        status: 'sent',
        sentAt: new Date()
      }
    });
  }

  async sendReminders(): Promise<void> {
    const pendingReminders = await this.findPending();
    
    for (const reminder of pendingReminders) {
      try {
        await this.sendReminder(reminder);
        await this.markAsSent(reminder.id);
      } catch (error) {
        await this.markAsFailed(reminder.id, error.message);
      }
    }
  }

  private async sendReminder(reminder: AppointmentReminder): Promise<void> {
    // Implementation depends on reminder type
    switch (reminder.reminderType) {
      case 'email':
        await this.sendEmailReminder(reminder);
        break;
      case 'sms':
        await this.sendSMSReminder(reminder);
        break;
      case 'push':
        await this.sendPushReminder(reminder);
        break;
    }
  }

  private async sendEmailReminder(reminder: AppointmentReminder): Promise<void> {
    // Email sending logic
    console.log(`Sending email reminder for appointment ${reminder.appointmentId}`);
  }

  private async sendSMSReminder(reminder: AppointmentReminder): Promise<void> {
    // SMS sending logic
    console.log(`Sending SMS reminder for appointment ${reminder.appointmentId}`);
  }

  private async sendPushReminder(reminder: AppointmentReminder): Promise<void> {
    // Push notification logic
    console.log(`Sending push reminder for appointment ${reminder.appointmentId}`);
  }

  private async markAsFailed(id: string, error: string): Promise<void> {
    await this.prisma.appointmentReminder.update({
      where: { id },
      data: {
        status: 'failed',
        message: error
      }
    });
  }
}
```

## Step 6: Controller

Create `src/appointment-reminder.controller.ts`:
```typescript
import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '../../../core/guards/auth.guard';
import { Privileges } from '../../../core/decorators/privileges.decorator';
import { Audit } from '../../../core/decorators/audit.decorator';
import { AppointmentReminderService } from './appointment-reminder.service';
import { CreateReminderDto } from './dto/create-reminder.dto';

@ApiTags('Appointment Reminders')
@ApiBearerAuth()
@Controller('reminders')
@UseGuards(AuthGuard)
export class AppointmentReminderController {
  constructor(
    private readonly reminderService: AppointmentReminderService
  ) {}

  @Post()
  @Privileges('Create Reminders')
  @Audit('CREATE_REMINDER')
  @ApiOperation({ summary: 'Create appointment reminder' })
  async create(@Body() createReminderDto: CreateReminderDto) {
    return this.reminderService.create(createReminderDto);
  }

  @Get()
  @Privileges('View Reminders')
  @ApiOperation({ summary: 'Get all reminders' })
  async findAll() {
    return this.reminderService.findAll();
  }

  @Get('pending')
  @Privileges('View Reminders')
  @ApiOperation({ summary: 'Get pending reminders' })
  async findPending() {
    return this.reminderService.findPending();
  }

  @Post('send')
  @Privileges('Send Reminders')
  @Audit('SEND_REMINDERS')
  @ApiOperation({ summary: 'Send all pending reminders' })
  async sendReminders() {
    await this.reminderService.sendReminders();
    return { message: 'Reminders sent successfully' };
  }
}
```

## Step 7: Module Entry Point

Create `src/index.ts`:
```typescript
import { ModuleContext } from '../../../core/module-types';
import { AppointmentReminderController } from './appointment-reminder.controller';
import { AppointmentReminderService } from './appointment-reminder.service';

export async function register(ctx: ModuleContext) {
  // Register service
  const reminderService = new AppointmentReminderService(ctx.db);
  ctx.registerService('AppointmentReminderService', reminderService);

  // Register controller
  const controller = new AppointmentReminderController(reminderService);
  ctx.registerController(controller);

  // Register privileges
  await ctx.registerPrivileges([
    'View Reminders',
    'Create Reminders',
    'Send Reminders'
  ]);

  // Run migrations
  await ctx.runMigrations(__dirname + '/../migrations');

  // Schedule reminder job (every 5 minutes)
  ctx.scheduleJob('send-reminders', '*/5 * * * *', async () => {
    await reminderService.sendReminders();
  });

  console.log('Appointment Reminder module registered successfully');
}

export async function onEnable(ctx: ModuleContext) {
  console.log('Appointment Reminder module enabled');
}

export async function onDisable(ctx: ModuleContext) {
  console.log('Appointment Reminder module disabled');
  // Cancel scheduled jobs
  ctx.cancelJob('send-reminders');
}

export async function onUninstall(ctx: ModuleContext) {
  console.log('Appointment Reminder module uninstalled');
  // Clean up data if needed
}
```

## Step 8: Build and Test

1. **Compile TypeScript**:
```bash
cd modules/custom/appointment-reminder
npx tsc src/*.ts --outDir dist --target es2020 --module commonjs
```

2. **Restart the application**:
```bash
npm run dev
```

3. **Test the module**:
```bash
# Create a reminder
curl -X POST http://localhost:3000/api/reminders \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "appointmentId": "appointment_123",
    "reminderType": "email",
    "reminderTime": "2024-01-16T09:00:00Z"
  }'

# Get all reminders
curl -X GET http://localhost:3000/api/reminders \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Step 9: Advanced Features

### Event Handling
```typescript
export async function register(ctx: ModuleContext) {
  // Listen for appointment creation
  ctx.on('appointment.created', async (event) => {
    const { appointmentId, appointmentDate } = event.data;
    
    // Auto-create reminder 24 hours before
    const reminderTime = new Date(appointmentDate);
    reminderTime.setHours(reminderTime.getHours() - 24);
    
    await reminderService.create({
      appointmentId,
      reminderType: 'email',
      reminderTime: reminderTime.toISOString()
    });
  });
}
```

### Configuration Management
```typescript
export class AppointmentReminderService {
  private async getConfig() {
    return await this.ctx.getModuleConfig('appointment-reminder');
  }

  async create(data: CreateReminderDto) {
    const config = await this.getConfig();
    const defaultTime = config.get('defaultReminderTime', '24h');
    
    // Use configuration in logic
  }
}
```

## Best Practices

1. **Error Handling**: Always handle errors gracefully
2. **Validation**: Validate all input data
3. **Security**: Use privileges for access control
4. **Audit**: Log important actions
5. **Testing**: Write unit and integration tests
6. **Documentation**: Document your APIs
7. **Configuration**: Make behavior configurable
8. **Dependencies**: Minimize external dependencies

## Module Distribution

Package your module for distribution:
```bash
# Create package
tar -czf appointment-reminder-1.0.0.tgz modules/custom/appointment-reminder/

# Install on another system
tar -xzf appointment-reminder-1.0.0.tgz -C /path/to/health-system/
```