# Database Transactions

## Overview

The system now supports database transactions for atomicity across single and multiple services.

## Implementation

### TransactionService
```typescript
await transactionService.executeTransaction(async (tx) => {
  // All operations use tx instead of db
  await service1.operation(data, tx);
  await service2.operation(data, tx);
});
```

### Service Methods with Transaction Support
All service methods now accept optional `tx` parameter:
```typescript
async createUser(data: CreateUserRequest, tx?: any): Promise<User>
async assignRole(userId: string, roleName: string, tx?: any): Promise<boolean>
```

## Usage Examples

### Single Service Transaction
```typescript
// Create user with multiple roles atomically
const user = await userService.createUserWithRoles(userData, ['doctor', 'admin']);
```

### Cross-Service Transaction
```typescript
// Setup user with custom role and privileges
const result = await userManagementService.setupUserWithCustomRole(
  { username: 'specialist', email: 'spec@hospital.com', password: 'pass123' },
  { roleName: 'specialist', privilegeIds: ['priv1', 'priv2'] }
);
```

## New Endpoints

### Transactional User Creation
```bash
POST /api/users/with-roles
{
  "username": "doctor1",
  "email": "doctor1@hospital.com", 
  "password": "password123",
  "roles": ["doctor", "researcher"]
}
```

### Transactional Role Creation
```bash
POST /api/roleprivileges/roles-with-privileges
{
  "name": "specialist",
  "privilegeIds": ["privilege_id_1", "privilege_id_2"]
}
```

## Benefits

1. **Atomicity**: All operations succeed or all fail
2. **Consistency**: Database remains in valid state
3. **Isolation**: Concurrent transactions don't interfere
4. **Durability**: Committed changes are permanent

## Error Handling

If any operation in a transaction fails, all changes are automatically rolled back:
```typescript
try {
  const result = await prisma.$transaction(async (tx) => {
    await operation1(tx); // Success
    await operation2(tx); // Fails - entire transaction rolls back
  });
} catch (error) {
  // Handle rollback
}
```