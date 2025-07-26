import { flatMusicKeysOptions, sharpMusicKeysOptions } from '../../constants';
import {
  Box,
  Chip,
  Drawer,
  DrawerProps,
  FormControlLabel,
  FormGroup,
  IconButton,
  Stack,
  Switch,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

type MobileDrawerProps = DrawerProps & {
  chordStatus: boolean;
  split: number;
  useFlat: boolean;
  count: number;
  setSplit: React.Dispatch<React.SetStateAction<number>>;
  setChordStatus: React.Dispatch<React.SetStateAction<boolean>>;
  setCount: React.Dispatch<React.SetStateAction<number>>;
  setUseFlat: React.Dispatch<React.SetStateAction<boolean>>;
};

const SetlistViewMobileDrawer = (props: MobileDrawerProps) => {
  const {
    open,
    onClose,
    count,
    useFlat,
    chordStatus,
    split,
    setChordStatus,
    setSplit,
    setUseFlat,
    setCount,
  } = props;
  const isDesktop = useMediaQuery('(min-width:768px)');
  const theme = useTheme();

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
    if (split < 3) setSplit(split + 1);
    else setSplit(1);
  };

  const buttonClass = {
    display: chordStatus ? 'flex' : 'none',
    justifyContent: 'center',
    background: theme.palette.secondary.dark,
    padding: '12px 16px',
    borderRadius: '30px',
  };
  const switchStyle = {
    '& .Mui-checked': { color: theme.palette.secondary.main },
    '& .Mui-checked + .MuiSwitch-track': { backgroundColor: '#8175A0' },
  };

  return (
    <Drawer open={open} onClose={onClose}>
      <Box width="80vw" padding="48px 32px">
        <Typography variant="h3" marginBottom="24px">
          Song Controls
        </Typography>
        <Stack direction="column" spacing={2} alignItems="flex-start">
          {/* chords toggle */}
          <Box
            fontSize={{ sm: '16px', md: '26px' }}
            style={buttonClass}
            sx={{ display: 'flex !important' }}
          >
            <FormGroup style={{ justifyContent: 'center' }}>
              <FormControlLabel
                labelPlacement="start"
                sx={{ color: 'secondary.main' }}
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
            spacing={{ sm: 1, md: 1.5 }}
            alignItems={'center'}
            style={buttonClass}
          >
            <Box padding="6px 6px" sx={{ width: '40px', height: '40px' }}>
              <Typography color="secondary.main">Key</Typography>
            </Box>

            {/* key - down arrow */}
            <Box bgcolor="primary.dark" sx={{ borderRadius: '4px' }}>
              <IconButton aria-label="down" onClick={handleDecrement}>
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
            <Box bgcolor="primary.dark" sx={{ borderRadius: '4px' }}>
              <IconButton aria-label="up" onClick={handleIncrement}>
                <KeyboardArrowUpIcon sx={{ color: 'primary.lightest' }} />
              </IconButton>
            </Box>
          </Stack>

          {/* flat toggle */}
          <Box fontSize={{ sm: '16px', md: '26px' }} style={buttonClass}>
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
    </Drawer>
  );
};

export default SetlistViewMobileDrawer;
