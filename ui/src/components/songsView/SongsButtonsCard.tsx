import { useEffect, useState } from 'react';
import { SongViewSchema } from '../../types/song.types';
import {
  Container,
  Box,
  Typography,
  FormGroup,
  FormControlLabel,
  Switch,
  Stack,
  Chip,
  IconButton,
  useMediaQuery,
  Button,
  Divider,
  useTheme,
} from '@mui/material';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import SongsLyrics from './SongsLyrics';
import { flatMusicKeysOptions, sharpMusicKeysOptions } from '../../constants';
import InfoIcon from '@mui/icons-material/Info';
import SongsInfoCardMobile from './SongsInfoCardMobile';
import Snackbar from '@mui/material/Snackbar';
import ScreenRotationIcon from '@mui/icons-material/ScreenRotation';
import CloseIcon from '@mui/icons-material/Close';
import { specificSongsMobileWidth, specificSongsDesktopWidth } from '../../constants';

type SongsButtonCardProps = {
  song: SongViewSchema | undefined;
  userView?: boolean;
  userHeader?: boolean;
  songsSelectionRow?: React.ReactNode;
};

const SongsButtonsCard = ({
  song,
  userView = false,
  userHeader = false,
  songsSelectionRow,
}: SongsButtonCardProps) => {
  const [chordStatus, setChordStatus] = useState(false);
  const [count, setCount] = useState(0);
  const [useFlat, setUseFlat] = useState(false);
  const [split, setSplit] = useState(2);
  const theme = useTheme();
  const [showMobileInfo, setShowMobileInfo] = useState(false);
  const [showSplitSnackbar, setShowSplitSnackbar] = useState(false);
  const isSmallScreen = useMediaQuery(`(max-width:${specificSongsMobileWidth})`);
  const isDesktop = useMediaQuery(`(min-width:${specificSongsDesktopWidth})`);
  const switchStyle = {
    '& .Mui-checked': { color: theme.palette.secondary.main },
    '& .Mui-checked + .MuiSwitch-track': { backgroundColor: '#8175A0' },
  };
  const handleChange = (setter: React.Dispatch<React.SetStateAction<boolean>>) => {
    return (event: React.ChangeEvent<{}>, value: boolean) => {
      setter(value);
    };
  };

  const handleIncrement = () => {
    if (count < 11) setCount(count + 1);
    else setCount(0);
  };

  const handleDecrement = () => {
    if (count > 0) setCount(count - 1);
    else setCount(11);
  };

  const handleSplit = () => {
    if (isSmallScreen) {
      setShowSplitSnackbar(true);
      return;
    }
    if (split < 3) setSplit(split + 1);
    else setSplit(1);
  };

  useEffect(() => {
    setUseFlat(!!(song?.originalKey && song.originalKey.length > 1 && song.originalKey[1] === 'b'));
    setCount(
      useFlat && song
        ? flatMusicKeysOptions.indexOf(song.originalKey)
        : sharpMusicKeysOptions.indexOf(song?.originalKey || 'C')
    );
  }, [song]);

  return (
    <Container
      maxWidth={false}
      style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
    >
      <Box
        sx={{
          width: '100%',
          py: 2,
          pl: ['0px', '4px'],
        }}
      >
        <Box display="flex" gap={2} sx={{ overflowX: 'auto' }}>
          {songsSelectionRow}
          {/* Mobile view */}
          <Box
            sx={{
              display: isDesktop ? 'none' : 'block',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2,
              overflowX: 'auto',
              whiteSpace: 'nowrap',
              scrollbarWidth: 'none',
              '&::-webkit-scrollbar': { display: 'none' },
            }}
          >
            <Stack direction="row" alignItems={'center'} spacing={1}>
              <Stack
                display="flex"
                direction="row"
                spacing={2}
                sx={{
                  justifyContent: 'center',
                  background: '#322F35',
                  padding: '8px 16px',
                  borderRadius: '30px',
                }}
                alignItems={'center'}
              >
                <Box>
                  <Typography color="#E6E0E9">Split</Typography>
                </Box>
                <Box
                  bgcolor={'primary.main'}
                  height="30px"
                  width="30px"
                  borderRadius="4px"
                  onClick={handleSplit}
                >
                  <Stack
                    direction="row"
                    height="100%"
                    width="100%"
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    spacing={0.2}
                  >
                    {Array.from({ length: split }, (e, i) => {
                      return (
                        <Box
                          key={i}
                          bgcolor="primary.lightest"
                          height="15px"
                          width="6px"
                          borderRadius="2px"
                        />
                      );
                    })}
                  </Stack>
                </Box>
              </Stack>
              <Box
                fontSize={{ sm: '14px', md: '26px' }}
                sx={{
                  display: 'flex !important',
                  justifyContent: 'center',
                  background: '#322F35',
                  padding: '4px 10px',
                  borderRadius: '30px',
                }}
              >
                <FormGroup style={{ justifyContent: 'center' }}>
                  <FormControlLabel
                    labelPlacement="start"
                    sx={{ color: '#E6E0E9' }}
                    control={
                      <Switch
                        checked={chordStatus}
                        onChange={handleChange(setChordStatus)}
                        name="chords"
                        sx={switchStyle}
                      />
                    }
                    label="Chords"
                  />
                </FormGroup>
              </Box>
              <Stack
                direction="row"
                gap={{ xs: 0.2, sm: 2 }}
                alignItems={'center'}
                sx={{
                  justifyContent: 'center',
                  background: '#322F35',
                  padding: '4px 10px',
                  borderRadius: '30px',
                  display: chordStatus ? 'flex' : 'none',
                }}
              >
                <Box
                  padding="6px 6px"
                  sx={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center' }}
                >
                  <Typography color="#E6E0E9">Key</Typography>
                </Box>

                {/* key - down arrow */}
                <Box
                  bgcolor="primary.dark"
                  sx={{ borderRadius: '4px', width: ['24px', 'auto'], height: ['24px', 'auto'] }}
                >
                  <IconButton aria-label="down" onClick={handleDecrement} sx={{ padding: '0px' }}>
                    <KeyboardArrowDownIcon sx={{ color: 'primary.lightest' }} />
                  </IconButton>
                </Box>

                <Chip
                  label={
                    useFlat
                      ? flatMusicKeysOptions[count]
                        ? flatMusicKeysOptions[count]
                        : sharpMusicKeysOptions[count]
                      : sharpMusicKeysOptions[count]
                  }
                  sx={{ background: '#49454F' }}
                />

                {/* key - up arrow */}
                <Box
                  bgcolor="primary.dark"
                  sx={{ borderRadius: '4px', width: ['24px', 'auto'], height: ['24px', 'auto'] }}
                >
                  <IconButton aria-label="up" onClick={handleIncrement} sx={{ padding: '0px' }}>
                    <KeyboardArrowUpIcon sx={{ color: 'primary.lightest' }} />
                  </IconButton>
                </Box>
              </Stack>

              {/* flat toggle */}
              <Box
                fontSize={{ sm: '14px', md: '26px' }}
                sx={{
                  justifyContent: 'center',
                  background: '#322F35',
                  padding: '5px 10px',
                  borderRadius: '30px',
                  display: chordStatus ? 'flex' : 'none',
                }}
              >
                <FormGroup style={{ justifyContent: 'center' }}>
                  <FormControlLabel
                    labelPlacement="start"
                    sx={{ color: 'secondary.main' }}
                    control={
                      <Switch
                        checked={useFlat}
                        onChange={handleChange(setUseFlat)}
                        sx={switchStyle}
                        name="flat"
                      />
                    }
                    label="Flat"
                  />
                </FormGroup>
              </Box>
            </Stack>
          </Box>

          {/* Desktop view */}
          <Stack
            direction="row"
            spacing={1}
            sx={{ display: isDesktop ? 'block' : 'none' }}
            justifyContent="space-between"
          >
            {/* split columns settings */}

            <Box
              sx={{
                overflowX: 'auto',
                whiteSpace: 'nowrap',
                display: isDesktop ? 'flex' : 'none',
                gap: 2,
                alignItems: 'center',
                paddingRight: 2,
                scrollbarWidth: 'thin',
                '&::-webkit-scrollbar': {
                  height: 6,
                },
                '&::-webkit-scrollbar-thumb': {
                  backgroundColor: '#999',
                  borderRadius: 4,
                },
              }}
            >
              <Stack
                direction="row"
                spacing={2}
                display={isDesktop ? 'flex !important' : 'none !important'}
                alignItems={'center'}
                sx={{
                  display: 'flex !important',
                  justifyContent: 'center',
                  background: '#322F35',
                  padding: ['4px 10px', '8px 16px', '12px 20px'],
                  borderRadius: '30px',
                }}
              >
                <Box>
                  <Typography color="#E6E0E9">Split</Typography>
                </Box>
                <Box
                  bgcolor={'primary.main'}
                  height="30px"
                  width="30px"
                  borderRadius="4px"
                  onClick={handleSplit}
                >
                  <Stack
                    direction="row"
                    height="100%"
                    width="100%"
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    spacing={0.2}
                  >
                    {Array.from({ length: split }, (e, i) => {
                      return (
                        <Box
                          key={i}
                          bgcolor="primary.lightest"
                          height="15px"
                          width="6px"
                          borderRadius="2px"
                        />
                      );
                    })}
                  </Stack>
                </Box>
              </Stack>

              {/* chords toggle */}
              <Box
                fontSize={{ sm: '14px', md: '26px' }}
                sx={{
                  display: 'flex !important',
                  justifyContent: 'center',
                  background: '#322F35',
                  padding: ['4px 10px', '6px 12px', '8px 16px'],
                  borderRadius: '30px',
                }}
              >
                <FormGroup style={{ justifyContent: 'center' }}>
                  <FormControlLabel
                    labelPlacement="start"
                    sx={{ color: '#E6E0E9' }}
                    control={
                      <Switch
                        checked={chordStatus}
                        onChange={handleChange(setChordStatus)}
                        name="chords"
                        sx={switchStyle}
                      />
                    }
                    label="Chords"
                  />
                </FormGroup>
              </Box>

              {/* key settings */}
              <Stack
                direction="row"
                gap={{ xs: 0.2, sm: 2 }}
                alignItems={'center'}
                sx={{
                  justifyContent: 'center',
                  background: '#322F35',
                  padding: ['4px 10px', '6px 12px', '8px 16px'],
                  borderRadius: '30px',
                  display: chordStatus ? 'flex' : 'none',
                }}
              >
                <Box
                  padding="6px 6px"
                  sx={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center' }}
                >
                  <Typography color="#E6E0E9">Key</Typography>
                </Box>

                {/* key - down arrow */}
                <Box
                  bgcolor="primary.dark"
                  sx={{ borderRadius: '4px', width: ['24px', 'auto'], height: ['24px', 'auto'] }}
                >
                  <IconButton aria-label="down" onClick={handleDecrement} sx={{ padding: '0px' }}>
                    <KeyboardArrowDownIcon sx={{ color: 'primary.lightest' }} />
                  </IconButton>
                </Box>

                <Chip
                  label={
                    useFlat
                      ? flatMusicKeysOptions[count]
                        ? flatMusicKeysOptions[count]
                        : sharpMusicKeysOptions[count]
                      : sharpMusicKeysOptions[count]
                  }
                  sx={{ background: '#49454F' }}
                />

                {/* key - up arrow */}
                <Box
                  bgcolor="primary.dark"
                  sx={{ borderRadius: '4px', width: ['24px', 'auto'], height: ['24px', 'auto'] }}
                >
                  <IconButton aria-label="up" onClick={handleIncrement} sx={{ padding: '0px' }}>
                    <KeyboardArrowUpIcon sx={{ color: 'primary.lightest' }} />
                  </IconButton>
                </Box>
              </Stack>

              {/* flat toggle */}
              <Box
                fontSize={{ sm: '16px', md: '26px' }}
                sx={{
                  padding: ['4px 10px', '6px 12px', '10px 18px'],
                  display: chordStatus ? 'flex' : 'none',
                  justifyContent: 'center',
                  background: '#322F35',
                  borderRadius: '30px',
                }}
              >
                <FormGroup style={{ justifyContent: 'center' }}>
                  <FormControlLabel
                    labelPlacement="start"
                    sx={{ color: 'secondary.main' }}
                    control={
                      <Switch
                        checked={useFlat}
                        onChange={handleChange(setUseFlat)}
                        sx={switchStyle}
                        name="flat"
                      />
                    }
                    label="Flat"
                  />
                </FormGroup>
              </Box>
            </Box>

            {/* <Box display="flex" flexDirection="row" gap={1}> */}
            {/* add to setlist button */}
            {/* {userView ? null : (
              <Button
                variant="outlined"
                sx={{
                  borderWidth: '1px',
                  borderColor: '#332D41',
                  padding: '10px 25px',
                  borderRadius: '40px',
                  color: 'secondary.main',
                  textTransform: 'none',
                }}
                startIcon={<PlaylistAdd />}
              >
                <Typography variant="subtitle1">Add to Setlist</Typography>
              </Button>
            )} */}

            {/* share button */}
            {/* {userView ? null : (
              <Box
                alignItems="center"
                justifyContent="center"
                border="1px solid #332D41"
                sx={{ borderRadius: '100px', p: 1 }}
              >
                <IconButton>
                  <Share aria-label="share" sx={{ color: 'secondary.main' }} />
                </IconButton>
              </Box>
            )}
          </Box> */}
          </Stack>
        </Box>
      </Box>

      {/* render header */}
      {userHeader ? (
        <Box sx={{ width: '100%', padding: '12px 12px 12px 0' }}>
          <Typography variant="h2">{song?.title}</Typography>
          <Typography
            variant="subtitle2"
            style={{ color: theme.palette.secondary.main, margin: '8px 0' }}
          >
            {song?.artist}
          </Typography>
          <Divider style={{ borderColor: theme.palette.secondary.dark }} />
        </Box>
      ) : null}
      {/* render lyrics */}
      <Box
        sx={{
          maxWidth: '100%',
          height: '100%',
          display: 'flex',
          overflow: 'auto',
          padding: ['10px', '14px'],
          backgroundColor: '#141218',
          borderRadius: '12px',
          mb: '5vh',
        }}
      >
        <SongsLyrics
          useFlat={useFlat}
          chordStatus={chordStatus}
          changeKey={count}
          song={song}
          split={split}
        />
      </Box>

      {/* Not used? */}
      <SongsInfoCardMobile
        song={song}
        open={showMobileInfo}
        onClose={() => setShowMobileInfo(false)}
      />

      <Snackbar
        open={showSplitSnackbar}
        autoHideDuration={3000}
        onClose={() => setShowSplitSnackbar(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        ContentProps={{ sx: { background: 'transparent', boxShadow: 'none' } }}
      >
        <Box
          sx={{
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
          }}
        >
          <ScreenRotationIcon sx={{ color: '#4F378B', fontSize: 22, mr: 1 }} />
          <Box sx={{ px: 0.5 }}>Rotate phone to landscape to split</Box>
          <IconButton
            size="small"
            onClick={() => setShowSplitSnackbar(false)}
            sx={{
              color: '#4F378B',
              ml: 2, // margin-left for spacing
            }}
            aria-label="close"
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
      </Snackbar>
    </Container>
  );
};
export default SongsButtonsCard;
