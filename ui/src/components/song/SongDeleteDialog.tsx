import { Box, Stack, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ConfirmationDialog from '../custom/ConfirmationDialog';
import { customAxios as axios } from '../custom/customAxios';
import { useNavigate } from 'react-router-dom';

type Props = {
  open: boolean;
  onClose: () => void;
  songId?: string;
};
const SongDeleteDialog = ({ open, onClose, songId }: Props) => {
  const navigate = useNavigate();

  const handleDelete = async () => {
    // TODO: add snackbar messages
    try {
      await axios.put('/api/songs/delete', { id: songId });
      onClose();
      navigate('/song');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <ConfirmationDialog
      open={open}
      onClose={onClose}
      onConfirm={handleDelete}
      title={
        <Box display="flex" flexDirection="row" alignItems="center" gap={1}>
          <DeleteIcon color="error" fontSize="large" />
          <Typography variant="h3" color="error">
            Delete Song
          </Typography>
        </Box>
      }
      confirmText="Confirm Delete Song"
      confirmColor="error"
      cancelColor="error"
      showCloseIcon
    >
      <Stack spacing={2} alignItems="center" textAlign="center" paddingY={2}>
        <Typography variant="h5">Are you sure you want to delete this song?</Typography>
        <Typography>This action cannot be undone</Typography>
      </Stack>
    </ConfirmationDialog>
  );
};

export default SongDeleteDialog;
