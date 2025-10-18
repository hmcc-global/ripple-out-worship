import { Router, RequestHandler } from 'express';
import { createPermissionMiddleware } from './permissionMiddleware';

/**
 * Enhanced router that automatically applies permissions based on configuration
 */
export class PermissionRouter {
  private router: Router;
  private basePath: string;

  constructor(basePath: string = '') {
    this.router = Router();
    this.basePath = basePath;
  }

  /**
   * Applies route with automatic permission middleware
   */
  private applyRoute(
    method: 'get' | 'post' | 'put' | 'delete' | 'patch',
    path: string,
    handlers: RequestHandler[]
  ) {
    const fullPath = `${this.basePath}${path}`;
    const permissionMiddlewares = createPermissionMiddleware(method.toUpperCase(), fullPath);
    
    // Combine permission middlewares with route handlers
    const allHandlers = [...permissionMiddlewares, ...handlers];
    
    this.router[method](path, ...allHandlers);
  }

  get(path: string, ...handlers: RequestHandler[]) {
    this.applyRoute('get', path, handlers);
    return this;
  }

  post(path: string, ...handlers: RequestHandler[]) {
    this.applyRoute('post', path, handlers);
    return this;
  }

  put(path: string, ...handlers: RequestHandler[]) {
    this.applyRoute('put', path, handlers);
    return this;
  }

  delete(path: string, ...handlers: RequestHandler[]) {
    this.applyRoute('delete', path, handlers);
    return this;
  }

  patch(path: string, ...handlers: RequestHandler[]) {
    this.applyRoute('patch', path, handlers);
    return this;
  }

  /**
   * Get the underlying Express router
   */
  getRouter(): Router {
    return this.router;
  }
}

/**
 *  Function to create a permission-aware router
 */
export const createPermissionRouter = (basePath: string = ''): PermissionRouter => {
  return new PermissionRouter(basePath);
};
