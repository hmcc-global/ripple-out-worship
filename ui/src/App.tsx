import { Provider } from 'react-redux';
import { store } from './store';
import { CssBaseline, Box } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { routes as appRoutes } from './routes';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import customTheme from './theme';
import './styles.css';
import { GoogleOAuthProvider } from '@react-oauth/google';
import PrivateRouteWrapper from './components/custom/PrivateRouteWrapper';

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={customTheme}>
        <CssBaseline />
        <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID!}>
          <BrowserRouter>
            <Box
              display="flex"
              component="main"
              sx={{ flexGrow: 1, width: '100%', height: '100vh' }}
            >
              <Routes>
                {appRoutes.map((route) => (
                  <Route
                    key={route.key}
                    path={route.path}
                    element={
                      <PrivateRouteWrapper permissions={route.permissions}>
                        <route.component />
                      </PrivateRouteWrapper>
                    }
                  />
                ))}
              </Routes>
            </Box>
          </BrowserRouter>
        </GoogleOAuthProvider>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
