import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from 'sonner';
import collegeLogo from '../../assets/kprietLogo.png';

const LoginForm = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        collegeEmail: '',
        password: '',
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await axios.post(
                'http://localhost:3002/api/auth/login',
                formData
            );

            const { token, data } = response.data;
            localStorage.setItem('authToken', token);
            localStorage.setItem('user', JSON.stringify(data));

            // Show success toast
            toast.success('Login successful!', {
                description: `Welcome back, ${data.firstName || 'User'}!`,
                duration: 3000,
            });

            // Navigate after a short delay
            setTimeout(() => {
                if (data.role === 'admin') {
                    navigate('/admin/dashboard');
                } else {
                    navigate('/student/dashboard');
                }
            }, 1000);

        } catch (err) {
            // Show error toast
            toast.error('Login failed', {
                description: err.response?.data?.message || 'Please check your credentials and try again.',
                duration: 5000,
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1 text-center">
                    <div className="flex justify-center mb-4">
                        <img src={collegeLogo} alt="KPRIET Logo" className="h-16" />
                    </div>
                    <CardTitle className="text-2xl font-bold">Placement Cell Login</CardTitle>
                    <CardDescription>
                        KPR Institute of Engineering and Technology
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="collegeEmail">College Email</Label>
                            <Input
                                id="collegeEmail"
                                name="collegeEmail"
                                type="email"
                                placeholder="e.g., 23it066@kpriet.ac.in"
                                value={formData.collegeEmail}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password">Password</Label>
                                <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                                    Forgot password?
                                </Link>
                            </div>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col space-y-4 my-4">
                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? 'Logging in...' : 'Login'}
                        </Button>
                        <div className="text-sm text-center text-muted-foreground">
                            Don't have an account?{' '}
                            <Link to="/signup" className="text-primary hover:underline">
                                Register
                            </Link>
                        </div>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
};

export default LoginForm;