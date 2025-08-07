import {
  Close,
  ExpandLess,
  ExpandMore,
  Folder,
  MoreVertRounded,
  QueueMusic,
} from '@mui/icons-material';
import {
  Box,
  Tabs,
  Tab,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Typography,
  useMediaQuery,
  IconButton,
  Snackbar,
  TextField,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FC, useState, useEffect, useCallback, Fragment } from 'react';
import { Setlist, SetlistFolder } from '../../types/setlist.types';
import SetlistFolderDrawer from './SetlistFolderDrawer';
import SetlistActionsMenu from './SetlistActionsMenu';
import { useOwnership } from '../../helpers/customHooks';

// Constants and Utility Functions
const SELECTED_ITEM_STYLE = {
  backgroundColor: 'primary.darker',
  color: '#E6E0E9',
  '&:hover': {
    backgroundColor: 'primary.darker',
    opacity: '0.9',
  },
  '& .MuiListItemIcon-root': {
    color: '#D0BCFE',
  },
  '& .MuiListItemText-root': {
    color: '#D0BCFE',
  },
};

const LIST_ITEM_TEXT_STYLE = {
  color: '#D0BCFE',
  '& .MuiListItemText-primary': {
    color: '#E6E0E9',
    fontWeight: 600,
    fontSize: '1rem',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    display: 'block',
  },
  '& .MuiListItemText-secondary': {
    color: '#CAC4D0',
    fontWeight: 400,
    fontSize: '0.75rem',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    display: 'block',
  },
};

const LIST_ITEM_ICON_STYLE = { color: 'secondary.main', fontSize: '1.75rem' };

const formatDate = (dateString: string): string => {
  return new Date(dateString).toISOString().split('T')[0];
};

// Component Interfaces
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

interface SetlistTabsContainerProps {}

// Helper Components
const SetlistTabPanel: FC<TabPanelProps> = ({ children, value, index, ...other }) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
};

const SearchTextField = ({
  searchTerm,
  setSearchTerm,
}: {
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
}) => {
  return (
    <TextField
      variant="standard"
      placeholder="Search"
      InputProps={{
        style: {
          fontSize: '1rem',
          color: '#CAC4D0',
          background: '#4A4458',
          borderRadius: '26px',
          border: 0,
          padding: '0.5rem 1rem',
          marginRight: ' 0.5em',
          marginTop: '1em',
        },
        disableUnderline: true,
      }}
      sx={{
        width: '100%',
      }}
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      autoFocus
    />
  );
};

