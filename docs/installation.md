# Installation Guide

## Prerequisites

- **Node.js**: v18 or higher
- **PostgreSQL**: v13 or higher
- **npm**: v8 or higher

## Installation Steps

### 1. Clone and Install Dependencies

```bash
git clone <repository-url>
cd modular-health-system
npm install
```

### 2. Database Setup

Create a PostgreSQL database:
```sql
CREATE DATABASE health_system;
CREATE USER health_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE health_system TO health_user;
```

### 3. Environment Configuration

Create `.env` file:
```env
DATABASE_URL="postgresql://health_user:your_password@localhost:5432/health_system"
JWT_SECRET="your-super-secret-jwt-key"
PORT=3000
NODE_ENV=development
```

### 4. Database Migration

```bash
npx prisma migrate dev
npx prisma generate
```

### 5. Seed Initial Data

```bash
npm run seed
```

This creates:
- Default admin user (admin/admin123)
- Basic roles and privileges
- Sample data for testing

### 6. Build and Start

```bash
npm run build
npm start
```

Or for development:
```bash
npm run dev
```

## Verification

1. **Health Check**: Visit `http://localhost:3000/health`
2. **API Documentation**: Visit `http://localhost:3000/api/docs`
3. **Login Test**: POST to `/api/auth/login` with admin credentials

## Next Steps

- [Quick Start Guide](./quick-start.md)
- [Configuration Options](./configuration.md)
- [Module Development](./modules/creating-modules.md)