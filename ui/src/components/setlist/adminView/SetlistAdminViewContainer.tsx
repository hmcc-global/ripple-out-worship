import { Setlist } from '#/types/setlist.types';
import { Box, Typography, Button, styled, Snackbar, IconButton } from '@mui/material';
import axios from 'axios';
import { FC, ReactElement, useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Edit, Link, Launch, Close } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import SetlistSongsTable from '../SetlistSongsTable';
import MobileBackButton from '../../navigation/MobileBackButton';

// Styled components
const ActionButton = styled(Button)(({ theme }) => ({
  borderRadius: '6.25rem',
  color: theme.palette.secondary.main,
  borderColor: theme.palette.secondary.main,
  minWidth: 'auto',
  fontWeight: 400,
  [theme.breakpoints.down('sm')]: {
    flex: 'none',
    padding: '0.5rem 1.5rem',
    fontSize: '0.75rem',
  },
  [theme.breakpoints.between('sm', 'xl')]: {
    flex: 1,
    padding: '0.5rem 1rem',
    fontSize: '0.75rem',
  },
  [theme.breakpoints.between('xl', 1920)]: {
    flex: 'none',
    padding: '0.75rem 2rem',
    fontSize: '0.875rem',
  },
  [theme.breakpoints.up(1800)]: {
    flex: 1,
    padding: '0.75rem 2rem',
    fontSize: '0.875rem',
  },
}));

const ButtonContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  gap: '0.5rem',
  maxWidth: '100%',
  overflow: 'hidden',
});

const HeaderContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',
  alignItems: 'flex-start',
});

const MainContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
  width: '100%',
  [theme.breakpoints.down('md')]: {
    padding: '1rem',
  },
  [theme.breakpoints.up('md')]: {
    padding: '0',
  },
}));

// Types
interface SnackbarState {
  open: boolean;
  message: string;
}

// Constants
const SNACKBAR_AUTO_HIDE_DURATION = 5000;
const SUBTITLE_COLOR = '#CAC4D0';

// Utility functions
const formatDate = (dateString: string): string => {
  return new Date(dateString).toISOString().split('T')[0];
};

const SetlistAdminViewContainer: FC = (): ReactElement | null => {
  const theme = useTheme();
  const isTablet = useMediaQuery(theme.breakpoints.between('md', 'xl'));
  const isDesktop = useMediaQuery(theme.breakpoints.up('xl'));
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // State
  const [setlist, setSetlist] = useState<Setlist | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState<SnackbarState>({
    open: false,
    message: '',
  });

  // API calls
  const fetchSetlist = useCallback(async () => {
    if (!id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const { data } = await axios.get('/api/setlists/get', { params: { id } });
      setSetlist(data);
    } catch (err) {
      console.error('Error fetching setlist:', err);
      setError('Failed to load setlist');
    } finally {
      setLoading(false);
    }
  }, [id]);

  // Event handlers
  // TODO-YY: FIX THIS COPY LINK - PUBLIC LINK IS NOT CORRECT
  const handleCopyLink = useCallback(async () => {
    if (!setlist?.publicLink) {
      setSnackbar({ open: true, message: 'No public link available' });
      return;
    }

    try {
      await navigator.clipboard.writeText(setlist.publicLink);
      setSnackbar({ open: true, message: 'Link copied to clipboard' });
    } catch (err) {
      console.error('Failed to copy link:', err);
      setSnackbar({ open: true, message: 'Failed to copy link' });
    }
  }, [setlist?.publicLink]);

  const handleEditClick = useCallback(() => {
    navigate(`/setlist/edit/${id}`);
  }, [navigate, id]);

  const handlePublicViewClick = useCallback(() => {
    navigate(`/setlist/view/${id}`);
  }, [navigate, id]);

  const handleCloseSnackbar = useCallback((_: any, reason?: string) => {
    if (reason === 'clickaway') return;
    setSnackbar((prev) => ({ ...prev, open: false }));
  }, []);

  // Effects
  useEffect(() => {
    fetchSetlist();
  }, [fetchSetlist]);

  // Early returns
  if (!id) return null;
  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!setlist) return <Typography>Setlist not found</Typography>;

  return (
    <>
      <MainContainer>
        <HeaderContainer>
          {!isTablet && !isDesktop && <MobileBackButton />}
          <Typography variant="h2">{setlist.name}</Typography>
          <Typography variant="subtitle2" sx={{ color: SUBTITLE_COLOR, fontWeight: 400 }}>
            Created on {formatDate(setlist.date.toString())}
          </Typography>
        </HeaderContainer>

        <ButtonContainer>
          <ActionButton startIcon={<Edit />} variant="outlined" onClick={handleEditClick}>
            {isTablet || isDesktop ? 'Edit Setlist' : 'Edit'}
          </ActionButton>
          <ActionButton startIcon={<Link />} variant="outlined" onClick={handleCopyLink}>
            {isTablet || isDesktop ? 'Copy Link' : 'Link'}
          </ActionButton>
          <ActionButton startIcon={<Launch />} variant="outlined" onClick={handlePublicViewClick}>
            {isTablet || isDesktop ? 'View on Browser' : 'Public View'}
          </ActionButton>
        </ButtonContainer>

        <SetlistSongsTable songList={setlist.songs} readOnly />
      </MainContainer>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={SNACKBAR_AUTO_HIDE_DURATION}
        onClose={handleCloseSnackbar}
        message={snackbar.message}
        action={
          <IconButton size="small" color="inherit" onClick={handleCloseSnackbar} aria-label="close">
            <Close fontSize="small" />
          </IconButton>
        }
      />
    </>
  );
};

export default SetlistAdminViewContainer;
