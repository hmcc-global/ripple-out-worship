import { Box, Typography } from '@mui/material';

type PageHeaderProps = {
  title: string;
  icon: React.ReactNode;
  actionButtons?: React.ReactNode;
};

const PageHeader = (props: PageHeaderProps) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        height: { xs: '6vh', lg: '8vh' },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          gap: ['1rem', '1.5rem'],
          alignItems: 'center',
        }}
      >
        <Box
          sx={{
            backgroundColor: 'primary.main',
            borderRadius: '100%',
            padding: '12px',
            display: 'flex',
            flexDir: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            '& svg': {
              fontSize: { xs: '24px', md: '32px' },
            },
            color: '#EADDFF',
          }}
        >
          {props.icon}
        </Box>
        <Typography variant="h1" color="#FFFFFF">
          {props.title}
        </Typography>
      </Box>
      {props.actionButtons}
    </Box>
  );
};

export default PageHeader;
