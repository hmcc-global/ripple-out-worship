import { Add, Check, Close, Delete, Edit, Folder, LinkRounded } from '@mui/icons-material';
import {
  Divider,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  ListItem,
  IconButton,
  Stack,
  Typography,
  List,
  InputBase,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { customAxios as axios } from '../custom/customAxios';
import { Setlist, SetlistFolder } from '../../types/setlist.types';
import HeaderWithIcon from '../custom/HeaderWithIcon';
import { useOwnership } from '../../helpers/customHooks';

// Types
interface SetlistActionsMenuProps {
  anchorEl: HTMLElement | null;
  open: boolean;
  onClose: () => void;
  setlist: Setlist;
  handleSnackbarOpen: (message: string) => void;
  onSetlistDeleted?: (setlistId: string) => void;
  onFolderAssignmentChanged?: (type?: 'folders' | 'setlists' | 'all') => Promise<void>;
}

interface MenuActionItemProps {
  icon: React.ElementType;
  text: string;
  onClick: () => void;
  iconColor?: string;
  color?: string;
  hoverBgColor?: string;
}

// Constants
const DIALOG_STYLES = {
  paper: {
    width: '30rem',
    height: '30rem',
    borderRadius: '1.75rem',
    padding: '0.5rem',
  },
  searchInput: {
    alignSelf: 'center',
    width: '90%',
    px: '1.25rem',
    py: '0.75rem',
    color: 'secondary.light',
    backgroundColor: 'secondary.lighter',
    borderRadius: '1.75rem',
    fontWeight: 400,
    fontSize: '1rem',
  },
};

const MENU_STYLES = {
  paper: {
    color: '#E6E0E9',
    border: '1px solid #938F99',
    borderRadius: '8px',
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.3)',
  },
};

// Custom Hooks
const useFolders = (ownership: any, handleSnackbarOpen: (message: string) => void) => {
  const [ownedFolders, setOwnedFolders] = useState<SetlistFolder[]>([]);

  const fetchFolders = useCallback(async () => {
    try {
      const { data, status } = await axios.get<SetlistFolder[]>('/api/groups/get');

      if (status !== 200 || !data) {
        throw new Error('Failed to fetch folders');
      }

      const filteredFolders = data.filter(
        (folder) => ownership.groupIds?.some(({ id }: { id: string }) => id === folder._id)
      );

      setOwnedFolders(filteredFolders);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An unexpected error occurred';
      handleSnackbarOpen(`Error fetching folders: ${message}`);
      console.error('Error fetching folders:', error);
    }
  }, [ownership, handleSnackbarOpen]);

  useEffect(() => {
    fetchFolders();
  }, [fetchFolders]);

  return { ownedFolders, refetchFolders: fetchFolders };
};

const useSetlistActions = (
  setlist: Setlist,
  handleSnackbarOpen: (message: string) => void,
  onSetlistDeleted?: (setlistId: string) => void
) => {
  const navigate = useNavigate();

  const handleEdit = useCallback(() => {
    navigate(`/setlist/edit/${setlist._id}`);
  }, [navigate, setlist._id]);

  const handleCopyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(setlist.publicLink);
      handleSnackbarOpen('Setlist Public Link copied to clipboard');
    } catch (error) {
      handleSnackbarOpen('Failed to copy link to clipboard');
    }
  }, [setlist.publicLink, handleSnackbarOpen]);

  const handleDelete = useCallback(async () => {
    try {
      const { status } = await axios.put('/api/setlists/delete', {
        params: { id: setlist._id },
      });

      if (status === 200) {
        onSetlistDeleted?.(setlist._id);
        handleSnackbarOpen(`Successfully deleted setlist: ${setlist.name}`);
      }
    } catch (error: any) {
      console.error('Delete setlist error:', error);
      const message =
        error.response?.status === 404
          ? 'Setlist not found or already deleted'
          : error.response?.data?.message || 'Failed to delete setlist';
      handleSnackbarOpen(message);
    }
  }, [setlist._id, setlist.name, handleSnackbarOpen, onSetlistDeleted]);

  return { handleEdit, handleCopyLink, handleDelete };
};

