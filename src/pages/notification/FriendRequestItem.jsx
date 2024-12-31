// FriendRequestItem.jsx
import { Button, Avatar, Box, Typography } from '@mui/material';
import { Person, Check, Close, Send } from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const RequestButton = styled(Button)(({ theme, color }) => ({
  minWidth: 40,
  width: 40,
  height: 40,
  borderRadius: '50%',
  backgroundColor: `${color}20`,
  '&:hover': {
    backgroundColor: `${color}30`,
  },
  '& .MuiSvgIcon-root': {
    color: color,
  }
}));

const FriendRequestItem = ({ request, type, onAccept, onDecline, isLoading }) => {
  return (
    <Box sx={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      p: 2,
      borderRadius: 2,
      bgcolor: 'rgba(255, 255, 255, 0.05)',
      '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.1)' },
      transition: 'background-color 0.2s'
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Avatar sx={{ bgcolor: 'rgba(255, 255, 255, 0.2)' }}>
          <Person />
        </Avatar>
        <Box>
          <Typography variant="subtitle1" color="white">{request.name}</Typography>
          <Typography variant="body2" color="text.secondary">@{request.username}</Typography>
        </Box>
      </Box>

      {type === 'received' ? (
        <Box sx={{ display: 'flex', gap: 1 }}>
          <RequestButton
            color="#4caf50"
            onClick={() => onAccept(request._id)}
            disabled={isLoading}
          >
            <Check />
          </RequestButton>
          <RequestButton
            color="#f44336"
            onClick={() => onDecline(request._id)}
            disabled={isLoading}
          >
            <Close />
          </RequestButton>
        </Box>
      ) : (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'primary.light' }}>
          <Send fontSize="small" />
          <Typography variant="body2" color="text.secondary">Sent</Typography>
        </Box>
      )}
    </Box>
  );
};


export default FriendRequestItem;