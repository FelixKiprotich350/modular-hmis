# Provider Module Consolidation

## ✅ Combined Provider and Provider-Management Modules

### 🏥 Unified Provider Module
**Purpose**: Comprehensive healthcare provider management with extended qualifications and role assignments

#### Enhanced Features
- **Person-Based Structure**: Providers linked to person records
- **Provider Attributes**: Extensible attributes (license numbers, certifications, specialties)
- **Role Management**: Assign providers to roles (Doctor, Nurse, Pharmacist, Lab Tech)
- **Location Assignments**: Link providers to specific locations/departments
- **Provider Search**: Find providers by name, identifier, role, or location
- **Retirement Management**: Retire providers with reasons

#### Consolidated API Endpoints
```
POST /api/providers - Create provider with person data
GET /api/providers/search?q=query - Search providers
GET /api/providers/roles - Get available provider roles
GET /api/providers/by-role/:roleId - Get providers by role
GET /api/providers/by-location/:locationId - Get providers by location
GET /api/providers/:id/attributes - Get provider attributes
POST /api/providers/:id/attributes - Add provider attribute
POST /api/providers/:id/roles - Assign provider role
PUT /api/providers/:id/retire - Retire provider
```

#### Example Usage
```json
{
  "firstName": "Dr. Jane",
  "lastName": "Smith",
  "gender": "F",
  "phone": "+254700123456",
  "email": "jane.smith@hospital.com",
  "identifier": "DOC001"
}
```

### 🏗️ Enhanced Data Model

#### Provider Structure
```typescript
interface Provider {
  id: string;
  personId?: string;
  identifier?: string;
  name?: string;
  retired: boolean;
  person?: Person;
  attributes?: ProviderAttribute[];
  roles?: ProviderRole[];
}
```

#### Provider Attributes
```typescript
interface ProviderAttribute {
  id: string;
  providerId: string;
  attributeTypeId: string;
  value: string;
}
```

#### Provider Roles
```typescript
interface ProviderRole {
  id: string;
  role: string;
  description?: string;
  retired: boolean;
}
```

### 🔧 Management Capabilities

#### Attribute Management
- **License Numbers**: Medical license tracking
- **Certifications**: Professional certifications
- **Specialties**: Medical specializations
- **Contact Information**: Extended contact details

#### Role Assignment
- **Doctor**: Medical practitioners
- **Nurse**: Nursing staff
- **Pharmacist**: Pharmacy personnel
- **Lab Technician**: Laboratory staff
- **Custom Roles**: Facility-specific roles

#### Location Management
- **Department Assignment**: Link providers to departments
- **Multi-Location**: Providers can work at multiple locations
- **Schedule Management**: Track provider availability by location

### 📋 Clinical Integration

#### Encounter Integration
- Providers linked to clinical encounters
- Provider-specific encounter types
- Provider performance tracking

#### Appointment Integration
- Provider availability management
- Provider-specific appointment slots
- Provider scheduling conflicts

#### Prescription Integration
- Provider prescription privileges
- DEA number tracking
- Prescription audit trails

### 🔍 Search and Discovery

#### Provider Search
- **By Name**: First name, last name search
- **By Identifier**: Provider ID, license number
- **By Role**: Find all doctors, nurses, etc.
- **By Location**: Providers at specific facilities
- **By Specialty**: Specialized care providers

#### Provider Directory
- Complete provider listings
- Active vs retired providers
- Provider contact information
- Provider qualifications

## 📊 Benefits of Consolidation

### Simplified Architecture
- **Single Module**: One provider module instead of two
- **Unified API**: Consistent endpoints for all provider operations
- **Reduced Complexity**: Fewer dependencies and imports

### Enhanced Functionality
- **Complete Provider Management**: All provider operations in one place
- **Better Integration**: Seamless integration with other modules
- **Extensible Design**: Easy to add new provider attributes and roles

### Improved Maintenance
- **Single Codebase**: Easier to maintain and update
- **Consistent Patterns**: Uniform coding patterns throughout
- **Better Testing**: Comprehensive test coverage in one module

The consolidated provider module now provides enterprise-grade healthcare provider management with comprehensive role assignment, attribute management, and clinical integration capabilities.