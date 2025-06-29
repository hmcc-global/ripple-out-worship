import { Navigate } from 'react-router-dom';
import { cloneElement, isValidElement, ReactElement, useMemo } from 'react';
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
  // TODO: Pass userObj as a prop to NavBar

  // check if Token exists in redux store
  const noTokenExists = useMemo(() => (user ? Object.keys(user).length === 0 : true), [user]);
  const noUser = permissions.includes('noUser');
  const isPublic = permissions.includes('public');
  const isRequireUser = permissions.includes('user');
  const isAdmin = permissions.includes('admin');
  const access = isPublic;
  // TODO: When accessType is implemented, uncomment this
  //   const access = isPublic || permissions.some(
  //   (p: any) => userObj != null && Object.keys(userObj).length !== 0 && p === userObj.accessType
  // );
  console.log(loading, noTokenExists);
  if (loading) {
    return <Skeleton />;
  }
  // If the route does not require a user
  if (noUser) {
    // If there is no token in the redux store
    if (noTokenExists) {
      // Render the children of the route
      return (
        <Box component="main" sx={{ flexGrow: 1 }}>
          {cloneElement(children)}
        </Box>
      );
    } else {
      // If there is a token, navigate to the page
      return <PageWithNavBar children={children} />;
    }
  }
  // If the route is accessible (public or matches user's access type)
  else if (access || isRequireUser) {
    // If there is no token in the redux store
    if (noTokenExists) {
      // Navigate to the login page
      return <Navigate to="/login" />;
    } else {
      return <PageWithNavBar children={children} />;
    }
  } else if (isAdmin && user?.accessType === 'admin') {
    // TODO: cleanup and refactor logic
    if (noTokenExists) {
      // Navigate to the login page
      return <Navigate to="/login" />;
    } else {
      return <PageWithNavBar children={children} />;
    }
  } else {
    // If the route is not accessible, render the error page
    return <ErrorPage />;
  }
};

export default PrivateRouteWrapper;
