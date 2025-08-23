import { useTheme } from '@mui/material/styles';
import { Add, Folder, QueueMusic } from '@mui/icons-material';
import { Box, Collapse, Fab, Slide, useMediaQuery } from '@mui/material';
import { FC, useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SetlistFolderDrawer from './SetlistFolderDrawer';

// Types
interface SetlistPageActionMenuProps {
  anchorEl: HTMLElement | null;
  setAnchorEl: React.Dispatch<React.SetStateAction<HTMLElement | null>>;
}

interface MenuPosition {
  top: number;
  left: number;
}

interface ActionItem {
  icon: React.ElementType;
  label: string;
  action: () => void;
  ariaLabel: string;
}

// Constants
const ANIMATION_DURATION = 300;
const MENU_GAP = 16;
const FAB_SIZE = 64;
const MOBILE_NAVBAR_HEIGHT = 80;

const STYLES = {
  baseFab: {
    padding: '8px 16px',
    borderRadius: '1rem',
    gap: '0.5rem',
    transition: 'all 0.2s ease-in-out',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    '&:active': {
      transform: 'scale(0.95)',
    },
  },
  primaryFab: {
    backgroundColor: '#D0BCFF',
    color: '#381E72',
    '&:hover': {
      backgroundColor: '#D0BCFF',
      opacity: 0.95,
    },
  },
  secondaryFab: {
    backgroundColor: '#171717',
    color: 'secondary.main',
    border: '1px solid #938F99',
    '&:hover': {
      borderColor: 'secondary.main',
      backgroundColor: 'rgba(208, 188, 255, 0.15)',
    },
  },
  desktopSecondaryFab: {
    backgroundColor: '#171717',
    color: 'secondary.main',
    border: '1px solid #938F99',
    padding: '12px 24px',
    fontSize: '1rem',
    '&:hover': {
      borderColor: 'secondary.main',
      backgroundColor: '#171717',
    },
  },
  icon: {
    fontSize: '1.5rem',
  },
} as const;

// Custom Hooks
const useBreakpoints = () => {
  const theme = useTheme();
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'lg'));
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'));
  const isMobile = !isTablet && !isDesktop;

  return { isMobile, isTablet, isDesktop };
};

const useMenuPosition = (anchorEl: HTMLElement | null) => {
  const [position, setPosition] = useState<MenuPosition>({ top: 0, left: 0 });

  useEffect(() => {
    if (anchorEl) {
      const rect = anchorEl.getBoundingClientRect();
      setPosition({
        top: rect.bottom + window.scrollY + MENU_GAP,
        left: rect.left + window.scrollX + rect.width / 2 - FAB_SIZE,
      });
    }
  }, [anchorEl]);

  return position;
};

const useOutsideClick = (
  ref: React.RefObject<HTMLElement>,
  anchorEl: HTMLElement | null,
  isOpen: boolean,
  onClose: () => void
) => {
  useEffect(() => {
    const handleClickOutside = (event: globalThis.MouseEvent) => {
      const target = event.target as Node;

      if (
        isOpen &&
        ref.current &&
        !ref.current.contains(target) &&
        anchorEl &&
        !anchorEl.contains(target)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }

    // Return undefined for the case when isOpen is false
    return undefined;
  }, [isOpen, anchorEl, onClose, ref]);
};

const useFolderDrawer = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [folderId, setFolderId] = useState('');
  const [folderName, setFolderName] = useState('');
  const [folderCreated, setFolderCreated] = useState('');

  const toggle = useCallback((newOpen: boolean) => {
    setIsOpen(newOpen);
  }, []);

  const reset = useCallback(() => {
    setFolderId('');
    setFolderName('');
    setFolderCreated('');
  }, []);

  return {
    isOpen,
    folderId,
    folderName,
    folderCreated,
    toggle,
    reset,
    setFolderId,
    setFolderName,
    setFolderCreated,
  };
};

// Utility Functions
const calculateMobilePosition = (index: number) => ({
  bottom: `calc(${MOBILE_NAVBAR_HEIGHT}px + 1rem + ${FAB_SIZE * index}px)`,
});

const calculateDesktopPosition = (index: number) => ({
  top: `${FAB_SIZE * index}px`,
});

// Sub-components
const AnimatedFab: FC<{
  isVisible: boolean;
  children: React.ReactNode;
  onClick: () => void;
  ariaLabel: string;
  sx: object;
  delay?: number;
}> = ({ isVisible, children, onClick, ariaLabel, sx, delay = 0 }) => (
  <Collapse in={isVisible} timeout={ANIMATION_DURATION}>
    <Slide
      in={isVisible}
      direction="up"
      timeout={ANIMATION_DURATION}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <Fab variant="extended" aria-label={ariaLabel} onClick={onClick} sx={sx}>
        {children}
      </Fab>
    </Slide>
  </Collapse>
);

