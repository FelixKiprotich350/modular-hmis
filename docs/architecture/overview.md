# System Architecture

## Overview

The Modular Health System is built on a microservices-inspired modular architecture that allows for plug-and-play functionality similar to OpenMRS modules.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    Client Applications                       │
│  (Web UI, Mobile Apps, Third-party Integrations)           │
└─────────────────────┬───────────────────────────────────────┘
                      │ HTTP/REST API
┌─────────────────────▼───────────────────────────────────────┐
│                  API Gateway Layer                          │
│  (Authentication, Rate Limiting, Request Routing)          │
└─────────────────────┬───────────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────────┐
│                   Core API Server                          │
│                   (NestJS Application)                     │
│                                                             │
│  ┌─────────────────┬─────────────────┬─────────────────┐   │
│  │   Core System   │  Module Loader  │ Service Registry│   │
│  │   Services      │                 │                 │   │
│  └─────────────────┴─────────────────┴─────────────────┘   │
└─────────────────────┬───────────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────────┐
│                  Module Layer                               │
│                                                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │Core Modules │  │Core Modules │  │Core Modules │        │
│  │- Patients   │  │- Auth       │  │- Encounters │        │
│  │- Providers  │  │- Users      │  │- Observations│       │
│  │- Locations  │  │- Roles      │  │- Forms      │        │
│  └─────────────┘  └─────────────┘  └─────────────┘        │
│                                                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │Custom Mods  │  │Custom Mods  │  │Custom Mods  │        │
│  │- Billing    │  │- Pharmacy   │  │- Telemedicine│       │
│  │- Insurance  │  │- Inventory  │  │- Reports    │        │
│  │- Mobile     │  │- Laboratory │  │- Radiology  │        │
│  └─────────────┘  └─────────────┘  └─────────────┘        │
└─────────────────────┬───────────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────────┐
│                  Data Layer                                 │
│                                                             │
│  ┌─────────────────┐  ┌─────────────────┐                 │
│  │   PostgreSQL    │  │   File Storage  │                 │
│  │   Database      │  │   (Documents)   │                 │
│  └─────────────────┘  └─────────────────┘                 │
└─────────────────────────────────────────────────────────────┘
```

## Key Components

### 1. Core API Server (NestJS)
- **Framework**: NestJS with Express
- **Language**: TypeScript
- **Architecture**: Modular, dependency injection
- **Features**: Decorators, guards, interceptors

### 2. Module System
- **Dynamic Loading**: Modules loaded at runtime
- **Plug-and-Play**: Enable/disable modules without restart
- **Isolation**: Each module has its own routes, services, migrations
- **Dependencies**: Module dependency management

### 3. Database Layer
- **ORM**: Prisma with PostgreSQL
- **Migrations**: Automatic schema management
- **Transactions**: ACID compliance
- **Indexing**: Optimized queries

### 4. Security Layer
- **Authentication**: JWT-based
- **Authorization**: Role-based access control (RBAC)
- **Privileges**: Fine-grained permissions
- **Audit**: Complete activity logging

## Design Principles

### 1. Modularity
- Each module is self-contained
- Clear interfaces between modules
- Minimal coupling, high cohesion

### 2. Scalability
- Horizontal scaling support
- Database connection pooling
- Efficient query patterns

### 3. Maintainability
- Clean code architecture
- Comprehensive testing
- Documentation-driven development

### 4. Security
- Security by design
- Input validation
- SQL injection prevention
- XSS protection

### 5. Extensibility
- Plugin architecture
- Custom module support
- API-first design

## Technology Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| Runtime | Node.js | JavaScript runtime |
| Framework | NestJS | Web application framework |
| Language | TypeScript | Type-safe JavaScript |
| Database | PostgreSQL | Relational database |
| ORM | Prisma | Database access layer |
| Authentication | JWT | Stateless authentication |
| Process Management | PM2/systemd | Production process management |
| Reverse Proxy | Nginx | Load balancing, SSL termination |

## Data Flow

1. **Request**: Client sends HTTP request
2. **Authentication**: JWT token validation
3. **Authorization**: Permission checking
4. **Routing**: Request routed to appropriate module
5. **Processing**: Business logic execution
6. **Database**: Data persistence operations
7. **Response**: JSON response returned
8. **Audit**: Activity logged for compliance

## Module Communication

Modules communicate through:
- **Service Registry**: Shared services
- **Event System**: Asynchronous messaging
- **Database**: Shared data models
- **HTTP APIs**: Inter-module requests

## Performance Considerations

- **Connection Pooling**: Database connections managed efficiently
- **Caching**: Redis for session and data caching
- **Indexing**: Database indexes for common queries
- **Pagination**: Large datasets handled efficiently
- **Compression**: Response compression enabled