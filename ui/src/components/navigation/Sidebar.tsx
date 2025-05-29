import { FC, ReactElement, useState, useEffect } from 'react';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useMediaQuery,
} from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import QueueMusicIcon from '@mui/icons-material/QueueMusic';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import Language from '@mui/icons-material/Language';
import Person from '@mui/icons-material/Person';
import GlobalSearchModal from './GlobalSearchModal';
import SearchIcon from '@mui/icons-material/Search';
import { useSetlists, useSongs } from '../../helpers/customHooks';
import { SongSchema } from '../../types/song.types';
import { Setlist } from '../../types/setlist.types';
import { SearchButtonBox } from './NavigationPaper';
import { drawerWidth, mobileNavbarHeight } from '../../constants';

const SideBar: FC = (): ReactElement => {
  const navigate = useNavigate();
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const isDesktop = useMediaQuery('(min-width: 769px)');

  const allSongs = useSongs() as SongSchema[];
  const allSetlists = useSetlists() as Setlist[];

  const location = useLocation();

  const DesktopDrawer = {
    width: drawerWidth,
    flexShrink: 0,
    '& .MuiDrawer-paper': {
      width: drawerWidth,
      boxSizing: 'border-box',
      ...(isDesktop && { position: 'relative' }),
      backgroundColor: 'primary.darkest',
    },
    minHeight: '100%',
  };

  const MobileDrawer = {
    minWidth: '100%',
    flexShrink: 0,
    '& .MuiDrawer-paper': {
      height: mobileNavbarHeight,
      boxSizing: 'border-box',
      flexDirection: 'row',
      overflow: 'hidden',
      ...(isDesktop && { position: 'relative' }),
      backgroundColor: 'primary.darkest',
    },
    height: mobileNavbarHeight,
  };

  useEffect(() => {
    const path = location.pathname;
    if (path === '/') setSelectedItem('Home');
    if (path.includes('song')) setSelectedItem('Songs');
    if (path.includes('setlist')) setSelectedItem('Setlists');
    if (path.includes('resource')) setSelectedItem('Resources');
    if (path.includes('profile')) setSelectedItem('Profile');
  }, [location]);

  // Separate the "Profile" item from the rest of the items
  const topMenuItems = [
    { icon: <Language />, text: 'Home', path: '' },
    { icon: <MusicNoteIcon />, text: 'Songs', path: 'song' },
    { icon: <QueueMusicIcon />, text: 'Setlists', path: 'setlist' },
    { icon: <TextSnippetIcon />, text: 'Resources', path: 'resource' },
    { icon: <Person />, text: 'Profile', path: 'profile' },
  ];

  const profileMenuItem = { icon: <Person />, text: 'Profile', path: 'profile' };

  const mobileMenuItems = [
    { icon: <Language />, text: 'Home', path: '' },
    { icon: <MusicNoteIcon />, text: 'Songs', path: 'song' },
    { icon: <SearchIcon />, text: 'Search', path: '' }, // Open modal
    { icon: <QueueMusicIcon />, text: 'Setlists', path: 'setlist' },
    { icon: <Person />, text: 'Profile', path: 'profile' },
  ];

  const menuItems = isMobile ? mobileMenuItems : topMenuItems;

  const handleClick = (text: string, path: string) => {
    setSelectedItem(text);
    navigate(`/${path}`);
  };

  const handleSearchClick = () => {
    onSearchOpen();
  };

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const onSearchClose = () => setIsSearchOpen(false);
  const onSearchOpen = () => setIsSearchOpen(true);

  return (
    <>
      <Box sx={{ display: 'flex', minHeight: '100%' }}>
        <Drawer
          sx={isMobile ? MobileDrawer : DesktopDrawer}
          variant="permanent"
          open={true}
          anchor={isMobile ? 'bottom' : 'left'}
        >
          {/* Global Search Button */}
          {isMobile ? null : (
            <Box
              sx={{
                display: 'flex',
                flexDir: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                mt: '1rem',
                mb: '0.2rem',
              }}
            >
              <SearchButtonBox onClick={() => handleSearchClick()}>
                <SearchIcon sx={{ color: '#D0BCFE', width: '1.75rem', height: '1.75rem' }} />
              </SearchButtonBox>
            </Box>
          )}
          <List
            sx={{
              display: 'flex',
              flexDirection: isMobile ? 'row' : 'column',
              justifyContent: 'flex-start',
              flex: '1',
            }}
          >
            {menuItems.map((item, index) => {
              if (isMobile && item.text === 'Search') {
                return (
                  <ListItem key={index} disablePadding sx={{ justifyContent: 'center', flex: 1 }}>
                    <SearchButtonBox onClick={handleSearchClick}>
                      <SearchIcon sx={{ color: '#D0BCFE', width: '1.75rem', height: '1.75rem' }} />
                    </SearchButtonBox>
                  </ListItem>
                );
              }

              // Normal menu item
              return (
                <ListItem key={index} disablePadding>
                  <ListItemButton
                    selected={selectedItem === item.text}
                    //TODO: remove when resources page is done
                    disabled={item.text === 'Resources'}
                    onClick={() => handleClick(item.text, item.path)}
                    sx={{
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      px: 1,
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        color: 'primary.lighter',
                        backgroundColor: selectedItem === item.text ? 'primary.main' : '',
                        borderRadius: '100px',
                        alignItems: 'center',
                        justifyContent: 'center',
                        paddingY: '5px',
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText
                      primaryTypographyProps={{
                        sx: { color: 'primary.lighter' },
                        variant: 'subtitle2',
                        fontWeight: 700,
                      }}
                      primary={item.text}
                    />
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>

          <List
            sx={{
              display: isMobile ? 'none' : 'flex',
              flexDirection: 'column',
            }}
          >
            <ListItem disablePadding>
              <ListItemButton
                selected={selectedItem === profileMenuItem.text}
                onClick={() => handleClick(profileMenuItem.text, profileMenuItem.path)}
                sx={{
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  px: 1,
                }}
              >
                <ListItemIcon
                  sx={{
                    color: 'primary.lighter',
                    backgroundColor: selectedItem === profileMenuItem.text ? 'primary.main' : '',
                    borderRadius: '100px',
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingY: '5px',
                  }}
                >
                  {profileMenuItem.icon}
                </ListItemIcon>

                <ListItemText
                  primaryTypographyProps={{
                    sx: { color: 'primary.lighter' },
                    variant: 'subtitle2',
                    fontWeight: 700,
                  }}
                  primary={profileMenuItem.text}
                />
              </ListItemButton>
            </ListItem>
          </List>
        </Drawer>
      </Box>
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={onSearchClose}
        allSongs={allSongs}
        allSetlists={allSetlists}
      />
    </>
  );
};

export default SideBar;
