import { ModuleManifest, ModuleRegistry } from './module-types';

export class ModuleRegistryImpl implements ModuleRegistry {
  private modules = new Map<string, { manifest: ModuleManifest; path: string }>();

  register(name: string, module: { manifest: ModuleManifest; path: string }) {
    this.modules.set(name, module);
  }

  get(name: string) {
    return this.modules.get(name);
  }

  list() {
    return Array.from(this.modules.entries()).map(([name, module]) => ({
      name,
      ...module
    }));
  }
}

export const moduleRegistry = new ModuleRegistryImpl();