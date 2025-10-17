import { Module, DynamicModule, Provider } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { PrismaService } from "./core/prisma.service";
import { ServiceRegistry } from "./core/service-registry";
import { discoverModules } from "./core/module-loader";

@Module({})
export class AppModule {
  static forRoot(): DynamicModule {
    const modules = discoverModules();
    const controllers = [];
    const providers: Provider[] = [AppService, PrismaService, ServiceRegistry];

    for (const module of modules) {
      try {
        const Controller = require(module.controllerPath)[
          `${
            module.name.charAt(0).toUpperCase() + module.name.slice(1)
          }Controller`
        ];
        if (Controller) controllers.push(Controller);

        for (const servicePath of module.servicePaths) {
          try {
            const serviceModule = require(servicePath);
            const Service = Object.values(serviceModule).find(
              (exp: any) =>
                typeof exp === "function" &&
                exp.name &&
                exp.name.endsWith("Service")
            ) as any;
            if (Service) {
              providers.push({
                provide: `${module.name}Service`,
                useFactory: (db: PrismaService, registry: ServiceRegistry) => {
                  const service = new Service(db, registry);
                  registry.register(`${module.name}Service`, service);
                  return service;
                },
                inject: [PrismaService, ServiceRegistry],
              });
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
