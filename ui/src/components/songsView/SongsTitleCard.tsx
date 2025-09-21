import { Container, Box, Typography, IconButton, useMediaQuery } from '@mui/material';
import React, { useState } from 'react';
import { SongViewSchema } from '../../types/song.types';
import InfoIcon from '@mui/icons-material/Info';
import { specificSongsTabletWidth } from '../../constants';
import SongsInfoCardMobile from './SongsInfoCardMobile';
import SongInfoPopover from './SongInfoPopover';

type SongTitleCardProps = {
  song: SongViewSchema | undefined;
};

const SongsTitleCard = ({ song }: SongTitleCardProps) => {
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
          <Typography variant="h2" fontSize={{ sm: '24px', md: '28px' }}>
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
            />
          )}
        </Box>
        <Typography
          variant="subtitle2"
          color="primary.lightest"
          fontSize={{ sm: '14px', md: '20px' }}
        >
          {song?.artist}
        </Typography>
      </Box>
    </Container>
  );
};

export default SongsTitleCard;
