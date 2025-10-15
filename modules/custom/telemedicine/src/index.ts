import * as path from 'path';
import type { ModuleContext } from '../../../../src/core/module-types';

export async function register(ctx: ModuleContext) {
  const router = (await import('./routes')).default;
  ctx.app.use('/api/telemedicine', router);

  const { TelemedicineService } = await import('./services/telemedicine-service');
  ctx.registerService('TelemedicineService', new TelemedicineService(ctx.db));

  const { privileges } = await import('./privileges');
  await ctx.registerPrivileges(privileges);

  await ctx.runMigrations(path.join(__dirname, '../migrations'), 'telemedicine');
}

export async function onEnable(ctx: ModuleContext) {
  console.log('Telemedicine module enabled');
}

export async function onDisable(ctx: ModuleContext) {
  console.log('Telemedicine module disabled');
}

export async function onUninstall(ctx: ModuleContext) {
  console.log('Telemedicine module uninstalled');
}