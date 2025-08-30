import {
  Container,
  Box,
  Typography,
  IconButton,
  useMediaQuery,
  Popover,
  Grid,
  Chip,
} from '@mui/material';
import { SongViewSchema } from '../../types/song.types';
import InfoIcon from '@mui/icons-material/Info';
import React, { useState } from 'react';
import { specificSongsTabletWidth } from '../../constants';
import SongsInfoCardMobile from './SongsInfoCardMobile';

type SongTitleCardProps = {
  song: SongViewSchema | undefined;
};

const SongsTitleCard = (props: SongTitleCardProps) => {
  const song = props.song;
  const isMobile = useMediaQuery(`(max-width:${specificSongsTabletWidth})`);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [showMobileInfo, setShowMobileInfo] = useState(false);
  const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
    if (!isMobile) {
      setAnchorEl(event.currentTarget);
    }
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const handleIconClick = () => {
    if (isMobile) {
      setShowMobileInfo(true);
    }
  };

  const popoverOpen = Boolean(anchorEl) && !isMobile;

  return (
    <Container>
      <Box sx={{ minWidth: 150 }}>
        <Box display="flex" alignItems="center">
          <Typography variant="h2" fontSize={{ sm: '24px', md: '34px' }}>
            {song?.title}
          </Typography>
          <IconButton
            onMouseEnter={handlePopoverOpen}
            onMouseLeave={handlePopoverClose}
            onClick={handleIconClick}
            sx={{ color: 'secondary.main' }}
            aria-haspopup="true"
            aria-owns={popoverOpen ? 'mouse-over-popover' : undefined}
          >
            <InfoIcon />
          </IconButton>
          {/* Desktop/tablet: hover Popover */}
          {!isMobile && popoverOpen && (
            <Popover
              id="mouse-over-popover"
              open={popoverOpen}
              anchorEl={anchorEl}
              onClose={handlePopoverClose}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              sx={{
                pointerEvents: 'none',
              }}
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
                {song && (
                  <Box sx={{ flexGrow: 1 }}>
                    <Grid container spacing={1}>
                      <Grid item xs={3} md={4}>
                        <Typography color="#938F99">Themes</Typography>
                      </Grid>
                      <Grid container item xs={9} md={8} spacing={1}>
                        {song.themes.map((themes: string, i: number) => (
                          <Grid item xs={12} key={i}>
                            <Chip
                              sx={{ background: '#2B2930', color: '#CCC2DC', mx: 0.5 }}
                              label={themes}
                            />
                          </Grid>
                        ))}
                      </Grid>
                      <Grid item xs={3} md={4}>
                        <Typography color="#938F99">Tempo</Typography>
                      </Grid>
                      <Grid item xs={9} md={8}>
                        {song.tempo.map((themes: string, i: number) => (
                          <Chip
                            sx={{ background: '#2B2930', color: '#CCC2DC', mx: 0.5 }}
                            label={themes}
                            key={i}
                          />
                        ))}
                      </Grid>
                      <Grid item xs={3} md={4}>
                        <Typography color="#938F99">Original Key</Typography>
                      </Grid>
                      <Grid item xs={9} md={8}>
                        <Typography color="#CCC2DC">{song.originalKey}</Typography>
                      </Grid>
                      <Grid item xs={3} md={4}>
                        <Typography style={{ wordWrap: 'break-word' }} color="#938F99">
                          Suggested Key(s)
                        </Typography>
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
                )}
              </Box>
            </Popover>
          )}
          {/* Mobile: click opens info card */}
          {isMobile && showMobileInfo && (
            <SongsInfoCardMobile song={song} onClose={() => setShowMobileInfo(false)} />
          )}
        </Box>
        <Typography
          variant="subtitle2"
          color="primary.lightest"
          fontSize={{ sm: '14px', md: '26px' }}
        >
          {song?.artist}
        </Typography>
      </Box>
    </Container>
  );
};

export default SongsTitleCard;
