import { Box, Stack, Typography } from '@mui/material';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import { FC, ReactElement } from 'react';

type RecommendedSongCardProps = {
  songTitle: string;
  artistName: string;
};

const RecommendedSongCard: FC<RecommendedSongCardProps> = ({
  songTitle,
  artistName,
}): ReactElement => {
  return (
    <Box
      sx={{
        borderRadius: '12px',
        backgroundColor: '#141218',
        border: 1,
        borderColor: '#49454F',
        p: 3,
        width: ['100%', '38%'],
        '&:hover': {
          cursor: 'pointer',
          backgroundColor: '#1E1B26',
        },
      }}
    >
      <Stack direction={'row'} alignItems="center" gap={2}>
        <MusicNoteIcon sx={{ color: 'primary.light', width: '1.5em', height: '1.5em' }} />
        <Stack direction="column">
          <Typography variant="h4" sx={{ pb: 1 }}>
            {songTitle}
          </Typography>
          <Typography>{artistName}</Typography>
        </Stack>
      </Stack>
    </Box>
  );
};

export default RecommendedSongCard;
