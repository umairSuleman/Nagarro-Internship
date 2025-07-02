const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const crypto = require('crypto');
const app = express();
require('dotenv').config();

// Environment variables
const FRONTEND_URL = process.env.FRONTEND_URL;
const PORT = process.env.PORT;
const JWT_SECRET = process.env.JWT_SECRET;
const REFRESH_SECRET = process.env.REFRESH_SECRET;

// Middleware
app.use(cors({
  origin: FRONTEND_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(cookieParser());

// JWT configuration
const JWT_OPTIONS = {
  ACCESS_TOKEN_EXPIRES: '15m',
  REFRESH_TOKEN_EXPIRES: '7d',
  COOKIE_OPTIONS: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/'
  }
};

// Helper functions
const generateTokens = (payload) => {
  const accessToken = jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_OPTIONS.ACCESS_TOKEN_EXPIRES
  });
  
  const refreshToken = jwt.sign(payload, REFRESH_SECRET, {
    expiresIn: JWT_OPTIONS.REFRESH_TOKEN_EXPIRES
  });
  
  return { accessToken, refreshToken };
};

const verifyAccessToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};

const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, REFRESH_SECRET);
  } catch (error) {
    return null;
  }
};

// Routes

// Store Unsplash tokens and generate JWT tokens
app.post('/api/auth/store-tokens', (req, res) => {
  try {
    const { access_token, refresh_token, user } = req.body;
    
    if (!access_token || !user) {
      return res.status(400).json({ error: 'Access token and user data required' });
    }

    // Create JWT payload with Unsplash token and user info
    const payload = {
      unsplashAccessToken: access_token,
      unsplashRefreshToken: refresh_token,
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
        email: user.email,
        profile_image: user.profile_image
      }
    };

    const { accessToken, refreshToken } = generateTokens(payload);

    // Set HTTP-only cookies
    res.cookie('accessToken', accessToken, {
      ...JWT_OPTIONS.COOKIE_OPTIONS,
      maxAge: 15 * 60 * 1000 // 15 minutes
    });

    res.cookie('refreshToken', refreshToken, {
      ...JWT_OPTIONS.COOKIE_OPTIONS,
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.json({ 
      message: 'Tokens stored successfully',
      user: payload.user
    });
  } catch (error) {
    console.error('Error storing tokens:', error);
    res.status(500).json({ error: 'Failed to store tokens' });
  }
});

// Get current user from JWT
app.get('/api/auth/me', (req, res) => {
  try {
    const accessToken = req.cookies.accessToken;
    
    if (!accessToken) {
      return res.status(401).json({ error: 'No access token found' });
    }

    const decoded = verifyAccessToken(accessToken);
    
    if (!decoded) {
      return res.status(401).json({ error: 'Invalid access token' });
    }

    res.json({
      user: decoded.user,
      unsplashAccessToken: decoded.unsplashAccessToken
    });
  } catch (error) {
    console.error('Error getting user:', error);
    res.status(500).json({ error: 'Failed to get user data' });
  }
});

// Refresh tokens
app.post('/api/auth/refresh', async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ error: 'No refresh token found' });
    }

    const decoded = verifyRefreshToken(refreshToken);  
    if (!decoded) {
      return res.status(401).json({ error: 'Invalid refresh token' });
    }

    // Generate new tokens with same payload
    const { accessToken: newAccessToken, refreshToken: newRefreshToken } = generateTokens({
      unsplashAccessToken: decoded.unsplashAccessToken,
      unsplashRefreshToken: decoded.unsplashRefreshToken,
      user: decoded.user
    });

    // Set new cookies
    res.cookie('accessToken', newAccessToken, {
      ...JWT_OPTIONS.COOKIE_OPTIONS,
      maxAge: 15 * 60 * 1000
    });

    res.cookie('refreshToken', newRefreshToken, {
      ...JWT_OPTIONS.COOKIE_OPTIONS,
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.json({ 
      message: 'Tokens refreshed successfully',
      user: decoded.user
    });
  } catch (error) {
    console.error('Error refreshing tokens:', error);
    res.status(500).json({ error: 'Failed to refresh tokens' });
  }
});

// Logout - clear cookies
app.post('/api/auth/logout', (res) => {
  try {
    res.clearCookie('accessToken', JWT_OPTIONS.COOKIE_OPTIONS);
    res.clearCookie('refreshToken', JWT_OPTIONS.COOKIE_OPTIONS);
    
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Error during logout:', error);
    res.status(500).json({ error: 'Failed to logout' });
  }
});

// Check authentication status
app.get('/api/auth/status', (req, res) => {
  try {
    const accessToken = req.cookies.accessToken;
    const refreshToken = req.cookies.refreshToken;
    
    if (!accessToken && !refreshToken) {
      return res.json({ isAuthenticated: false });
    }

    const decoded = verifyAccessToken(accessToken);
    
    if (decoded) {
      return res.json({ 
        isAuthenticated: true,
        user: decoded.user,
        unsplashAccessToken: decoded.unsplashAccessToken
      });
    }

    // Try refresh token if access token is invalid
    const refreshDecoded = verifyRefreshToken(refreshToken);
    
    if (refreshDecoded) {
      return res.json({ 
        isAuthenticated: true,
        needsRefresh: true,
        user: refreshDecoded.user
      });
    }

    res.json({ isAuthenticated: false });
  } catch (error) {
    console.error('Error checking auth status:', error);
    res.status(500).json({ error: 'Failed to check authentication status' });
  }
});

// Health check
app.get('/api/health', (res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((error, res) => {
  console.error('Unhandled error:', error);
  res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use((res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`JWT Auth Server running on port ${PORT}`);
  console.log(`Frontend URL: ${FRONTEND_URL}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;