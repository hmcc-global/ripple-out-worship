import { Box, Container, Stack, Typography, Grid } from '@mui/material';
import { SongCardProps, SongSchema } from '../../types/song.types';
import { CardFields } from '../../constants';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import VisibilityIcon from '@mui/icons-material/Visibility';
import SongFieldArray from './SongFieldArray';
import SongPreviewModal from '../utility/SongPreviewModal';

const SongCard = (props: SongCardProps) => {
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
    chordLyrics,
    firstLine,
    filterData,
    showDetails,
    isDesktop,
  } = props;

  const displayData = [
    filterData?.display?.themes ?? true,
    filterData?.display?.tempo ?? true,
    filterData?.display?.originalKey ?? true,
    filterData?.display?.year ?? true,
    filterData?.display?.code ?? true,
    filterData?.display?.timeSignature ?? true,
    filterData?.display?.firstLine ?? true,
  ];
  const fieldData = [themes, tempo, originalKey, year, code, timeSignature, firstLine];
  const navigate = useNavigate();

  // state for the modal
  const [modalOpen, setModalOpen] = useState(false);
  const handleOpen = () => setModalOpen(true);
  const handleClose = () => setModalOpen(false);

  return (
    <>
      <Container
        onClick={() => navigate(`/song/${_id}`)}
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
          <Stack>
            <Typography variant="h4" color={'secondary.main'}>
              {title}
            </Typography>
            <Typography variant="subtitle2" color={'secondary.main'}>
              {artist}
            </Typography>
          </Stack>
          <>
            <Box sx={{ height: '30px', width: '30px' }}>
              <VisibilityIcon
                onClick={(event: any) => {
                  event.stopPropagation();
                  modalOpen ? handleClose() : handleOpen();
                }}
                // onMouseLeave={handleClose}
                sx={{ color: 'secondary.main' }}
              />
            </Box>
          </>
        </Stack>
        <Stack
          direction={isDesktop ? 'row' : 'column'}
          maxWidth={'100%'}
          flexWrap="wrap"
          rowGap={'0.5rem'}
        >
          {CardFields &&
            showDetails !== false &&
            (isDesktop ? (
              <Grid container spacing={1} wrap="wrap" maxWidth="100%">
                {CardFields.map(
                  (field, i) =>
                    displayData[i] && (
                      <Grid item xs={i <= 3 ? 4 : 12} key={i}>
                        <Stack
                          direction="row"
                          display="flex"
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
                      </Grid>
                    )
                )}
              </Grid>
            ) : (
              <>
                {/* Mobile: group originalKey (index 2) and year (index 3) in one row */}
                {(displayData[2] || displayData[3]) && (
                  <Stack
                    direction="row"
                    spacing={2}
                    alignItems="center"
                    mb={0.5}
                    width="fit-content"
                    maxWidth="100%"
                  >
                    {displayData[2] && (
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Typography variant="body2" color="#9E9E9E" minWidth={'fit-content'}>
                          {CardFields[2]}
                        </Typography>
                        <Typography variant="body2" color={'#CCC2DC'} align="left" noWrap>
                          {fieldData[2] ?? '-'}
                        </Typography>
                      </Stack>
                    )}
                    {displayData[3] && (
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Typography variant="body2" color="#9E9E9E" minWidth={'fit-content'}>
                          {CardFields[3]}
                        </Typography>
                        <Typography variant="body2" color={'#CCC2DC'} align="left" noWrap>
                          {fieldData[3] ?? '-'}
                        </Typography>
                      </Stack>
                    )}
                  </Stack>
                )}
                {/* Render the rest of the fields individually */}
                {CardFields.map((field, i) => {
                  // Skip originalKey (2) and year (3) since already rendered above
                  if (i === 2 || i === 3) return null;
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
                        mr={1}
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
              </>
            ))}
        </Stack>
      </Container>
      <SongPreviewModal
        open={modalOpen}
        onClose={handleClose}
        songToPreview={
          {
            title,
            artist,
            chordLyrics,
          } as SongSchema
        }
      />
    </>
  );
};

export default SongCard;
