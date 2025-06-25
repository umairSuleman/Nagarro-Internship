
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
            (config) => {
                const token = authService.getAccessToken();
                if(token) {
                    config.headers['Authorization']=`Bearer ${token}`;
                }
                else{
                    config.headers['Authorization']=`Client-ID ${import.meta.env.VITE_API_KEY}`;
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
                if(error.response?.status === 401 && authService.isAuthenticated()){
                    try{
                        authService.logout();
                        window.location.reload();
                    }
                    catch{
                        authService.logout();
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

    // Like a photo (requires authentication)
    async likePhoto(photoId: string): Promise<void> {
        if (!authService.isAuthenticated()) {
            throw new Error('Authentication required to like photos');
        }
        
        try {
            await this.axiosInstance.post(`/photos/${photoId}/like`);
        } catch (error) {
            console.error('Failed to like photo:', error);
            throw error;
        }
    }

    // Unlike a photo (requires authentication)
    async unlikePhoto(photoId: string): Promise<void> {
        if (!authService.isAuthenticated()) {
            throw new Error('Authentication required to unlike photos');
        }

        try {
            await this.axiosInstance.delete(`/photos/${photoId}/like`);
        } catch (error) {
            console.error('Failed to unlike photo:', error);
            throw error;
        }
    }

    // Get user's liked photos (requires authentication)
    async getUserLikedPhotos(params: CommonParams = {}): Promise<UnsplashPhoto[]> {
        if (!authService.isAuthenticated()) {
            throw new Error('Authentication required to get liked photos');
        }

        const defaultParams = {
            page: 1,
            per_page: 12,
            ...params
        };

        return this.makeRequest<UnsplashPhoto[]>('/users/me/likes', defaultParams);
    }
}
export const unsplashService = new UnsplashService();

