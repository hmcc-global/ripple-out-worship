import {
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Snackbar,
  useTheme,
} from '@mui/material';
import ShareIcon from '@mui/icons-material/Share';
import EditIcon from '@mui/icons-material/Edit';
import { useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';

type Props = {
  anchorEl: HTMLElement | null;
  open: boolean;
  onClose: () => void;
};
const SetlistViewMenuMobile = (props: Props) => {
  const { onClose } = props;
  const [open, setOpen] = useState(false);
  const theme = useTheme();

  const handleCloseSnackbar = (event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  const handleShare = () => {
    setOpen(true);
    navigator.clipboard.writeText(window.location.href);
    onClose();
  };

  const handleEdit = () => {
    onClose();
  };

  return (
    <>
      <Menu {...props}>
        <MenuItem onClick={handleShare}>
          <ListItemIcon>
            <ShareIcon style={{ color: theme.palette.primary.light }} fontSize="small" />
          </ListItemIcon>
          <ListItemText>Share Setlist</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleEdit}>
          <ListItemIcon>
            <EditIcon style={{ color: theme.palette.primary.light }} fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit Setlist (when user access is done)</ListItemText>
        </MenuItem>
      </Menu>
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

export default SetlistViewMenuMobile;
