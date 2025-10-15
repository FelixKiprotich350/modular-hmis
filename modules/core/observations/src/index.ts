import * as path from 'path';
import type { ModuleContext } from '../../../../src/core/module-types';

export async function register(ctx: ModuleContext) {
  const router = (await import('./routes')).default;
  ctx.app.use('/api/observations', router);

  const { ObservationService } = await import('./services/observation-service');
  ctx.registerService('ObservationService', new ObservationService(ctx.db));

  const { privileges } = await import('./privileges');
  await ctx.registerPrivileges(privileges);

  await ctx.runMigrations(path.join(__dirname, '../migrations'), 'observations');
}

export async function onEnable(ctx: ModuleContext) {
  console.log('Observations module enabled');
}

export async function onDisable(ctx: ModuleContext) {
  console.log('Observations module disabled');
}

export async function onUninstall(ctx: ModuleContext) {
  console.log('Observations module uninstalled');
}