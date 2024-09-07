import { SetlistSongCardProps } from '../../types/setlist.types';
import { Add, Check } from '@mui/icons-material';
import { Typography, Stack, Container, IconButton, Grid } from '@mui/material';
import SongFieldArray from '../song/SongFieldArray';
import { CardFields } from '../../constants';

const SetlistSongCard = (props: SetlistSongCardProps) => {
  const {
    _id,
    title,
    tempo,
    originalKey,
    themes,
    artist,
    year,
    timeSignature,
    code,
    filterData,
    showDetails,
    isDesktop,
    handleAddSong,
    addedSongs,
  } = props;

  const displayData = [
    filterData?.display?.themes ?? true,
    filterData?.display?.tempo ?? true,
    filterData?.display?.originalKey ?? true,
    filterData?.display?.year ?? true,
    filterData?.display?.code ?? true,
    filterData?.display?.timeSignature ?? true,
  ];
  const fieldData = [themes, tempo, originalKey, year, code, timeSignature];

  return (
    <Container
      disableGutters
      sx={{
        borderRadius: '8px',
        border: 1,
        borderColor: '#49454F',
        backgroundColor: 'primary.darkest',
        p: '1rem',
        '&:hover': {
          borderColor: 'secondary.main',
          cursor: 'pointer',
        },
        transition: 'all 0.1s ease-in-out',
        maxWidth: '100%',
      }}
    >
      <Stack
        direction="row"
        display="flex"
        justifyContent="space-between"
        minWidth={'100%'}
        maxWidth={'100%'}
        p={0}
        mb="1rem"
      >
        {/* song title and artist*/}
        <Stack>
          <Typography variant="h4" color={'secondary.main'}>
            {title}
          </Typography>
          <Typography variant="subtitle2" color={'secondary.main'}>
            {artist}
          </Typography>
        </Stack>

        {/* add song to setlist button */}
        <IconButton
          onClick={() => handleAddSong(_id)}
          sx={{
            width: '40px',
            height: '40px',
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
          className={addedSongs.includes(_id) ? 'Mui-selected' : ''}
        >
          {addedSongs.includes(_id) ? <Check /> : <Add />}
        </IconButton>
      </Stack>

      {/* song fields and tags */}
      <Stack
        direction={isDesktop ? 'row' : 'column'}
        maxWidth={'100%'}
        flexWrap="wrap"
        rowGap={'0.5rem'}
      >
        {CardFields &&
          showDetails !== false &&
          CardFields.map((field, i) => {
            return (
              displayData[i] && (
                <Stack
                  direction="row"
                  display="flex"
                  key={i}
                  spacing={1}
                  width="fit-content"
                  maxWidth="100%"
                  alignItems={'center'}
                  justifyContent={'flex-start'}
                  mr={isDesktop ? '1.25rem' : 1}
                >
                  <Typography variant="body2" color="#9E9E9E" minWidth={'fit-content'}>
                    {field}
                  </Typography>
                  {Array.isArray(fieldData[i]) ? (
                    <SongFieldArray data={fieldData[i]} />
                  ) : (
                    <Typography variant="body2" color={'#CCC2DC'} align="left" noWrap>
                      {fieldData[i] ?? '-'}
                    </Typography>
                  )}
                </Stack>
              )
            );
          })}
      </Stack>
    </Container>
  );
};

export default SetlistSongCard;
