import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PrismaClient } from '@prisma/client';
import { loadModules } from './core/module-loader';
import { serviceRegistry } from './core/service-registry';
import { moduleRegistry } from './core/module-registry';
import { eventBus } from './core/event-bus';
import { httpClient } from './core/http-client';
import { runMigrations } from './core/migration-runner';
import { ModuleContext } from './core/module-types';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const db = new PrismaClient();
  
  await db.$connect();

  // Register privileges helper
  const registerPrivileges = async (privileges: string[]) => {
    for (const name of privileges) {
      await db.privilege.upsert({
        where: { name },
        update: {},
        create: { name }
      });
    }
  };

  // Has privilege helper
  const hasPrivilege = async (userId: string, privilege: string): Promise<boolean> => {
    const user = await db.user.findUnique({
      where: { id: userId },
      include: {
        roles: {
          include: {
            role: {
              include: {
                privileges: {
                  include: {
                    privilege: true
                  }
                }
              }
            }
          }
        }
      }
    });

    if (!user) return false;

    const userPrivileges = user.roles
      .flatMap(ur => ur.role.privileges)
      .map(rp => rp.privilege.name);

    return userPrivileges.includes(privilege);
  };

  // Create module context
  const moduleContext: ModuleContext = {
    app: app.getHttpAdapter().getInstance(),
    db,
    registerService: serviceRegistry.register.bind(serviceRegistry),
    getService: serviceRegistry.get.bind(serviceRegistry),
    registerPrivileges,
    runMigrations: (path: string, moduleName?: string) => runMigrations(db, path, moduleName || 'unknown'),
    hasPrivilege,
    moduleRegistry,
    eventBus,
    httpClient
  };

  // Load modules
  await loadModules(moduleContext);

  await app.listen(3000);
  console.log('Application is running on: http://localhost:3000');
}

bootstrap();