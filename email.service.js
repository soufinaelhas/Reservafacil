import nodemailer from 'nodemailer';
import { logger } from '../utils/logger.js';

// Create reusable transporter
let transporter;

if (process.env.EMAIL_SERVICE === 'sendgrid') {
  // SendGrid configuration
  transporter = nodemailer.createTransport({
    host: 'smtp.sendgrid.net',
    port: 587,
    secure: false,
    auth: {
      user: 'apikey',
      pass: process.env.SENDGRID_API_KEY
    }
  });
} else {
  // Default to console output for development
  transporter = nodemailer.createTransport({
    streamTransport: true,
    newline: 'unix',
    buffer: true
  });
}

/**
 * Send verification email
 */
export const sendVerificationEmail = async (email, token) => {
  const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;

  const mailOptions = {
    from: `${process.env.EMAIL_FROM_NAME} <${process.env.EMAIL_FROM}>`,
    to: email,
    subject: 'Verify your email - ReservaFácil',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2563EB;">Welcome to ReservaFácil!</h1>
        <p>Thank you for registering. Please verify your email address by clicking the button below:</p>
        <a href="${verificationUrl}" 
           style="display: inline-block; padding: 12px 24px; background-color: #2563EB; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0;">
          Verify Email
        </a>
        <p>Or copy and paste this link into your browser:</p>
        <p style="color: #6B7280; word-break: break-all;">${verificationUrl}</p>
        <p>This link will expire in 24 hours.</p>
        <hr style="border: none; border-top: 1px solid #E5E7EB; margin: 20px 0;">
        <p style="color: #6B7280; font-size: 14px;">
          If you didn't create an account, you can safely ignore this email.
        </p>
      </div>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    logger.info(`Verification email sent to ${email}`);
    
    // In development, log the email content
    if (process.env.NODE_ENV === 'development') {
      console.log('📧 Email Preview:', info.message.toString());
    }
    
    return info;
  } catch (error) {
    logger.error('Failed to send verification email:', error);
    throw error;
  }
};

/**
 * Send password reset email
 */
export const sendPasswordResetEmail = async (email, token) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

  const mailOptions = {
    from: `${process.env.EMAIL_FROM_NAME} <${process.env.EMAIL_FROM}>`,
    to: email,
    subject: 'Reset your password - ReservaFácil',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2563EB;">Password Reset Request</h1>
        <p>You requested to reset your password. Click the button below to create a new password:</p>
        <a href="${resetUrl}" 
           style="display: inline-block; padding: 12px 24px; background-color: #2563EB; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0;">
          Reset Password
        </a>
        <p>Or copy and paste this link into your browser:</p>
        <p style="color: #6B7280; word-break: break-all;">${resetUrl}</p>
        <p>This link will expire in 1 hour.</p>
        <hr style="border: none; border-top: 1px solid #E5E7EB; margin: 20px 0;">
        <p style="color: #6B7280; font-size: 14px;">
          If you didn't request a password reset, you can safely ignore this email.
        </p>
      </div>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    logger.info(`Password reset email sent to ${email}`);
    
    if (process.env.NODE_ENV === 'development') {
      console.log('📧 Email Preview:', info.message.toString());
    }
    
    return info;
  } catch (error) {
    logger.error('Failed to send password reset email:', error);
    throw error;
  }
};

/**
 * Send booking confirmation email to customer
 */
export const sendBookingConfirmationEmail = async (booking, business) => {
  // TODO: Implement when booking system is ready
  logger.info(`Booking confirmation email would be sent to ${booking.customerEmail}`);
};

/**
 * Send booking reminder email to customer
 */
export const sendBookingReminderEmail = async (booking, business) => {
  // TODO: Implement when booking system is ready
  logger.info(`Booking reminder email would be sent to ${booking.customerEmail}`);
};

/**
 * Send new booking notification to business owner
 */
export const sendNewBookingNotification = async (booking, businessEmail) => {
  // TODO: Implement when booking system is ready
  logger.info(`New booking notification would be sent to ${businessEmail}`);
};

/**
 * Send daily summary email to business owner
 */
export const sendDailySummaryEmail = async (businessEmail, summary) => {
  // TODO: Implement when analytics are ready
  logger.info(`Daily summary email would be sent to ${businessEmail}`);
};
