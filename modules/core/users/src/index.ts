import * as path from 'path';
import type { ModuleContext } from '../../../core/module-types';

export async function register(ctx: ModuleContext) {
  const router = (await import('./routes')).default;
  ctx.app.use('/api/users', router);

  const { UserService } = await import('./services/user-service');
  ctx.registerService('UserService', new UserService(ctx.db));

  const { privileges } = await import('./privileges');
  await ctx.registerPrivileges(privileges);

  await ctx.runMigrations(path.join(__dirname, '../migrations'), 'users');
}