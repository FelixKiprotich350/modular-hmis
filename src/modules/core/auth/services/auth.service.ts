import { PrismaClient } from '@prisma/client';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcryptjs';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    username: string;
    roles: string[];
  };
}

export interface JwtPayload {
  userId: string;
  username: string;
  roles: string[];
}

export class AuthService {
  private readonly jwtSecret = process.env.JWT_SECRET || 'fallback-secret';
  private readonly jwtExpiry = '24h';

  constructor(private db: PrismaClient) {}

  async login(data: LoginRequest): Promise<AuthResponse | null> {
    const user = await this.db.user.findUnique({
      where: { username: data.username },
      include: {
        roles: {
          include: { role: true }
        }
      }
    });

    if (!user || !await bcrypt.compare(data.password, user.password)) {
      return null;
    }

    const roles = user.roles.map(ur => ur.role.name);
    const payload: JwtPayload = {
      userId: user.id,
      username: user.username,
      roles
    };

    const token = jwt.sign(payload, this.jwtSecret, { expiresIn: this.jwtExpiry });

    return {
      token,
      user: {
        id: user.id,
        username: user.username,
        roles
      }
    };
  }

  async validateToken(token: string): Promise<JwtPayload | null> {
    try {
      const payload = jwt.verify(token, this.jwtSecret) as JwtPayload;
      return payload;
    } catch {
      return null;
    }
  }

  async logout(token: string): Promise<boolean> {
    // In production, add token to blacklist
    return true;
  }

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}