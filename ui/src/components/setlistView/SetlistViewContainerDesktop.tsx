import { Setlist } from '../../types/setlist.types';
import { SongViewSchema } from '../../types/song.types';
import { Box, Container, Grid, Skeleton, Stack, Typography } from '@mui/material';
import { FC, ReactElement, useEffect, useMemo, useState } from 'react';
import SongsButtonsCard from '../songsView/SongsButtonsCard';
import {
  HeaderSetlistView,
  SongSelectRow,
  SongSelectTable,
  SetlistViewFooter,
} from './SetlistViewPaper';
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
              <Grid item xs={4}>
                {/* Header */}
                <HeaderSetlistView>
                  <Typography variant="h3">{setlist.name}</Typography>
                  <SetlistViewMenuDesktop />
                </HeaderSetlistView>
                <SongSelectTable>
                  {songs.map((song) => {
                    return (
                      <SongSelectRow
                        selected={song._id === selectedSong?._id}
                        onClick={() => handleSelectSong(song)}
                        key={song._id}
                      >
                        {song.title}
                      </SongSelectRow>
                    );
                  })}
                </SongSelectTable>
              </Grid>
              {/* Song lyrics */}
              <Grid item xs={8} height="100%" overflow="auto" marginTop="8px">
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
