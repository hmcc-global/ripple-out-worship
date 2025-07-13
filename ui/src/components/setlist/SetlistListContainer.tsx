import { FC, ReactElement, useState, useEffect, useCallback, Fragment, MouseEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Add,
  ArrowDropDown,
  ExpandLess,
  ExpandMore,
  Folder,
  MoreVertRounded,
  QueueMusic,
} from '@mui/icons-material';
import {
  Box,
  Button,
  Container,
  Stack,
  Typography,
  useMediaQuery,
  Tabs,
  Tab,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Menu,
  Collapse,
  IconButton,
} from '@mui/material';
import { Setlist, SetlistFolder } from '../../types/setlist.types';
import SetlistFolderDrawer from './SetlistFolderDrawer';
import SetlistViewContainer from './adminView/SetlistViewContainer';
import PageHeader from '../navigation/PageHeader';

// Constants
const CONTAINER_STYLE = {
  py: '1rem',
  px: '1.5rem',
  width: '100%',
  maxWidth: '100vw !important',
  height: '100%',
  margin: '0',
  backgroundColor: '#171717',
};

const NEW_BUTTON_STYLE = {
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
};

// Selected item styling
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
  },
  '& .MuiListItemText-secondary': {
    color: '#CAC4D0',
    fontWeight: 400,
    fontSize: '0.875rem',
  },
};

const LIST_ITEM_ICON_STYLE = { color: 'secondary.main', fontSize: '1.75rem' };

const formatDate = (dateString: string) => {
  return new Date(dateString).toISOString().split('T')[0];
};

