import React from 'react';
import { useDispatch } from 'react-redux';
import {
  ListItem,
  ListItemText,
  ListItemAvatar,
  ListItemSecondaryAction,
  Avatar,
  Typography,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  PersonOutline,
  PersonAdd,
  Visibility
} from '@mui/icons-material';
import { useToast } from '../../hooks/use-toast';
import axiosInstance from '../../lib/axios';
import { setUser } from '../../features/auth/authSlice';

const SearchsearchUsersListItem = ({ searchUser, onViewProfile }) => {
  const dispatch = useDispatch();
  const { toast } = useToast();

  console.log('Search User:', searchUser);
  const onSendFriendRequest = async (searchUser) => {
    console.log('Send friend request to:', searchUser);
    try {
      const response = await axiosInstance.post(`/users/${searchUser._id}/request`);
      console.log('Friend request sent:', response.data);
      // const searchUserData = response.data.searchUsers;

      if (response.status === 200) {
        dispatch(setUser(response.data.user));
        toast({
          title: "Success",
          description: "Profile updated successfully"
        });
      }
    } catch (error) {
      console.error('Error fetching search results:', error);
    }
  }

  return (
    <ListItem
      alignItems="flex-start"
      sx={{
        '&:hover': {
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
        },
        borderRadius: 1,
        mb: 0.5,
        pr: 12 // Add padding for the action buttons
      }}
    >
      <ListItemAvatar>
        <Avatar sx={{ bgcolor: 'primary.main' }}>
          <PersonOutline />
        </Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={
          <Typography variant="subtitle1" color="white">
            {searchUser.name || searchUser.username}
          </Typography>
        }
        secondary={
          <Typography
            component="span"
            variant="body2"
            color="grey.400"
            sx={{ display: 'block' }}
          >
            @{searchUser.username}
          </Typography>
        }
      />
      <ListItemSecondaryAction>
        <Tooltip title="View Profile">
          <IconButton
            onClick={() => onViewProfile?.(searchUser)}
            size="small"
            sx={{
              color: 'grey.400',
              '&:hover': { color: 'white' },
              mr: 1
            }}
          >
            <Visibility fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Send Friend Request">
          <IconButton
            onClick={() => onSendFriendRequest?.(searchUser)}
            size="small"
            sx={{
              color: 'grey.400',
              '&:hover': { color: 'white' }
            }}
          >
            <PersonAdd fontSize="small" />
          </IconButton>
        </Tooltip>
      </ListItemSecondaryAction>
    </ListItem>
  );
};

export default SearchsearchUsersListItem;