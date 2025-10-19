# Modular Health System Documentation

A production-ready, modular healthcare system built with NestJS and PostgreSQL.

## Documentation Structure

### Getting Started
- [Installation Guide](./installation.md) - Setup and installation instructions
- [Quick Start](./quick-start.md) - Get up and running in minutes
- [Configuration](./configuration.md) - Environment and system configuration

### Architecture
- [System Architecture](./architecture/overview.md) - High-level system design
- [Module System](./architecture/modules.md) - How the modular system works
- [Database Design](./architecture/database.md) - Database schema and relationships
- [Security Architecture](./architecture/security.md) - Authentication and authorization

### API Documentation
- [API Overview](./api/overview.md) - REST API introduction
- [Authentication](./api/authentication.md) - Login and token management
- [Core Modules](./api/core-modules.md) - Patient, Provider, Encounter APIs
- [Custom Modules](./api/custom-modules.md) - Billing, Pharmacy, Telemedicine APIs

### Module Development
- [Creating Modules](./modules/creating-modules.md) - Build your own modules
- [Module Structure](./modules/structure.md) - File organization and conventions
- [Module Lifecycle](./modules/lifecycle.md) - Installation, enabling, and management
- [Core Modules Reference](./modules/core-modules.md) - Built-in module documentation
- [Custom Modules Reference](./modules/custom-modules.md) - Extended functionality modules

### Deployment
- [Production Deployment](./deployment/production.md) - Deploy to production
- [Docker Deployment](./deployment/docker.md) - Containerized deployment
- [Process Management](./deployment/process-management.md) - PM2 and systemd setup
- [Monitoring](./deployment/monitoring.md) - Health checks and logging

### Administration
- [User Management](./admin/users.md) - Managing users and roles
- [System Settings](./admin/settings.md) - Configuration management
- [Audit System](./admin/audit.md) - Activity tracking and compliance
- [Backup & Recovery](./admin/backup.md) - Data protection strategies

### Development
- [Development Setup](./development/setup.md) - Local development environment
- [Testing](./development/testing.md) - Testing strategies and tools
- [Contributing](./development/contributing.md) - How to contribute to the project
- [Troubleshooting](./development/troubleshooting.md) - Common issues and solutions

## Quick Links

- **API Base URL**: `http://localhost:3000/api`
- **Health Check**: `GET /health`
- **Swagger Documentation**: `http://localhost:3000/api/docs`
- **Admin Panel**: `http://localhost:3000/admin`

## Support

For questions and support:
- Check the [Troubleshooting Guide](./development/troubleshooting.md)
- Review the [FAQ](./faq.md)
- Open an issue on GitHub