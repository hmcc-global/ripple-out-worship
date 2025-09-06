import { FC, ReactElement, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppBar, Box, Toolbar, IconButton, InputBase, Stack } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { customAxios as axios } from '../custom/customAxios';

const SearchBar: FC = (): ReactElement => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = async () => {
    try {
      // Make the API call to fetch the search results
      const response = await axios.get('/api/songs/get');

      // Navigate to the search results page with the search query as a parameter
      navigate(`/song?q=${searchQuery}`);
    } catch (error) {
      console.error('Error searching:', error);
    }
  };

  return (
    <Box>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{ bgcolor: '#171717', alignItems: 'center', py: 1 }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Stack
            sx={{
              alignItems: 'center',
              boxShadow:
                '0px 1px 2px 0px rgba(0, 0, 0, 0.20), 0px 0.1px 0.3px 0px rgba(0, 0, 0, 0.10)',
              width: '40vw',
              background: '#2B2930',
              borderRadius: '100px',
            }}
            direction="row"
          >
            {/* TODO: Add search functionality */}
            <IconButton onClick={handleSearch}>
              <SearchIcon sx={{ mx: 2, color: '#CAC4D0' }} />
            </IconButton>
            <InputBase
              placeholder="Search songs, keywords, etc..."
              sx={{ my: 1.5, color: '#CAC4D0', backgroundColor: '#2B2930', width: '80%' }}
              id="search-bar"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
              }}
            />
          </Stack>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default SearchBar;
