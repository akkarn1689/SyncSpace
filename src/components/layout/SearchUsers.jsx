import React, { useState, useEffect } from 'react';
import { TextField, Box } from '@mui/material';
import useDebounce from '@/src/hooks/useDebounce';
import axiosInstance from '@/src/lib/axios';

const SearchUsers = () => {
 const [inputValue, setInputValue] = useState('');
 const debouncedInputValue = useDebounce(inputValue, 800);

 const fetchSearchResults = async (query) => {
   const response = await axiosInstance.get(`/users/search?query=${query}&page=1&limit=10`);
   console.log("Search response:", response);
 };

 useEffect(() => {
   if(inputValue) fetchSearchResults(debouncedInputValue);
 }, [debouncedInputValue]);

 return (
   <Box sx={{ width: { xs: 224, lg: 384 }, display: 'flex', justifyContent: 'center' }}>
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
         },
         input: {
           color: 'white',
         },
       }}
     />
   </Box>
 );
};

export default SearchUsers;