import { readdirSync, statSync } from "fs";
import { join } from "path";

export interface ModuleInfo {
  name: string;
  type: "core" | "custom";
  servicePaths: string[];
  controllerPaths: string[];
}

export function discoverModules(): ModuleInfo[] {
  const modules: ModuleInfo[] = [];
  const modulesPath = join(__dirname, "../modules");

  for (const type of ["core", "custom"]) {
    const typePath = join(modulesPath, type);
    try {
      const moduleNames = readdirSync(typePath);

      for (const name of moduleNames) {
        const modulePath = join(typePath, name);
        if (statSync(modulePath).isDirectory()) {
          const servicesPath = join(modulePath, "services");
          let servicePaths: string[] = [];
          let controllerPaths: string[] = [];
          
          try {
            const serviceFiles = readdirSync(servicesPath);
            servicePaths = serviceFiles
              .filter(file => file.endsWith('.service.ts'))
              .map(file => join(servicesPath, file));
          } catch (e) {}

          // Discover controllers recursively
          function findControllers(dir: string): string[] {
            const controllers: string[] = [];
            try {
              const files = readdirSync(dir);
              for (const file of files) {
                const filePath = join(dir, file);
                if (statSync(filePath).isDirectory()) {
                  controllers.push(...findControllers(filePath));
                } else if (file.endsWith('.controller.ts')) {
                  controllers.push(filePath);
                }
              }
            } catch (e) {}
            return controllers;
          }

          controllerPaths = findControllers(modulePath);
          
          modules.push({
            name,
            type: type as "core" | "custom",
            servicePaths,
            controllerPaths,
          });
        }
      }
    } catch (e) {}
  }

  return modules;
}
