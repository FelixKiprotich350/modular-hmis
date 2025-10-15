import * as path from 'path';
import type { ModuleContext } from '../../../../src/core/module-types';

export async function register(ctx: ModuleContext) {
  const router = (await import('./routes')).default;
  ctx.app.use('/api/pharmacy', router);

  const { PharmacyService } = await import('./services/pharmacy-service');
  ctx.registerService('PharmacyService', new PharmacyService(ctx.db));

  const { privileges } = await import('./privileges');
  await ctx.registerPrivileges(privileges);

  await ctx.runMigrations(path.join(__dirname, '../migrations'), 'pharmacy');
}

export async function onEnable(ctx: ModuleContext) {
  console.log('Pharmacy module enabled');
}

export async function onDisable(ctx: ModuleContext) {
  console.log('Pharmacy module disabled');
}

export async function onUninstall(ctx: ModuleContext) {
  console.log('Pharmacy module uninstalled');
}