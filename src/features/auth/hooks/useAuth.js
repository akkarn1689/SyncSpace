import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setCredentials, setUser, logout, setLoading, setError } from '../authSlice';

export const useAuth = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user, token, isLoading, error } = useSelector((state) => state.auth);
    
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

    const login = async (identifier, password) => {
        try {
            dispatch(setLoading(true));
            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({ identifier, password })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Login failed');
            }

            const data = await response.json();
            // console.log('Login response:', data);
            dispatch(setCredentials(data));
            // console.log('Token stored in localStorage:', localStorage.getItem('auth_token'));
            navigate('/profile');
        } catch (err) {
            console.error('Login error:', err.message || 'Login failed');
            dispatch(setError(err.message || 'Login failed'));
        } finally {
            dispatch(setLoading(false));
        }
    };

    const register = async (userData) => {
        try {
            dispatch(setLoading(true));
            const response = await fetch(`${API_BASE_URL}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify(userData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Registration failed');
            }

            const data = await response.json();
            // console.log(data);
            dispatch(setCredentials(data));
            navigate('/profile');
        } catch (err) {
            dispatch(setError(err.message || 'Registration failed'));
        } finally {
            dispatch(setLoading(false));
        }
    };

    const fetchProfile = async () => {
        try {
            dispatch(setLoading(true));
            const token = localStorage.getItem('auth_token');
            const response = await fetch(`${API_BASE_URL}/auth/profile`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                credentials: 'include'
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to fetch profile');
            }

            const data = await response.json();
            dispatch(setUser(data));
        } catch (err) {
            dispatch(setError(err.message || 'Failed to fetch profile'));
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