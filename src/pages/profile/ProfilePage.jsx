// ProfilePage.jsx
import React, { useState } from 'react';
import { 
    Container, Paper, Avatar, Typography, Box, Tabs, Tab, Button,
    Grid, Card, CardContent, IconButton, useTheme
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
    AccountCircle, Edit, Email, Phone, 
    CalendarToday, Person
} from '@mui/icons-material';
import { useAuth } from '../../features/auth/hooks/useAuth';
import UpdateProfileModal from './UpdateProfile';
import FriendListSection from './FriendListSection';

const StyledPaper = styled(Paper)(({ theme }) => ({
    background: `linear-gradient(180deg, ${theme.palette.grey[900]} 0%, ${theme.palette.common.black} 100%)`,
    backdropFilter: 'blur(10px)',
    border: `1px solid ${theme.palette.grey[800]}`,
}));

const ProfileHeader = styled(Box)(({ theme }) => ({
    padding: theme.spacing(4),
    borderBottom: `1px solid ${theme.palette.divider}`,
}));

const GradientTypography = styled(Typography)(({ theme }) => ({
    background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
    backgroundClip: 'text',
    WebkitBackgroundClip: 'text',
    color: 'transparent',
}));

function TabPanel({ children, value, index, ...other }) {
    return (
        <div role="tabpanel" hidden={value !== index} {...other}>
            {value === index && <Box p={3}>{children}</Box>}
        </div>
    );
}

const ProfilePage = () => {
    const theme = useTheme();
    const { user, isLoading } = useAuth();
    const [tabValue, setTabValue] = useState(0);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

    if (isLoading) return (
        <Box display="flex" height="100vh" alignItems="center" justifyContent="center">
            <Typography>Loading...</Typography>
        </Box>
    );

    if (!user) return (
        <Box display="flex" height="100vh" alignItems="center" justifyContent="center">
            <Typography>No user data available</Typography>
        </Box>
    );

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <StyledPaper elevation={3}>
                <ProfileHeader>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Box display="flex" alignItems="center" gap={3}>
                            <Avatar
                                sx={{
                                    width: 80,
                                    height: 80,
                                    background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                                }}
                            >
                                <AccountCircle sx={{ fontSize: 50 }} />
                            </Avatar>
                            <Box>
                                <GradientTypography variant="h4" fontWeight="bold">
                                    {user.name}
                                </GradientTypography>
                                <Typography color="text.secondary">@{user.username}</Typography>
                            </Box>
                        </Box>
                        <Button
                            startIcon={<Edit />}
                            variant="contained"
                            onClick={() => setIsUpdateModalOpen(true)}
                            sx={{ bgcolor: 'primary.main' }}
                        >
                            Edit Profile
                        </Button>
                    </Box>
                </ProfileHeader>

                <Tabs
                    value={tabValue}
                    onChange={(e, newValue) => setTabValue(newValue)}
                    sx={{
                        borderBottom: 1,
                        borderColor: 'divider',
                        '& .MuiTab-root': {
                            color: 'text.secondary',
                            '&.Mui-selected': {
                                color: 'primary.main',
                            },
                        },
                    }}
                >
                    <Tab label="Profile Details" />
                    <Tab label="Friends" />
                </Tabs>

                <TabPanel value={tabValue} index={0}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <Box display="flex" flexDirection="column" gap={2}>
                                <Card variant="outlined" sx={{ bgcolor: 'background.paper' }}>
                                    <CardContent>
                                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                            Bio
                                        </Typography>
                                        <Typography>{user.userbio || 'No bio available'}</Typography>
                                    </CardContent>
                                </Card>

                                <Card variant="outlined" sx={{ bgcolor: 'background.paper' }}>
                                    <CardContent>
                                        <Box display="flex" alignItems="center" gap={2}>
                                            <Email color="primary" />
                                            <Typography>{user.email}</Typography>
                                        </Box>
                                    </CardContent>
                                </Card>

                                <Card variant="outlined" sx={{ bgcolor: 'background.paper' }}>
                                    <CardContent>
                                        <Box display="flex" alignItems="center" gap={2}>
                                            <Phone color="primary" />
                                            <Typography>{user.mobile}</Typography>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Box>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <Card variant="outlined" sx={{ bgcolor: 'background.paper' }}>
                                <CardContent>
                                    <Box display="flex" alignItems="center" gap={2}>
                                        <CalendarToday color="primary" />
                                        <Box>
                                            <Typography variant="subtitle2" color="text.secondary">
                                                Member Since
                                            </Typography>
                                            <Typography>
                                                {new Date(user.createdAt).toLocaleDateString()}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </TabPanel>

                <TabPanel value={tabValue} index={1}>
                    <FriendListSection
                        friends={user.friends}
                        onFriendRemoved={(friendId) => console.log('update user state here')}
                    />
                </TabPanel>
            </StyledPaper>

            <UpdateProfileModal
                open={isUpdateModalOpen}
                onClose={() => setIsUpdateModalOpen(false)}
                user={user}
            />
        </Container>
    );
};

export default ProfilePage;