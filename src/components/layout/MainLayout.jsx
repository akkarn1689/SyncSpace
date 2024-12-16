// src/components/layout/MainLayout.jsx
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import { useAuth } from '../../features/auth/hooks/useAuth';
import { useEffect } from 'react';

const MainLayout = () => {
    const { fetchProfile } = useAuth();

    useEffect(() => {
        fetchProfile();
    }, []);

    return (
        <div className="min-h-screen bg-background bg-black mx-auto">
            <Navbar />
            <main className="container mx-2 px-4 py-8">
                <Outlet />
            </main>
        </div>
    );
};

export default MainLayout;