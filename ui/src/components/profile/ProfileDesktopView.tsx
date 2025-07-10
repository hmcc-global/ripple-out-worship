import { FC, ReactElement, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  Box,
  Button,
  Stack,
  TextField,
  Typography,
  Container,
  styled,
  useTheme,
} from '@mui/material';
import { User } from '../../types/user.types';
import PersonIcon from '@mui/icons-material/Person';
import { useUser } from '../../helpers/customHooks';
import PageHeader from '../navigation/PageHeader';
import { useDispatch } from 'react-redux';
import { signout } from '../../reducers/userSlice';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import CheckIcon from '@mui/icons-material/Check';
import LogoutIcon from '@mui/icons-material/Logout';
import CloseIcon from '@mui/icons-material/Close';

const RowStack = styled(Stack)({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  flexDirection: 'row',
});

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

const ProfileDesktopView: FC = (): ReactElement => {
  const { token, user } = useUser();
  const dispatch = useDispatch();
  const theme = useTheme();
  // TO-DO refactor the use of react form to properly pass the values using the hooks instead of forcing it now.
  const { register, getValues, setValue } = useForm<User>();

  const [showEditProfile, setShowEditProfile] = useState<boolean>(false);
  const [showChangePassword, setShowChangePassword] = useState<boolean>(false);
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<String>('');
  const [snackbarStatus, setSnackbarStatus] = useState<'success' | 'error'>('success');

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const editProfileHandler = () => {
    setValue('fullName', '');
    setShowEditProfile(true);
    setShowChangePassword(false);
  };

  const changePassHandler = () => {
    setShowChangePassword(true);
    setShowEditProfile(false);
  };

  const backProfileHandler = () => {
    if (showEditProfile) {
      setShowEditProfile(false);
    } else if (showChangePassword) {
      setShowChangePassword(false);
    }
    // return it to default
    setValue('fullName', user?.fullName || '');
  };

  return (
    <Container
      maxWidth={false}
      sx={{
        py: '1rem',
        px: '1.5rem',
        ml: '0',
        height: '100%',
        overflow: 'auto',
        maxWidth: {
          xs: '100%', // mobile
          md: '45%',
        },
      }}
    >
      <Box
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'left',
          alignItems: 'left',
          padding: 2,
        }}
      >
        <PageHeader title="Profile" icon={<PersonIcon />} />

        <Stack
          style={{
            background: theme.palette.background.paper,
            padding: '24px',
            borderRadius: '8px',
            marginTop: '16px',
          }}
          spacing={2}
          width="90%"
        >
          <RowStack>
            <Typography variant="h2">My Information</Typography>
          </RowStack>
          <Box>
            <Typography
              sx={{
                marginBottom: '6px',
                fontSize: '1rem',
                color: '#EADDFF',
                fontWeight: '400',
              }}
            >
              Full Name
            </Typography>
            <DisabledTextField
              fullWidth
              disabled
              id="outlined-name"
              variant="outlined"
              value={user?.fullName}
              {...register('fullName', { required: true })}
              sx={{ width: '75%' }}
            />
          </Box>
          <Box>
            <Typography
              sx={{
                marginBottom: '6px',
                fontSize: '1rem',
                color: '#EADDFF',
                fontWeight: '400',
              }}
            >
              Email
            </Typography>
            <DisabledTextField
              fullWidth
              disabled
              id="outlined-email"
              value={user?.email}
              {...register('email', { required: true })}
              style={{ marginBottom: '16px' }}
              sx={{ width: '75%' }}
            />
          </Box>
          <Box display="flex" flexDirection="column" alignItems="flex-start" gap="24px">
            <Button
              variant="contained"
              color="secondary"
              startIcon={<LogoutIcon />}
              //TODO: Find a more elegant way to reset to login
              onClick={() => {
                dispatch(signout(''));
                window.location.reload();
              }}
              style={{ borderRadius: '20px', padding: '8px 16px' }}
            >
              <Typography
                color="inherit"
                sx={{
                  color: ' #381E72',
                  fontSize: '1rem',
                  fontWeight: 700,
                }}
              >
                Log out
              </Typography>
            </Button>
          </Box>
        </Stack>
      </Box>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <MuiAlert
          elevation={0}
          variant="filled"
          icon={
            snackbarStatus === 'error' ? (
              <CloseIcon sx={{ fontSize: 20, color: '#fff', mr: 1 }} />
            ) : (
              <CheckIcon sx={{ fontSize: 20, color: '#fff', mr: 1 }} />
            )
          }
          sx={{
            fontFamily: 'DM Sans, sans-serif',
            background: '#36333b',
            color: '#EADDFF',
            borderRadius: 3,
            fontWeight: 400,
            fontSize: '1rem',
            alignItems: 'center',
            '.MuiAlert-icon': { marginRight: 1 },
          }}
        >
          {snackbarMessage}
        </MuiAlert>
      </Snackbar>
    </Container>
  );
};

export default ProfileDesktopView;
