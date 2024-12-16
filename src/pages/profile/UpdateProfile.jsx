import { useSelector, useDispatch } from 'react-redux';
import React, { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter
} from '@/src/components/ui/dialog';
import { Button } from '../../components/ui/button';
import { Checkbox } from '../../components/ui/checkbox';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Label } from '../../components/ui/label';
import { ImagePlus, Loader2 } from 'lucide-react';
import { useToast } from '../../hooks/use-toast';
import axios from '../../lib/axios';
import { setUser } from '../../features/auth/authSlice';

const UpdateProfileModal = ({ isOpen, onClose, user }) => {
    const dispatch = useDispatch();
    const { toast } = useToast();
    // const { user, token, isLoading, error } = useSelector((state) => state.auth);

    const [isLoading, setIsLoading] = useState(false);
    const [selectedFields, setSelectedFields] = useState({
        name: false,
        email: false,
        mobile: false,
        userbio: false,
        profilePicture: false
    });

    const [formData, setFormData] = useState({
        name: user.name || '',
        email: user.email || '',
        mobile: user.mobile || '',
        userbio: user.userbio || '',
        profilePicture: null
    });

    const [previewImage, setPreviewImage] = useState(null);


    const handleCheckboxChange = (field) => {
        setSelectedFields(prev => ({
            ...prev,
            [field]: !prev[field]
        }));
    };

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

            // Create preview URL
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async () => {
        try {
            setIsLoading(true);

            // Create update object only with selected fields
            const updates = {};
            Object.keys(selectedFields).forEach(field => {
                if (selectedFields[field] && field !== 'profilePicture') {
                    updates[field] = formData[field];
                }
            });

            // Only proceed if there are fields to update
            if (Object.keys(updates).length === 0 && !selectedFields.profilePicture) {
                toast({
                    title: "No updates selected",
                    description: "Please select at least one field to update",
                    variant: "destructive"
                });
                return;
            }

            // console.log("user:", user);
            // Profile update API call
            if (Object.keys(updates).length > 0) {
                const response = await axios.put(`/users/${user._id}/profile`, { ...updates });

                if (response.status!=200) {
                    throw new Error('Failed to update profile');
                }

                // console.log("response:", response);

                if(response.status==200){
                    dispatch(setUser(response.data.user));
                }


                // onClose();
            }

            // Handle profile picture upload separately if selected
            // if (selectedFields.profilePicture && formData.profilePicture) {
            //     // You'll implement the profile picture upload logic here
            //     // This is a placeholder for the actual implementation
            //     console.log('Profile picture will be uploaded:', formData.profilePicture);
            // }

            toast({
                title: "Success",
                description: "Profile updated successfully",
            });

            onClose();
        } catch (error) {
            toast({
                title: "Error",
                description: error.message || "Failed to update profile",
                variant: "destructive"
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog className="" open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Update Profile</DialogTitle>
                </DialogHeader>

                <div className="grid gap-6 py-4">
                    {/* Profile Picture Section */}
                    <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                className="bg-white"
                                id="profilePicture"
                                checked={selectedFields.profilePicture}
                                onCheckedChange={() => handleCheckboxChange('profilePicture')}
                            />
                            <Label htmlFor="profilePicture">Update Profile Picture</Label>
                        </div>
                        {selectedFields.profilePicture && (
                            <div className="mt-2 space-y-2">
                                <div className="flex items-center justify-center">
                                    {previewImage ? (
                                        <img
                                            src={previewImage}
                                            alt="Preview"
                                            className="w-24 h-24 rounded-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
                                            <ImagePlus className="h-8 w-8 text-gray-400" />
                                        </div>
                                    )}
                                </div>
                                <Input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="mt-2"
                                />
                            </div>
                        )}
                    </div>

                    {/* Name Field */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    className="bg-white"
                                    id="name"
                                    checked={selectedFields.name}
                                    onCheckedChange={() => handleCheckboxChange('name')}
                                />
                                <Label htmlFor="name">Name</Label>
                            </div>
                            <span className="text-sm text-gray-500">{user.name}</span>
                        </div>
                        {selectedFields.name && (
                            <Input
                                value={formData.name}
                                onChange={(e) => handleInputChange('name', e.target.value)}
                                placeholder="Enter new name"
                            />
                        )}
                    </div>

                    {/* Email Field */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    className="bg-white"
                                    id="email"
                                    checked={selectedFields.email}
                                    onCheckedChange={() => handleCheckboxChange('email')}
                                />
                                <Label htmlFor="email">Email</Label>
                            </div>
                            <span className="text-sm text-gray-500">{user.email}</span>
                        </div>
                        {selectedFields.email && (
                            <Input
                                type="email"
                                value={formData.email}
                                onChange={(e) => handleInputChange('email', e.target.value)}
                                placeholder="Enter new email"
                            />
                        )}
                    </div>

                    {/* Mobile Field */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    className="bg-white"
                                    id="mobile"
                                    checked={selectedFields.mobile}
                                    onCheckedChange={() => handleCheckboxChange('mobile')}
                                />
                                <Label htmlFor="mobile">Mobile</Label>
                            </div>
                            <span className="text-sm text-gray-500">{user.mobile}</span>
                        </div>
                        {selectedFields.mobile && (
                            <Input
                                type="tel"
                                value={formData.mobile}
                                onChange={(e) => handleInputChange('mobile', e.target.value)}
                                placeholder="Enter new mobile number"
                            />
                        )}
                    </div>

                    {/* Bio Field */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    className="bg-white"
                                    id="userbio"
                                    checked={selectedFields.userbio}
                                    onCheckedChange={() => handleCheckboxChange('userbio')}
                                />
                                <Label htmlFor="userbio">Bio</Label>
                            </div>
                            <span className="text-sm text-gray-500 truncate max-w-[200px]">
                                {user.userbio || 'No bio'}
                            </span>
                        </div>
                        {selectedFields.userbio && (
                            <Textarea
                                value={formData.userbio}
                                onChange={(e) => handleInputChange('userbio', e.target.value)}
                                placeholder="Enter new bio"
                                className="h-20"
                            />
                        )}
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} disabled={isLoading}>
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Save Changes
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default UpdateProfileModal;