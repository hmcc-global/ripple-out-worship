import { styled } from '@mui/material/styles';
// Types
import {
  Setlist,
  SetlistEditorFields,
  SetlistEditorProps,
  SetlistFolder,
} from '../../types/setlist.types';
import { SongSchema, SongSearchFilter, SongSetlistSchema } from '../../types/song.types';
// Components
import HeaderWithIcon from '../custom/HeaderWithIcon';
import PageHeader from '../navigation/PageHeader';
import SetlistSongsTable from './SetlistSongsTable';
import AutocompleteInput from '../custom/AutocompleteInput';
import SongFieldArray from '../song/SongFieldArray';

// MUI Components
import {
  Alert,
  AlertTitle,
  Box,
  Button,
  Container,
  Drawer,
  Fade,
  FormControl,
  IconButton,
  InputBase,
  Snackbar,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import axios, { AxiosResponse } from 'axios';
import { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import {
  Info,
  MusicNote,
  Search,
  QueueMusic,
  AddCircleOutline,
  Check,
  Add,
  TuneOutlined,
} from '@mui/icons-material';

// Hooks
import { useSongs, useOwnership } from '../../helpers/customHooks';

// Constants
const SONG_CARD_FIELDS = [
  { key: 'themes', label: 'Themes' },
  { key: 'tempo', label: 'Tempo' },
  { key: 'originalKey', label: 'Key' },
  { key: 'year', label: 'Year' },
  { key: 'code', label: 'Code' },
  { key: 'timeSignature', label: 'Time' },
];

// Styled Components
const MainContainer = styled(Container)<{ isMobileOrSmallTablet?: boolean }>(
  ({ isMobileOrSmallTablet }) => ({
    paddingBlock: isMobileOrSmallTablet ? '0.75rem' : '1rem',
    paddingInline: isMobileOrSmallTablet ? '0.75rem' : '2rem',
    height: isMobileOrSmallTablet ? 'calc(100vh - 80px - 60px)' : '100vh',
    minWidth: '100%',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
  })
);

const ContentWrapper = styled(Box)({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  height: '100%',
});

const SectionsContainer = styled(Box)<{ isMobileOrSmallTablet?: boolean }>(
  ({ isMobileOrSmallTablet }) => ({
    flex: 1,
    overflow: isMobileOrSmallTablet ? 'auto' : 'hidden',
    display: 'flex',
    flexDirection: isMobileOrSmallTablet ? 'column' : 'row',
    gap: '1.25rem',
    marginBlock: '0.5rem',
  })
);

const SetlistDetailsBox = styled(Box)<{ isMobileOrSmallTablet?: boolean }>(
  ({ isMobileOrSmallTablet }) => ({
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    overflow: isMobileOrSmallTablet ? 'visible' : 'hidden',
    flexShrink: isMobileOrSmallTablet ? 0 : undefined,
  })
);

const SetlistDetailsContent = styled(Stack)<{ isMobileOrSmallTablet?: boolean }>(
  ({ isMobileOrSmallTablet }) => ({
    flex: isMobileOrSmallTablet ? undefined : 1,
    overflow: isMobileOrSmallTablet ? 'visible' : 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: isMobileOrSmallTablet ? '1rem' : '1.5rem',
  })
);

const SongSearchBox = styled(Box)<{ isMobileOrSmallTablet?: boolean; isTablet?: boolean }>(
  ({ isMobileOrSmallTablet, isTablet }) => ({
    display: 'flex',
    flexDirection: 'column',
    width: isMobileOrSmallTablet ? '100%' : isTablet ? '47.5vw' : '57.5vw',
    overflow: 'hidden',
    maxHeight: isMobileOrSmallTablet ? 'calc(100vh - 5rem)' : '90vh',
  })
);

const SongSearchContent = styled(Stack)<{ isMobileOrSmallTablet?: boolean }>(
  ({ isMobileOrSmallTablet }) => ({
    flex: isMobileOrSmallTablet ? undefined : 1,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    gap: isMobileOrSmallTablet ? '1rem' : '1.5rem',
    maxHeight: '100%',
  })
);

const SongSearchStack = styled(Stack)({
  flexDirection: 'column',
  alignItems: 'center',
  gap: '0.5rem',
  width: '100%',
  overflow: 'auto',
  maxHeight: '100%',
});

const SongResultsContainer = styled(Box)({
  overflow: 'auto',
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
  marginTop: '1rem',
  width: '100%',
  maxHeight: '100%',
});

const MobileActionButtonsContainer = styled(Box)({
  position: 'fixed',
  bottom: '80px',
  left: 0,
  right: 0,
  paddingBottom: '1rem',
  display: 'flex',
  zIndex: 1000,
  height: '60px',
});

const MobileSongList = styled(Box)({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  gap: '0.75rem',
});

const AddSongsSection = styled(Box)({
  flexShrink: 0,
  marginBottom: '1rem',
});

const AddSongsButton = styled(Button)({
  width: '100%',
  textTransform: 'none',
  borderRadius: '6.25rem',
  paddingBlock: '0.5rem',
  fontSize: '0.875rem',
  fontWeight: 500,
});

const StyledButton = styled(Button)({
  textTransform: 'none',
  borderRadius: '100px',
  paddingBlock: '0.5rem',
});

const CancelButton = styled(Button)({
  marginRight: '0.5rem',
  textTransform: 'none',
  borderRadius: '100px',
  border: '1px solid #938F99',
  paddingInline: '1.5rem',
});

const SearchContainer = styled(Stack)({
  alignItems: 'center',
  boxShadow: '0px 1px 2px 0px rgba(0, 0, 0, 0.20), 0px 0.1px 0.3px 0px rgba(0, 0, 0, 0.10)',
  background: '#2B2930',
  borderRadius: '100px',
  paddingInline: '0.5rem',
  flexShrink: 0,
  flexDirection: 'row',
  width: '100%',
});

const SearchIcon = styled(Search)({
  marginInline: '0.5rem',
  color: '#CAC4D0',
});

const FilterIconButton = styled(IconButton)<{ isFilterDrawerToggled?: boolean }>(
  ({ theme, isFilterDrawerToggled }) => ({
    width: '40px',
    height: '40px',
    border: '2px solid',
    borderRadius: '50%',
    borderColor: isFilterDrawerToggled ? theme.palette.primary.main : theme.palette.secondary.main,
    color: isFilterDrawerToggled ? theme.palette.primary.main : theme.palette.secondary.main,
    backgroundColor: isFilterDrawerToggled ? theme.palette.secondary.main : 'transparent',
    '&:hover': {
      borderColor: isFilterDrawerToggled
        ? theme.palette.secondary.main
        : theme.palette.primary.main,
      color: isFilterDrawerToggled ? theme.palette.secondary.main : theme.palette.primary.main,
      backgroundColor: isFilterDrawerToggled ? 'transparent' : theme.palette.secondary.main,
    },
  })
);

const SongSearchInput = styled(InputBase)({
  marginBlock: '0.75rem',
  color: '#CAC4D0',
  backgroundColor: '#2B2930',
  borderRadius: '20.5rem',
});

const SongCard = styled(Container)(({ theme }) => ({
  borderRadius: '0.5rem',
  border: '1px solid #49454F',
  backgroundColor: theme.palette.primary.darkest,
  padding: '1rem',
  '&:hover': {
    borderColor: theme.palette.secondary.main,
    cursor: 'pointer',
  },
  transition: 'all 0.1s ease-in-out',
  minWidth: '100%',
  maxWidth: '100%',
  flexShrink: 0,
}));

const SongCardHeader = styled(Stack)({
  justifyContent: 'space-between',
  width: '100%',
  padding: 0,
  marginBottom: '1rem',
});

const AddButton = styled(IconButton)<{ isAdded?: boolean }>(({ theme, isAdded }) => ({
  width: '32px',
  height: '32px',
  border: '2px solid',
  borderRadius: '50%',
  color: theme.palette.primary.lighter,
  '&:hover': {
    color: theme.palette.secondary.main,
  },
  ...(isAdded && {
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.primary.darkest,
  }),
}));

const SongDetails = styled(Stack)({
  maxWidth: '100%',
  flexWrap: 'wrap',
  gap: '0.5rem',
});

const DetailField = styled(Stack)({
  gap: '0.5rem',
  width: 'fit-content',
  maxWidth: '100%',
  alignItems: 'center',
  justifyContent: 'flex-start',
});

const DrawerContent = styled(Box)({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  padding: '1rem',
});

const DrawerBody = styled(Box)({
  flex: 1,
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
});

// Main Component
const SetlistEditorContainer: FC<SetlistEditorProps> = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isTablet = useMediaQuery(theme.breakpoints.between('md', 'xl'));
  const isDesktop = useMediaQuery(theme.breakpoints.up('xl'));
  const isMobileOrSmallTablet = !isTablet && !isDesktop;
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const allSongs = useSongs() as SongSchema[];
  // const allFolders = useFolders() as SetlistFolder[];
  const ownership = useOwnership();

  // Form and state management
  const {
    handleSubmit,
    formState: { errors },
    control,
    reset,
    register,
  } = useForm<SetlistEditorFields>();
  const [action, setAction] = useState<string>('new');
  // Initialize editor mode and ID from URL
  const paths: string[] = window.location.pathname.split('/');
  useEffect(() => {
    if (paths.includes('edit')) {
      setAction('edit');
      setSetlistId(paths[paths.length - 1]);
    }
  }, [paths]);

  // STATES
  const [date, setDate] = useState<Dayjs | null>(null);
  const [search, setSearch] = useState<string>('');
  const [songResults, setSongResults] = useState<SongSchema[]>([]);
  const [filterData, setFilterData] = useState<SongSearchFilter>();
  const [showDetails, setShowDetails] = useState<boolean>(true);

  const [setlist, setSetlist] = useState<SetlistEditorFields>({} as SetlistEditorFields);
  const [setlistId, setSetlistId] = useState<string>('');
  const [addedSongList, setAddedSongList] = useState<SongSetlistSchema[]>([]);
  const [folderList, setFolderList] = useState<string[]>([]);
  const [folderOptions, setFolderOptions] = useState<SetlistFolder[]>([]);

  // Search state
  const [searchString, setSearchString] = useState('');
  const filterKeyword = useMemo(() => searchString.trim().toLowerCase(), [searchString]);

  // UI state
  const [successSnackbarOpen, setSuccessSnackbarOpen] = useState(false);
  const [invalidSetlist, setInvalidSetlist] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Songs pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  // get dynamiuc songs data
  const getSongResults = useCallback(async () => {
    setLoading(true);
    try {
      //TODO: find a way so it only call once
      const payload = await axios.get('/api/songs/search', {
        params: {
          keyword: filterData?.search || '',
          themes: filterData?.themes || [],
          tempo: filterData?.tempo || [],
          page: page,
          limit: 20,
        },
      });
      setSongResults((prevSongs) => {
        const uniqueSongs = [...prevSongs, ...payload.data.data];
        const songMap = new Map();

        // Use Map to deduplicate by ID
        uniqueSongs.forEach((song) => {
          const id = song._id || song.id;
          songMap.set(id, song);
        });

        // Convert back to array
        return Array.from(songMap.values());
      });
      setTotalPages(payload.data.totalPages);
      setLoading(false);
    } catch (error: any) {
      if (error?.response) {
        setLoading(false);
        if (error.response.status === 404) {
          console.log('No songs found');
          setSongResults([]);
        } else if (error.response.status === 500 || error.response.status === 401) {
          // Handle 500 or 401 errors as needed
        }
      } else {
        console.log('An unexpected error occurred:', error);
      }
    }
  }, [filterData, page]);

  // handle get songs or end scroll
  const handleScroll = useCallback(() => {
    const searchDisplayBox = document.getElementById('search-display');
    if (searchDisplayBox) {
      const { scrollTop, scrollHeight, clientHeight } = searchDisplayBox;
      const isAtBottom = scrollTop + clientHeight >= scrollHeight - 5;
      if (isAtBottom && timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (!loading && isAtBottom && page < totalPages) {
        timeoutRef.current = setTimeout(() => {
          setPage((prevPage) => prevPage + 1);
        }, 300);
        searchDisplayBox.scrollTop = scrollTop - 30;
      }
    }
  }, [loading, page, totalPages]);

  // Folder Options for User
  const getFolderOptions = useCallback(async () => {
    try {
      const { data, status } = await axios.get<SetlistFolder[]>('/api/groups/get');
      if (status === 200) {
        const filteredFolders = data.filter((folder) =>
          ownership.groupIds.some((group) => group.id === folder._id)
        );
        setFolderOptions(filteredFolders);
      }
    } catch (e) {
      console.log(e);
    }
  }, [ownership]);

  // Fetch setlist data for editing
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
    getSongResults();
    getSetlist();
    getFolderOptions();
  }, [getSetlist, getFolderOptions, getSongResults]);

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

  // useEffect for scrolling
  useEffect(() => {
    const searchDisplayBox = document.getElementById('search-display');
    if (searchDisplayBox) {
      searchDisplayBox.addEventListener('scroll', handleScroll);
    }
    return () => {
      if (searchDisplayBox) {
        searchDisplayBox.removeEventListener('scroll', handleScroll);
      }
    };
  }, [loading, page, totalPages, handleScroll]);

  useEffect(() => {
    if (page > 1) getSongResults();
  }, [page, getSongResults]);

  // Form submission
  const handleSaveSetlist: SubmitHandler<SetlistEditorFields> = async (data) => {
    try {
      const isEditSetlist = action === 'edit';

      // Get updated folder IDs
      const updatedSetlistFolderIds: string[] = folderOptions
        .filter((folder) => folderList.includes(folder.groupName))
        .map((folder) => folder._id);

      // Create/update setlist
      const payload = await (isEditSetlist
        ? axios.put('/api/setlists/update', {
            id: setlistId,
            name: data.name,
            date: date ? date.toDate() : null,
            songs: addedSongList,
            groupIds: updatedSetlistFolderIds,
          })
        : axios.post('/api/setlists/create', {
            name: data.name,
            date: date ? date.toDate() : null,
            songs: addedSongList,
            groupIds: updatedSetlistFolderIds,
            createdBy: ownership.userId,
          }));

      if (payload.status !== 200) {
        throw new Error('Failed to save setlist');
      }

      const savedSetlistId = payload.data._id;

      // Prepare all update promises
      const promises: Promise<any>[] = [];

      // Add ownership update if needed
      const isOwnedSetlist = ownership.setlistIds.some(
        (setlist) => setlist.id === payload.data._id
      );

      if (!isOwnedSetlist) {
        promises.push(
          axios.put('/api/ownerships/update', {
            ...ownership,
            setlistIds: [
              ...ownership.setlistIds,
              {
                id: payload.data._id,
                name: payload.data.name,
                createdAt: payload.data.createdAt,
              },
            ],
          })
        );
      }

      // Add folder update promises
      if (isEditSetlist && setlist) {
        const originalFolderIds = setlist.groupIds || [];
        const foldersToAdd = updatedSetlistFolderIds.filter(
          (id) => !originalFolderIds.includes(id)
        );
        const foldersToRemove = originalFolderIds.filter(
          (id) => !updatedSetlistFolderIds.includes(id)
        );

        // Helper function to update folder
        const updateFolder = (folderId: string, shouldAdd: boolean) => {
          const folder = folderOptions.find((f) => f._id === folderId);
          if (!folder) return Promise.resolve();

          const currentSetlistIds = folder.setlistIds || [];
          const newSetlistIds = shouldAdd
            ? [...currentSetlistIds, savedSetlistId]
            : currentSetlistIds.filter((id) => id !== savedSetlistId);

          return axios.put('/api/groups/update', {
            id: folderId,
            setlistIds: newSetlistIds,
          });
        };

        // Add folder update promises
        promises.push(
          ...foldersToAdd.map((folderId) => updateFolder(folderId, true)),
          ...foldersToRemove.map((folderId) => updateFolder(folderId, false))
        );
      } else if (!isEditSetlist) {
        // For new setlists, just add to all selected folders
        const folderUpdatePromises = updatedSetlistFolderIds
          .map((folderId) => {
            const folder = folderOptions.find((f) => f._id === folderId);
            return folder
              ? axios.put('/api/groups/update', {
                  id: folderId,
                  setlistIds: [...(folder.setlistIds || []), savedSetlistId],
                })
              : Promise.resolve();
          })
          .filter(Boolean);

        promises.push(...folderUpdatePromises);
      }

      // Execute all updates
      if (promises.length > 0) {
        const results = await Promise.all(promises);
        const allSuccessful = results.every((res) => res?.status === 200);

        if (!allSuccessful) {
          console.warn('Some updates failed, but setlist was saved');
        }
      }

      // Success - clear errors and redirect
      setInvalidSetlist('');
      setSuccessSnackbarOpen(true);
      navigate('/setlist');
    } catch (error: any) {
      console.error('Error saving setlist:', error);
      setInvalidSetlist(error.response?.data || 'Error saving setlist');
      setSuccessSnackbarOpen(false);
    }
  };

  // Navigate to the previous page on cancel
  const handleCancel = () => {
    navigate(-1);
  };

  // Song management
  const handleAddSong = useCallback(
    (songId: string) => {
      const existingSongIndex = addedSongList.findIndex((song) => song._id === songId);

      if (existingSongIndex >= 0) {
        // Remove song and update sequences
        const removedSong = addedSongList[existingSongIndex];
        const updatedList = addedSongList
          .filter((_, index) => index !== existingSongIndex)
          .map((song) => ({
            ...song,
            sequence: song.sequence! > removedSong.sequence! ? song.sequence! - 1 : song.sequence!,
          }));

        setAddedSongList(updatedList);
      } else {
        // Add new song
        const songToAdd = songResults.find((song) => song._id === songId);
        if (!songToAdd) return;

        const newSong: SongSetlistSchema = {
          ...songToAdd,
          key: songToAdd.originalKey,
          sequence: addedSongList.length + 1,
        };

        setAddedSongList((prev) => [...prev, newSong]);
      }

      // Close drawer on mobile after adding song
      if (isMobileOrSmallTablet) {
        setDrawerOpen(false);
      }
    },
    [addedSongList, songResults, isMobileOrSmallTablet]
  );

  const addedSongIds = addedSongList.map((song) => song._id);

  // TODO-YY: Song Filtering
  const [isFilterDrawerToggled, setIsFilterDrawerToggled] = useState<boolean>(false);

  const handleToggleFilterDrawer = () => setIsFilterDrawerToggled(!isFilterDrawerToggled);

  return (
    <>
      <MainContainer isMobileOrSmallTablet={isMobileOrSmallTablet}>
        <ContentWrapper>
          {errorMessage && (
            <Typography variant="body2" color="error" sx={{ mb: 2 }}>
              {errorMessage}
            </Typography>
          )}

          <SuccessSnackbar
            open={successSnackbarOpen}
            onClose={() => setSuccessSnackbarOpen(false)}
          />

          <form
            onSubmit={handleSubmit(handleSaveSetlist)}
            style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
          >
            <PageHeader
              title={`${action === 'edit' ? 'Edit' : 'New'} Setlist`}
              icon={<QueueMusic />}
              actionButtons={!isMobileOrSmallTablet && <ActionButtons onCancel={handleCancel} />}
            />

            <SectionsContainer isMobileOrSmallTablet={isMobileOrSmallTablet}>
              {/* Setlist Details Section */}
              <SetlistDetailsSection
                control={control}
                errors={errors}
                date={date}
                onDateChange={setDate}
                folderOptions={folderOptions}
                folderList={folderList}
                onFolderChange={setFolderList}
                register={register}
                addedSongList={addedSongList}
                setAddedSongList={setAddedSongList}
                isMobileOrSmallTablet={isMobileOrSmallTablet}
              />

              {/* Song Search/List Section */}
              {isMobileOrSmallTablet ? (
                <MobileSongList>
                  <HeaderWithIcon
                    Icon={MusicNote}
                    headerText="Songs"
                    headerVariant="h3"
                    iconColor="secondary.main"
                    headerColor="secondary.main"
                  />
                  <AddSongsSection>
                    <AddSongsButton
                      variant="outlined"
                      color="secondary"
                      startIcon={<AddCircleOutline />}
                      onClick={() => setDrawerOpen(true)}
                    >
                      Add Songs
                    </AddSongsButton>
                  </AddSongsSection>
                  <SetlistSongsTable songList={addedSongList} setSongList={setAddedSongList} />
                </MobileSongList>
              ) : (
                <SongSearchSection
                  searchString={searchString}
                  onSearchChange={setSearchString}
                  songResults={songResults}
                  isMobileOrSmallTablet={isMobileOrSmallTablet}
                  isTablet={isTablet}
                  onAddSong={handleAddSong}
                  addedSongIds={addedSongIds}
                  isFilterDrawerToggled={isFilterDrawerToggled}
                  handleToggleFilterDrawer={handleToggleFilterDrawer}
                />
              )}
            </SectionsContainer>
          </form>

          {/* Mobile Drawer for Song Search */}
          {isMobileOrSmallTablet && (
            <Drawer
              anchor="bottom"
              open={drawerOpen}
              onClose={() => setDrawerOpen(false)}
              PaperProps={{
                sx: {
                  height: '100%',
                  bgcolor: '#171717',
                },
              }}
            >
              <DrawerContent>
                <DrawerBody>
                  <SongSearchSection
                    searchString={searchString}
                    onSearchChange={setSearchString}
                    songResults={songResults}
                    isMobileOrSmallTablet={isMobileOrSmallTablet}
                    isTablet={isTablet}
                    onAddSong={handleAddSong}
                    addedSongIds={addedSongIds}
                    isFilterDrawerToggled={isFilterDrawerToggled}
                    showHeader={false}
                    handleToggleFilterDrawer={handleToggleFilterDrawer}
                  />
                </DrawerBody>
                <StyledButton
                  color="secondary"
                  variant="contained"
                  onClick={() => setDrawerOpen(false)}
                >
                  Done
                </StyledButton>
              </DrawerContent>
            </Drawer>
          )}
        </ContentWrapper>

        {isMobileOrSmallTablet && <MobileActionButtons onCancel={handleCancel} />}
      </MainContainer>
    </>
  );
};

