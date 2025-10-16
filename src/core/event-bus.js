"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.eventBus = exports.EventBus = void 0;
class EventBus {
    constructor() {
        this.handlers = new Map();
    }
    subscribe(eventType, handler) {
        if (!this.handlers.has(eventType)) {
            this.handlers.set(eventType, []);
        }
        this.handlers.get(eventType).push(handler);
    }
    async publish(event) {
        const handlers = this.handlers.get(event.type) || [];
        await Promise.all(handlers.map(handler => handler(event)));
    }
}
exports.EventBus = EventBus;
exports.eventBus = new EventBus();
