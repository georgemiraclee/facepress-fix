"use client";
import { createContext, useState, useEffect, ReactNode, useContext } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

interface User {
    id: string;
    role: string;
}

interface AuthContextProps {
    user: User | null;
    login: (credentials: LoginCredentials) => Promise<void>;
    logout: () => void;
    setToken: (token: string) => void;
}

interface LoginCredentials {
    email: string;
    password: string;
    role: string;
}

interface AuthProviderProps {
    children: ReactNode;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [user, setUser] = useState<User | null>(null);
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            axios.get('http://localhost:8000/api/login') // Ensure this is the correct API endpoint
                .then(response => {
                    setUser(response.data.user);
                })
                .catch(error => {
                    console.error("Error fetching user:", error);
                    localStorage.removeItem('token');
                    setUser(null);
                });
        }
    }, []);
    


    const login = async (credentials: LoginCredentials) => {
        try {
            const { data } = await axios.post('http://localhost:8000/api/login', credentials);
            setToken(data.token);

            // Decode token to get user info
            const decodedToken = JSON.parse(atob(data.token.split('.')[1]));
            setUser({ id: decodedToken.id, role: decodedToken.role });

            router.push('/dashboard');
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                console.error("Login failed:", error.response?.data?.message || error.message);
            } else {
                console.error("Login failed:", (error as Error).message);
            }
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        router.push('/login');
    };

    const setToken = (token: string) => {
        localStorage.setItem('token', token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, setToken }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export default AuthContext;
