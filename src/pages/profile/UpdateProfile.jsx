import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    Box, Avatar, Typography, Button, IconButton,
    TextField, CircularProgress
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { AccountCircle, PhotoCamera, Edit } from '@mui/icons-material';
import { useToast } from '../../hooks/use-toast';
import axiosInstance from '../../lib/axios';
import { setUser } from '../../features/auth/authSlice';

const StyledTextField = styled(TextField)(({ theme }) => ({
    marginBottom: theme.spacing(2),
    '& .MuiOutlinedInput-root': {
        '& fieldset': {
            borderColor: theme.palette.divider,
        },
        '&:hover fieldset': {
            borderColor: theme.palette.primary.main,
        },
    },
}));

const UpdateProfileModal = ({ open, onClose, user }) => {
    const dispatch = useDispatch();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        mobile: user?.mobile || '',
        userbio: user?.userbio || '',
        profilePicture: null
    });
    const [previewImage, setPreviewImage] = useState(null);

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({
                ...prev,
                profilePicture: file
            }));
            const reader = new FileReader();
            reader.onloadend = () => setPreviewImage(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async () => {
        try {
            setIsLoading(true);
            const updates = Object.fromEntries(
                Object.entries(formData).filter(([key, value]) => 
                    value !== user[key] && key !== 'profilePicture'
                )
            );

            if (Object.keys(updates).length === 0) {
                toast({
                    title: "No changes detected",
                    description: "Please make some changes to update",
                    variant: "warning"
                });
                return;
            }

            const response = await axiosInstance.put(`/users/${user._id}/profile`, updates);
            
            if (response.status === 200) {
                dispatch(setUser(response.data.user));
                toast({
                    title: "Success",
                    description: "Profile updated successfully"
                });
                onClose();
            }
        } catch (error) {
            toast({
                title: "Error",
                description: error.message || "Failed to update profile",
                variant: "error"
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>
                <Box display="flex" alignItems="center" gap={2}>
                    <Edit color="primary" />
                    <Typography variant="h6">Update Profile</Typography>
                </Box>
            </DialogTitle>
            <DialogContent>
                <Box display="flex" flexDirection="column" gap={2} mt={2}>
                    <Box display="flex" justifyContent="center" mb={2}>
                        <input
                            type="file"
                            accept="image/*"
                            id="profile-picture-input"
                            hidden
                            onChange={handleImageChange}
                        />
                        <label htmlFor="profile-picture-input">
                            <Avatar
                                sx={{
                                    width: 100,
                                    height: 100,
                                    cursor: 'pointer',
                                    '&:hover': { opacity: 0.8 }
                                }}
                                src={previewImage}
                            >
                                {!previewImage && <AccountCircle sx={{ fontSize: 60 }} />}
                            </Avatar>
                        </label>
                    </Box>

                    <StyledTextField
                        fullWidth
                        label="Name"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                    />
                    <StyledTextField
                        fullWidth
                        label="Email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                    />
                    <StyledTextField
                        fullWidth
                        label="Mobile"
                        value={formData.mobile}
                        onChange={(e) => handleInputChange('mobile', e.target.value)}
                    />
                    <StyledTextField
                        fullWidth
                        label="Bio"
                        multiline
                        rows={4}
                        value={formData.userbio}
                        onChange={(e) => handleInputChange('userbio', e.target.value)}
                    />
                </Box>
            </DialogContent>
            <DialogActions sx={{ p: 3 }}>
                <Button onClick={onClose} disabled={isLoading}>
                    Cancel
                </Button>
                <Button
                    variant="contained"
                    onClick={handleSubmit}
                    disabled={isLoading}
                    startIcon={isLoading && <CircularProgress size={20} />}
                >
                    {isLoading ? 'Saving...' : 'Save Changes'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default UpdateProfileModal;