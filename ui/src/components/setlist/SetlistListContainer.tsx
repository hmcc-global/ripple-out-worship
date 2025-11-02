import { Add, ExpandMore, QueueMusic } from '@mui/icons-material';
import { Box, Button, Container, Stack, Typography, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { FC, ReactElement, useState, MouseEvent, useMemo } from 'react';
import SetlistAdminViewContainer from './adminView/SetlistAdminViewContainer';
import SetlistTabsContainer from './SetlistTabsContainer';
import PageHeader from '../navigation/PageHeader';
import SetlistPreview from './adminView/SetlistPreview';
import SetlistActionMenu from './SetlistPageActionMenu';
import {
  DESKTOP_PAGE_HEADER_HEIGHT,
  DESKTOP_SIDEBAR_WIDTH,
  MOBILE_NAVBAR_HEIGHT,
  MOBILE_PAGE_HEADER_HEIGHT,
  TABLET_PAGE_HEADER_HEIGHT,
} from '../../constants';

// Separate component for the "New" button
const CreateButton: FC<{ onClick: (e: MouseEvent<HTMLElement>) => void; isOpen: boolean }> = ({
  onClick,
  isOpen,
}) => (
  <Button
    variant="outlined"
    onClick={onClick}
    startIcon={<Add />}
    endIcon={
      <ExpandMore
        sx={{
          transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
          transition: 'transform 0.2s ease-in-out',
        }}
      />
    }
    sx={{
      border: 0,
      padding: '10px 25px',
      borderRadius: '40px',
      backgroundColor: '#D0BCFF',
      color: '#381E72',
      textTransform: 'none',
      '&:hover': {
        backgroundColor: '#D0BCFF',
        opacity: '0.95',
      },
      transition: 'all 0.1s ease-in-out',
    }}
  >
    <Typography variant="subtitle1" fontWeight={700}>
      New
    </Typography>
  </Button>
);

// Desktop layout with side-by-side preview
const DesktopLayout: FC = () => (
  <Stack direction="row" width="100%" height="100%" gap="1rem">
    <SetlistTabsContainer />
    <Box display="flex" width="70%" height="100%" gap={0} sx={{ overflow: 'hidden' }}>
      <Box flex="1 1 50%" height="100%">
        <SetlistAdminViewContainer />
      </Box>
      <Box flex="1 1 50%" height="100%">
        <SetlistPreview />
      </Box>
    </Box>
  </Stack>
);

// Tablet layout with single column view
const TabletLayout: FC = () => (
  <Stack direction="row" width="100%" height="100%" gap="1rem">
    <SetlistTabsContainer />
    <Box width="55%" height="100%">
      <SetlistAdminViewContainer />
    </Box>
  </Stack>
);

// Mobile layout - tabs only
const MobileLayout: FC = () => <SetlistTabsContainer />;

const SetlistListContainer: FC = (): ReactElement => {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'lg'));
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [createAnchorEl, setCreateAnchorEl] = useState<null | HTMLElement>(null);

  const handleCreateClick = (event: MouseEvent<HTMLElement>) => {
    setCreateAnchorEl((prev) => (prev ? null : event.currentTarget));
  };

  // Calculate heights based on breakpoint
  const maxHeight = useMemo(() => {
    if (isMobile)
      return `calc(100vh - ${MOBILE_PAGE_HEADER_HEIGHT} - 2.25rem - ${MOBILE_NAVBAR_HEIGHT})`;
    if (isTablet) return `calc(100vh - ${TABLET_PAGE_HEADER_HEIGHT} - 2.25rem)`;
    return `calc(100vh - ${DESKTOP_PAGE_HEADER_HEIGHT} - 2.25rem)`;
  }, [isMobile, isTablet]);

  const containerMaxWidth = isMobile ? '100vw' : `calc(100vw - ${DESKTOP_SIDEBAR_WIDTH})`;
  const containerMaxHeight = isMobile ? `calc(100vh - ${MOBILE_NAVBAR_HEIGHT})` : '100vh';

  // Choose layout component
  const LayoutComponent = isDesktop ? DesktopLayout : isTablet ? TabletLayout : MobileLayout;

  return (
    <Container
      disableGutters
      sx={{
        py: '1rem',
        px: '1rem',
        width: '100%',
        minWidth: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        maxWidth: `${containerMaxWidth} !important`,
        maxHeight: `${containerMaxHeight} !important`,
        margin: 'auto',
        overflow: 'hidden',
      }}
    >
      <PageHeader
        title="Setlists"
        icon={<QueueMusic />}
        actionButtons={
          isDesktop || isTablet ? (
            <CreateButton onClick={handleCreateClick} isOpen={!!createAnchorEl} />
          ) : undefined
        }
      />

      <SetlistActionMenu anchorEl={createAnchorEl} setAnchorEl={setCreateAnchorEl} />

      <Box sx={{ flex: 1, maxHeight, overflow: 'hidden', display: 'flex' }}>
        <LayoutComponent />
      </Box>
    </Container>
  );
};

export default SetlistListContainer;
