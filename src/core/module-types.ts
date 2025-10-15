import { Express } from 'express';
import { PrismaClient } from '@prisma/client';
import { EventBus } from './event-bus';
import { HttpClient } from './http-client';

export interface ModuleManifest {
  name: string;
  version: string;
  description: string;
  entry: string;
  migrationsDir?: string;
  privilegesFile?: string;
  enabled: boolean;
  dependencies?: string[];
}

export interface ModuleContext {
  app: Express;
  db: PrismaClient;
  registerService: (name: string, impl: any) => void;
  getService: (name: string) => any;
  registerPrivileges: (privileges: string[]) => Promise<void>;
  runMigrations: (path: string, moduleName?: string) => Promise<void>;
  hasPrivilege: (userId: string, privilege: string) => Promise<boolean>;
  moduleRegistry: ModuleRegistry;
  eventBus: EventBus;
  httpClient: HttpClient;
}

export interface ModuleRegistry {
  register: (name: string, module: { manifest: ModuleManifest; path: string }) => void;
  get: (name: string) => { manifest: ModuleManifest; path: string } | undefined;
  list: () => Array<{ name: string; manifest: ModuleManifest; path: string }>;
}

export interface ModuleExports {
  register: (ctx: ModuleContext) => Promise<void>;
  onEnable?: (ctx: ModuleContext) => Promise<void>;
  onDisable?: (ctx: ModuleContext) => Promise<void>;
  onUninstall?: (ctx: ModuleContext) => Promise<void>;
}