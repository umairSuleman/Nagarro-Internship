export interface AuthTokens {
    access_token: string;
    refresh_token: string;
    token_type: string;
    scope: string;
    expires_in: number;
}

export interface AuthUser {
    id: string;
    username: string;
    name: string;
    email: string;
    profile_image: {
        small: string,
        medium: string,
        large: string
    };
}

export interface AuthState {
    user: AuthUser | null;
    accessToken: string | null;
    isAuthenticated: boolean;
}

export interface OAuthConfig {
    clientId: string;
    redirectUri: string;
    scope: string;
    responseType: string;
}