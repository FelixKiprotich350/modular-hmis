import * as path from 'path';
import type { ModuleContext } from '../../../../src/core/module-types';

export async function register(ctx: ModuleContext) {
  const router = (await import('./routes')).default;
  ctx.app.use('/api/roles', router);

  const { RoleManagementService } = await import('./services/role-management-service');
  ctx.registerService('RoleManagementService', new RoleManagementService(ctx.db));

  const { privileges } = await import('./privileges');
  await ctx.registerPrivileges(privileges);

  await ctx.runMigrations(path.join(__dirname, '../migrations'), 'role-management');
}