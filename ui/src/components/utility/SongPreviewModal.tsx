import React from 'react';
import { Modal, Stack, Typography, Button, Box } from '@mui/material';
import { SongSchema, SongSetlistSchema } from '../../types/song.types';
import { getLyricsPreview } from '../../helpers/song';

interface SongPreviewModalProps {
  open: boolean;
  onClose: () => void;
  songToPreview: SongSchema;
}

const SongPreviewModal: React.FC<SongPreviewModalProps> = ({ open, onClose, songToPreview }) => {
  return (
    <Modal open={open} onClose={onClose}>
      <Stack
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 'fit-content',
          bgcolor: '#2B2930',
          borderRadius: '10px',
          boxShadow: 2,
          p: '1.5rem',
        }}
        spacing={'8px'}
      >
        <Typography variant="h2">{songToPreview.title}</Typography>
        <Typography variant="subtitle1" sx={{ color: 'secondary.light' }}>
          {songToPreview?.artist}
        </Typography>
        <Typography sx={{ color: 'white' }}>
          {getLyricsPreview(songToPreview.chordLyrics)}
        </Typography>
        <Box
          display="flex"
          flexDirection={'row'}
          justifyContent="flex-end"
          alignItems="center"
          paddingTop={'8px'}
        >
          <Button
            onClick={onClose}
            variant="contained"
            sx={{
              backgroundColor: '#D0BCFF',
              color: '#381E72',
            }}
          >
            Close
          </Button>
        </Box>
      </Stack>
    </Modal>
  );
};

export default SongPreviewModal;
