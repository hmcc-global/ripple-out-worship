import { Setlist } from '../../types/setlist.types';
import { SongViewSchema } from '../../types/song.types';
import {
  Box,
  Container,
  FormControl,
  Grid,
  MenuItem,
  Select,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';
import { FC, ReactElement, useEffect, useMemo, useState } from 'react';
import SongsButtonsCard from '../songsView/SongsButtonsCard';
import { HeaderSetlistView, SetlistViewFooter } from './SetlistViewPaper';
import SetlistViewMenuDesktop from './SetlistViewMenuDesktop';
import axios from 'axios';

const SetlistViewContainerDesktop: FC = (): ReactElement => {
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [selectedSong, setSelectedSong] = useState<SongViewSchema>();
  const [setlist, setSetlist] = useState<Setlist>();

  const setlistId = window.location.pathname.split('/').reverse()[0];
  const openMenu = Boolean(menuAnchor);
  const songs = useMemo(() => (setlist && setlist.songs) || [], [setlist]);

  const handleSelectSong = (song: SongViewSchema) => {
    setSelectedSong(song);
  };

  const handleOpenMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setMenuAnchor(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setMenuAnchor(null);
  };

  useEffect(() => {
    const fetchSetlists = async () => {
      try {
        const { data } = await axios.get<Setlist>('/api/setlists/get', {
          params: {
            id: setlistId,
          },
        });
        setSetlist(data);
      } catch (error) {
        console.error('Error fetching setlists:', error);
      }
    };
    fetchSetlists();
  }, [setlistId]);

  useEffect(() => {
    if (songs) {
      setSelectedSong(songs[0]);
    }
  }, [songs]);

  // TO-DO: add option to redirect to a selected song from link
  return (
    <Container
      style={{
        maxWidth: '100vw',
        width: '100%',
        height: '100%',
        padding: '0',
        overflow: 'hidden',
      }}
    >
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
        height="100%"
        maxHeight="100vh"
      >
        {setlist && songs ? (
          <Container
            maxWidth="xl"
            style={{
              height: '90vh',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* Setlist body */}
            <Grid container height="100%">
              {/* Song choice */}
              <Grid item xs={12}>
                {/* Header */}
                <HeaderSetlistView>
                  <Typography variant="h3">{setlist.name}</Typography>
                  <SetlistViewMenuDesktop />
                </HeaderSetlistView>
                <FormControl sx={{ pl: 3 }}>
                  <Select
                    id="song-select"
                    sx={{ borderRadius: '40px', px: 1, width: '400px' }}
                    value={selectedSong?._id}
                    onChange={(e) =>
                      setSelectedSong(songs.find((song) => song._id === e.target.value) || songs[0])
                    }
                  >
                    {songs.map((song) => {
                      return (
                        <MenuItem key={song._id} value={song._id}>
                          {song.title}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
              </Grid>
              {/* Song lyrics */}
              <Grid item xs={12} height="100%" overflow="auto" marginTop="8px">
                <Stack height="100%">
                  <SongsButtonsCard song={selectedSong} userView={true} userHeader={true} />
                </Stack>
              </Grid>
            </Grid>
          </Container>
        ) : (
          <Skeleton>loading ...</Skeleton>
        )}
        <SetlistViewFooter>
          <Typography>Created by HMCC T3CH</Typography>
        </SetlistViewFooter>
      </Box>
    </Container>
  );
};

export default SetlistViewContainerDesktop;
