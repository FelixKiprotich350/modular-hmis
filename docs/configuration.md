# Configuration Guide

## Environment Variables

### Core Configuration

```env
# Application
NODE_ENV=development|production|test
PORT=3000
APP_NAME="Modular Health System"
APP_VERSION=1.0.0

# Database
DATABASE_URL="postgresql://username:password@localhost:5432/database_name"
DATABASE_POOL_SIZE=10
DATABASE_TIMEOUT=30000

# Authentication
JWT_SECRET="your-super-secret-jwt-key"
JWT_EXPIRES_IN="24h"
JWT_REFRESH_EXPIRES_IN="7d"

# Security
BCRYPT_ROUNDS=12
SESSION_SECRET="your-session-secret"
CORS_ORIGIN="http://localhost:3000,https://yourdomain.com"
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# File Upload
UPLOAD_MAX_SIZE=10485760
UPLOAD_DEST="./uploads"
ALLOWED_FILE_TYPES="jpg,jpeg,png,pdf,doc,docx"

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
EMAIL_FROM="Health System <noreply@yourdomain.com>"

# Logging
LOG_LEVEL=info|debug|warn|error
LOG_FILE=./logs/app.log
LOG_MAX_SIZE=10m
LOG_MAX_FILES=5

# Redis (Optional)
REDIS_URL="redis://localhost:6379"
REDIS_PASSWORD=""
REDIS_DB=0

# External Services
TWILIO_ACCOUNT_SID=your-twilio-sid
TWILIO_AUTH_TOKEN=your-twilio-token
TWILIO_PHONE_NUMBER=+1234567890

# Monitoring
SENTRY_DSN=your-sentry-dsn
NEW_RELIC_LICENSE_KEY=your-newrelic-key
```

### Module-Specific Configuration

```env
# Billing Module
BILLING_TAX_RATE=0.08
BILLING_CURRENCY=USD
BILLING_PAYMENT_GATEWAY=stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Pharmacy Module
PHARMACY_AUTO_DISPENSE=false
PHARMACY_REQUIRE_SIGNATURE=true
PHARMACY_INVENTORY_ALERTS=true

# Telemedicine Module
TELEMEDICINE_PROVIDER=zoom
ZOOM_API_KEY=your-zoom-api-key
ZOOM_API_SECRET=your-zoom-api-secret
WEBRTC_STUN_SERVERS="stun:stun.l.google.com:19302"

# Laboratory Module
LAB_AUTO_RESULT_NOTIFICATION=true
LAB_CRITICAL_VALUE_ALERTS=true
LAB_RESULT_RETENTION_DAYS=2555

# Reports Module
REPORTS_CACHE_TTL=3600
REPORTS_MAX_EXPORT_ROWS=10000
REPORTS_STORAGE_PATH="./reports"
```

## System Settings

### Database Settings
```json
{
  "database": {
    "connectionPool": {
      "min": 2,
      "max": 10,
      "acquireTimeoutMillis": 30000,
      "idleTimeoutMillis": 30000
    },
    "migrations": {
      "autoRun": true,
      "directory": "./migrations"
    },
    "backup": {
      "enabled": true,
      "schedule": "0 2 * * *",
      "retention": 30,
      "location": "./backups"
    }
  }
}
```

### Security Settings
```json
{
  "security": {
    "authentication": {
      "maxLoginAttempts": 5,
      "lockoutDuration": 900,
      "passwordPolicy": {
        "minLength": 8,
        "requireUppercase": true,
        "requireLowercase": true,
        "requireNumbers": true,
        "requireSpecialChars": true,
        "preventReuse": 5
      },
      "sessionTimeout": 3600,
      "twoFactorAuth": {
        "enabled": false,
        "required": false,
        "issuer": "Health System"
      }
    },
    "encryption": {
      "algorithm": "aes-256-gcm",
      "keyRotation": 90
    },
    "audit": {
      "enabled": true,
      "retentionDays": 2555,
      "sensitiveDataMasking": true
    }
  }
}
```

