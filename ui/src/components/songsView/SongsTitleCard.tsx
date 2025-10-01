import { Container, Box, Typography, IconButton, useMediaQuery, Stack } from '@mui/material';
import React, { useState } from 'react';
import { SongViewSchema } from '../../types/song.types';
import InfoIcon from '@mui/icons-material/Info';
import { specificSongsTabletWidth } from '../../constants';
import SongsInfoCardMobile from './SongsInfoCardMobile';
import SongInfoPopover from './SongInfoPopover';

type SongTitleCardProps = {
  song: SongViewSchema | undefined;
  isSetlistView?: boolean;
};

const SongsTitleCard = ({ song, isSetlistView = false }: SongTitleCardProps) => {
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
    <Container disableGutters={isSetlistView} maxWidth={false}>
      <Stack
        flexDirection={'column'}
        alignItems={'flex-start'}
        justifyContent={'center'}
        sx={{ minWidth: '100%', width: '100%' }}
      >
        <Box display="flex" alignItems="center">
          <Typography
            variant="h2"
            fontSize={
              isSetlistView ? { xs: '1.25rem', lg: '1.375rem' } : { sm: '24px', md: '34px' }
            }
          >
            {song?.title}
          </Typography>
          <IconButton
            onMouseEnter={handlePopoverOpen}
            onMouseLeave={handlePopoverClose}
            onClick={handleIconClick}
            sx={{ color: 'secondary.main' }}
            aria-haspopup="true"
            aria-owns={popoverOpen ? 'song-info-popover' : undefined}
          >
            <InfoIcon />
          </IconButton>
          {/* Desktop/Tablet: Hover popover */}
          {!isMobile && (
            <SongInfoPopover
              song={song}
              anchorEl={anchorEl}
              open={popoverOpen}
              onClose={handlePopoverClose}
            />
          )}
          {/* Mobile: Click displays bottom drawer/card */}
          {isMobile && (
            <SongsInfoCardMobile
              song={song}
              open={showMobileInfo}
              onClose={() => setShowMobileInfo(false)}
              isSetlistView={isSetlistView}
            />
          )}
        </Box>
        <Typography
          variant="subtitle2"
          color="primary.lightest"
          fontSize={isSetlistView ? { xs: '0.75rem', lg: '0.875rem' } : { sm: '14px', md: '26px' }}
        >
          {song?.artist}
        </Typography>
      </Stack>
    </Container>
  );
};

export default SongsTitleCard;
