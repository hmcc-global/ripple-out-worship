import React, { useEffect, useState } from 'react';
import {
  Box,
  Divider,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import {
  MoreVert,
  Visibility,
  ArrowUpward,
  ArrowDownward,
  Delete,
  Tune,
} from '@mui/icons-material';
import { SongSetlistSchema } from '../../types/song.types';
import SongPreviewModal from '../utility/SongPreviewModal';
import SetlistChangeKeyModal from './SetlistChangeKeyModal';

interface SetlistSongsTableProps {
  songList: SongSetlistSchema[];
  setSongList: React.Dispatch<React.SetStateAction<SongSetlistSchema[]>>;
}

const SetlistSongsTable: React.FC<SetlistSongsTableProps> = ({ songList, setSongList }) => {
  const [sortedSongList, setSortedSongList] = useState<SongSetlistSchema[]>(songList);

  useEffect(() => {
    setSortedSongList(songList.sort((a, b) => (a.sequence ? a.sequence - b.sequence : 0)));
  }, [songList]);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [currentSongId, setCurrentSongId] = useState<string | null>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>, songId: string) => {
    setAnchorEl(event.currentTarget);
    setCurrentSongId(songId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setCurrentSongId(null);
  };

  // Song Preview
  const [songToPreview, setSongToPreview] = useState<SongSetlistSchema | null>(null);
  const [songPreviewModalOpen, setSongPreviewModalOpen] = useState(false);

  const handleSongPreviewModalOpen = (song: SongSetlistSchema) => {
    setSongToPreview(song);
    setSongPreviewModalOpen(true);
  };
  const handleSongPreviewModalClose = () => {
    setSongToPreview(null);
    setSongPreviewModalOpen(false);
  };

  // Change Key
  const [songToChangeKey, setSongToChangeKey] = useState<SongSetlistSchema | null>(null);
  const [changeKeyModalOpen, setChangeKeyModalOpen] = useState(false);

  const handleSongChangeKeyModalOpen = (song: SongSetlistSchema) => {
    setSongToChangeKey(song);
    setChangeKeyModalOpen(true);
  };

  const handleSongChangeKeyModalClose = () => {
    setSongToChangeKey(null);
    setChangeKeyModalOpen(false);
  };

  const handleSaveKey = (newKey: string) => {
    // Handle save key action
    setSongList((prev) =>
      prev.map((song) => {
        if (song._id === songToChangeKey?._id) {
          return { ...song, key: newKey };
        }
        return song;
      })
    );
    handleSongChangeKeyModalClose();
  };

  // Menu Actions
  const handlePreviewSong = (songId: string) => {
    // Handle preview song action
    const songToPreview = songList.find((song) => song._id === songId);
    if (songToPreview) {
      handleSongPreviewModalOpen(songToPreview);
    }
    handleMenuClose();
  };

  const handleChangeKey = (songId: string) => {
    // Handle change key action
    const songToChangeKey = songList.find((song) => song._id === songId);
    if (songToChangeKey) {
      handleSongChangeKeyModalOpen(songToChangeKey);
    }
    handleMenuClose();
  };

  const handleMoveUp = (songId: string) => {
    const songSequence = songList.find((song) => song._id === songId)?.sequence;
    if (songSequence === 1 || !songSequence) {
      return;
    }
    const songToSwap = songList.find((song) => song.sequence === songSequence - 1);

    setSongList((prev) =>
      prev.map((song) => {
        if (song._id === songId) {
          return { ...song, sequence: songSequence - 1 };
        }
        if (song._id === songToSwap?._id) {
          return { ...song, sequence: songSequence };
        }
        return song;
      })
    );

    handleMenuClose();
  };

  const handleMoveDown = (songId: string) => {
    // Handle move down action
    const songSequence = sortedSongList.find((song) => song._id === songId)?.sequence;
    if (songSequence === sortedSongList.length || !songSequence) {
      return;
    }
    const songToSwap = sortedSongList.find((song) => song.sequence === songSequence + 1);

    setSongList((prev) =>
      prev.map((song) => {
        if (song._id === songId) {
          return { ...song, sequence: songSequence + 1 };
        } else if (song._id === songToSwap?._id) {
          return { ...song, sequence: songSequence };
        }
        return song;
      })
    );

    handleMenuClose();
  };

  const handleRemoveSong = (songId: string) => {
    const songToRemove = songList.find((song) => song._id === songId);
    const songIndexToRemove = songList.findIndex((song) => song._id === songId);

    if (!songToRemove || songIndexToRemove === -1) return;

    const updatedSongList = [...songList];
    updatedSongList.splice(songIndexToRemove, 1);

    // Update the sequence of the songs below the removed song
    updatedSongList.forEach((song, index) => {
      if (song.sequence! > songToRemove.sequence!) {
        updatedSongList[index] = { ...song, sequence: song.sequence! - 1 };
      }
    });

    setSongList(updatedSongList);
    handleMenuClose();
  };

  return (
    <>
      <TableContainer
        style={{
          borderRadius: '16px',
          backgroundColor: '#0F0D13',
          paddingInline: '16px',
        }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell
                width="10%"
                sx={{
                  color: '#938F99',
                }}
              >
                #
              </TableCell>
              <TableCell
                width="75%"
                sx={{
                  color: '#938F99',
                }}
              >
                Song Title
              </TableCell>
              <TableCell
                width="10%"
                sx={{
                  color: '#938F99',
                }}
              >
                Key
              </TableCell>
              <TableCell width="5%" />
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedSongList && sortedSongList.length > 0 ? (
              sortedSongList.map((song, i) => (
                <TableRow key={song._id} sx={{ '& td': { border: 0 } }}>
                  <TableCell
                    width="10%"
                    sx={{
                      color: '#938F99',
                    }}
                  >
                    {i + 1}
                  </TableCell>
                  <TableCell width="75%">
                    <Typography variant="h3" fontWeight={600}>
                      {song.title}
                    </Typography>
                    <Typography variant="subtitle1" fontWeight={500} sx={{ color: '#CAC4D0' }}>
                      {song.artist}
                    </Typography>
                  </TableCell>
                  <TableCell width="10%">
                    <Box
                      style={{
                        background: '#4F378B',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderRadius: '40px',
                        width: '40px',
                        height: '40px',
                      }}
                    >
                      <Typography
                        color="secondary.light"
                        fontSize={'1rem'}
                        fontWeight={400}
                        align="center"
                      >
                        {song.key}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell width="5%">
                    <IconButton
                      onClick={(event) => handleMenuOpen(event, song._id)}
                      aria-controls={`song-menu-${song._id}`}
                      aria-haspopup="true"
                    >
                      <MoreVert color="secondary" />
                    </IconButton>
                  </TableCell>
                  <Menu
                    id={`song-menu-${song._id}`}
                    anchorEl={anchorEl}
                    open={anchorEl !== null && currentSongId === song._id}
                    onClose={handleMenuClose}
                    sx={{
                      '& .MuiPaper-root': {
                        backgroundColor: 'primary.darker',
                      },
                    }}
                  >
                    <MenuItem onClick={() => handlePreviewSong(song._id)}>
                      <ListItemIcon
                        sx={{
                          color: 'secondary.main',
                        }}
                      >
                        <Visibility />
                      </ListItemIcon>
                      <ListItemText color={'primary.lighter'}>Preview</ListItemText>
                    </MenuItem>
                    <Divider sx={{ bgcolor: '#49454F' }} />

                    <MenuItem onClick={() => handleChangeKey(song._id)}>
                      <ListItemIcon
                        sx={{
                          color: 'secondary.main',
                        }}
                      >
                        <Tune />
                      </ListItemIcon>
                      <ListItemText color={'primary.lighter'}>Change Key</ListItemText>
                    </MenuItem>
                    <MenuItem onClick={() => handleMoveUp(song._id)}>
                      <ListItemIcon
                        sx={{
                          color: 'secondary.main',
                        }}
                      >
                        <ArrowUpward />
                      </ListItemIcon>
                      <ListItemText color={'primary.lighter'}>Move Up</ListItemText>
                    </MenuItem>
                    <MenuItem onClick={() => handleMoveDown(song._id)}>
                      <ListItemIcon
                        sx={{
                          color: 'secondary.main',
                        }}
                      >
                        <ArrowDownward />
                      </ListItemIcon>
                      <ListItemText color={'primary.lighter'}>Move Down</ListItemText>
                    </MenuItem>
                    <Divider sx={{ bgcolor: '#49454F' }} />
                    <MenuItem onClick={() => handleRemoveSong(song._id)}>
                      <ListItemIcon
                        sx={{
                          color: 'secondary.main',
                        }}
                      >
                        <Delete />
                      </ListItemIcon>
                      <ListItemText color={'primary.lighter'}>Remove Song</ListItemText>
                    </MenuItem>
                  </Menu>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell width="10%" sx={{ borderBottom: 0 }} />
                <TableCell width="55%" sx={{ borderBottom: 0 }}>
                  <Typography variant="subtitle1" color="secondary.main" align="left">
                    No Songs Added
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      {songToPreview && (
        <SongPreviewModal
          open={songPreviewModalOpen}
          onClose={handleSongPreviewModalClose}
          songToPreview={songToPreview}
        />
      )}
      {songToChangeKey && (
        <SetlistChangeKeyModal
          open={changeKeyModalOpen}
          onClose={handleSongChangeKeyModalClose}
          song={songToChangeKey}
          handleSave={handleSaveKey}
        />
      )}
    </>
  );
};

export default SetlistSongsTable;
