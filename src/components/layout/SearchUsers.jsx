import React, { useState, useEffect } from 'react';
import { 
  TextField, 
  Box, 
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Typography,
  Paper,
  CircularProgress
} from '@mui/material';
import { PersonOutline } from '@mui/icons-material';
import useDebounce from '@/src/hooks/useDebounce';
import axiosInstance from '../../lib/axios';

// SearchUsersListItem Component
import SearchUsersListItem from './SearchUserListItem';

// SearchUsers Component
const SearchUsers = () => {
  const [inputValue, setInputValue] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const debouncedInputValue = useDebounce(inputValue, 800);

  const fetchSearchResults = async (query) => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get(`/users/search?query=${query}&page=1&limit=10`);
      console.log('Search results:', response.data.users);
      setSearchResults(response.data.users);
    } catch (error) {
      console.error('Error fetching search results:', error);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (debouncedInputValue) {
      fetchSearchResults(debouncedInputValue);
    } else {
      setSearchResults([]);
    }
  }, [debouncedInputValue]);

  return (
    <Box sx={{ width: '100%', maxWidth: '100%' }}>
      <TextField
        fullWidth
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Search users..."
        size="small"
        variant="outlined"
        sx={{
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: 'grey.300',
            },
            '&:hover fieldset': {
              borderColor: 'grey.100',
            },
            '&.Mui-focused fieldset': {
              borderColor: 'primary.main',
            },
          },
          input: {
            color: 'white',
          },
        }}
      />

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <CircularProgress size={24} />
        </Box>
      ) : searchResults.length > 0 ? (
        <Paper 
          elevation={3}
          sx={{ 
            mt: 1, 
            bgcolor: 'background.paper',
            borderRadius: 2,
            maxHeight: 400,
            overflow: 'auto'
          }}
        >
          <List sx={{ p: 0.5 }}>
            {searchResults?.map((searchUser) => (
              <SearchUsersListItem key={searchUser._id} searchUser={searchUser} />
            ))}
          </List>
        </Paper>
      ) : inputValue && !isLoading ? (
        <Typography 
          color="grey.400" 
          sx={{ mt: 2, textAlign: 'center' }}
        >
          No users found
        </Typography>
      ) : null}
    </Box>
  );
};

export default SearchUsers;