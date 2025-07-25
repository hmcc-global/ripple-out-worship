import { Box, Stack, Typography, IconButton, InputBase } from '@mui/material';
import { FC, ReactElement, useEffect, useMemo } from 'react';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import QueueMusicIcon from '@mui/icons-material/QueueMusic';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import HomeTab from './HomeTab';
import RecommendedSongCard from './RecommendedSongCard';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import { useState } from 'react';
import GlobalSearchModal from '../navigation/GlobalSearchModal';
import { useOwnership, useSongs } from '../../helpers/customHooks';
import { SongSchema } from '../../types/song.types';
import { Setlist } from '../../types/setlist.types';
import axios from 'axios';

const HomeContainer: FC = (): ReactElement => {
  const theme = useTheme();
  const ownership = useOwnership();
  const isDesktop = useMediaQuery(theme.breakpoints.up('sm'));
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [setlists, setSetlists] = useState<Setlist[]>([]);
  const onSearchOpen = () => setIsSearchOpen(true);
  const onSearchClose = () => setIsSearchOpen(false);
  const allSongs = useSongs() as SongSchema[];

  useEffect(() => {
    const fetchSetlists = async () => {
      if (ownership.setlistIds.length > 0) {
        try {
          const setlistRes = await axios.get<Setlist[]>('/api/setlists/get');
          if (setlistRes.status === 200) {
            const filteredSetlists = setlistRes.data.filter((setlist) =>
              ownership.setlistIds.some((setlistOwnership) => setlistOwnership.id === setlist._id)
            );
            setSetlists(filteredSetlists);
          }
        } catch (error) {
          console.error('Error fetching setlists:', error);
        }
      }
    };

    fetchSetlists();
  }, [ownership]);

  return (
    <>
      <Box
        sx={{
          width: '100%',
          flexGrow: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
          margin: 'auto',
          paddingBottom: '1em',
          paddingTop: ['0em', '2em'],
          px: ['0em', '1em'],
        }}
      >
        <Stack direction={'column'}>
          <Stack direction={['column', 'row']} spacing={2} gap={['25px', '12px']}>
            <Box
              sx={{
                pt: '2.5em',
                pb: ['0.5em', '2.5em'],
                px: '2em',
                borderRadius: ['0px', '30px'],
                background: [
                  'linear-gradient(180deg, rgba(51, 45, 71, 0.00) 0%, #171717 88.5%), linear-gradient(158deg, rgba(0, 0, 0, 0.00) 31.44%, rgba(148, 111, 255, 0.20) 80.34%), radial-gradient(111.68% 110.13% at 66.1% 8.28%, rgba(154, 118, 255, 0.20) 36.5%, rgba(0, 0, 0, 0.20) 64%), #1F1F1F',
                  'linear-gradient(158deg, rgba(0, 0, 0, 0.00) 31.44%, rgba(148, 111, 255, 0.20) 80.34%), radial-gradient(111.68% 110.13% at 66.1% 8.28%, rgba(154, 118, 255, 0.20) 36.5%, rgba(0, 0, 0, 0.20) 64%), #1F1F1F',
                ],
                width: ['100%', '50%'],
              }}
              position="relative"
            >
              <Typography variant="h1" sx={{ pb: 2, fontSize: ['24px', '40px'] }}>
                Welcome to {isDesktop && <br />}
                HMCC Worship
              </Typography>
              <Typography
                sx={{ fontSize: ['14px', '16px'], fontFamily: 'DM Sans, sans-serif' }}
                marginBottom={['2em', '0em']}
                fontWeight={400}
              >
                Here is where you can find lyrics and chords for worship music! Go on and worship
                God!
              </Typography>
              <Typography
                position={['static', 'absolute']}
                sx={{ fontSize: ['12px', '16px'], fontFamily: 'DM Sans, sans-serif' }}
                fontWeight={400}
                bottom={35}
              >
                Harvest Mission Community Church
              </Typography>
            </Box>
            <Box
              sx={{
                marginBottom: '20px',
                width: '60%',
                display: ['flex', 'none'],
                alignItems: 'center',
                alignSelf: 'center',
                border: '1px solid #D0BCFE',
                backgroundColor: '#4A4458',
                borderRadius: '28px',
                px: 1,
              }}
              onClick={onSearchOpen}
            >
              <IconButton sx={{ color: 'secondary.main' }}>
                <SearchIcon />
              </IconButton>
              <Box
                sx={{
                  ml: 1,
                  color: 'secondary.main',
                  fontFamily: 'DM Sans, sans-serif',
                  fontSize: '14px',
                }}
              >
                Search songs, keywords...
              </Box>
            </Box>
            <Stack
              direction={'column'}
              alignSelf={'center'}
              spacing={2}
              sx={{ width: ['90%', '50%'] }}
            >
              <HomeTab
                title="Songs"
                description="Find worship songs with lyrics and chords"
                Icon={MusicNoteIcon}
                route="/song"
              />
              <HomeTab
                title="My Setlists"
                description="Create setlists for your worship sessions"
                Icon={QueueMusicIcon}
                route="/setlist"
              />
              <HomeTab
                title="Resources (Coming Soon)"
                description="Find resources for worship here"
                Icon={TextSnippetIcon}
                route="/resource"
              />
            </Stack>
          </Stack>

          <Box sx={{ pt: 5, width: ['90%', '100%'], margin: 'auto' }}>
            <Typography variant="h2">Recommended Songs</Typography>
            <Stack direction={['column', 'row']} sx={{ py: 2 }} gap={3}>
              {/* TODO: API to generate recommended or newly added songs */}
              {/* TODO: set this to use display grid and repeat frame instead of fixing the width */}
              <RecommendedSongCard songTitle="Living With A Fire" artistName="Jesus Culture" />
              <RecommendedSongCard
                songTitle="Yesterday, Today, and Forever"
                artistName="Passion, Kristian Stanfill"
              />
            </Stack>
          </Box>
        </Stack>
      </Box>
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={onSearchClose}
        allSongs={allSongs}
        allSetlists={setlists}
      />
    </>
  );
};

export default HomeContainer;
