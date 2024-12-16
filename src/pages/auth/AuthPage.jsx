// src/pages/auth/AuthPage.jsx
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { useAuth } from '../../features/auth/hooks/useAuth';
import { Navigate } from 'react-router-dom';

const AuthPage = () => {
    const { login, register, isLoading, error, isAuthenticated } = useAuth();
    const [loginData, setLoginData] = useState({ identifier: '', password: '' });
    const [registerData, setRegisterData] = useState({
        username: '',
        email: '',
        password: '',
        mobile: '',
    });

    if (isAuthenticated) {
        return <Navigate to="/profile" replace />;
    }

    const handleLogin = (e) => {
        e.preventDefault();
        login(loginData.identifier, loginData.password);
    };

    const handleRegister = (e) => {
        e.preventDefault();
        register(registerData);
    };

    return (
        <div className="bg-black container mx-auto max-w-md mt-20">
            <Card className="bg-black text-white">
                <CardHeader>
                    <CardTitle className="text-center text-lg">Welcome to SyncSpace</CardTitle>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="login">
                        <TabsList className="bg-black grid w-full grid-cols-2">
                            <TabsTrigger value="login">Login</TabsTrigger>
                            <TabsTrigger value="register">Register</TabsTrigger>
                        </TabsList>

                        <TabsContent value="login">
                            <form onSubmit={handleLogin} className="space-y-4">
                                <Input
                                    type="text"
                                    placeholder="Username, Email or Mobile"
                                    value={loginData.identifier}
                                    onChange={(e) => setLoginData({ ...loginData, identifier: e.target.value })}
                                />
                                <Input
                                    type="password"
                                    placeholder="Password"
                                    value={loginData.password}
                                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                                />
                                <Button type="submit" className="w-full" disabled={isLoading}>
                                    {isLoading ? 'Loading...' : 'Login'}
                                </Button>
                            </form>
                        </TabsContent>

                        <TabsContent value="register">
                            <form onSubmit={handleRegister} className="space-y-4">
                                <Input
                                    placeholder="Username"
                                    value={registerData.username}
                                    onChange={(e) => setRegisterData({ ...registerData, username: e.target.value })}
                                />
                                <Input
                                    type="email"
                                    placeholder="Email"
                                    value={registerData.email}
                                    onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                                />
                                <Input
                                    type="tel"
                                    placeholder="Mobile"
                                    value={registerData.mobile}
                                    onChange={(e) => setRegisterData({ ...registerData, mobile: e.target.value })}
                                />
                                <Input
                                    type="password"
                                    placeholder="Password"
                                    value={registerData.password}
                                    onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                                />
                                <Button type="submit" className="w-full" disabled={isLoading}>
                                    {isLoading ? 'Loading...' : 'Register'}
                                </Button>
                            </form>
                        </TabsContent>
                    </Tabs>

                    {error && (
                        <p className="text-destructive text-sm mt-4 text-center">{error}</p>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default AuthPage;