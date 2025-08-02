import { Box, Stack, styled } from '@mui/material';

export const HeaderSetlistView = styled(Box)({
  borderRadius: '16px',
  padding: '24px 16px',
  margin: '24px 0',
  display: 'flex',
  gap: '16px',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  background:
    'linear-gradient(158deg, rgba(0, 0, 0, 0.00) 31.44%, rgba(148, 111, 255, 0.20) 80.34%), radial-gradient(111.68% 110.13% at 66.1% 8.28%, rgba(154, 118, 255, 0.20) 36.5%, rgba(0, 0, 0, 0.20) 64%), #1F1F1F',
});

export const SetlistViewFooter = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  background: theme.palette.background.paper,
  width: '100%',
  height: '10vh',
  maxHeight: '64px',
  padding: '16px',
}));
