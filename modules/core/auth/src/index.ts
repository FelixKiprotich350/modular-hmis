import * as path from 'path';
import type { ModuleContext } from '../../../../src/core/module-types';

export async function register(ctx: ModuleContext) {
  const router = (await import('./routes-fixed')).default;
  ctx.app.use('/api/auth', router);

  const { AuthService } = await import('./services/auth-service-fixed');
  ctx.registerService('AuthService', new AuthService(ctx.db));

  const { privileges } = await import('./privileges');
  await ctx.registerPrivileges(privileges);

  await ctx.runMigrations(path.join(__dirname, '../migrations'), 'auth');
}