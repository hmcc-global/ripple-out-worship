import React, { useEffect, useState } from 'react';
import {
  Modal,
  Stack,
  Typography,
  Button,
  Box,
  IconButton,
  FormControlLabel,
  Switch,
} from '@mui/material';
import { SongSetlistSchema } from '../../types/song.types';
import { Close, KeyboardArrowDown, KeyboardArrowUp, Tune } from '@mui/icons-material';
import HeaderWithIcon from '../custom/HeaderWithIcon';
import { flatMusicKeysOptions, sharpMusicKeysOptions } from '../../constants';

interface SetlistChangeKeyModalProps {
  open: boolean;
  onClose: () => void;
  song: SongSetlistSchema;
  handleSave: (newKey: string) => void;
}

const SetlistChangeKeyModal: React.FC<SetlistChangeKeyModalProps> = ({
  open,
  onClose,
  song,
  handleSave,
}) => {
  const [count, setCount] = useState(
    sharpMusicKeysOptions.indexOf(song.key ?? 'C') || flatMusicKeysOptions.indexOf(song.key ?? 'C')
  );
  const [useFlat, setUseFlat] = useState<boolean | null>(null);
  const [key, setKey] = useState<string>(song.key ?? 'C');

  useEffect(() => {
    const count = sharpMusicKeysOptions.indexOf(song.key ?? 'C');
    if (count >= 0) {
      setUseFlat(false);
      setCount(count);
    } else {
      setUseFlat(true);
      setCount(flatMusicKeysOptions.indexOf(song.key ?? 'C'));
    }
  }, [song.key]);

  useEffect(() => {
    setKey(useFlat ? flatMusicKeysOptions[count] : sharpMusicKeysOptions[count]);
  }, [count, useFlat]);

  const handleIncrement = () => {
    if (count < 11) setCount(count + 1);
    else setCount(0);
  };

  const handleDecrement = () => {
    if (count > 0) setCount(count - 1);
    else setCount(11);
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Stack
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: '#2B2930',
          borderRadius: '10px',
          boxShadow: 2,
          p: '1.5rem',
        }}
        spacing={'8px'}
      >
        <Box
          display="flex"
          flexDirection={'row'}
          justifyContent="space-between"
          alignItems="center"
        >
          <HeaderWithIcon
            Icon={Tune}
            headerText="Change Key"
            headerVariant="h2"
            headerColor="primary.lighter"
            iconColor="secondary.main"
          />
          <IconButton onClick={onClose} size="small">
            <Close
              sx={{
                color: 'primary.lighter',
              }}
            />
          </IconButton>
        </Box>
        <Typography sx={{ color: 'white' }}>
          Pre-select the chords key to be displayed on the setlist. You will still be able to change
          the key on the screen.
        </Typography>
        <FormControlLabel
          labelPlacement="start"
          sx={{ color: 'secondary.main' }}
          control={
            <Switch
              checked={useFlat ?? false}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUseFlat(e.target.checked)}
              name="flat"
            />
          }
          label="Flat (♭)"
        />
        <Stack
          direction="row"
          spacing={{ sm: 1, md: 1.5 }}
          alignItems={'center'}
          justifyContent={'center'}
          width={'100%'}
        >
          {/* key - down arrow */}
          <Box bgcolor="primary.main" sx={{ borderRadius: '4px' }}>
            <IconButton aria-label="down" onClick={handleDecrement}>
              <KeyboardArrowDown sx={{ color: 'primary.lightest' }} />
            </IconButton>
          </Box>

          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            sx={{
              width: '55px',
              height: '55px',
              bgcolor: 'secondary.lighter',
              borderRadius: '100px',
            }}
          >
            <Typography color="primary.lightest" fontSize={'1.25rem'}>
              {key}
            </Typography>
          </Box>

          {/* key - up arrow */}
          <Box bgcolor="primary.main" sx={{ borderRadius: '4px' }}>
            <IconButton aria-label="up" onClick={handleIncrement}>
              <KeyboardArrowUp sx={{ color: 'primary.lightest' }} />
            </IconButton>
          </Box>
        </Stack>
        <Box
          display="flex"
          flexDirection={'row'}
          justifyContent="flex-end"
          alignItems="center"
          paddingTop={'8px'}
        >
          <Button
            onClick={() =>
              handleSave(useFlat ? flatMusicKeysOptions[count] : sharpMusicKeysOptions[count])
            }
            variant="contained"
            sx={{
              backgroundColor: '#D0BCFF',
              color: '#381E72',
            }}
          >
            Save
          </Button>
        </Box>
      </Stack>
    </Modal>
  );
};

export default SetlistChangeKeyModal;
