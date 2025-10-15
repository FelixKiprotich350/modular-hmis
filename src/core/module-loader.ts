import * as fs from 'fs';
import * as path from 'path';
import { ModuleContext, ModuleManifest, ModuleExports } from './module-types';

export async function loadModules(ctx: ModuleContext) {
  const modulesDir = path.join(process.cwd(), 'modules');
  if (!fs.existsSync(modulesDir)) {
    console.log('No modules directory found');
    return;
  }

  const names = fs.readdirSync(modulesDir);
  
  for (const name of names) {
    const modPath = path.join(modulesDir, name);
    const manifestPath = path.join(modPath, 'module.json');
    
    if (!fs.existsSync(manifestPath)) {
      console.warn(`Module ${name} missing manifest; skipping`);
      continue;
    }

    const manifest: ModuleManifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    
    if (manifest.enabled === false) {
      console.log(`Module ${name} disabled; skipping`);
      continue;
    }

    const entry = path.join(modPath, manifest.entry || 'dist/index.js');
    
    if (!fs.existsSync(entry)) {
      console.warn(`Module ${name} entry missing: ${entry}`);
      continue;
    }

    try {
      console.log(`Loading module ${name}`);
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
    }
  }
}