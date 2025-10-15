import * as path from 'path';
import type { ModuleContext } from '../../../../src/core/module-types';

export async function register(ctx: ModuleContext) {
  const router = (await import('./routes')).default;
  ctx.app.use('/api/laboratory', router);

  const { LaboratoryService } = await import('./services/laboratory-service');
  ctx.registerService('LaboratoryService', new LaboratoryService(ctx.db));

  const { privileges } = await import('./privileges');
  await ctx.registerPrivileges(privileges);

  await ctx.runMigrations(path.join(__dirname, '../migrations'), 'laboratory');
}

export async function onEnable(ctx: ModuleContext) {
  console.log('Laboratory module enabled');
}

export async function onDisable(ctx: ModuleContext) {
  console.log('Laboratory module disabled');
}

export async function onUninstall(ctx: ModuleContext) {
  console.log('Laboratory module uninstalled');
}