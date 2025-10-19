# Quick Start Guide

Get the Modular Health System running in 5 minutes.

## 1. Install and Setup

```bash
# Install dependencies
npm install

# Setup database (update DATABASE_URL in .env first)
npx prisma migrate dev
npx prisma generate
npm run seed

# Start development server
npm run dev
```

## 2. Test the System

### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "admin123"}'
```

Save the returned JWT token for subsequent requests.

### Create a Patient
```bash
curl -X POST http://localhost:3000/api/patients \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "gender": "M",
    "birthdate": "1990-01-01"
  }'
```

### List Patients
```bash
curl -X GET http://localhost:3000/api/patients \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 3. Explore the API

Visit `http://localhost:3000/api/docs` for interactive API documentation.

## 4. Key Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/login` | POST | User authentication |
| `/api/patients` | GET/POST | Patient management |
| `/api/providers` | GET/POST | Healthcare provider management |
| `/api/encounters` | GET/POST | Patient encounters |
| `/api/appointments` | GET/POST | Appointment scheduling |
| `/health` | GET | System health check |

## 5. Default Users

| Username | Password | Role |
|----------|----------|------|
| admin | admin123 | System Administrator |
| doctor | doctor123 | Doctor |
| nurse | nurse123 | Nurse |

## 6. Module System

The system uses a modular architecture. Core modules are in `src/modules/core/` and custom modules in `src/modules/custom/`.

### Available Modules

**Core Modules:**
- Patients, Providers, Encounters
- Authentication, Users, Roles
- Appointments, Observations
- Forms, Concepts, Locations

**Custom Modules:**
- Billing, Pharmacy, Inventory
- Telemedicine, Mobile Clinic
- Reports, Insurance

## Next Steps

- [API Documentation](./api/overview.md)
- [Module Development](./modules/creating-modules.md)
- [Production Deployment](./deployment/production.md)