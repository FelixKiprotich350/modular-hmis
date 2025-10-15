import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { serviceRegistry } from "../../../../../src/core/service-registry";

export class AuthService {
  private jwtSecret = process.env.JWT_SECRET || "your-jwt-secret-key";
  private jwtExpiry = "24h";

  constructor(private db: PrismaClient) {}

  async login(username: string, password: string) {
    const userService = serviceRegistry.get("UserService");
    const user = await userService.getUserByUsername(username);

    if (!user) {
      throw new Error("Invalid username or password");
    }

    const isValidPassword = await userService.validatePassword(
      password,
      user.password
    );

    if (!isValidPassword) {
      throw new Error("Invalid username or password");
    }

    const token = jwt.sign(
      {
        userId: user.id,
        username: user.username,
        email: user.email,
      },
      this.jwtSecret,
      { expiresIn: this.jwtExpiry } as jwt.SignOptions
    );

    // Store session
    await this.createSession(user.id, token);

    return {
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    };
  }

  async validateToken(token: string) {
    try {
      const decoded = jwt.verify(token, this.jwtSecret) as any;

      // Check if session exists
      const session = await this.db.$queryRaw`
        SELECT * FROM user_sessions 
        WHERE user_id = ${decoded.userId} 
        AND token_hash = ${this.hashToken(token)}
        AND expires_at > NOW()
      `;

      if (!session || (session as any[]).length === 0) {
        throw new Error("Session not found or expired");
      }

      const userService = serviceRegistry.get("UserService");
      const user = await userService.getUser(decoded.userId);

      return { valid: true, user };
    } catch (error) {
      throw new Error("Invalid or expired token");
    }
  }

  async refreshToken(oldToken: string) {
    const decoded = jwt.verify(oldToken, this.jwtSecret) as any;

    const newToken = jwt.sign(
      {
        userId: decoded.userId,
        username: decoded.username,
        email: decoded.email,
      },
      this.jwtSecret,
      { expiresIn: this.jwtExpiry } as jwt.SignOptions
    );

    // Update session
    await this.updateSession(decoded.userId, oldToken, newToken);

    return newToken;
  }

  private async createSession(userId: string, token: string) {
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);

    await this.db.$executeRaw`
      INSERT INTO user_sessions (user_id, token_hash, expires_at, created_at, last_accessed)
      VALUES (${userId}, ${this.hashToken(token)}, ${expiresAt}, NOW(), NOW())
    `;
  }

  private async updateSession(
    userId: string,
    oldToken: string,
    newToken: string
  ) {
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);

    await this.db.$executeRaw`
      UPDATE user_sessions 
      SET token_hash = ${this.hashToken(
        newToken
      )}, expires_at = ${expiresAt}, last_accessed = NOW()
      WHERE user_id = ${userId} AND token_hash = ${this.hashToken(oldToken)}
    `;
  }

  private hashToken(token: string): string {
    return require("crypto").createHash("sha256").update(token).digest("hex");
  }
}
