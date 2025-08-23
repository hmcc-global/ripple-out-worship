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
import HeaderWithIcon from '../custom/HeaderWithIcon';
import { useLocation } from 'react-router-dom';

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

  // TODO-YY: If not necessary, remove
  // useEffect(() => {
  //   if (Songs.length > 0) {
  //     const allTempo = Songs.map((song) => song.tempo);
  //     const allThemes = Songs.map((song) => song.themes);

  //     const tempoSet = new Set<string>();
  //     allTempo.forEach((tempo) => tempo.forEach((t) => tempoSet.add(t)));
  //     setTempoList(Array.from(tempoSet));

  //     const themeSet = new Set<string>();
  //     allThemes.forEach((theme) => theme.forEach((t) => themeSet.add(t)));
  //     setThemeList(Array.from(themeSet));
  //   }
  // }, [Songs]);

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

  return (
    <Container
      sx={{
        p: '1rem',
        background: '#000',
        borderRadius: '16px',
        height: '100%',
      }}
      disableGutters
    >
      <Box sx={{ color: '#9E9E9E' }} height="100%">
        {/* filter heading and reset button */}
        <Stack
          direction="row"
          alignItems="center"
          height="4%"
          justifyContent="space-between"
          minWidth="100%"
        >
          <HeaderWithIcon
            Icon={Tune}
            headerText="Filter"
            headerVariant="h3"
            headerColor="#FFFFFF"
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

        <Stack direction="column" spacing="1.25rem" height="95%" pb={4} sx={{ overflowY: 'auto' }}>
          <Box>
            <Typography variant="body1" fontWeight={700} color="#E6E0E9" pb={'0.5rem'}>
              Search Keywords
            </Typography>
            <TextField
              variant="standard"
              placeholder="Type Song Title, Keywords, etc"
              InputProps={{
                style: {
                  fontSize: '1rem',
                  color: '#CAC4D0',
                  background: '#4A4458',
                  borderRadius: '8px',
                  border: 0,
                  padding: '0.5rem 1rem',
                },
                disableUnderline: true,
              }}
              sx={{
                width: '100%',
                mb: '1.25rem',
              }}
              value={searchString}
              onChange={(e) => setSearchString(e.target.value)}
              autoFocus
              onKeyDown={() => updateFilterData()}
            />
            <Stack
              direction="row"
              justifyContent={'space-between'}
              width="100%"
              alignItems={'center'}
              pb="0.5rem"
            >
              <Typography variant="body1" fontWeight={700} color="#E6E0E9">
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
                  onDelete={disabledTempo.includes(item) ? undefined : handleDeleteTempo(item)}
                  onClick={disabledTempo.includes(item) ? handleReactivateTempo(item) : undefined}
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
            >
              <Typography variant="body1" fontWeight={700} color="#E6E0E9">
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
                  onDelete={disabledTheme.includes(item) ? undefined : handleDeleteTheme(item)}
                  onClick={disabledTheme.includes(item) ? handleReactivateTheme(item) : undefined}
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
            >
              <Typography variant="body1" fontWeight={700} color="#E6E0E9">
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

          <Stack
            sx={{ border: 1, p: 1, borderRadius: '4px', borderColor: '#625B71' }}
            direction="row"
            alignItems="center"
            spacing={'0.5rem'}
          >
            <Info sx={{ color: '#E8DEF8' }} />
            <Typography variant="body2">Song Title will be displayed by default</Typography>
          </Stack>
        </Stack>
      </Box>
    </Container>
  );
};

export default SongSearch;
