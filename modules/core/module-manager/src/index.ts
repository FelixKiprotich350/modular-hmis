import * as path from 'path';
import type { ModuleContext } from '../../../../src/core/module-types';

export async function register(ctx: ModuleContext) {
  const router = (await import('./routes')).default;
  ctx.app.use('/api/modules', router);

  const { ModuleManagerService } = await import('./services/module-manager-service');
  ctx.registerService('ModuleManagerService', new ModuleManagerService(ctx.db, ctx.moduleRegistry));

  const { privileges } = await import('./privileges');
  await ctx.registerPrivileges(privileges);

  await ctx.runMigrations(path.join(__dirname, '../migrations'), 'module-manager');
}