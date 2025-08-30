import { Response, NextFunction, RequestHandler } from 'express';
import { AuthenticatedRequest } from './AuthenticatedRequest';

const isAdmin: RequestHandler = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  // Simulate a check for admin status
  const { accessType } = req.user;
  if (accessType != 'admin') {
    return res.status(403).json({ message: 'Forbidden' });
  }
  next();
  return;
};

export default isAdmin;
