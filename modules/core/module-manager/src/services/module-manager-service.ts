import { PrismaClient } from '@prisma/client';
import { ModuleRegistry } from '../../../../../src/core/module-types';
import * as fs from 'fs';
import * as path from 'path';

export interface ModuleInfo {
  name: string;
  version: string;
  description: string;
  category: 'core' | 'custom';
  status: 'enabled' | 'disabled' | 'error';
  dependencies: string[];
  path: string;
  size?: number;
  lastModified?: Date;
}

export class ModuleManagerService {
  constructor(private db: PrismaClient, private moduleRegistry: ModuleRegistry) {}

  async getAllModules(): Promise<{ core: ModuleInfo[], custom: ModuleInfo[], summary: any }> {
    const coreModules = await this.getCoreModules();
    const customModules = await this.getCustomModules();
    
    const summary = {
      total: coreModules.length + customModules.length,
      core: coreModules.length,
      custom: customModules.length,
      enabled: [...coreModules, ...customModules].filter(m => m.status === 'enabled').length,
      disabled: [...coreModules, ...customModules].filter(m => m.status === 'disabled').length
    };

    return { core: coreModules, custom: customModules, summary };
  }

  async getCoreModules(): Promise<ModuleInfo[]> {
    return this.getModulesFromDirectory('modules/core', 'core');
  }

  async getCustomModules(): Promise<ModuleInfo[]> {
    return this.getModulesFromDirectory('modules/custom', 'custom');
  }

  async getModuleStatus(name: string): Promise<ModuleInfo | null> {
    const registeredModule = this.moduleRegistry.get(name);
    if (!registeredModule) return null;

    const stats = fs.statSync(registeredModule.path);
    
    return {
      name: registeredModule.manifest.name,
      version: registeredModule.manifest.version,
      description: registeredModule.manifest.description,
      category: registeredModule.manifest.core ? 'core' : 'custom',
      status: registeredModule.manifest.enabled ? 'enabled' : 'disabled',
      dependencies: registeredModule.manifest.dependencies || [],
      path: registeredModule.path,
      size: this.getDirectorySize(registeredModule.path),
      lastModified: stats.mtime
    };
  }

  private async getModulesFromDirectory(dir: string, category: 'core' | 'custom'): Promise<ModuleInfo[]> {
    const modulesPath = path.join(process.cwd(), dir);
    if (!fs.existsSync(modulesPath)) return [];

    const modules: ModuleInfo[] = [];
    const names = fs.readdirSync(modulesPath);

    for (const name of names) {
      const modulePath = path.join(modulesPath, name);
      const manifestPath = path.join(modulePath, 'module.json');
      
      if (!fs.existsSync(manifestPath)) continue;

      try {
        const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
        const stats = fs.statSync(modulePath);
        
        modules.push({
          name: manifest.name,
          version: manifest.version,
          description: manifest.description,
          category,
          status: manifest.enabled ? 'enabled' : 'disabled',
          dependencies: manifest.dependencies || [],
          path: modulePath,
          size: this.getDirectorySize(modulePath),
          lastModified: stats.mtime
        });
      } catch (error) {
        modules.push({
          name,
          version: 'unknown',
          description: 'Error reading manifest',
          category,
          status: 'error',
          dependencies: [],
          path: modulePath
        });
      }
    }

    return modules;
  }

  private getDirectorySize(dirPath: string): number {
    let size = 0;
    try {
      const files = fs.readdirSync(dirPath, { withFileTypes: true });
      for (const file of files) {
        const filePath = path.join(dirPath, file.name);
        if (file.isDirectory()) {
          size += this.getDirectorySize(filePath);
        } else {
          size += fs.statSync(filePath).size;
        }
      }
    } catch (error) {
      // Ignore errors
    }
    return size;
  }
}