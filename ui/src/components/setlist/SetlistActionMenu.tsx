import { useTheme } from '@mui/material/styles';
import { Add, Folder, QueueMusic } from '@mui/icons-material';
import {
  Collapse,
  Fab,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Slide,
  useMediaQuery,
} from '@mui/material';
import { FC, MouseEvent, useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SetlistFolderDrawer from './SetlistFolderDrawer';

interface SetlistActionMenuProps {
  anchorEl: null | HTMLElement;
}

const SetlistActionMenu: FC<SetlistActionMenuProps> = ({ anchorEl }) => {
  const theme = useTheme();

  const isTablet = useMediaQuery(theme.breakpoints.between('md', 'xl'));
  const isDesktop = useMediaQuery(theme.breakpoints.up('xl'));
  const navigate = useNavigate();

  const [createAnchorEl, setCreateAnchorEl] = useState<null | HTMLElement>(null);

  useEffect(() => {
    if (anchorEl) {
      setCreateAnchorEl(anchorEl);
    }
  }, [anchorEl]);

  const openCreate = Boolean(createAnchorEl);

  // handle folder side pane drawer
  const [openDrawer, setOpenDrawer] = useState<boolean>(false);
  const [folderId, setFolderId] = useState<string>('');
  const [folderName, setFolderName] = useState<string>('');
  const [folderCreated, setFolderCreated] = useState<string>('');
  const [folderMembers, setFolderMembers] = useState<string[]>([]);
  const toggleFolderDrawer = (newOpen: boolean) => {
    setOpenDrawer(newOpen);
  };

  // Handle "New" FAB click
  const [isActionMenuOpen, setIsActionMenuOpen] = useState(false);

  const handleMobileCreateClick = useCallback((event: MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setCreateAnchorEl(null);
    setIsActionMenuOpen((prev) => !prev);
  }, []);

  // Handle action FAB clicks
  const handleCreateSetlist = useCallback(() => {
    navigate('/setlist/add');
    setIsActionMenuOpen(false);
  }, [navigate]);

  const handleCreateFolder = useCallback(() => {
    toggleFolderDrawer(true);
    setIsActionMenuOpen(false);
  }, []);

  const handleCreateClose = () => {
    setCreateAnchorEl(null);
  };

  // Common FAB styles
  const fabStyles = {
    position: 'fixed' as const,
    right: '1rem',
    backgroundColor: '#D0BCFF', // SECONDARY_MAIN
    color: '#381E72',
    padding: '8px 16px',
    borderRadius: '1rem',
    '&:hover': {
      backgroundColor: '#D0BCFF',
      opacity: 0.95,
    },
    '&:active': {
      transform: 'scale(0.95)',
    },
    transition: 'all 0.2s ease-in-out',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    zIndex: 1000,
    gap: '0.5rem',
  };

  const fabActionButtonStyles = {
    position: 'fixed' as const,
    right: '1rem',
    backgroundColor: '#171717',
    color: 'secondary.main',
    padding: '8px 16px',
    border: '1px solid',
    borderColor: 'secondary.main',
    borderRadius: '1rem',
    '&:hover': {
      backgroundColor: '#D0BCFF',
      opacity: 0.95,
    },
    '&:active': {
      transform: 'scale(0.95)',
    },
    transition: 'all 0.2s ease-in-out',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    zIndex: 1000,
    gap: '0.5rem',
  };

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
      {/* Mobile Floating Action Button Menu*/}
      {!isTablet && !isDesktop && (
        <>
          <Collapse in={isActionMenuOpen} timeout={300}>
            <Slide in={isActionMenuOpen} direction="up" timeout={300}>
              <Fab
                variant="extended"
                aria-label="create folder"
                onClick={handleCreateFolder}
                sx={{
                  ...fabActionButtonStyles,
                  bottom: 'calc(80px + 1rem + 128px)', // Above Setlist FAB
                  transitionDelay: '100ms', // Stagger animation
                }}
              >
                <Folder sx={{ fontSize: '1.5rem' }} />
                Folder
              </Fab>
            </Slide>
          </Collapse>
          <Collapse in={isActionMenuOpen} timeout={300}>
            <Slide in={isActionMenuOpen} direction="up" timeout={300}>
              <Fab
                variant="extended"
                aria-label="create setlist"
                onClick={handleCreateSetlist}
                sx={{
                  ...fabActionButtonStyles,
                  bottom: 'calc(80px + 1rem + 64px)', // Above New FAB
                }}
              >
                <QueueMusic sx={{ fontSize: '1.5rem' }} />
                Setlist
              </Fab>
            </Slide>
          </Collapse>
          <Fab
            variant="extended"
            aria-label="add setlist or folder"
            onClick={handleMobileCreateClick}
            sx={{
              ...fabStyles,
              bottom: 'calc(80px + 1rem)', // Matches original position
              zIndex: 1100, // Higher than action FABs
            }}
          >
            <Add
              sx={{
                fontSize: '1.5rem',
                transform: isActionMenuOpen ? 'rotate(45deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s ease-in-out',
              }}
            />
            New
          </Fab>
        </>
      )}

      {/* Desktop Menu */}
      <Menu
        anchorEl={createAnchorEl}
        open={openCreate}
        onClose={handleCreateClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        sx={{
          '& .MuiPaper-root': {
            minWidth: '160px',
          },
        }}
      >
        <MenuActionItem
          icon={QueueMusic}
          text="Create Setlist"
          onClick={() => {
            navigate('/setlist/add');
            handleCreateClose();
          }}
        />
        <MenuActionItem
          icon={Folder}
          text="Create Folder"
          onClick={() => {
            toggleFolderDrawer(true);
            handleCreateClose();
          }}
        />
      </Menu>
      <SetlistFolderDrawer
        openDrawer={openDrawer}
        toggleFolderDrawer={toggleFolderDrawer}
        setFolderId={setFolderId}
        setFolderName={setFolderName}
        setFolderCreated={setFolderCreated}
        folderId={folderId}
        folderName={folderName}
        folderCreated={folderCreated}
        mode={'create'}
      />
    </>
  );
};

export default SetlistActionMenu;
