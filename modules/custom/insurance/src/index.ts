import * as path from 'path';
import type { ModuleContext } from '../../../../src/core/module-types';

export async function register(ctx: ModuleContext) {
  const router = (await import('./routes')).default;
  ctx.app.use('/api/insurance', router);

  const { InsuranceService } = await import('./services/insurance-service');
  ctx.registerService('InsuranceService', new InsuranceService(ctx.db));

  const { privileges } = await import('./privileges');
  await ctx.registerPrivileges(privileges);

  await ctx.runMigrations(path.join(__dirname, '../migrations'), 'insurance');
}

export async function onEnable(ctx: ModuleContext) {
  console.log('Insurance module enabled');
}

export async function onDisable(ctx: ModuleContext) {
  console.log('Insurance module disabled');
}

export async function onUninstall(ctx: ModuleContext) {
  console.log('Insurance module uninstalled');
}