const User = require('../models/User');
const { hashPassword, comparePassword } = require('../utils/bcryptUtils');
const { generateToken } = require('../config/jwt');
const { validateRegistrationData, validateLoginData } = require('../utils/validation');

class AuthController {
    static async register(req, res) {
        try {
            const { name, email, password } = req.body;

            // Validate input data
            const validation = validateRegistrationData({ name, email, password });
            if (!validation.isValid) {
                return res.status(400).json({
                success: false,
                error: validation.errors[0]
                });
            }

            // Check if user already exists
            const existingUser = await User.findByEmail(email);
            if (existingUser) {
                return res.status(409).json({
                success: false,
                error: 'User with this email already exists'
                });
            }

            // Hash password and create user
            const hashedPassword = await hashPassword(password);
            const user = await User.create({
                email,
                password: hashedPassword,
                name: name.trim()
            });

            // Generate token
            const token = generateToken({
                userId: user.id,
                email: user.email
            });

            res.status(201).json({
                success: true,
                message: 'User registered successfully',
                token,
                user: {
                id: user.id,
                email: user.email,
                name: user.name
                }
            });
        } 
        catch (error) {
            console.error('Registration error:', error);
            res.status(500).json({
                success: false,
                error: error.message || 'Internal server error'
            });
        }
    }

    static async login(req, res) {
        try {
            const { email, password } = req.body;

            // Validate input data
            const validation = validateLoginData({ email, password });
            if (!validation.isValid) {
                return res.status(400).json({
                success: false,
                error: validation.errors[0]
                });
            }

            // Find user
            const user = await User.findByEmail(email);
            if (!user) {
                return res.status(401).json({
                success: false,
                error: 'Invalid credentials'
                });
            }

            // Verify password
            const isValidPassword = await comparePassword(password, user.password);
            if (!isValidPassword) {
                return res.status(401).json({
                success: false,
                error: 'Invalid credentials'
                });
            }

            // Update last login
            await User.updateLastLogin(user.id);

            // Generate token
            const token = generateToken({
                userId: user.id,
                email: user.email
            });

            res.json({
                success: true,
                message: 'Login successful',
                token,
                user: {
                id: user.id,
                email: user.email,
                name: user.name
                }
            });
        } 
        catch (error) {
            console.error('Login error:', error);
            res.status(500).json({
                success: false,
                error: 'Internal server error'
            });
        }
    }

    static async getProfile(req, res) {
        try {
            const user = await User.findById(req.user.userId);
        
            if (!user) {
                return res.status(404).json({
                success: false,
                error: 'User not found'
                });
            }

            res.json({
                success: true,
                user
            });
        } 
        catch (error) {
            console.error('Profile error:', error);
            res.status(500).json({
                success: false,
                error: 'Internal server error'
            });
        }
    }

    static async verifyToken(req, res) {
        res.json({
        success: true,
        valid: true,
        user: req.user
        });
    }

    static async logout(res) {
        // In a more advanced implementation, you might want to blacklist the token
        res.json({
        success: true,
        message: 'Logout successful'
        });
    }
}

module.exports = AuthController;