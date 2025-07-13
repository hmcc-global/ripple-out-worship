import { Setlist } from '#/types/setlist.types';
import { Container, Box, Typography, Button, styled, Snackbar, IconButton } from '@mui/material';
import axios from 'axios';
import { FC, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Edit, Link, Launch, Close } from '@mui/icons-material';
import SetlistPreview from './SetlistPreview';
import SetlistSongsTable from '../SetlistSongTable';

const ActionButton = styled(Button)(({ theme }) => ({
  borderRadius: '6.25rem',
  color: theme.palette.secondary.main,
  borderColor: theme.palette.secondary.main,
  padding: '0.5rem 1.5rem',
}));

const formatDate = (dateString: string) => {
  return new Date(dateString).toISOString().split('T')[0];
};

const SetlistViewContainer: FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [setlist, setSetlist] = useState<Setlist | null>(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });

  const fetchSetlist = async () => {
    if (!id) return;

    try {
      const { data } = await axios.get('/api/setlists/get', { params: { id } });
      setSetlist(data);
    } catch (error) {
      console.error('Error fetching setlist:', error);
    }
  };

  const handleCopyLink = () => {
    const message = setlist?.publicLink ? 'Link copied to clipboard' : 'No public link available';

    if (setlist?.publicLink) {
      navigator.clipboard.writeText(setlist.publicLink);
    }

    setSnackbar({ open: true, message });
  };

  const handleCloseSnackbar = (_: any, reason?: string) => {
    if (reason === 'clickaway') return;
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  useEffect(() => {
    fetchSetlist();
  }, [id]);

  if (!id || !setlist) return null;

  return (
    <Container sx={{ display: 'flex', width: '100%' }} disableGutters>
      {/* Main Content */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '53%' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <Typography variant="h2">{setlist.name}</Typography>
          <Typography variant="caption">
            Created on {formatDate(setlist.date.toString())}
          </Typography>
        </Box>

        <Box display="flex" flexDirection={'row'} justifyContent={'flex-start'} gap={'0.5rem'}>
          <ActionButton
            startIcon={<Edit />}
            variant="outlined"
            onClick={() => navigate(`/setlist/edit/${id}`)}
          >
            Edit Setlist
          </ActionButton>
          <ActionButton startIcon={<Link />} variant="outlined" onClick={handleCopyLink}>
            Copy Link
          </ActionButton>
          <ActionButton
            startIcon={<Launch />}
            variant="outlined"
            onClick={() => navigate(`/setlist/view/${id}`)}
          >
            View in Browser
          </ActionButton>
        </Box>

        <SetlistSongsTable songList={setlist.songs} readOnly />
      </Box>

      {/* Preview Panel */}
      <Box width="47%">
        <SetlistPreview />
      </Box>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={5000}
        onClose={handleCloseSnackbar}
        message={snackbar.message}
        action={
          <IconButton size="small" color="inherit" onClick={handleCloseSnackbar}>
            <Close fontSize="small" />
          </IconButton>
        }
      />
    </Container>
  );
};

export default SetlistViewContainer;
