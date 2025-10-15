export class HttpClient {
  private baseUrls = new Map<string, string>();

  registerService(serviceName: string, baseUrl: string) {
    this.baseUrls.set(serviceName, baseUrl);
  }

  async call(serviceName: string, endpoint: string, options: RequestInit = {}) {
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

export const httpClient = new HttpClient();