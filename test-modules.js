const fs = require('fs');
const path = require('path');

// Test script to verify all modules have required files
const modulesDir = path.join(__dirname, 'modules');

function checkModule(modulePath) {
  const moduleJsonPath = path.join(modulePath, 'module.json');
  const srcPath = path.join(modulePath, 'src');
  const indexPath = path.join(srcPath, 'index.ts');
  const routesPath = path.join(srcPath, 'routes.ts');
  const privilegesPath = path.join(srcPath, 'privileges.ts');
  
  const results = {
    name: path.basename(modulePath),
    hasModuleJson: fs.existsSync(moduleJsonPath),
    hasIndex: fs.existsSync(indexPath),
    hasRoutes: fs.existsSync(routesPath),
    hasPrivileges: fs.existsSync(privilegesPath),
    hasServices: fs.existsSync(path.join(srcPath, 'services'))
  };
  
  return results;
}

function scanModules(dir) {
  const results = [];
  const categories = fs.readdirSync(dir);
  
  for (const category of categories) {
    const categoryPath = path.join(dir, category);
    if (fs.statSync(categoryPath).isDirectory()) {
      const modules = fs.readdirSync(categoryPath);
      
      for (const module of modules) {
        const modulePath = path.join(categoryPath, module);
        if (fs.statSync(modulePath).isDirectory()) {
          const result = checkModule(modulePath);
          result.category = category;
          results.push(result);
        }
      }
    }
  }
  
  return results;
}

console.log('Scanning modules...\n');
const results = scanModules(modulesDir);

let allComplete = true;
for (const result of results) {
  const status = result.hasModuleJson && result.hasIndex && result.hasRoutes && result.hasPrivileges ? '✅' : '❌';
  console.log(`${status} ${result.category}/${result.name}`);
  
  if (!result.hasModuleJson) console.log('  - Missing module.json');
  if (!result.hasIndex) console.log('  - Missing src/index.ts');
  if (!result.hasRoutes) console.log('  - Missing src/routes.ts');
  if (!result.hasPrivileges) console.log('  - Missing src/privileges.ts');
  if (!result.hasServices) console.log('  - Missing src/services directory');
  
  if (!(result.hasModuleJson && result.hasIndex && result.hasRoutes && result.hasPrivileges)) {
    allComplete = false;
  }
}

console.log(`\nTotal modules: ${results.length}`);
console.log(`Status: ${allComplete ? 'All modules complete!' : 'Some modules incomplete'}`);