### Module Configuration
```json
{
  "modules": {
    "core": {
      "patients": {
        "enabled": true,
        "autoGenerateId": true,
        "idFormat": "PAT-{YYYY}-{####}",
        "duplicateDetection": true
      },
      "appointments": {
        "enabled": true,
        "defaultDuration": 30,
        "allowOverlapping": false,
        "reminderSettings": {
          "enabled": true,
          "defaultTime": "24h",
          "methods": ["email", "sms"]
        }
      }
    },
    "custom": {
      "billing": {
        "enabled": true,
        "autoGenerateInvoices": true,
        "paymentMethods": ["cash", "card", "insurance"],
        "taxCalculation": "automatic"
      },
      "pharmacy": {
        "enabled": true,
        "inventoryTracking": true,
        "expirationAlerts": true,
        "prescriptionValidation": true
      }
    }
  }
}
```

## Application Configuration

### Server Configuration
```typescript
// src/config/server.config.ts
export const serverConfig = {
  port: process.env.PORT || 3000,
  host: process.env.HOST || '0.0.0.0',
  cors: {
    origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
  },
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
    message: 'Too many requests from this IP'
  },
  compression: {
    enabled: true,
    threshold: 1024
  },
  helmet: {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"]
      }
    }
  }
};
```

### Database Configuration
```typescript
// src/config/database.config.ts
export const databaseConfig = {
  url: process.env.DATABASE_URL,
  pool: {
    min: 2,
    max: parseInt(process.env.DATABASE_POOL_SIZE) || 10
  },
  timeout: parseInt(process.env.DATABASE_TIMEOUT) || 30000,
  ssl: process.env.NODE_ENV === 'production' ? {
    rejectUnauthorized: false
  } : false,
  logging: process.env.NODE_ENV === 'development',
  migrations: {
    directory: './prisma/migrations',
    autoRun: process.env.NODE_ENV !== 'production'
  }
};
```

### Logging Configuration
```typescript
// src/config/logging.config.ts
export const loggingConfig = {
  level: process.env.LOG_LEVEL || 'info',
  format: 'json',
  transports: [
    {
      type: 'console',
      colorize: process.env.NODE_ENV === 'development'
    },
    {
      type: 'file',
      filename: process.env.LOG_FILE || './logs/app.log',
      maxSize: process.env.LOG_MAX_SIZE || '10m',
      maxFiles: parseInt(process.env.LOG_MAX_FILES) || 5
    }
  ],
  exceptions: {
    file: './logs/exceptions.log'
  }
};
```

## Runtime Configuration

### System Settings API
```bash
# Get all settings
GET /api/settings
Authorization: Bearer <admin_token>

# Update setting
PUT /api/settings/appointment.defaultDuration
Content-Type: application/json
Authorization: Bearer <admin_token>

{
  "value": 45,
  "description": "Default appointment duration in minutes"
}

# Get module settings
GET /api/settings/modules/billing
Authorization: Bearer <admin_token>
```

### Module Configuration
```typescript
// In module code
export class BillingService {
  constructor(private configService: ConfigService) {}

  async processPayment(amount: number) {
    const taxRate = await this.configService.get('billing.taxRate', 0.08);
    const currency = await this.configService.get('billing.currency', 'USD');
    
    const tax = amount * taxRate;
    const total = amount + tax;
    
    // Process payment logic
  }
}
```

## Environment-Specific Configurations

### Development (.env.development)
```env
NODE_ENV=development
PORT=3000
DATABASE_URL="postgresql://dev_user:dev_pass@localhost:5432/health_system_dev"
JWT_SECRET="dev-jwt-secret"
LOG_LEVEL=debug
CORS_ORIGIN="http://localhost:3000,http://localhost:3001"
```

