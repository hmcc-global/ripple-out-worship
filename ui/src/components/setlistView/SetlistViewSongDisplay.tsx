import { useEffect, useState, useCallback } from 'react';
import {
  Box,
  Typography,
  Stack,
  Chip,
  IconButton,
  useMediaQuery,
  useTheme,
  FormGroup,
  FormControlLabel,
  Switch,
} from '@mui/material';
import { KeyboardArrowUp, KeyboardArrowDown } from '@mui/icons-material';
import SongsLyrics from '../songsView/SongsLyrics';
import SongsInfoCardMobile from '../songsView/SongsInfoCardMobile';
import { SongViewSchema } from '../../types/song.types';
import {
  flatMusicKeysOptions,
  sharpMusicKeysOptions,
  specificSongsDesktopWidth,
} from '../../constants';

interface SetlistViewSongDisplayProps {
  song: SongViewSchema | undefined;
  splitColumns: number;
  showChords: boolean;
  userView?: boolean;
  userHeader?: boolean;
}

const SetlistViewSongDisplay = ({
  song,
  splitColumns,
  showChords,
  userView = false,
  userHeader = false,
}: SetlistViewSongDisplayProps) => {
  const [keyIndex, setKeyIndex] = useState(0);
  const [capo, setCapo] = useState(0);
  const [useFlat, setUseFlat] = useState(false);
  const [showMobileInfo, setShowMobileInfo] = useState(false);

  const theme = useTheme();
  const isDesktop = useMediaQuery(`(min-width:${specificSongsDesktopWidth})`);

  // Initialize key settings
  useEffect(() => {
    if (!song?.originalKey) return;

    const isFlat = song.originalKey.length > 1 && song.originalKey[1] === 'b';
    setUseFlat(isFlat);

    const keyOptions = isFlat ? flatMusicKeysOptions : sharpMusicKeysOptions;
    const index = keyOptions.indexOf(song.originalKey);
    setKeyIndex(index >= 0 ? index : 0);
  }, [song]);

  // Key change handler
  const handleKeyChange = useCallback((increment: boolean) => {
    setKeyIndex(prev => (prev + (increment ? 1 : -1) + 12) % 12);
  }, []);

  // Capo change handler
  const handleCapoChange = useCallback((increment: boolean) => {
    setCapo(prev => (prev + (increment ? 1 : -1) + 12) % 12);
    setKeyIndex(prev => (prev + (increment ? -1 : 1) + 12) % 12);
  }, []);

  const handleFlatToggle = useCallback(() => {
    setUseFlat((prev) => !prev);
  }, []);

  const getCurrentKey = useCallback(() => {
    const keyOptions = useFlat ? flatMusicKeysOptions : sharpMusicKeysOptions;
    return keyOptions[keyIndex] || sharpMusicKeysOptions[keyIndex];
  }, [useFlat, keyIndex]);

  // Component styles
  const keyControlsStyles = {
    justifyContent: 'center',
    background: '#322F35',
    padding: '5px 15px',
    borderRadius: '30px',
    display: showChords ? 'flex' : 'none',
    minHeight: '56px',
  };

  const flatToggleStyles = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#322F35',
    padding: '5px 20px',
    borderRadius: '30px',
    minHeight: '56px',
  };

  const switchStyles = {
    '& .Mui-checked': { color: theme.palette.secondary.main },
    '& .Mui-checked + .MuiSwitch-track': { backgroundColor: '#8175A0' },
  };

  const lyricsContainerStyles = {
    maxWidth: '100%',
    height: '100%',
    display: 'flex',
    padding: ['10px', '14px'],
    backgroundColor: '#141218',
    borderRadius: '12px',
    mb: '5vh',
  };

  const KeyControls = () => (
    <Stack direction="row" gap={{ xs: 1, md: 2 }} alignItems="center" sx={keyControlsStyles}>
      <Box
        sx={{
          width: '40px',
          height: '40px',
          display: 'flex',
          alignItems: 'center',
          padding: '6px',
        }}
      >
        <Typography color="primary.lighter">Key</Typography>
      </Box>

      <Box
        bgcolor="primary.dark"
        sx={{ borderRadius: '4px', width: ['24px', 'auto'], height: ['24px', 'auto'] }}
      >
        <IconButton
          aria-label="decrease key"
          onClick={() => handleKeyChange(false)}
          sx={{ padding: '0px' }}
        >
          <KeyboardArrowDown sx={{ color: 'primary.lightest' }} />
        </IconButton>
      </Box>

      <Chip label={getCurrentKey()} sx={{ background: '#49454F' }} />

      <Box
        bgcolor="primary.dark"
        sx={{ borderRadius: '4px', width: ['24px', 'auto'], height: ['24px', 'auto'] }}
      >
        <IconButton
          aria-label="increase key"
          onClick={() => handleKeyChange(true)}
          sx={{ padding: '0px' }}
        >
          <KeyboardArrowUp sx={{ color: 'primary.lightest' }} />
        </IconButton>
      </Box>
    </Stack>
  );

  const FlatToggle = () => (
    <Box fontSize={{ sm: '14px', md: '26px' }} sx={flatToggleStyles}>
      <FormGroup sx={{ justifyContent: 'center' }}>
        <FormControlLabel
          labelPlacement="start"
          sx={{ margin: 0, color: 'primary.lighter' }}
          control={
            <Switch checked={useFlat} onChange={handleFlatToggle} sx={switchStyles} name="flat" />
          }
          label="Flat"
        />
      </FormGroup>
    </Box>
  );

  // TODO: implement capo controls properly
  const CapoControls = () => (
    <Stack direction="row" gap={{ xs: 0.2, sm: 2 }} alignItems="center" sx={keyControlsStyles}>
      <Box
        sx={{
          width: '40px',
          height: '40px',
          display: 'flex',
          alignItems: 'center',
          padding: '6px',
        }}
      >
        <Typography color="primary.lighter">Capo</Typography>
      </Box>

      <Box
        bgcolor="primary.dark"
        sx={{ borderRadius: '4px', width: ['24px', 'auto'], height: ['24px', 'auto'] }}
      >
        <IconButton
          aria-label="decrease capo"
          onClick={() => handleCapoChange(false)}
          sx={{ padding: '0px' }}
        >
          <KeyboardArrowDown sx={{ color: 'primary.lightest' }} />
        </IconButton>
      </Box>

      <Chip label={capo} sx={{ background: '#49454F' }} />

      <Box
        bgcolor="primary.dark"
        sx={{ borderRadius: '4px', width: ['24px', 'auto'], height: ['24px', 'auto'] }}
      >
        <IconButton
          aria-label="increase capo"
          onClick={() => handleCapoChange(true)}
          sx={{ padding: '0px' }}
        >
          <KeyboardArrowUp sx={{ color: 'primary.lightest' }} />
        </IconButton>
      </Box>
    </Stack>
  );

  return (
    <Box
      sx={{ height: '100%', display: 'flex', flexDirection: 'column', width: '100%', gap: '1rem' }}
    >
      {/* Song Title Section */}
      {userHeader && (
        <Stack direction="column" spacing={0.25} sx={{ width: '100%' }}>
          <Typography variant="h2" color="#E8DEF8">
            {song?.title}
          </Typography>
          <Typography variant="subtitle2" sx={{ color: theme.palette.secondary.main }}>
            {song?.artist}
          </Typography>
        </Stack>
      )}

      {/* Chord Controls Section */}
      {showChords && (
        <Box sx={{ width: '100%', py: 0 }}>
          {/* Mobile View */}
          <Box
            sx={{
              display: isDesktop ? 'none' : 'block',
              overflowX: 'auto',
              whiteSpace: 'nowrap',
              scrollbarWidth: 'none',
              '&::-webkit-scrollbar': { display: 'none' },
            }}
          >
            <Stack direction="row" alignItems="center" spacing={1}>
              <KeyControls />
              <FlatToggle />
              {/* <CapoControls /> */}
            </Stack>
          </Box>

          {/* Desktop View */}
          <Box
            sx={{
              overflowX: 'auto',
              whiteSpace: 'nowrap',
              display: isDesktop ? 'flex' : 'none',
              gap: 2,
              alignItems: 'center',
              paddingRight: 2,
              scrollbarWidth: 'thin',
              '&::-webkit-scrollbar': { height: 6 },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: '#999',
                borderRadius: 4,
              },
            }}
          >
            <KeyControls />
            <FlatToggle />
            {/* <CapoControls /> */}
          </Box>
        </Box>
      )}

      {/* Lyrics Section */}
      <Box sx={lyricsContainerStyles}>
        <SongsLyrics
          useFlat={useFlat}
          chordStatus={showChords}
          changeKey={keyIndex}
          song={song}
          split={splitColumns}
        />
      </Box>

      {/* Mobile Info Modal */}
      {showMobileInfo && (
        <SongsInfoCardMobile song={song} onClose={() => setShowMobileInfo(false)} />
      )}
    </Box>
  );
};

export default SetlistViewSongDisplay;
