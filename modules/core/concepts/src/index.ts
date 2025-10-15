import * as path from 'path';
import type { ModuleContext } from '../../../../src/core/module-types';

export async function register(ctx: ModuleContext) {
  const router = (await import('./routes')).default;
  ctx.app.use('/api/concepts', router);

  const { ConceptService } = await import('./services/concept-service');
  ctx.registerService('ConceptService', new ConceptService(ctx.db));

  const { privileges } = await import('./privileges');
  await ctx.registerPrivileges(privileges);

  await ctx.runMigrations(path.join(__dirname, '../migrations'), 'concepts');
}