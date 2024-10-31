import { SetlistEditorFields, SetlistEditorProps, SetlistFolder } from '../../types/setlist.types';
import { SongSchema, SongSearchFilter, SongSetlistSchema } from '../../types/song.types';
import { Info, MusicNote, Search, QueueMusic, AddCircleOutline } from '@mui/icons-material';
import {
  Alert,
  AlertTitle,
  Box,
  Button,
  Container,
  Fade,
  FormControl,
  IconButton,
  InputBase,
  Snackbar,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { LocalizationProvider, DateField, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import axios from 'axios';
import { FC, useCallback, useEffect, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import SetlistSongCard from './SetlistSongCard';
import HeaderWithIcon from '../custom/HeaderWithIcon';
import PageHeader from '../navigation/PageHeader';
import { useFolders, useSongs } from '../../helpers/customHooks';
import SetlistSongsTable from './SetlistSongTable';
import AutocompleteInput from '../custom/AutocompleteInput';

const SetlistEditorContainer: FC<SetlistEditorProps> = () => {
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const navigate = useNavigate();

  const [action, setAction] = useState<string>('new');
  const paths: string[] = window.location.pathname.split('/');
  useEffect(() => {
    if (paths.includes('edit')) {
      setAction('edit');
      setSetlistId(paths[paths.length - 1]);
    }
  }, [paths]);

  const allSongs = useSongs() as SongSchema[];
  const allFolders = useFolders() as SetlistFolder[];

  // STATES
  const [date, setDate] = useState<Dayjs | null>(null);
  const [search, setSearch] = useState<string>('');
  const [songResults, setSongResults] = useState<SongSchema[]>([]);
  const [filterData, setFilterData] = useState<SongSearchFilter>();
  const [showDetails, setShowDetails] = useState<boolean>(true);

  const [successSnackbarOpen, setSuccessSnackbarOpen] = useState<boolean>(false);
  const [invalidSetlist, setInvalidSetlist] = useState<string>('');

  const [setlist, setSetlist] = useState<SetlistEditorFields>({} as SetlistEditorFields);
  const [setlistId, setSetlistId] = useState<string>('');

  const [addedSongList, setAddedSongList] = useState<SongSetlistSchema[]>([]);
  const [folderList, setFolderList] = useState<string[]>([]);
  const [folderOptions, setFolderOptions] = useState<SetlistFolder[]>([]);

  // FORM HANDLER
  const { handleSubmit, formState, control, reset, register } = useForm<SetlistEditorFields>();
  const { errors } = formState;

  const getSetlist = useCallback(async () => {
    if (setlistId === '') return;

    try {
      const { data, status } = await axios.get(`/api/setlists/get`, {
        params: {
          id: setlistId,
        },
      });
      if (status === 200) {
        setSetlist(data);
      }
    } catch (e) {
      console.log(e);
    }
  }, [setlistId]);

  useEffect(() => {
    getSetlist();
  }, [getSetlist, setlistId]);

  useEffect(() => {
    if (setlist && Object.keys(setlist).length > 0) {
      reset({
        name: setlist.name,
        date: dayjs(setlist.date),
        songs: setlist.songs,
      });
      setDate(dayjs(setlist.date));
      setAddedSongList(setlist.songs);
      setFolderList(
        folderOptions
          .filter((folder) => setlist.groupIds.includes(folder._id))
          .map((folder) => folder.groupName)
      );
    }
  }, [setlist, folderOptions, reset]);

  const getSongResults = useCallback(async () => {
    if (search !== '') {
      const filteredSongs = allSongs.filter((song) =>
        song.title.toLowerCase().includes(search.toLowerCase())
      );
      setSongResults(filteredSongs);
    } else setSongResults(allSongs);
  }, [search, allSongs]);

  useEffect(() => {
    getSongResults();
  }, [getSongResults]);

  useEffect(() => {
    if (allFolders) {
      setFolderOptions(allFolders);
    }
  }, [allFolders]);

  // add the id to the array of clicked items if it doesn't exist but if it does exist remove it
  // this makes sure that double clicking on an item brings it back to normal
  // change <Add /> to <Check /> at "id"
  const handleAddSong = (id: string) => {
    const toRemove = addedSongList.find((song) => song._id === id);

    if (toRemove) {
      const updatedSongList = [...addedSongList];
      updatedSongList.splice(addedSongList.indexOf(toRemove), 1);

      updatedSongList.forEach((song, i) => {
        if (song.sequence! > toRemove.sequence!) {
          updatedSongList[i] = { ...song, sequence: song.sequence! - 1 };
        }
      });

      setAddedSongList(updatedSongList);
    } else {
      const songResult = songResults.find((song) => song._id === id);
      if (!songResult) return;

      const setlistSong: SongSetlistSchema = {
        ...songResult,
        key: songResult.originalKey,
        sequence: addedSongList.length + 1,
      };

      setAddedSongList([...addedSongList, setlistSong]);
    }
  };

  const handleSaveSetlist: SubmitHandler<SetlistEditorFields> = async (data) => {
    try {
      let payload;
      if (action === 'edit') {
        payload = await axios.put(`/api/setlists/update`, {
          id: setlistId,
          name: data.name,
          date: date ? date.toDate() : new Date(''),
          songs: addedSongList,
          groupIds: folderOptions
            .filter((folder) => folderList.includes(folder.groupName))
            .map((folder) => folder._id),
        });
      } else {
        payload = await axios.post('/api/setlists/create', {
          name: data.name,
          date: date ? date.toDate() : new Date(''),
          songs: addedSongList,
          groupIds: folderOptions
            .filter((folder) => folderList.includes(folder.groupName))
            .map((folder) => folder._id),
          createdBy: '',
        });
      }

      // folderList.forEach((folder) => {
      //   const folderToUpdate = folderOptions.find((f) => f.groupName === folder);

      //   if (folderToUpdate) {
      //     const payload = axios.post('/api/group/update', {
      //       _id: folderToUpdate._id,
      //       setlistIds: [...folderToUpdate.setlistIds, setlistId],
      //     });
      //   } else {

      //   }

      // })

      if (payload.status === 200) {
        setInvalidSetlist('');
        setSuccessSnackbarOpen(true);
        // TODO: redirect to setlist view page after saving
        navigate(`/setlist`);
        return payload.data;
      }

      setInvalidSetlist('Error saving setlist');
      setSuccessSnackbarOpen(false);
    } catch (error: any) {
      setInvalidSetlist(error.response.data);
      setSuccessSnackbarOpen(false);
      console.log(error);
    }
  };

  const handleCloseSuccessSnackbar = () => {
    setSuccessSnackbarOpen(false);
  };

  return (
    <Container sx={{ py: '1rem', px: '2rem', height: '100%', minWidth: '100%', overflow: 'auto' }}>
      <Box>
        {/* Error message */}
        {invalidSetlist ? (
          <Typography variant={'body2'} color={'error'}>
            {invalidSetlist}
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
            Song successfully saved!
          </Alert>
        </Snackbar>

        <form onSubmit={handleSubmit(handleSaveSetlist)}>
          <PageHeader
            title={action === 'edit' ? 'Edit Setlist' : 'New Setlist'}
            icon={<QueueMusic />}
            actionButtons={
              <Stack direction="row">
                <Button
                  type={'submit'}
                  color="secondary"
                  variant="contained"
                  sx={{
                    mr: 1,
                    textTransform: 'none',
                    borderRadius: '100px',
                    px: 3,
                  }}
                >
                  Save
                </Button>
                <Button
                  color={'secondary'}
                  sx={{
                    textTransform: 'none',
                    borderRadius: '100px',
                    border: 1,
                    px: 2,
                  }}
                  onClick={() => navigate('/sosetlistng')}
                >
                  Cancel
                </Button>
              </Stack>
            }
          />

          <Stack direction="row" spacing={'24px'} my={'24px'} width={'100%'}>
            {/* setlist details and info */}
            <Box display="flex" justifyContent="center" width={'42.5vw'}>
              <Stack direction="column" spacing={2} width={'100%'}>
                <HeaderWithIcon
                  Icon={Info}
                  headerText="Details"
                  headerVariant="h3"
                  iconColor="secondary.main"
                  headerColor={'secondary.main'}
                />
                {/* Setlist Name Field */}
                <Controller
                  name="name"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <TextField
                      id="name"
                      label="Setlist Name"
                      error={!!errors.name}
                      helperText={errors?.name?.message}
                      {...field}
                    />
                  )}
                />

                {/* Date Field */}
                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={'en'}>
                  <DatePicker
                    label="Date"
                    value={date}
                    onChange={(newValue) => {
                      setDate(newValue);
                      console.log(newValue);
                    }}
                  />
                </LocalizationProvider>

                {/* TODO: Add to Folder */}
                <FormControl fullWidth>
                  <AutocompleteInput
                    id="folders"
                    options={folderOptions.map((folder) => folder.groupName)}
                    label="Folders"
                    autoComplete="folders"
                    value={folderList}
                    onChange={(_, newValue) => {
                      setFolderList(newValue as string[]);
                    }}
                    register={register}
                    multiple
                  />
                </FormControl>

                {/* Added Songs List */}
                <Box sx={{ pt: 3 }}>
                  <Stack direction="column" spacing={1}>
                    {/* song list header */}
                    <HeaderWithIcon
                      Icon={MusicNote}
                      headerText="Song List"
                      headerVariant="h3"
                      iconColor="secondary.main"
                      headerColor={'secondary.main'}
                    />
                    <SetlistSongsTable songList={addedSongList} setSongList={setAddedSongList} />
                  </Stack>
                </Box>
              </Stack>
            </Box>

            {/* search for songs to add */}
            <Box display="flex" justifyContent="center" width={'42.5vw'}>
              <Stack direction="column" spacing={2} width={'100%'}>
                {/* header */}
                <HeaderWithIcon
                  Icon={AddCircleOutline}
                  headerText="Search to Add Songs"
                  headerVariant="h3"
                  iconColor="secondary.main"
                  headerColor={'secondary.main'}
                />

                {/* search bar */}
                <Stack
                  sx={{
                    alignItems: 'center',
                    boxShadow:
                      '0px 1px 2px 0px rgba(0, 0, 0, 0.20), 0px 0.1px 0.3px 0px rgba(0, 0, 0, 0.10)',
                    background: '#2B2930',
                    borderRadius: '100px',
                  }}
                  direction="row"
                >
                  <IconButton>
                    <Search sx={{ mx: 2, color: '#CAC4D0' }} />
                  </IconButton>
                  <InputBase
                    placeholder="Search"
                    value={search}
                    fullWidth
                    onChange={(e) => {
                      setSearch(e.target.value);
                    }}
                    sx={{
                      my: 1.5,
                      color: '#CAC4D0',
                      backgroundColor: '#2B2930',
                      borderRadius: '28px',
                    }}
                  />
                </Stack>
                {/* search results */}
                {songResults.length > 0 ? (
                  songResults.map((song, i) => (
                    // add songs card
                    <SetlistSongCard
                      key={i}
                      {...song}
                      showDetails={showDetails}
                      filterData={filterData}
                      isDesktop={isDesktop}
                      handleAddSong={handleAddSong}
                      addedSongs={addedSongList.map((song) => song._id)}
                    />
                  ))
                ) : (
                  <Typography>Couldn't find "{search}"</Typography>
                )}
              </Stack>
            </Box>
          </Stack>
        </form>
      </Box>
    </Container>
  );
};

export default SetlistEditorContainer;
