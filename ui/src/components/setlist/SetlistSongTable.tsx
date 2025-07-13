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
  setSongList?: React.Dispatch<React.SetStateAction<SongSetlistSchema[]>>;
  readOnly?: boolean;
}

const SetlistSongsTable: React.FC<SetlistSongsTableProps> = ({
  songList,
  setSongList,
  readOnly = false,
}) => {
  // State management
  const [sortedSongList, setSortedSongList] = useState<SongSetlistSchema[]>([]);
  const [menuState, setMenuState] = useState({
    anchorEl: null as HTMLElement | null,
    currentSongId: null as string | null,
  });

  // Modal states with non-null song when open
  const [modals, setModals] = useState({
    preview: {
      open: false,
      song: null as SongSetlistSchema | null,
    },
    changeKey: {
      open: false,
      song: null as SongSetlistSchema | null,
    },
  });

  // Sort songs whenever the songList changes
  useEffect(() => {
    const sorted = [...songList].sort((a, b) => (a.sequence || 0) - (b.sequence || 0));
    setSortedSongList(sorted);
  }, [songList]);

  // Menu handlers
  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>, songId: string) => {
    setMenuState({
      anchorEl: event.currentTarget,
      currentSongId: songId,
    });
  };

  const handleMenuClose = () => {
    setMenuState({
      anchorEl: null,
      currentSongId: null,
    });
  };

  // Modal handlers with type safety
  const handleModalToggle = (
    modalType: 'preview' | 'changeKey',
    open: boolean,
    song: SongSetlistSchema | null = null
  ) => {
    setModals((prev) => ({
      ...prev,
      [modalType]: {
        open,
        song: open ? song : null,
      },
    }));
  };

  // Type-safe modal open handlers
  const handlePreviewOpen = (song: SongSetlistSchema) => {
    handleModalToggle('preview', true, song);
  };

  const handleChangeKeyOpen = (song: SongSetlistSchema) => {
    handleModalToggle('changeKey', true, song);
  };

  // Song manipulation handlers
  const handleSaveKey = (newKey: string) => {
    if (!modals.changeKey.song || !setSongList) return;

    setSongList((prev) =>
      prev.map((song) =>
        song._id === modals.changeKey.song?._id ? { ...song, key: newKey } : song
      )
    );
    handleModalToggle('changeKey', false);
  };

  const handleMoveSong = (direction: 'up' | 'down', songId: string) => {
    if (!setSongList) return;

    const newSortedList = [...sortedSongList];
    const currentIndex = newSortedList.findIndex((s) => s._id === songId);
    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;

    if (newIndex < 0 || newIndex >= newSortedList.length) return;

    [newSortedList[currentIndex], newSortedList[newIndex]] = [
      newSortedList[newIndex],
      newSortedList[currentIndex],
    ];

    newSortedList.forEach((song, index) => {
      song.sequence = index + 1;
    });

    setSortedSongList(newSortedList);
    setSongList(newSortedList);
    handleMenuClose();
  };

  const handleRemoveSong = (songId: string) => {
    if (!setSongList) return;

    const songToRemove = songList.find((song) => song._id === songId);
    if (!songToRemove) return;

    const updatedList = songList
      .filter((song) => song._id !== songId)
      .map((song) => ({
        ...song,
        sequence: song.sequence! > songToRemove.sequence! ? song.sequence! - 1 : song.sequence,
      }));

    setSongList(updatedList);
    handleMenuClose();
  };

  // Styles
  const tableCellStyles = {
    header: {
      color: '#938F99',
    },
    sequence: {
      width: '5%',
      color: '#938F99',
    },
    title: {
      width: readOnly ? '85%' : '80%',
      color: '#938F99',
    },
    key: {
      width: '10%',
      color: '#938F99',
    },
    actions: {
      width: '5%',
    },
  };

  const keyBoxStyles = {
    background: '#4F378B',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: '40px',
    width: '40px',
    height: '40px',
  };

  // Menu item component
  const MenuActionItem = ({
    icon: Icon,
    text,
    onClick,
  }: {
    icon: React.ElementType;
    text: string;
    onClick: () => void;
  }) => (
    <MenuItem onClick={onClick}>
      <ListItemIcon sx={{ color: 'secondary.main' }}>
        <Icon />
      </ListItemIcon>
      <ListItemText sx={{ color: 'primary.lighter' }}>{text}</ListItemText>
    </MenuItem>
  );

  return (
    <>
      <TableContainer
        sx={{
          borderRadius: '16px',
          backgroundColor: '#0F0D13',
          paddingInline: '16px',
        }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={tableCellStyles.sequence}>#</TableCell>
              <TableCell sx={tableCellStyles.title}>Song Title</TableCell>
              <TableCell sx={tableCellStyles.key}>Key</TableCell>
              {!readOnly && <TableCell sx={tableCellStyles.actions} />}
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedSongList.length > 0 ? (
              sortedSongList.map((song, index) => (
                <TableRow key={song._id} sx={{ '& td': { border: 0 } }}>
                  <TableCell sx={tableCellStyles.sequence}>{index + 1}</TableCell>
                  <TableCell>
                    <Typography variant="h4" fontWeight={600} sx={{ color: '#E6E0E9' }}>
                      {song.title}
                    </Typography>
                    <Typography variant="subtitle2" fontWeight={500} sx={{ color: '#CAC4D0' }}>
                      {song.artist}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box sx={keyBoxStyles}>
                      <Typography color="#EADDFF" fontSize="1rem" fontWeight={400}>
                        {song.key}
                      </Typography>
                    </Box>
                  </TableCell>
                  {!readOnly && (
                    <TableCell>
                      <IconButton
                        onClick={(e) => handleMenuOpen(e, song._id)}
                        aria-controls={`song-menu-${song._id}`}
                        aria-haspopup="true"
                      >
                        <MoreVert color="secondary" />
                      </IconButton>

                      <Menu
                        id={`song-menu-${song._id}`}
                        anchorEl={menuState.anchorEl}
                        open={menuState.anchorEl !== null && menuState.currentSongId === song._id}
                        onClose={handleMenuClose}
                        PaperProps={{ sx: { backgroundColor: 'primary.darker' } }}
                      >
                        <MenuActionItem
                          icon={Visibility}
                          text="Preview"
                          onClick={() => handlePreviewOpen(song)}
                        />
                        <Divider sx={{ bgcolor: '#49454F' }} />
                        <MenuActionItem
                          icon={Tune}
                          text="Change Key"
                          onClick={() => handleChangeKeyOpen(song)}
                        />
                        <MenuActionItem
                          icon={ArrowUpward}
                          text="Move Up"
                          onClick={() => handleMoveSong('up', song._id)}
                        />
                        <MenuActionItem
                          icon={ArrowDownward}
                          text="Move Down"
                          onClick={() => handleMoveSong('down', song._id)}
                        />
                        <Divider sx={{ bgcolor: '#49454F' }} />
                        <MenuActionItem
                          icon={Delete}
                          text="Remove Song"
                          onClick={() => handleRemoveSong(song._id)}
                        />
                      </Menu>
                    </TableCell>
                  )}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={readOnly ? 3 : 4} sx={{ borderBottom: 0 }}>
                  <Typography variant="subtitle1" color="secondary.main" align="left">
                    No Songs Added
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Modals */}
      {modals.preview.open && modals.preview.song && (
        <SongPreviewModal
          open={modals.preview.open}
          onClose={() => handleModalToggle('preview', false)}
          songToPreview={modals.preview.song}
        />
      )}
      {modals.changeKey.open && modals.changeKey.song && !readOnly && (
        <SetlistChangeKeyModal
          open={modals.changeKey.open}
          onClose={() => handleModalToggle('changeKey', false)}
          song={modals.changeKey.song}
          handleSave={handleSaveKey}
        />
      )}
    </>
  );
};

export default SetlistSongsTable;
