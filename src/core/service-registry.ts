import { Injectable } from '@nestjs/common';

@Injectable()
export class ServiceRegistry {
  private services = new Map<string, any>();

  register<T>(name: string, service: T): void {
    this.services.set(name, service);
  }

  get<T>(name: string): T | undefined {
    return this.services.get(name) as T;
  }

  has(name: string): boolean {
    return this.services.has(name);
  }
}