import * as React from 'react';
import {
  ThemeProvider,
  CssBaseline,
  Box,
  Typography,
  Link,
  Stack,
  Grid,
  Container
} from '@mui/material';
import { ColorModeSwitcher } from './ColorModeSwitcher';
import { Logo } from './Logo';
import { theme } from './theme';

export const App = () => (
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <Box textAlign="center" sx={{ fontSize: 'xl' }}>
      <Grid container style={{ minHeight: '100vh' }} spacing={3}>
        <Grid item xs={12}>
          <Box display="flex" justifyContent="flex-end">
            <ColorModeSwitcher />
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Container>
            <Stack spacing={8} alignItems="center">
              <Logo h="40vmin" style={{ pointerEvents: 'none' }} />
              <Typography variant="body1">
                Edit <code style={{ fontSize: '1.2em' }}>src/App.tsx</code> and save to reload.
              </Typography>
              <Link
                color="primary"
                href="https://mui.com"
                variant="h5"
                target="_blank"
                rel="noopener noreferrer"
              >
                Learn MUI
              </Link>
            </Stack>
          </Container>
        </Grid>
      </Grid>
    </Box>
  </ThemeProvider>
);
