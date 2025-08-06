import { Container, Box, Stack, Typography, Button } from '@mui/material';
import { FC, ReactElement, useState, useEffect, useCallback } from 'react';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import { useNavigate } from 'react-router-dom';
import { SongViewSchema } from '../../types/song.types';
import axios, { AxiosResponse } from 'axios';
import SongsTitleCard from './SongsTitleCard';
import SongsButtonCard from './SongsButtonsCard';
import SongsInfoCard from './SongsInfoCard';
import { useUser } from '../../helpers/customHooks';
import useMediaQuery from '@mui/material/useMediaQuery';
import {
  specificSongsTabletWidth,
  specificSongsDesktopWidth,
  mobileNavbarHeight,
} from '../../constants';

const SongsViewContainer: FC = (): ReactElement => {
  const navigate = useNavigate();
  const isMobile = useMediaQuery(`(max-width:${specificSongsTabletWidth})`);

  // Get user information
  const { user } = useUser();

  const id: string = window.location.pathname.split('/')[2];
  const [song, setSong] = useState<SongViewSchema>();

  const getSongs = useCallback(async () => {
    const response: AxiosResponse<SongViewSchema> = await axios.get(`/api/songs/get`, {
      params: { id: id },
    });
    const { data, status } = response;
    try {
      if (status === 200) {
        setSong(data);
      }
    } catch (error) {
      console.log(error);
    }
  }, [id]);

  useEffect(() => {
    getSongs();
  }, [getSongs]);

  return (
    <>
      {isMobile && (
        <Box
          display="flex"
          alignItems="center"
          sx={{
            cursor: 'pointer',
            mt: 2,
            ml: 1,
            padding: 0,
          }}
          onClick={() => navigate('/song')}
        >
          <ArrowLeftIcon sx={{ mr: 0.5 }} fontSize="small" />
          <Typography
            sx={{
              fontSize: '12px',
              color: '#D1D1D1',
              fontWeight: 500,
              fontFamily: 'DM Sans, sans-serif',
            }}
          >
            Back to Songs
          </Typography>
        </Box>
      )}
      <Container
        maxWidth={false}
        sx={{
          paddingTop: { xs: '1em', md: '3em' },
          width: '100%',
          paddingLeft: 0,
          paddingRight: 0,
          pb: isMobile ? `${mobileNavbarHeight}px` : 0,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: ['0.1em', '0.3em'],
          }}
        >
          <Box sx={{ width: '100' }}>
            <SongsTitleCard song={song} />
          </Box>
          {!isMobile && user?.accessType === 'admin' && (
            <Button
              variant="outlined"
              onClick={() => navigate(`/song/edit/${id}`)}
              sx={{
                borderWidth: '2px',
                padding: '10px 25px',
                borderRadius: '40px',
                borderColor: '#938F99',
                color: '#D0BCFF',
                textTransform: 'none',
              }}
            >
              <Typography variant="subtitle1">Edit Song</Typography>
            </Button>
          )}
        </Box>
        <Stack direction={['row']}>
          {isMobile && (
            <Box sx={{ marginBottom: ['10px', '15vh'], width: '100%' }}>
              <SongsButtonCard song={song} />
            </Box>
          )}
          {!isMobile && (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                [`@media (max-width:${specificSongsDesktopWidth})`]: {
                  flexDirection: 'column',
                },
              }}
            >
              <Box
                sx={{
                  [`@media (max-width:${specificSongsDesktopWidth})`]: {
                    width: '100%',
                    marginBottom: '20px',
                  },
                  [`@media (min-width:${specificSongsDesktopWidth})`]: {
                    width: '70%',
                    marginBottom: '20px',
                  },
                }}
              >
                <SongsButtonCard song={song} />
              </Box>
              <Box
                sx={{
                  [`@media (max-width:${specificSongsDesktopWidth})`]: {
                    width: '50%',
                    marginBottom: '20px',
                  },
                  [`@media (min-width:${specificSongsDesktopWidth})`]: {
                    width: '30%',
                  },
                }}
              >
                <SongsInfoCard song={song} />
              </Box>
            </Box>
          )}
        </Stack>
      </Container>
    </>
  );
};
export default SongsViewContainer;
