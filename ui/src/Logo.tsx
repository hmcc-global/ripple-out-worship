import * as React from 'react';
import { styled, keyframes } from '@mui/material/styles';
import logo from './logo.svg';

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const LogoImg = styled('img')<{ h?: string }>(({ h }) => ({
  height: h || '40vmin',
  animation: `${spin} infinite 20s linear`,
  '@media (prefers-reduced-motion)': {
    animation: 'none',
  },
}));

interface LogoProps {
  h?: string;
  style?: React.CSSProperties;
}

export const Logo: React.FC<LogoProps> = ({ h, ...props }) => {
  return <LogoImg src={logo} alt="logo" h={h} {...props} />;
};
