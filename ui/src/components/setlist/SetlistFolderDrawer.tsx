import { Dispatch, SetStateAction, useCallback, useEffect, useMemo, useState } from 'react';
import {
  Drawer,
  Box,
  Stack,
  Divider,
  TextField,
  Button,
  List,
  ListItem,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  InputBase,
  Alert,
  AlertTitle,
  Fade,
  Snackbar,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { Folder, GroupAdd, Delete, Close, Check, Add } from '@mui/icons-material';
import axios, { AxiosResponse } from 'axios';
import { SetlistFolder } from '../../types/setlist.types';
import HeaderWithIcon from '../custom/HeaderWithIcon';
import { GroupOwnership, Ownership } from '../../types/ownership.types';
import { useOwnership } from '../../helpers/customHooks';

// Types
interface SetlistFolderDrawerProps {
  isCreate?: boolean;
  openDrawer: boolean;
  toggleFolderDrawer: (newOpen: boolean) => void;
  setFolderId: Dispatch<SetStateAction<string>>;
  setFolderName: Dispatch<SetStateAction<string>>;
  setFolderCreated: Dispatch<SetStateAction<string>>;
  folderId: string;
  folderName: string;
  folderCreated: string;
  mode: string;
}

// Snackbar message types
interface SnackbarState {
  open: boolean;
  message: string;
  severity: 'success' | 'error' | 'warning' | 'info';
}

// Component
const SetlistFolderDrawer = (props: SetlistFolderDrawerProps) => {
  const {
    openDrawer,
    toggleFolderDrawer,
    setFolderId,
    setFolderName,
    setFolderCreated,
    folderId,
    folderName,
    folderCreated,
    mode,
  } = props;
  // Hooks
  const ownership = useOwnership();
  const theme = useTheme();
  const isTablet = useMediaQuery(theme.breakpoints.between('md', 'xl'));
  const isDesktop = useMediaQuery(theme.breakpoints.up('xl'));
  const isMobileAndSmallTablet = !isTablet && !isDesktop;

  // State
  const [allPeople, setAllPeople] = useState<Ownership[]>([]);
  const [addedPeople, setAddedPeople] = useState<string[]>([]);
  const [openAddModal, setOpenAddModal] = useState<boolean>(false);
  const [openRemoveModal, setOpenRemoveModal] = useState<boolean>(false);
  const [personToRemove, setPersonToRemove] = useState<Ownership | null>(null);
  const [snackbar, setSnackbar] = useState<SnackbarState>({
    open: false,
    message: '',
    severity: 'success',
  });
  const [createdDateString, setCreatedDateString] = useState<string>('');
  const [searchString, setSearchString] = useState('');
  const [filteredPeople, setFilteredPeople] = useState<Ownership[]>([]);

  // Helper function to show snackbar messages
  const showSnackbar = useCallback(
    (message: string, severity: 'success' | 'error' | 'warning' | 'info' = 'success') => {
      setSnackbar({
        open: true,
        message,
        severity,
      });
    },
    []
  );

  // To render the songs that are added to setlist
  const addedPeopleList = allPeople.filter((person) => addedPeople.includes(person.userId));

  const handleSaveMembers = useCallback(async () => {
    if (!folderId || !addedPeople.length) {
      return;
    }
    try {
      await Promise.all(
        addedPeople.map(async (userId) => {
          const currentUser = allPeople.find((person) => person.userId === userId);
          const currentGroup: GroupOwnership = {
            id: folderId,
            name: folderName,
            createdAt: folderCreated,
          };
          // Check if the user is already part of the folder
          if (!currentUser?.groupIds?.some((group) => group.id === currentGroup.id)) {
            const { data, status } = await axios.put('/api/ownerships/update', {
              ...currentUser,
              groupIds: [...(currentUser?.groupIds || []), currentGroup],
            });
            if (status === 200) {
              return data;
            }
          }
        })
      );
      showSnackbar('Members successfully added to folder!');
    } catch (error: any) {
      showSnackbar('Failed to add members to folder', 'error');
      console.error('Error saving members:', error);
    }
  }, [addedPeople, allPeople, folderCreated, folderId, folderName, showSnackbar]);

  const handleSaveFolder = async () => {
    try {
      let payload: AxiosResponse<SetlistFolder>;

      if (folderId) {
        payload = await axios.put('/api/groups/update', {
          id: folderId,
          groupName: folderName,
        });
      } else {
        payload = await axios.post('/api/groups/create', {
          groupName: folderName,
        });
      }

      if (payload.status === 200) {
        setFolderId(payload.data._id);
        setFolderName(payload.data.groupName);
        setFolderCreated(payload.data.createdAt);

        await Promise.all(
          addedPeople.map(async (userId) => {
            const currentUser = allPeople.find((person) => person.userId === userId);
            const currentGroup: GroupOwnership = {
              id: payload.data._id,
              name: payload.data.groupName,
              createdAt: payload.data.createdAt,
            };
            if (!currentUser?.groupIds?.some((group) => group.id === currentGroup.id)) {
              const { data, status } = await axios.put('/api/ownerships/update', {
                ...currentUser,
                groupIds: [...(currentUser?.groupIds || []), currentGroup],
              });
              if (status === 200) {
                return data;
              }
            }
            return null;
          })
        );

        cancelFolderDrawer();

        // Show specific message based on action
        if (mode === 'create') {
          showSnackbar(`Folder "${folderName}" created successfully!`);
        } else {
          showSnackbar(`Folder "${folderName}" updated successfully!`);
        }
      }
    } catch (error: any) {
      const action = folderId ? 'update' : 'create';
      showSnackbar(`Failed to ${action} folder`, 'error');
      console.error('Error saving folder:', error);
    }
  };

  // Memoized Values
  const filterKeyword = useMemo(() => searchString.trim().toLowerCase(), [searchString]);
  const memoizedFilteredPeople = useMemo(() => {
    if (allPeople.length === 0) return [];
    if (filterKeyword.length < 2) return allPeople;

    return allPeople.filter((people) => {
      const personName = people.fullName.toLowerCase();
      return personName.includes(filterKeyword);
    });
  }, [filterKeyword, allPeople]);

  useEffect(() => {
    setFilteredPeople(memoizedFilteredPeople);
  }, [memoizedFilteredPeople]);

  // API Calls
  const fetchFolderDetails = useCallback(async () => {
    if (mode === 'create' || !folderId) return;
    try {
      const { data } = await axios.get<SetlistFolder>(`/api/groups/get?id=${folderId}`);
      if (data) {
        setFolderName(data.groupName);
        setFolderCreated(data.createdAt);
      }
    } catch (err: any) {
      showSnackbar('Failed to load folder details', 'error');
      console.error('Error fetching folder:', err);
    }
  }, [mode, folderId, setFolderName, setFolderCreated, showSnackbar]);

  const getPeople = useCallback(async () => {
    try {
      const { data, status } = await axios.get<Ownership[]>('/api/ownerships/get');
      if (status === 200) {
        setAllPeople(data);
        const existingMembers = data.filter(
          (person) => person.groupIds?.some((group) => group.id === folderId)
        );
        setAddedPeople(existingMembers.map((person) => person.userId));
      }
    } catch (error: any) {
      showSnackbar('Failed to load users', 'error');
      console.error('Error fetching users:', error);
    }
  }, [folderId, showSnackbar]);

  const deleteGroup = useCallback(async () => {
    try {
      const { status } = await axios.delete(`/api/folders/${folderId}`);
      if (status === 200) {
        await axios.put(`/api/ownerships/${ownership.userId}`, {
          ...ownership,
          groupIds: ownership.groupIds.filter((group) => group.id !== folderId),
        });
        showSnackbar(`Folder "${folderName}" deleted successfully!`);
        toggleFolderDrawer(false);
      }
    } catch (error: any) {
      showSnackbar('Failed to delete folder', 'error');
      console.error('Error deleting folder:', error);
    }
  }, [folderId, ownership, toggleFolderDrawer, folderName, showSnackbar]);

  const handleRemovePerson = useCallback(
    async (id: string) => {
      try {
        const personToRemove = allPeople.find((person) => person.userId === id);
        const { data, status } = await axios.get<Ownership>('/api/ownerships/get', {
          params: {
            userId: id,
          },
        });
        if (status === 200) {
          await axios.put('/api/ownerships/update', {
            ...data,
            groupIds: data.groupIds.filter((group) => group.id !== folderId),
          });
          setAddedPeople(addedPeople.filter((add) => add !== id));
          showSnackbar(`${personToRemove?.fullName || 'Member'} removed from folder`);
        }
      } catch (error: any) {
        showSnackbar('Failed to remove member from folder', 'error');
        console.error('Error removing person:', error);
      }
    },
    [addedPeople, folderId, allPeople, showSnackbar]
  );

  const handleAddPerson = useCallback(
    (id: string) => {
      addedPeople.includes(id)
        ? setPersonToRemove(allPeople.find((person) => person.userId === id) || null)
        : setAddedPeople([...addedPeople, id]);
    },
    [addedPeople, allPeople]
  );

  const handleOpenRemoveModal = useCallback((person: Ownership) => {
    setPersonToRemove(person);
    setOpenRemoveModal(true);
  }, []);

  const handleCloseRemoveModal = useCallback(() => {
    setOpenRemoveModal(false);
    setPersonToRemove(null);
  }, []);

  const handleConfirmRemove = useCallback(() => {
    if (personToRemove) {
      handleRemovePerson(personToRemove.userId);
    }
    handleCloseRemoveModal();
  }, [personToRemove, handleCloseRemoveModal, handleRemovePerson]);

  const handleOpenAddModal = useCallback(() => setOpenAddModal(true), []);

  const handleCloseAddModal = useCallback(() => {
    setOpenAddModal(false);
    handleSaveMembers();
    setSearchString('');
  }, [handleSaveMembers]);

  const handleCloseSnackbar = useCallback(() => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  }, []);

  // Effects
  useEffect(() => {
    fetchFolderDetails();
  }, [fetchFolderDetails]);

  useEffect(() => {
    getPeople();
  }, [getPeople]);

  useEffect(() => {
    if (mode === 'create') {
      setCreatedDateString('');
    } else {
      const date = new Date(folderCreated);
      setCreatedDateString(
        `Created at ${date.getFullYear()}-${(date.getMonth() + 1)
          .toString()
          .padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`
      );
    }
  }, [folderCreated, mode]);

  // Cancel button on drawer
  const cancelFolderDrawer = () => {
    setFolderName('');
    setAddedPeople([]);
    setFolderId('');
    setFolderCreated('');
    setOpenAddModal(false);
    setOpenRemoveModal(false);
    setPersonToRemove(null);
    toggleFolderDrawer(false);
  };

  // Render Components
  const PersonListItem = ({ person }: { person: Ownership }) => (
    <ListItem
      key={person.userId}
      secondaryAction={
        <IconButton
          edge="end"
          onClick={() => handleOpenRemoveModal(person)}
          sx={{
            padding: '8px 20px',
            borderRadius: '40px',
            '&:hover': {
              backgroundColor: 'rgba(239, 184, 200, 0.15)',
            },
          }}
        >
          <Typography variant="body2" color={'#EFB8C8'} fontWeight={700}>
            Remove
          </Typography>
        </IconButton>
      }
    >
      <Stack direction="column" color={'primary.lighter'}>
        <Typography variant="body1" fontWeight={700}>
          {person.fullName}
        </Typography>
      </Stack>
    </ListItem>
  );

  const AddPersonListItem = ({ person }: { person: Ownership }) => (
    <ListItem
      sx={{ borderBottom: '1px solid #49454F', p: '1rem' }}
      secondaryAction={
        <IconButton
          edge="end"
          onClick={() => handleAddPerson(person.userId)}
          sx={{
            width: '30px',
            height: '30px',
            border: 1,
            borderRadius: '50%',
            borderWidth: '2px',
            color: 'primary.lighter',
            '&:hover': { color: 'secondary.main' },
            '&.Mui-selected': {
              backgroundColor: 'secondary.main',
              color: 'primary.darkest',
            },
          }}
          className={addedPeople.includes(person.userId) ? 'Mui-selected' : ''}
        >
          {addedPeople.includes(person.userId) ? <Check /> : <Add />}
        </IconButton>
      }
    >
      <Stack direction="column">
        <Typography variant="subtitle1">{person.fullName}</Typography>
      </Stack>
    </ListItem>
  );

  // Main Render
  return (
    <>
      {/* Improved Snackbar with specific messages */}
      <Snackbar
        open={snackbar.open}
        onClose={handleCloseSnackbar}
        autoHideDuration={6000}
        TransitionComponent={Fade}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={snackbar.severity} onClose={handleCloseSnackbar}>
          <AlertTitle>
            {snackbar.severity === 'success'
              ? 'Success'
              : snackbar.severity === 'error'
              ? 'Error'
              : snackbar.severity === 'warning'
              ? 'Warning'
              : 'Info'}
          </AlertTitle>
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Remove Person Confirmation Modal */}
      <Dialog
        open={openRemoveModal}
        onClose={handleCloseRemoveModal}
        aria-labelledby="remove-person-dialog-title"
        aria-describedby="remove-person-dialog-description"
        PaperProps={{
          sx: { width: '30rem', borderRadius: '1.75rem', padding: '0.5rem' },
        }}
      >
        <DialogTitle id="remove-person-dialog-title">Remove Person</DialogTitle>
        <DialogContent>
          <DialogContentText id="remove-person-dialog-description">
            Are you sure you want to remove {personToRemove?.fullName} from the folder "{folderName}
            "? {`\n`} This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseRemoveModal} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmRemove} color="error" autoFocus>
            Remove
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add People Modal */}
      <Dialog
        open={openAddModal}
        onClose={handleCloseAddModal}
        PaperProps={{
          sx: { width: '30rem', height: '30rem', borderRadius: '1.75rem', padding: '0.5rem' },
        }}
      >
        <DialogTitle
          display="flex"
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <HeaderWithIcon
            Icon={GroupAdd}
            headerText="Add People"
            headerVariant="h3"
            iconColor="secondary.main"
          />
          <IconButton
            aria-label="close"
            onClick={handleCloseAddModal}
            sx={{ color: (theme) => theme.palette.grey[500] }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <InputBase
          placeholder="Search by name"
          sx={{
            alignSelf: 'center',
            width: '90%',
            px: '1.25rem',
            py: '0.75rem',
            color: 'secondary.light',
            backgroundColor: 'secondary.lighter',
            borderRadius: '1.75rem',
            fontWeight: 400,
            fontSize: '1rem',
          }}
          value={searchString}
          onChange={(e) => setSearchString(e.target.value)}
          autoFocus
        />
        <DialogContent sx={{ pt: 0 }}>
          <List>
            {filteredPeople.length > 0 ? (
              filteredPeople.map((person) => (
                <AddPersonListItem key={person.userId} person={person} />
              ))
            ) : (
              <ListItem>
                <Typography variant="subtitle1" color="primary.lighter">
                  No users found
                </Typography>
              </ListItem>
            )}
          </List>
        </DialogContent>
      </Dialog>

      {/* Folder Drawer */}
      <Drawer
        anchor={isMobileAndSmallTablet ? 'bottom' : 'right'}
        open={openDrawer}
        onClose={() => toggleFolderDrawer(false)}
        PaperProps={{
          sx: {
            width: isDesktop ? '25%' : isTablet ? '40%' : '100%',
            height: '100vh',
            bgcolor: isMobileAndSmallTablet ? '#141218' : '#2B2930',
          },
        }}
      >
        <Box sx={{ position: 'relative', height: '100%' }}>
          {/* Header */}
          <Box
            sx={{
              p: '1.125rem',
              backgroundColor: isMobileAndSmallTablet ? '#000' : '#211F26',
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <HeaderWithIcon
              Icon={Folder}
              headerText="Folder Info"
              headerColor="primary.lighter"
              headerVariant="h2"
              iconColor="#D0BCFE"
            />
            <IconButton onClick={cancelFolderDrawer}>
              <Close sx={{ color: 'white' }} />
            </IconButton>
          </Box>
          <Divider sx={{ borderColor: '#49454F' }} />

          {/* Created Date */}
          {mode === 'edit' && (
            <Box sx={{ p: '1.125rem' }}>
              <Typography fontSize="0.75rem" fontStyle="italic" color="#CCC2DC">
                {createdDateString || 'Created on unknown date'}
              </Typography>
            </Box>
          )}
          {mode === 'edit' && <Divider sx={{ borderColor: '#49454F' }} />}

          {/* Folder Name */}
          <Stack direction="column" sx={{ p: '1.125rem', gap: '1rem', alignItems: 'flex-start' }}>
            <Typography variant="h4" color="#EADDFF">
              Name
            </Typography>
            <TextField
              fullWidth
              id="folderName"
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
            />
            {mode === 'edit' && (
              <Stack direction="row" width="100%" justifyContent="flex-end">
                <Button
                  sx={{
                    backgroundColor: 'secondary.main',
                    color: 'primary.main',
                    borderRadius: '40px',
                    textTransform: 'none',
                    padding: '8px 20px',
                    '&:hover': {
                      backgroundColor: 'rgba(208, 188, 255, 0.8)',
                    },
                  }}
                  onClick={handleSaveFolder}
                >
                  Save Name
                </Button>
              </Stack>
            )}
          </Stack>
          <Divider sx={{ borderColor: '#49454F' }} />

          {/* Folder Members */}
          <Box sx={{ p: '1.125rem' }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="h4" color="#EADDFF">
                Members
              </Typography>
              <Button
                startIcon={<GroupAdd />}
                onClick={handleOpenAddModal}
                sx={{
                  color: 'secondary.main',
                  padding: '8px 20px',
                  borderRadius: '40px',
                  '&:hover': {
                    backgroundColor: 'rgba(208, 188, 255, 0.15)',
                  },
                }}
              >
                Add people
              </Button>
            </Stack>
            <List>
              {addedPeopleList.length > 0 ? (
                addedPeopleList.map((person) => (
                  <PersonListItem key={person.userId} person={person} />
                ))
              ) : (
                <ListItem>
                  <Typography variant="subtitle1" color="primary.lighter">
                    No members added
                  </Typography>
                </ListItem>
              )}
            </List>
          </Box>
          <Divider sx={{ borderColor: '#49454F' }} />

          {/* Footer Buttons */}
          {mode === 'create' && (
            <Box sx={{ position: 'absolute', bottom: 12, width: '100%' }}>
              <Stack direction="row" spacing={2} px={2} width="100%">
                <Button
                  variant="outlined"
                  sx={{
                    width: '50%',
                    color: 'secondary.light',
                    borderRadius: '40px',
                    textTransform: 'none',
                    border: '1px solid #938F99',
                  }}
                  onClick={cancelFolderDrawer}
                >
                  Cancel
                </Button>
                <Button
                  variant="outlined"
                  sx={{
                    width: '50%',
                    backgroundColor: 'secondary.main',
                    color: 'primary.main',
                    borderRadius: '40px',
                    textTransform: 'none',
                  }}
                  onClick={handleSaveFolder}
                >
                  Save
                </Button>
              </Stack>
            </Box>
          )}
          {mode === 'edit' && (
            <Box sx={{ position: 'absolute', bottom: '1.125rem', left: '1.125rem' }}>
              <Button
                onClick={deleteGroup}
                sx={{
                  color: '#EFB8C8',
                  borderRadius: '40px',
                  backgroundColor: 'transparent',
                  textTransform: 'none',
                  gap: '0.75rem',
                  padding: '8px 20px',
                  '&:hover': {
                    backgroundColor: 'rgba(239, 184, 200, 0.15)',
                  },
                }}
              >
                <Delete sx={{ color: '#EFB8C8' }} />
                Delete Folder
              </Button>
            </Box>
          )}
        </Box>
      </Drawer>
    </>
  );
};

export default SetlistFolderDrawer;
