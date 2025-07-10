import axios from 'axios';
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
  Divider,
} from '@mui/material';
import { User } from '../../types/user.types';
import { useUser } from '../../helpers/customHooks';
import { useDispatch } from 'react-redux';
import { signout } from '../../reducers/userSlice';
import PageHeader from '../navigation/PageHeader';
import PersonIcon from '@mui/icons-material/Person';
import CreateIcon from '@mui/icons-material/Create';
import LockIcon from '@mui/icons-material/Lock';
import DeleteIcon from '@mui/icons-material/Delete';
import { useTheme } from '@mui/material/styles';
import LogoutIcon from '@mui/icons-material/Logout';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';

const RowStack = styled(Stack)({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  flexDirection: 'row',
});

const ProfileMobileView: FC = (): ReactElement => {
  const { token, user } = useUser();
  const dispatch = useDispatch();
  const { register, getValues } = useForm<User>();
  const [showEditProfile, setShowEditProfile] = useState<boolean>(false);
  const [showChangePassword, setShowChangePassword] = useState<boolean>(false);
  const theme = useTheme();
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<String>('');
  const [snackbarStatus, setSnackbarStatus] = useState<'success' | 'error'>('success');

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const editProfileHandler = () => {
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
  };

  return (
    <Container
      sx={{
        padding: 2,
        marginTop: '2px',
      }}
    >
      <Box
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'left',
          alignItems: 'left',
        }}
      >
        <PageHeader title="Profile" icon={<PersonIcon />} />
        <Box mb={1}></Box>
        <RowStack
          sx={{
            mb: 2,
          }}
        >
          <Typography variant="h2" sx={{ fontSize: '1.5rem', fontWeight: 700 }}>
            My Information
          </Typography>
        </RowStack>
        {!showEditProfile && !showChangePassword && (
          <Stack spacing={2} width="80%" mb={2}>
            <Typography
              sx={{
                marginBottom: '2px',
                fontSize: '1rem',
                color: '#EADDFF',
                fontWeight: '700',
              }}
            >
              Full Name
            </Typography>
            <TextField
              fullWidth
              disabled
              id="outlined-name"
              value={user?.fullName}
              {...register('fullName', { required: true })}
              sx={{
                '& .MuiInputBase-input.Mui-disabled': {
                  WebkitTextFillColor: '#E6E0E9',
                },
                '& .MuiOutlinedInput-root.Mui-disabled .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#E6E0E9',
                },
              }}
            />
            <Typography
              sx={{
                marginBottom: '16px',
                fontSize: '1rem',
                color: '#EADDFF',
                fontWeight: '700',
              }}
            >
              Email
            </Typography>
            <TextField
              fullWidth
              disabled
              id="outlined-email"
              value={user?.email}
              {...register('email', { required: true })}
              sx={{
                '& .MuiInputBase-input.Mui-disabled': {
                  WebkitTextFillColor: '#E6E0E9',
                },
                '& .MuiOutlinedInput-root.Mui-disabled .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#E6E0E9',
                },
              }}
            />
          </Stack>
        )}
        <Box display="flex" flexDirection="column" alignItems="flex-start" gap="24px" marginTop={2}>
          <Button
            variant="contained"
            color="secondary"
            startIcon={<LogoutIcon />}
            onClick={() => dispatch(signout(''))}
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
      </Box>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
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

export default ProfileMobileView;
