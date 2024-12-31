import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../features/auth/hooks/useAuth';
import {
 AppBar,
 Box,
 Button,
 Container,
 IconButton,
 Menu,
 MenuItem,
 Toolbar,
 Typography,
 Divider,
} from '@mui/material';
import {
 Person as UserIcon,
 Group as GroupIcon,
 Chat as ChatIcon,
 Notifications as NotificationsIcon
} from '@mui/icons-material';
import SearchUsers from './SearchUsers';

const Navbar = () => {
 const { user, logout, isAuthenticated } = useAuth();
 const [anchorEl, setAnchorEl] = React.useState(null);

 const handleMenuOpen = (event) => {
   setAnchorEl(event.currentTarget);
 };

 const handleMenuClose = () => {
   setAnchorEl(null);
 };

 const NavigationLinks = ({ isMobile = false }) => {
   const links = [
     { to: '/groups', icon: <GroupIcon />, label: 'Groups' },
     { to: '/chat', icon: <ChatIcon />, label: 'Chat' },
     { to: '/notifications', icon: <NotificationsIcon />, label: 'Notifications' }
   ];

   if (isMobile) {
     return links.map((link) => (
       <MenuItem 
         key={link.to} 
         component={Link} 
         to={link.to} 
         onClick={handleMenuClose}
         sx={{ gap: 1 }}
       >
         {link.icon}
         {link.label}
       </MenuItem>
     ));
   }

   return (
     <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 3 }}>
       {links.map((link) => (
         <Button
           key={link.to}
           component={Link}
           to={link.to}
           color="inherit"
           startIcon={link.icon}
         >
           {link.label}
         </Button>
       ))}
     </Box>
   );
 };

 return (
   <AppBar position="sticky">
     <Container maxWidth="xl">
       <Toolbar>
         {/* Logo */}
         <Typography
           variant="h6"
           component={Link}
           to="/"
           sx={{
             display: 'flex',
             alignItems: 'center',
             textDecoration: 'none',
             color: 'inherit'
           }}
         >
           <Box component="svg"
             xmlns="http://www.w3.org/2000/svg"
             viewBox="0 0 24 24"
             fill="none"
             stroke="currentColor"
             strokeWidth="2"
             strokeLinecap="round"
             strokeLinejoin="round"
             sx={{ height: 24, width: 24, mr: 1 }}
           >
             <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
           </Box>
           SyncSpace
         </Typography>

         {/* Search */}
         <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
           <SearchUsers />
         </Box>

         {/* Navigation & Auth */}
         <NavigationLinks />
         
         {isAuthenticated ? (
           <>
             <IconButton
               color="inherit"
               onClick={handleMenuOpen}
               sx={{ ml: 2 }}
             >
               <UserIcon />
             </IconButton>
             <Menu
               anchorEl={anchorEl}
               open={Boolean(anchorEl)}
               onClose={handleMenuClose}
               anchorOrigin={{
                 vertical: 'bottom',
                 horizontal: 'right',
               }}
             >
               <Box sx={{ display: { md: 'none' } }}>
                 <NavigationLinks isMobile />
                 <Divider />
               </Box>
               <MenuItem 
                 component={Link} 
                 to="/profile"
                 onClick={handleMenuClose}
                 sx={{ gap: 1 }}
               >
                 <UserIcon fontSize="small" />
                 Profile
               </MenuItem>
               <MenuItem onClick={() => {
                 handleMenuClose();
                 logout();
               }}>
                 Logout
               </MenuItem>
             </Menu>
           </>
         ) : (
           <Button
             component={Link}
             to="/login"
             color="inherit"
           >
             Login
           </Button>
         )}
       </Toolbar>
     </Container>
   </AppBar>
 );
};

export default Navbar;