// Main Component
const SetlistTabsContainer: FC<SetlistTabsContainerProps> = () => {
  // Hooks
  const ownership = useOwnership();
  const navigate = useNavigate();
  const theme = useTheme();
  const isTablet = useMediaQuery(theme.breakpoints.between('md', 'xl'));
  const isDesktop = useMediaQuery(theme.breakpoints.up('xl'));

  // State
  const [tab, setTab] = useState(0);
  const [allSetlists, setAllSetlists] = useState<Setlist[]>([]);
  const [ownedSetlists, setOwnedSetlists] = useState<Setlist[]>([]);
  const [ownedFolders, setOwnedFolders] = useState<SetlistFolder[]>([]);
  const [openFolders, setOpenFolders] = useState<string[]>([]);
  const [selectedSetlistId, setSelectedSetlistId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Snackbar
  interface SnackbarState {
    open: boolean;
    message: string;
  }
  const SNACKBAR_AUTO_HIDE_DURATION = 5000;
  const [snackbar, setSnackbar] = useState<SnackbarState>({
    open: false,
    message: '',
  });

  const handleCloseSnackbar = useCallback((_: any, reason?: string) => {
    if (reason === 'clickaway') return;
    setSnackbar((prev) => ({ ...prev, open: false }));
  }, []);

  const handleSnackbarOpen = useCallback((message: string) => {
    setSnackbar({ open: true, message });
  }, []);

  // Data Fetching
  const getSetlistsAndFolders = useCallback(async () => {
    try {
      // Fetch data concurrently
      const [folderRes, setlistRes] = await Promise.all([
        axios.get<SetlistFolder[]>('/api/groups/get'),
        axios.get<Setlist[]>('/api/setlists/get'),
      ]);

      if (folderRes.status !== 200 || !folderRes.data) {
        throw new Error('Failed to fetch folders');
      }
      if (setlistRes.status !== 200 || !setlistRes.data) {
        throw new Error('Failed to fetch setlists');
      }

      // Filter owned folders
      const filteredFolders = folderRes.data.filter(
        (folder) => ownership.groupIds?.some(({ id }) => id === folder._id)
      );
      setOwnedFolders(filteredFolders);
      // Collect all setlist IDs from the owned folders
      const foldersSetlistIds = Array.from(
        new Set(filteredFolders.flatMap((folder) => folder.setlistIds ?? []))
      );

      // Filter owned setlists
      const ownedSetlists = setlistRes.data.filter(
        (setlist) => ownership.setlistIds?.some(({ id }) => id === setlist._id)
      );
      setOwnedSetlists(ownedSetlists);
      console.log(ownedSetlists);
      // Get folder setlists and combine with owned setlists
      const folderSetlists = setlistRes.data.filter((setlist) =>
        foldersSetlistIds.includes(setlist._id)
      );
      setAllSetlists([...ownedSetlists, ...folderSetlists]);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An unexpected error occurred';
      handleSnackbarOpen(`Error fetching data: ${message}`);
      console.error('Error in getSetlistsAndFolders:', error);
    }
  }, [handleSnackbarOpen, ownership.groupIds, ownership.setlistIds]);

  useEffect(() => {
    getSetlistsAndFolders();
  }, [getSetlistsAndFolders]);

  // Event Handlers
  const toggleOpenFolder = (id: string) => {
    if (isTablet || isDesktop) {
      setOpenFolders((prev) =>
        prev.includes(id)
          ? prev.filter((selectedFolderId) => selectedFolderId !== id)
          : [...prev, id]
      );
    } else {
      navigate(`/setlist/folder/${id}`);
    }
  };

  const handleSelectSetlist = (id: string) => {
    setSelectedSetlistId(id);
    navigate(isTablet || isDesktop ? `/setlist/${id}` : `/setlist/details/${id}`);
  };

  // Setlist Menu
  const [menuState, setMenuState] = useState({
    anchorEl: null as HTMLElement | null,
    currentSetlistId: null as string | null,
  });

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>, setlistId: string) => {
    event.stopPropagation();
    setMenuState({
      anchorEl: event.currentTarget,
      currentSetlistId: setlistId,
    });
  };

  const handleMenuClose = () => {
    setMenuState({
      anchorEl: null,
      currentSetlistId: null,
    });
  };

  // State Refresh Callbacks
  // Add refresh callback
  const handleDataRefresh = useCallback(
    async (type?: 'folders' | 'setlists' | 'all') => {
      try {
        if (type === 'folders' || type === 'all' || !type) {
          // Refresh folders data
          const folderRes = await axios.get<SetlistFolder[]>('/api/groups/get');
          if (folderRes.status === 200 && folderRes.data) {
            const filteredFolders = folderRes.data.filter(
              (folder) => ownership.groupIds?.some(({ id }) => id === folder._id)
            );
            setOwnedFolders(filteredFolders);
          }
        }

        if (type === 'setlists' || type === 'all' || !type) {
          // Refresh setlists data
          const setlistRes = await axios.get<Setlist[]>('/api/setlists/get');
          if (setlistRes.status === 200 && setlistRes.data) {
            const ownedSetlists = setlistRes.data.filter(
              (setlist) => ownership.setlistIds?.some(({ id }) => id === setlist._id)
            );
            setOwnedSetlists(ownedSetlists);

            // Update all setlists
            const foldersSetlistIds = Array.from(
              new Set(ownedFolders.flatMap((folder) => folder.setlistIds ?? []))
            );
            const folderSetlists = setlistRes.data.filter((setlist) =>
              foldersSetlistIds.includes(setlist._id)
            );
            setAllSetlists([...ownedSetlists, ...folderSetlists]);
          }
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to refresh data';
        handleSnackbarOpen(`Error refreshing data: ${message}`);
      }
    },
    [ownership, ownedFolders, handleSnackbarOpen]
  );

  // Render Helper Functions
  const renderNestedSetlistItem = (setlistId: string, folderId: string) => {
    const setlist = allSetlists.find((s) => s._id === setlistId);
    if (!setlist) return null;

    return (
      <ListItemButton
        sx={{
          pl: 6,
          ...(selectedSetlistId === setlistId && selectedFolderId === folderId
            ? SELECTED_ITEM_STYLE
            : { borderBottom: '1px solid #49454F' }),
        }}
        key={setlistId}
        onClick={() => {
          setSelectedFolderId(folderId);
          handleSelectSetlist(setlistId);
        }}
      >
        <ListItemIcon sx={{ minWidth: '40px', mr: '0.5rem' }}>
          <QueueMusic sx={LIST_ITEM_ICON_STYLE} />
        </ListItemIcon>
        <ListItemText
          primary={setlist.name}
          secondary={formatDate(setlist.date.toString())}
          sx={LIST_ITEM_TEXT_STYLE}
        />
      </ListItemButton>
    );
  };

  const renderFolderContent = (folder: SetlistFolder) => (
    <Collapse in={openFolders.includes(folder._id)} timeout="auto" unmountOnExit>
      <List component="div" disablePadding>
        {/* TODO: Workaround for duplicated setlist bug, see issue #119. Remove this "Set" logic after fixing the underlying bug. */}{' '}
        {folder.setlistIds?.length > 0 ? (
          Array.from(new Set(folder.setlistIds)).map((setlistId) =>
            renderNestedSetlistItem(setlistId, folder._id)
          )
        ) : (
          <ListItem sx={{ pl: 7 }}>
            <Typography variant="subtitle2" color="secondary.light">
              No setlists in this folder
            </Typography>
          </ListItem>
        )}
      </List>
    </Collapse>
  );

  const renderFolderItem = (folder: SetlistFolder) => (
    <Fragment key={folder._id}>
      <ListItemButton
        onClick={() => toggleOpenFolder(folder._id)}
        sx={{ borderBottom: '1px solid #49454F' }}
      >
        <ListItemIcon sx={{ minWidth: '40px', mr: '0.5rem' }}>
          <Folder sx={LIST_ITEM_ICON_STYLE} />
        </ListItemIcon>
        <ListItemText
          primary={folder.groupName}
          // secondary={'Shared with ' + folder.userIds?.length.toString() + ' people'}
          sx={LIST_ITEM_TEXT_STYLE}
        />
        <IconButton
          onClick={(event: any) => {
            event.stopPropagation();
            setSelectedFolderId(folder._id);
            toggleFolderDrawer(true);
          }}
        >
          <MoreVertRounded sx={{ color: '#4A4458', fontSize: '1.75rem' }} />
        </IconButton>
        {(isTablet || isDesktop) && (
          <IconButton>
            {openFolders.includes(folder._id) ? (
              <ExpandLess sx={LIST_ITEM_ICON_STYLE} />
            ) : (
              <ExpandMore sx={LIST_ITEM_ICON_STYLE} />
            )}
          </IconButton>
        )}
      </ListItemButton>
      {renderFolderContent(folder)}
    </Fragment>
  );

  const renderSetlistItem = (setlist: Setlist) => (
    <Fragment key={setlist._id}>
      <ListItem disablePadding>
        <ListItemButton
          sx={
            selectedSetlistId === setlist._id && selectedFolderId === ''
              ? SELECTED_ITEM_STYLE
              : { borderBottom: '1px solid #49454F' }
          }
          onClick={() => {
            handleSelectSetlist(setlist._id);
            setSelectedFolderId('');
          }}
        >
          <ListItemIcon sx={{ minWidth: '40px', mr: '0.5rem' }}>
            <QueueMusic sx={LIST_ITEM_ICON_STYLE} />
          </ListItemIcon>
          <ListItemText
            primary={setlist.name}
            secondary={formatDate(setlist.date.toString())}
            sx={LIST_ITEM_TEXT_STYLE}
          />
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              handleMenuOpen(e, setlist._id);
            }}
            aria-controls={`setlist-menu-${setlist._id}`}
            aria-haspopup="true"
            aria-label={`Open menu for setlist ${setlist.name}`}
          >
            <MoreVertRounded
              sx={{
                color:
                  selectedSetlistId === setlist._id && selectedFolderId === ''
                    ? 'secondary.main'
                    : '#4A4458',
                fontSize: '1.75rem',
              }}
            />
          </IconButton>
        </ListItemButton>
        <SetlistActionsMenu
          anchorEl={menuState.anchorEl}
          open={menuState.anchorEl !== null && menuState.currentSetlistId === setlist._id}
          onClose={handleMenuClose}
          setlist={setlist}
          handleSnackbarOpen={handleSnackbarOpen}
          onSetlistDeleted={(setlistId) => {
            // Remove from local state immediately
            setOwnedSetlists((prev) => prev.filter((s) => s._id !== setlistId));
            setAllSetlists((prev) => prev.filter((s) => s._id !== setlistId));
          }}
          onFolderAssignmentChanged={handleDataRefresh}
        />
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

  // handle folder detail drawer
  const [openDrawer, setOpenDrawer] = useState<boolean>(false);
  const [selectedFolderId, setSelectedFolderId] = useState<string>('');
  const [folderName, setFolderName] = useState<string>('');
  const [folderCreated, setFolderCreated] = useState<string>('');
  const toggleFolderDrawer = (newOpen: boolean) => {
    setOpenDrawer(newOpen);
    if (!newOpen) {
      handleDataRefresh('folders');
    }
  };

  // Main Render
  return (
    <Box
      display="flex"
      flex={1}
      flexDirection={'column'}
      maxHeight={
        isDesktop || isTablet ? 'calc(92vh - 2.25rem)' : 'calc(100vh - 7vh - 2.25rem - 80px)'
      } // Page Header = 7/8vh, Mobile NavBar = 80px, Vertical Padding = ~2.25rem
      sx={{ overflow: 'hidden' }}
    >
      <Tabs
        selectionFollowsFocus
        variant="fullWidth"
        value={tab}
        onChange={(e, newValue) => setTab(newValue)}
        textColor={'secondary'}
        indicatorColor={'secondary'}
      >
        <Tab sx={{ textTransform: 'none', fontSize: '1rem' }} label="All" />
        <Tab sx={{ textTransform: 'none', fontSize: '1rem' }} label="Folders" />
        <Tab sx={{ textTransform: 'none', fontSize: '1rem' }} label="Setlists" />
      </Tabs>

      <Divider sx={{ borderColor: '#49454F' }} />

      {/* All Tab */}
      <Box sx={{ overflowY: 'auto', flex: 1 }}>
        <SearchTextField searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        <SetlistTabPanel value={tab} index={0}>
          <List>
            {(ownedSetlists && ownedSetlists.length > 0) ||
            (ownedFolders && ownedFolders.length > 0) ? (
              <>
                {ownedFolders.map(renderFolderItem)}
                {ownedSetlists.map(renderSetlistItem)}
              </>
            ) : (
              renderEmptyState('No Setlists or Folders Found')
            )}
          </List>
        </SetlistTabPanel>

        {/* Folders Tab */}
        <SetlistTabPanel value={tab} index={1}>
          <List>
            {ownedFolders && ownedFolders.length > 0
              ? ownedFolders.map(renderFolderItem)
              : renderEmptyState('No Folders Found')}
          </List>
        </SetlistTabPanel>

        {/* Setlists Tab */}
        <SetlistTabPanel value={tab} index={2}>
          <List>
            {ownedSetlists && ownedSetlists.length > 0
              ? ownedSetlists.map(renderSetlistItem)
              : renderEmptyState('No Personal Setlists Found')}
          </List>
        </SetlistTabPanel>
      </Box>
      <SetlistFolderDrawer
        openDrawer={openDrawer}
        toggleFolderDrawer={toggleFolderDrawer}
        setFolderId={setSelectedFolderId}
        setFolderName={setFolderName}
        setFolderCreated={setFolderCreated}
        folderId={selectedFolderId}
        folderName={folderName}
        folderCreated={folderCreated}
        mode={'edit'}
      />
      <Snackbar
        open={snackbar.open}
        autoHideDuration={SNACKBAR_AUTO_HIDE_DURATION}
        onClose={handleCloseSnackbar}
        message={snackbar.message}
        action={
          <IconButton size="small" color="inherit" onClick={handleCloseSnackbar} aria-label="close">
            <Close fontSize="small" />
          </IconButton>
        }
      />
    </Box>
  );
};

export default SetlistTabsContainer;
