
const { AppError, ERROR_TYPES, ERROR_SEVERITY, ErrorFactory } = require('../utils/errorFactory');

const logger = {
    error: (message, error) => {
        console.error(`[ERROR] ${message}`, {
            timestamp: new Date().toISOString(),
            error: error.message,
            stack: error.stack,
            type: error.type,
            severity: error.severity
        });
    },
    warn: (message) => {
        console.warn(`[WARN] ${message}`);
    },
    info: (message) => {
        console.log(`[INFO] ${message}`);
    }
};

//Error handler middleware
const errorHandler = (err, req, res, next) => {
    let error = err;

    //Convert non-AppError to AppError
    if (!(error instanceof AppError)) {
        // Handle Sequelize errors
        if (error.name && error.name.startsWith('Sequelize')) {
            error = ErrorFactory.handleSequelizeError(error);
        }
        //PostgreSQL unique constraint violation
        else if (err.code === '23505') {
            error = new AppError(
                'Resource already exists',
                409,
                ERROR_TYPES.CONFLICT,
                ERROR_SEVERITY.MEDIUM,
                true
            );
        }
        //Database connection error
        else if (err.code === 'ECONNREFUSED') {
            error = new AppError(
                'Database connection failed',
                500,
                ERROR_TYPES.OPERATIONAL,
                ERROR_SEVERITY.CRITICAL,
                true
            );
        }
        //JWT errors
        else if (err.name === 'JsonWebTokenError') {
            error = new AppError(
                'Invalid token',
                403,
                ERROR_TYPES.AUTHENTICATION,
                ERROR_SEVERITY.MEDIUM,
                true
            );
        }
        else if (err.name === 'TokenExpiredError') {
            error = new AppError(
                'Token expired',
                403,
                ERROR_TYPES.AUTHENTICATION,
                ERROR_SEVERITY.MEDIUM,
                true
            );
        }
        else {
            //Generic internal server error
            error = new AppError(
                'Something went wrong',
                500,
                ERROR_TYPES.INTERNAL,
                ERROR_SEVERITY.HIGH,
                false
            );
        }
    }

    //Log error based on severity
    if (error.severity === ERROR_SEVERITY.CRITICAL || error.severity === ERROR_SEVERITY.HIGH) {
        logger.error(`${error.type} Error: ${error.message}`, error);
    }
    else if (error.severity === ERROR_SEVERITY.MEDIUM) {
        logger.warn(`${error.type} Warning: ${error.message}`);
    }
    else {
        logger.info(`${error.type} Info: ${error.message}`);
    }

    //Send error response
    const errorResponse = {
        success: false,
        error: {
            message: error.message,
            type: error.type,
            severity: error.severity,
            timestamp: error.timestamp
        }
    };

    //Include stack trace in development
    if (process.env.NODE_ENV === 'development') {
        errorResponse.error.stack = error.stack;
    }

    //Include request info for debugging critical/high severity errors
    if (error.severity === ERROR_SEVERITY.CRITICAL || error.severity === ERROR_SEVERITY.HIGH) {
        errorResponse.error.requestInfo = {
            method: req.method,
            url: req.url,
            userAgent: req.get('User-Agent'),
            ip: req.ip
        };
    }

    res.status(error.statusCode || 500).json(errorResponse);
};

//Async error wrapper
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

//404 handler
const notFoundHandler = (req, res, next) => {
    const error = new AppError(
        `Route ${req.originalUrl} not found`,
        404,
        ERROR_TYPES.NOT_FOUND,
        ERROR_SEVERITY.LOW,
        true
    );
    next(error);
};

//Global error logger for unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
    logger.error('Unhandled Rejection at:', { promise, reason });
});

//Global error logger for uncaught exceptions
process.on('uncaughtException', (err) => {
    logger.error('Uncaught Exception:', err);
    process.exit(1);
});

module.exports = { errorHandler, asyncHandler, notFoundHandler };