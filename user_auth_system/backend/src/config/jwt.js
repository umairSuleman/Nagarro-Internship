const jwt = require('jsonwebtoken');

//JWT Secret
const JWT_SECRET = process.env.JWT_SECRET;

const generateToken = (payload) => {
    return jwt.sign(
        payload, 
        JWT_SECRET, 
        { expiresIn: '24h' }
    );
};

const verifyToken = (token) => {
    return jwt.verify(
        token, 
        JWT_SECRET
    );
};

module.exports = { generateToken, verifyToken };