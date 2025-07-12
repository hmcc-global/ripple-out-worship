import * as React from 'react';
import { IconButton, IconButtonProps } from '@mui/material';
import { DarkMode, LightMode } from '@mui/icons-material';

type ColorModeSwitcherProps = Omit<IconButtonProps, 'aria-label'>;

export const ColorModeSwitcher: React.FC<ColorModeSwitcherProps> = (props) => {
  const [mode, setMode] = React.useState<'light' | 'dark'>('light');
  
  const toggleColorMode = () => {
    setMode(mode === 'light' ? 'dark' : 'light');
  };

  const SwitchIcon = mode === 'light' ? DarkMode : LightMode;

  return (
    <IconButton
      size="medium"
      color="inherit"
      onClick={toggleColorMode}
      aria-label={`Switch to ${mode === 'light' ? 'dark' : 'light'} mode`}
      {...props}
    >
      <SwitchIcon />
    </IconButton>
  );
};
