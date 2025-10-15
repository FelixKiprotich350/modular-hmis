import * as path from 'path';
import type { ModuleContext } from '../../../../src/core/module-types';

export async function register(ctx: ModuleContext) {
  const router = (await import('./routes')).default;
  ctx.app.use('/api-docs', router);

  const { ApiExplorerService } = await import('./services/api-explorer-service');
  ctx.registerService('ApiExplorerService', new ApiExplorerService());

  const { privileges } = await import('./privileges');
  await ctx.registerPrivileges(privileges);

  await ctx.runMigrations(path.join(__dirname, '../migrations'), 'api-explorer');
}