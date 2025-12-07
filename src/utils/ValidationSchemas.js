// utils/validationSchemas.js - Input Validation with Joi
import Joi from 'joi';

// Password validation with strong requirements
const passwordSchema = Joi.string()
  .min(8)
  .max(128)
  .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^()_+\-=[\]{};':"\\|,.<>/?])/)
  .required()
  .messages({
    'string.pattern.base': 
      'Password harus minimal 8 karakter dan mengandung huruf besar, kecil, angka, dan simbol',
    'string.min': 'Password minimal 8 karakter',
    'string.max': 'Password maksimal 128 karakter',
  });

// Username validation
const usernameSchema = Joi.string()
  .alphanum()
  .min(3)
  .max(30)
  .lowercase()
  .required()
  .messages({
    'string.alphanum': 'Username hanya boleh berisi huruf dan angka',
    'string.min': 'Username minimal 3 karakter',
    'string.max': 'Username maksimal 30 karakter',
  });

// Auth Schemas
export const registerAdminSchema = Joi.object({
  username: usernameSchema,
  password: passwordSchema,
  role: Joi.string().valid('admin').default('admin'),
});

export const registerCustomerSchema = Joi.object({
  username: usernameSchema,
  password: passwordSchema,
  nomorhp: Joi.string()
    .pattern(/^[0-9]{10,15}$/)
    .required()
    .messages({
      'string.pattern.base': 'Nomor HP harus berupa angka 10-15 digit',
    }),
});

export const loginSchema = Joi.object({
  username: usernameSchema,
  password: Joi.string().required(),
});

// Catalog Schemas
export const createCatalogSchema = Joi.object({
  productName: Joi.string().min(3).max(200).trim().required(),
  productPrice: Joi.number().positive().required(),
  productDescription: Joi.string().min(10).max(2000).trim().required(),
  category: Joi.string().trim().optional(),
  colors: Joi.alternatives()
    .try(
      Joi.array().items(Joi.string().trim()).min(1),
      Joi.string() // Will be parsed as JSON
    )
    .required(),
  sizes: Joi.alternatives()
    .try(
      Joi.array().items(Joi.string().trim()).min(1),
      Joi.string() // Will be parsed as JSON
    )
    .required(),
  stock: Joi.number().integer().min(0).default(0),
});

export const updateCatalogSchema = Joi.object({
  productName: Joi.string().min(3).max(200).trim(),
  productPrice: Joi.number().positive(),
  productDescription: Joi.string().min(10).max(2000).trim(),
  category: Joi.string().trim(),
  colors: Joi.alternatives().try(
    Joi.array().items(Joi.string().trim()),
    Joi.string()
  ),
  sizes: Joi.alternatives().try(
    Joi.array().items(Joi.string().trim()),
    Joi.string()
  ),
  stock: Joi.number().integer().min(0),
  existingImages: Joi.string(), // JSON string
  deletedImages: Joi.string(), // JSON string
}).min(1);

// Cart Schema
export const addToCartSchema = Joi.object({
  productId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      'string.pattern.base': 'Product ID tidak valid',
    }),
  quantity: Joi.number().integer().min(1).max(100).default(1),
});

export const updateCartSchema = Joi.object({
  itemId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      'string.pattern.base': 'Item ID tidak valid',
    }),
  quantity: Joi.number().integer().min(0).max(100).required(),
});

// Article Schema
export const createArticleSchema = Joi.object({
  JudulArtikel: Joi.string().min(5).max(200).trim().required(),
  IsiArtikel: Joi.string().min(50).required(),
  ImageUrl: Joi.string()
    .uri({ scheme: ['http', 'https'] })
    .custom((value, helpers) => {
      try {
        const url = new URL(value);
        const allowedDomains = process.env.ALLOWED_IMAGE_DOMAINS?.split(',') || [];
        
        // Block internal IPs
        if (
          url.hostname === 'localhost' ||
          url.hostname.startsWith('127.') ||
          url.hostname.startsWith('192.168.') ||
          url.hostname.startsWith('10.') ||
          url.hostname === '169.254.169.254'
        ) {
          return helpers.error('any.invalid');
        }
        
        // Check whitelist
        const isAllowed = allowedDomains.some(domain => 
          url.hostname.endsWith(domain.trim())
        );
        
        if (!isAllowed && allowedDomains.length > 0) {
          return helpers.error('any.invalid');
        }
        
        return value;
      } catch {
        return helpers.error('any.invalid');
      }
    })
    .optional()
    .allow(null)
    .messages({
      'any.invalid': 'URL gambar tidak diizinkan atau tidak valid',
    }),
});

// Feedback Schema
export const createFeedbackSchema = Joi.object({
  komentar: Joi.string().min(10).max(1000).trim().required(),
  rating: Joi.number().integer().min(1).max(5).required(),
});

// Portfolio Schema
export const createPortofolioSchema = Joi.object({
  keterangan: Joi.string().min(10).max(500).trim().required(),
});

// Validation Middleware
export const validate = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errors = error.details.map((detail) => detail.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors,
      });
    }

    req.body = value;
    next();
  };
};