import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import { useAuth } from '../../features/auth/hooks/useAuth';
import { useEffect } from 'react';
import { Box, Container } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
  }
});

const MainLayout = () => {
    const { fetchProfile } = useAuth();

    useEffect(() => {
        fetchProfile();
    }, []);

    return (
        <ThemeProvider theme={theme}>
            <Box 
                sx={{
                    minHeight: '100vh',
                    bgcolor: 'background.default'
                }}
            >
                <Navbar />
                <Container component="main" sx={{ py: 2 }}>
                    <Outlet />
                </Container>
            </Box>
        </ThemeProvider>
    );
};

export default MainLayout;