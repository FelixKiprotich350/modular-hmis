# Database Setup

## Initial Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Setup environment**:
   Create a `.env` file with your database URL:
   ```
   DATABASE_URL="postgresql://username:password@localhost:5432/health_system"
   JWT_SECRET="your-secret-key"
   ```

3. **Run migrations**:
   ```bash
   npm run migrate
   ```

4. **Generate Prisma client**:
   ```bash
   npm run generate
   ```

5. **Seed the database**:
   ```bash
   npm run seed
   ```

## Default Data

The seed script creates:

### Default User
- **Username**: `admin`
- **Password**: `admin123`
- **Email**: `admin@hospital.com`
- **Role**: `admin`

### Default Roles
- **admin**: Full system access
- **doctor**: Patient and encounter management
- **nurse**: Patient viewing and appointment management

### Default Privileges
- `manage_users` - Create, edit, delete users
- `manage_roles` - Manage roles and privileges
- `view_patients` - View patient information
- `create_patients` - Create new patients
- `edit_patients` - Edit patient information
- `delete_patients` - Delete patients
- `view_encounters` - View patient encounters
- `create_encounters` - Create patient encounters
- `edit_encounters` - Edit patient encounters
- `view_appointments` - View appointments
- `create_appointments` - Create appointments
- `edit_appointments` - Edit appointments

## API Usage

### Authentication
```bash
# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "admin123"}'

# Get current user
curl -X GET http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### User Management
```bash
# Create user
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"username": "doctor1", "email": "doctor1@hospital.com", "password": "password123", "roles": ["doctor"]}'

# List users
curl -X GET http://localhost:3000/api/users \
  -H "Authorization: Bearer YOUR_TOKEN"

# Assign role
curl -X POST http://localhost:3000/api/users/USER_ID/roles \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"role": "doctor"}'
```

### Role & Privilege Management
```bash
# List roles
curl -X GET http://localhost:3000/api/roleprivileges/roles \
  -H "Authorization: Bearer YOUR_TOKEN"

# Create role
curl -X POST http://localhost:3000/api/roleprivileges/roles \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"name": "pharmacist"}'

# List privileges
curl -X GET http://localhost:3000/api/roleprivileges/privileges \
  -H "Authorization: Bearer YOUR_TOKEN"

# Assign privilege to role
curl -X POST http://localhost:3000/api/roleprivileges/roles/ROLE_ID/privileges/PRIVILEGE_ID \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Database Schema

The system uses the following main tables:
- `User` - System users
- `Role` - User roles
- `Privilege` - System privileges
- `UserRole` - Many-to-many relationship between users and roles
- `RolePrivilege` - Many-to-many relationship between roles and privileges

All operations are now persisted to the PostgreSQL database using Prisma ORM.