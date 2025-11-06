import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { PrismaClient } from '@prisma/client';
import { validateRegistration, validateLogin } from '../utils/validators.js';
import { sendVerificationEmail, sendPasswordResetEmail } from '../services/email.service.js';
import { generateSlug } from '../utils/helpers.js';
import { logger } from '../utils/logger.js';

const prisma = new PrismaClient();

/**
 * Generate JWT token
 */
const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
  );
};

/**
 * Generate refresh token
 */
const generateRefreshToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d' }
  );
};

/**
 * Register new business account
 * POST /api/auth/register
 */
export const register = async (req, res) => {
  try {
    const { email, password, businessName, businessCategory } = req.body;

    // Validate input
    const { error } = validateRegistration(req.body);
    if (error) {
      return res.status(400).json({ 
        error: error.details[0].message 
      });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (existingUser) {
      return res.status(400).json({ 
        error: 'Email already registered' 
      });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // Generate business slug
    let businessSlug = generateSlug(businessName);
    
    // Check if slug exists and make it unique if necessary
    let slugExists = await prisma.user.findUnique({
      where: { businessSlug }
    });
    
    let counter = 1;
    while (slugExists) {
      businessSlug = `${generateSlug(businessName)}-${counter}`;
      slugExists = await prisma.user.findUnique({
        where: { businessSlug }
      });
      counter++;
    }

    // Generate email verification token
    const emailVerificationToken = crypto.randomBytes(32).toString('hex');

    // Create user
    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        passwordHash,
        businessName,
        businessSlug,
        businessCategory,
        emailVerificationToken
      }
    });

    // Create default settings for user
    await prisma.settings.create({
      data: {
        userId: user.id
      }
    });

    // Send verification email
    try {
      await sendVerificationEmail(user.email, emailVerificationToken);
    } catch (emailError) {
      logger.error('Failed to send verification email:', emailError);
      // Continue with registration even if email fails
    }

    // Generate tokens
    const token = generateToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    // Return user data (exclude sensitive fields)
    const { passwordHash: _, emailVerificationToken: __, ...userData } = user;

    logger.info(`New user registered: ${user.email}`);

    res.status(201).json({
      message: 'Registration successful. Please check your email to verify your account.',
      user: userData,
      token,
      refreshToken
    });

  } catch (error) {
    logger.error('Registration error:', error);
    res.status(500).json({ 
      error: 'Registration failed. Please try again.' 
    });
  }
};

/**
 * Login to account
 * POST /api/auth/login
 */
export const login = async (req, res) => {
  try {
    const { email, password, rememberMe } = req.body;

    // Validate input
    const { error } = validateLogin(req.body);
    if (error) {
      return res.status(400).json({ 
        error: error.details[0].message 
      });
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (!user) {
      return res.status(401).json({ 
        error: 'Invalid email or password' 
      });
    }

    // Check password
    const validPassword = await bcrypt.compare(password, user.passwordHash);
    if (!validPassword) {
      return res.status(401).json({ 
        error: 'Invalid email or password' 
      });
    }

    // Generate tokens
    const token = generateToken(user.id);
    const refreshToken = rememberMe ? generateRefreshToken(user.id) : null;

    // Return user data (exclude sensitive fields)
    const { passwordHash: _, emailVerificationToken, passwordResetToken, ...userData } = user;

    logger.info(`User logged in: ${user.email}`);

    res.json({
      message: 'Login successful',
      user: userData,
      token,
      ...(refreshToken && { refreshToken })
    });

  } catch (error) {
    logger.error('Login error:', error);
    res.status(500).json({ 
      error: 'Login failed. Please try again.' 
    });
  }
};

/**
 * Logout (client-side token removal, but can blacklist token here if needed)
 * POST /api/auth/logout
 */
export const logout = async (req, res) => {
  // In a JWT system, logout is typically handled client-side by removing the token
  // You could implement token blacklisting here if needed
  res.json({ message: 'Logout successful' });
};

/**
 * Verify email address
 * POST /api/auth/verify-email
 */
export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ 
        error: 'Verification token is required' 
      });
    }

    // Find user with this token
    const user = await prisma.user.findFirst({
      where: { emailVerificationToken: token }
    });

    if (!user) {
      return res.status(400).json({ 
        error: 'Invalid or expired verification token' 
      });
    }

    // Update user
    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        emailVerificationToken: null
      }
    });

    logger.info(`Email verified for user: ${user.email}`);

    res.json({ 
      message: 'Email verified successfully' 
    });

  } catch (error) {
    logger.error('Email verification error:', error);
    res.status(500).json({ 
      error: 'Email verification failed' 
    });
  }
};

/**
 * Request password reset
 * POST /api/auth/forgot-password
 */
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ 
        error: 'Email is required' 
      });
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });

    // Always return success to prevent email enumeration
    if (!user) {
      return res.json({ 
        message: 'If an account exists with this email, a password reset link has been sent.' 
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetExpires = new Date(Date.now() + 3600000); // 1 hour

    // Save token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordResetToken: resetToken,
        passwordResetExpires: resetExpires
      }
    });

    // Send email
    try {
      await sendPasswordResetEmail(user.email, resetToken);
    } catch (emailError) {
      logger.error('Failed to send password reset email:', emailError);
    }

    logger.info(`Password reset requested for: ${user.email}`);

    res.json({ 
      message: 'If an account exists with this email, a password reset link has been sent.' 
    });

  } catch (error) {
    logger.error('Forgot password error:', error);
    res.status(500).json({ 
      error: 'Password reset request failed' 
    });
  }
};

/**
 * Reset password with token
 * POST /api/auth/reset-password
 */
export const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ 
        error: 'Token and new password are required' 
      });
    }

    // Validate password
    if (newPassword.length < 8) {
      return res.status(400).json({ 
        error: 'Password must be at least 8 characters long' 
      });
    }

    // Find user with valid token
    const user = await prisma.user.findFirst({
      where: {
        passwordResetToken: token,
        passwordResetExpires: {
          gt: new Date()
        }
      }
    });

    if (!user) {
      return res.status(400).json({ 
        error: 'Invalid or expired reset token' 
      });
    }

    // Hash new password
    const passwordHash = await bcrypt.hash(newPassword, 12);

    // Update user
    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash,
        passwordResetToken: null,
        passwordResetExpires: null
      }
    });

    logger.info(`Password reset successful for: ${user.email}`);

    res.json({ 
      message: 'Password reset successful' 
    });

  } catch (error) {
    logger.error('Reset password error:', error);
    res.status(500).json({ 
      error: 'Password reset failed' 
    });
  }
};

/**
 * Get current user info
 * GET /api/auth/me
 */
export const getCurrentUser = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: {
        id: true,
        email: true,
        businessName: true,
        businessSlug: true,
        businessCategory: true,
        businessDescription: true,
        businessAddress: true,
        businessPhone: true,
        businessEmail: true,
        logoUrl: true,
        coverPhotoUrl: true,
        timezone: true,
        subscriptionTier: true,
        subscriptionStatus: true,
        emailVerified: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (!user) {
      return res.status(404).json({ 
        error: 'User not found' 
      });
    }

    res.json({ user });

  } catch (error) {
    logger.error('Get current user error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch user data' 
    });
  }
};
