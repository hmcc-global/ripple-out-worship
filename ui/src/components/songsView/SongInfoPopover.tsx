import { Popover, Box, Typography, Grid, Chip } from '@mui/material';
import { SongViewSchema } from '../../types/song.types';

type SongInfoPopoverProps = {
  song: SongViewSchema | undefined;
  anchorEl: HTMLElement | null;
  open: boolean;
  onClose: () => void;
};

const SongInfoPopover = ({ song, anchorEl, open, onClose }: SongInfoPopoverProps) => {
  if (!song) return null;

  return (
    <Popover
      id="song-info-popover"
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      transformOrigin={{ vertical: 'top', horizontal: 'left' }}
      sx={{ pointerEvents: 'none' }}
      slotProps={{
        paper: {
          sx: {
            p: 2,
            background: '#201F25',
            color: '#CCC2DC',
            borderRadius: 2,
            minWidth: 140,
            maxWidth: 340,
            border: '1px solid #717171',
            mt: 0.5,
          },
        },
      }}
      disableRestoreFocus
    >
      <Box>
        <Typography fontSize="1rem" fontWeight={700} mb={1} color="#CCC2DC">
          About The Song
        </Typography>
        <Box sx={{ flexGrow: 1 }}>
          <Grid container spacing={1}>
            <Grid item xs={3} md={4}>
              <Typography color="#938F99">Themes</Typography>
            </Grid>
            <Grid container item xs={9} md={8} spacing={1}>
              {song.themes.map((theme: string, i: number) => (
                <Grid item xs={12} key={i}>
                  <Chip sx={{ background: '#2B2930', color: '#CCC2DC', mx: 0.5 }} label={theme} />
                </Grid>
              ))}
            </Grid>
            <Grid item xs={3} md={4}>
              <Typography color="#938F99">Tempo</Typography>
            </Grid>
            <Grid item xs={9} md={8}>
              {song.tempo.map((t: string, i: number) => (
                <Chip sx={{ background: '#2B2930', color: '#CCC2DC', mx: 0.5 }} label={t} key={i} />
              ))}
            </Grid>
            <Grid item xs={3} md={4}>
              <Typography color="#938F99">Original Key</Typography>
            </Grid>
            <Grid item xs={9} md={8}>
              <Typography color="#CCC2DC">{song.originalKey}</Typography>
            </Grid>
            <Grid item xs={3} md={4}>
              <Typography color="#938F99">Year</Typography>
            </Grid>
            <Grid item xs={9} md={8}>
              <Typography color="#CCC2DC">{song.year}</Typography>
            </Grid>
            <Grid item xs={3} md={4}>
              <Typography color="#938F99">Code</Typography>
            </Grid>
            <Grid item xs={9} md={8}>
              <Typography color="#CCC2DC">{song.code}</Typography>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Popover>
  );
};

export default SongInfoPopover;
