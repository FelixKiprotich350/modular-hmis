# Core Modules Completion - Locations, Person, Program, Appointments

## ✅ Completed Modules

### 🏢 Locations Module
**Purpose**: Facilities, wards, departments, and service delivery points management

#### Features
- **Location Hierarchy**: Parent-child location relationships
- **Location Tags**: Categorize locations (Hospital, Clinic, Pharmacy, Lab)
- **Location Attributes**: Extensible location properties
- **Geographic Data**: Latitude, longitude, address information
- **Search & Discovery**: Find locations by name, tag, or hierarchy

#### API Endpoints
```
POST /api/locations - Create location
GET /api/locations/search?q=query - Search locations
GET /api/locations/tags - Get location tags
GET /api/locations/by-tag/:tagId - Get locations by tag
GET /api/locations/:id/hierarchy - Get location hierarchy
GET /api/locations/:id/children - Get child locations
GET /api/locations/:id/attributes - Get location attributes
POST /api/locations/:id/attributes - Add location attribute
PUT /api/locations/:id/retire - Retire location
```

### 👤 Person Module
**Purpose**: Generic person objects (patients, relatives, providers)

#### Features
- **Person Demographics**: Name, gender, birthdate, contact info
- **Person Addresses**: Multiple addresses with hierarchy support
- **Person Attributes**: Extensible person properties
- **Deceased Management**: Track death date and cause
- **Address Management**: Structured address with validation

#### API Endpoints
```
POST /api/person - Create person
GET /api/person/:id/addresses - Get person addresses
POST /api/person/:id/addresses - Add person address
GET /api/person/:id/attributes - Get person attributes
POST /api/person/:id/attributes - Add person attribute
```

### 🏥 Program Module
**Purpose**: Health programs (HIV, TB, ANC) with workflow management

#### Features
- **Program Management**: Create and manage health programs
- **Patient Enrollment**: Enroll patients in programs
- **Workflow States**: Track patient progress through program stages
- **State Transitions**: Move patients between program states
- **Enrollment Completion**: Complete enrollments with outcomes

#### API Endpoints
```
POST /api/programs - Create program
POST /api/programs/enrollments - Enroll patient
GET /api/programs/enrollments/patient/:patientId - Get patient enrollments
GET /api/programs/enrollments/active - Get active enrollments
PUT /api/programs/enrollments/:id/complete - Complete enrollment
PUT /api/programs/enrollments/:id/state - Change enrollment state
GET /api/programs/workflows - Get program workflows
```

### 📅 Appointments Module
**Purpose**: Patient appointment booking and management

#### Features
- **Appointment Scheduling**: Book, reschedule, cancel appointments
- **Provider Availability**: Check provider schedules and available slots
- **Appointment Types**: Different appointment types with durations
- **Appointment Blocks**: Provider time blocks for scheduling
- **Check-in Management**: Patient check-in workflow

#### API Endpoints
```
POST /api/appointments - Create appointment
GET /api/appointments/types - Get appointment types
GET /api/appointments/patient/:patientId - Get patient appointments
GET /api/appointments/provider/:providerId - Get provider appointments
GET /api/appointments/available-slots - Get available time slots
POST /api/appointments/blocks - Create appointment blocks
PUT /api/appointments/:id/reschedule - Reschedule appointment
PUT /api/appointments/:id/cancel - Cancel appointment
PUT /api/appointments/:id/checkin - Check in patient
```

## 🏗️ Integration Architecture

### Location Integration
- **Provider Assignments**: Link providers to locations
- **Encounter Locations**: Track where encounters occur
- **Appointment Locations**: Schedule appointments at specific locations
- **Location Hierarchy**: Support multi-level facility structures

### Person Integration
- **Patient Extension**: Patients extend person objects
- **Provider Extension**: Providers link to person records
- **Address Management**: Structured addresses with hierarchy
- **Attribute Extension**: Flexible person properties

### Program Integration
- **Patient Programs**: Link patients to health programs
- **Workflow Management**: Track patient progress through stages
- **Encounter Integration**: Link encounters to program enrollments
- **Outcome Tracking**: Monitor program completion and outcomes

### Appointment Integration
- **Patient Scheduling**: Link appointments to patients
- **Provider Scheduling**: Manage provider calendars
- **Location Scheduling**: Schedule at specific facilities
- **Visit Integration**: Convert appointments to visits

## 🔧 Clinical Workflow Support

### Facility Management
- **Multi-Location Support**: Manage multiple facilities
- **Department Structure**: Organize locations by departments
- **Resource Allocation**: Assign providers and equipment to locations
- **Capacity Management**: Track location capacity and utilization

### Patient Journey
- **Registration**: Create person and patient records
- **Program Enrollment**: Enroll in relevant health programs
- **Appointment Booking**: Schedule follow-up appointments
- **State Tracking**: Monitor progress through program workflows

### Provider Management
- **Location Assignment**: Assign providers to locations
- **Schedule Management**: Manage provider availability
- **Appointment Blocks**: Create time blocks for scheduling
- **Workload Distribution**: Balance appointments across providers

## 📊 Data Models

### Location Hierarchy
```
Hospital (Main Campus)
├── Emergency Department
├── Outpatient Clinic
│   ├── General Medicine
│   └── Pediatrics
├── Inpatient Wards
│   ├── Medical Ward
│   └── Surgical Ward
└── Ancillary Services
    ├── Laboratory
    ├── Radiology
    └── Pharmacy
```

### Program Workflows
```
HIV Program
├── Pre-ART (Initial State)
├── On ART (Treatment State)
├── Lost to Follow-up (Terminal State)
└── Treatment Complete (Terminal State)
```

### Appointment Flow
```
Appointment Request
├── Check Provider Availability
├── Find Available Slot
├── Book Appointment
├── Send Confirmation
└── Check-in on Arrival
```

The four modules now provide comprehensive support for facility management, person demographics, health program tracking, and appointment scheduling, completing the core clinical workflow infrastructure.