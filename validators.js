import Joi from 'joi';

/**
 * Registration validation schema
 */
export const validateRegistration = (data) => {
  const schema = Joi.object({
    email: Joi.string()
      .email()
      .required()
      .messages({
        'string.email': 'Please enter a valid email address',
        'any.required': 'Email is required'
      }),
    password: Joi.string()
      .min(8)
      .pattern(/^(?=.*[0-9])(?=.*[!@#$%^&*])/)
      .required()
      .messages({
        'string.min': 'Password must be at least 8 characters long',
        'string.pattern.base': 'Password must contain at least one number and one special character',
        'any.required': 'Password is required'
      }),
    businessName: Joi.string()
      .min(2)
      .max(255)
      .required()
      .messages({
        'string.min': 'Business name must be at least 2 characters',
        'string.max': 'Business name must not exceed 255 characters',
        'any.required': 'Business name is required'
      }),
    businessCategory: Joi.string()
      .optional()
      .allow('')
  });

  return schema.validate(data);
};

/**
 * Login validation schema
 */
export const validateLogin = (data) => {
  const schema = Joi.object({
    email: Joi.string()
      .email()
      .required()
      .messages({
        'string.email': 'Please enter a valid email address',
        'any.required': 'Email is required'
      }),
    password: Joi.string()
      .required()
      .messages({
        'any.required': 'Password is required'
      }),
    rememberMe: Joi.boolean()
      .optional()
  });

  return schema.validate(data);
};

/**
 * Service validation schema
 */
export const validateService = (data) => {
  const schema = Joi.object({
    name: Joi.string()
      .min(2)
      .max(255)
      .required()
      .messages({
        'any.required': 'Service name is required'
      }),
    description: Joi.string()
      .allow('')
      .optional(),
    durationMinutes: Joi.number()
      .integer()
      .min(1)
      .required()
      .messages({
        'number.min': 'Duration must be at least 1 minute',
        'any.required': 'Duration is required'
      }),
    price: Joi.number()
      .min(0)
      .required()
      .messages({
        'number.min': 'Price must be 0 or greater',
        'any.required': 'Price is required'
      }),
    bufferTimeMinutes: Joi.number()
      .integer()
      .min(0)
      .optional()
      .default(0),
    category: Joi.string()
      .optional()
      .allow(''),
    depositRequired: Joi.boolean()
      .optional()
      .default(false),
    depositAmount: Joi.number()
      .min(0)
      .optional()
      .allow(null),
    depositPercentage: Joi.number()
      .integer()
      .min(0)
      .max(100)
      .optional()
      .allow(null),
    maxAdvanceDays: Joi.number()
      .integer()
      .min(1)
      .optional()
      .default(90),
    minAdvanceHours: Joi.number()
      .integer()
      .min(0)
      .optional()
      .default(2),
    imageUrl: Joi.string()
      .uri()
      .optional()
      .allow(''),
    isActive: Joi.boolean()
      .optional()
      .default(true)
  });

  return schema.validate(data);
};

/**
 * Booking validation schema
 */
export const validateBooking = (data) => {
  const schema = Joi.object({
    serviceId: Joi.string()
      .uuid()
      .required()
      .messages({
        'any.required': 'Service is required'
      }),
    customerName: Joi.string()
      .min(2)
      .max(255)
      .required()
      .messages({
        'any.required': 'Customer name is required'
      }),
    customerEmail: Joi.string()
      .email()
      .required()
      .messages({
        'string.email': 'Please enter a valid email address',
        'any.required': 'Customer email is required'
      }),
    customerPhone: Joi.string()
      .required()
      .messages({
        'any.required': 'Customer phone is required'
      }),
    customerNotes: Joi.string()
      .max(500)
      .optional()
      .allow(''),
    bookingDate: Joi.date()
      .iso()
      .required()
      .messages({
        'any.required': 'Booking date is required'
      }),
    bookingTime: Joi.string()
      .pattern(/^([01]\d|2[0-3]):([0-5]\d)$/)
      .required()
      .messages({
        'string.pattern.base': 'Time must be in HH:MM format',
        'any.required': 'Booking time is required'
      })
  });

  return schema.validate(data);
};
