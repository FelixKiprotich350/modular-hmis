import * as path from 'path';
import type { ModuleContext } from '../../../../src/core/module-types';

export async function register(ctx: ModuleContext) {
  const router = (await import('./routes')).default;
  ctx.app.use('/api/radiology', router);

  const { RadiologyService } = await import('./services/radiology-service');
  ctx.registerService('RadiologyService', new RadiologyService(ctx.db));

  const { privileges } = await import('./privileges');
  await ctx.registerPrivileges(privileges);

  await ctx.runMigrations(path.join(__dirname, '../migrations'), 'radiology');
}

export async function onEnable(ctx: ModuleContext) {
  console.log('Radiology module enabled');
}

export async function onDisable(ctx: ModuleContext) {
  console.log('Radiology module disabled');
}

export async function onUninstall(ctx: ModuleContext) {
  console.log('Radiology module uninstalled');
}