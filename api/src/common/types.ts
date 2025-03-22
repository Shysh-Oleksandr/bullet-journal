import { Request } from 'express';
import { JwtUser } from '../auth/jwt.strategy';

/**
 * Extends the Express Request interface to include the authenticated user
 * This type should be used in all controllers that require authentication
 */
export interface RequestWithUser extends Request {
  user: JwtUser;
}
