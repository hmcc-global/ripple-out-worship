import { Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { forwardRef } from 'react';
import MusicNoteIcon from '@mui/icons-material/MusicNote';

type SongSearchResultProps = {
  _id: string;
  title: string;
  keyword: string;
  isFocused: boolean;
  onClose: () => void;
};

const SongSearchResult = forwardRef<HTMLDivElement, SongSearchResultProps>((props, ref?) => {
  const navigate = useNavigate();

  const { _id, title, keyword, isFocused, onClose } = props;

  const handleSelect = () => {
    if (keyword === '') {
      navigate('/song');
    } else {
      navigate(`/song/${_id}`);
    }
    onClose();
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        gap: '0.5rem',
        justifyContent: 'flex-start',
        alignItems: 'center',
        width: '100%',
        p: '0.75rem',
        borderRadius: '5px',
        '&:hover, &:focus': {
          backgroundColor: '#6750A4',
        },
        backgroundColor: isFocused ? '#6750A4' : '#211F26',
        cursor: 'pointer',
        outline: 'none',
      }}
      ref={ref}
      onClick={handleSelect}
    >
      <MusicNoteIcon sx={{ color: '#CAC4D0' }} />
      <Typography variant="body1" color="#CAC4D0">
        {keyword === '' ? 'Explore all songs' : title}
      </Typography>
    </Box>
  );
});

export default SongSearchResult;
