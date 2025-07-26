import { Container, Box, Typography } from '@mui/material';
import { SongViewSchema } from '../../types/song.types';

type SongTitleCardProps = {
  song: SongViewSchema | undefined;
};

const SongsTitleCard = (props: SongTitleCardProps) => {
  const song = props.song;

  return (
    <>
      <Container>
        <Box sx={{ minWidth: 150 }}>
          <Typography variant="h2" fontSize={{ sm: '24px', md: '34px' }}>
            {song && song.title}
          </Typography>
          <Typography
            variant="subtitle2"
            color="primary.lightest"
            fontSize={{ sm: '14px', md: '26px' }}
          >
            {song && song.artist}
          </Typography>
        </Box>
      </Container>
    </>
  );
};
export default SongsTitleCard;
