// Common API interface parameters

export interface CommonParams {
    page ?: number;
    per_page ?: number;
    content_filter ?: 'low' | 'high';
    orientation ?: 'landscape' | 'portrait' | 'squarish';

}

export interface SearchParams extends CommonParams {
    query: string;
    order_by ?: 'latest' | 'relevant';
    collections ?: string;
    color ?: 'black_and_white' | 'black' | 'white' | 'yellow' | 'orange' | 'red' | 'purple' | 'magenta' | 'green' | 'teal' | 'blue';

}

export interface RandomParams {
    collections ?: string;
    topics ?: string;
    username ?: string;
    query ?: string;
    orientation ?: 'landscape' | 'portrait' | 'squarish';
    content_filter ?: 'low' | 'high';
    count ?: number;
}

export interface UnsplashPhoto{
    id: string;
    urls: {
        small: string;
        regular: string;
        thumb: string;
    };
    alt_description: string;
    description: string;
    user: {
        name: string;
        username: string;
    };
    width: number;
    height: number;
}

export interface SearchResponse {
    results: UnsplashPhoto[];
    total: number;
    total_pages: number;
}

