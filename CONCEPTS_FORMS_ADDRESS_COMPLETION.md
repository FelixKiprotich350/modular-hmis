# Concepts, Forms, and Address Hierarchy Modules - Completion

## ✅ Completed Modules

### 🧠 Concepts Module
**Purpose**: Clinical terminology, coded data, and data dictionary management

#### Features
- **Concept Management**: Create, update, search concepts
- **Datatypes**: Text, Numeric, Coded, Date, Boolean, Complex
- **Concept Classes**: Categorization of concepts
- **Concept Answers**: For coded concepts (dropdown options)
- **Search & Classification**: Find concepts by name, class, datatype

#### API Endpoints
```
POST /api/concepts - Create concept
GET /api/concepts/search?q=query - Search concepts
GET /api/concepts/by-class/:class - Get by concept class
GET /api/concepts/by-datatype/:datatype - Get by datatype
GET /api/concepts/:id/answers - Get concept answers
POST /api/concepts/:id/answers - Add concept answer
```

#### Example Usage
```json
{
  "name": "Blood Pressure Systolic",
  "datatype": "Numeric",
  "conceptClass": "Test",
  "units": "mmHg",
  "description": "Systolic blood pressure measurement"
}
```

### 📋 Forms Module
**Purpose**: Clinical data entry form definitions and management

#### Features
- **Form Builder**: Create and manage clinical forms
- **Field Management**: Add/remove fields linked to concepts
- **Form Publishing**: Publish forms for clinical use
- **Encounter Integration**: Link forms to encounter types
- **Version Control**: Form versioning support

#### API Endpoints
```
POST /api/forms - Create form
GET /api/forms/by-encounter/:type - Get forms by encounter type
GET /api/forms/:id/structure - Get complete form structure
POST /api/forms/:id/fields - Add field to form
PUT /api/forms/:id/publish - Publish form
```

#### Example Usage
```json
{
  "name": "Vital Signs Form",
  "version": "1.0",
  "encounterType": "VITALS",
  "description": "Standard vital signs collection form"
}
```

### 🏠 Address Hierarchy Module
**Purpose**: Structured address management (country → state → county → city)

#### Features
- **Hierarchy Levels**: Define address structure levels
- **Address Entries**: Manage geographic locations
- **Person Addresses**: Link addresses to persons
- **Address Validation**: Ensure proper address format
- **Search & Navigation**: Find locations in hierarchy

#### API Endpoints
```
GET /api/address-hierarchy/levels - Get hierarchy levels
GET /api/address-hierarchy/entries/:parentId/children - Get child locations
GET /api/address-hierarchy/entries/search?q=query - Search locations
POST /api/address-hierarchy/addresses - Create person address
POST /api/address-hierarchy/addresses/validate - Validate address
```

#### Example Hierarchy
```
Country (Kenya)
├── State/Province (Nairobi County)
│   ├── County/District (Westlands)
│   │   └── City/Village (Parklands)
└── State/Province (Mombasa County)
    └── County/District (Mvita)
```

## 🏗️ Database Schema Updates

### Concept Tables
- `Concept`: Core concept definitions
- `ConceptAnswer`: Coded concept answer options

### Form Tables
- `Form`: Form definitions and metadata
- `FormField`: Fields within forms linked to concepts

### Address Tables
- `AddressHierarchyLevel`: Hierarchy level definitions
- `AddressHierarchyEntry`: Geographic location entries
- `PersonAddress`: Person-specific addresses

## 🔧 Integration Points

### Concepts ↔ Forms
- Form fields reference concepts for data collection
- Coded concepts provide dropdown options in forms

### Concepts ↔ Observations
- Observations use concepts to define what is being measured
- Concept datatypes determine observation value types

### Address Hierarchy ↔ Persons
- Persons can have multiple structured addresses
- Address validation ensures data quality

### Forms ↔ Encounters
- Forms are linked to specific encounter types
- Clinical workflows use forms for data entry

## 📋 Usage Examples

### Create Clinical Concept
```typescript
const concept = await conceptService.createConcept({
  name: "Temperature",
  datatype: "Numeric",
  conceptClass: "Test",
  units: "°C"
});
```

### Build Clinical Form
```typescript
const form = await formService.createForm({
  name: "Triage Form",
  version: "1.0",
  encounterType: "TRIAGE"
});

await formService.addFieldToForm(form.id, temperatureConceptId, 1, true);
```

### Setup Address Hierarchy
```typescript
const country = await addressService.createEntry({
  name: "Kenya",
  levelId: "country-level"
});

const state = await addressService.createEntry({
  name: "Nairobi County",
  levelId: "state-level",
  parentId: country.id
});
```

The three modules now provide comprehensive support for clinical terminology, form building, and structured address management following OpenMRS patterns.