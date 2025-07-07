import { Setlist, SetlistFolder } from '#/types/setlist.types';
import { Container, Box, Typography, Button, styled, Snackbar, IconButton } from '@mui/material';
import axios from 'axios';
import { FC, ReactElement, useCallback, useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SongsTable from './SongsTable';
import EditIcon from '@mui/icons-material/Edit';
import LinkIcon from '@mui/icons-material/Link';
import LaunchIcon from '@mui/icons-material/Launch';
import CloseIcon from '@mui/icons-material/Close';
import SetlistPreview from './SetlistPreview';
import FolderIcon from '@mui/icons-material/Folder';
import SetlistFolderDrawer from '../SetlistFolderDrawer';

const SetlistButton = styled(Button)(({ theme }) => ({
  borderRadius: '20px',
  color: theme.palette.primary.light,
  borderColor: theme.palette.primary.light,
  padding: '8px 24px',
}));

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');

  return `${year}-${month}-${day}`;
};

const SetlistViewContainer: FC = (): ReactElement | null => {
  const { id } = useParams();
  const [groupId, setGroupId] = useState('');
  const [groupData, setGroupData] = useState<SetlistFolder>();
  const navigate = useNavigate();

  const [setlist, setSetlist] = useState<Setlist>();
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  // handle folder side pane drawer
  const [openDrawer, setOpenDrawer] = useState<boolean>(false);
  const [folderId, setFolderId] = useState<string>('');
  const [folderName, setFolderName] = useState<string>('');
  const [folderCreated, setFolderCreated] = useState<string>('');
  const [folderMembers, setFolderMembers] = useState<string[]>([]);
  const toggleFolderDrawer = (newOpen: boolean) => {
    setOpenDrawer(newOpen);
  };

  const date = useMemo(() => {
    // return setlist ? new Date(setlist.date).toISOString().split('T')[0] : '';
    return setlist?.date;
  }, [setlist]);

  const getSetlist = useCallback(async () => {
    try {
      const { data, status } = await axios.get(`/api/setlists/get`, {
        params: {
          id: id,
        },
      });
      if (status === 200) {
        setSetlist(data);
        if (data.groupIds[0]) {
          setGroupId(data.groupIds[0]);
        }
      }
    } catch (e) {
      console.log(e);
    }
  }, [id]);

  const getGroup = useCallback(async () => {
    try {
      const { data, status } = await axios.get(`/api/groups/get`, {
        params: {
          id: groupId,
        },
      });
      if (status === 200) {
        setGroupData(data);
        setFolderId(data._id);
        setFolderName(data.groupName);
        setFolderMembers(data.userIds);
        setFolderCreated(data.createdAt);
      }
    } catch (e) {
      console.log(e);
    }
  }, [groupId]);

  const handleEdit = () => {
    navigate(`/setlist/edit/${id}`);
  };

  const handleCopy = () => {
    setOpenSnackbar(true);
    if (setlist?.publicLink) {
      navigator.clipboard.writeText(setlist?.publicLink ?? '');
      setSnackbarMessage('Link copied to clipboard');
    } else {
      setSnackbarMessage('No public link available');
    }
  };

  const handleLaunch = () => {
    navigate(`/setlist/view/${id}`);
  };

  const handleCloseSnackbar = (event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenSnackbar(false);
  };

  useEffect(() => {
    getSetlist();
    if (groupId) {
      getGroup();
    }
  }, [getSetlist, id, groupId]);

  return id && setlist ? (
    <Container
      maxWidth="lg"
      style={{ display: 'flex', flexDirection: 'row', gap: '20px', width: '100%' }}
    >
      <Box style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '50%' }}>
        {/* Header */}
        <Box style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <Typography variant="h1">{setlist.name}</Typography>
          <Box style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 1 }}>
            <Typography variant="body1">Created on {formatDate(setlist.createdAt)} | </Typography>

            <IconButton
              size="small"
              aria-label="close"
              color="inherit"
              onClick={() => {
                if (groupData) {
                  setFolderId(groupData._id);
                  setFolderName(groupData.groupName);
                  setFolderMembers(groupData.userIds);
                  setFolderCreated(groupData.createdAt);
                  toggleFolderDrawer(true);
                }
              }}
            >
              <FolderIcon fontSize="small" sx={{ color: '#4A4458' }} />
              <Typography variant="body1">{groupData ? ` ${groupData.groupName}` : ' '}</Typography>
            </IconButton>
          </Box>
        </Box>
        {/* Setlist button */}
        <Box gap="8px" display="flex">
          <SetlistButton startIcon={<EditIcon />} variant="outlined" onClick={handleEdit}>
            Edit Setlist
          </SetlistButton>
          <SetlistButton startIcon={<LinkIcon />} variant="outlined" onClick={handleCopy}>
            Copy Link
          </SetlistButton>
          <SetlistButton startIcon={<LaunchIcon />} variant="outlined" onClick={handleLaunch}>
            View in Browser
          </SetlistButton>
        </Box>
        {/* Songs Table */}
        <Box>
          <SongsTable songs={setlist.songs} />
        </Box>
      </Box>
      {/* Lyrics Preview */}
      <Box width="50%">
        <SetlistPreview />
      </Box>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={5000}
        onClose={handleCloseSnackbar}
        message={snackbarMessage}
        action={
          <IconButton size="small" aria-label="close" color="inherit" onClick={handleCloseSnackbar}>
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      />
      <SetlistFolderDrawer
        openDrawer={openDrawer}
        toggleFolderDrawer={toggleFolderDrawer}
        setFolderId={setFolderId}
        setFolderName={setFolderName}
        setFolderMembers={setFolderMembers}
        setFolderCreated={setFolderCreated}
        folderId={folderId}
        folderName={folderName}
        folderMembers={folderMembers}
        folderCreated={folderCreated}
        mode="edit"
      />
    </Container>
  ) : null;
};

export default SetlistViewContainer;
