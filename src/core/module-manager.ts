import * as fs from 'fs';
import * as path from 'path';
import { ModuleManifest } from './module-types';

export class ModuleManager {
  private customModulesDir = path.join(process.cwd(), 'modules/custom');
  private coreModulesDir = path.join(process.cwd(), 'modules/core');

  async installModule(modulePackage: string): Promise<void> {
    // Extract and copy module to modules directory
    console.log(`Installing module: ${modulePackage}`);
  }

  async uninstallModule(moduleName: string): Promise<void> {
    const modulePath = path.join(this.customModulesDir, moduleName);
    const manifestPath = path.join(modulePath, 'module.json');
    
    if (!fs.existsSync(manifestPath)) {
      throw new Error(`Custom module ${moduleName} not found`);
    }

    fs.rmSync(modulePath, { recursive: true, force: true });
    console.log(`Module ${moduleName} uninstalled`);
  }

  async enableModule(moduleName: string): Promise<void> {
    const manifestPath = path.join(this.customModulesDir, moduleName, 'module.json');
    
    if (!fs.existsSync(manifestPath)) {
      throw new Error(`Custom module ${moduleName} not found`);
    }

    await this.toggleModule(moduleName, true);
  }

  async disableModule(moduleName: string): Promise<void> {
    const manifestPath = path.join(this.customModulesDir, moduleName, 'module.json');
    
    if (!fs.existsSync(manifestPath)) {
      throw new Error(`Custom module ${moduleName} not found`);
    }

    await this.toggleModule(moduleName, false);
  }

  private async toggleModule(moduleName: string, enabled: boolean): Promise<void> {
    const manifestPath = path.join(this.customModulesDir, moduleName, 'module.json');
    
    if (!fs.existsSync(manifestPath)) {
      throw new Error(`Custom module ${moduleName} not found`);
    }

    const manifest: ModuleManifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    manifest.enabled = enabled;
    
    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
    console.log(`Module ${moduleName} ${enabled ? 'enabled' : 'disabled'}`);
  }
}

export const moduleManager = new ModuleManager();