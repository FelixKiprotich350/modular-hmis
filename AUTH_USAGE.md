# Authentication & Authorization Usage

## Overview

The system now has complete authentication and authorization using:
- **AuthGuard**: Validates JWT tokens
- **PrivilegeGuard**: Checks user privileges
- **@Privileges()**: Decorator to specify required privileges

## Testing Authentication

1. **Login to get token**:
   ```bash
   curl -X POST http://localhost:3000/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"username": "admin", "password": "admin123"}'
   ```

2. **Use token in subsequent requests**:
   ```bash
   curl -X GET http://localhost:3000/api/users \
     -H "Authorization: Bearer YOUR_JWT_TOKEN"
   ```

## Protected Endpoints

All endpoints now require authentication and specific privileges:

### Users Management (requires `manage_users` privilege)
- `GET /api/users` - List users
- `POST /api/users` - Create user
- `GET /api/users/:id` - Get user
- `PATCH /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user
- `POST /api/users/:id/roles` - Assign role
- `DELETE /api/users/:id/roles/:role` - Remove role

### Role & Privilege Management (requires `manage_roles` privilege)
- `GET /api/roleprivileges/roles` - List roles
- `POST /api/roleprivileges/roles` - Create role
- `GET /api/roleprivileges/privileges` - List privileges
- `POST /api/roleprivileges/privileges` - Create privilege
- `POST /api/roleprivileges/roles/:roleId/privileges/:privilegeId` - Assign privilege
- `DELETE /api/roleprivileges/roles/:roleId/privileges/:privilegeId` - Remove privilege

### Public Endpoints (no authentication required)
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout

### Protected Endpoints (authentication only)
- `GET /api/auth/me` - Get current user info

## Swagger UI

Visit `http://localhost:3000/api-docs` to test endpoints:
1. Click "Authorize" button
2. Enter: `Bearer YOUR_JWT_TOKEN`
3. Test protected endpoints

## Default Privileges

- **admin role**: Has all privileges
- **doctor role**: `view_patients`, `create_patients`, `edit_patients`, `view_encounters`, `create_encounters`, `edit_encounters`
- **nurse role**: `view_patients`, `view_encounters`, `view_appointments`, `create_appointments`, `edit_appointments`

## Error Responses

- **401 Unauthorized**: Missing or invalid token
- **403 Forbidden**: Insufficient privileges
- **500 Internal Server Error**: Service unavailable

## Adding Protection to New Endpoints

```typescript
@Controller('api/example')
@UseGuards(AuthGuard, PrivilegeGuard)
@ApiBearerAuth()
export class ExampleController {
  
  @Get()
  @Privileges('view_patients')  // Requires this privilege
  async getExample() {
    return { message: 'Protected endpoint' };
  }
}
```