# Audit System

## Overview

The audit system automatically captures all user activities and system changes with complete traceability.

## Components

### 1. AuditLog Database Model
```sql
- id: Unique identifier
- userId: User who performed the action (nullable for anonymous actions)
- action: Action performed (e.g., 'LOGIN_SUCCESS', 'CREATE_USER')
- resource: Resource affected (e.g., 'users', 'roles')
- resourceId: ID of the affected resource
- details: JSON object with additional context
- ipAddress: Client IP address
- userAgent: Client user agent
- timestamp: When the action occurred
```

### 2. Automatic Audit Logging
- **AuditInterceptor**: Automatically logs all non-GET HTTP requests
- **Service-level logging**: Manual audit points in critical operations
- **Authentication events**: Login success/failure tracking

## What Gets Audited

### Automatic (via Interceptor)
- All POST, PUT, PATCH, DELETE requests
- User information (if authenticated)
- Request details (method, URL, sanitized body)
- Client information (IP, user agent)
- Response status

### Manual (via Service calls)
- User creation/deletion with context
- Authentication events (login success/failure)
- Role and privilege changes
- Transaction rollbacks

## API Endpoints

### Get Audit Logs (Admin only)
```bash
GET /api/audit/logs?userId=USER_ID&resource=users&startDate=2024-01-01&endDate=2024-12-31
```

### Get User Activity
```bash
GET /api/audit/user-activity
```

### Get Recent Logs
```bash
GET /api/audit/recent
```

## Usage Examples

### View All User Management Activities
```bash
curl -X GET "http://localhost:3000/api/audit/logs?resource=users" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### View Specific User's Activity
```bash
curl -X GET "http://localhost:3000/api/audit/logs?userId=USER_ID" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### View Your Own Activity
```bash
curl -X GET "http://localhost:3000/api/audit/user-activity" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Sample Audit Log Entry
```json
{
  "id": "audit_123",
  "userId": "user_456",
  "action": "CREATE_USER",
  "resource": "users",
  "resourceId": "user_789",
  "details": {
    "username": "newuser",
    "email": "newuser@hospital.com",
    "roles": ["doctor"]
  },
  "ipAddress": "192.168.1.100",
  "userAgent": "Mozilla/5.0...",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

## Security Features

- **Sensitive data filtering**: Passwords and tokens are automatically removed
- **Immutable logs**: Audit logs cannot be modified once created
- **Access control**: Only users with `manage_users` privilege can view all logs
- **User activity**: Users can view their own activity logs

## Database Migration

Run the following to add audit logging:
```bash
npm run migrate
npm run generate
```

The audit system is now active and will automatically capture all activities.