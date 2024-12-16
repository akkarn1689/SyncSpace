// import React, { useState } from 'react';
// import {
//   Card,
//   CardContent,
//   CardHeader,
// } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { AlertCircle, Mail, Lock, User, Phone } from 'lucide-react';
// import { Alert, AlertDescription } from "@/components/ui/alert";
// import { useAuth } from '../hooks/useAuth';

// const AuthComponent = () => {
//   const { login, register, isLoading, error: authError } = useAuth();
//   const [error, setError] = useState("");
  
//   const [loginData, setLoginData] = useState({
//     identifier: "", // Can be email, username, or mobile
//     password: ""
//   });
  
//   const [registerData, setRegisterData] = useState({
//     username: "",
//     email: "",
//     mobile: "",
//     password: "",
//     confirmPassword: ""
//   });

//   const validateEmail = (email) => {
//     const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     return emailPattern.test(email);
//   };

//   const validateMobile = (mobile) => {
//     const mobilePattern = /^\d{10,15}$/;
//     return mobilePattern.test(mobile);
//   };

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setError("");
    
//     const { identifier, password } = loginData;
    
//     if (!identifier || !password) {
//       setError("Please fill in all fields");
//       return;
//     }

//     try {
//       await login(identifier, password);
//     } catch (err) {
//       setError(err.message || "Login failed");
//     }
//   };

//   const handleRegister = async (e) => {
//     e.preventDefault();
//     setError("");
    
//     const { username, email, mobile, password, confirmPassword } = registerData;
    
//     // Validation
//     if (!username || !email || !password || !confirmPassword) {
//       setError("Please fill in all required fields");
//       return;
//     }

//     if (username.length < 3 || username.length > 30 || username.includes('@')) {
//       setError("Username should be 3-30 characters and not contain @");
//       return;
//     }

//     if (!validateEmail(email)) {
//       setError("Please enter a valid email address");
//       return;
//     }

//     if (mobile && !validateMobile(mobile)) {
//       setError("Please enter a valid mobile number");
//       return;
//     }

//     if (password.length < 6) {
//       setError("Password must be at least 6 characters long");
//       return;
//     }

//     if (password !== confirmPassword) {
//       setError("Passwords do not match");
//       return;
//     }

//     try {
//       await register({
//         username,
//         email,
//         mobile,
//         password
//       });
//     } catch (err) {
//       setError(err.message || "Registration failed");
//     }
//   };

//   return (
//     <div className="flex min-h-screen items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
//       <Card className="w-full max-w-md">
//         <Tabs defaultValue="login" className="w-full">
//           <CardHeader>
//             <div className="flex justify-center mb-4">
//               <TabsList className="grid w-full grid-cols-2">
//                 <TabsTrigger value="login">Login</TabsTrigger>
//                 <TabsTrigger value="register">Register</TabsTrigger>
//               </TabsList>
//             </div>
//           </CardHeader>

//           <CardContent>
//             {(error || authError) && (
//               <Alert variant="destructive" className="mb-4">
//                 <AlertCircle className="h-4 w-4" />
//                 <AlertDescription>{error || authError}</AlertDescription>
//               </Alert>
//             )}

//             <TabsContent value="login">
//               <form onSubmit={handleLogin}>
//                 <div className="space-y-4">
//                   <div className="space-y-2">
//                     <Label htmlFor="identifier">Email, Username, or Mobile</Label>
//                     <div className="relative">
//                       <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
//                       <Input
//                         id="identifier"
//                         type="text"
//                         placeholder="Enter your email, username, or mobile"
//                         className="pl-10"
//                         value={loginData.identifier}
//                         onChange={(e) =>
//                           setLoginData({ ...loginData, identifier: e.target.value })
//                         }
//                       />
//                     </div>
//                   </div>
                  
//                   <div className="space-y-2">
//                     <Label htmlFor="password">Password</Label>
//                     <div className="relative">
//                       <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
//                       <Input
//                         id="password"
//                         type="password"
//                         className="pl-10"
//                         value={loginData.password}
//                         onChange={(e) =>
//                           setLoginData({ ...loginData, password: e.target.value })
//                         }
//                       />
//                     </div>
//                   </div>
//                 </div>

//                 <Button 
//                   className="w-full mt-6" 
//                   type="submit"
//                   disabled={isLoading}
//                 >
//                   {isLoading ? "Signing in..." : "Sign in"}
//                 </Button>
//               </form>
//             </TabsContent>

//             <TabsContent value="register">
//               <form onSubmit={handleRegister}>
//                 <div className="space-y-4">
//                   <div className="space-y-2">
//                     <Label htmlFor="username">Username</Label>
//                     <div className="relative">
//                       <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
//                       <Input
//                         id="username"
//                         type="text"
//                         placeholder="Choose a username"
//                         className="pl-10"
//                         value={registerData.username}
//                         onChange={(e) =>
//                           setRegisterData({ ...registerData, username: e.target.value })
//                         }
//                       />
//                     </div>
//                   </div>

//                   <div className="space-y-2">
//                     <Label htmlFor="register-email">Email</Label>
//                     <div className="relative">
//                       <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
//                       <Input
//                         id="register-email"
//                         type="email"
//                         placeholder="name@example.com"
//                         className="pl-10"
//                         value={registerData.email}
//                         onChange={(e) =>
//                           setRegisterData({ ...registerData, email: e.target.value })
//                         }
//                       />
//                     </div>
//                   </div>

//                   <div className="space-y-2">
//                     <Label htmlFor="mobile">Mobile (Optional)</Label>
//                     <div className="relative">
//                       <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
//                       <Input
//                         id="mobile"
//                         type="tel"
//                         placeholder="Enter your mobile number"
//                         className="pl-10"
//                         value={registerData.mobile}
//                         onChange={(e) =>
//                           setRegisterData({ ...registerData, mobile: e.target.value })
//                         }
//                       />
//                     </div>
//                   </div>

//                   <div className="space-y-2">
//                     <Label htmlFor="register-password">Password</Label>
//                     <div className="relative">
//                       <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
//                       <Input
//                         id="register-password"
//                         type="password"
//                         className="pl-10"
//                         value={registerData.password}
//                         onChange={(e) =>
//                           setRegisterData({ ...registerData, password: e.target.value })
//                         }
//                       />
//                     </div>
//                   </div>

//                   <div className="space-y-2">
//                     <Label htmlFor="confirm-password">Confirm Password</Label>
//                     <div className="relative">
//                       <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
//                       <Input
//                         id="confirm-password"
//                         type="password"
//                         className="pl-10"
//                         value={registerData.confirmPassword}
//                         onChange={(e) =>
//                           setRegisterData({
//                             ...registerData,
//                             confirmPassword: e.target.value,
//                           })
//                         }
//                       />
//                     </div>
//                   </div>
//                 </div>

//                 <Button 
//                   className="w-full mt-6" 
//                   type="submit"
//                   disabled={isLoading}
//                 >
//                   {isLoading ? "Creating account..." : "Create account"}
//                 </Button>
//               </form>
//             </TabsContent>
//           </CardContent>
//         </Tabs>
//       </Card>
//     </div>
//   );
// };

// export default AuthComponent;