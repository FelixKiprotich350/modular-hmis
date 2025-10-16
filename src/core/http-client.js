"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.httpClient = exports.HttpClient = void 0;
class HttpClient {
    constructor() {
        this.baseUrls = new Map();
    }
    registerService(serviceName, baseUrl) {
        this.baseUrls.set(serviceName, baseUrl);
    }
    async call(serviceName, endpoint, options = {}) {
        const baseUrl = this.baseUrls.get(serviceName);
        if (!baseUrl) {
            throw new Error(`Service ${serviceName} not registered`);
        }
        const response = await fetch(`${baseUrl}${endpoint}`, {
            headers: { 'Content-Type': 'application/json', ...options.headers },
            ...options
        });
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        return response.json();
    }
}
exports.HttpClient = HttpClient;
exports.httpClient = new HttpClient();