const useFolderManagement = (
  setlist: Setlist,
  ownedFolders: SetlistFolder[],
  handleSnackbarOpen: (message: string) => void,
  onFolderAssignmentChanged?: (type?: 'folders' | 'setlists' | 'all') => Promise<void>
) => {
  const [updatedFolderIds, setUpdatedFolderIds] = useState<string[]>([]);
  const [originalFolderIds, setOriginalFolderIds] = useState<string[]>([]);

  useEffect(() => {
    setOriginalFolderIds(setlist.groupIds);
    setUpdatedFolderIds(setlist.groupIds);
  }, [setlist.groupIds]);

  const toggleFolder = useCallback((folderId: string) => {
    setUpdatedFolderIds((prev) =>
      prev.includes(folderId) ? prev.filter((id) => id !== folderId) : [...prev, folderId]
    );
  }, []);

  const saveFolderChanges = useCallback(async () => {
    try {
      // Update setlist with new folder IDs
      const { status } = await axios.put('/api/setlists/update', {
        id: setlist._id,
        groupIds: updatedFolderIds,
      });

      if (status !== 200) throw new Error('Failed to update setlist');

      // Calculate changes
      const foldersToAdd = updatedFolderIds.filter((id) => !originalFolderIds.includes(id));
      const foldersToRemove = originalFolderIds.filter((id) => !updatedFolderIds.includes(id));

      // Update folder setlist references
      const updatePromises = [
        ...foldersToAdd.map((folderId) => {
          const folder = ownedFolders.find((f) => f._id === folderId);
          return folder
            ? axios.put('/api/groups/update', {
                id: folderId,
                setlistIds: [...(folder.setlistIds || []), setlist._id],
              })
            : Promise.resolve();
        }),
        ...foldersToRemove.map((folderId) => {
          const folder = ownedFolders.find((f) => f._id === folderId);
          return folder
            ? axios.put('/api/groups/update', {
                id: folderId,
                setlistIds: (folder.setlistIds || []).filter((id) => id !== setlist._id),
              })
            : Promise.resolve();
        }),
      ];

      const results = await Promise.all(updatePromises);
      const allSuccessful = results.every((res) => res?.status === 200);

      if (allSuccessful) {
        handleSnackbarOpen('Folder assignments updated successfully');
        setOriginalFolderIds(updatedFolderIds);
        // Trigger parent refresh
        if (onFolderAssignmentChanged) {
          await onFolderAssignmentChanged('all');
        }
        return true;
      } else {
        throw new Error('Some folder updates failed');
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update folders';
      handleSnackbarOpen(`Error updating folders: ${message}`);
      console.error('Error updating folders:', error);
      return false;
    }
  }, [
    setlist._id,
    updatedFolderIds,
    originalFolderIds,
    ownedFolders,
    handleSnackbarOpen,
    onFolderAssignmentChanged,
  ]);

  const resetFolderChanges = useCallback(() => {
    setUpdatedFolderIds(originalFolderIds);
  }, [originalFolderIds]);

  return {
    updatedFolderIds,
    toggleFolder,
    saveFolderChanges,
    resetFolderChanges,
  };
};

// Sub-components
const MenuActionItem: FC<MenuActionItemProps> = ({
  icon: Icon,
  text,
  onClick,
  iconColor = 'secondary.main',
  color = 'primary.lighter',
  hoverBgColor = 'primary.main',
}) => (
  <MenuItem onClick={onClick} sx={{ '&:hover': { bgcolor: hoverBgColor } }}>
    <ListItemIcon sx={{ color: iconColor }}>
      <Icon />
    </ListItemIcon>
    <ListItemText sx={{ color, fontSize: '0.75rem !important' }}>{text}</ListItemText>
  </MenuItem>
);

const FolderListItem: FC<{
  folder: SetlistFolder;
  isSelected: boolean;
  onToggle: (folderId: string) => void;
}> = ({ folder, isSelected, onToggle }) => (
  <ListItem
    sx={{ borderBottom: '1px solid #49454F', p: '1rem' }}
    secondaryAction={
      <IconButton
        edge="end"
        onClick={() => onToggle(folder._id)}
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
        className={isSelected ? 'Mui-selected' : ''}
      >
        {isSelected ? <Check /> : <Add />}
      </IconButton>
    }
  >
      <Typography sx={{paddingRight: '32px'}} variant="subtitle1">{folder.groupName}</Typography>
  </ListItem>
);

const DeleteDialog: FC<{
  open: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  setlistName: string;
}> = ({ open, onClose, onConfirm, setlistName }) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirm = async () => {
    setIsDeleting(true);
    await onConfirm();
    setIsDeleting(false);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Delete Setlist</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to delete the setlist "{setlistName}"?
          {'\n'}This action cannot be undone.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={isDeleting}>
          Cancel
        </Button>
        <Button onClick={handleConfirm} color="error" disabled={isDeleting}>
          {isDeleting ? 'Deleting...' : 'Delete'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const FolderActionsDialog: FC<{
  open: boolean;
  onClose: () => void;
  folders: SetlistFolder[];
  updatedFolderIds: string[];
  onToggleFolder: (folderId: string) => void;
  onSave: () => Promise<boolean>;
  onReset: () => void;
}> = ({ open, onClose, folders, updatedFolderIds, onToggleFolder, onSave, onReset }) => {
  const [searchString, setSearchString] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const filteredFolders = useMemo(() => {
    const keyword = searchString.trim().toLowerCase();
    if (!keyword || keyword.length < 2) return folders;
    return folders.filter((folder) => folder.groupName.toLowerCase().includes(keyword));
  }, [folders, searchString]);

  const handleClose = () => {
    setSearchString('');
    onReset();
    onClose();
  };

  const handleSave = async () => {
    setIsSaving(true);
    const success = await onSave();
    setIsSaving(false);
    if (success) {
      setSearchString('');
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} PaperProps={{ sx: DIALOG_STYLES.paper }}>
      <DialogTitle
        display="flex"
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
      >
        <HeaderWithIcon
          Icon={Folder}
          headerText="Folder Actions"
          headerVariant="h3"
          iconColor="secondary.main"
        />
        <IconButton onClick={handleClose} sx={{ color: 'grey.500' }}>
          <Close />
        </IconButton>
      </DialogTitle>

      <InputBase
        placeholder="Search by folder name"
        sx={DIALOG_STYLES.searchInput}
        value={searchString}
        onChange={(e) => setSearchString(e.target.value)}
        autoFocus
      />

      <DialogContent sx={{ pt: 0 }}>
        <List>
          {filteredFolders.length > 0 ? (
            filteredFolders.map((folder) => (
              <FolderListItem
                key={folder._id}
                folder={folder}
                isSelected={updatedFolderIds.includes(folder._id)}
                onToggle={onToggleFolder}
              />
            ))
          ) : (
            <ListItem>
              <Typography variant="subtitle1" color="primary.lighter">
                No folders found
              </Typography>
            </ListItem>
          )}
        </List>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} disabled={isSaving}>
          Cancel
        </Button>
        <Button onClick={handleSave} color="primary" disabled={isSaving}>
          {isSaving ? 'Saving...' : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// Main Component
const SetlistActionsMenu: FC<SetlistActionsMenuProps> = ({
  anchorEl,
  open,
  onClose,
  setlist,
  handleSnackbarOpen,
  onSetlistDeleted,
  onFolderAssignmentChanged,
}) => {
  const ownership = useOwnership();
  const { ownedFolders } = useFolders(ownership, handleSnackbarOpen);
  const { handleEdit, handleCopyLink, handleDelete } = useSetlistActions(
    setlist,
    handleSnackbarOpen,
    onSetlistDeleted
  );
  const { updatedFolderIds, toggleFolder, saveFolderChanges, resetFolderChanges } =
    useFolderManagement(setlist, ownedFolders, handleSnackbarOpen, onFolderAssignmentChanged);

  // Dialog states
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isFolderDialogOpen, setIsFolderDialogOpen] = useState(false);

  // Menu action handlers
  const handleEditClick = () => {
    handleEdit();
    onClose();
  };

  const handleCopyLinkClick = async () => {
    await handleCopyLink();
    onClose();
  };

  const handleDeleteClick = () => {
    setIsDeleteDialogOpen(true);
    onClose();
  };

  const handleFolderActionsClick = () => {
    setIsFolderDialogOpen(true);
    onClose();
  };

  const handleConfirmDelete = async () => {
    await handleDelete();
    setIsDeleteDialogOpen(false);
  };

  return (
    <>
      <Menu
        id={`setlist-menu-${setlist._id}`}
        anchorEl={anchorEl}
        open={open}
        onClose={onClose}
        MenuListProps={{ 'aria-labelledby': `setlist-menu-button-${setlist._id}` }}
        PaperProps={{ sx: MENU_STYLES.paper }}
      >
        <MenuActionItem icon={Edit} text="Edit Setlist" onClick={handleEditClick} />
        <MenuActionItem icon={LinkRounded} text="Copy Link" onClick={handleCopyLinkClick} />
        <MenuActionItem icon={Folder} text="Folder Actions" onClick={handleFolderActionsClick} />

        <Divider sx={{ bgcolor: '#49454F' }} />

        <MenuActionItem
          icon={Delete}
          text="Delete Setlist"
          onClick={handleDeleteClick}
          iconColor="#EFB8C8"
          color="#EFB8C8"
          hoverBgColor="rgba(239, 184, 200, 0.2)"
        />
      </Menu>

      <DeleteDialog
        open={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        setlistName={setlist.name}
      />

      <FolderActionsDialog
        open={isFolderDialogOpen}
        onClose={() => setIsFolderDialogOpen(false)}
        folders={ownedFolders}
        updatedFolderIds={updatedFolderIds}
        onToggleFolder={toggleFolder}
        onSave={saveFolderChanges}
        onReset={resetFolderChanges}
      />
    </>
  );
};

export default SetlistActionsMenu;
