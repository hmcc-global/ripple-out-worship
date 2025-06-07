import { otherProfileProps } from '#/types/user.types';
import {
  Box,
  Typography,
  Divider,
  TextField,
  Button,
  Modal,
  styled,
  useTheme,
} from '@mui/material';
import CreateIcon from '@mui/icons-material/Create';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: '90%', sm: 400 },
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: { xs: 2, sm: 4 },
  borderRadius: '20px',
};

const DisabledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiInputBase-input.Mui-disabled': {
    WebkitTextFillColor: theme.palette.text.primary,
    color: theme.palette.text.primary,
  },
  '& .MuiInputLabel-root.Mui-disabled': {
    color: theme.palette.text.primary,
  },
  '& .MuiOutlinedInput-root.Mui-disabled .MuiOutlinedInput-notchedOutline': {
    borderColor: 'white',
  },
}));

const EditModal = (props: otherProfileProps) => {
  const { onSubmit, register, open, getFormValues, handleClose, user } = props;
  const theme = useTheme();
  return (
    <Modal open={!!open} onClose={handleClose}>
      <Box sx={modalStyle}>
        <Box
          style={{
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'wrap',
            marginBottom: '24px',
            gap: '8px',
          }}
        >
          <CreateIcon color="secondary" style={{ marginLeft: '2%' }} />
          <Typography variant="h3" color={theme.palette.text.primary}>
            Edit Profile
          </Typography>
        </Box>
        <Typography variant="h3">Old Name & Email</Typography>
        <Divider style={{ marginBottom: '3%' }} />
        <DisabledTextField
          fullWidth
          disabled
          id="outlined-name"
          label="Name"
          value={user?.fullName}
          {...register('fullName', { required: true })}
          style={{ marginBottom: '5%' }}
        />
        <DisabledTextField
          fullWidth
          disabled
          id="outlined-email"
          label="Email"
          value={user?.email}
          {...register('email', { required: true })}
          style={{ marginBottom: '5%' }}
        />
        <Typography variant="h3">New Name</Typography>
        <Divider style={{ marginBottom: '3%' }} />
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit(getFormValues());
            handleClose();
          }}
        >
          <TextField
            fullWidth
            required
            id="outlined-name"
            {...register('fullName')}
            label="Enter New Name"
            style={{ marginBottom: '5%' }}
          />
          <TextField
            fullWidth
            disabled
            id="outlined-email"
            label="Email"
            value={user?.email}
            {...register('email', { required: true })}
            style={{ marginBottom: '5%' }}
            sx={{
              '& .MuiInputBase-input.Mui-disabled': {
                WebkitTextFillColor: 'white',
              },
            }}
          />
          <Box display="flex" justifyContent="flex-end" gap={2}>
            <Button
              color="secondary"
              onClick={handleClose}
              variant="outlined"
              style={{ borderRadius: '20px' }}
            >
              Cancel
            </Button>
            <Button
              color="secondary"
              variant="contained"
              type="submit"
              style={{ borderRadius: '20px' }}
            >
              <Typography color="inherit" variant="button">
                Save
              </Typography>
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  );
};

export default EditModal;
