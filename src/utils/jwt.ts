import { UserPayload } from '@/types/auth';
import jwt, { SignOptions } from 'jsonwebtoken';

export class JWTUtils {
  static sign(userId: string): string {
    const secret = process.env.JWT_SECRET! as string;
    const payload: UserPayload = { userId };
    const options: SignOptions = { expiresIn: '7d' };
    return jwt.sign(payload, secret, options);
  }

  static signRefresh(payload: object): string {
    return jwt.sign(payload, process.env.JWT_SECRET!!, { expiresIn: '30d' });
  }

  static verify(token: string): any {
    try {
      return jwt.verify(token, process.env.JWT_SECRET!!);
    } catch (error) {
      return null;
    }
  }

  static decode(token: string): any {
    try {
      return jwt.decode(token);
    } catch (error) {
      return null;
    }
  }

  static generateTokenPair(payload: UserPayload): { accessToken: string; refreshToken: string } {
    const accessToken = this.sign(payload.userId); // Short-lived access token
    const refreshToken = this.signRefresh({ userId: payload.userId });

    return { accessToken, refreshToken };
  }
}
