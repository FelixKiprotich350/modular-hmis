# User Management

## Overview

The user management system provides comprehensive tools for managing user accounts, roles, and permissions in the Modular Health System.

## User Roles

### Default Roles

| Role | Description | Default Privileges |
|------|-------------|-------------------|
| **System Administrator** | Full system access | All privileges |
| **Doctor** | Medical practitioners | Patient care, prescriptions, encounters |
| **Nurse** | Nursing staff | Patient care, observations, basic encounters |
| **Receptionist** | Front desk staff | Appointments, patient registration |
| **Pharmacist** | Pharmacy staff | Prescriptions, drug management |
| **Lab Technician** | Laboratory staff | Lab orders, results |
| **Billing Clerk** | Financial staff | Billing, payments, insurance |

### Role Hierarchy
```
System Administrator
├── Doctor
│   ├── Nurse
│   └── Pharmacist
├── Receptionist
└── Billing Clerk
    └── Lab Technician
```

## User Management API

### Create User
```bash
POST /api/users
Content-Type: application/json
Authorization: Bearer <admin_token>

{
  "username": "dr.smith",
  "email": "dr.smith@hospital.com",
  "password": "SecurePassword123!",
  "firstName": "John",
  "lastName": "Smith",
  "roles": ["doctor"]
}
```

### List Users
```bash
GET /api/users?page=1&limit=20&role=doctor&active=true
Authorization: Bearer <admin_token>
```

### Update User
```bash
PUT /api/users/user_123
Content-Type: application/json
Authorization: Bearer <admin_token>

{
  "firstName": "John",
  "lastName": "Smith",
  "email": "john.smith@hospital.com",
  "active": true
}
```

### Assign Roles
```bash
POST /api/users/user_123/roles
Content-Type: application/json
Authorization: Bearer <admin_token>

{
  "roles": ["doctor", "department_head"]
}
```

### Reset Password
```bash
POST /api/users/user_123/reset-password
Content-Type: application/json
Authorization: Bearer <admin_token>

{
  "newPassword": "NewSecurePassword123!",
  "forceChange": true
}
```

## Role Management

### Create Custom Role
```bash
POST /api/roles
Content-Type: application/json
Authorization: Bearer <admin_token>

{
  "name": "Department Head",
  "description": "Department management role",
  "privileges": [
    "View Patients",
    "Create Patients",
    "Edit Patients",
    "View Reports",
    "Manage Department Users"
  ]
}
```

### Update Role Privileges
```bash
PUT /api/roles/role_123/privileges
Content-Type: application/json
Authorization: Bearer <admin_token>

{
  "privileges": [
    "View Patients",
    "Create Patients",
    "Edit Patients",
    "Delete Patients",
    "View Reports",
    "Create Reports"
  ]
}
```

## Privilege System

### Core Privileges

#### Patient Management
- `View Patients` - View patient information
- `Create Patients` - Register new patients
- `Edit Patients` - Update patient information
- `Delete Patients` - Remove patient records
- `Merge Patients` - Merge duplicate patient records

#### Provider Management
- `View Providers` - View provider information
- `Create Providers` - Add new providers
- `Edit Providers` - Update provider information
- `Delete Providers` - Remove provider records

#### Encounter Management
- `View Encounters` - View patient encounters
- `Create Encounters` - Create new encounters
- `Edit Encounters` - Update encounter information
- `Delete Encounters` - Remove encounter records

#### User Management
- `View Users` - View user accounts
- `Create Users` - Create new user accounts
- `Edit Users` - Update user information
- `Delete Users` - Remove user accounts
- `Manage Roles` - Assign/remove user roles
- `Reset Passwords` - Reset user passwords

#### System Administration
- `System Settings` - Modify system configuration
- `View Audit Logs` - Access audit trail
- `Manage Modules` - Enable/disable modules
- `Database Backup` - Perform database backups

#### Clinical Privileges
- `Prescribe Medications` - Write prescriptions
- `Order Lab Tests` - Order laboratory tests
- `Order Radiology` - Order radiology studies
- `View Lab Results` - Access lab results
- `View Radiology Results` - Access radiology results

#### Financial Privileges
- `View Billing` - View billing information
- `Create Bills` - Generate bills
- `Process Payments` - Process patient payments
- `Manage Insurance` - Handle insurance claims

### Custom Privileges
Modules can define their own privileges:
```typescript
// In module registration
await ctx.registerPrivileges([
  'View Telemedicine Sessions',
  'Create Telemedicine Sessions',
  'Manage Video Calls'
]);
```

## User Account Lifecycle

### 1. Account Creation
```bash
# Create user account
curl -X POST http://localhost:3000/api/users \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "nurse.jane",
    "email": "jane@hospital.com",
    "password": "TempPassword123!",
    "firstName": "Jane",
    "lastName": "Doe",
    "roles": ["nurse"],
    "forcePasswordChange": true
  }'
```

### 2. First Login
- User logs in with temporary password
- System forces password change
- User sets new secure password

### 3. Role Assignment
```bash
# Assign additional roles
curl -X POST http://localhost:3000/api/users/user_123/roles \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"roles": ["nurse", "shift_supervisor"]}'
```

