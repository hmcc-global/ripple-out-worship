import { Navigate, useLocation } from 'react-router-dom';
import {
  cloneElement,
  isValidElement,
  ReactElement,
  useEffect,
  useState,
  useTransition,
} from 'react';
import { Box, Skeleton } from '@mui/material';
import ErrorPage from './ErrorPage';
import Sidebar from '../navigation/Sidebar';
import { useUser } from '../../helpers/customHooks';
import { drawerWidth, mobileNavbarHeight } from '../../constants';

interface PrivateRouteProps {
  children: ReactElement;
  permissions: string[];
}

const PageWithNavBar = ({ children }: { children: ReactElement }) => {
  if (isValidElement(children)) {
    // Render the navbar, sidebar, and the children of the route
    return (
      <>
        <Box component="main" display="flex" width="100%" height="100%" sx={{ flexGrow: 1 }}>
          <Sidebar />
          <Box
            overflow="auto"
            sx={{
              height: { xs: `calc(100% - ${mobileNavbarHeight})`, md: '100%' },
              width: { xs: '100%', md: `calc(100% - ${drawerWidth})` },
            }}
          >
            {cloneElement(children)}
          </Box>
        </Box>
      </>
    );
  } else {
    // If the children is not a valid React element, render the error page
    return <ErrorPage />;
  }
};

const PrivateRouteWrapper = ({ children, permissions }: PrivateRouteProps) => {
  const { user, loading } = useUser();
  const location = useLocation();

  const [isPending, startTransition] = useTransition();
  const [isChecking, setIsChecking] = useState(true);
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    //TODO: not needed?
    isAdmin: false,
  });

  // Update auth state with transition to prevent UI flickering
  useEffect(() => {
    setIsChecking(true);
    if (!loading) {
      startTransition(() => {
        setAuthState({
          isAuthenticated: !!user && Object.keys(user).length > 0,
          isAdmin: user?.accessType === 'admin',
        });
        setIsChecking(false);
      });
    }
  }, [user, loading]);

  // Extract route requirements
  const requiresNoUser = permissions.includes('noUser');
  const requiresUser = permissions.includes('user');
  const requiresAdmin = permissions.includes('admin');
  const isPublic = permissions.includes('public');

  const { isAuthenticated, isAdmin } = authState;

  // Show loading state while determining auth status or during transition
  if (loading || isPending || isChecking) {
    return <Skeleton />;
  }
  // CASE 2: Routes that don't care about auth status (public routes)
  if (isPublic && isAuthenticated) {
    return <PageWithNavBar children={children} />;
  }

  // CASE 3: Routes that specifically require NO user (exclusive guest routes)
  if (requiresNoUser) {
    if (!isAuthenticated) {
      return (
        <Box component="main" sx={{ flexGrow: 1 }}>
          {cloneElement(children)}
        </Box>
      );
    } else {
      // User is logged in but route requires no user
      return <Navigate to="/" replace />;
    }
  }

  // CASE 4: Routes that require any authenticated user
  if (requiresUser) {
    if (isAuthenticated) {
      return <PageWithNavBar children={children} />;
    } else {
      // Redirect to login if not authenticated
      return <Navigate to="/login" state={{ from: location.pathname }} replace />;
    }
  }

  // CASE 5: Routes that require admin access
  if (requiresAdmin) {
    if (isAuthenticated && isAdmin) {
      return <PageWithNavBar children={children} />;
    } else if (isAuthenticated) {
      // User is logged in but not admin
      return <ErrorPage />;
    } else {
      // Not logged in at all
      return <Navigate to="/login" state={{ from: location.pathname }} replace />;
    }
  }

  // Default - access denied
  return <ErrorPage />;
};

export default PrivateRouteWrapper;
