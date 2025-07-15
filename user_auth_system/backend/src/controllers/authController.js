const User = require('../models/User');
const { generateToken } = require('../config/jwt');
const { validateRegistrationData, validateLoginData } = require('../utils/validation');
const { ErrorFactory } = require('../utils/errorFactory');
const { asyncHandler } = require('../middleware/errorMiddleware');

class AuthController {
  static register = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    //Validate input data
    const validation = validateRegistrationData({ name, email, password });
    if (!validation.isValid) {
      throw ErrorFactory.validationError(validation.errors[0]);
    }

    //Create user using Sequelize model
    const user = await User.createUser({
      email,
      password,
      name
    });

    //Generate token
    const token = generateToken({
      userId: user.id,
      email: user.email
    });

    //Set HTTP-only cookie
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

    //Validate input data
    const validation = validateLoginData({ email, password });
    if (!validation.isValid) {
      throw ErrorFactory.validationError(validation.errors[0]);
    }

    //Authenticate user using Sequelize model
    const user = await User.authenticateUser(email, password);

    //Update last login
    await User.updateLastLogin(user.id);

    //Generate token
    const token = generateToken({
      userId: user.id,
      email: user.email
    });

    //Set HTTP-only cookie
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
    const userProfile = await User.getUserProfile(req.user.userId);
    
    res.json({
      success: true,
      user: userProfile
    });
  });

  static verifyToken = asyncHandler(async (req, res) => {
    // Get user details to ensure token is still valid
    const userProfile = await User.getUserProfile(req.user.userId);
    
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