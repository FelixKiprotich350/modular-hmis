# Patient Lifecycle Implementation - Registration & Search

## ✅ Implemented Features

### 1️⃣ Patient Registration

#### Registration Flow
- **Demographics Capture**: First name, last name, middle name, gender, birthdate
- **Contact Information**: Phone, email, address details
- **Auto ID Generation**: Uses IDGen module to generate unique patient IDs
- **Duplicate Detection**: Checks for existing patients with similar details
- **Address Management**: Structured address storage with hierarchy support

#### API Endpoints
```
POST /api/patients/register
{
  "firstName": "John",
  "lastName": "Doe", 
  "gender": "M",
  "birthdate": "1990-01-01",
  "phone": "+254700000000",
  "address1": "123 Main St",
  "cityVillage": "Nairobi",
  "identifierTypeId": "patient-id-type"
}
```

#### Response
```json
{
  "success": true,
  "message": "Patient registered successfully",
  "patient": { ... },
  "identifier": "P20241201001"
}
```

### 2️⃣ Patient Search & Lookup

#### Search Capabilities
- **By Identifier**: Patient ID, program numbers
- **By Name**: First name, last name, partial matches
- **By Phone**: Contact number lookup
- **By Demographics**: Gender, birthdate combinations
- **Duplicate Detection**: Flags potential duplicates during registration

#### API Endpoints

**Advanced Search**
```
POST /api/patients/search
{
  "name": "John",
  "identifier": "P20241201001",
  "phone": "+254700000000",
  "limit": 20,
  "offset": 0
}
```

**Quick Search**
```
GET /api/patients/search?q=John
GET /api/patients/search?identifier=P20241201001
GET /api/patients/search?phone=+254700000000
```

**Duplicate Check**
```
POST /api/patients/check-duplicates
{
  "firstName": "John",
  "lastName": "Doe",
  "birthdate": "1990-01-01",
  "phone": "+254700000000"
}
```

## 🏗️ Architecture Components

### Enhanced Models
- **Person**: Core demographic data
- **PersonAddress**: Structured address management
- **PatientIdentifier**: Multiple identifier support
- **IdentifierSource**: Configurable ID generation

### Services
- **PatientService.registerPatient()**: Complete registration workflow
- **PatientService.searchPatients()**: Multi-criteria search
- **PatientService.findDuplicates()**: Duplicate detection logic
- **IdgenService.generateIdentifier()**: Smart ID generation

### DTOs
- **RegisterPatientDto**: Registration form data
- **SearchPatientDto**: Search criteria
- **PatientRegistrationData**: Internal registration interface

## 🔧 Key Features

### ID Generation
- **Auto-generation**: Uses IDGen module for unique IDs
- **Configurable Sources**: Prefix, suffix, length constraints
- **Pool Management**: Pre-generated identifier pools
- **Format Validation**: Ensures proper ID formats

### Duplicate Prevention
- **Name + Birthdate**: Checks for similar demographic combinations
- **Phone Number**: Prevents duplicate phone registrations
- **Identifier Uniqueness**: Ensures no duplicate IDs
- **Fuzzy Matching**: Handles slight variations in names

### Search Optimization
- **Multiple Criteria**: Combine name, ID, phone, demographics
- **Pagination**: Limit and offset support
- **Quick Search**: Single query parameter for common searches
- **Result Ranking**: Most relevant results first

## 📋 Usage Examples

### Register Patient
```typescript
const registration = {
  firstName: "Jane",
  lastName: "Smith",
  gender: "F",
  birthdate: new Date("1985-05-15"),
  phone: "+254701234567",
  address1: "456 Oak Avenue",
  cityVillage: "Mombasa",
  identifierTypeId: "kenya-emr-id"
};

const result = await patientService.registerPatient(registration);
```

### Search Patients
```typescript
const searchCriteria = {
  name: "Jane",
  phone: "+254701234567",
  limit: 10
};

const patients = await patientService.searchPatients(searchCriteria);
```

The implementation provides a solid foundation for patient registration and lookup, supporting the typical healthcare workflow while preventing duplicates and ensuring data integrity.