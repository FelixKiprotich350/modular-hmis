# Modular Health System

A production-ready healthcare management system built with NestJS and PostgreSQL, featuring a plug-and-play modular architecture similar to OpenMRS.

## 🚀 Quick Start

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

Visit `http://localhost:3000/health` to verify the system is running.

**Default Login:** admin / admin123

## 📚 Documentation

Comprehensive documentation is available in the `/docs` folder:

- **[📖 Complete Documentation](./docs/README.md)** - Main documentation hub
- **[⚡ Quick Start Guide](./docs/quick-start.md)** - Get running in 5 minutes
- **[🔧 Installation Guide](./docs/installation.md)** - Detailed setup instructions
- **[🏗️ System Architecture](./docs/architecture/overview.md)** - Technical architecture overview
- **[🧩 Module Development](./docs/modules/creating-modules.md)** - Build custom modules
- **[🚀 Production Deployment](./docs/deployment/production.md)** - Deploy to production
- **[👥 User Management](./docs/admin/users.md)** - Manage users and roles
- **[❓ FAQ](./docs/faq.md)** - Common questions and troubleshooting

## 🏥 Features

### Core Healthcare Modules
- **Patient Management** - Registration, demographics, identifiers
- **Provider Management** - Healthcare provider profiles
- **Encounters** - Patient-provider interactions
- **Appointments** - Scheduling and management
- **Observations** - Vital signs and clinical data
- **Forms** - Clinical data collection

### Extended Modules
- **Billing** - Financial management and invoicing
- **Pharmacy** - Prescription and medication management
- **Laboratory** - Lab orders and results
- **Radiology** - Imaging orders and results
- **Telemedicine** - Remote consultations
- **Inventory** - Supply chain management
- **Reports** - Analytics and reporting

### System Features
- **Modular Architecture** - Enable only what you need
- **Role-Based Security** - Fine-grained access control
- **Audit Logging** - Complete activity tracking
- **RESTful APIs** - Integration-ready endpoints
- **Production Ready** - Scalable and secure

## 🛠️ Technology Stack

- **Backend**: NestJS (Node.js/TypeScript)
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT with role-based access control
- **API Documentation**: Swagger/OpenAPI
- **Process Management**: PM2 or systemd
- **Reverse Proxy**: Nginx (production)

## 📋 Requirements

- Node.js 18+
- PostgreSQL 13+
- 4GB RAM (minimum)
- 50GB storage (minimum)

## 🔗 Quick Links

- **API Documentation**: `http://localhost:3000/api/docs`
- **Health Check**: `http://localhost:3000/health`
- **System Status**: `http://localhost:3000/api/system/status`

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](./docs/development/contributing.md) for details.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

- **Documentation**: Check the [docs folder](./docs/README.md)
- **Issues**: Open a GitHub issue
- **Discussions**: Join our community discussions
- **FAQ**: Review [frequently asked questions](./docs/faq.md)