import { useMediaQuery, useTheme } from '@mui/material';
import SetlistViewContainerMobile from './SetlistViewContainerMobile';
import SetlistViewContainerDesktop from './SetlistViewContainerDesktop';

const SetlistViewContainer = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return isMobile ? <SetlistViewContainerMobile /> : <SetlistViewContainerDesktop />;
};

export default SetlistViewContainer;
