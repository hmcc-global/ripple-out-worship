import {
  Container,
  Typography,
  Box,
  Stack,
  TextField,
  Button,
  Chip,
  IconButton,
} from '@mui/material';
import { SongSearchProps } from '../../types/song.types';
import { useState, useEffect } from 'react';
import { tempoOptions, themeOptions, displayResultOptions } from '../../constants';
import { ArrowDropDown, Info, Refresh, Tune } from '@mui/icons-material';
import SearchIcon from '@mui/icons-material/Search';
import TuneIcon from '@mui/icons-material/Tune';
import HeaderWithIcon from '../custom/HeaderWithIcon';
import { useLocation } from 'react-router-dom';
import CloseIcon from '@mui/icons-material/Close';

const SongSearch = (props: SongSearchProps) => {
  const [searchString, setSearchString] = useState<string>('');
  const [tempoList, setTempoList] = useState<string[]>([]);
  const [disabledTempo, setDisabledTempo] = useState<string[]>(tempoOptions);
  const [themeList, setThemeList] = useState<string[]>([]);
  const [disabledTheme, setDisabledTheme] = useState<string[]>(themeOptions);
  const [displayResultList, setDisplayResultList] = useState<string[]>(displayResultOptions);
  const [disabledDisplayResult, setDisabledDisplayResult] = useState<string[]>([]);

  const handleResetFilters = () => {
    setSearchString('');
    setTempoList([]);
    setDisabledTempo(tempoOptions);
    setThemeList([]);
    setDisabledTheme(themeOptions);
    setDisplayResultList(displayResultOptions);
    setDisabledDisplayResult([]);
  };

  const handleDeleteTempo = (chipToDelete: string) => () => {
    setTempoList((chips) => chips.filter((chip) => chip !== chipToDelete));
    setDisabledTempo((prevDisabledChips) => [...prevDisabledChips, chipToDelete]);
  };

  const handleReactivateTempo = (chipToActivate: string) => () => {
    setTempoList((prevTempoList) => [...prevTempoList, chipToActivate]);
    setDisabledTempo((prevDisabledChips) =>
      prevDisabledChips.filter((chip) => chip !== chipToActivate)
    );
  };

  const handleDeleteTheme = (chipToDelete: string) => () => {
    setThemeList((chips) => chips.filter((chip) => chip !== chipToDelete));
    setDisabledTheme((prevDisabledChips) => [...prevDisabledChips, chipToDelete]);
  };

  const handleReactivateTheme = (chipToActivate: string) => () => {
    setThemeList((prevTempoList) => [...prevTempoList, chipToActivate]);
    setDisabledTheme((prevDisabledChips) =>
      prevDisabledChips.filter((chip) => chip !== chipToActivate)
    );
  };

  const handleDeleteDisplayResult = (chipToDelete: string) => () => {
    setDisplayResultList((chips) => chips.filter((chip) => chip !== chipToDelete));
    setDisabledDisplayResult((prevDisabledChips) => [...prevDisabledChips, chipToDelete]);
  };

  const handleReactivateDisplayResult = (chipToActivate: string) => () => {
    setDisplayResultList((prevTempoList) => [...prevTempoList, chipToActivate]);
    setDisabledDisplayResult((prevDisabledChips) =>
      prevDisabledChips.filter((chip) => chip !== chipToActivate)
    );
  };

  useEffect(() => {
    updateFilterData();
  }, [tempoList, themeList, displayResultList]);

  const updateFilterData = () => {
    props.setFilterData({
      search: searchString,
      tempo: tempoList,
      themes: themeList,
      display: {
        tempo: displayResultList.includes('Tempo'),
        themes: displayResultList.includes('Themes'),
        firstLine: displayResultList.includes('First Line Lyric'),
        originalKey: displayResultList.includes('Original Key'),
        year: displayResultList.includes('Year'),
        code: displayResultList.includes('Code'),
        timeSignature: displayResultList.includes('Time'),
      },
    });
  };

  const location = useLocation();

  useEffect(() => {
    if (location.search) {
      const searchQuery = new URLSearchParams(location.search).get('q');
      setSearchString(searchQuery ?? '');
    }
  }, [location.search]);

  const [isTempoOpen, setIsTempoOpen] = useState<boolean>(true);
  const [isThemeOpen, setIsThemeOpen] = useState<boolean>(true);
  const [isDisplayResultOpen, setIsDisplayResultOpen] = useState<boolean>(true);
  const [showSearchBox, setShowSearchBox] = useState(false);
  const handleSearchToggle = () => {
    setShowSearchBox((prev) => !prev);
  };
  return (
    <Container sx={{ py: '1em', borderRadius: '16px' }}>
      <Box>
        <Stack direction="column">
          <Stack direction="row">
            <TextField
              variant="standard"
              placeholder="Search"
              InputProps={{
                style: {
                  fontSize: '1rem',
                  color: '#CAC4D0',
                  background: '#4A4458',
                  borderRadius: '26px',
                  border: 0,
                  padding: '0.5rem 1rem',
                  marginRight: ' 0.5em',
                },
                disableUnderline: true,
              }}
              sx={{
                width: '100%',
              }}
              value={searchString}
              onChange={(e) => setSearchString(e.target.value)}
              autoFocus
              onKeyDown={() => updateFilterData()}
            />
            <IconButton
              color="secondary"
              onClick={() => handleSearchToggle()}
              edge="end"
              sx={{
                borderRadius: '50%',
                backgroundColor: '#D0BCFF',
                color: '#381E72',
                padding: '10px',
                width: '48px',
                '&:hover': {
                  backgroundColor: 'darkpurple',
                },
              }}
            >
              <TuneIcon />
            </IconButton>
          </Stack>
          <Stack direction="column" gap={'1.25rem'}>
            {showSearchBox && (
              <Box
                height="100vh"
                width="100vw"
                position="fixed"
                top={0}
                left={0}
                sx={{ zIndex: 10, backgroundColor: '#000' }}
              >
                <Container sx={{ py: '1em', borderRadius: '16px' }}>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      backgroundColor: { xs: '#000000', md: '#211F26' },
                    }}
                  >
                    <HeaderWithIcon
                      Icon={SearchIcon}
                      headerText="Search"
                      headerVariant="h3"
                      headerColor="#CAC4D0"
                    />
                    <IconButton onClick={handleSearchToggle}>
                      <CloseIcon sx={{ color: 'white' }} />
                    </IconButton>
                  </Box>
                  <TextField
                    variant="standard"
                    placeholder="Type Song Title, Keywords, etc"
                    InputProps={{
                      style: {
                        fontSize: '1rem',
                        color: '#CAC4D0',
                        background: '#4A4458',
                        borderRadius: '26px',
                        border: 0,
                        padding: '0.5rem 1rem',
                        marginRight: ' 0.5em',
                        width: '90%',
                        margin: 'auto',
                      },
                      disableUnderline: true,
                    }}
                    sx={{
                      width: '100%',
                      paddingY: '0.5em',
                    }}
                    value={searchString}
                    onChange={(e) => setSearchString(e.target.value)}
                    autoFocus
                    onKeyDown={() => updateFilterData()}
                  />

                  <Stack
                    direction="row"
                    alignItems="center"
                    pb={3}
                    justifyContent="space-between"
                    minWidth="100%"
                  >
                    <HeaderWithIcon
                      Icon={Tune}
                      headerText="Filter"
                      headerVariant="h3"
                      headerColor="#CAC4D0"
                    />
                    <Button
                      sx={{
                        padding: '7.5px 15px',
                        borderRadius: '10px',
                        backgroundColor: '#000',
                        color: 'secondary.main',
                        textTransform: 'none',
                      }}
                      startIcon={<Refresh />}
                      onClick={handleResetFilters}
                    >
                      Reset All
                    </Button>
                  </Stack>
                  <Box
                    sx={{
                      height: '50vh',
                      overflowY: 'auto',
                      pr: 1,
                    }}
                  >
                    <Box>
                      <Stack
                        direction="row"
                        justifyContent={'space-between'}
                        width="100%"
                        alignItems={'center'}
                        pb="0.5rem"
                      >
                        <Typography variant="h4" color="white">
                          Tempo
                        </Typography>
                        <IconButton
                          onClick={() => setIsTempoOpen(!isTempoOpen)}
                          sx={{
                            color: '#E8DEF8',
                            p: 0,
                            transform: isTempoOpen ? '' : 'rotate(-180deg)',
                            transition: '0.1s ease-in-out',
                          }}
                          disableRipple
                          disableTouchRipple
                        >
                          <ArrowDropDown sx={{ color: '#CAC4D0' }} />
                        </IconButton>
                      </Stack>
                      {isTempoOpen &&
                        tempoOptions.map((item) => (
                          <Chip
                            sx={{
                              backgroundColor: disabledTempo.includes(item)
                                ? 'secondary.lighter'
                                : 'primary.dark',
                              borderRadius: '8px',
                              m: 0.5,
                              '&:hover': {
                                backgroundColor: 'primary.dark',
                              },
                            }}
                            key={item}
                            label={item}
                            onDelete={
                              disabledTempo.includes(item) ? undefined : handleDeleteTempo(item)
                            }
                            onClick={
                              disabledTempo.includes(item) ? handleReactivateTempo(item) : undefined
                            }
                          />
                        ))}
                    </Box>

                    <Box>
                      <Stack
                        direction="row"
                        justifyContent={'space-between'}
                        width="100%"
                        alignItems={'center'}
                        pb="0.5rem"
                        pt="0.5rem"
                      >
                        <Typography variant="h4" color="white">
                          Themes
                        </Typography>
                        <IconButton
                          onClick={() => setIsThemeOpen(!isThemeOpen)}
                          sx={{
                            color: '#E8DEF8',
                            p: 0,
                            transform: isThemeOpen ? '' : 'rotate(-180deg)',
                            transition: '0.1s ease-in-out',
                          }}
                          disableRipple
                          disableTouchRipple
                        >
                          <ArrowDropDown sx={{ color: '#CAC4D0' }} />
                        </IconButton>
                      </Stack>

                      {isThemeOpen &&
                        themeOptions.map((item) => (
                          <Chip
                            sx={{
                              backgroundColor: disabledTheme.includes(item)
                                ? 'secondary.lighter'
                                : 'primary.dark',
                              borderRadius: '8px',
                              m: 0.5,
                              '&:hover': {
                                backgroundColor: 'primary.dark',
                              },
                            }}
                            key={item}
                            label={item}
                            onDelete={
                              disabledTheme.includes(item) ? undefined : handleDeleteTheme(item)
                            }
                            onClick={
                              disabledTheme.includes(item) ? handleReactivateTheme(item) : undefined
                            }
                          />
                        ))}
                      <Box>
                        <Stack
                          direction="row"
                          justifyContent={'space-between'}
                          width="100%"
                          alignItems={'center'}
                          pb="0.5rem"
                          pt="0.5rem"
                        >
                          <Typography variant="h4" color="white">
                            Display Results Details
                          </Typography>
                          <IconButton
                            onClick={() => setIsDisplayResultOpen(!isDisplayResultOpen)}
                            sx={{
                              color: '#E8DEF8',
                              p: 0,
                              transform: isDisplayResultOpen ? '' : 'rotate(-180deg)',
                              transition: '0.1s ease-in-out',
                            }}
                            disableRipple
                            disableTouchRipple
                          >
                            <ArrowDropDown sx={{ color: '#CAC4D0' }} />
                          </IconButton>
                        </Stack>

                        {isDisplayResultOpen &&
                          displayResultOptions.map((item) => (
                            <Chip
                              sx={{
                                backgroundColor: disabledDisplayResult.includes(item)
                                  ? 'secondary.lighter'
                                  : 'primary.dark',
                                borderRadius: '8px',
                                m: 0.5,
                                '&:hover': {
                                  backgroundColor: 'primary.dark',
                                },
                              }}
                              key={item}
                              label={item}
                              onDelete={
                                disabledDisplayResult.includes(item)
                                  ? undefined
                                  : handleDeleteDisplayResult(item)
                              }
                              onClick={
                                disabledDisplayResult.includes(item)
                                  ? handleReactivateDisplayResult(item)
                                  : undefined
                              }
                            />
                          ))}
                      </Box>
                    </Box>
                  </Box>
                  <Button
                    onClick={() => handleSearchToggle()}
                    variant="outlined"
                    sx={{
                      border: 0,
                      padding: {
                        xs: '8px 15px',
                        sm: '10px 25px',
                      },
                      borderRadius: '40px',
                      backgroundColor: '#D0BCFF',
                      textTransform: 'none',
                      width: '100%',
                      '&:hover': {
                        backgroundColor: '#D0BCFF',
                        opacity: '0.95',
                      },
                      transition: 'all 0.1s ease-in-out',
                    }}
                  >
                    <Typography variant="h4" color="#381E72">
                      Apply
                    </Typography>
                  </Button>
                </Container>
              </Box>
            )}
          </Stack>
        </Stack>
      </Box>
    </Container>
  );
};

export default SongSearch;
