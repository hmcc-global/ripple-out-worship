import { Box, Stack, Typography, useTheme } from '@mui/material';
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
  const theme = useTheme();
  return (
    <Box
      sx={{
        borderRadius: '12px',
        backgroundColor: theme.palette.background.default,
        border: 1,
        borderColor: theme.palette.surfaceVariant,
        p: 3,
        width: ['100%', '38%'],
        '&:hover': {
          cursor: 'pointer',
          backgroundColor: theme.palette.surfaceContainerLow,
        },
      }}
    >
      <Stack direction={'row'} alignItems="center" gap={2}>
        <MusicNoteIcon sx={{ color: theme.palette.primary.light, width: '1.5em', height: '1.5em' }} />
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
