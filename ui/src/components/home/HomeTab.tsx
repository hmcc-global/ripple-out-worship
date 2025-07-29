import { Box, Typography, Stack, useTheme } from '@mui/material';
import { ElementType, FC, ReactElement } from 'react';
import { useNavigate } from 'react-router-dom';

type HomeTabProps = {
  title: string;
  description: string;
  Icon: ElementType;
  route: string;
};

const HomeTab: FC<HomeTabProps> = ({ title, description, Icon, route }): ReactElement => {
  const navigate = useNavigate();
  const theme = useTheme();

  return (
    <Box
      sx={{
        px: ['1.25em', '2em'],
        py: ['1.5em', '2.5em'],
        borderRadius: ['10px', '30px'],
        backgroundColor: ['secondary.lighter', 'primary.darker'],
        '&:hover': {
          backgroundColor: 'primary.main',
          cursor: 'pointer',
        },
        transition: 'all 0.1s ease-in-out',
        width: '100%',
      }}
      onClick={() => navigate(route)}
    >
      <Stack direction={'row'} alignItems="center" justifyContent="space-between" gap={'1rem'}>
        <Stack direction="column" spacing={1}>
          <Typography
            variant="h2"
            sx={{
              fontSize: ['1.125rem', '1.25rem'],
              fontWeight: 700,
            }}
          >
            {title}
          </Typography>
          <Typography
            variant="body1"
            sx={{
              fontSize: ['0.875rem', '1.rem'],
              fontWeight: 400,
              color: theme.palette.text.secondary,
              fontFamily: 'DM Sans, sans-serif',
            }}
          >
            {description}
          </Typography>
        </Stack>

        <Icon
          sx={{
            color: 'primary.lightest',
            backgroundColor: 'primary.dark',
            borderRadius: '50%',
            width: '2em',
            height: '2em',
            padding: '0.5em',
          }}
        />
      </Stack>
    </Box>
  );
};

export default HomeTab;
