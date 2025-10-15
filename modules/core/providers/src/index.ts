import * as path from 'path';
import type { ModuleContext } from '../../../../src/core/module-types';

export async function register(ctx: ModuleContext) {
  const router = (await import('./routes')).default;
  ctx.app.use('/api/providers', router);

  const { ProviderService } = await import('./services/provider-service');
  ctx.registerService('ProviderService', new ProviderService(ctx.db));

  const { privileges } = await import('./privileges');
  await ctx.registerPrivileges(privileges);

  await ctx.runMigrations(path.join(__dirname, '../migrations'), 'providers');
}

export async function onEnable(ctx: ModuleContext) {
  console.log('Providers module enabled');
}

export async function onDisable(ctx: ModuleContext) {
  console.log('Providers module disabled');
}

export async function onUninstall(ctx: ModuleContext) {
  console.log('Providers module uninstalled');
}