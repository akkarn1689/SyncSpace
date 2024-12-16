import React, { useState, useEffect } from 'react';
import useDebounce from '@/src/hooks/useDebounce';
import axios from '@/src/lib/axios';

const SearchUsers = () => {
  const [inputValue, setInputValue] = useState('');
  const debouncedInputValue = useDebounce(inputValue, 800); // Debounce with 300ms delay

  // Simulate an API call with debouncedInputValue
  const fetchSearchResults = async (query) => {
    
    console.log('Fetching results for:', query);

    const response = await axios.get(`/users/search?query=${query}&page=1&limit=10`);
    console.log("Search response:", response);
  };

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  // Trigger API call with debounced input value
  useEffect(() => {
    if(inputValue) fetchSearchResults(debouncedInputValue);
  }, [debouncedInputValue]);

  return (
    <div className='flex justify-center items-center w-56 lg:w-96'>
      {/* <h1>Instant Search with useDebounce</h1> */}
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        placeholder="Search users..."
        className='border border-gray-300 text-white rounded-lg p-2 w-[100%]'
      />
      {/* <p>Search results will appear here.</p> */}
    </div>
  );
};

export default SearchUsers;