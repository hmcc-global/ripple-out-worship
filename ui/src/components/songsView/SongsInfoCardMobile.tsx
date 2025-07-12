import { Card, CardContent, Typography, Chip, Box, Grid, IconButton } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import { SongViewSchema } from '../../types/song.types';
import CloseIcon from '@mui/icons-material/Close';
import Stack from '@mui/material/Stack';

interface SongsInfoCardMobileProps {
  song: SongViewSchema | undefined;
  onClose: () => void;
}

const SongsInfoCardMobile = ({ song, onClose }: SongsInfoCardMobileProps) => {
  if (!song) {
    return null;
  }

  return (
    <Card
      elevation={8}
      sx={{
        position: 'fixed',
        left: 0,
        right: 0,
        bottom: 80,
        borderRadius: '20px 20px 0 0',
        bgcolor: 'primary.darkest',
        zIndex: (theme) => theme.zIndex.drawer + 2,
        maxWidth: '100vw',
      }}
    >
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2} p={1}>
          <Box display="flex" alignItems="center">
            <InfoIcon color="primary" sx={{ mr: 1 }} />
            <Typography variant="subtitle1" color="#CCC2DC" fontWeight="bold">
              About The Song
            </Typography>
          </Box>
          <IconButton onClick={onClose} size="small" sx={{ color: '#CCC2DC' }}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Grid container spacing={1}>
          <Grid item xs={4}>
            <Typography color="#938F99">Themes</Typography>
          </Grid>
          <Grid item xs={8}>
            <Stack spacing={0.5}>
              {song.themes.map((theme, i) => (
                <Chip
                  key={i}
                  label={theme}
                  sx={{
                    background: '#2B2930',
                    color: '#CCC2DC',
                    width: 'fit-content',
                    mr: 0.5,
                    mb: 0,
                  }}
                  size="small"
                />
              ))}
            </Stack>
          </Grid>

          <Grid item xs={4}>
            <Typography color="#938F99">Tempo</Typography>
          </Grid>
          <Grid item xs={8}>
            {song.tempo.map((t, i) => (
              <Chip
                key={i}
                label={t}
                sx={{ background: '#2B2930', color: '#CCC2DC', mr: 0.5, mb: 0.5 }}
                size="small"
              />
            ))}
          </Grid>
          <Grid item xs={4}>
            <Typography color="#938F99">Original Key</Typography>
          </Grid>
          <Grid item xs={8}>
            <Typography color="#CCC2DC">{song.originalKey}</Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography color="#938F99">Year</Typography>
          </Grid>
          <Grid item xs={8}>
            <Typography color="#CCC2DC">{song.year}</Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography color={'#938F99'}>Code</Typography>
          </Grid>
          <Grid item xs={8}>
            <Typography color="#CCC2DC">{song && song.code}</Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default SongsInfoCardMobile;
