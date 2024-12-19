// src/features/auth/hooks/useAuth.js
import { useSelector, useDispatch } from 'react-redux';
// import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import axiosInstance from '../../../lib/axios';
import axiosInstance from '../../../lib/axios';
import { setCredentials, setUser, logout, setLoading, setError } from '../authSlice';

export const useAuth = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    // const [isAuthenticated, setIsAuthenticated] = useState(false);
    const { user, token, isLoading, error } = useSelector((state) => state.auth);

    const login = async (identifier, password) => {
        try {
            dispatch(setLoading(true));
            const response = await axiosInstance.post('/auth/login', { identifier, password });
            console.log('Login response:', response.data); // Check if token and user are present
            dispatch(setCredentials(response.data));
            console.log('Token stored in localStorage:', localStorage.getItem('auth_token')); // Verify the storage
            navigate('/profile');
        } catch (err) {
            console.error('Login error:', err.response?.data?.message || 'Login failed'); // Debug error
            dispatch(setError(err.response?.data?.message || 'Login failed'));
        } finally {
            dispatch(setLoading(false));
        }
    };


    const register = async (userData) => {
        try {
            dispatch(setLoading(true));
            const response = await axiosInstance.post('/auth/register', userData);
            console.log(response.data);
            dispatch(setCredentials(response.data));
            navigate('/profile');
        } catch (err) {
            dispatch(setError(err.response?.data?.message || 'Registration failed'));
        } finally {
            dispatch(setLoading(false));
        }
    };

    const fetchProfile = async () => {
        try {
            dispatch(setLoading(true));
            const response = await axiosInstance.get('/auth/profile');
            dispatch(setUser(response.data));
        } catch (err) {
            dispatch(setError(err.response?.data?.message || 'Failed to fetch profile'));
        } finally {
            dispatch(setLoading(false));
        }
    };

    const logoutUser = () => {
        dispatch(logout());
        navigate('/auth');
    };

    return {
        user,
        token,
        isLoading,
        error,
        login,
        register,
        logout: logoutUser,
        fetchProfile,
        isAuthenticated: !!token,
    };
};