const MobileActionMenu: FC<{
  isOpen: boolean;
  onToggle: (event: React.MouseEvent) => void;
  actionItems: ActionItem[];
}> = ({ isOpen, onToggle, actionItems }) => (
  <>
    {actionItems.map((item, index) => (
      <AnimatedFab
        key={item.label}
        isVisible={isOpen}
        onClick={item.action}
        ariaLabel={item.ariaLabel}
        delay={index * 50}
        sx={{
          ...STYLES.baseFab,
          ...STYLES.secondaryFab,
          position: 'fixed',
          right: '1rem',
          zIndex: 1000,
          ...calculateMobilePosition(actionItems.length - index),
        }}
      >
        <item.icon sx={STYLES.icon} />
        {item.label}
      </AnimatedFab>
    ))}

    <Fab
      variant="extended"
      aria-label={isOpen ? 'Close menu' : 'Open create menu'}
      onClick={onToggle}
      sx={{
        ...STYLES.baseFab,
        ...STYLES.primaryFab,
        position: 'fixed',
        right: '1rem',
        bottom: `calc(${MOBILE_NAVBAR_HEIGHT}px + 1rem)`,
        zIndex: 1100,
      }}
    >
      <Add
        sx={{
          ...STYLES.icon,
          transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)',
        }}
      />
      New
    </Fab>
  </>
);

const DesktopActionMenu: FC<{
  isOpen: boolean;
  position: MenuPosition;
  actionItems: ActionItem[];
  menuRef: React.RefObject<HTMLDivElement>;
}> = ({ isOpen, position, actionItems, menuRef }) => (
  <Box
    ref={menuRef}
    sx={{
      position: 'fixed',
      top: position.top,
      left: position.left,
      zIndex: 1300,
    }}
  >
    {actionItems.map((item, index) => (
      <Collapse key={item.label} in={isOpen} timeout={ANIMATION_DURATION}>
        <Slide
          in={isOpen}
          direction="down"
          timeout={ANIMATION_DURATION}
          style={{ transitionDelay: `${index * 50}ms` }}
        >
          <Fab
            variant="extended"
            aria-label={item.ariaLabel}
            onClick={item.action}
            sx={{
              ...STYLES.baseFab,
              ...STYLES.desktopSecondaryFab,
              position: 'absolute',
              ...calculateDesktopPosition(index),
            }}
          >
            <item.icon sx={STYLES.icon} />
            {item.label}
          </Fab>
        </Slide>
      </Collapse>
    ))}
  </Box>
);

// Main Component
const SetlistPageActionMenu: FC<SetlistPageActionMenuProps> = ({ anchorEl, setAnchorEl }) => {
  const navigate = useNavigate();
  const { isMobile, isTablet, isDesktop } = useBreakpoints();
  const menuPosition = useMenuPosition(anchorEl);
  const folderDrawer = useFolderDrawer();

  // Menu state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isDesktopMenuOpen = Boolean(anchorEl);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu handler
  const closeMenu = useCallback(() => {
    setAnchorEl(null);
    setIsMobileMenuOpen(false);
  }, [setAnchorEl]);

  // Outside click handling for desktop
  useOutsideClick(menuRef, anchorEl, isDesktopMenuOpen, closeMenu);

  // Action handlers
  const handleCreateSetlist = useCallback(() => {
    navigate('/setlist/add');
    closeMenu();
  }, [navigate, closeMenu]);

  const handleCreateFolder = useCallback(() => {
    folderDrawer.reset();
    folderDrawer.toggle(true);
    closeMenu();
  }, [folderDrawer, closeMenu]);

  const handleMobileToggle = useCallback((event: React.MouseEvent) => {
    event.stopPropagation();
    setIsMobileMenuOpen((prev) => !prev);
  }, []);

  // Action items configuration
  const actionItems: ActionItem[] = [
    {
      icon: QueueMusic,
      label: 'Setlist',
      action: handleCreateSetlist,
      ariaLabel: 'Create new setlist',
    },
    {
      icon: Folder,
      label: 'Folder',
      action: handleCreateFolder,
      ariaLabel: 'Create new folder',
    },
  ];

  return (
    <>
      {/* Mobile Menu */}
      {isMobile && (
        <MobileActionMenu
          isOpen={isMobileMenuOpen}
          onToggle={handleMobileToggle}
          actionItems={actionItems}
        />
      )}

      {/* Desktop/Tablet Menu */}
      {(isTablet || isDesktop) && isDesktopMenuOpen && (
        <DesktopActionMenu
          isOpen={isDesktopMenuOpen}
          position={menuPosition}
          actionItems={actionItems}
          menuRef={menuRef}
        />
      )}

      {/* Folder Drawer */}
      <SetlistFolderDrawer
        openDrawer={folderDrawer.isOpen}
        toggleFolderDrawer={folderDrawer.toggle}
        setFolderId={folderDrawer.setFolderId}
        setFolderName={folderDrawer.setFolderName}
        setFolderCreated={folderDrawer.setFolderCreated}
        folderId={folderDrawer.folderId}
        folderName={folderDrawer.folderName}
        folderCreated={folderDrawer.folderCreated}
        mode="create"
      />
    </>
  );
};

export default SetlistPageActionMenu;
