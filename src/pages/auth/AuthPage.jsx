import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { 
  Card, 
  CardContent,
  Typography,
  Tabs,
  Tab,
  TextField,
  Button,
  Box,
  Alert,
  styled 
} from '@mui/material';
import { useAuth } from '../../features/auth/hooks/useAuth';
import { grey } from '@mui/material/colors';

const StyledCard = styled(Card)(({ theme }) => ({
  backgroundColor: theme.palette.common.black,
  color: theme.palette.common.white,
  maxWidth: '28rem',
  margin: '5rem auto',
  background: grey[900],
  padding: theme.spacing(2)
}));

const StyledTabs = styled(Tabs)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  '& .MuiTabs-indicator': {
    backgroundColor: theme.palette.primary.main
  }
}));

const StyledTab = styled(Tab)(({ theme }) => ({
  color: theme.palette.common.white,
  '&.Mui-selected': {
    color: theme.palette.primary.main
  }
}));

const AuthPage = () => {
  const { login, register, isLoading, error, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState('login');
  const [loginData, setLoginData] = useState({ identifier: '', password: '' });
  const [registerData, setRegisterData] = useState({
    username: '',
    email: '',
    password: '',
    mobile: ''
  });

  if (isAuthenticated) {
    return <Navigate to="/profile" replace />;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (activeTab === 'login') {
      login(loginData.identifier, loginData.password);
    } else {
      register(registerData);
    }
  };

  const renderLoginForm = () => (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <TextField
        fullWidth
        placeholder="Username, Email or Mobile"
        value={loginData.identifier}
        onChange={(e) => setLoginData({ ...loginData, identifier: e.target.value })}
        variant="outlined"
        sx={{ input: { color: 'white' } }}
      />
      <TextField
        fullWidth
        type="password"
        placeholder="Password"
        value={loginData.password}
        onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
        variant="outlined"
        sx={{ input: { color: 'white' } }}
      />
      <Button
        type="submit"
        variant="contained"
        fullWidth
        disabled={isLoading}
      >
        {isLoading ? 'Loading...' : 'Login'}
      </Button>
    </Box>
  );

  const renderRegisterForm = () => (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <TextField
        fullWidth
        placeholder="Username"
        value={registerData.username}
        onChange={(e) => setRegisterData({ ...registerData, username: e.target.value })}
        variant="outlined"
        sx={{ input: { color: 'white' } }}
      />
      <TextField
        fullWidth
        type="email"
        placeholder="Email"
        value={registerData.email}
        onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
        variant="outlined"
        sx={{ input: { color: 'white' } }}
      />
      <TextField
        fullWidth
        type="tel"
        placeholder="Mobile"
        value={registerData.mobile}
        onChange={(e) => setRegisterData({ ...registerData, mobile: e.target.value })}
        variant="outlined"
        sx={{ input: { color: 'white' } }}
      />
      <TextField
        fullWidth
        type="password"
        placeholder="Password"
        value={registerData.password}
        onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
        variant="outlined"
        sx={{ input: { color: 'white' } }}
      />
      <Button
        type="submit"
        variant="contained"
        fullWidth
        disabled={isLoading}
      >
        {isLoading ? 'Loading...' : 'Register'}
      </Button>
    </Box>
  );

  return (
    <StyledCard>
      <Typography variant="h6" align="center" gutterBottom>
        Welcome to SyncSpace
      </Typography>
      <CardContent>
        <StyledTabs
          value={activeTab}
          onChange={(_, newValue) => setActiveTab(newValue)}
          variant="fullWidth"
        >
          <StyledTab label="Login" value="login" />
          <StyledTab label="Register" value="register" />
        </StyledTabs>

        {activeTab === 'login' ? renderLoginForm() : renderRegisterForm()}

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </CardContent>
    </StyledCard>
  );
};

export default AuthPage;