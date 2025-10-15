export interface Event {
  id: string;
  type: string;
  payload: any;
  timestamp: Date;
  source: string;
}

export class EventBus {
  private handlers = new Map<string, Array<(event: Event) => Promise<void>>>();

  subscribe(eventType: string, handler: (event: Event) => Promise<void>) {
    if (!this.handlers.has(eventType)) {
      this.handlers.set(eventType, []);
    }
    this.handlers.get(eventType)!.push(handler);
  }

  async publish(event: Event) {
    const handlers = this.handlers.get(event.type) || [];
    await Promise.all(handlers.map(handler => handler(event)));
  }
}

export const eventBus = new EventBus();