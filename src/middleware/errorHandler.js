// middleware/errorHandler.js - Global Error Handler
import AppError from '../utils/AppError.js';

const handleSequelizeValidationError = (err) => {
  console.error('SEQUELIZE VALIDATION ERROR DETAILS:', JSON.stringify(err.errors, null, 2));
  const errors = err.errors.map((e) => e.message);
  const message = errors.join('. ');
  return new AppError(message, 400);
};

// Handle Sequelize Unique Constraint Error
const handleSequelizeUniqueConstraintError = (err) => {
  const field = err.errors?.[0]?.path || 'field';
  const message = `Nilai ${field} sudah digunakan. Gunakan nilai lain.`;
  return new AppError(message, 409);
};

// Handle Legacy MongoDB Errors (kept for compatibility)
const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
  const value = err.errmsg?.match(/(["'])(\\?.)*?\1/)?.[0];
  const message = `Duplicate field value: ${value}. Please use another value!`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

// Handle JWT Errors
const handleJWTError = () =>
  new AppError('Invalid token. Please log in again!', 401);

const handleJWTExpiredError = () =>
  new AppError('Your token has expired! Please log in again.', 401);

// Send Error Response
const sendErrorDev = (err, res) => {
  // Ensure we send a proper JSON even if err is an Error object
  res.status(err.statusCode).json({
    success: false,
    status: err.status,
    message: err.message,
    error: {
      ...err,
      name: err.name,
      message: err.message,
      stack: err.stack
    },
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  } 
  // Programming or unknown error: don't leak error details
  else {
    console.error('ERROR 💥', err);

    res.status(500).json({
      success: false,
      message: 'Sesuatu bermasalah di server!',
    });
  }
};

// Normalize any error into an AppError with proper message
const normalizeError = (err) => {
  let error = Object.assign(Object.create(Object.getPrototypeOf(err)), err);
  error.message = err.message;

  // Handle SyntaxError (like JSON.parse error)
  if (err instanceof SyntaxError && err.message.includes('JSON')) {
    return new AppError(`Format JSON tidak valid: ${err.message}`, 400);
  }

  // Sequelize errors
  if (err.name === 'SequelizeValidationError') return handleSequelizeValidationError(err);
  if (err.name === 'SequelizeUniqueConstraintError') return handleSequelizeUniqueConstraintError(err);
  if (err.name === 'SequelizeForeignKeyConstraintError') {
    return new AppError('Gagal: Data relasi tidak ditemukan atau masih digunakan.', 400);
  }
  if (err.name === 'SequelizeDatabaseError') {
    return new AppError(`Database Error: ${err.message}`, 400);
  }

  // Legacy MongoDB errors
  if (err.name === 'CastError') return handleCastErrorDB(err);
  if (err.code === 11000) return handleDuplicateFieldsDB(err);
  if (err.name === 'ValidationError') return handleValidationErrorDB(err);

  // JWT errors
  if (err.name === 'JsonWebTokenError') return handleJWTError();
  if (err.name === 'TokenExpiredError') return handleJWTExpiredError();

  return error;
};

// Main Error Handler
export const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  const normalizedErr = normalizeError(err);
  
  // Ensure operational errors are marked if from database but handled
  if (normalizedErr instanceof AppError) {
    normalizedErr.isOperational = true;
  }

  if (process.env.NODE_ENV === 'development') {
    // Di development, tetap kirim detail error tapi sudah di-normalize
    sendErrorDev(normalizedErr, res);
  } else {
    sendErrorProd(normalizedErr, res);
  }
};

// Async Error Wrapper
export const catchAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};