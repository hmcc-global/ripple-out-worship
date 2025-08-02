import {
  Close,
  Delete,
  Edit,
  ExpandLess,
  ExpandMore,
  Folder,
  LinkRounded,
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
  Menu,
  MenuItem,
  Snackbar,
  TextField,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FC, useState, useEffect, useCallback, Fragment } from 'react';
import { Setlist, SetlistFolder } from '../../types/setlist.types';
import SetlistFolderDrawer from './SetlistFolderDrawer';
import { useOwnership } from '../../helpers/customHooks';

// Constants and Utility Functions
const SELECTED_ITEM_STYLE = {
  backgroundColor: '#4F378B',
  color: '#E6E0E9',
  '&:hover': {
    backgroundColor: '#4F378B',
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
  const [allFolders, setAllFolders] = useState<SetlistFolder[]>([]);
  const [openFolders, setOpenFolders] = useState<string[]>([]);
  const [selectedSetlistId, setSelectedSetlistId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Data Fetching
  const getSetlistsAndFolders = useCallback(async () => {
    try {
      const setlistRes = await axios.get<Setlist[]>('/api/setlists/get');
      if (setlistRes.status === 200) {
        const filteredSetlists = setlistRes.data.filter((setlist) =>
          ownership.setlistIds.some((setlistOwnership) => setlistOwnership.id === setlist._id)
        );
        setAllSetlists(filteredSetlists);
      }

      const folderRes = await axios.get<SetlistFolder[]>('/api/groups/get');
      if (folderRes.status === 200) {
        const filteredFolders = folderRes.data.filter((folder) =>
          ownership.groupIds.some((folderOwnership) => folderOwnership.id === folder._id)
        );
        setAllFolders(filteredFolders);
      }
    } catch (error) {
      console.log(error);
    }
  }, [ownership, setAllSetlists, setAllFolders]);

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

  const MenuActionItem = ({
    icon: Icon,
    text,
    onClick,
  }: {
    icon: React.ElementType;
    text: string;
    onClick: () => void;
  }) => (
    <MenuItem onClick={onClick}>
      <ListItemIcon sx={{ color: 'secondary.main' }}>
        <Icon />
      </ListItemIcon>
      <ListItemText sx={{ color: 'primary.lighter', fontSize: '0.75rem !important' }}>
        {text}
      </ListItemText>
    </MenuItem>
  );

  // Setlist Menu Actions (placeholders)
  const handleEditSetlist = (setlistId: string) => {
    navigate(`/setlist/edit/${setlistId}`);
    handleMenuClose();
  };
  // TODO-YY: Implement action functions
  const handleCopyLink = async (publicLink: string) => {
    await navigator.clipboard.writeText(publicLink);
    setSnackbar({ open: true, message: 'Link copied to clipboard' });
    handleMenuClose();
  };

  const handleAddToFolder = (setlistId: string) => {
    console.log(`Add to folder ${setlistId}`);
    handleMenuClose();
  };

  const handleDeleteSetlist = (setlistId: string) => {
    console.log(`Delete setlist ${setlistId}`);
    handleMenuClose();
  };

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
        {folder.setlistIds?.length > 0 ? (
          folder.setlistIds.map((setlistId) => renderNestedSetlistItem(setlistId, folder._id))
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
        <IconButton>
          <MoreVertRounded
            sx={{ color: '#4A4458', fontSize: '1.75rem' }}
            onClick={(event: any) => {
              event.stopPropagation();
              setSelectedFolderId(folder._id);
              toggleFolderDrawer(true);
            }}
          />
        </IconButton>
        {(isTablet || isDesktop) &&
          (openFolders.includes(folder._id) ? (
            <ExpandLess sx={LIST_ITEM_ICON_STYLE} />
          ) : (
            <ExpandMore sx={LIST_ITEM_ICON_STYLE} />
          ))}
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
        <Menu
          id={`setlist-menu-${setlist._id}`}
          anchorEl={menuState.anchorEl}
          open={menuState.anchorEl !== null && menuState.currentSetlistId === setlist._id}
          onClose={handleMenuClose}
          MenuListProps={{
            'aria-labelledby': `setlist-menu-button-${setlist._id}`,
          }}
          PaperProps={{
            sx: {
              backgroundColor: 'primary.darker',
              color: '#E6E0E9',
              border: '1px solid #938F99',
              borderRadius: '8px',
              boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.3)',
            },
          }}
        >
          <MenuActionItem
            icon={Edit}
            text="Edit Setlist"
            onClick={() => handleEditSetlist(setlist._id)}
          />
          <MenuActionItem
            icon={LinkRounded}
            text="Copy Link"
            onClick={() => handleCopyLink(setlist.publicLink)}
          />
          <MenuActionItem
            icon={Folder}
            text="Add to Folder"
            onClick={() => handleAddToFolder(setlist._id)}
          />
          <Divider sx={{ bgcolor: '#49454F' }} />
          <MenuActionItem
            icon={Delete}
            text="Delete Setlist"
            onClick={() => handleDeleteSetlist(setlist._id)}
          />
        </Menu>
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
            {(allSetlists && allSetlists.length > 0) || (allFolders && allFolders.length > 0) ? (
              <>
                {allFolders
                  .filter((folder) =>
                    folder.groupName.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .map(renderFolderItem)}
                {allSetlists
                  .filter((setlist) =>
                    setlist.name.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .map(renderSetlistItem)}
              </>
            ) : (
              renderEmptyState('No Setlists or Folders Found')
            )}
          </List>
        </SetlistTabPanel>

        {/* Folders Tab */}
        <SetlistTabPanel value={tab} index={1}>
          <List>
            {allFolders && allFolders.length > 0
              ? allFolders
                  .filter((folder) =>
                    folder.groupName.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .map(renderFolderItem)
              : renderEmptyState('No Folders Found')}
          </List>
        </SetlistTabPanel>

        {/* Setlists Tab */}
        <SetlistTabPanel value={tab} index={2}>
          <List>
            {allSetlists && allSetlists.length > 0
              ? allSetlists
                  .filter((setlist) =>
                    setlist.name.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .map(renderSetlistItem)
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
