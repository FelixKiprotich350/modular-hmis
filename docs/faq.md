# Frequently Asked Questions (FAQ)

## General Questions

### What is the Modular Health System?
The Modular Health System is a production-ready healthcare management system built with NestJS and PostgreSQL. It features a plug-and-play modular architecture similar to OpenMRS, allowing healthcare facilities to customize their system by enabling only the modules they need.

### What makes it "modular"?
The system is built around independent modules that can be enabled, disabled, or customized without affecting other parts of the system. Each module has its own:
- Database models and migrations
- API endpoints and business logic
- Security privileges and permissions
- Configuration settings

### Is this system suitable for production use?
Yes, the system is designed for production environments with:
- Comprehensive security features (JWT authentication, RBAC, audit logging)
- Scalable architecture with database connection pooling
- Process management with PM2 or systemd
- Production deployment guides and monitoring

## Installation and Setup

### What are the system requirements?
**Minimum Requirements:**
- Node.js v18+
- PostgreSQL v13+
- 4GB RAM
- 50GB storage

**Recommended:**
- Node.js v20+
- PostgreSQL v15+
- 8GB+ RAM
- 100GB+ SSD storage

### How do I install the system?
1. Clone the repository
2. Install dependencies: `npm install`
3. Setup PostgreSQL database
4. Configure environment variables in `.env`
5. Run migrations: `npx prisma migrate dev`
6. Seed initial data: `npm run seed`
7. Start the application: `npm run dev`

See the [Installation Guide](./installation.md) for detailed instructions.

### What's included in the initial seed data?
- Default admin user (username: admin, password: admin123)
- Basic roles (Admin, Doctor, Nurse, Receptionist, etc.)
- Core privileges and permissions
- Sample locations and settings
- Test patient data (in development mode)

### Can I use a different database?
Currently, the system is optimized for PostgreSQL. While Prisma supports other databases (MySQL, SQLite, SQL Server), you would need to:
- Update the Prisma schema
- Modify database-specific queries
- Test all functionality thoroughly

## Module System

### How do I enable/disable modules?
Modules can be controlled through:
1. **Configuration files**: Update `enabled: true/false` in module.json
2. **API endpoints**: Use the module management API (admin only)
3. **Environment variables**: Set module-specific environment flags

### Can I create custom modules?
Yes! The system is designed for extensibility. See the [Creating Modules Guide](./modules/creating-modules.md) for step-by-step instructions.

### What's the difference between core and custom modules?
- **Core modules**: Essential healthcare functionality (patients, providers, encounters)
- **Custom modules**: Extended features (billing, pharmacy, telemedicine)

Core modules are typically required, while custom modules are optional based on your needs.

### How do modules communicate with each other?
Modules communicate through:
- **Service Registry**: Shared services between modules
- **Event System**: Asynchronous messaging
- **Database**: Shared data models and relationships
- **HTTP APIs**: Direct API calls between modules

## Security and Authentication

### How does authentication work?
The system uses JWT (JSON Web Tokens) for authentication:
1. User logs in with username/password
2. System returns JWT token
3. Token must be included in all API requests
4. Tokens expire after configured time (default: 24 hours)

### What is the role-based access control system?
The system implements RBAC with:
- **Users**: Individual user accounts
- **Roles**: Groups of privileges (Doctor, Nurse, Admin, etc.)
- **Privileges**: Specific permissions (View Patients, Create Encounters, etc.)
- **Modules**: Can define their own privileges

### How do I reset a user's password?
Administrators can reset passwords through:
```bash
POST /api/users/{userId}/reset-password
{
  "newPassword": "NewPassword123!",
  "forceChange": true
}
```

### Is two-factor authentication supported?
Yes, 2FA can be enabled per user or enforced system-wide. Supported methods:
- TOTP (Time-based One-Time Password) apps like Google Authenticator
- SMS-based codes (requires Twilio configuration)

## API and Integration

### Is there API documentation?
Yes, interactive API documentation is available at `/api/docs` when the application is running. It's built with Swagger/OpenAPI.

### How do I integrate with external systems?
The system provides:
- **REST APIs**: Standard HTTP/JSON APIs for all functionality
- **Webhooks**: Event notifications for external systems
- **FHIR support**: Healthcare interoperability standard (planned)
- **HL7 integration**: Healthcare messaging standard (planned)

### What's the API rate limiting?
Default rate limits:
- Authenticated users: 1000 requests/hour
- Anonymous users: 100 requests/hour
- Admin users: 5000 requests/hour

Limits are configurable and can be adjusted per environment.

### Can I use this system as a backend for mobile apps?
Absolutely! The system is API-first and designed to support:
- Web applications
- Mobile apps (iOS/Android)
- Third-party integrations
- Microservices architectures

## Data Management

### How is patient data stored and secured?
Patient data is:
- Stored in PostgreSQL with encryption at rest
- Transmitted over HTTPS with TLS encryption
- Access-controlled through role-based permissions
- Fully audited with activity logging
- Compliant with healthcare data protection standards

