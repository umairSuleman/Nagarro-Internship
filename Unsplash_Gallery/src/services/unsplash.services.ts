import { UNSPLASH_BASE_URL, UNSPLASH_ACCESS_KEY } from "../utils";
import axios from "axios";

import type {
    CommonParams,
    SearchParams,
    RandomParams,
    UnsplashPhoto,
    SearchResponse
} from '../types';

export class UnsplashService{
    private baseURL = UNSPLASH_BASE_URL;
    private accessKey= UNSPLASH_ACCESS_KEY;

    private buildURL(endpoint: string, params: Record<string, any> = {}):string {

        const url= new URL(`${this.baseURL}${endpoint}`);
        //adding access key
        url.searchParams.append('client_id', this.accessKey);

        //adding other params
        Object.entries(params).forEach(([key, value]) => {
            if(value !== undefined && value !== null && value !== ''){
                url.searchParams.append(key, value.toString());
            }
        });

        return url.toString();
    }

    private async makeRequest<T>(url: string): Promise<T> {
        try {
            const response = await axios.get<T>(url);
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

        const url= this.buildURL('/photos', defaultParams);

        return this.makeRequest<UnsplashPhoto[]>(url);
    }


    //Random Photo Generator
    async getRandomPhotos(params: RandomParams= {}): Promise<UnsplashPhoto | UnsplashPhoto[]>{
        const url= this.buildURL('/photos/random', params);
        return this.makeRequest<UnsplashPhoto | UnsplashPhoto[]>(url);
    }

    //Search for a Photo
    async searchPhotos(params: SearchParams): Promise<SearchResponse> {
        const defaultParams={
            page:1,
            per_page:12,
            content_filter:'low',
            ...params
        };

        const url =this.buildURL('/search/photos', defaultParams);
        return this.makeRequest<SearchResponse>(url);
    }
}
export const unsplashService = new UnsplashService();

