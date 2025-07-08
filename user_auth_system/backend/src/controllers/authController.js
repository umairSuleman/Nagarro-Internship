const { UserService } = require('../models/User');
const { hashPassword, comparePassword } = require('../utils/bcryptUtils');
const { generateToken } = require('../config/jwt');
const { validateRegistrationData, validateLoginData } = require('../utils/validation');
const { ErrorFactory } = require('../utils/errorFactory');
const { asyncHandler } = require('../middleware/errorMiddleware');

class AuthController {
    static register = asyncHandler(async (req, res) => {
        const { name, email, password } = req.body;

        //validate input data
        const validation = validateRegistrationData({ name, email, password });
        if (!validation.isValid) {
            throw ErrorFactory.validationError(validation.errors[0]);
        }

        //hash password
        const hashedPassword = await hashPassword(password);

        //create user
        const user = await UserService.createUser({
            email,
            password: hashedPassword,
            name
        });

        //generate token
        const token = generateToken({
            userId: user.id,
            email: user.email
        });

        //set HTTP-only cookie
        res.cookie('authToken', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 24 * 60 * 60 * 1000 // 24 hours
        });

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            user: user.toSafeObject()
        });
    });

    static login = asyncHandler(async (req, res) => {
        const { email, password } = req.body;

        //validate input data
        const validation = validateLoginData({ email, password });
        if (!validation.isValid) {
            throw ErrorFactory.validationError(validation.errors[0]);
        }

        //find and authenticate user
        const user = await UserService.authenticateUser(email, password);

        //verify password
        const isValidPassword = await comparePassword(password, user.password);
        if (!isValidPassword) {
            throw ErrorFactory.invalidCredentialsError();
        }

        //update last login
        await UserService.updateUserLastLogin(user.id);

        //generate token
        const token = generateToken({
            userId: user.id,
            email: user.email
        });

        //set HTTP-only cookie
        res.cookie('authToken', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 24 * 60 * 60 * 1000 // 24 hours
        });

        res.json({
            success: true,
            message: 'Login successful',
            user: user.toSafeObject()
        });
    });

    static getProfile = asyncHandler(async (req, res) => {
        const userProfile = await UserService.getUserProfile(req.user.userId);
        
        res.json({
            success: true,
            user: userProfile
        });
    });

    static verifyToken = asyncHandler(async (req, res) => {
        // Get user details to ensure token is still valid
        const userProfile = await UserService.getUserProfile(req.user.userId);
        
        res.json({
            success: true,
            valid: true,
            user: userProfile
        });
    });

    static logout = asyncHandler(async (req, res) => {
        // Clear the HTTP-only cookie
        res.clearCookie('authToken', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        });

        res.json({
            success: true,
            message: 'Logout successful'
        });
    });

    static refreshToken = asyncHandler(async (req, res) => {
        // Generate new token
        const token = generateToken({
            userId: req.user.userId,
            email: req.user.email
        });

        // Set new HTTP-only cookie
        res.cookie('authToken', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 24 * 60 * 60 * 1000 // 24 hours
        });

        res.json({
            success: true,
            message: 'Token refreshed successfully'
        });
    });
}

module.exports = AuthController;