import { Setlist } from '../../types/setlist.types';
import { SongSchema } from '../../types/song.types';
import {
  Box,
  Button,
  Container,
  Divider,
  FormControl,
  IconButton,
  MenuItem,
  Select,
  Skeleton,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';
import { ReactElement, useEffect, useMemo, useState } from 'react';
import { HeaderSetlistView, SetlistViewFooter } from './SetlistViewPaper';
import SetlistViewMenuMobile from './SetlistViewMenuMobile';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SongsLyrics from '../songsView/SongsLyrics';
import { flatMusicKeysOptions, sharpMusicKeysOptions } from '../../constants';
import TuneIcon from '@mui/icons-material/Tune';
import SetlistViewMobileDrawer from './SetlistViewMobileDrawer';
import axios from 'axios';

const SetlistViewContainerMobile = ({ preview }: { preview?: boolean }): ReactElement | null => {
  const setlistId = window.location.pathname.split('/').reverse()[0];
  const theme = useTheme();
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [setlist, setSetlist] = useState<Setlist>();
  const songs = useMemo(() => (setlist && setlist.songs) || [], [setlist]);
  const [selectedSong, setSelectedSong] = useState<SongSchema>();
  const [chordStatus, setChordStatus] = useState(false);
  const [count, setCount] = useState(0);
  const [useFlat, setUseFlat] = useState(false);
  const [split, setSplit] = useState(1);
  const openMenu = Boolean(menuAnchor);
  const [openDrawer, setOpenDrawer] = useState(false);

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpenDrawer(newOpen);
  };

  const handleSelectSong = (song: SongSchema) => {
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
  }, [ setlistId]);

  useEffect(() => {
    if (songs) {
      setSelectedSong(songs[0]);
    }
  }, [songs]);

  useEffect(() => {
    setUseFlat(
      !!(
        selectedSong?.originalKey &&
        selectedSong.originalKey.length > 1 &&
        selectedSong.originalKey[1] === 'b'
      )
    );
    setCount(
      useFlat && selectedSong
        ? flatMusicKeysOptions.indexOf(selectedSong.originalKey)
        : sharpMusicKeysOptions.indexOf(selectedSong?.originalKey || 'C')
    );
  }, [selectedSong]);

  if (!setlist) return null;

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
        {songs && selectedSong ? (
          <Container
            maxWidth="xl"
            style={{
              height: '90vh',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* Header */}
            <HeaderSetlistView style={{ flexDirection: 'row' }}>
              <Box />
              <Typography variant="h3">{setlist.name}</Typography>
              <Button
                onClick={handleOpenMenu}
                style={{ padding: '0px', minWidth: 'unset' }}
                color="secondary"
              >
                <MoreVertIcon />
              </Button>
              <SetlistViewMenuMobile
                anchorEl={menuAnchor}
                open={openMenu}
                onClose={handleCloseMenu}
              />
            </HeaderSetlistView>
            {/* Setlist body */}
            {/* Song choice */}
            <Stack flexDirection="row" gap={2} alignItems="center">
              <IconButton
                style={{
                  border: `1px solid ${theme.palette.secondary.main}`,
                  height: '48px',
                  width: '48px',
                }}
                onClick={toggleDrawer(true)}
              >
                <TuneIcon style={{ color: theme.palette.secondary.main }} />
              </IconButton>
              <FormControl fullWidth>
                <Select
                  id="song-select"
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
            </Stack>
            {/* Song lyrics */}
            <Box height="100%" overflow="auto" marginTop="8px">
              <Stack height="100%">
                {/* render header */}

                <Box sx={{ width: '100%', padding: '12px 12px 12px 0' }}>
                  <Typography variant="h2">{selectedSong?.title}</Typography>
                  <Typography
                    variant="subtitle2"
                    style={{ color: theme.palette.secondary.main, margin: '8px 0' }}
                  >
                    {selectedSong?.artist}
                  </Typography>
                  <Divider style={{ borderColor: theme.palette.secondary.dark }} />
                </Box>

                {/* render lyrics */}
                <Box sx={{ width: '100%', height: '100%', display: 'flex', overflow: 'auto' }}>
                  <SongsLyrics
                    useFlat={useFlat}
                    chordStatus={chordStatus}
                    changeKey={count}
                    song={selectedSong}
                    split={split}
                  />
                </Box>
              </Stack>
            </Box>
            {preview ? null : (
              <SetlistViewFooter style={{ width: '100vw', margin: '0 0 -16px -16px' }}>
                <Typography>Created by HMCC T3CH</Typography>
              </SetlistViewFooter>
            )}
          </Container>
        ) : (
          <Skeleton>loading ...</Skeleton>
        )}
      </Box>
      <SetlistViewMobileDrawer
        count={count}
        setCount={setCount}
        chordStatus={chordStatus}
        setChordStatus={setChordStatus}
        split={split}
        setSplit={setSplit}
        useFlat={useFlat}
        setUseFlat={setUseFlat}
        onClose={toggleDrawer(false)}
        open={openDrawer}
      />
    </Container>
  );
};

export default SetlistViewContainerMobile;
