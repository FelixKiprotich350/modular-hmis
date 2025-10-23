import { Module, DynamicModule, Provider } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { PrismaService } from "./core/prisma.service";
import { ServiceRegistry } from "./core/service-registry";
import { discoverModules } from "./core/module-loader";
import { AuthGuard } from "./core/guards/auth.guard";
import { PrivilegeGuard } from "./core/guards/privilege.guard";
import { TransactionService } from "./core/transaction.service";
import { AuditInterceptor } from "./core/interceptors/audit.interceptor";
import { LoggingInterceptor } from "./core/interceptors/logging.interceptor";
import { APP_INTERCEPTOR } from "@nestjs/core";

@Module({})
export class AppModule {
  static forRoot(): DynamicModule {
    const modules = discoverModules();
    const controllers = [];
    const providers: Provider[] = [
      AppService,
      PrismaService,
      ServiceRegistry,
      AuthGuard,
      PrivilegeGuard,
      TransactionService,
      {
        provide: APP_INTERCEPTOR,
        useClass: AuditInterceptor,
      },
      {
        provide: APP_INTERCEPTOR,
        useClass: LoggingInterceptor,
      },
    ];

    for (const module of modules) {
      try {
        // Load all discovered controllers
        for (const controllerPath of module.controllerPaths) {
          try {
            const controllerModule = require(controllerPath);
            const Controller = Object.values(controllerModule).find(
              (exp: any) =>
                typeof exp === "function" &&
                exp.name &&
                exp.name.endsWith("Controller")
            ) as any;
            if (Controller) controllers.push(Controller);
          } catch (e) {
            console.warn(
              `Failed to load controller ${controllerPath}:`,
              e.message
            );
          }
        }

        // Load all discovered services
        for (const servicePath of module.servicePaths) {
          try {
            const serviceModule = require(servicePath);
            const Service = Object.values(serviceModule).find(
              (exp: any) =>
                typeof exp === "function" &&
                exp.name &&
                exp.name.endsWith("Service") &&
                exp.prototype && // Ensure it's a class, not a function
                exp.prototype.constructor === exp
            ) as any;
            if (Service) {
              // Convert PascalCase to camelCase: AddressHierarchyService -> addressHierarchyService
              const serviceName =
                Service.name.charAt(0).toLowerCase() + Service.name.slice(1);
              providers.push({
                provide: serviceName,
                useFactory: (db: PrismaService, registry: ServiceRegistry) => {
                  const service = new Service(db, registry);
                  registry.register(serviceName, service);
                  return service;
                },
                inject: [PrismaService, ServiceRegistry],
              });
            } else {
              console.warn(`No service found in ${servicePath}`);
            }
          } catch (e) {
            console.warn(`Failed to load service ${servicePath}:`, e.message);
          }
        }
      } catch (e) {
        console.warn(`Failed to load module ${module.name}:`, e.message);
      }
    }
    return {
      module: AppModule,
      controllers: [AppController, ...controllers],
      providers,
    };
  }
}
