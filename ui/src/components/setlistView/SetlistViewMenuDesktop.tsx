import {
  Button,
  IconButton,
  List,
  ListItemIcon,
  Snackbar,
  Typography,
  useTheme,
} from '@mui/material';
import ShareIcon from '@mui/icons-material/Share';
import EditIcon from '@mui/icons-material/Edit';
import { useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import { BorderColor } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const SetlistViewMenuDesktop = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();
  const setlistId = window.location.pathname.split('/').reverse()[0];

  const ButtonStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    borderRadius: '30px',
    borderColor: theme.palette.secondary.main,
  };

  const handleCloseSnackbar = (event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  const handleShare = () => {
    setOpen(true);
    navigator.clipboard.writeText(window.location.href);
  };

  const handleEdit = () => {
    navigate(`/setlist/edit/${setlistId}`);
  };

  return (
    <>
      <List style={{ display: 'flex', gap: '24px', paddingBottom: '0px' }}>
        <Button style={ButtonStyle} variant="outlined" onClick={handleEdit}>
          <ListItemIcon style={{ minWidth: 'unset' }}>
            <EditIcon style={{ color: theme.palette.primary.light }} fontSize="small" />
          </ListItemIcon>
          <Typography color={theme.palette.secondary.main}>Edit</Typography>
        </Button>
        <Button style={ButtonStyle} variant="outlined" onClick={handleShare}>
          <ListItemIcon style={{ minWidth: 'unset' }}>
            <ShareIcon style={{ color: theme.palette.primary.light }} fontSize="small" />
          </ListItemIcon>
          <Typography color={theme.palette.secondary.main}>Copy Link</Typography>
        </Button>
      </List>
      <Snackbar
        open={open}
        autoHideDuration={5000}
        onClose={handleCloseSnackbar}
        message="Setlist Public Link copied to clipboard"
        action={
          <IconButton size="small" aria-label="close" color="inherit" onClick={handleCloseSnackbar}>
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      />
    </>
  );
};

export default SetlistViewMenuDesktop;
