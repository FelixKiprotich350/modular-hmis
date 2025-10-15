export class ServiceRegistry {
  private services = new Map<string, any>();

  register(name: string, impl: any) {
    this.services.set(name, impl);
  }

  get(name: string) {
    return this.services.get(name);
  }

  has(name: string): boolean {
    return this.services.has(name);
  }

  list(): string[] {
    return Array.from(this.services.keys());
  }
}

export const serviceRegistry = new ServiceRegistry();