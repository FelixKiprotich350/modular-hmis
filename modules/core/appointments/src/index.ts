import * as path from 'path';
import type { ModuleContext } from '../../../../src/core/module-types';

export async function register(ctx: ModuleContext) {
  const router = (await import('./routes')).default;
  ctx.app.use('/api/appointments', router);

  const { AppointmentService } = await import('./services/appointment-service');
  ctx.registerService('AppointmentService', new AppointmentService(ctx.db));

  const { privileges } = await import('./privileges');
  await ctx.registerPrivileges(privileges);

  await ctx.runMigrations(path.join(__dirname, '../migrations'), 'appointments');
}

export async function onEnable(ctx: ModuleContext) {
  console.log('Appointments module enabled');
}

export async function onDisable(ctx: ModuleContext) {
  console.log('Appointments module disabled');
}

export async function onUninstall(ctx: ModuleContext) {
  console.log('Appointments module uninstalled');
}