# Comprehensive Audit System

## Overview
The audit system ensures all important operations across core and custom modules are tracked and logged for security, compliance, and monitoring purposes.

## Architecture

### Core Components
- **AuditInterceptor**: Automatically captures HTTP requests/responses
- **AuditService**: Core service for logging audit events
- **AuditManagerService**: High-level service for different audit types
- **Audit Decorator**: Marks methods for explicit auditing
- **AuditConfig**: Configuration for audit behavior

### Database Schema
```sql
model AuditLog {
  id         String   @id @default(cuid())
  userId     String?
  action     String
  resource   String
  resourceId String?
  details    Json?
  ipAddress  String?
  userAgent  String?
  timestamp  DateTime @default(now())
}
```

## Audit Coverage

### Automatic Auditing
All controllers using `@UseInterceptors(AuditInterceptor)` automatically audit:
- **Write Operations**: POST, PUT, PATCH, DELETE
- **Sensitive GET Operations**: User data, patient records, audit logs
- **Failed Operations**: All HTTP errors (4xx, 5xx)
- **Security Events**: Login, logout, authentication failures

### Explicit Auditing
Use `@Audit('Custom action description')` decorator for:
- Custom action descriptions
- Business logic operations
- Critical system events

### Sensitive Resources
Automatically audited resources:
- users, roles, patients, encounters, observations
- providers, audit, settings, inventory
- billing, pharmacy, telemedicine

## Implementation Examples

### Controller Setup
```typescript
@Controller('api/inventory')
@UseGuards(AuthGuard, PrivilegeGuard)
@UseInterceptors(AuditInterceptor)
export class InventoryController {
  @Post()
  @Privileges('manage_inventory')
  @Audit('Create inventory item')
  create(@Body() dto: CreateDto, @User() user: any) {
    // Implementation
  }
}
```

### Manual Audit Logging
```typescript
// Security events
await auditManager.logSecurityEvent(userId, 'LOGIN_SUCCESS', { ip });

// Critical actions
await auditManager.logCriticalAction(userId, 'Delete patient', 'patients', patientId);

// Module operations
await auditManager.logModuleOperation(userId, 'inventory', 'stock-update');

// Data access
await auditManager.logDataAccess(userId, 'patients', patientId, 'read');

// System events
await auditManager.logSystemEvent('Module loaded', { module: 'inventory' });
```

## Audit Data Captured

### Request Information
- HTTP method and URL
- Request body (sanitized)
- Query parameters
- URL parameters
- User agent
- Client IP address

### User Context
- User ID
- Roles and privileges
- Session information

### Response Information
- Status code
- Response time
- Success/failure status

### Security Context
- Authentication status
- Authorization checks
- Privilege requirements

## Security Features

### Data Sanitization
Sensitive fields automatically redacted:
- Passwords → `[REDACTED]`
- Tokens → `[REDACTED]`
- API keys → `[REDACTED]`

### IP Address Tracking
Captures real client IP through:
- X-Forwarded-For header
- Direct connection IP
- Proxy headers

### Failure Tracking
All failed operations logged with:
- Error messages
- Stack traces (sanitized)
- Failure reasons

## Audit Queries

### Recent Activity
```typescript
GET /api/audit/logs?limit=100
```

### User Activity
```typescript
GET /api/audit/user-activity
GET /api/audit/summary/:userId?days=30
```

### Resource Activity
```typescript
GET /api/audit/resource/patients?resourceId=123
```

### Security Events
```typescript
GET /api/audit/security
```

### Failed Operations
```typescript
GET /api/audit/failed-operations
```

### Date Range
```typescript
GET /api/audit/logs?startDate=2024-01-01&endDate=2024-01-31
```

## Configuration

### Audit Settings
```typescript
export const AUDIT_CONFIG = {
  enabled: true,
  auditAllOperations: true,
  sensitiveResources: ['users', 'patients', 'encounters'],
  criticalActions: ['Delete user', 'Create patient'],
  excludePatterns: ['/health', '/swagger'],
  retentionDays: 365
};
```

### Module Integration
Each module automatically inherits audit capabilities:
1. Add `@UseInterceptors(AuditInterceptor)` to controllers
2. Use `@Audit()` decorator for custom actions
3. Inject `AuditManagerService` for manual logging

## Compliance Features

### Data Retention
- Configurable retention period
- Automatic cleanup of old logs
- Compliance with data protection regulations

### Audit Trail Integrity
- Immutable audit logs
- Cryptographic signatures (optional)
- Tamper detection

### Reporting
- Audit reports generation
- Compliance dashboards
- Export capabilities

## Performance Considerations

### Asynchronous Logging
- Non-blocking audit operations
- Background processing
- Error handling without disrupting main flow

### Database Optimization
- Indexed audit tables
- Partitioned by date
- Efficient queries

### Storage Management
- Configurable log levels
- Compression for old logs
- Archive strategies

## Monitoring and Alerts

### Real-time Monitoring
- Failed operation alerts
- Suspicious activity detection
- Performance metrics

### Dashboard Integration
- Audit statistics
- User activity trends
- Security event summaries

## Best Practices

### Controller Implementation
1. Always use `@UseInterceptors(AuditInterceptor)`
2. Add `@Audit()` for important operations
3. Include `@User()` parameter for user context

### Service Implementation
1. Use `AuditManagerService` for business logic auditing
2. Log critical operations explicitly
3. Include relevant context in details

### Security Implementation
1. Audit all authentication events
2. Log privilege changes
3. Monitor failed access attempts

## Module Examples

### Core Modules
- **Users**: Login, logout, role changes
- **Patients**: CRUD operations, data access
- **Encounters**: Clinical data modifications
- **Audit**: Self-monitoring and reporting

### Custom Modules
- **Inventory**: Stock changes, item management
- **Billing**: Payment processing, invoice generation
- **Pharmacy**: Medication dispensing, prescription management
- **Telemedicine**: Session logging, consultation records

This comprehensive audit system ensures complete visibility into all system operations while maintaining performance and security standards.