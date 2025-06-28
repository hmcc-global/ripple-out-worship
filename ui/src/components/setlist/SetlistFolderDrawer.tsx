import { SetlistFolderMember } from '../../types/setlist.types';
import { Folder, GroupAdd, Delete, Close, Check, Add, People } from '@mui/icons-material';
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
import Typography from '@mui/material/Typography';
import axios, { AxiosResponse } from 'axios';
import { Dispatch, SetStateAction, useCallback, useEffect, useState } from 'react';
import HeaderWithIcon from '../custom/HeaderWithIcon';

type SetlistFolderDrawerProps = {
  openDrawer: boolean;
  toggleFolderDrawer: (newOpen: boolean) => void;
  setFolderId: Dispatch<SetStateAction<string>>;
  setFolderName: Dispatch<SetStateAction<string>>;
  setFolderMembers: Dispatch<SetStateAction<string[]>>;
  folderId: string;
  folderName: string;
  folderMembers: string[];
};

const SetlistFolderDrawer = (props: SetlistFolderDrawerProps) => {
  const {
    openDrawer,
    toggleFolderDrawer,
    setFolderId,
    setFolderName,
    setFolderMembers,
    folderId,
    folderName,
    folderMembers,
  } = props;

  // handle add people modal
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [allPeople, setAllPeople] = useState<SetlistFolderMember[]>([]);
  const [addedPeople, setAddedPeople] = useState<string[]>([]);
  const handleOpenModal = () => setOpenModal(true);
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
      const { data, status } = await axios.get('/api/users/get');
      if (status === 200) setAllPeople(data);
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    getPeople();
  }, [addedPeople, People]);

  useEffect(() => {
    setAddedPeople(folderMembers);
  }, [folderId, People]);

  // To render the songs that are added to setlist
  const addedPeopleList = allPeople.filter((person) => addedPeople.includes(person._id));
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
    setFolderMembers([]);
    setFolderId('');
    handleCloseModal();
    toggleFolderDrawer(false);
  };

  const handleSaveMembers = async () => {
    try {
      let payload: AxiosResponse;

      payload = await axios.put('/api/groups/update', {
        id: folderId,
        userIds: addedPeople,
      });

      if (payload.status === 200) {
        setInvalidFolder('');
        return payload.data;
      }

      setInvalidFolder('Error adding members');
      setSuccessSnackbarOpen(false);
    } catch (error: any) {
      setInvalidFolder(error.response.data);
      setSuccessSnackbarOpen(false);
      console.log(error);
    }
  };

  const handleSaveFolder = async () => {
    try {
      let payload: AxiosResponse;

      if (folderId) {
        payload = await axios.put('/api/groups/update', {
          id: folderId,
          groupName: folderName,
          userIds: addedPeople,
        });
      } else {
        payload = await axios.post('/api/groups/create', {
          groupName: folderName,
          userIds: addedPeople,
        });
      }

      if (payload.status === 200) {
        cancelFolderDrawer();
        setInvalidFolder('');
        setSuccessSnackbarOpen(true);
        return payload.data;
      }

      setInvalidFolder('Error saving setlist');
      setSuccessSnackbarOpen(false);
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
          Folder successfully saved!
        </Alert>
      </Snackbar>

      {/* Folder settings */}
      <Drawer
        anchor={'right'}
        open={openDrawer}
        onClose={() => toggleFolderDrawer(false)}
        PaperProps={{
          sx: { width: { xs: '100%', md: '25%' } },
        }}
      >
        <Box>
          <Box sx={{ p: 2 }}>
            <HeaderWithIcon
              Icon={Folder}
              headerText="Folder Info"
              headerVariant="h4"
              iconColor="primary.light"
            />
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
                    key={person._id} // Use a unique identifier
                    secondaryAction={
                      <IconButton edge="end" onClick={() => handleRemovePerson(person._id)}>
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

          {/* save and cancel button for drawer */}
          <Box sx={{ position: 'absolute', bottom: 12, width: '100%' }}>
            <Button
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
        </Box>
      </Drawer>

      {/* Add people modal */}
      <Dialog
        open={openModal}
        onClose={handleCloseModal}
        PaperProps={{ sx: { width: '30rem', height: '30rem' } }}
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
                      onClick={() => handleAddPerson(person._id)}
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
                      className={addedPeople.includes(person._id) ? 'Mui-selected' : ''}
                    >
                      {addedPeople.includes(person._id) ? <Check /> : <Add />}
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
