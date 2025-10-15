import * as path from 'path';
import type { ModuleContext } from '../../../../src/core/module-types';

export async function register(ctx: ModuleContext) {
  const router = (await import('./routes')).default;
  ctx.app.use('/api/mobile-clinic', router);

  const { MobileClinicService } = await import('./services/mobile-clinic-service');
  ctx.registerService('MobileClinicService', new MobileClinicService(ctx.db));

  const { privileges } = await import('./privileges');
  await ctx.registerPrivileges(privileges);

  await ctx.runMigrations(path.join(__dirname, '../migrations'), 'mobile-clinic');
}

export async function onEnable(ctx: ModuleContext) {
  console.log('Mobile Clinic module enabled');
}

export async function onDisable(ctx: ModuleContext) {
  console.log('Mobile Clinic module disabled');
}

export async function onUninstall(ctx: ModuleContext) {
  console.log('Mobile Clinic module uninstalled');
}