import { FC, ReactElement } from 'react';
import ProfileDesktopView from './ProfileDesktopView';
import ProfileMobileView from './ProfileMobileView';
import { useMediaQuery, useTheme } from '@mui/material';

const ProfileContainer: FC = (): ReactElement => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return isMobile ? <ProfileMobileView /> : <ProfileDesktopView />;
};

export default ProfileContainer;
