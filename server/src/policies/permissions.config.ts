export type AccessType = 'ministry' | 'admin';

export interface PermissionConfig {
  requiresAuth: boolean;
  allowedAccessTypes?: AccessType[];
  description?: string;
}

// Centralized permissions configuration
/**
 * By default, there is a hierarchy in this accessTypes
 * Admin > tc > t3ch > ministry > isLoggedIn
 * But this permission schema will not follow the ones in the main web.
 * It will use the more conventional approach, i.e. only the access types listed can access it.
 * Please make sure the proper access level are listed.
 */
// TODO: Confirm on which access types can do what
export const ROUTE_PERMISSIONS: Record<string, PermissionConfig> = {
  // Ownership routes
  'POST /ownerships/create': {
    requiresAuth: true,
    description: 'Create ownership record',
  },
  'GET /ownerships/get': {
    requiresAuth: true,
    description: 'View ownership records',
  },
  'PUT /ownerships/update': {
    requiresAuth: true,
    description: 'Update ownership record',
  },
  'PUT /ownerships/delete': {
    requiresAuth: true,
    description: 'Delete ownership record',
  },

  // Group routes
  'POST /groups/create': {
    requiresAuth: true,
    description: 'Create new group',
  },
  'GET /groups/get': {
    requiresAuth: true,
    description: 'View groups',
  },
  'PUT /groups/update': {
    requiresAuth: true,
    description: 'Update group',
  },
  'PUT /groups/delete': {
    requiresAuth: true,
    description: 'Delete group',
  },

  // Setlist routes
  'POST /setlists/create': {
    requiresAuth: true,
    description: 'Create new setlist',
  },
  'GET /setlists/get': {
    requiresAuth: true,
    description: 'View setlists',
  },
  'PUT /setlists/update': {
    requiresAuth: true,
    description: 'Update setlist',
  },
  'PUT /setlists/delete': {
    requiresAuth: true,
    description: 'Delete setlist',
  },

  // Song routes
  'POST /songs/create': {
    requiresAuth: true,
    allowedAccessTypes: ['admin', 'ministry'],
    description: 'Create new song',
  },
  'GET /songs/get': {
    requiresAuth: true,
    allowedAccessTypes: ['admin', 'ministry'],
    description: 'View songs (admin view)',
  },
  'GET /songs/get-view': {
    requiresAuth: false, // Public view
    description: 'Public song view',
  },
  'PUT /songs/update': {
    requiresAuth: true,
    allowedAccessTypes: ['admin', 'ministry'],
    description: 'Update song',
  },
  'PUT /songs/delete': {
    requiresAuth: true,
    allowedAccessTypes: ['admin', 'ministry'],
    description: 'Delete song',
  },
  'GET /songs/search': {
    requiresAuth: false,
    description: 'Search songs',
  },

  // Song Options routes
  'POST /song-options/create': {
    requiresAuth: true,
    allowedAccessTypes: ['admin', 'ministry'],
    description: 'Create song option',
  },
  'GET /song-options/get': {
    requiresAuth: true,
    allowedAccessTypes: ['admin', 'ministry'],
    description: 'Get specific song option',
  },
  'GET /song-options/list': {
    requiresAuth: true,
    allowedAccessTypes: ['admin', 'ministry'],
    description: 'List all song options',
  },
  'PUT /song-options/update': {
    requiresAuth: true,
    allowedAccessTypes: ['admin', 'ministry'],
    description: 'Update song option',
  },
  'PUT /song-options/delete': {
    requiresAuth: true,
    allowedAccessTypes: ['admin', 'ministry'],
    description: 'Delete song option',
  },
};
