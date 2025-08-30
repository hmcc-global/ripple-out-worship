import { Request, Response, NextFunction, RequestHandler } from 'express';
import { AuthenticatedRequest } from './AuthenticatedRequest';
import verifyToken from '../utils/verify-jwt';

const isLoggedIn: RequestHandler = (
  req: Request | AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  if (req.headers == null || req.headers['authorization'] == null) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const authHeaders = req.headers['authorization'].split(' ');
  if (authHeaders.length !== 2 || authHeaders[0] !== 'Bearer') {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const token = authHeaders[1];
  const decoded = verifyToken(token);
  // @ts-ignore
  req.user = decoded;

  next();
  return;
};

export default isLoggedIn;
