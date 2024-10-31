import { FC, ReactElement, useCallback, useEffect, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import axios from 'axios';
import { SongEditorFields, SongEditorProps, SongSchema } from '../../types/song.types';
import {
  musicKeysOptions,
  tempoOptions,
  timeSignatureOptions,
  themeOptions,
} from '../../constants';
import SongHelpDialog from './SongHelpDialog';
import {
  Box,
  Container,
  useMediaQuery,
  Typography,
  Grid,
  TextField,
  Stack,
  TextareaAutosize,
  FormControl,
  Toolbar,
  Button,
  Alert,
  AlertTitle,
  Snackbar,
  Fade,
  Chip,
  Autocomplete,
} from '@mui/material';

// ICONS
import InfoIcon from '@mui/icons-material/Info';
import LibraryMusicIcon from '@mui/icons-material/LibraryMusic';
import AutocompleteInput from '../custom/AutocompleteInput';
import { useNavigate } from 'react-router-dom';
import { MusicNote } from '@mui/icons-material';
import PageHeader from '../navigation/PageHeader';
import HeaderWithIcon from '../custom/HeaderWithIcon';

const SongEditorContainer: FC<SongEditorProps> = () => {
  // hook to detect the window size
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const navigate = useNavigate();

  // STATES
  const [action, setAction] = useState<string>('new');

  const [tempoList, setTempoList] = useState<string[]>([]);
  const [disabledTempo, setDisabledTempo] = useState<string[]>(tempoOptions);
  const [themeList, setThemeList] = useState<string[]>([]);
  const [disabledTheme, setDisabledTheme] = useState<string[]>(themeOptions);
  const [timeSignatureList, setTimeSignatureList] = useState<string[]>([]);
  const [recommendedKeys, setRecommendedKeys] = useState<string[]>([]);

  const [successSnackbarOpen, setSuccessSnackbarOpen] = useState<boolean>(false);
  const [invalidSong, setInvalidSong] = useState<string>('');

  const paths: string[] = window.location.pathname.split('/');

  const [song, setSong] = useState<SongSchema>({} as SongSchema);
  const [songId, setSongId] = useState<string>('');

  useEffect(() => {
    if (paths.includes('edit')) {
      setAction('edit');
      setSongId(paths[paths.length - 1]);
    }
  }, [paths]);

  const getSong = useCallback(async () => {
    if (songId === '') return;

    try {
      const { data, status } = await axios.get(`/api/songs/get?id=${songId}`);
      if (status === 200) {
        setSong(data);
      }
    } catch (error) {
      console.log(error);
    }
  }, [songId]);

  useEffect(() => {
    getSong();
  }, [getSong]);

  // FORM HANDLER
  const { register, handleSubmit, formState, reset, control } = useForm<SongEditorFields>();
  const { errors } = formState;

  useEffect(() => {
    if (song && Object.keys(song).length > 0) {
      setTempoList(song.tempo);
      setDisabledTempo(tempoOptions.filter((tempo) => !song.tempo.includes(tempo)));
      setThemeList(song.themes);
      setDisabledTheme(themeOptions.filter((theme) => !song.themes.includes(theme)));
      setTimeSignatureList(song.timeSignature);
      setRecommendedKeys(song.recommendedKeys || []);
      reset({
        artist: song.artist,
        title: song.title,
        year: song.year,
        code: song.code,
        chordLyrics: song.chordLyrics,
        simplifiedChordLyrics: song.simplifiedChordLyrics,
        originalKey: song.originalKey,
      });
    }
  }, [song]);

  // editor mode is either NEW or EDIT. default is NEW
  const editorMode = (actionOnEditor: string): ReactElement => {
    return (
      <Typography variant="h3" color="white" sx={{ flexGrow: 1 }} gap={1} mx={2}>
        {actionOnEditor === 'edit' ? 'Edit Song' : 'New Song'}
      </Typography>
    );
  };

  const handleSaveSong: SubmitHandler<SongEditorFields> = async (data) => {
    try {
      let payload;
      if (action === 'edit') {
        payload = await axios.put('/api/songs/update', {
          id: songId,
          artist: data.artist,
          title: data.title,
          themes: themeList,
          tempo: tempoList,
          year: data.year,
          code: data.code,
          timeSignature: timeSignatureList,
          simplifiedChordLyrics: data.simplifiedChordLyrics,
          originalKey: data.originalKey,
          recommendedKeys: recommendedKeys,
          chordLyrics: data.chordLyrics,
        });
      } else {
        payload = await axios.post('/api/songs/create', {
          artist: data.artist,
          title: data.title,
          themes: themeList,
          tempo: tempoList,
          year: data.year,
          code: data.code,
          timeSignature: timeSignatureList,
          simplifiedChordLyrics: data.simplifiedChordLyrics,
          originalKey: data.originalKey,
          recommendedKeys: recommendedKeys,
          chordLyrics: data.chordLyrics,
        });
      }

      if (payload.status === 200) {
        setInvalidSong('');
        setSuccessSnackbarOpen(true);
        navigate(`/song/${songId}`);
        return payload.data;
      }

      handleCloseSuccessSnackbar();
      setInvalidSong('Error saving song!');
      return;
    } catch (error: any) {
      setInvalidSong(error.response.data);
      handleCloseSuccessSnackbar();
      console.log(error);
    }
  };

  const handleCloseSuccessSnackbar = () => {
    setSuccessSnackbarOpen(false);
  };

  const handleDeleteTempo = (chipToDelete: string) => () => {
    setTempoList((chips) => chips.filter((chip) => chip !== chipToDelete));
    setDisabledTempo((prevDisabledChips) => [...prevDisabledChips, chipToDelete]);
  };

  const handleReactivateTempo = (chipToActivate: string) => () => {
    setTempoList((prevTempoList) => [...prevTempoList, chipToActivate]);
    setDisabledTempo((prevDisabledChips) =>
      prevDisabledChips.filter((chip) => chip !== chipToActivate)
    );
  };

  const handleDeleteTheme = (chipToDelete: string) => () => {
    setThemeList((chips) => chips.filter((chip) => chip !== chipToDelete));
    setDisabledTheme((prevDisabledChips) => [...prevDisabledChips, chipToDelete]);
  };

  const handleReactivateTheme = (chipToActivate: string) => () => {
    setThemeList((prevTempoList) => [...prevTempoList, chipToActivate]);
    setDisabledTheme((prevDisabledChips) =>
      prevDisabledChips.filter((chip) => chip !== chipToActivate)
    );
  };

  return (
    <Container sx={{ py: '1rem', px: '2rem', height: '100%', minWidth: '100%', overflow: 'auto' }}>
      {/* TODO: Mobile view */}
      <Box display={{ base: 'block', md: 'none' }}>
        <Toolbar sx={{ width: '100%' }}>{editorMode(action)}</Toolbar>

        <Box>
          {/* Error message */}
          {invalidSong ? (
            <Typography variant={'body2'} color={'error'}>
              {invalidSong}
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

          <form onSubmit={handleSubmit(handleSaveSong)}>
            {/* fields */}

            {/* buttons */}
            <Button
              fullWidth
              type={'submit'}
              color="secondary"
              variant="contained"
              sx={{
                my: 1,
                textTransform: 'none',
                borderRadius: '100px',
              }}
            >
              Save
            </Button>
            <Button
              fullWidth
              color={'secondary'}
              sx={{
                textTransform: 'none',
                borderRadius: '100px',
                border: 1,
              }}
              onClick={() => navigate('/song')}
            >
              Cancel
            </Button>
          </form>
        </Box>
      </Box>
      {/* Desktop view */}
      <Box display={isDesktop ? 'block' : 'none'}>
        <form onSubmit={handleSubmit(handleSaveSong)}>
          <PageHeader
            title={action === 'edit' ? 'Edit Song' : 'New Song'}
            icon={<MusicNote />}
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
                  onClick={() => navigate('/song')}
                >
                  Cancel
                </Button>
              </Stack>
            }
          />

          <Box my={'24px'}>
            {/* Error message */}
            {invalidSong ? (
              <Typography variant={'body2'} color={'error'}>
                {invalidSong}
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

            <Stack direction={['row']} spacing={8} mt={2}>
              {/* column 1: Song Details */}
              <Box width={'35vw'}>
                <Stack direction="column" spacing={2}>
                  {/* header */}
                  <HeaderWithIcon
                    headerText={'Song Details'}
                    headerVariant={'h4'}
                    iconColor={'secondary.main'}
                    headerColor={'secondary.main'}
                    Icon={InfoIcon}
                  />

                  {/* Song Title Field */}
                  <Controller
                    name="title"
                    control={control}
                    defaultValue=""
                    rules={{ required: 'Song title is required' }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        id="title"
                        label="Song Title"
                        variant="outlined"
                        fullWidth
                      />
                    )}
                  />

                  {/* Artist Field */}
                  <Controller
                    name="artist"
                    control={control}
                    defaultValue=""
                    rules={{ required: 'Artist name is required' }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        id="artist"
                        label="Artist Name"
                        variant="outlined"
                        fullWidth
                      />
                    )}
                  />

                  {/* Themes field */}
                  <FormControl fullWidth>
                    <Box>
                      <Typography variant="h4" sx={{ pb: 1 }}>
                        Themes
                      </Typography>
                      {themeOptions.map((item) => (
                        <Chip
                          sx={{
                            backgroundColor: disabledTheme.includes(item)
                              ? 'secondary.lighter'
                              : 'primary.dark',
                            borderRadius: '8px',
                            m: 0.5,
                          }}
                          key={item}
                          label={item}
                          onDelete={
                            disabledTheme.includes(item) ? undefined : handleDeleteTheme(item)
                          }
                          onClick={
                            disabledTheme.includes(item) ? handleReactivateTheme(item) : undefined
                          }
                        />
                      ))}
                    </Box>
                  </FormControl>

                  {/* Tempo field */}
                  <FormControl fullWidth>
                    <Box>
                      <Typography variant="h4" sx={{ pb: 1 }}>
                        Tempo
                      </Typography>
                      {tempoOptions.map((item) => (
                        <Chip
                          sx={{
                            backgroundColor: disabledTempo.includes(item)
                              ? 'secondary.lighter'
                              : 'primary.dark',
                            borderRadius: '8px',
                            m: 0.5,
                          }}
                          key={item}
                          label={item}
                          onDelete={
                            disabledTempo.includes(item) ? undefined : handleDeleteTempo(item)
                          }
                          onClick={
                            disabledTempo.includes(item) ? handleReactivateTempo(item) : undefined
                          }
                        />
                      ))}
                    </Box>
                  </FormControl>

                  {/* Time Signature field */}
                  <FormControl fullWidth>
                    <AutocompleteInput
                      id="time-signature"
                      options={timeSignatureOptions}
                      label="Time Signature"
                      autoComplete="time-signature"
                      value={timeSignatureList}
                      onChange={(_, newValue) => {
                        setTimeSignatureList(newValue as string[]);
                      }}
                      register={register}
                      multiple
                    />
                  </FormControl>

                  {/* Original Key field */}
                  <FormControl fullWidth>
                    <Controller
                      name="originalKey"
                      control={control}
                      defaultValue=""
                      rules={{ required: 'Original key is required' }}
                      render={({ field }) => (
                        <Autocomplete
                          {...field}
                          id="original-key"
                          options={musicKeysOptions}
                          getOptionLabel={(option) => option}
                          filterSelectedOptions
                          value={field.value || null}
                          onChange={(event, newValue) => field.onChange(newValue)}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              variant="outlined"
                              label="Original Key"
                              error={!!errors.originalKey}
                              helperText={errors?.originalKey?.message}
                            />
                          )}
                        />
                      )}
                    />
                  </FormControl>

                  {/* Recommended Keys field */}
                  <FormControl fullWidth>
                    <AutocompleteInput
                      id="recommended-keys"
                      options={musicKeysOptions}
                      label="Recommended Keys"
                      autoComplete="recommended-keys"
                      value={recommendedKeys}
                      onChange={(_, newValue) => {
                        setRecommendedKeys(newValue as string[]);
                      }}
                      register={register}
                      multiple
                    />
                  </FormControl>

                  {/* Year field */}
                  <Controller
                    name="year"
                    control={control}
                    defaultValue={''}
                    rules={{ required: 'Year is required' }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        id="year"
                        label="Year"
                        type="number"
                        error={!!errors.year}
                        helperText={errors?.year?.message}
                        variant="outlined"
                        fullWidth
                      />
                    )}
                  />

                  {/* Code field */}
                  <Controller
                    name="code"
                    control={control}
                    defaultValue=""
                    rules={{ required: 'Code is required' }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        id="code"
                        label="Code"
                        error={!!errors.code}
                        helperText={errors?.code?.message}
                        variant="outlined"
                        fullWidth
                      />
                    )}
                  />
                </Stack>
              </Box>

              {/* column 2: Lyrics & Chords */}
              <Box width="100%">
                <Stack direction="column" spacing={2}>
                  <Grid
                    container
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <HeaderWithIcon
                      headerText={'Lyrics & Chords'}
                      headerVariant={'h4'}
                      iconColor={'secondary.main'}
                      headerColor={'secondary.main'}
                      Icon={LibraryMusicIcon}
                    />
                    <SongHelpDialog />
                  </Grid>

                  <Controller
                    name="chordLyrics"
                    control={control}
                    defaultValue=""
                    rules={{ required: 'Chord lyrics are required' }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        id="chord-lyrics"
                        placeholder="Enter lyrics & chords here"
                        multiline
                        error={!!errors.chordLyrics}
                        helperText={errors?.chordLyrics?.message}
                        InputProps={{
                          inputComponent: TextareaAutosize,
                          inputProps: {
                            minRows: 20,
                            style: {
                              resize: 'vertical',
                            },
                          },
                        }}
                        variant="outlined"
                        fullWidth
                      />
                    )}
                  />

                  <Grid
                    container
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <HeaderWithIcon
                      headerText={'Lyrics & Simplified Chords (Optional)'}
                      headerVariant={'h4'}
                      iconColor={'secondary.main'}
                      headerColor={'secondary.main'}
                      Icon={LibraryMusicIcon}
                    />
                    <SongHelpDialog />
                  </Grid>

                  <Controller
                    name="simplifiedChordLyrics"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <TextField
                        {...field}
                        id="simplified-chord-lyrics"
                        placeholder="Enter lyrics & simplified chords here"
                        multiline
                        error={!!errors.simplifiedChordLyrics}
                        helperText={errors?.simplifiedChordLyrics?.message}
                        InputProps={{
                          inputComponent: TextareaAutosize,
                          inputProps: {
                            minRows: 20,
                            style: {
                              resize: 'vertical',
                            },
                          },
                        }}
                        variant="outlined"
                        fullWidth
                      />
                    )}
                  />
                </Stack>
              </Box>
            </Stack>
          </Box>
        </form>
      </Box>
    </Container>
  );
};

export default SongEditorContainer;
