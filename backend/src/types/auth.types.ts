import { Request } from 'express';

export type UserRole = 'ADMIN' | 'MANAGER' | 'STAFF';

export interface IUserResponse {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
}

export interface JwtAccessPayload {
  userId: string;
  role: UserRole;
  tokenType: 'access';
}

export interface JwtRefreshPayload {
  userId: string;
  tokenId: string;
  tokenType: 'refresh';
}

export interface AuthenticatedRequest extends Request {
  user?: IUserResponse;
}
