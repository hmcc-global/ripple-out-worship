import { FC, ReactElement } from 'react';
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
import PersonIcon from '@mui/icons-material/Person';
import { useUser } from '../../helpers/customHooks';
import PageHeader from '../navigation/PageHeader';
import { useDispatch } from 'react-redux';
import { signout } from '../../reducers/userSlice';
import LogoutIcon from '@mui/icons-material/Logout';

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
  const { user } = useUser();
  const dispatch = useDispatch();
  const theme = useTheme();

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
    </Container>
  );
};

export default ProfileDesktopView;
