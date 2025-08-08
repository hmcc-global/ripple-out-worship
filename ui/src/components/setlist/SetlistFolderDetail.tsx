import { Close, Folder, MoreVertRounded, QueueMusic } from '@mui/icons-material';
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
  Snackbar,
  CircularProgress,
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useState, useEffect, useCallback, Fragment } from 'react';
import { Setlist, SetlistFolder } from '../../types/setlist.types';
import MobileBackButton from '../navigation/MobileBackButton';
import SetlistFolderDrawer from './SetlistFolderDrawer';
import SetlistActionsMenu from './SetlistActionsMenu';

// Types
interface SnackbarState {
  open: boolean;
  message: string;
}

interface MenuState {
  anchorEl: HTMLElement | null;
  currentSetlistId: string | null;
}

// Constants
const SNACKBAR_AUTO_HIDE_DURATION = 5000;

const STYLES = {
  header: {
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
  },
  listItemText: {
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
  },
  listItemIcon: {
    color: 'secondary.main',
    fontSize: '1.75rem',
  },
} as const;

// Styled Components
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

const LoadingContainer = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '200px',
  flexDirection: 'column',
  gap: '1rem',
});

// Utility Functions
const formatDate = (dateString: string): string => {
  if (!dateString) return '';
  try {
    return dateString.split('T')[0];
  } catch {
    return dateString;
  }
};

// Custom Hooks
const useSnackbar = () => {
  const [snackbar, setSnackbar] = useState<SnackbarState>({
    open: false,
    message: '',
  });

  const handleOpen = useCallback((message: string) => {
    setSnackbar({ open: true, message });
  }, []);

  const handleClose = useCallback((_: any, reason?: string) => {
    if (reason === 'clickaway') return;
    setSnackbar((prev) => ({ ...prev, open: false }));
  }, []);

  return {
    snackbar,
    handleOpen,
    handleClose,
  };
};

const useSetlistMenu = () => {
  const [menuState, setMenuState] = useState<MenuState>({
    anchorEl: null,
    currentSetlistId: null,
  });

  const handleOpen = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>, setlistId: string) => {
      event.stopPropagation();
      setMenuState({
        anchorEl: event.currentTarget,
        currentSetlistId: setlistId,
      });
    },
    []
  );

  const handleClose = useCallback(() => {
    setMenuState({
      anchorEl: null,
      currentSetlistId: null,
    });
  }, []);

  return {
    menuState,
    handleOpen,
    handleClose,
  };
};

const useFolderDrawer = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [folderId, setFolderId] = useState('');
  const [folderName, setFolderName] = useState('');
  const [folderCreated, setFolderCreated] = useState('');
  const [mode, setMode] = useState<'create' | 'edit'>('edit');

  const toggle = useCallback((newOpen: boolean) => {
    setIsOpen(newOpen);
  }, []);

  const reset = useCallback(() => {
    setFolderId('');
    setFolderName('');
    setFolderCreated('');
  }, []);

  return {
    isOpen,
    folderId,
    folderName,
    folderCreated,
    mode,
    toggle,
    reset,
    setFolderId,
    setFolderName,
    setFolderCreated,
    setMode,
  };
};

