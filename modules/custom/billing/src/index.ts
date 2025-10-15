import * as path from 'path';
import type { ModuleContext } from '../../../../src/core/module-types';

export async function register(ctx: ModuleContext) {
  const router = (await import('./routes')).default;
  ctx.app.use('/api/billing', router);

  const { BillingService } = await import('./services/billing-service');
  ctx.registerService('BillingService', new BillingService(ctx.db));

  const { privileges } = await import('./privileges');
  await ctx.registerPrivileges(privileges);

  await ctx.runMigrations(path.join(__dirname, '../migrations'), 'billing');
}

export async function onEnable(ctx: ModuleContext) {
  console.log('Billing module enabled');
}

export async function onDisable(ctx: ModuleContext) {
  console.log('Billing module disabled');
}

export async function onUninstall(ctx: ModuleContext) {
  console.log('Billing module uninstalled');
}