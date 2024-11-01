import React from 'react';
import { Box, Stack, Typography } from '@mui/material';
import LoginContainer from './LoginContainer';
import RegisterContainer from './RegisterContainer';
import ResetPasswordContainer from './ResetPasswordContainer';
import RecoverPasswordContainer from './RecoverPasswordContainer';

const MainLoginContainer: React.FC = () => {
  const pathname = window.location.pathname.split('/');
  const pageName = pathname[pathname.length - 1];

  const renderPage = () => {
    switch (pageName) {
      case 'register':
        return <RegisterContainer />;
      case 'recover':
        return <RecoverPasswordContainer />;
      case 'new':
        return <ResetPasswordContainer />;
      default:
        return <LoginContainer />;
    }
  };

  return (
    <Box
      sx={{
        width: '100%',
        flexGrow: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        paddingBottom: '1em',
        paddingTop: ['1.25em', '2em'],
        px: '16px',
      }}
    >
      <Stack
        direction={['column', 'row']}
        width="100%"
        maxWidth="1280px"
        spacing={2}
        gap={['12px', '24px']}
      >
        <Box
          sx={{
            py: '2.5em',
            px: '2em',
            borderRadius: ['15px', '30px'],
            background:
              'linear-gradient(158deg, rgba(0, 0, 0, 0.00) 31.44%, rgba(148, 111, 255, 0.20) 80.34%), radial-gradient(111.68% 110.13% at 66.1% 8.28%, rgba(154, 118, 255, 0.20) 36.5%, rgba(0, 0, 0, 0.20) 64%), #1F1F1F',
            width: { xs: '100%', md: '50%' },
          }}
        >
          <Typography variant="h1" sx={{ pb: 2, textAlign: ['center', 'left'] }}>
            Welcome to
            <br />
            Ripple Worship
          </Typography>
          <Typography variant="body1" textAlign={['center', 'left']}>
            Harvest Mission Community Church
          </Typography>
        </Box>
        {renderPage()}
      </Stack>
    </Box>
  );
};

export default MainLoginContainer;
