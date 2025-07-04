import React, { createContext, useContext, useEffect, useState} from "react";
import type { ReactNode } from "react";
import type { AuthContextType, User, AuthResult } from "../types/auth";
import { authAPI } from "../services/authAPI";


const AuthContext = createContext<AuthContextType | undefined> (undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider : React.FC<AuthProviderProps> = ({ children }) => {
    const[user, setUser ] = useState<User | null>(null);
    const[loading, setLoading] = useState(true);

    useEffect(() => {
        const initializeAuth = async () => {
            const token = localStorage.getItem('authToken');

            if(token){
                try{
                    const { user } = await authAPI.verifyToken();
                    setUser(user);
                }
                catch(error){
                    console.error('Token verification failed:', error);
                    localStorage.removeItem('authToken');
                }
            }

            setLoading(false);
        };

        initializeAuth();
    }, []);

    const login = async (email: string, password: string): Promise <AuthResult> => {
        try{
            const { token, user } = await authAPI.login({email, password});

            localStorage.setItem('authToken', token);
            setUser(user);

            return { success: true };
        }
        catch(error){
            return {
                success: false,
                error: error instanceof Error ? error.message:'Login Failed',
            };
        }
    };

    const register = async(name: string, email: string, password: string): Promise <AuthResult> => {
        try{
            const{ token, user } = await authAPI.register({ name, email, password});

            localStorage.setItem('authToken', token);
            setUser(user);

            return{ success: true };
        }
        catch(error){
            return{
                success: false,
                error: error instanceof Error? error.message:'Registration Failed',
            };
        }
    };

    const logout = (): void => {
        localStorage.removeItem('authToken');
        setUser(null);
    };

    const value: AuthContextType = {
        user,
        login,
        register,
        logout,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () : AuthContextType => {
    const context = useContext(AuthContext);

    if(context === undefined){
        throw new Error('useAuth myst be used within an AuthProvider');
    }
    return context;
};