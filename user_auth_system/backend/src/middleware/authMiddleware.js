const { verifyToken } = require('../config/jwt');

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ 
            success: false, 
            error: 'Access token required' 
        });
    }

    try {
        const decoded = verifyToken(token);
        req.user = decoded;
        next();
    } 
    catch (error) {
        return res.status(403).json({ 
            success: false, 
            error: 'Invalid or expired token' 
        });
    }
};

const optionalAuth = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
        try {
            const decoded = verifyToken(token);
            req.user = decoded;
        } 
        catch (error) {
            //Token is invalid, but we don't reject the request
            req.user = null;
        }
    }
    next();
};

module.exports = { authenticateToken, optionalAuth };