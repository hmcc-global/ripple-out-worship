import {
  Container,
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
} from '@mui/material';
import { SongViewSchema } from '../../types/song.types';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Grid from '@mui/material/Grid';
import Chip from '@mui/material/Chip';
import InfoIcon from '@mui/icons-material/Info';
import { useState } from 'react';

type SongTitleCardProps = {
  song: SongViewSchema | undefined;
};

const SongsInfoCard = (props: SongTitleCardProps) => {
  const song = props.song;
  const [open, setOpen] = useState(false);

  return (
    <Container maxWidth={false}>
      <Box>
        <Accordion
          disableGutters
          sx={{ backgroundColor: 'primary.darkest', borderRadius: '8px 8px 0 0' }}
          expanded={open}
          onChange={() => setOpen(!open)}
        >
          <Box>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon color="primary" />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography variant="subtitle1" display="flex" alignItems="center" color="#CCC2DC">
                <InfoIcon sx={{ marginRight: '2vh' }} fontSize="large" color="primary" />
                About The Song
              </Typography>
            </AccordionSummary>
          </Box>

          <AccordionDetails
            sx={{
              position: 'absolute',
              backgroundColor: 'primary.darkest',
              borderRadius: '0px 0px 8px 8px',
              maxHeight: open ? '500px' : '0',
              overflow: 'hidden',
              transition: 'max-height 0.5s ease-in-out',
            }}
          >
            <Box sx={{ flexGrow: 1 }}>
              <Grid container spacing={2}>
                <Grid item xs={3} md={4}>
                  <Typography color={'#938F99'}>Themes</Typography>
                </Grid>
                <Grid container item xs={9} md={8} spacing={1}>
                  {song &&
                    song.themes.map((themes: string, i: number) => {
                      return (
                        <Grid item xs={12} key={i}>
                          <Chip
                            sx={{ background: '#2B2930', color: '#CCC2DC', mx: 0.5 }}
                            label={themes}
                            key={i}
                          />
                        </Grid>
                      );
                    })}
                </Grid>
                <Grid item xs={3} md={4}>
                  <Typography color={'#938F99'}>Tempo</Typography>
                </Grid>
                <Grid item xs={9} md={8}>
                  {song &&
                    song.tempo.map((themes: string, i: number) => {
                      return (
                        <Chip
                          sx={{ background: '#2B2930', color: '#CCC2DC', mx: 0.5 }}
                          label={themes}
                          key={i}
                        />
                      );
                    })}
                </Grid>
                <Grid item xs={3} md={4}>
                  <Typography color={'#938F99'}>Original Key</Typography>
                </Grid>
                <Grid item xs={9} md={8}>
                  <Typography color="#CCC2DC">{song && song.originalKey}</Typography>
                </Grid>
                <Grid item xs={3} md={4}>
                  <Typography style={{ wordWrap: 'break-word' }} color={'#938F99'}>
                    Suggested Key(s)
                  </Typography>
                </Grid>
                <Grid item xs={9} md={8}>
                  <Typography color="#CCC2DC">{song && song.originalKey}</Typography>
                </Grid>
                <Grid item xs={3} md={4}>
                  <Typography color={'#938F99'}>Year</Typography>
                </Grid>
                <Grid item xs={9} md={8}>
                  <Typography color="#CCC2DC">{song && song.year}</Typography>
                </Grid>
                <Grid item xs={3} md={4}>
                  <Typography color={'#938F99'}>Code</Typography>
                </Grid>
                <Grid item xs={9} md={8}>
                  <Typography color="#CCC2DC">{song && song.code}</Typography>
                </Grid>
              </Grid>
            </Box>
          </AccordionDetails>
        </Accordion>
      </Box>
    </Container>
  );
};
export default SongsInfoCard;
