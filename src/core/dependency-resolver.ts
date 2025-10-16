import { serviceRegistry } from './service-registry';

// Global dependency resolver for modules
(global as any).serviceRegistry = serviceRegistry;

// Make core services available globally for modules
export function setupGlobalDependencies() {
  // Export commonly used dependencies
  if (typeof window === 'undefined') {
    (global as any).require = require;
  }
}