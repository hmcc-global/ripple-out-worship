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

  useEffect(() => {
    updateFilterData();
  }, [tempoList, themeList, displayResultList]);

  const updateFilterData = () => {
    props.setFilterData({
      search: searchString,
      tempo: tempoList,
      themes: themeList,
      // Hardcoding some filters to be off for mobile
      display: {
        tempo: displayResultList.includes('Tempo'),
        themes: false,
        firstLine: displayResultList.includes('First Line Lyric'),
        originalKey: displayResultList.includes('Original Key'),
        year: false,
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
    <Container sx={{ py: '1em', borderRadius: '16px' }}>
      <Box>
        <Stack direction="column">
          <Box>
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
          </Box>
        </Stack>
      </Box>
    </Container>
  );
};

export default SongSearch;
