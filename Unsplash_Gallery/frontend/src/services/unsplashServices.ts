
import axios from "axios";
import { authService } from "./authService";
import type {
    CommonParams,
    SearchParams,
    RandomParams,
    UnsplashPhoto,
    SearchResponse
} from '../types';


export class UnsplashService{
    private axiosInstance;

    constructor(){
        this.axiosInstance = axios.create({
            baseURL: import.meta.env.VITE_BASE_URL,
        });   

        this.axiosInstance.interceptors.request.use(
            async (config) => {
                try {
                    // Check if user is authenticated
                    const isAuthenticated = await authService.isAuthenticated();
                    
                    if (isAuthenticated) {
                        // Get token from JWT service
                        const token = await authService.getAccessToken();
                        if (token) {
                            config.headers['Authorization'] = `Bearer ${token}`;
                        } else {
                            // Fallback to client-id if no token available
                            config.headers['Authorization'] = `Client-ID ${import.meta.env.VITE_API_KEY}`;
                        }
                    } else {
                        // Use client-id for unauthenticated requests
                        config.headers['Authorization'] = `Client-ID ${import.meta.env.VITE_API_KEY}`;
                    }
                } catch (error) {
                    console.error('Error setting authorization header:', error);
                    // Fallback to client-id
                    config.headers['Authorization'] = `Client-ID ${import.meta.env.VITE_API_KEY}`;
                }
                
                return config;
            },
            (error) => {
                return Promise.reject(error);
            }
        );

        this.axiosInstance.interceptors.response.use(
            (response) => response,
            async (error) => {
                if (error.response?.status === 401) {
                    try {
                        const isAuthenticated = await authService.isAuthenticated();
                        if (isAuthenticated) {
                            // User should be authenticated but got 401
                            // Logout and reload
                            await authService.logout();
                            window.location.reload();
                        }
                    } catch (logoutError) {
                        console.error('Error during logout:', logoutError);
                        window.location.reload();
                    }
                }
                return Promise.reject(error);
            }
        );
    }


    private async makeRequest<T>(endpoint: string, params: Record<string, any> = {}): Promise<T> {
        try {
            const response = await this.axiosInstance.get<T>(endpoint, {params});
            return response.data;
        } catch (error) {
            console.error('API Request failed:', error);
            throw error;
        }
    }

    //List Photos from feed
    async listPhotos(params: CommonParams={}): Promise<UnsplashPhoto[]>{
        const defaultParams={
            page:1,
            per_page:12,
            content_filter:'low',
            ...params
        };

        return this.makeRequest<UnsplashPhoto[]>('/photos', defaultParams);
    }

    //Random Photo Generator
    async getRandomPhotos(params: RandomParams= {}): Promise<UnsplashPhoto[]>{
        return this.makeRequest<UnsplashPhoto[]>('/photos/random', params);
    }

    //Search for a Photo
    async searchPhotos(params: SearchParams | RandomParams): Promise<SearchResponse> {
        const defaultParams={
            content_filter:'low',
            ...params
        };

        return this.makeRequest<SearchResponse>('/search/photos', defaultParams);
    }

}
export const unsplashService = new UnsplashService();

