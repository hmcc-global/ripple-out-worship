import {
  Box,
  Button,
  Container,
  Stack,
  Typography,
  Modal,
  useMediaQuery,
  ButtonGroup,
  Grid,
} from '@mui/material';
import { FC, ReactElement, useEffect, useState, useCallback, useRef } from 'react';
import { SongSchema, SongSearchFilter } from '../../types/song.types';
import SongCard from './SongCard';
import SongSearch from './SongSearch';
import SongSearchMobile from './SongSearchMobile';
import { useNavigate, useLocation } from 'react-router-dom';
import { Add, MusicNote } from '@mui/icons-material';
import PageHeader from '../navigation/PageHeader';
import { getFirstLineLyrics } from '../../helpers/song';
import {customAxios as axios} from '../custom/customAxios';
import { useSongs, useUser } from '../../helpers/customHooks';
import CircularProgress from '@mui/material/CircularProgress';
import { mobileNavbarHeight } from '../../constants';

const SongListContainer: FC = (): ReactElement => {
  const { user } = useUser();
  const [songResults, setSongResults] = useState<SongSchema[]>([]);
  const [filterData, setFilterData] = useState<SongSearchFilter>();
  const [open, setOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const isDesktop = useMediaQuery('(min-width: 769px)');
  const navigate = useNavigate();
  const location = useLocation();
  const handleClose = () => setOpen(false);
  const allSongs = useSongs() as SongSchema[];

  const [loading, setLoading] = useState(true);

  const getSongResults = useCallback(async () => {
    setLoading(true);
    if (filterData) {
      try {
        const payload = await axios.get('/api/songs/search', {
          params: {
            keyword: filterData.search,
            themes: filterData.themes,
            tempo: filterData.tempo,
            page: page,
            limit: 20,
          },
        });
        setSongResults((songResults) => [...songResults, ...payload.data.data]);
        setTotalPages(payload.data.totalPages);
        setLoading(false);
      } catch (error: any) {
        if (error?.response) {
          setLoading(false);
          if (error.response.status === 404) {
            console.log('No songs found');
            setSongResults([]);
          } else if (error.response.status === 500 || error.response.status === 401) {
            // Handle 500 or 401 errors as needed
          }
        } else {
          console.log('An unexpected error occurred:', error);
        }
      }
    } else {
      setSongResults(allSongs);
    }
  }, [filterData, page, allSongs]);

  const handleScroll = useCallback(() => {
    const searchDisplayBox = document.getElementById('search-display');
    if (searchDisplayBox) {
      const { scrollTop, scrollHeight, clientHeight } = searchDisplayBox;
      const isAtBottom = scrollTop + clientHeight >= scrollHeight - 5;
      if (isAtBottom && timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (!loading && isAtBottom && page < totalPages) {
        timeoutRef.current = setTimeout(() => {
          setPage((prevPage) => prevPage + 1);
        }, 300);
        searchDisplayBox.scrollTop = scrollTop - 30;
      }
    }
  }, [loading, page, totalPages, getSongResults]);

  useEffect(() => {
    const searchDisplayBox = document.getElementById('search-display');
    if (searchDisplayBox) {
      searchDisplayBox.addEventListener('scroll', handleScroll);
    }
    return () => {
      if (searchDisplayBox) {
        searchDisplayBox.removeEventListener('scroll', handleScroll);
      }
    };
  }, [loading, page, totalPages, handleScroll]);

  // useffect for filter
  useEffect(() => {
    setSongResults([]);
    setPage(1);

    const shouldQuery =
      filterData &&
      (filterData.search?.trim() ||
        (filterData.themes && filterData.themes.length > 0) ||
        filterData.tempo);
    if (shouldQuery) {
      const timer = setTimeout(() => {
        getSongResults();
      }, 1000);

      return () => {
        clearTimeout(timer);
      };
    }
    return;
  }, [filterData]);

  useEffect(() => {
    if (location.search) {
      const searchQuery = new URLSearchParams(location.search).get('q');
      setFilterData((prevState) => ({ ...prevState, search: searchQuery }));
    }
  }, [location.search]);

  // useEffect for scrolling
  useEffect(() => {
    if (page > 1 && page <= totalPages) getSongResults();
  }, [page, totalPages, getSongResults]);

  const modalSearchStyle = {
    width: '100vw',
    height: '100vh',
    bgcolor: 'background.paper',
    p: '32px 16px',
  };

  return (
    <>
      <Container
        fixed
        sx={{
          py: '1rem',
          px: '1.5rem',
          maxHeight: { xs: '92vh', md: '100vh' },
          height: { xs: '92vh', md: '100vh' },
          minWidth: '100%',
          overflow: 'hidden',
        }}
      >
        {user?.accessType === 'admin' && (
          <Button
            variant="outlined"
            sx={{
              zIndex: 9,
              display: {
                xs: 'flex',
                sm: 'none',
              },
              position: 'fixed',
              bottom: '90px',
              right: '40px',
              border: 0,
              padding: '5px 10px',
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
            startIcon={<Add />}
            onClick={() => navigate('/song/add')}
          >
            <Typography
              variant="subtitle1"
              fontWeight={700}
              sx={{
                fontSize: '1rem',
              }}
            >
              New Song
            </Typography>
          </Button>
        )}

        <PageHeader
          title="Songs"
          icon={<MusicNote />}
          actionButtons={
            user?.accessType === 'admin' && (
              <Button
                variant="outlined"
                sx={{
                  display: { xs: 'none', sm: 'flex' },
                  border: 0,
                  padding: {
                    xs: '8px 15px',
                    sm: '10px 25px',
                  },
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
                startIcon={<Add />}
                onClick={() => navigate('/song/add')}
              >
                <Typography
                  variant="subtitle1"
                  fontWeight={700}
                  sx={{
                    fontSize: {
                      xs: '0.875rem',
                      sm: '1rem',
                    },
                  }}
                >
                  New Song
                </Typography>
              </Button>
            )
          }
        />
        <Box display={{ base: 'block', md: 'none' }}></Box>
        <Grid
          container
          maxWidth="100%"
          height={isDesktop ? '88vh' : `calc(100% - ${mobileNavbarHeight})`}
          width="100%"
          spacing={1}
          marginTop={1}
        >
          <Grid item xs={isDesktop ? 4 : 12} height={isDesktop ? '100%' : 'auto'}>
            {isDesktop ? (
              <SongSearch
                filterData={filterData}
                setFilterData={setFilterData}
                onClose={handleClose}
                songs={allSongs}
                isDesktop={isDesktop}
              />
            ) : (
              <SongSearchMobile
                filterData={filterData}
                setFilterData={setFilterData}
                onClose={handleClose}
                songs={allSongs}
                isDesktop={isDesktop}
              />
            )}
          </Grid>

          {/* Song cards search results */}
          <Grid item xs={isDesktop ? 8 : 12} height={isDesktop ? '100%' : '100%'}>
            <Container
              sx={{
                py: '1em',
                background: '#000',
                borderRadius: '16px',
                width: '100%',
                height: '100%',
                maxHeight: { xs: '90%', md: '100%' },
              }}
            >
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                spacing="space-between"
                maxWidth="100%"
                height={isDesktop ? '4%' : 'auto'}
                pb={isDesktop ? 0 : '1em'}
              >
                <Typography variant="h3" color="#FFFFFF">
                  Search Results
                </Typography>
                <ButtonGroup variant="outlined">{/* Button group code */}</ButtonGroup>
              </Stack>
              <Stack
                direction="column"
                spacing={3}
                height="97%"
                overflow="auto"
                maxWidth="100%"
                id="search-display"
                sx={{
                  '&::-webkit-scrollbar': {
                    display: 'none',
                  },
                  '@media (min-width: 600px)': {
                    '&::-webkit-scrollbar': {
                      display: 'block',
                    },
                  },
                }}
              >
                {loading && songResults.length === 0 ? (
                  <Stack height="80%" justifyContent="center" alignItems="center" width={'400'}>
                    <CircularProgress />
                  </Stack>
                ) : songResults.length > 0 ? (
                  songResults.map((song, i) => (
                    <SongCard
                      key={i}
                      {...song}
                      filterData={filterData}
                      isDesktop={isDesktop}
                      firstLine={getFirstLineLyrics(song.chordLyrics)}
                    />
                  ))
                ) : (
                  <Stack height="80%" display="flex" justifyContent="center" alignItems="center">
                    <Typography variant="h2" color="primary.main">
                      Couldn't find "{filterData?.search}"
                    </Typography>
                    <Typography variant="body2">Try searching again</Typography>
                  </Stack>
                )}
              </Stack>
            </Container>
          </Grid>
        </Grid>
      </Container>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalSearchStyle}>
          <SongSearch
            filterData={filterData}
            setFilterData={setFilterData}
            onClose={handleClose}
            songs={allSongs}
            isDesktop={false}
          />
        </Box>
      </Modal>
    </>
  );
};

export default SongListContainer;
