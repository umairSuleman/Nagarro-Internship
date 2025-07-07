import type { 
    LoginRequest, 
    RegisterRequest, 
    AuthResponse, 
    User 
} from '../types/auth';

const API_BASE = import.meta.env.VITE_API_BASE_URL;

class AuthAPI {
    private getHeaders(): HeadersInit {
        return {
            'Content-Type': 'application/json'
        };
    }

    private getRequestOptions(): RequestInit {
        return {
            credentials: 'include',
            headers: this.getHeaders(),
        };
    }

    async login(credentials: LoginRequest): Promise<AuthResponse> {
        const response = await fetch (`${API_BASE}/auth/login`, {
            method: 'POST',
            ...this.getRequestOptions(),
            body: JSON.stringify(credentials),
        });

        const data = await response.json();

        if(!response.ok) {
            throw new Error(data.error || 'Login Failed');
        }

        return data;
    }

    async register(credentials: RegisterRequest): Promise<AuthResponse> {
        const response= await fetch(`${API_BASE}/auth/register`, {
            method: 'POST', 
            ...this.getRequestOptions(),
            body: JSON.stringify(credentials),
        });

        const data = await response.json();

        if(!response.ok) {
            throw new Error(data.error || 'Registration Failed');
        }

        return data;
    }

    async verifyToken(): Promise<{user: User }> {
        const response = await fetch(`${API_BASE}/auth/verify`, {
            method: 'GET',
            ...this.getRequestOptions(),
        });

        if (!response.ok) {
            throw new Error('Token verification failed');
        }
        return response.json();
    }

    async logout(): Promise<void> {
        const response = await fetch(`${API_BASE}/auth/logout`, {
            method: 'POST',
            ...this.getRequestOptions(),
        });

        if (!response.ok) {
            throw new Error('Logout failed');
        }
    }
}

export const authAPI = new AuthAPI();

