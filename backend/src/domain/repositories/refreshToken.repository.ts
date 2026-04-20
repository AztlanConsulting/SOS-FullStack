import type { RefreshToken } from '../models/refreshToken.model';
import type { Types } from 'mongoose';

export interface RefreshTokenRepository {
  storeRefreshToken(token: RefreshToken): Promise<void>;
  revokeAllUserTokens(userId: Types.ObjectId): Promise<void>;
  findRefreshToken(token: string): Promise<RefreshToken | null>;
  revokeRefreshToken(token: string): Promise<void>;
}
