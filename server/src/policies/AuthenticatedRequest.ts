import { Request } from 'express';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    emailAddress: string;
    accessType: string; // e.g., 'admin', 'user'
  };
}
