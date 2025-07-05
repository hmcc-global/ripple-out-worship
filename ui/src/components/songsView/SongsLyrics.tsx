import { Box, Chip, Grid, Stack, Typography, useMediaQuery } from '@mui/material';
import { SongViewSchema } from '../../types/song.types';
import { flatMusicKeysOptions, sharpMusicKeysOptions } from '../../constants';
import { ReactNode, useCallback, useEffect, useState } from 'react';

interface SongsLyricsProps {
  chordStatus: boolean;
  changeKey: number;
  song: SongViewSchema | undefined;
  split: number;
  useFlat: boolean;
}

const SongsLyrics = ({ chordStatus, changeKey, song, split, useFlat }: SongsLyricsProps) => {
  const isDesktop = useMediaQuery('(min-width:768px)');
  const noSplit = isDesktop ? split : 1;
  const [finalLyrics, setFinalLyrics] = useState<ReactNode[]>();

  const countParagraph = (inputSong: SongViewSchema | undefined) => {
    const lyricsLine = inputSong?.chordLyrics.split('\n');
    let para = 0;
    lyricsLine &&
      lyricsLine.map((line) => (line.includes('{') && line.includes('}') ? para++ : null));
    return para;
  };

  const parseLyrics = useCallback(
    (inputSong: SongViewSchema | undefined, songChunk: string[]) => {
      const result: ReactNode[] = [];
      const originalChordIndex =
        sharpMusicKeysOptions.indexOf(inputSong?.originalKey ?? 'C') === -1
          ? flatMusicKeysOptions.indexOf(inputSong?.originalKey ?? 'C')
          : sharpMusicKeysOptions.indexOf(inputSong?.originalKey ?? 'C');
      const chordDifference = changeKey - originalChordIndex;
      const transpossedChordIndex = chordDifference < 0 ? chordDifference + 12 : chordDifference;
      const lyricsLine = songChunk;

      // render the lyrics
      lyricsLine &&
        lyricsLine.map((line, j) => {
          if (line.includes('{') && line.includes('}')) {
            // return chip for verse, chorus, bridge
            const chipLabel = line.replace('{', '').replace('}', '');
            return result.push(
              <Chip
                key={j}
                label={chipLabel}
                variant="outlined"
                sx={{
                  height: '30px',
                  '& .MuiChip-label': {
                    width: 'inline-flex',
                    alignItems: 'center',
                    whiteSpace: 'none',
                    color: '#D0BCFF',
                    borderColor: '#D0BCFF',
                    borderRadius: 4,
                    border: '2',
                    fontSize: '14px',
                  },
                }}
                style={{
                  borderRadius: 4,
                  marginBottom: '10px',
                  marginTop: '3px',
                  borderColor: '#A9A9A9',
                }}
              />
            );
          } else if (line === '') {
            // return empty line
            return result.push(<br key={j} />);
          } else {
            // return the lyrics and chords
            // split the lines by chunks of 1 chord and its corresponding lyrics
            const splitChar = '[';
            const escapedSplitChar = splitChar.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const regex = new RegExp(`(?=${escapedSplitChar})`);
            const lyrics = line.split(regex);
            return result.push(
              <Stack key={j} flexDirection="row" flexWrap="wrap">
                {lyrics.map((lyric, i) => {
                  if (lyric.includes('[') && lyric.includes(']')) {
                    const startChord = lyric.indexOf('[');
                    const endChord = lyric.indexOf(']');
                    const chord = lyric.slice(startChord + 1, endChord);

                    let cleanedChord = chord.slice(0, 2);
                    if (cleanedChord.length > 1 && !['#', 'b'].includes(cleanedChord[1])) {
                      cleanedChord = cleanedChord[0];
                    }
                    cleanedChord = cleanedChord[0].toUpperCase() + cleanedChord.slice(1);
                    const chordIndex =
                      flatMusicKeysOptions.indexOf(cleanedChord) === -1
                        ? sharpMusicKeysOptions.indexOf(cleanedChord)
                        : flatMusicKeysOptions.indexOf(cleanedChord);

                    const transpossedChordBase = useFlat
                      ? flatMusicKeysOptions[(chordIndex + transpossedChordIndex) % 12]
                      : sharpMusicKeysOptions[(chordIndex + transpossedChordIndex) % 12];
                    const transpossedChord =
                      transpossedChordBase + chord.slice(cleanedChord.length);

                    const textLyrics = lyric.slice(endChord + 1);
                    const chipColor = '#000000';
                    return (
                      <Box key={i}>
                        {chordStatus ? (
                          <Chip
                            label={transpossedChord}
                            size="small"
                            sx={{
                              height: 'fit',
                              '& .MuiChip-label': {
                                alignItems: 'center',
                                whiteSpace: 'none',
                                fontWeight: 'bold',
                                fontSize: '13px',
                                color: '#EADDFF',
                              },
                            }}
                            style={{
                              borderRadius: 4,
                              backgroundColor: chipColor,
                              marginBottom: '5px',
                              marginTop: '3px',
                            }}
                          />
                        ) : null}
                        <Typography style={{ whiteSpace: 'pre-wrap', color: '#CCC2DC' }}>
                          {textLyrics}
                        </Typography>
                      </Box>
                    );
                  } else {
                    return (
                      <Box key={i}>
                        {chordStatus ? <Chip sx={{ visibility: 'hidden' }} /> : null}
                        <Typography style={{ whiteSpace: 'pre-wrap', color: '#CCC2DC' }}>
                          {lyric}
                        </Typography>
                      </Box>
                    );
                  }
                })}
              </Stack>
            );
          }
        });
      return result;
    },
    [changeKey, chordStatus, useFlat]
  );

  // needs improvement
  const groupLyricsToParagraphs = useCallback(
    (song: SongViewSchema | undefined) => {
      const seperator = '{';
      const result = [];
      const inputSong = song ? song.chordLyrics.split('\n') : [];
      let currentGroup: string[] = [];

      for (let i = 0; i < inputSong.length; i++) {
        //base case
        if (i === 0 && inputSong[i].includes(seperator)) {
          currentGroup.push(inputSong[i]);
        }

        if (!inputSong[i].includes(seperator)) {
          currentGroup.push(inputSong[i]);
        }

        if (inputSong[i].includes(seperator)) {
          if (i !== 0) {
            const parsedGroup = parseLyrics(song, currentGroup);
            result.push(parsedGroup);
            currentGroup = [inputSong[i]];
          }
        }
      }

      if (currentGroup.length > 0) {
        result.push(parseLyrics(song, currentGroup));
      }
      return result;
    },
    [parseLyrics]
  );

  useEffect(() => {
    countParagraph(song);
    const res = groupLyricsToParagraphs(song);
    setFinalLyrics(res);
  }, [parseLyrics, song, groupLyricsToParagraphs]);
  return (
    <>
      <Grid container width={'100%'} spacing={2} marginTop={1} marginBottom={1}>
        {finalLyrics &&
          finalLyrics.map((chunk, i) => {
            return (
              <Grid item xs={12 / noSplit} key={i}>
                {chunk}
              </Grid>
            );
          })}
      </Grid>
    </>
  );
};
export default SongsLyrics;
