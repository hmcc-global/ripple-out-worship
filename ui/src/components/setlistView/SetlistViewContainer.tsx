import { ReactElement, useEffect, useState } from 'react';
import { Box, Container, Skeleton, Typography, useMediaQuery, useTheme } from '@mui/material';
import { customAxios as axios } from '../custom/customAxios';
import { Setlist } from '../../types/setlist.types';
import SetlistViewSongs from './SetlistViewSongs';
import { SetlistViewHeader, SetlistViewFooter } from './SetlistViewPaper';
import SetlistViewHeaderMenu from './SetlistViewHeaderMenu';

interface SetlistViewContainerProps {
  isSetlistPreview?: boolean;
}

const SetlistViewContainer = ({
  isSetlistPreview = false,
}: SetlistViewContainerProps): ReactElement | null => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm')) || isSetlistPreview;

  const [setlist, setSetlist] = useState<Setlist>();
  const [loading, setLoading] = useState(true);

  // Extract setlist ID from URL
  const getSetlistId = (): string => {
    const pathname = window.location.pathname;
    const pattern = isSetlistPreview
      ? /^\/setlist\/([^/]+)(?:\/|$)/
      : /^\/setlist\/view\/([^/]+)(?:\/|$)/;

    const match = pathname.match(pattern);

    if (!match) {
      console.warn(`No setlistId found in pathname: ${pathname}`);
      return '';
    }

    return match[1];
  };

  const setlistId = getSetlistId();

  // Fetch setlist data
  useEffect(() => {
    if (!setlistId) return;

    const fetchSetlist = async () => {
      try {
        const { data } = await axios.get<Setlist>('/api/setlists/get', {
          params: { id: setlistId },
        });
        setSetlist(data);
      } catch (error) {
        console.error('Error fetching setlist:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSetlist();
  }, [setlistId]);

  // Early returns for edge cases
  if (!setlistId) return <Box />;

  if (loading) {
    return (
      <Container
        sx={{
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Skeleton variant="rectangular" width="100%" height="60%" />
      </Container>
    );
  }

  if (!setlist) {
    return (
      <Container
        sx={{
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography variant="h6" color="error">
          Setlist not found
        </Typography>
      </Container>
    );
  }

  // Dynamic styles based on preview mode
  const containerStyles = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    rowGap: { xs: '1rem', lg: '1.5rem' },
    width: isSetlistPreview ? '100%' : '100vw',
    maxWidth: isSetlistPreview ? '100%' : '100vw',
    height: isSetlistPreview ? 'calc(100vh - 7vh - 2.25rem)' : '100vh',
    maxHeight: isSetlistPreview ? 'calc(100vh - 7vh - 2.25rem)' : '100vh',
  };

  const headerContainerStyles = {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  };

  const mainContainerStyles = {
    width: '100%',
    height: '100%',
    maxHeight: '100%',
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    overflow: 'hidden',
  };

  return (
    <Box sx={containerStyles}>
      {/* Header */}
      <SetlistViewHeader isMobile={isMobile}>
        <Container maxWidth="xl" sx={headerContainerStyles}>
          <Typography variant="h3">{setlist.name}</Typography>
          <SetlistViewHeaderMenu setlistId={setlistId} />
        </Container>
      </SetlistViewHeader>

      {/* Main Content */}
      <Container maxWidth="xl" sx={mainContainerStyles}>
        <SetlistViewSongs songs={setlist.songs || []} userHeader={true} userView={true} />
      </Container>

      {/* Footer - only show in full view */}
      {!isSetlistPreview && (
        <SetlistViewFooter sx={{ flexShrink: 0 }}>Created by Ripple Out Worship</SetlistViewFooter>
      )}
    </Box>
  );
};

export default SetlistViewContainer;
