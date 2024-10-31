import { SongSetlistSchema } from '../../../types/song.types';
import { Box, Divider, Grid, Typography, useTheme } from '@mui/material';

type Props = {
  songs: SongSetlistSchema[];
};

const SongsTable = ({ songs }: Props) => {
  const theme = useTheme();
  // TO-DO: change the theme colors
  return (
    <Grid
      container
      style={{
        borderRadius: '16px',
        backgroundColor: '#0F0D13',
        padding: '16px',
        gap: '12px',
      }}
    >
      <Grid container item xs={12}>
        <Grid item xs={1}>
          {' '}
          <Typography>#</Typography>
        </Grid>
        <Grid item xs={10}>
          {' '}
          <Typography>Song Title</Typography>
        </Grid>
        <Grid item xs={1}>
          <Typography>Key</Typography>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Divider color="#332D41" />
      </Grid>
      {songs &&
        songs.length > 0 &&
        songs.map((song, index) => (
          <Grid container item xs={12} key={song._id}>
            <Grid item xs={1}>
              <Typography>{index + 1}</Typography>
            </Grid>
            <Grid item xs={10}>
              <Typography variant="h3">{song.title}</Typography>
              <Typography variant="body2">{song.artist}</Typography>
            </Grid>
            <Grid item xs={1}>
              <Box
                style={{
                  background: '#4F378B',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: '40px',
                  width: '40px',
                  height: '40px',
                }}
              >
                <Typography>{song.key}</Typography>
              </Box>
            </Grid>
          </Grid>
        ))}
    </Grid>
  );
};

export default SongsTable;
