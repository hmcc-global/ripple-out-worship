import { Drawer, CardContent, Typography, Chip, Box, Grid, IconButton, Stack } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import CloseIcon from '@mui/icons-material/Close';
import { SongViewSchema } from '../../types/song.types';
import { mobileNavbarHeight } from '../../constants';

interface SongsInfoCardMobileProps {
  song: SongViewSchema | undefined;
  open: boolean;
  onClose: () => void;
}

const SongsInfoCardMobile = ({ song, open, onClose }: SongsInfoCardMobileProps) => {
  if (!song) return null;

  return (
    <Drawer
      anchor="bottom"
      open={open}
      onClose={onClose}
      sx={{ bottom: mobileNavbarHeight, '& .MuiBackdrop-root': { bottom: mobileNavbarHeight } }}
      PaperProps={{
        sx: {
          borderRadius: '20px 20px 0 0',
          bgcolor: 'primary.darkest',
          maxWidth: '100vw',
          bottom: mobileNavbarHeight,
        },
      }}
    >
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2} p={1}>
          <Box display="flex" alignItems="center">
            <InfoIcon sx={{ mr: 1, color: 'secondary.main' }} />
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
            <Typography color="#938F99">Code</Typography>
          </Grid>
          <Grid item xs={8}>
            <Typography color="#CCC2DC">{song.code}</Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Drawer>
  );
};

export default SongsInfoCardMobile;
