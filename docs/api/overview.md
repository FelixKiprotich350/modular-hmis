# API Overview

## Base Information

- **Base URL**: `http://localhost:3000/api`
- **Protocol**: HTTP/HTTPS
- **Format**: JSON
- **Authentication**: JWT Bearer Token
- **Documentation**: Swagger UI at `/api/docs`

## Authentication

All API endpoints (except login and health checks) require authentication:

```bash
# Login to get token
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "admin123"}'

# Use token in subsequent requests
curl -X GET http://localhost:3000/api/patients \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Response Format

### Success Response
```json
{
  "success": true,
  "data": {
    "id": "patient_123",
    "firstName": "John",
    "lastName": "Doe"
  },
  "message": "Patient retrieved successfully"
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "code": "PATIENT_NOT_FOUND",
    "message": "Patient with ID patient_123 not found",
    "details": {}
  },
  "timestamp": "2024-01-15T10:30:00Z"
}
```

## HTTP Status Codes

| Code | Meaning | Usage |
|------|---------|-------|
| 200 | OK | Successful GET, PUT, PATCH |
| 201 | Created | Successful POST |
| 204 | No Content | Successful DELETE |
| 400 | Bad Request | Invalid request data |
| 401 | Unauthorized | Missing or invalid token |
| 403 | Forbidden | Insufficient privileges |
| 404 | Not Found | Resource not found |
| 409 | Conflict | Resource already exists |
| 422 | Unprocessable Entity | Validation errors |
| 500 | Internal Server Error | Server error |

## Pagination

List endpoints support pagination:

```bash
GET /api/patients?page=1&limit=20&sortBy=lastName&sortOrder=asc
```

Response includes pagination metadata:
```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8,
    "hasNext": true,
    "hasPrev": false
  }
}
```

## Filtering and Search

Most list endpoints support filtering:

```bash
# Filter patients by gender
GET /api/patients?gender=M

# Search patients by name
GET /api/patients?search=john

# Multiple filters
GET /api/patients?gender=F&ageMin=18&ageMax=65
```

## Core API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/profile` - Get current user profile
- `PUT /api/auth/profile` - Update current user profile

### Patient Management
- `GET /api/patients` - List patients
- `POST /api/patients` - Create patient
- `GET /api/patients/:id` - Get patient details
- `PUT /api/patients/:id` - Update patient
- `DELETE /api/patients/:id` - Delete patient
- `POST /api/patients/:id/identifiers` - Add patient identifier

### Provider Management
- `GET /api/providers` - List providers
- `POST /api/providers` - Create provider
- `GET /api/providers/:id` - Get provider details
- `PUT /api/providers/:id` - Update provider

### Encounter Management
- `GET /api/encounters` - List encounters
- `POST /api/encounters` - Create encounter
- `GET /api/encounters/:id` - Get encounter details
- `PUT /api/encounters/:id` - Update encounter

### Appointment Management
- `GET /api/appointments` - List appointments
- `POST /api/appointments` - Schedule appointment
- `GET /api/appointments/:id` - Get appointment details
- `PUT /api/appointments/:id` - Update appointment
- `DELETE /api/appointments/:id` - Cancel appointment

### User Management (Admin)
- `GET /api/users` - List users
- `POST /api/users` - Create user
- `GET /api/users/:id` - Get user details
- `PUT /api/users/:id` - Update user
- `POST /api/users/:id/roles` - Assign roles

### System Management
- `GET /health` - System health check
- `GET /api/audit/logs` - Audit logs (Admin)
- `GET /api/settings` - System settings (Admin)
- `PUT /api/settings` - Update settings (Admin)

## Custom Module Endpoints

### Billing Module
- `GET /api/billing` - List bills
- `POST /api/billing` - Create bill
- `GET /api/billing/:id` - Get bill details
- `PUT /api/billing/:id/pay` - Process payment

### Pharmacy Module
- `GET /api/pharmacy/prescriptions` - List prescriptions
- `POST /api/pharmacy/prescriptions` - Create prescription
- `PUT /api/pharmacy/prescriptions/:id/dispense` - Dispense medication

### Inventory Module
- `GET /api/inventory` - List inventory items
- `POST /api/inventory` - Add inventory item
- `PUT /api/inventory/:id/stock` - Update stock levels

### Telemedicine Module
- `GET /api/telemedicine/sessions` - List sessions
- `POST /api/telemedicine/sessions` - Schedule session
- `PUT /api/telemedicine/sessions/:id/start` - Start session

## Rate Limiting

API requests are rate-limited:
- **Authenticated users**: 1000 requests/hour
- **Anonymous users**: 100 requests/hour
- **Admin users**: 5000 requests/hour

Rate limit headers are included in responses:
```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1642694400
```

## CORS

Cross-Origin Resource Sharing (CORS) is enabled for:
- `http://localhost:3000` (development)
- Configured domains in production

## API Versioning

The API uses URL versioning with `/api/v{version}` format:
- **Current version**: `v1` (default)
- **Available versions**: `v1`, `v2`
- **Default**: If no version specified, `v1` is used

```bash
# Version 1 (default)
GET /api/v1/patients

# Version 2 (enhanced features)
GET /api/v2/patients

# Without version (defaults to v1)
GET /api/patients  # Redirects to /api/v1/patients
```

### Version Differences

**V1 Features:**
- Basic CRUD operations
- Simple response format
- Standard error handling

**V2 Features:**
- Enhanced pagination with metadata
- Computed fields (age, fullName)
- Enriched response format
- Additional validation
- QR code generation

## WebSocket Support

Real-time features use WebSocket connections:
- **Endpoint**: `ws://localhost:3000/ws`
- **Authentication**: JWT token in connection params
- **Events**: Patient updates, appointment notifications, system alerts

## SDK and Client Libraries

Official SDKs available for:
- JavaScript/TypeScript
- Python
- Java
- C#

## Testing

Use the interactive API documentation at `/api/docs` to test endpoints, or use tools like:
- Postman
- Insomnia
- curl
- HTTPie