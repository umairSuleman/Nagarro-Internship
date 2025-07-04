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

    private getAuthHeaders(): HeadersInit {
        const token = localStorage.getItem('authToken');
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        };
    }

    async login(credentials: LoginRequest): Promise<AuthResponse> {
        const response = await fetch (`${API_BASE}/auth/login`, {
            method: 'POST',
            headers: this.getHeaders(),
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
            headers: this.getHeaders(),
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
            headers: this.getAuthHeaders(),
        });

        if (!response.ok) {
            throw new Error('Token verification failed');
        }
        return response.json();
    }
}

export const authAPI = new AuthAPI();

