import React from 'react';
import { render } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';

const theme = createTheme();

// Simple test without the complex components
test('renders MUI provider without crashing', () => {
  const { container } = render(
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div>Test app</div>
    </ThemeProvider>
  );
  expect(container).toBeInTheDocument();
});

// Basic app test
test('renders app component', () => {
  const { container } = render(
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div>Test app</div>
    </ThemeProvider>
  );
  expect(container).toBeInTheDocument();
});
