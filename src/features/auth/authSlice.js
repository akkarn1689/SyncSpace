// src/features/auth/authSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    user: null,
    token: localStorage.getItem('auth_token') || null,
    isLoading: false,
    error: null
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (state, { payload }) => {
            state.user = payload.user;
            state.token = payload.token;
            localStorage.setItem('auth_token', payload.token);
        },
        setUser: (state, { payload }) => {
            state.user = payload;
        },
        logout: (state) => {
            state.user = null;
            state.token = null;
            localStorage.removeItem('auth_token');
        },
        setLoading: (state, { payload }) => {
            state.isLoading = payload;
        },
        setError: (state, { payload }) => {
            state.error = payload;
        },
    },
});

export const { setCredentials, setUser, logout, setLoading, setError } = authSlice.actions;
export default authSlice.reducer;