import React, { useState } from 'react';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle
} from '../../components/ui/card';
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger
} from '../../components/ui/tabs';
import {
    UserCircle2,
    Users,
    Mail,
    Phone,
    CalendarDays,
    Pencil
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { useAuth } from '../../features/auth/hooks/useAuth';
import UpdateProfileModal from './UpdateProfile';
import FriendListSection from './FriendListSection';

const ProfilePage = () => {
    const { user, isLoading } = useAuth();
    const [activeTab, setActiveTab] = useState('profile');
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

    console.log('user', user);

    if (isLoading) return <div>Loading...</div>;
    if (!user) return <div>No user data available</div>;

    return (
        <div className="bg-black container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
                <Card className="bg-black text-white shadow-2xl border-none">
                    <CardHeader className="bg-black text-white p-6 rounded-t-xl">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
                                    <UserCircle2 size={64} className="text-white" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold">{user.name}</h2>
                                    <p className="italic text-white/40">@{user.username}</p>
                                </div>
                            </div>
                            <Button
                                variant="secondary"
                                className="bg-white/20 hover:bg-white/30 text-white"
                                onClick={() => setIsUpdateModalOpen(true)}
                            >
                                <Pencil className="mr-2" size={16} /> Edit Profile
                            </Button>
                        </div>
                    </CardHeader>

                    <Tabs
                        value={activeTab}
                        onValueChange={setActiveTab}
                        className="w-full"
                    >
                        <TabsList className="grid w-full grid-cols-2 bg-black text-white">
                            <TabsTrigger value="profile">Profile Details</TabsTrigger>
                            <TabsTrigger value="friends">Friends</TabsTrigger>
                        </TabsList>

                        <TabsContent value="profile">
                            <CardContent className="bg-black p-6 space-y-6">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <div>
                                            <p className="text-sm text-gray-400">Bio</p>
                                            <p className="italic text-gray-600">
                                                {user.userbio || 'No bio available'}
                                            </p>
                                        </div>
                                        <div className="flex items-center space-x-3">
                                            <Mail className="text-blue-500" />
                                            <div>
                                                {/* <p className="text-sm text-gray-500">Email</p> */}
                                                <p className="font-semibold">{user.email}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-3">
                                            <Phone className="text-green-500" />
                                            <div>
                                                {/* <p className="text-sm text-gray-500">Mobile</p> */}
                                                <p className="font-semibold">{user.mobile}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="flex items-center space-x-3">
                                            <CalendarDays className="text-purple-500" />
                                            <div>
                                                <p className="text-sm text-gray-500">Member Since</p>
                                                <p className="font-semibold">
                                                    {new Date(user.createdAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </CardContent>
                        </TabsContent>

                        <TabsContent value="friends" className="p-6">
                            {user.friends.length === 0 ? (
                                <div className="bg-black text-center text-white flex flex-col items-center">
                                    <Users size={48} className="text-blue-400 mb-4" />
                                    <p>No friends to display</p>
                                </div>
                            ) : (
                                <FriendListSection
                                    friends={user.friends}
                                    onFriendRemoved={(friendId) => {
                                        // Update your local state/refresh data after friend removal
                                        // const updatedFriends = user.friends.filter(f => f._id !== friendId);
                                        // Update your user state here
                                        console.log('update user state here')
                                    }}
                                />
                            )}
                        </TabsContent>
                    </Tabs>
                </Card>

                <UpdateProfileModal
                    isOpen={isUpdateModalOpen}
                    onClose={() => setIsUpdateModalOpen(false)}
                    user={user}
                />
            </div>
        </div>
    );
};

export default ProfilePage;