// Tab Panel Component
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const SetlistTabPanel: FC<TabPanelProps> = ({ children, value, index, ...other }) => (
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

// Main Component
const SetlistListContainer: FC = (): ReactElement => {
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const navigate = useNavigate();

  // State management
  const [tab, setTab] = useState(0);
  const [allSetlists, setAllSetlists] = useState<Setlist[]>([]);
  const [allFolders, setAllFolders] = useState<SetlistFolder[]>([]);
  const [openFolders, setOpenFolders] = useState<string[]>([]);
  const [selectedSetlistId, setSelectedSetlistId] = useState<string | null>(null);

  // Create menu state
  const [createAnchorEl, setCreateAnchorEl] = useState<null | HTMLElement>(null);
  const openCreate = Boolean(createAnchorEl);

  // Folder drawer state
  const [openDrawer, setOpenDrawer] = useState(false);
  const [folderId, setFolderId] = useState('');
  const [folderName, setFolderName] = useState('');

  // Handlers
  const handleCreateClick = (event: MouseEvent<HTMLElement>) => {
    setCreateAnchorEl(event.currentTarget);
  };

  const handleCreateClose = () => {
    setCreateAnchorEl(null);
  };

  const toggleFolderDrawer = (newOpen: boolean) => {
    setOpenDrawer(newOpen);
  };

  const toggleOpenFolder = (id: string) => {
    setOpenFolders((prev) =>
      prev.includes(id) ? prev.filter((folderId) => folderId !== id) : [...prev, id]
    );
  };

  const handleSelectSetlist = (id: string) => {
    setSelectedSetlistId(id);
    navigate(`/setlist/${id}`);
  };

  // Data fetching
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

  // Render helpers
  const renderNestedSetlistItem = (setlistId: string) => {
    const setlist = allSetlists.find((s) => s._id === setlistId);
    if (!setlist) return null;

    return (
      <ListItemButton
        sx={{
          pl: 6,
          ...(selectedSetlistId === setlistId ? SELECTED_ITEM_STYLE : {}),
        }}
        key={setlistId}
        onClick={() => handleSelectSetlist(setlistId)}
      >
        <ListItemIcon sx={{ minWidth: '40px' }}>
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
        {folder.setlistIds.length > 0 ? (
          folder.setlistIds.map(renderNestedSetlistItem)
        ) : (
          <ListItem sx={{ pl: 6 }}>
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
        <ListItemIcon sx={{ minWidth: '40px' }}>
          <Folder sx={LIST_ITEM_ICON_STYLE} />
        </ListItemIcon>
        <ListItemText
          primary={folder.groupName}
          secondary={'Shared with ' + folder.userIds.length.toString() + ' people'}
          sx={LIST_ITEM_TEXT_STYLE}
        />
        <IconButton>
          <MoreVertRounded sx={{ color: '#4A4458', fontSize: '1.75rem' }} />
        </IconButton>
        {openFolders.includes(folder._id) ? (
          <ExpandLess sx={LIST_ITEM_ICON_STYLE} />
        ) : (
          <ExpandMore sx={LIST_ITEM_ICON_STYLE} />
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
            selectedSetlistId === setlist._id
              ? SELECTED_ITEM_STYLE
              : { borderBottom: '1px solid #49454F' }
          }
          onClick={() => handleSelectSetlist(setlist._id)}
        >
          <ListItemIcon sx={{ minWidth: '40px' }}>
            <QueueMusic sx={LIST_ITEM_ICON_STYLE} />
          </ListItemIcon>
          <ListItemText
            primary={setlist.name}
            secondary={formatDate(setlist.date.toString())}
            sx={LIST_ITEM_TEXT_STYLE}
          />
        </ListItemButton>
      </ListItem>
      <Divider sx={{ borderColor: '#49454F' }} />
    </Fragment>
  );

  const renderEmptyState = (message: string) => (
    <ListItem>
      <Typography variant="subtitle1" color="primary.main">
        {message}
      </Typography>
    </ListItem>
  );

  return (
    <Container sx={CONTAINER_STYLE}>
      <PageHeader
        title="Setlists"
        icon={<QueueMusic />}
        actionButtons={
          <Button
            variant="outlined"
            sx={NEW_BUTTON_STYLE}
            startIcon={<Add />}
            onClick={handleCreateClick}
            endIcon={<ArrowDropDown />}
          >
            <Typography variant="subtitle1" fontWeight={700}>
              New
            </Typography>
          </Button>
        }
      />
      {/* "New" Button Menu */}
      <Stack
        direction="row"
        display="flex"
        justifyContent="space-between"
        pb="10px"
        pl={{ base: '0', md: '15px' }}
      >
        <Menu
          anchorEl={createAnchorEl}
          open={openCreate}
          onClose={handleCreateClose}
          anchorOrigin={{
            vertical: 'bottom', // Anchor to the BOTTOM of the button
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top', // Menu appears BELOW (starts from top of anchor)
            horizontal: 'right',
          }}
        >
          <MenuItem
            onClick={() => {
              navigate('/setlist/add');
              handleCreateClose();
            }}
          >
            Create Setlist
          </MenuItem>
          <MenuItem
            onClick={() => {
              toggleFolderDrawer(true);
              handleCreateClose();
            }}
          >
            Create Folder
          </MenuItem>
        </Menu>
      </Stack>

      <Stack direction="row" width="100%" gap="1rem">
        {/* Setlist List Section */}
        <Box width={'27.5%'}>
          <Tabs
            selectionFollowsFocus
            variant="fullWidth"
            value={tab}
            onChange={(e, newValue) => setTab(newValue)}
          >
            <Tab sx={{ textTransform: 'none' }} label="All" />
            <Tab sx={{ textTransform: 'none' }} label="Folders" />
            <Tab sx={{ textTransform: 'none' }} label="Setlists" />
          </Tabs>

          <Divider sx={{ borderColor: '#49454F' }} />

          {/* All Tab */}
          <SetlistTabPanel value={tab} index={0}>
            <List>
              {allSetlists.length > 0 || allFolders.length > 0 ? (
                <>
                  {allFolders.map(renderFolderItem)}
                  {allSetlists.map(renderSetlistItem)}
                </>
              ) : (
                renderEmptyState('No Setlists or Folders Found')
              )}
            </List>
          </SetlistTabPanel>

          {/* Folders Tab */}
          <SetlistTabPanel value={tab} index={1}>
            <List>
              {allFolders.length > 0
                ? allFolders.map(renderFolderItem)
                : renderEmptyState('No Folders Found')}
            </List>
          </SetlistTabPanel>

          {/* Setlists Tab */}
          <SetlistTabPanel value={tab} index={2}>
            <List>
              {allSetlists.length > 0
                ? allSetlists.map(renderSetlistItem)
                : renderEmptyState('No Personal Setlists Found')}
            </List>
          </SetlistTabPanel>
        </Box>

        {/* Setlist Preview Section */}
        <Box display={'flex'} flex={1} p={0}>
          <SetlistViewContainer />
        </Box>
      </Stack>

      <SetlistFolderDrawer
        openDrawer={openDrawer}
        toggleFolderDrawer={toggleFolderDrawer}
        setFolderId={setFolderId}
        setFolderName={setFolderName}
        folderId={folderId}
        folderName={folderName}
      />
    </Container>
  );
};

export default SetlistListContainer;
