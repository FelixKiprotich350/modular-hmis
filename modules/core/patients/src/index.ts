import * as path from 'path';
import type { ModuleContext } from '../../../../src/core/module-types';

export async function register(ctx: ModuleContext) {
  // Register routes
  const router = (await import('./routes')).default;
  ctx.app.use('/api/patients', router);

  // Register services
  const { PatientService } = await import('./services/patient-service');
  ctx.registerService('PatientService', new PatientService(ctx.db));

  // Register privileges
  const { privileges } = await import('./privileges');
  await ctx.registerPrivileges(privileges);

  // Run migrations
  await ctx.runMigrations(path.join(__dirname, '../migrations'), 'patients');
}

export async function onEnable(ctx: ModuleContext) {
  console.log('Patients module enabled');
}

export async function onDisable(ctx: ModuleContext) {
  console.log('Patients module disabled');
}

export async function onUninstall(ctx: ModuleContext) {
  console.log('Patients module uninstalled');
}