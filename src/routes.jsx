// src/routes.jsx
import { createBrowserRouter, Navigate } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import AuthPage from './pages/auth/AuthPage';
import ProfilePage from './pages/profile/ProfilePage';
import { useAuth } from './features/auth/hooks/useAuth';
import { useSelector } from 'react-redux';
import GroupPage from './pages/groups/GroupPage';
import ChatPage from './pages/chat/ChatPage';
import NotificationPage from './pages/notification/NotificationPage';

const ProtectedRoute = ({ children }) => {
    const isAuthenticated = useSelector((state) => !!state.auth.token);
    console.log('ProtectedRoute isAuthenticated:', isAuthenticated); // Debug route protection
    return isAuthenticated ? children : <Navigate to="/auth" replace />;
};

export const router = createBrowserRouter([
    {
        path: '/',
        element: <MainLayout />,
        children: [
            {
                index: true,
                element: <Navigate to="/profile" replace />,
            },
            {
                path: 'profile',
                element: (
                    <ProtectedRoute>
                        <ProfilePage />
                    </ProtectedRoute>
                ),
            },
            {
                path: 'groups',
                element: (
                    <ProtectedRoute>
                        <GroupPage />
                    </ProtectedRoute>
                ),
            },
            {
                path: 'chat',
                element: (
                    <ProtectedRoute>
                        <ChatPage />
                    </ProtectedRoute>
                ),
            },
            {
                path: 'notifications',
                element: (
                    <ProtectedRoute>
                        <NotificationPage />
                    </ProtectedRoute>
                ),
            },
        ],
    },
    {
        path: '/auth',
        element: <AuthPage />,
    },
]);