### Can I import existing patient data?
Yes, the system supports data import through:
- CSV import APIs for bulk data
- Individual API calls for single records
- Custom migration scripts for complex data transformations

### How does the audit system work?
The audit system automatically logs:
- All user activities (login, data access, modifications)
- System events (module loading, configuration changes)
- Security events (failed logins, privilege changes)
- API requests and responses

Audit logs are immutable and retained for compliance requirements.

### What backup and recovery options are available?
- **Database backups**: Automated PostgreSQL dumps
- **File backups**: Document and image storage
- **Point-in-time recovery**: Transaction log backups
- **Disaster recovery**: Multi-region deployment support

## Performance and Scaling

### How many concurrent users can the system handle?
Performance depends on hardware and configuration, but typical deployments handle:
- **Small clinic**: 10-50 concurrent users
- **Medium hospital**: 100-500 concurrent users
- **Large hospital**: 500+ concurrent users (with proper scaling)

### Can the system be scaled horizontally?
Yes, the system supports horizontal scaling through:
- **Load balancing**: Multiple application instances behind a load balancer
- **Database clustering**: PostgreSQL read replicas and clustering
- **Caching**: Redis for session and data caching
- **CDN**: Content delivery networks for static assets

### What are the performance optimization features?
- Database connection pooling
- Query optimization and indexing
- Response compression
- Caching strategies
- Lazy loading of modules and data

## Deployment and Operations

### What deployment options are available?
- **Traditional servers**: PM2 or systemd process management
- **Docker containers**: Containerized deployment (planned)
- **Cloud platforms**: AWS, Azure, Google Cloud
- **Kubernetes**: Container orchestration (planned)

### How do I monitor the system in production?
Built-in monitoring includes:
- Health check endpoints
- Application metrics
- Database performance monitoring
- Error tracking and alerting
- Audit log analysis

Integration with external monitoring tools like New Relic, DataDog, or Prometheus is supported.

### How do I update the system?
Updates can be performed through:
1. **Code updates**: Git pull and rebuild
2. **Database migrations**: Automatic schema updates
3. **Module updates**: Individual module upgrades
4. **Zero-downtime deployments**: Rolling updates with load balancers

## Troubleshooting

### The application won't start. What should I check?
1. **Environment variables**: Verify all required variables are set
2. **Database connection**: Test PostgreSQL connectivity
3. **Dependencies**: Run `npm install` to ensure all packages are installed
4. **Ports**: Ensure the configured port is available
5. **Logs**: Check application logs for specific error messages

### I'm getting "Permission Denied" errors. How do I fix this?
1. **Check user roles**: Verify the user has appropriate roles assigned
2. **Verify privileges**: Ensure the role has required privileges
3. **Module status**: Confirm the relevant module is enabled
4. **Token validity**: Check if the JWT token is valid and not expired

### Database migrations are failing. What should I do?
1. **Check database connectivity**: Verify PostgreSQL is running and accessible
2. **Review migration files**: Look for syntax errors in SQL files
3. **Check permissions**: Ensure database user has necessary privileges
4. **Manual migration**: Run migrations manually to identify specific issues

### How do I enable debug logging?
Set the environment variable:
```env
LOG_LEVEL=debug
```

Or update the system settings through the API:
```bash
PUT /api/settings/logging.level
{
  "value": "debug"
}
```

## Customization and Development

### Can I modify the existing modules?
Yes, but we recommend:
1. **Fork the repository**: Maintain your own version
2. **Create custom modules**: Extend functionality without modifying core
3. **Use configuration**: Customize behavior through settings
4. **Document changes**: Keep track of modifications for updates

### How do I contribute to the project?
1. Fork the repository
2. Create a feature branch
3. Make your changes with tests
4. Submit a pull request
5. Follow the contribution guidelines

See the [Contributing Guide](./development/contributing.md) for details.

### Is commercial support available?
Community support is available through:
- GitHub issues and discussions
- Documentation and guides
- Community forums

For commercial support, training, or custom development, contact the project maintainers.

## Compliance and Standards

### Is the system HIPAA compliant?
The system includes features that support HIPAA compliance:
- Data encryption at rest and in transit
- Access controls and audit logging
- User authentication and authorization
- Data backup and recovery

However, HIPAA compliance also depends on operational procedures and policies that must be implemented by the healthcare organization.

### What healthcare standards are supported?
Current and planned support includes:
- **HL7 FHIR**: Healthcare interoperability (planned)
- **ICD-10**: Medical coding system
- **SNOMED CT**: Clinical terminology (planned)
- **LOINC**: Laboratory data (planned)

### Can I use this system internationally?
Yes, the system is designed for international use with:
- Multi-language support (i18n)
- Configurable date/time formats
- Currency and tax configuration
- Regulatory compliance features

However, specific healthcare regulations vary by country and must be evaluated for each deployment.