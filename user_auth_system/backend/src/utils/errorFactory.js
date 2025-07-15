// Error types constraints
const ERROR_TYPES = {
    OPERATIONAL: 'OPERATIONAL',
    VALIDATION: 'VALIDATION',
    AUTHENTICATION: 'AUTHENTICATION',
    AUTHORIZATION: 'AUTHORIZATION',
    NOT_FOUND: 'NOT_FOUND',
    CONFLICT: 'CONFLICT',
    INTERNAL: 'INTERNAL'
};

const ERROR_SEVERITY = {
    LOW: 'LOW',
    MEDIUM: 'MEDIUM',
    HIGH: 'HIGH',
    CRITICAL: 'CRITICAL'
};

class AppError extends Error {
    constructor(message, statusCode, type, severity = ERROR_SEVERITY.MEDIUM, isOperational = true) {
        super(message);
        this.statusCode = statusCode;
        this.type = type;
        this.severity = severity;
        this.isOperational = isOperational;
        this.timestamp = new Date().toISOString();

        Error.captureStackTrace(this, this.constructor);
    }
}

class ErrorFactory {
    //Validation errors
    static validationError(message, details = null) {
        return new AppError(
            message,
            400,
            ERROR_TYPES.VALIDATION,
            ERROR_SEVERITY.LOW,
            true
        );
    }

    //Authentication errors
    static authenticationError(message = 'Authentication Failed') {
        return new AppError(
            message,
            401,
            ERROR_TYPES.AUTHENTICATION,
            ERROR_SEVERITY.MEDIUM,
            true
        );
    }

    //Authorization errors
    static authorizationError(message = 'Access Denied') {
        return new AppError(
            message,
            403,
            ERROR_TYPES.AUTHORIZATION,
            ERROR_SEVERITY.MEDIUM,
            true
        );
    }

    //Not found errors
    static notFoundError(resource = 'Resource') {
        return new AppError(
            `${resource} not found`,
            404,
            ERROR_TYPES.NOT_FOUND,
            ERROR_SEVERITY.LOW,
            true
        );
    }

    //Conflict errors
    static conflictError(message) {
        return new AppError(
            message,
            409,
            ERROR_TYPES.CONFLICT,
            ERROR_SEVERITY.MEDIUM,
            true
        );
    }

    //Internal server error
    static internalError(message = 'Internal Server Error') {
        return new AppError(
            message,
            500,
            ERROR_TYPES.INTERNAL,
            ERROR_SEVERITY.HIGH,
            true
        );
    }

    //Operational errors
    static operationalError(message) {
        return new AppError(
            message,
            500,
            ERROR_TYPES.OPERATIONAL,
            ERROR_SEVERITY.CRITICAL,
            true
        );
    }

    //Database errors
    static databaseError(message = 'Database Connection Failed') {
        return new AppError(
            message,
            500,
            ERROR_TYPES.OPERATIONAL,
            ERROR_SEVERITY.CRITICAL,
            true
        );
    }

    //Token related errors
    static tokenError(message = 'Invalid or Expired Token') {
        return new AppError(
            message,
            403,
            ERROR_TYPES.AUTHENTICATION,
            ERROR_SEVERITY.MEDIUM,
            true
        );
    }

    //User already exists
    static userExistsError() {
        return new AppError(
            'User with this email already exists',
            409,
            ERROR_TYPES.CONFLICT,
            ERROR_SEVERITY.MEDIUM,
            true
        );
    }

    //Invalid credentials
    static invalidCredentialsError() {
        return new AppError(
            'Invalid credentials',
            401,
            ERROR_TYPES.AUTHENTICATION,
            ERROR_SEVERITY.MEDIUM,
            true
        );
    }

    //Handle Sequelize errors
    static handleSequelizeError(error) {
        if (error.name === 'SequelizeValidationError') {
            const message = error.errors[0]?.message || 'Validation failed';
            return this.validationError(message);
        }
        
        if (error.name === 'SequelizeUniqueConstraintError') {
            return this.userExistsError();
        }
        
        if (error.name === 'SequelizeConnectionError') {
            return this.databaseError('Database connection failed');
        }
        
        if (error.name === 'SequelizeDatabaseError') {
            return this.databaseError('Database operation failed');
        }
        
        //Generic Sequelize error
        return this.internalError('Database operation failed');
    }
}

module.exports = { ErrorFactory, AppError, ERROR_SEVERITY, ERROR_TYPES };