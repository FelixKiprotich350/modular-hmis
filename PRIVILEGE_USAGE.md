# Privilege and Role System Usage

## Overview
The system implements role-based access control (RBAC) with:
- **Users** have **Roles**
- **Roles** have **Privileges**
- **Routes** require specific **Privileges**

## Middleware Usage

### Require Authentication Only
```typescript
router.get('/public-data', authenticateToken, async (req, res) => {
  // Only requires valid JWT token
});
```

### Require Specific Privileges
```typescript
// Require ALL specified privileges
router.get('/users', authenticateToken, requirePrivileges(['View Users']), async (req, res) => {
  // User must have 'View Users' privilege
});

// Require ANY of the specified privileges
router.get('/data', authenticateToken, requirePrivileges(['View Data', 'Admin Access'], false), async (req, res) => {
  // User needs either 'View Data' OR 'Admin Access'
});
```

### Require Specific Roles
```typescript
router.post('/admin-action', authenticateToken, requireRole(['Administrator']), async (req, res) => {
  // Only users with Administrator role can access
});
```

## API Endpoints

### User Management
- `POST /api/users/register` - Register new user (no auth required)
- `GET /api/users` - List users (requires 'View Users' privilege)
- `GET /api/users/:id` - Get user (requires 'View Users' privilege)
- `POST /api/users/:id/roles` - Assign role (requires 'Manage Users' privilege)
- `DELETE /api/users/:id/roles/:roleName` - Remove role (requires 'Manage Users' privilege)
- `GET /api/users/:id/privileges` - Get user privileges (requires 'View Users' privilege)

### Authentication
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `POST /api/auth/validate` - Validate token

## Example Usage

### 1. Register and Setup User
```bash
# Register user
curl -X POST http://localhost:3000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{"username":"doctor1","email":"doctor@hospital.com","password":"password123"}'

# Login to get token
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"doctor1","password":"password123"}'

# Assign Doctor role (requires admin privileges)
curl -X POST http://localhost:3000/api/users/USER_ID/roles \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"roleName":"Doctor"}'
```

### 2. Access Protected Resources
```bash
# Access users list (requires 'View Users' privilege)
curl -H "Authorization: Bearer DOCTOR_TOKEN" \
  http://localhost:3000/api/users

# Check user's privileges
curl -H "Authorization: Bearer TOKEN" \
  http://localhost:3000/api/users/USER_ID/privileges
```

## Default Roles and Privileges

### Roles
- **Administrator**: Full system access
- **Doctor**: Patient management, clinical data
- **Nurse**: Patient care, limited clinical data
- **Receptionist**: Patient registration, appointments
- **Pharmacist**: Medication management
- **Lab Technician**: Laboratory data

### Key Privileges
- `System Administration` - Full system control
- `Manage Users` - Create/edit/delete users and roles
- `View Users` - View user information
- `View Patients` - Access patient data
- `Create Patients` - Register new patients
- `Edit Patients` - Modify patient information

## Audit Logging
All privilege checks are automatically logged:
- Successful access
- Failed authorization attempts
- Role assignments/removals
- Login/logout events

Check audit logs at `/api/audit/logs` with appropriate privileges.