### Testing (.env.test)
```env
NODE_ENV=test
PORT=3001
DATABASE_URL="postgresql://test_user:test_pass@localhost:5432/health_system_test"
JWT_SECRET="test-jwt-secret"
LOG_LEVEL=error
RATE_LIMIT_MAX_REQUESTS=1000
```

### Production (.env.production)
```env
NODE_ENV=production
PORT=3000
DATABASE_URL="postgresql://prod_user:secure_pass@db.company.com:5432/health_system_prod"
JWT_SECRET="super-secure-production-jwt-secret"
LOG_LEVEL=warn
CORS_ORIGIN="https://health.company.com"
RATE_LIMIT_MAX_REQUESTS=100
SENTRY_DSN="https://your-sentry-dsn"
```

## Configuration Validation

### Environment Validation
```typescript
// src/config/validation.ts
import Joi from 'joi';

export const configValidationSchema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'production', 'test').required(),
  PORT: Joi.number().port().default(3000),
  DATABASE_URL: Joi.string().uri().required(),
  JWT_SECRET: Joi.string().min(32).required(),
  JWT_EXPIRES_IN: Joi.string().default('24h'),
  LOG_LEVEL: Joi.string().valid('error', 'warn', 'info', 'debug').default('info'),
  UPLOAD_MAX_SIZE: Joi.number().positive().default(10485760),
  RATE_LIMIT_MAX_REQUESTS: Joi.number().positive().default(100)
});
```

### Runtime Validation
```typescript
// Validate configuration on startup
export function validateConfiguration() {
  const { error, value } = configValidationSchema.validate(process.env, {
    allowUnknown: true,
    abortEarly: false
  });

  if (error) {
    throw new Error(`Configuration validation error: ${error.message}`);
  }

  return value;
}
```

## Configuration Management

### Configuration Service
```typescript
@Injectable()
export class ConfigService {
  private settings = new Map<string, any>();

  async get<T>(key: string, defaultValue?: T): Promise<T> {
    if (this.settings.has(key)) {
      return this.settings.get(key);
    }

    // Load from database
    const setting = await this.prisma.settings.findUnique({
      where: { key }
    });

    const value = setting ? JSON.parse(setting.value) : defaultValue;
    this.settings.set(key, value);
    return value;
  }

  async set(key: string, value: any): Promise<void> {
    await this.prisma.settings.upsert({
      where: { key },
      update: { value: JSON.stringify(value) },
      create: { key, value: JSON.stringify(value) }
    });

    this.settings.set(key, value);
  }
}
```

### Configuration Hot Reload
```typescript
// Watch for configuration changes
export class ConfigWatcher {
  constructor(private configService: ConfigService) {
    this.watchConfigChanges();
  }

  private watchConfigChanges() {
    // Watch database changes
    setInterval(async () => {
      await this.reloadConfiguration();
    }, 30000); // Check every 30 seconds
  }

  private async reloadConfiguration() {
    // Reload changed settings
    const changedSettings = await this.getChangedSettings();
    
    for (const setting of changedSettings) {
      this.configService.invalidateCache(setting.key);
    }
  }
}
```

## Best Practices

### Security
1. **Never commit secrets**: Use environment variables for sensitive data
2. **Rotate secrets regularly**: Implement key rotation policies
3. **Validate all inputs**: Validate configuration values on startup
4. **Use strong defaults**: Provide secure default values
5. **Encrypt sensitive settings**: Encrypt database-stored configuration

### Performance
1. **Cache configuration**: Cache frequently accessed settings
2. **Lazy loading**: Load configuration only when needed
3. **Connection pooling**: Configure appropriate database pool sizes
4. **Resource limits**: Set appropriate memory and CPU limits

### Maintainability
1. **Document all settings**: Provide clear documentation for each setting
2. **Use typed configuration**: Implement TypeScript interfaces for configuration
3. **Validate on startup**: Fail fast if configuration is invalid
4. **Environment separation**: Use different configurations for different environments
5. **Version configuration**: Track configuration changes over time