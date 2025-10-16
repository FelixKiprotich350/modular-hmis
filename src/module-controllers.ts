import * as fs from 'fs';
import * as path from 'path';

export async function discoverModuleControllers() {
  const controllers = [];
  
  // Core modules
  const coreDir = path.join(process.cwd(), 'modules/core');
  if (fs.existsSync(coreDir)) {
    const modules = fs.readdirSync(coreDir);
    for (const moduleName of modules) {
      const controller = await loadModuleController(coreDir, moduleName);
      if (controller) controllers.push(controller);
    }
  }
  
  // Custom modules
  const customDir = path.join(process.cwd(), 'modules/custom');
  if (fs.existsSync(customDir)) {
    const modules = fs.readdirSync(customDir);
    for (const moduleName of modules) {
      const controller = await loadModuleController(customDir, moduleName);
      if (controller) controllers.push(controller);
    }
  }
  
  return controllers;
}

async function loadModuleController(baseDir: string, moduleName: string) {
  const moduleDir = path.join(baseDir, moduleName);
  const manifestPath = path.join(moduleDir, 'module.json');
  
  if (!fs.existsSync(manifestPath)) return null;
  
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  if (manifest.enabled === false) return null;
  
  const srcDir = path.join(moduleDir, 'src');
  if (!fs.existsSync(srcDir)) return null;
  
  // Look for compiled controller in main dist directory
  const distControllerPath = path.join(process.cwd(), 'dist', 'modules', path.basename(baseDir), moduleName, 'src');
  if (!fs.existsSync(distControllerPath)) return null;
  
  const files = fs.readdirSync(distControllerPath);
  const controllerFile = files.find(f => f.endsWith('.controller.js'));
  
  if (!controllerFile) return null;
  
  try {
    const controllerPath = path.join(distControllerPath, controllerFile);
    const controllerModule = await import(controllerPath);
    return Object.values(controllerModule).find(
      (exp: any) => exp && typeof exp === 'function' && exp.name?.includes('Controller')
    );
  } catch (error) {
    console.warn(`Failed to load controller for ${moduleName}:`, error.message);
    return null;
  }
}

// Export the discovery function instead of calling it at module level
export { discoverModuleControllers as getModuleControllers };