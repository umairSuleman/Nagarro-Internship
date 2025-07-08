const { verifyToken } = require('../config/jwt');
const { ErrorFactory } = require('../utils/errorFactory');

const authenticateToken = (req, res, next) => {
    //try to get token from cookie first, then fallback to Authorization header
    let token = req.cookies.authToken;

    if (!token) {
        const authHeader = req.headers['authorization'];
        token = authHeader && authHeader.split(' ')[1];
    }

    if(!token) {
        return next (ErrorFactory.authenticationError('Access Token Required'));
    }

    try {
        const decoded = verifyToken(token);
        req.user = decoded;
        next();
    } 
    catch (error) {
        return next(ErrorFactory.tokenError('Invalid or Expired Token'));
    }
};

const optionalAuth = (req, res, next) => {
    let token = req.cookies.authToken;

    if(!token) {
        const authHeader = req.headers['authorization'];
        token=authHeader && authHeader.split(' ')[1];
    }

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

//middleware to check if user is authenticated
const requireAuth = (req, res, next) => {
    if(!req.user){
        return next (ErrorFactory.authenticationError('Authentication Required'));
    }
    next();
}

//middleware to check if user is not authenticated
const requireGuest = (req, res, next) => {
    if(req.user){
        return next (ErrorFactory.authenticationError('Already Authenticated'));
    }
    next();
}

module.exports = { authenticateToken, optionalAuth, requireAuth, requireGuest };