const useFolderData = (id: string | undefined, onError: (message: string) => void) => {
  const [folder, setFolder] = useState<SetlistFolder | null>(null);
  const [setlists, setSetlists] = useState<Setlist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFolder = useCallback(async () => {
    if (!id) {
      setError('No folder ID provided');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data } = await axios.get<SetlistFolder>(`/api/groups/get?id=${id}`);

      if (!data) {
        throw new Error('Folder not found');
      }

      setFolder(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch folder details';
      setError(message);
      onError(message);
      console.error('Error fetching folder:', err);
    } finally {
      setLoading(false);
    }
  }, [id, onError]);

  const fetchSetlists = useCallback(async () => {
    if (!folder?.setlistIds?.length) {
      setSetlists([]);
      return;
    }

    try {
      const { data, status } = await axios.get<Setlist[]>('/api/setlists/get');

      if (status !== 200 || !data) {
        throw new Error('Failed to fetch setlists');
      }

      const filteredSetlists = data.filter(
        (setlist) => folder.setlistIds?.includes(setlist._id) ?? false
      );

      setSetlists(filteredSetlists);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch setlists';
      onError(message);
      console.error('Error fetching setlists:', err);
    }
  }, [folder?.setlistIds, onError]);

  const refreshFolder = useCallback(async () => {
    if (!folder?._id) return;

    try {
      const { data } = await axios.get<SetlistFolder>(`/api/groups/get?id=${folder._id}`);
      setFolder(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to refresh folder';
      onError(`Error refreshing data: ${message}`);
    }
  }, [folder?._id, onError]);

  const removeSetlist = useCallback((setlistId: string) => {
    setSetlists((prev) => prev.filter((s) => s._id !== setlistId));
  }, []);

  useEffect(() => {
    fetchFolder();
  }, [fetchFolder]);

  useEffect(() => {
    fetchSetlists();
  }, [fetchSetlists]);

  return {
    folder,
    setlists,
    loading,
    error,
    refreshFolder,
    removeSetlist,
  };
};

// Sub-components
const LoadingState: React.FC = () => (
  <LoadingContainer>
    <CircularProgress size={40} />
    <Typography variant="body2" color="textSecondary">
      Loading folder details...
    </Typography>
  </LoadingContainer>
);

const ErrorState: React.FC<{ message: string }> = ({ message }) => (
  <Box p={2} textAlign="center">
    <Typography color="error" variant="h6">
      {message}
    </Typography>
  </Box>
);

const EmptyState: React.FC<{ message: string }> = ({ message }) => (
  <ListItem>
    <Typography variant="subtitle1" color="primary.main">
      {message}
    </Typography>
  </ListItem>
);

const FolderHeader: React.FC<{
  folder: SetlistFolder;
  onDrawerOpen: () => void;
}> = ({ folder, onDrawerOpen }) => (
  <HeaderContainer>
    <MobileBackButton />
    <ListItemButton sx={{ width: '100%' }} disableRipple disableTouchRipple>
      <ListItemIcon sx={{ minWidth: '40px', mr: '0.5rem' }}>
        <Folder sx={STYLES.listItemIcon} />
      </ListItemIcon>
      <ListItemText primary={folder.groupName} sx={STYLES.header} />
      <IconButton onClick={onDrawerOpen}>
        <MoreVertRounded sx={{ color: '#4A4458', fontSize: '1.75rem' }} />
      </IconButton>
    </ListItemButton>
  </HeaderContainer>
);

const SetlistItem: React.FC<{
  setlist: Setlist;
  onNavigate: (id: string) => void;
  onMenuOpen: (event: React.MouseEvent<HTMLButtonElement>, setlistId: string) => void;
  menuState: MenuState;
  onMenuClose: () => void;
  onSnackbarOpen: (message: string) => void;
  onSetlistDeleted: (setlistId: string) => void;
  onFolderRefresh: () => Promise<void>;
}> = ({
  setlist,
  onNavigate,
  onMenuOpen,
  menuState,
  onMenuClose,
  onSnackbarOpen,
  onSetlistDeleted,
  onFolderRefresh,
}) => (
  <Fragment key={setlist._id}>
    <ListItem sx={{ paddingX: '0.75rem' }} disablePadding disableGutters>
      <ListItemButton
        sx={{ borderBottom: '1px solid #49454F' }}
        onClick={() => onNavigate(setlist._id)}
      >
        <ListItemIcon sx={{ minWidth: '40px', mr: '0.5rem' }}>
          <QueueMusic sx={STYLES.listItemIcon} />
        </ListItemIcon>
        <ListItemText
          primary={setlist.name}
          secondary={formatDate(setlist.date?.toString() || '')}
          sx={STYLES.listItemText}
        />
        <IconButton
          onClick={(e) => {
            e.stopPropagation();
            onMenuOpen(e, setlist._id);
          }}
          aria-controls={`setlist-menu-${setlist._id}`}
          aria-haspopup="true"
          aria-label={`Open menu for setlist ${setlist.name}`}
        >
          <MoreVertRounded sx={{ color: '#4A4458', fontSize: '1.75rem' }} />
        </IconButton>
      </ListItemButton>
      <SetlistActionsMenu
        anchorEl={menuState.anchorEl}
        open={menuState.anchorEl !== null && menuState.currentSetlistId === setlist._id}
        onClose={onMenuClose}
        setlist={setlist}
        handleSnackbarOpen={onSnackbarOpen}
        onSetlistDeleted={onSetlistDeleted}
        onFolderAssignmentChanged={onFolderRefresh}
      />
    </ListItem>
  </Fragment>
);

const SetlistSection: React.FC<{
  setlists: Setlist[];
  onNavigate: (id: string) => void;
  menuProps: {
    menuState: MenuState;
    onMenuOpen: (event: React.MouseEvent<HTMLButtonElement>, setlistId: string) => void;
    onMenuClose: () => void;
  };
  onSnackbarOpen: (message: string) => void;
  onSetlistDeleted: (setlistId: string) => void;
  onFolderRefresh: () => Promise<void>;
}> = ({ setlists, onNavigate, menuProps, onSnackbarOpen, onSetlistDeleted, onFolderRefresh }) => (
  <ListContainer>
    <Box width="100%" sx={{ p: '1rem' }}>
      <Typography color="#D1D1D1" fontSize="0.75rem" fontWeight={700}>
        Setlists ({setlists.length})
      </Typography>
    </Box>
    <List disablePadding>
      {setlists.length > 0 ? (
        setlists.map((setlist) => (
          <SetlistItem
            key={setlist._id}
            setlist={setlist}
            onNavigate={onNavigate}
            onMenuOpen={menuProps.onMenuOpen}
            menuState={menuProps.menuState}
            onMenuClose={menuProps.onMenuClose}
            onSnackbarOpen={onSnackbarOpen}
            onSetlistDeleted={onSetlistDeleted}
            onFolderRefresh={onFolderRefresh}
          />
        ))
      ) : (
        <EmptyState message="No setlists found in this folder" />
      )}
    </List>
  </ListContainer>
);

const CustomSnackbar: React.FC<{
  snackbar: SnackbarState;
  onClose: (event: any, reason?: string) => void;
}> = ({ snackbar, onClose }) => (
  <Snackbar
    open={snackbar.open}
    autoHideDuration={SNACKBAR_AUTO_HIDE_DURATION}
    onClose={onClose}
    message={snackbar.message}
    action={
      <IconButton size="small" color="inherit" onClick={onClose} aria-label="close">
        <Close fontSize="small" />
      </IconButton>
    }
  />
);

// Main Component
const SetlistFolderDetail: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  // Custom hooks
  const {
    snackbar,
    handleOpen: handleSnackbarOpen,
    handleClose: handleSnackbarClose,
  } = useSnackbar();
  const { menuState, handleOpen: handleMenuOpen, handleClose: handleMenuClose } = useSetlistMenu();
  const drawer = useFolderDrawer();

  const { folder, setlists, loading, error, refreshFolder, removeSetlist } = useFolderData(
    id,
    handleSnackbarOpen
  );

  // Event handlers
  const handleNavigateToSetlist = useCallback(
    (setlistId: string) => {
      navigate(`/setlist/details/${setlistId}`);
    },
    [navigate]
  );

  const handleDrawerOpen = useCallback(() => {
    if (folder) {
      drawer.setFolderId(folder._id);
      drawer.setFolderName(folder.groupName);
      drawer.setFolderCreated(folder.createdAt || '');
    }
    drawer.toggle(true);
  }, [folder, drawer]);

  // Early returns
  if (!id) {
    return <ErrorState message="No folder ID provided" />;
  }

  if (loading) {
    return (
      <MainContainer>
        <LoadingState />
      </MainContainer>
    );
  }

  if (error || !folder) {
    return (
      <MainContainer>
        <ErrorState message={error || 'Folder not found'} />
      </MainContainer>
    );
  }

  // Main render
  return (
    <MainContainer>
      <FolderHeader folder={folder} onDrawerOpen={handleDrawerOpen} />

      <SetlistSection
        setlists={setlists}
        onNavigate={handleNavigateToSetlist}
        menuProps={{
          menuState,
          onMenuOpen: handleMenuOpen,
          onMenuClose: handleMenuClose,
        }}
        onSnackbarOpen={handleSnackbarOpen}
        onSetlistDeleted={removeSetlist}
        onFolderRefresh={refreshFolder}
      />

      <SetlistFolderDrawer
        openDrawer={drawer.isOpen}
        toggleFolderDrawer={drawer.toggle}
        setFolderId={drawer.setFolderId}
        setFolderName={drawer.setFolderName}
        setFolderCreated={drawer.setFolderCreated}
        folderId={drawer.folderId}
        folderName={drawer.folderName}
        folderCreated={drawer.folderCreated}
        mode={drawer.mode}
      />

      <CustomSnackbar snackbar={snackbar} onClose={handleSnackbarClose} />
    </MainContainer>
  );
};

export default SetlistFolderDetail;
