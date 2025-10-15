import * as fs from 'fs';
import * as path from 'path';
import { ModuleContext, ModuleManifest, ModuleExports } from './module-types';

export async function loadModules(ctx: ModuleContext) {
  // Load core modules first
  await loadCoreModules(ctx);
  
  // Load custom modules
  await loadCustomModules(ctx);
}

async function loadCoreModules(ctx: ModuleContext) {
  const coreModulesDir = path.join(process.cwd(), 'modules/core');
  if (!fs.existsSync(coreModulesDir)) {
    console.log('No core modules directory found');
    return;
  }

  const names = fs.readdirSync(coreModulesDir);
  
  for (const name of names) {
    await loadModule(ctx, coreModulesDir, name, true);
  }
}

async function loadCustomModules(ctx: ModuleContext) {
  const customModulesDir = path.join(process.cwd(), 'modules/custom');
  if (!fs.existsSync(customModulesDir)) {
    console.log('No custom modules directory found');
    return;
  }

  const names = fs.readdirSync(customModulesDir);
  
  for (const name of names) {
    await loadModule(ctx, customModulesDir, name, false);
  }
}

async function loadModule(ctx: ModuleContext, baseDir: string, name: string, isCore: boolean) {
  const modPath = path.join(baseDir, name);
  const manifestPath = path.join(modPath, 'module.json');
  
  if (!fs.existsSync(manifestPath)) {
    console.warn(`Module ${name} missing manifest; skipping`);
    return;
  }

  const manifest: ModuleManifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  manifest.core = isCore;
  
  if (!isCore && manifest.enabled === false) {
    console.log(`Module ${name} disabled; skipping`);
    return;
  }

  const entry = path.join(modPath, manifest.entry || 'dist/index.js');
  
  if (!fs.existsSync(entry)) {
    console.warn(`Module ${name} entry missing: ${entry}`);
    return;
  }

  try {
    console.log(`Loading ${isCore ? 'core' : 'custom'} module ${name}`);
    const mod: ModuleExports = await import(entry);
    
    if (typeof mod.register === 'function') {
      await mod.register(ctx);
      ctx.moduleRegistry.register(name, { manifest, path: modPath });
      console.log(`Module ${name} loaded successfully`);
    } else {
      console.warn(`Module ${name} missing register function`);
    }
  } catch (error) {
    console.error(`Failed to load module ${name}:`, error);
    if (isCore) {
      throw new Error(`Core module ${name} failed to load`);
    }
  }
}