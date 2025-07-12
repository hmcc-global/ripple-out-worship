import { Setlist, SetlistFolder } from '../../types/setlist.types';
import { Add, ExpandLess, ExpandMore, Folder, QueueMusic } from '@mui/icons-material';
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
} from '@mui/material';
import axios from 'axios';
import { FC, ReactElement, useState, useEffect, useCallback, Fragment, MouseEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import SetlistFolderDrawer from './SetlistFolderDrawer';
import SetlistViewContainer from './adminView/SetlistViewContainer';
import PageHeader from '../navigation/PageHeader';
import MoreVertIcon from '@mui/icons-material/MoreVert';
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const SetlistTabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

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

const SetlistListContainer: FC = (): ReactElement => {
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const navigate = useNavigate();

  const [tab, setTab] = useState(0);
  const [allSetlists, setAllSetlists] = useState<Setlist[]>([]);
  const [allFolders, setAllFolders] = useState<SetlistFolder[]>([]);
  const [mode, setMode] = useState<'create' | 'edit'>('create');

  // handle create setlist/folder button
  const [createAnchorEl, setCreateAnchorEl] = useState<null | HTMLElement>(null);
  const openCreate = Boolean(createAnchorEl);
  const handleCreateClick = (event: MouseEvent<HTMLElement>) => {
    setCreateAnchorEl(event.currentTarget);
    setFolderName('');
    setFolderMembers([]);
    setFolderId('');
    toggleFolderDrawer(false);
  };
  const handleCreateClose = () => {
    setCreateAnchorEl(null);
  };

  // handle folder side pane drawer
  const [openDrawer, setOpenDrawer] = useState<boolean>(false);
  const [folderId, setFolderId] = useState<string>('');
  const [folderName, setFolderName] = useState<string>('');
  const [folderCreated, setFolderCreated] = useState<string>('');
  const [folderMembers, setFolderMembers] = useState<string[]>([]);
  const toggleFolderDrawer = (newOpen: boolean) => {
    setOpenDrawer(newOpen);
  };

  // handle each folder's expansion
  const [openFolders, setOpenFolders] = useState<string[]>([]);
  const toggleOpenFolder = (id: string) => {
    let result = openFolders.includes(id)
      ? openFolders.filter((add) => add != id)
      : [...openFolders, id];
    setOpenFolders(result);
  };

  const getSetlistsAndFolders = useCallback(async () => {
    try {
      const setlistRes = await axios.get('/api/setlists/get');
      if (setlistRes.status === 200) {
        setAllSetlists(setlistRes.data);
      }

      const folderRes = await axios.get('/api/groups/get');
      if (folderRes.status === 200) {
        setAllFolders(folderRes.data);
      }
    } catch (error) {
      console.log(error);
    }
  }, []);

  const handleSelectSetlist = (id: string) => {
    navigate(`/setlist/${id}`);
  };

  useEffect(() => {
    getSetlistsAndFolders();
  }, [openDrawer, getSetlistsAndFolders]);

  return (
    <Container
      sx={{
        py: '1rem',
        px: '1.5rem',
        width: '100%',
        maxWidth: '100vw !important',
        height: '100%',
        margin: '0',
      }}
    >
      {/* Toolbar at the top */}
      <PageHeader
        title="Setlists"
        icon={<QueueMusic />}
        actionButtons={
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
              display: { xs: 'none', md: 'flex' },
            }}
            startIcon={<Add />}
            onClick={handleCreateClick}
          >
            <Typography variant="subtitle1" fontWeight={700}>
              New Setlist
            </Typography>
          </Button>
        }
      />
      <Stack
        direction="row"
        display="flex"
        justifyContent="space-between"
        pb="10px"
        pl={{ base: '10px', md: '15px' }}
      >
        <Menu
          anchorEl={createAnchorEl}
          open={openCreate}
          onClose={handleCreateClose}
          anchorOrigin={{
            vertical: isDesktop ? 'top' : 'bottom',
            horizontal: isDesktop ? 'right' : 'center',
          }}
          transformOrigin={{
            vertical: isDesktop ? 'top' : 'bottom',
            horizontal: isDesktop ? 'right' : 'center',
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
              setMode('create');
              toggleFolderDrawer(true);
              handleCreateClose();
            }}
          >
            Create Folder
          </MenuItem>
        </Menu>
      </Stack>
      <Stack direction="row" width="100%">
        {/* list out all existing setlists */}
        <Box sx={{ width: { xs: '100%', sm: '30%' } }}>
          <Tabs
            selectionFollowsFocus
            variant="fullWidth"
            value={tab}
            onChange={(e, newValue) => setTab(newValue)}
          >
            {/* TODO: Move this to theme to remove repeated code */}
            <Tab sx={{ textTransform: 'none' }} label="All"></Tab>
            <Tab sx={{ textTransform: 'none' }} label="Folders"></Tab>
            <Tab sx={{ textTransform: 'none' }} label="Setlists"></Tab>
          </Tabs>

          <Divider sx={{ borderColor: '#49454F' }} />

          <SetlistTabPanel value={tab} index={0}>
            <List>
              {allSetlists.length > 0 || allFolders.length > 0 ? (
                <>
                  {allFolders.map((folder, i) => (
                    <Fragment key={i}>
                      <ListItemButton onClick={() => toggleOpenFolder(folder._id)}>
                        <ListItemIcon>
                          <Folder sx={{ color: 'secondary.main' }} fontSize="large" />
                        </ListItemIcon>
                        <ListItemText>
                          <Typography>{folder.groupName}</Typography>
                        </ListItemText>
                        <Button
                          onClick={(event) => {
                            event.stopPropagation();
                            setMode('edit');
                            toggleFolderDrawer(true);
                            handleCreateClose();
                            setFolderId(folder._id);
                            setFolderName(folder.groupName);
                            setFolderCreated(folder.createdAt);
                          }}
                        >
                          <MoreVertIcon />
                        </Button>
                        {openFolders.includes(folder._id) ? <ExpandLess /> : <ExpandMore />}
                      </ListItemButton>

                      <Collapse in={openFolders.includes(folder._id)} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                          {folder.setlistIds.length > 0 ? (
                            folder.setlistIds.map((subSetlist, i) => (
                              <ListItemButton
                                sx={{ pl: 9 }}
                                key={i}
                                onClick={() => handleSelectSetlist(subSetlist)}
                              >
                                <ListItemIcon>
                                  <QueueMusic sx={{ color: 'secondary.main' }} fontSize="large" />
                                </ListItemIcon>
                                <ListItemText>
                                  <Typography>{subSetlist}</Typography>
                                  <Typography>{i}</Typography>
                                </ListItemText>
                              </ListItemButton>
                            ))
                          ) : (
                            <ListItem sx={{ pl: 9 }}>
                              <Typography variant="subtitle2" color="secondary.light">
                                No setlists in this folder
                              </Typography>
                            </ListItem>
                          )}
                        </List>
                      </Collapse>
                    </Fragment>
                  ))}
                  {allSetlists.map((setlist, i) => (
                    <Fragment key={i}>
                      <ListItem disablePadding>
                        <ListItemButton onClick={() => handleSelectSetlist(setlist._id)}>
                          <ListItemIcon>
                            <QueueMusic sx={{ color: 'secondary.main' }} fontSize="large" />
                          </ListItemIcon>
                          <ListItemText>
                            <Typography>{setlist.name}</Typography>
                            <Typography>{setlist.date.toString()}</Typography>
                          </ListItemText>
                        </ListItemButton>
                      </ListItem>
                      <Divider sx={{ borderColor: '#49454F' }} />
                    </Fragment>
                  ))}
                </>
              ) : (
                <ListItem>
                  <Typography variant="subtitle1" color="primary.main">
                    No Setlists or Folders Found
                  </Typography>
                </ListItem>
              )}
            </List>
          </SetlistTabPanel>

          <SetlistTabPanel value={tab} index={1}>
            <List>
              {allFolders.length > 0 ? (
                allFolders.map((folder, i) => (
                  <Fragment key={i}>
                    <ListItemButton onClick={() => toggleOpenFolder(folder._id)}>
                      <ListItemIcon>
                        <Folder sx={{ color: 'secondary.main' }} fontSize="large" />
                      </ListItemIcon>
                      <ListItemText>
                        <Typography>{folder.groupName}</Typography>
                      </ListItemText>
                      <Button
                        onClick={(event) => {
                          event.stopPropagation();
                          setMode('edit');
                          toggleFolderDrawer(true);
                          handleCreateClose();
                          setFolderId(folder._id);
                          setFolderName(folder.groupName);
                          setFolderCreated(folder.createdAt);
                        }}
                      >
                        <MoreVertIcon />
                      </Button>
                      {openFolders.includes(folder._id) ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>
                    <Collapse in={openFolders.includes(folder._id)} timeout="auto" unmountOnExit>
                      <List component="div" disablePadding>
                        {folder.setlistIds.length > 0 ? (
                          folder.setlistIds.map((subSetlist, i) => (
                            <ListItemButton sx={{ pl: 9 }} key={i}>
                              <ListItemIcon>
                                <QueueMusic sx={{ color: 'secondary.main' }} fontSize="large" />
                              </ListItemIcon>
                              <ListItemText>
                                <Typography>{subSetlist}</Typography>
                                <Typography>{i}</Typography>
                              </ListItemText>
                            </ListItemButton>
                          ))
                        ) : (
                          <ListItem sx={{ pl: 9 }}>
                            <Typography variant="subtitle2" color="secondary.light">
                              No setlists in this folder
                            </Typography>
                          </ListItem>
                        )}
                      </List>
                    </Collapse>
                  </Fragment>
                ))
              ) : (
                <ListItem>
                  <Typography variant="subtitle1" color="primary.main">
                    No Folders Found
                  </Typography>
                </ListItem>
              )}
            </List>
          </SetlistTabPanel>

          <SetlistTabPanel value={tab} index={2}>
            <List>
              {allSetlists.length > 0 ? (
                allSetlists.map((setlist, i) => (
                  <Fragment key={i}>
                    <ListItem disablePadding>
                      <ListItemButton>
                        <ListItemIcon>
                          <QueueMusic sx={{ color: 'secondary.main' }} fontSize="large" />
                        </ListItemIcon>
                        <ListItemText>
                          <Typography>{setlist.name}</Typography>
                          <Typography>{setlist.date.toString()}</Typography>
                        </ListItemText>
                      </ListItemButton>
                    </ListItem>
                    <Divider sx={{ borderColor: '#49454F' }} />
                  </Fragment>
                ))
              ) : (
                <ListItem>
                  <Typography variant="subtitle1" color="primary.main">
                    No Personal Setlists Found
                  </Typography>
                </ListItem>
              )}
            </List>
          </SetlistTabPanel>
        </Box>

        <Divider orientation="vertical" variant="fullWidth" sx={{ borderColor: '#D9D9D980' }} />

        {/* display setlist details & preview */}
        <Box
          width="70%"
          sx={{
            display: { xs: 'none', sm: 'block' },
          }}
        >
          <SetlistViewContainer />
        </Box>
      </Stack>
      <SetlistFolderDrawer
        openDrawer={openDrawer}
        toggleFolderDrawer={toggleFolderDrawer}
        setFolderId={setFolderId}
        setFolderName={setFolderName}
        setFolderMembers={setFolderMembers}
        setFolderCreated={setFolderCreated}
        folderId={folderId}
        folderName={folderName}
        folderMembers={folderMembers}
        folderCreated={folderCreated}
        mode={mode}
      />
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
          position: 'fixed',
          bottom: '100px',
          right: '16px',
          display: { xs: 'block', md: 'none' },
          zIndex: 1000,
        }}
        onClick={handleCreateClick}
      >
        <Typography variant="subtitle1" fontWeight={700}>
          + New
        </Typography>
      </Button>
    </Container>
  );
};

export default SetlistListContainer;