// Success Snackbar Component
const SuccessSnackbar: FC<{ open: boolean; onClose: () => void }> = ({ open, onClose }) => (
  <Snackbar
    open={open}
    onClose={onClose}
    autoHideDuration={6000}
    TransitionComponent={Fade}
    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
  >
    <Alert severity="success" onClose={onClose}>
      <AlertTitle>Success</AlertTitle>
      Setlist successfully saved!
    </Alert>
  </Snackbar>
);

// Action Buttons Component
const ActionButtons: FC<{ onCancel: () => void }> = ({ onCancel }) => (
  <Stack direction="row">
    <CancelButton color="secondary" onClick={onCancel}>
      Cancel
    </CancelButton>
    <StyledButton type="submit" color="secondary" variant="contained">
      Save
    </StyledButton>
  </Stack>
);

// Mobile Action Buttons component
const MobileActionButtons: FC<{ onCancel: () => void }> = ({ onCancel }) => (
  <MobileActionButtonsContainer>
    <Stack direction="row" spacing={2} px={2} width={'100%'}>
      <Button
        sx={{
          width: '50%',
          color: 'secondary.main',
          border: '1px solid #938F99',
          borderRadius: '40px',
          textTransform: 'none',
        }}
        onClick={onCancel}
      >
        Cancel
      </Button>
      <Button
        type="submit"
        form="setlist-form"
        sx={{
          width: '50%',
          backgroundColor: 'secondary.main',
          color: '#381E72',
          borderRadius: '40px',
          textTransform: 'none',
        }}
      >
        Save
      </Button>
    </Stack>
  </MobileActionButtonsContainer>
);

