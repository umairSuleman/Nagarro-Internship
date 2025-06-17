
import axios from "axios";

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
        // Create axios instance with env var
        this.axiosInstance = axios.create({
            baseURL: import.meta.env.VITE_BASE_URL,
            headers: {
                'Authorization': `Client-ID ${import.meta.env.VITE_API_KEY}`
            }
        });
        
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

