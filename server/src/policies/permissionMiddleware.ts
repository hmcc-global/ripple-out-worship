import { Request, Response, NextFunction, RequestHandler } from 'express';
import { AccessType, ROUTE_PERMISSIONS } from './permissions.config';
import verifyToken from '../utils/verify-jwt';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    emailAddress: string;
    accessType: string;
  };
}

/**
 * Creates a permission middleware based on the route's permission configuration
 */
export const createPermissionMiddleware = (
  method: string,
  path: string
): RequestHandler[] => {
  const routeKey = `${method.toUpperCase()} ${path}`;
  const config = ROUTE_PERMISSIONS[routeKey];

  if (!config) {
    // If no config found, default to requiring authentication
    console.warn(`No permission config found for route: ${routeKey}`);
    return [requireAuth];
  }

  const middlewares: RequestHandler[] = [];

  // Always add auth check if required
  if (config.requiresAuth) {
    middlewares.push(requireAuth);
    
    // Add access type check if specified
    if (config.allowedAccessTypes && config.allowedAccessTypes.length > 0) {
      middlewares.push(requireAccessType(config.allowedAccessTypes));
    }
  }

  return middlewares;
};

/**
 * Authentication middleware - checks for valid JWT token, i.e. isLoggedIn
 */
const requireAuth: RequestHandler = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  if (req.headers == null || req.headers['authorization'] == null) {
    return res.status(401).json({ 
      message: 'Unauthorized',
      error: 'No authorization header provided'
    });
  }

  const authHeaders = req.headers['authorization'].split(' ');
  if (authHeaders.length !== 2 || authHeaders[0] !== 'Bearer') {
    return res.status(401).json({ 
      message: 'Unauthorized',
      error: 'Invalid authorization header format. Expected: Bearer <token>'
    });
  }

  try {
    const token = authHeaders[1];
    const decoded = verifyToken(token);
    
    if (!decoded) {
      return res.status(401).json({ 
        message: 'Unauthorized',
        error: 'Invalid token'
      });
    }
    req.user = decoded;
    next();
    return;
  } catch (error) {
    return res.status(401).json({ 
      message: 'Unauthorized',
      error: 'Invalid or expired token'
    });
  }
};

/**
 * Access type middleware factory - checks if user has required access type
 */
const requireAccessType = (allowedTypes: AccessType[]): RequestHandler => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ 
        message: 'Unauthorized',
        error: 'No user information found'
      });
    }

    const { accessType } = req.user;
    
    if (!allowedTypes.includes(accessType as AccessType)) {
      return res.status(403).json({ 
        message: 'Forbidden',
        error: `Access denied. Required access types: ${allowedTypes.join(', ')}. Your access type: ${accessType}`
      });
    }

    next();
    return;
  };
};
