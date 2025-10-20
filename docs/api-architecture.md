# Dual API Architecture: Lightweight Internal + FHIR Compliance

## Overview

The system provides two API layers:
1. **Internal APIs** - Lightweight, optimized for performance and internal use
2. **FHIR APIs** - Standards-compliant for interoperability

## API Endpoints Structure

### Internal APIs (Lightweight)
```
/api/v1/patients              # Full CRUD operations
/api/v1/patients/:id/summary  # Minimal patient data for UI
/api/v1/patients/:id/encounters/recent  # Last 5 encounters
/api/v1/patients/:id/vitals/latest      # Latest vital signs only
```

### FHIR R4 APIs (Standards Compliant)
```
/fhir/Patient                 # FHIR Patient resource
/fhir/Patient/:id             # Individual patient
/fhir/Encounter               # FHIR Encounter resource
/fhir/Observation             # FHIR Observation resource
```

## Performance Comparison

### Internal API Response (Patient Summary)
```json
{
  "id": "123",
  "name": "John Doe",
  "gender": "M",
  "age": 35,
  "primaryId": "PAT001",
  "phone": "+1234567890"
}
```
**Size: ~150 bytes**

### FHIR API Response (Same Patient)
```json
{
  "resourceType": "Patient",
  "id": "123",
  "identifier": [{"use": "usual", "value": "PAT001"}],
  "name": [{"use": "official", "family": "Doe", "given": ["John"]}],
  "gender": "male",
  "birthDate": "1988-01-01",
  "address": [{"use": "home", "line": ["123 Main St"]}]
}
```
**Size: ~400 bytes**

## Implementation Strategy

### 1. Shared Business Logic
- Both APIs use the same service layer
- Single source of truth for data operations
- Consistent validation and business rules

### 2. Response Transformation
- Internal APIs return minimal, UI-optimized data
- FHIR APIs use transformer service for standard compliance
- Lazy loading for related resources

### 3. Caching Strategy
```typescript
// Internal APIs - aggressive caching
@Get(':id/summary')
@CacheKey('patient-summary')
@CacheTTL(300) // 5 minutes

// FHIR APIs - conservative caching
@Get('Patient/:id')
@CacheTTL(60) // 1 minute
```

### 4. Query Optimization
```typescript
// Internal - minimal joins
const patient = await prisma.patient.findUnique({
  where: { id },
  select: {
    id: true,
    person: { select: { firstName: true, lastName: true } }
  }
});

// FHIR - full resource
const patient = await prisma.patient.findUnique({
  where: { id },
  include: { person: true, identifiers: true, addresses: true }
});
```

## Benefits

### For Internal Use
- **Fast**: 60-70% smaller payloads
- **Efficient**: Targeted data for specific UI needs
- **Simple**: Direct field mapping, no transformation overhead

### For Interoperability
- **Standards Compliant**: Full FHIR R4 compatibility
- **Comprehensive**: Complete resource representations
- **Interoperable**: Works with any FHIR-compliant system

## Usage Guidelines

### Use Internal APIs When:
- Building internal dashboards/UIs
- Mobile apps need fast responses
- Real-time updates required
- Bandwidth is limited

### Use FHIR APIs When:
- Integrating with external systems
- Exchanging data with other hospitals
- Compliance requirements mandate FHIR
- Building vendor-agnostic solutions

## Migration Path

1. **Phase 1**: Implement internal APIs for immediate performance gains
2. **Phase 2**: Add FHIR endpoints for specific resources
3. **Phase 3**: Gradually expand FHIR coverage based on integration needs
4. **Phase 4**: Optimize both layers based on usage patterns