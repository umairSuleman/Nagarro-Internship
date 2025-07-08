
const { AppError, ERROR_TYPES, ERROR_SEVERITY } = require('../utils/errorFactory');

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

//error handler middleware
const errorHandler = (err, req, res, next) => {
    let error = err;

    //convert non-appError to AppError
    if(!(error instanceof AppError)){       //postgresSQL unique constraint violation
        if(err.code == '23505'){
            error = new AppError(
                'Resource already exists',
                409,
                ERROR_TYPES.CONFLICT,
                ERROR_SEVERITY.MEDIUM,
                true
            );
        }
        else if(err.code == 'ECONNREFUSED'){    //database connection error 
            error = new AppError(
                'Database connection failed',
                500,
                ERROR_TYPES.OPERATIONAL,
                ERROR_SEVERITY.CRITICAL,
                true
            );
        }
        else if (err.name === 'JsonWebTokenError') {    //JWT errors
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
            // Generic internal server error
            error = new AppError(
                'Something went wrong',
                500,
                ERROR_TYPES.INTERNAL,
                ERROR_SEVERITY.HIGH,
                false
            );
        }
    }


    //log error based on severity
    if(error.severity == ERROR_SEVERITY.CRITICAL || error.severity == ERROR_SEVERITY.HIGH) {
        logger.error(`${error.type} Error: ${error.message}`, error);
    }
    else if(error.severity == ERROR_SEVERITY.MEDIUM){
        logger.warn(`${error.type} Warning: ${error.message}`);
    }
    else{
        logger.info(`${error.type} Info: ${error.message}`);
    }

    //send error response
    const errorResponse = {
        success: false,
        error: {
            message: error.message,
            type: error.type,
            severity: error.severity,
            timestamp: error.timestamp
        }
    };

    //including stack trace
    if(process.env.NODE_ENV =='development'){
        errorResponse.error.stack = error.stack;
    }

    //include request info for debugging
    if(error.severity == ERROR_SEVERITY.CRITICAL || error.severity == ERROR_SEVERITY.HIGH){
        errorResponse.error.requestInfo = {
            method: req.method,
            url: req.url,
            userAgent: req.get('User-Agent'),
            ip: req.ip
        };
    }

    res.status(error.statusCode || 500).json(errorResponse);

};

//async error wrapper
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
}

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

//global error logger for unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
    logger.error('Unhandled Rejection at:', { promise, reason });
    // Optionally exit the process
    // process.exit(1);
});

//global error logger for uncaught exceptions
process.on('uncaughtException', (err) => {
    logger.error('Uncaught Exception:', err);
    process.exit(1);
});

module.exports = {
    errorHandler,
    asyncHandler,
    notFoundHandler
};
