import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from 'sonner';
import collegeLogo from '../../assets/kprietLogo.png';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3002/api';

const SignupForm = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        firstName: '',
        middleName: '',
        lastName: '',
        collegeEmail: '',
        password: '',
        confirmPassword: ''
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        if (formData.password !== formData.confirmPassword) {
            toast.error('Passwords do not match', {
                description: 'Please make sure your passwords match.',
                duration: 5000,
            });
            setIsLoading(false);
            return;
        }

        try {
            const { firstName, middleName, lastName, collegeEmail, password } = formData;
            const response = await axios.post(`${API_BASE}/auth/register`, {
                firstName,
                middleName,
                lastName,
                collegeEmail,
                password
            });

            const { token, data } = response.data;
            localStorage.setItem('authToken', token);
            localStorage.setItem('user', JSON.stringify(data));

            toast.success('Account created successfully!', {
                description: 'Please complete your profile to continue.',
                duration: 5000,
            });

            // Navigate to profile page after a short delay
            setTimeout(() => {
                navigate('/student/profile');
            }, 1000);

        } catch (err) {
            toast.error('Registration failed', {
                description: err.response?.data?.message || 'Please check your information and try again.',
                duration: 5000,
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background via-background/95 to-background p-4 text-foreground">
            <Card className="w-full max-w-2xl border border-border/60 bg-card/95 shadow-xl backdrop-blur">
                <CardHeader className="space-y-1 text-center">
                    <div className="flex justify-center mb-4">
                        <img src={collegeLogo} alt="KPRIET Logo" className="h-16" />
                    </div>
                    <CardTitle className="text-2xl font-bold">Create Student Account</CardTitle>
                    <CardDescription>
                        KPR Institute of Engineering and Technology
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="firstName">First Name</Label>
                                <Input
                                    id="firstName"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            
                            <div className="space-y-2">
                                <Label htmlFor="middleName">Middle Name (Optional)</Label>
                                <Input
                                    id="middleName"
                                    name="middleName"
                                    value={formData.middleName}
                                    onChange={handleChange}
                                />
                            </div>
                            
                            <div className="space-y-2">
                                <Label htmlFor="lastName">Last Name</Label>
                                <Input
                                    id="lastName"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

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

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword">Confirm Password</Label>
                                <Input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type="password"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col space-y-4 mt-4">
                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? 'Creating Account...' : 'Create Account'}
                        </Button>
                        <div className="text-sm text-center text-muted-foreground">
                            Already have an account?{' '}
                            <Link to="/login" className="text-primary hover:underline">
                                Login
                            </Link>
                        </div>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
};

export default SignupForm;
