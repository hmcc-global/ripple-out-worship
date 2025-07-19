import { SetlistFolder, SetlistFolderMember } from '../../types/setlist.types';
import { Folder, GroupAdd, Delete, Close, Check, Add } from '@mui/icons-material';
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
  InputBase,
  DialogContent,
  Alert,
  AlertTitle,
  Fade,
  Snackbar,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import axios, { AxiosResponse } from 'axios';
import { Dispatch, SetStateAction, useCallback, useEffect, useState } from 'react';
import HeaderWithIcon from '../custom/HeaderWithIcon';
import { GroupOwnership, Ownership } from '../../types/ownership.types';
import { useOwnership } from '../../helpers/customHooks';

type SetlistFolderDrawerProps = {
  openDrawer: boolean;
  toggleFolderDrawer: (newOpen: boolean) => void;
  setFolderId: Dispatch<SetStateAction<string>>;
  setFolderName: Dispatch<SetStateAction<string>>;
  setFolderCreated: Dispatch<SetStateAction<string>>;
  folderId: string;
  folderName: string;
  folderCreated: string;
  mode: string;
};

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
  const ownership = useOwnership();

  // handle add people modal
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [allPeople, setAllPeople] = useState<Ownership[]>([]);
  const [addedPeople, setAddedPeople] = useState<string[]>([]);

  const [createdDateString, setCreatedDateString] = useState<string>('');
  const handleOpenModal = () => {
    setOpenModal(true);
  };
  const handleCloseModal = () => {
    setOpenModal(false);
    handleSaveMembers();
  };

  const handleRemovePerson = (id: string) => {
    setAddedPeople(addedPeople.filter((add) => add !== id));
  };

  // handle snackbar and error in folder handling
  const [successSnackbarOpen, setSuccessSnackbarOpen] = useState<boolean>(false);
  const [invalidFolder, setInvalidFolder] = useState<string>('');

  const getPeople = useCallback(async () => {
    try {
      const { data, status } = await axios.get<Ownership[]>('/api/ownerships/get');
      if (status === 200) {
        setAllPeople(data);
        const existingMembers = data.filter((person) =>
          person.groupIds.find((group) => group.id === folderId)
        );
        setAddedPeople(existingMembers.map((person) => person.userId));
      }
    } catch (error) {
      console.log(error);
    }
  }, [folderId, setAllPeople, setAddedPeople]);

  const deleteGroup = useCallback(async () => {
    try {
      const { data, status } = await axios.put(`/api/groups/delete`, {
        params: {
          id: folderId,
        },
      });
      if (status === 200) {
        setSuccessSnackbarOpen(true);
        toggleFolderDrawer(false);
      }
    } catch (e) {
      console.log(e);
    }
  }, [folderId]);

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

  // To render the songs that are added to setlist
  const addedPeopleList = allPeople.filter((person) => addedPeople.includes(person.userId));
  const handleAddPerson = (id: string) => {
    let result = addedPeople.includes(id)
      ? // eslint-disable-next-line eqeqeq
        addedPeople.filter((add) => add != id)
      : [...addedPeople, id];
    setAddedPeople(result);
  };

  // cancel button on drawer
  const cancelFolderDrawer = () => {
    setFolderName('');
    setAddedPeople([]);
    setFolderId('');
    setFolderCreated('');
    handleCloseModal();
    toggleFolderDrawer(false);
  };

  const handleSaveMembers = async () => {
    if (!folderId || !addedPeople.length) {
      return;
    }
    try {
      //TODO: Think of removing works
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
              setInvalidFolder('');
              return data;
            }
          }
        })
      );

      setInvalidFolder('');
      setSuccessSnackbarOpen(true);
    } catch (error: any) {
      setInvalidFolder(error.response?.data || 'An error occurred');
      setSuccessSnackbarOpen(false);
      console.log(error);
    }
  };

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
        //TODO: Think of removing works
        await Promise.all(
          addedPeople.map(async (userId) => {
            const currentUser = allPeople.find((person) => person.userId === userId);
            const currentGroup: GroupOwnership = {
              id: payload.data._id,
              name: payload.data.groupName,
              createdAt: payload.data.createdAt,
            };
            // Check if the user is already part of the folder
            if (!currentUser?.groupIds?.some((group) => group.id === currentGroup.id)) {
              const { data, status } = await axios.put('/api/ownerships/update', {
                ...currentUser,
                groupIds: [...(currentUser?.groupIds || []), currentGroup],
              });
              if (status === 200) {
                setInvalidFolder('');
                return data;
              }
            }
            setInvalidFolder('Some of the members are already in the folder');
            return null;
          })
        );
        cancelFolderDrawer();
        setSuccessSnackbarOpen(true);
      }
      setInvalidFolder('');
      setSuccessSnackbarOpen(true);
    } catch (error: any) {
      setInvalidFolder(error.response.data);
      setSuccessSnackbarOpen(false);
      console.log(error);
    }
  };

  const handleCloseSuccessSnackbar = () => {
    setSuccessSnackbarOpen(false);
  };

  return (
    <>
      {/* Error message */}
      {invalidFolder ? (
        <Typography variant={'body2'} color={'error'}>
          {invalidFolder}
        </Typography>
      ) : null}

      {/* Success message */}
      <Snackbar
        open={successSnackbarOpen}
        onClose={handleCloseSuccessSnackbar}
        autoHideDuration={6000}
        TransitionComponent={Fade}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" onClose={handleCloseSuccessSnackbar}>
          <AlertTitle>Success</AlertTitle>
          Folder successfully saved/removed !
        </Alert>
      </Snackbar>

      {/* Folder settings */}
      <Drawer
        anchor={'right'}
        open={openDrawer}
        onClose={() => toggleFolderDrawer(false)}
        PaperProps={{
          sx: {
            width: { xs: '100%', md: '25%' },
            backgroundColor: { xs: '#141218', md: '#2B2930' },
          },
        }}
      >
        <Box>
          <Box
            sx={{
              p: 2,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: { xs: '#000000', md: '#211F26' },
            }}
          >
            <HeaderWithIcon
              Icon={Folder}
              headerText={mode === 'edit' ? 'Folder Info' : 'New Folder'}
              headerVariant="h4"
              iconColor="primary.light"
            />
            <IconButton onClick={cancelFolderDrawer}>
              <CloseIcon sx={{ color: 'white' }} />
            </IconButton>
          </Box>

          <Divider sx={{ borderColor: '#49454F' }} />

          <Box sx={{ p: 2 }}>
            <Typography
              variant="subtitle1"
              sx={{
                fontFamily: 'DM Sans',
                fontWeight: 400,
                fontStyle: 'italic',
                fontSize: '12px',
                lineHeight: '100%',
                letterSpacing: '0%',
                verticalAlign: 'middle',
              }}
            >
              {createdDateString}
            </Typography>
          </Box>

          <Divider sx={{ borderColor: '#49454F' }} />

          {/* folder name field */}
          <Box sx={{ p: 2 }}>
            <Typography variant="subtitle1">Folder Name</Typography>
            <TextField
              fullWidth
              id="folderName"
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
            />
          </Box>
          {mode === 'edit' && (
            <Stack direction="row" spacing={2} px={2} width={'100%'} paddingBottom={2}>
              <Box sx={{ width: '70%' }}></Box>
              <Button
                sx={{
                  width: '30%',
                  backgroundColor: 'secondary.main',
                  color: 'primary.main',
                  borderRadius: '40px',
                  textTransform: 'none',
                }}
                onClick={() => handleSaveFolder()}
              >
                Save Name
              </Button>
            </Stack>
          )}
          <Divider sx={{ borderColor: '#49454F' }} />

          {/* folder members list */}
          <Box sx={{ p: 2 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="h3" sx={{ color: 'secondary.main' }}>
                Members
              </Typography>
              <Button
                startIcon={<GroupAdd />}
                onClick={handleOpenModal}
                sx={{ color: 'primary.light' }}
              >
                Add people
              </Button>
            </Stack>

            <List>
              {addedPeopleList.length > 0 ? (
                addedPeopleList.map((person) => (
                  <ListItem
                    key={person.userId} // Use a unique identifier
                    secondaryAction={
                      <IconButton edge="end" onClick={() => handleRemovePerson(person.userId)}>
                        <Typography color="#EFB8C8"> Remove</Typography>
                      </IconButton>
                    }
                  >
                    <Stack direction="column">
                      <Typography variant="subtitle1">{person.fullName}</Typography>
                      <Typography variant="body2">{person.email}</Typography>
                    </Stack>
                  </ListItem>
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
          {mode === 'create' && (
            <Box sx={{ position: 'absolute', bottom: 12, width: '100%' }}>
              <Stack direction="row" spacing={2} px={2} width={'100%'}>
                <Button
                  variant="outlined"
                  sx={{
                    width: '50%',
                    color: 'secondary.light',
                    borderRadius: '40px',
                    textTransform: 'none',
                  }}
                  onClick={() => cancelFolderDrawer()}
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
                  onClick={() => handleSaveFolder()}
                >
                  Save
                </Button>
              </Stack>
            </Box>
          )}

          {/* save and cancel button for drawer */}

          {mode === 'edit' && (
            <Box sx={{ position: 'absolute', bottom: 12, width: '100%' }}>
              <Button
                onClick={deleteGroup}
                sx={{
                  width: '40%',
                  color: '#EFB8C8',
                  borderRadius: '40px',
                  backgroundColor: 'transparent',
                  textTransform: 'none',
                }}
              >
                <Delete sx={{ color: '#EFB8C8' }} />
                Delete Folder
              </Button>
            </Box>
          )}
        </Box>
      </Drawer>

      {/* Add people modal */}
      <Dialog
        open={openModal}
        onClose={handleCloseModal}
        PaperProps={{ sx: { width: '30rem', height: '40rem', borderRadius: '10px' } }}
      >
        <DialogTitle>
          <HeaderWithIcon
            Icon={GroupAdd}
            headerText="Add People"
            headerVariant="h3"
            iconColor="primary.light"
          />
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleCloseModal}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <Close />
        </IconButton>
        <InputBase
          placeholder="Search name or email"
          sx={{
            alignSelf: 'center',
            width: '90%',
            py: 1,
            px: 2,
            color: 'secondary.light',
            backgroundColor: 'secondary.lighter',
            borderRadius: '28px',
          }}
        />
        <DialogContent sx={{ pt: 0 }}>
          <List>
            {allPeople.length > 0 ? (
              allPeople.map((person, i) => (
                <ListItem
                  key={i}
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
                    <Typography variant="body2">{person.email}</Typography>
                  </Stack>
                </ListItem>
              ))
            ) : (
              <ListItem>
                <Typography variant="subtitle1" color="primary.lighter">
                  No users exist or failed retrieving users
                </Typography>
              </ListItem>
            )}
          </List>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SetlistFolderDrawer;
