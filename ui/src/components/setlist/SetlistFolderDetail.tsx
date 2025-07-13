import { Folder, MoreVertRounded, QueueMusic } from '@mui/icons-material';
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  IconButton,
  styled,
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useState, useEffect, useCallback, Fragment } from 'react';
import { Setlist, SetlistFolder } from '../../types/setlist.types';
import MobileBackButton from '../navigation/MobileBackButton';
import SetlistFolderDrawer from './SetlistFolderDrawer';

// Constants and Utility Functions
const HEADER_STYLE = {
  color: '#D0BCFE',
  '& .MuiListItemText-primary': {
    color: '#E6E0E9',
    fontWeight: 700,
    fontSize: '1.125rem',
  },
  '& .MuiListItemText-secondary': {
    color: '#CAC4D0',
    fontWeight: 500,
    fontSize: '0.875rem',
  },
};
const LIST_ITEM_TEXT_STYLE = {
  color: '#D0BCFE',
  '& .MuiListItemText-primary': {
    color: '#E6E0E9',
    fontWeight: 700,
    fontSize: '1rem',
  },
  '& .MuiListItemText-secondary': {
    color: '#CAC4D0',
    fontWeight: 500,
    fontSize: '0.75rem',
  },
};
const LIST_ITEM_ICON_STYLE = { color: 'secondary.main', fontSize: '1.75rem' };

const MainContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  gap: 0,
  width: '100%',
  padding: 0,
});
const HeaderContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  alignItems: 'flex-start',
  backgroundColor: '#141218',
  padding: '1rem',
});

const ListContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  gap: 0,
  width: '100%',
  padding: 0,
});

const formatDate = (dateString: string): string => {
  return new Date(dateString).toISOString().split('T')[0];
};

// Main Component
const SetlistFolderDetail = () => {
  // Hooks
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  // State
  const [selectedFolder, setSelectedFolder] = useState<SetlistFolder>();
  const [allSetlists, setAllSetlists] = useState<Setlist[]>([]);
  const [allFolders, setAllFolders] = useState<SetlistFolder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Data Fetching
  const getSetlistsAndFolders = useCallback(async () => {
    try {
      const [setlistRes, folderRes] = await Promise.all([
        axios.get('/api/setlists/get'),
        axios.get('/api/groups/get'),
      ]);

      if (setlistRes.status === 200) setAllSetlists(setlistRes.data);
      if (folderRes.status === 200) setAllFolders(folderRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }, []);

  useEffect(() => {
    getSetlistsAndFolders();
  }, [getSetlistsAndFolders]);

  const fetchFolder = useCallback(async () => {
    if (!id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      //   const { data } = await axios.get('/api/folders/get', { params: { id } });
      console.log(allFolders);
      const data: SetlistFolder | undefined = allFolders.find((folder) => folder._id === id);
      setSelectedFolder(data);
    } catch (err) {
      console.error('Error fetching folder:', err);
      setError('Failed to load folder details');
    } finally {
      setLoading(false);
    }
  }, [id, allFolders]);

  useEffect(() => {
    fetchFolder();
  }, [fetchFolder]);

  // handle folder detail drawer
  const [mode, setMode] = useState<'create' | 'edit'>('create');
  const [openDrawer, setOpenDrawer] = useState<boolean>(false);
  const [folderId, setFolderId] = useState<string>('');
  const [folderName, setFolderName] = useState<string>('');
  const [folderCreated, setFolderCreated] = useState<string>('');
  const toggleFolderDrawer = (newOpen: boolean) => {
    setOpenDrawer(newOpen);
  };

  const renderSetlistItem = (setlist: Setlist) => (
    <Fragment key={setlist._id}>
      <ListItem sx={{ paddingX: '0.75rem' }} disablePadding disableGutters>
        <ListItemButton
          sx={{ borderBottom: '1px solid #49454F' }}
          onClick={() => navigate(`/setlist/details/${setlist._id}`)}
        >
          <ListItemIcon sx={{ minWidth: '40px', mr: '0.5rem' }}>
            <QueueMusic sx={LIST_ITEM_ICON_STYLE} />
          </ListItemIcon>
          <ListItemText
            primary={setlist.name}
            secondary={formatDate(setlist.date.toString())}
            sx={LIST_ITEM_TEXT_STYLE}
          />
          <IconButton>
            <MoreVertRounded
              sx={{ color: '#4A4458', fontSize: '1.75rem' }}
              onClick={(event: any) => {
                event.stopPropagation();
              }}
            />
          </IconButton>
        </ListItemButton>
      </ListItem>
    </Fragment>
  );

  const renderEmptyState = (message: string) => (
    <ListItem>
      <Typography variant="subtitle1" color="primary.main">
        {message}
      </Typography>
    </ListItem>
  );

  // Early returns
  if (!id) return null;
  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!selectedFolder) return <Typography>Folder not found</Typography>;

  // Main Render
  return (
    <MainContainer>
      <HeaderContainer>
        <MobileBackButton />

        <ListItemButton sx={{ width: '100%' }} disableRipple disableTouchRipple>
          <ListItemIcon sx={{ minWidth: '40px', mr: '0.5rem' }}>
            <Folder sx={LIST_ITEM_ICON_STYLE} />
          </ListItemIcon>
          <ListItemText
            primary={selectedFolder.groupName}
            // secondary={'Shared with ' + selectedFolder.userIds.length.toString() + ' people'}
            sx={HEADER_STYLE}
          />
          <IconButton>
            <MoreVertRounded
              sx={{ color: '#4A4458', fontSize: '1.75rem' }}
              onClick={(event: any) => {
                event.stopPropagation();
                toggleFolderDrawer(true);
              }}
            />
          </IconButton>
          <SetlistFolderDrawer
            openDrawer={openDrawer}
            toggleFolderDrawer={toggleFolderDrawer}
            setFolderId={setFolderId}
            setFolderName={setFolderName}
            setFolderCreated={setFolderCreated}
            folderId={folderId}
            folderName={folderName}
            folderCreated={folderCreated}
            mode={mode}
          />
        </ListItemButton>
      </HeaderContainer>
      {/* Setlists Tab */}
      <ListContainer>
        <Box width={'100%'} sx={{ p: '1rem' }}>
          <Typography color={'#D1D1D1'} fontSize={'0.75rem'} fontWeight={700}>
            Setlists
          </Typography>
        </Box>
        <List disablePadding>
          {allSetlists.length > 0
            ? allSetlists.map(renderSetlistItem)
            : renderEmptyState('No Personal Setlists Found')}
        </List>
      </ListContainer>
    </MainContainer>
  );
};

export default SetlistFolderDetail;
