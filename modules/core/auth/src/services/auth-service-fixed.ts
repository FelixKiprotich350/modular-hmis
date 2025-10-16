export class AuthService {
  constructor(private db: any) {}

  async login(username: string, password: string) {
    // Mock implementation
    if (username === 'admin' && password === 'admin') {
      return {
        token: 'mock-token',
        user: { id: '1', username: 'admin' }
      };
    }
    throw new Error('Invalid credentials');
  }

  async validateToken(token: string) {
    // Mock implementation
    if (token === 'mock-token') {
      return { user: { id: '1', username: 'admin' } };
    }
    throw new Error('Invalid token');
  }
}