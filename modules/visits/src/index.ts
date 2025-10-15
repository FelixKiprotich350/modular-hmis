import * as path from 'path';
import type { ModuleContext } from '../../../src/core/module-types';

export async function register(ctx: ModuleContext) {
  const router = (await import('./routes')).default;
  ctx.app.use('/api/visits', router);

  const { VisitService } = await import('./services/visit-service');
  ctx.registerService('VisitService', new VisitService(ctx.db));

  const { privileges } = await import('./privileges');
  await ctx.registerPrivileges(privileges);

  await ctx.runMigrations(path.join(__dirname, '../migrations'), 'visits');
}

export async function onEnable(ctx: ModuleContext) {
  console.log('Visits module enabled');
}

export async function onDisable(ctx: ModuleContext) {
  console.log('Visits module disabled');
}

export async function onUninstall(ctx: ModuleContext) {
  console.log('Visits module uninstalled');
}