// Unified Setlist Details Section
const SetlistDetailsSection: FC<{
  control: any;
  errors: any;
  date: Dayjs | null;
  onDateChange: (date: Dayjs | null) => void;
  folderOptions: SetlistFolder[];
  folderList: string[];
  onFolderChange: (folders: string[]) => void;
  register: any;
  addedSongList: SongSetlistSchema[];
  setAddedSongList: React.Dispatch<React.SetStateAction<SongSetlistSchema[]>>;
  isMobileOrSmallTablet: boolean;
}> = ({
  control,
  errors,
  date,
  onDateChange,
  folderOptions,
  folderList,
  onFolderChange,
  register,
  addedSongList,
  setAddedSongList,
  isMobileOrSmallTablet,
}) => (
  <SetlistDetailsBox isMobileOrSmallTablet={isMobileOrSmallTablet}>
    <SetlistDetailsContent isMobileOrSmallTablet={isMobileOrSmallTablet} direction="column">
      <HeaderWithIcon
        Icon={Info}
        headerText="Details"
        headerVariant="h3"
        iconColor="secondary.main"
        headerColor="secondary.main"
      />

      <Controller
        name="name"
        control={control}
        defaultValue=""
        render={({ field }) => (
          <TextField
            id="name"
            label="Title"
            error={!!errors.name}
            helperText={errors?.name?.message}
            {...field}
          />
        )}
      />

      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="en">
        <DatePicker label="Date" value={date} onChange={onDateChange} />
      </LocalizationProvider>

      <FormControl fullWidth>
        <AutocompleteInput
          id="folders"
          options={folderOptions.map((folder) => folder.groupName)}
          label="Folders"
          autoComplete="folders"
          value={folderList}
          onChange={(_, newValue) => onFolderChange(newValue as string[])}
          register={register}
          multiple
        />
      </FormControl>

      {/* Desktop/Tablet Song List */}
      {!isMobileOrSmallTablet && (
        <Box pt={3} sx={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <Stack direction="column" spacing={'1rem'} sx={{ height: '100%' }}>
            <HeaderWithIcon
              Icon={MusicNote}
              headerText="Songs"
              headerVariant="h3"
              iconColor="secondary.main"
              headerColor="secondary.main"
            />
            <Box sx={{ flex: 1, overflow: 'auto' }}>
              <SetlistSongsTable songList={addedSongList} setSongList={setAddedSongList} />
            </Box>
          </Stack>
        </Box>
      )}
    </SetlistDetailsContent>
  </SetlistDetailsBox>
);

// Song Search Section Component
const SongSearchSection: FC<{
  searchString: string;
  onSearchChange: (value: string) => void;
  songResults: SongSchema[];
  isMobileOrSmallTablet: boolean;
  isTablet: boolean;
  onAddSong: (id: string) => void;
  addedSongIds: string[];
  showHeader?: boolean;
  isFilterDrawerToggled: boolean;
  handleToggleFilterDrawer: () => void;
}> = ({
  searchString,
  onSearchChange,
  songResults,
  isMobileOrSmallTablet,
  isTablet,
  onAddSong,
  addedSongIds,
  isFilterDrawerToggled,
  handleToggleFilterDrawer,
  showHeader = true,
}) => (
  <SongSearchBox isMobileOrSmallTablet={isMobileOrSmallTablet} isTablet={isTablet}>
    <SongSearchContent>
      {
        <HeaderWithIcon
          Icon={AddCircleOutline}
          headerText={isMobileOrSmallTablet ? 'Add Songs' : 'Search to Add Songs'}
          headerVariant="h3"
          iconColor="secondary.main"
          headerColor="secondary.main"
        />
      }

      <SongSearchStack>
        <SearchInputComponent
          searchString={searchString}
          onSearchChange={onSearchChange}
          isFilterDrawerToggled={isFilterDrawerToggled}
          handleToggleFilterDrawer={handleToggleFilterDrawer}
        />

        <SongResultsContainer id="search-display">
          {songResults.length > 0 ? (
            songResults.map((song) => (
              <SongCardComponent
                key={song._id}
                song={song}
                isMobileOrSmallTablet={isMobileOrSmallTablet}
                onAddSong={onAddSong}
                isAdded={addedSongIds.includes(song._id)}
              />
            ))
          ) : (
            <Typography>No songs found for "{searchString}"</Typography>
          )}
        </SongResultsContainer>
      </SongSearchStack>
    </SongSearchContent>
  </SongSearchBox>
);

// Search Input Component
const SearchInputComponent: FC<{
  searchString: string;
  onSearchChange: (value: string) => void;
  isFilterDrawerToggled: boolean;
  handleToggleFilterDrawer: () => void;
}> = ({ searchString, onSearchChange, isFilterDrawerToggled, handleToggleFilterDrawer }) => (
  <SearchContainer>
    <SearchIcon />
    <SongSearchInput
      placeholder="Search songs..."
      value={searchString}
      fullWidth
      onChange={(e) => onSearchChange(e.target.value)}
    />
    <FilterIconButton
      isFilterDrawerToggled={isFilterDrawerToggled}
      onClick={handleToggleFilterDrawer}
    >
      <TuneOutlined sx={{ fontSize: '20px' }} />
    </FilterIconButton>
  </SearchContainer>
);

// Song Card Component
const SongCardComponent: FC<{
  song: SongSchema;
  isMobileOrSmallTablet: boolean;
  onAddSong: (id: string) => void;
  isAdded: boolean;
}> = ({ song, isMobileOrSmallTablet, onAddSong, isAdded }) => {
  const { _id, title, artist, themes, tempo, originalKey, year, code, timeSignature } = song;

  const songData = { themes, tempo, originalKey, year, code, timeSignature };

  return (
    <SongCard disableGutters>
      <SongCardHeader direction="row">
        <Stack>
          <Typography variant="h4" color="secondary.main">
            {title}
          </Typography>
          <Typography variant="subtitle2" color="secondary.main">
            {artist}
          </Typography>
        </Stack>

        <AddSongButton isAdded={isAdded} onClick={() => onAddSong(_id)} />
      </SongCardHeader>

      <SongDetailsComponent data={songData} isMobileOrSmallTablet={isMobileOrSmallTablet} />
    </SongCard>
  );
};

// Add Song Button Component
const AddSongButton: FC<{ isAdded: boolean; onClick: () => void }> = ({ isAdded, onClick }) => (
  <AddButton onClick={onClick} isAdded={isAdded}>
    {isAdded ? <Check sx={{ fontSize: '20px' }} /> : <Add sx={{ fontSize: '20px' }} />}
  </AddButton>
);

// Song Details Component
const SongDetailsComponent: FC<{ data: Record<string, any>; isMobileOrSmallTablet: boolean }> = ({
  data,
  isMobileOrSmallTablet,
}) => (
  <SongDetails direction={isMobileOrSmallTablet ? 'column' : 'row'}>
    {SONG_CARD_FIELDS.map((field) => (
      <SongDetailField
        key={field.key}
        label={field.label}
        value={data[field.key]}
        isMobileOrSmallTablet={isMobileOrSmallTablet}
      />
    ))}
  </SongDetails>
);

// Song Detail Field Component
const SongDetailField: FC<{
  label: string;
  value: any;
  isMobileOrSmallTablet: boolean;
}> = ({ label, value, isMobileOrSmallTablet }) => (
  <DetailField spacing={'0.5rem'} mr={isMobileOrSmallTablet ? 0 : '1rem'} direction={'row'}>
    <Typography variant="body2" color="#9E9E9E" minWidth="fit-content">
      {label}
    </Typography>
    {Array.isArray(value) ? (
      <SongFieldArray data={value} />
    ) : (
      <Typography variant="body2" color="#CCC2DC" align="left" noWrap>
        {value ?? '-'}
      </Typography>
    )}
  </DetailField>
);

export default SetlistEditorContainer;
