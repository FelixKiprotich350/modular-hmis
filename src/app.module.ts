import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { PrismaService } from "./core/prisma.service";
import { ServiceRegistry } from "./core/service-registry";

// Import all module controllers
import { PatientsController } from "./patients/patients.controller";
import { AppointmentsController } from "./appointments/appointments.controller";
import { ProvidersController } from "./providers/providers.controller";
import { LocationsController } from "./locations/locations.controller";

// Import all services
import { PatientService } from "./patients/services/patient-service";
import { AppointmentService } from "./appointments/services/appointment-service";
import { ProviderService } from "./providers/services/provider-service";
import { LocationService } from "./locations/services/location-service";

@Module({
  imports: [],
  controllers: [
    AppController,
    PatientsController,
    AppointmentsController,
    ProvidersController,
    LocationsController,
  ],
  providers: [
    AppService,
    PrismaService,
    ServiceRegistry,
    PatientService,
    AppointmentService,
    ProviderService,
    LocationService,
  ],
})
export class AppModule {}
