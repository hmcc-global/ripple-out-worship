import { Add, ExpandMore, QueueMusic } from '@mui/icons-material';
import { Box, Button, Container, Stack, Typography, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { FC, ReactElement, useState, MouseEvent } from 'react';
import SetlistViewContainer from './adminView/SetlistAdminViewContainer';
import SetlistTabsContainer from './SetlistTabsContainer';
import PageHeader from '../navigation/PageHeader';
import SetlistPreview from './adminView/SetlistPreview';
import SetlistActionMenu from './SetlistPageActionMenu';

const SetlistListContainer: FC = (): ReactElement => {
  const theme = useTheme();
  const isTablet = useMediaQuery(theme.breakpoints.between('md', 'xl'));
  const isDesktop = useMediaQuery(theme.breakpoints.up('xl'));

  // handle create setlist/folder button
  const [createAnchorEl, setCreateAnchorEl] = useState<null | HTMLElement>(null);

  const handleCreateClick = (event: MouseEvent<HTMLElement>) => {
    setCreateAnchorEl((prev) => (prev ? null : event.currentTarget));
  };

  return (
    <Box sx={{ position: 'relative', height: '100%' }}>
      <Container
        sx={{
          py: isTablet || isDesktop ? '1rem' : '0.75rem',
          px: isTablet || isDesktop ? '1.25rem' : '0.75rem',
          width: '100%',
          maxWidth: '100vw !important',
          height: '100%',
          margin: 'auto',
        }}
      >
        {/* Toolbar at the top */}
        <PageHeader
          title="Setlists"
          icon={<QueueMusic />}
          actionButtons={
            isDesktop || isTablet ? (
              <Button
                variant="outlined"
                sx={{
                  border: 0,
                  padding: '10px 25px',
                  borderRadius: '40px',
                  backgroundColor: '#D0BCFF',
                  color: '#381E72',
                  textTransform: 'none',
                  '&:hover': {
                    backgroundColor: '#D0BCFF',
                    opacity: '0.95',
                  },
                  transition: 'all 0.1s ease-in-out',
                }}
                startIcon={<Add />}
                endIcon={
                  <ExpandMore
                    sx={{
                      transform: createAnchorEl ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.2s ease-in-out',
                    }}
                  />
                }
                onClick={handleCreateClick}
              >
                <Typography variant="subtitle1" fontWeight={700}>
                  New
                </Typography>
              </Button>
            ) : undefined
          }
        />
        <SetlistActionMenu anchorEl={createAnchorEl} setAnchorEl={setCreateAnchorEl} />

        {isDesktop ? (
          <Stack direction="row" width="100%">
            {/* Tabs section displaying setlists and folders */}
            <SetlistTabsContainer />
            {/* Setlist View (detail) Container */}
            <Box display="flex" flexDirection={'row'} width="72.5%" gap={'0'} paddingX={'1rem'}>
              <Box flex="0 0 50%">
                <SetlistViewContainer />
              </Box>
              <Box flex="0 0 50%">
                <SetlistPreview />
              </Box>
            </Box>
          </Stack>
        ) : isTablet ? (
          <Stack direction="row" width="100%" spacing={'1rem'}>
            {/* Tabs section displaying setlists and folders */}
            <SetlistTabsContainer />

            {/* Setlist View (detail) Container */}
            <Box width="60%">
              <SetlistViewContainer />
            </Box>
          </Stack>
        ) : (
          <SetlistTabsContainer />
        )}
      </Container>
    </Box>
  );
};

export default SetlistListContainer;
