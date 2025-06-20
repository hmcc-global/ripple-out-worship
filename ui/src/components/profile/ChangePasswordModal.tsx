import { otherProfileProps } from '#/types/user.types';
import { VisibilityOff, Visibility } from '@mui/icons-material';
import {
  Box,
  Typography,
  Divider,
  TextField,
  InputAdornment,
  IconButton,
  Button,
  Modal,
  useTheme,
} from '@mui/material';
import { useState } from 'react';
import LockIcon from '@mui/icons-material/Lock';

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

const ChangePasswordModal = (props: otherProfileProps) => {
  const theme = useTheme();
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [matchPassword, setMatchPassword] = useState(false);
  const handleClickShowOldPassword = () => setShowOldPassword((show) => !show);
  const handleClickShowNewPassword = () => setShowNewPassword((show) => !show);
  const handleClickShowConfirmNewPassword = () => setShowConfirmNewPassword((show) => !show);
  const { open, onSubmit, getFormValues, register, handleClose } = props;

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const onVerifyPassword = () => {
    const newPassword = getFormValues('newPassword');
    if (newPassword !== confirmPassword) {
      setMatchPassword(false);
      return;
    } else {
      setMatchPassword(true);
    }
  };

  return (
    <Modal open={!!open} onClose={handleClose}>
      <Box sx={modalStyle}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'wrap',
            marginBottom: '24px',
            gap: '8px',
          }}
        >
          <LockIcon color="secondary" style={{ marginLeft: '2%' }} />
          <Typography variant="h3" color={theme.palette.text.primary}>
            Change Password
          </Typography>
        </div>

        <Typography variant="h3">Old Password</Typography>
        <Divider style={{ marginBottom: '3%' }} />
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit(getFormValues());
            handleClose();
          }}
          style={{ marginBottom: '10%' }}
        >
          <TextField
            fullWidth
            required
            id="outlined-old-password"
            {...register('currentPassword')}
            label="Enter Old Password"
            style={{ marginBottom: '5%' }}
            type={showOldPassword ? 'text' : 'password'}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowOldPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showOldPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Typography variant="h3">New Password</Typography>
          <Divider style={{ marginTop: '2%', marginBottom: '3%' }} />
          <TextField
            fullWidth
            required
            id="outlined-adornment-password"
            label="New Password"
            style={{ marginBottom: '5%' }}
            type={showNewPassword ? 'text' : 'password'}
            {...register('newPassword')}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowNewPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showNewPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            onBlur={onVerifyPassword}
          />
          <TextField
            fullWidth
            required
            id="outlined-basic"
            label="Confirm New Password"
            style={{ marginBottom: '5%' }}
            onChange={(e) => setConfirmPassword(e.target.value)}
            onBlur={onVerifyPassword}
            error={!matchPassword}
            helperText={!matchPassword ? 'Password does not match!' : ' '}
            type={showConfirmNewPassword ? 'text' : 'password'}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowConfirmNewPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showConfirmNewPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
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
              disabled={!matchPassword}
              style={{ borderRadius: '20px' }}
            >
              <Typography variant="body2">Save</Typography>
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  );
};

export default ChangePasswordModal;
