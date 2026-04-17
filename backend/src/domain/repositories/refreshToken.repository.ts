import type { RefreshToken } from '../models/refreshToken.model';
import type { Types } from 'mongoose';

export interface RefreshTokenRepository {
  storeRefreshToken(token: RefreshToken): Promise<void>;
  revokeAllUserTokens(userId: Types.ObjectId): Promise<void>;
}
