import { useState, useCallback } from 'react';
import {
  Box,
  Stack,
  useMediaQuery,
  Snackbar,
  IconButton,
  FormControl,
  Select,
  MenuItem,
} from '@mui/material';
import { ScreenRotation, Close, MusicVideoOutlined } from '@mui/icons-material';
import { specificSongsMobileWidth } from '../../constants';
import { SongViewSchema } from '../../types/song.types';
import { SetlistViewSongsControlChip } from './SetlistViewPaper';

interface SetlistViewSongHeaderProps {
  songs: SongViewSchema[];
  selectedSong: SongViewSchema;
  setSelectedSong: (song: SongViewSchema) => void;
  split: number;
  onSplitChange: (split: number) => void;
  showChords: boolean;
  onChordsToggle: (showChords: boolean) => void;
}

const SetlistViewSongsHeader = ({
  songs,
  selectedSong,
  setSelectedSong,
  split,
  onSplitChange,
  showChords,
  onChordsToggle,
}: SetlistViewSongHeaderProps) => {
  const [showSplitSnackbar, setShowSplitSnackbar] = useState(false);
  const isSmallScreen = useMediaQuery(`(max-width:${specificSongsMobileWidth})`);

  const handleSplitToggle = useCallback(() => {
    if (isSmallScreen) {
      setShowSplitSnackbar(true);
      return;
    }
    const nextSplit = split < 3 ? split + 1 : 1;
    onSplitChange(nextSplit);
  }, [isSmallScreen, split, onSplitChange]);

  const handleChordsChange = useCallback(() => {
    onChordsToggle(!showChords);
  }, [showChords, onChordsToggle]);

  const handleSongChange = useCallback(
    (songId: string) => {
      const song = songs.find((s) => s._id === songId) || songs[0];
      setSelectedSong(song);
    },
    [songs, setSelectedSong]
  );

  const closeSplitSnackbar = useCallback(() => {
    setShowSplitSnackbar(false);
  }, []);

  // Component styles
  const selectStyles = {
    width: '100%',
    maxWidth: '500px',
    backgroundColor: '#211F26',
    '&:hover': {
      backgroundColor: '#332D41',
    },
    '&.Mui-selected': {
      backgroundColor: '#332D41',
      '&:hover': {
        backgroundColor: '#332D41',
      },
    },
    fontWeight: 700,
    fontSize: '0.875rem',
    paddingBlock: '0.5rem',
  };

  const snackbarContentStyles = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    px: 3,
    py: 1,
    backgroundColor: '#D0BCFF',
    color: '#4F378B',
    borderRadius: 2,
    boxShadow: 3,
    fontWeight: 500,
    fontSize: 16,
    minWidth: 260,
    position: 'relative',
  };

  const SplitIcon = () => (
    <Box height="30px" width="30px">
      <Stack
        direction="row"
        height="100%"
        width="100%"
        justifyContent="center"
        alignItems="center"
        spacing={0.2}
      >
        {Array.from({ length: split }, (_, i) => (
          <Box key={i} bgcolor="secondary.main" height="15px" width="6px" borderRadius="2px" />
        ))}
      </Stack>
    </Box>
  );

  const ChordsIcon = () => (
    <Box display="flex" height="30px" width="30px" alignItems="center" justifyContent="center">
      <MusicVideoOutlined sx={{ fontSize: '25px', color: 'secondary.main' }} />
    </Box>
  );

  return (
    <>
      <Box
        display="flex"
        flexDirection="row"
        alignItems="center"
        justifyContent="flex-start"
        width="100%"
        gap={2}
        sx={{ overflowX: 'auto' }}
      >
        {/* Song Selection Dropdown */}
        <FormControl sx={{ flex: 1, maxWidth: '500px' }}>
          <Select
            id="song-select"
            value={selectedSong?._id || ''}
            onChange={(e) => handleSongChange(e.target.value)}
            variant="outlined"
            disabled={songs.length === 0}
          >
            {songs.map((song) => (
              <MenuItem key={song._id} value={song._id} sx={selectStyles}>
                {song.title}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Control Buttons */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            overflowX: 'auto',
            whiteSpace: 'nowrap',
            scrollbarWidth: 'none',
            '&::-webkit-scrollbar': { display: 'none' },
          }}
        >
          <Stack direction="row" alignItems="center" spacing={1}>
            {/* Split Toggle */}
            <SetlistViewSongsControlChip isSelected={split !== 1} onClick={handleSplitToggle}>
              <SplitIcon />
              Split
            </SetlistViewSongsControlChip>

            {/* Chords Toggle */}
            <SetlistViewSongsControlChip isSelected={showChords} onClick={handleChordsChange}>
              <ChordsIcon />
              Chords
            </SetlistViewSongsControlChip>
          </Stack>
        </Box>
      </Box>

      {/* Split Snackbar for Mobile */}
      <Snackbar
        open={showSplitSnackbar}
        autoHideDuration={3000}
        onClose={closeSplitSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        ContentProps={{ sx: { background: 'transparent', boxShadow: 'none' } }}
      >
        <Box sx={snackbarContentStyles}>
          <ScreenRotation sx={{ color: '#4F378B', fontSize: 22, mr: 1 }} />
          <Box sx={{ px: 0.5 }}>Rotate phone to landscape to split (Tip: Better on tablets/ laptops)</Box>
          <IconButton
            size="small"
            onClick={closeSplitSnackbar}
            sx={{ color: '#4F378B', ml: 2 }}
            aria-label="close"
          >
            <Close fontSize="small" />
          </IconButton>
        </Box>
      </Snackbar>
    </>
  );
};

export default SetlistViewSongsHeader;