### 4. Account Deactivation
```bash
# Deactivate user account
curl -X PUT http://localhost:3000/api/users/user_123 \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"active": false}'
```

## Security Features

### Password Policy
- Minimum 8 characters
- Must contain uppercase, lowercase, number, and special character
- Cannot reuse last 5 passwords
- Expires every 90 days (configurable)
- Account locked after 5 failed attempts

### Session Management
- JWT tokens with configurable expiration
- Automatic logout after inactivity
- Concurrent session limits
- Device tracking and management

### Two-Factor Authentication (2FA)
```bash
# Enable 2FA for user
POST /api/users/user_123/2fa/enable
Authorization: Bearer <user_token>

# Verify 2FA setup
POST /api/users/user_123/2fa/verify
{
  "token": "123456"
}
```

## Bulk Operations

### Import Users from CSV
```bash
POST /api/users/import
Content-Type: multipart/form-data
Authorization: Bearer <admin_token>

# CSV format:
# username,email,firstName,lastName,roles
# dr.smith,smith@hospital.com,John,Smith,doctor
# nurse.jane,jane@hospital.com,Jane,Doe,nurse
```

### Export Users
```bash
GET /api/users/export?format=csv&role=doctor
Authorization: Bearer <admin_token>
```

### Bulk Role Assignment
```bash
POST /api/users/bulk-assign-roles
Content-Type: application/json
Authorization: Bearer <admin_token>

{
  "userIds": ["user_123", "user_456", "user_789"],
  "roles": ["department_head"]
}
```

## User Profile Management

### Self-Service Profile Updates
```bash
# Users can update their own profile
PUT /api/auth/profile
Authorization: Bearer <user_token>
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Smith",
  "email": "john.smith@hospital.com",
  "phone": "+1-555-0123",
  "preferences": {
    "language": "en",
    "timezone": "America/New_York",
    "notifications": {
      "email": true,
      "sms": false
    }
  }
}
```

### Change Password
```bash
POST /api/auth/change-password
Authorization: Bearer <user_token>
Content-Type: application/json

{
  "currentPassword": "OldPassword123!",
  "newPassword": "NewPassword123!"
}
```

## Audit and Compliance

### User Activity Tracking
All user activities are automatically logged:
- Login/logout events
- Password changes
- Role assignments
- Profile updates
- Data access and modifications

### Compliance Reports
```bash
# Get user access report
GET /api/audit/user-access-report?startDate=2024-01-01&endDate=2024-01-31
Authorization: Bearer <admin_token>

# Get role assignment history
GET /api/audit/role-assignments?userId=user_123
Authorization: Bearer <admin_token>
```

## Integration with External Systems

### LDAP/Active Directory
```javascript
// Configure LDAP authentication
{
  "auth": {
    "ldap": {
      "enabled": true,
      "server": "ldap://company.com",
      "baseDN": "dc=company,dc=com",
      "userDN": "cn=users,dc=company,dc=com",
      "groupDN": "cn=groups,dc=company,dc=com",
      "roleMapping": {
        "Doctors": "doctor",
        "Nurses": "nurse",
        "Administrators": "admin"
      }
    }
  }
}
```

### Single Sign-On (SSO)
```javascript
// Configure SAML SSO
{
  "auth": {
    "saml": {
      "enabled": true,
      "entryPoint": "https://sso.company.com/saml/login",
      "issuer": "health-system",
      "cert": "-----BEGIN CERTIFICATE-----...",
      "roleAttribute": "Role"
    }
  }
}
```

## Best Practices

### User Account Management
1. **Principle of Least Privilege**: Grant minimum necessary permissions
2. **Regular Access Reviews**: Quarterly review of user roles and permissions
3. **Automated Deprovisioning**: Remove access when employees leave
4. **Strong Authentication**: Enforce strong passwords and 2FA
5. **Session Management**: Implement appropriate session timeouts

### Role Design
1. **Role-Based Access Control**: Use roles instead of individual permissions
2. **Separation of Duties**: Ensure critical functions require multiple people
3. **Regular Role Reviews**: Periodically review and update role definitions
4. **Documentation**: Maintain clear documentation of role purposes

### Security Monitoring
1. **Failed Login Monitoring**: Alert on multiple failed login attempts
2. **Privilege Escalation Detection**: Monitor for unusual privilege changes
3. **Access Pattern Analysis**: Identify unusual access patterns
4. **Regular Security Audits**: Conduct periodic security assessments

## Troubleshooting

### Common Issues

1. **User Cannot Login**
   - Check account status (active/inactive)
   - Verify password hasn't expired
   - Check for account lockout
   - Validate role assignments

2. **Permission Denied Errors**
   - Verify user has required privileges
   - Check role assignments
   - Validate module-specific permissions

3. **Password Reset Issues**
   - Verify admin privileges for password reset
   - Check password policy compliance
   - Validate email configuration for reset links

4. **Role Assignment Problems**
   - Verify admin has role management privileges
   - Check for role dependency conflicts
   - Validate role exists and is active