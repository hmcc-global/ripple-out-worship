import { FC, ReactElement } from 'react';
import { Box, Button, Stack, TextField, Typography, Container, styled } from '@mui/material';
import { useUser } from '../../helpers/customHooks';
import { useDispatch } from 'react-redux';
import { signout } from '../../reducers/userSlice';
import PageHeader from '../navigation/PageHeader';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';

const RowStack = styled(Stack)({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  flexDirection: 'row',
});

const ProfileMobileView: FC = (): ReactElement => {
  const { user } = useUser();
  const dispatch = useDispatch();

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

        <Box display="flex" flexDirection="column" alignItems="flex-start" gap="24px" marginTop={2}>
          <Button
            variant="contained"
            color="secondary"
            startIcon={<LogoutIcon />}
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
      </Box>
    </Container>
  );
};

export default ProfileMobileView;
