import * as path from 'path';
import type { ModuleContext } from '../../../../src/core/module-types';

export async function register(ctx: ModuleContext) {
  const router = (await import('./routes')).default;
  ctx.app.use('/api/locations', router);

  const { LocationService } = await import('./services/location-service');
  ctx.registerService('LocationService', new LocationService(ctx.db));

  const { privileges } = await import('./privileges');
  await ctx.registerPrivileges(privileges);

  await ctx.runMigrations(path.join(__dirname, '../migrations'), 'locations');
}

export async function onEnable(ctx: ModuleContext) {
  console.log('Locations module enabled');
}

export async function onDisable(ctx: ModuleContext) {
  console.log('Locations module disabled');
}

export async function onUninstall(ctx: ModuleContext) {
  console.log('Locations module uninstalled');
}