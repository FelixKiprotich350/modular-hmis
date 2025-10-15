# Swagger/OpenAPI Integration

The Modular Health System now includes comprehensive API documentation using Swagger/OpenAPI.

## Access Points

- **Swagger UI**: http://localhost:3000/api-docs
- **OpenAPI JSON**: http://localhost:3000/api-docs-json
- **API Explorer**: http://localhost:3000/api/api-explorer (redirects to Swagger UI)

## Features

### ✅ Automatic Documentation
- All NestJS controllers are automatically documented
- Interactive API testing interface
- Request/response schemas
- Authentication support (Bearer tokens)

### ✅ Module Integration
- Core system endpoints documented
- Module-specific APIs included
- Consistent API patterns across modules

### ✅ Interactive Testing
- Test API endpoints directly from the browser
- Authentication token support
- Request/response validation

## Usage

1. **Start the application**:
   ```bash
   npm run build
   npm start
   ```

2. **Access Swagger UI**:
   Open http://localhost:3000/api-docs in your browser

3. **Test APIs**:
   - Use the "Try it out" button on any endpoint
   - Add Bearer token for authenticated endpoints
   - View request/response examples

## API Documentation Structure

```
System APIs:
├── GET  /           - Welcome message
├── GET  /health     - Health check
└── GET  /api-docs   - Swagger UI

Module APIs:
├── /api/patients         - Patient management
├── /api/providers        - Healthcare providers
├── /api/appointments     - Appointment scheduling
├── /api/encounters       - Clinical encounters
├── /api/observations     - Clinical observations
├── /api/laboratory       - Lab orders & results
├── /api/radiology        - Imaging orders & reports
├── /api/pharmacy         - Prescriptions & dispensing
├── /api/auth             - Authentication
├── /api/users            - User management
├── /api/billing          - Financial operations
├── /api/insurance        - Insurance management
├── /api/inventory        - Supply chain
├── /api/reports          - Analytics & reporting
├── /api/mobile-clinic    - Mobile operations
└── /api/telemedicine     - Remote consultations
```

## Configuration

The Swagger configuration is minimal and production-ready:

```typescript
const config = new DocumentBuilder()
  .setTitle('Modular Health System API')
  .setDescription('Healthcare management system with modular architecture')
  .setVersion('1.0')
  .addBearerAuth()
  .build();
```

## Benefits

- **Developer Experience**: Interactive API documentation
- **Testing**: Built-in API testing capabilities  
- **Integration**: Easy client SDK generation
- **Compliance**: OpenAPI 3.0 standard compliance
- **Maintenance**: Auto-generated, always up-to-date docs

The Swagger integration provides comprehensive API documentation for all 25 modules with minimal configuration overhead.