import { readdirSync, statSync } from "fs";
import { join } from "path";

export interface ModuleInfo {
  name: string;
  type: "core" | "custom";
  servicePath: string;
  controllerPath: string;
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
          modules.push({
            name,
            type: type as "core" | "custom",
            servicePath: join(modulePath, "services", `${name}.service`),
            controllerPath: join(modulePath, `${name}.controller`),
          });
        }
      }
    } catch (e) {}
  }

  return modules;
}
