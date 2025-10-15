import * as fs from 'fs';
import * as path from 'path';
import { PrismaClient } from '@prisma/client';

export async function runMigrations(db: PrismaClient, migrationsDir: string, moduleName: string) {
  if (!fs.existsSync(migrationsDir)) {
    return;
  }

  const files = fs.readdirSync(migrationsDir)
    .filter(f => f.endsWith('.sql'))
    .sort();

  for (const file of files) {
    const applied = await db.moduleMigrationLog.findFirst({
      where: { module: moduleName, file }
    });

    if (applied) {
      continue;
    }

    const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8');
    
    try {
      const statements = sql.split(';').filter(s => s.trim());
      for (const statement of statements) {
        if (statement.trim()) {
          await db.$executeRawUnsafe(statement.trim());
        }
      }
      await db.moduleMigrationLog.create({
        data: {
          module: moduleName,
          file,
          appliedAt: new Date()
        }
      });
      console.log(`Applied migration ${file} for module ${moduleName}`);
    } catch (error) {
      console.error(`Failed to apply migration ${file} for module ${moduleName}:`, error);
      throw error;
    }
  }
}