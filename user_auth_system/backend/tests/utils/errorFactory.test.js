const { ErrorFactory, AppError, ERROR_SEVERITY, ERROR_TYPES } = require('../../src/utils/errorFactory');

describe('ErrorFactory', () => {
    describe('AppError class', () => {
        test('should create an AppError with all properties', () => {
            const message = 'Test error message';
            const statusCode = 400;
            const type = ERROR_TYPES.VALIDATION;
            const severity = ERROR_SEVERITY.LOW;
            const isOperational = true;

            const error = new AppError(message, statusCode, type, severity, isOperational);

            expect(error.message).toBe(message);
            expect(error.statusCode).toBe(statusCode);
            expect(error.type).toBe(type);
            expect(error.severity).toBe(severity);
            expect(error.isOperational).toBe(isOperational);
            expect(error.timestamp).toBeDefined();
            expect(error.stack).toBeDefined();
        });

        test('should create an AppError with default values', () => {
            const message = 'Test error message';
            const statusCode = 500;
            const type = ERROR_TYPES.INTERNAL;

            const error = new AppError(message, statusCode, type);

            expect(error.message).toBe(message);
            expect(error.statusCode).toBe(statusCode);
            expect(error.type).toBe(type);
            expect(error.severity).toBe(ERROR_SEVERITY.MEDIUM);
            expect(error.isOperational).toBe(true);
            expect(error.timestamp).toBeDefined();
            expect(error.stack).toBeDefined();
        });
    });

    describe('validationError', () => {
        test('should create a validation error with correct properties', () => {
            const message = 'Invalid input data';
            const error = ErrorFactory.validationError(message);

            expect(error).toBeInstanceOf(AppError);
            expect(error.message).toBe(message);
            expect(error.statusCode).toBe(400);
            expect(error.type).toBe(ERROR_TYPES.VALIDATION);
            expect(error.severity).toBe(ERROR_SEVERITY.LOW);
            expect(error.isOperational).toBe(true);
        });

        test('should handle empty message', () => {
            const error = ErrorFactory.validationError('');
            
            expect(error.message).toBe('');
            expect(error.statusCode).toBe(400);
            expect(error.type).toBe(ERROR_TYPES.VALIDATION);
        });
    });

    describe('authenticationError', () => {
        test('should create an authentication error with default message', () => {
            const error = ErrorFactory.authenticationError();

            expect(error).toBeInstanceOf(AppError);
            expect(error.message).toBe('Authentication Failed');
            expect(error.statusCode).toBe(401);
            expect(error.type).toBe(ERROR_TYPES.AUTHENTICATION);
            expect(error.severity).toBe(ERROR_SEVERITY.MEDIUM);
            expect(error.isOperational).toBe(true);
        });

        test('should create an authentication error with custom message', () => {
            const customMessage = 'Invalid credentials provided';
            const error = ErrorFactory.authenticationError(customMessage);

            expect(error.message).toBe(customMessage);
            expect(error.statusCode).toBe(401);
            expect(error.type).toBe(ERROR_TYPES.AUTHENTICATION);
        });
    });

    describe('authorizationError', () => {
        test('should create an authorization error with default message', () => {
            const error = ErrorFactory.authorizationError();

            expect(error).toBeInstanceOf(AppError);
            expect(error.message).toBe('Access Denied');
            expect(error.statusCode).toBe(403);
            expect(error.type).toBe(ERROR_TYPES.AUTHORIZATION);
            expect(error.severity).toBe(ERROR_SEVERITY.MEDIUM);
            expect(error.isOperational).toBe(true);
        });

        test('should create an authorization error with custom message', () => {
            const customMessage = 'Insufficient permissions';
            const error = ErrorFactory.authorizationError(customMessage);

            expect(error.message).toBe(customMessage);
            expect(error.statusCode).toBe(403);
            expect(error.type).toBe(ERROR_TYPES.AUTHORIZATION);
        });
    });

    describe('notFoundError', () => {
        test('should create a not found error with default resource', () => {
            const error = ErrorFactory.notFoundError();

            expect(error).toBeInstanceOf(AppError);
            expect(error.message).toBe('Resource not found');
            expect(error.statusCode).toBe(404);
            expect(error.type).toBe(ERROR_TYPES.NOT_FOUND);
            expect(error.severity).toBe(ERROR_SEVERITY.LOW);
            expect(error.isOperational).toBe(true);
        });

        test('should create a not found error with custom resource', () => {
            const resource = 'User';
            const error = ErrorFactory.notFoundError(resource);

            expect(error.message).toBe('User not found');
            expect(error.statusCode).toBe(404);
            expect(error.type).toBe(ERROR_TYPES.NOT_FOUND);
        });
    });

    describe('conflictError', () => {
        test('should create a conflict error', () => {
            const message = 'Resource already exists';
            const error = ErrorFactory.conflictError(message);

            expect(error).toBeInstanceOf(AppError);
            expect(error.message).toBe(message);
            expect(error.statusCode).toBe(409);
            expect(error.type).toBe(ERROR_TYPES.CONFLICT);
            expect(error.severity).toBe(ERROR_SEVERITY.MEDIUM);
            expect(error.isOperational).toBe(true);
        });
    });

    describe('internalError', () => {
        test('should create an internal error with default message', () => {
            const error = ErrorFactory.internalError();

            expect(error).toBeInstanceOf(AppError);
            expect(error.message).toBe('Internal Server Error');
            expect(error.statusCode).toBe(500);
            expect(error.type).toBe(ERROR_TYPES.INTERNAL);
            expect(error.severity).toBe(ERROR_SEVERITY.HIGH);
            expect(error.isOperational).toBe(true);
        });

        test('should create an internal error with custom message', () => {
            const customMessage = 'Database connection failed';
            const error = ErrorFactory.internalError(customMessage);

            expect(error.message).toBe(customMessage);
            expect(error.statusCode).toBe(500);
            expect(error.type).toBe(ERROR_TYPES.INTERNAL);
        });
    });

    describe('operationalError', () => {
        test('should create an operational error', () => {
            const message = 'Service unavailable';
            const error = ErrorFactory.operationalError(message);

            expect(error).toBeInstanceOf(AppError);
            expect(error.message).toBe(message);
            expect(error.statusCode).toBe(500);
            expect(error.type).toBe(ERROR_TYPES.OPERATIONAL);
            expect(error.severity).toBe(ERROR_SEVERITY.CRITICAL);
            expect(error.isOperational).toBe(true);
        });
    });

    describe('databaseError', () => {
        test('should create a database error with default message', () => {
            const error = ErrorFactory.databaseError();

            expect(error).toBeInstanceOf(AppError);
            expect(error.message).toBe('Database Connection Failed');
            expect(error.statusCode).toBe(500);
            expect(error.type).toBe(ERROR_TYPES.OPERATIONAL);
            expect(error.severity).toBe(ERROR_SEVERITY.CRITICAL);
            expect(error.isOperational).toBe(true);
        });

        test('should create a database error with custom message', () => {
            const customMessage = 'Query execution failed';
            const error = ErrorFactory.databaseError(customMessage);

            expect(error.message).toBe(customMessage);
            expect(error.statusCode).toBe(500);
            expect(error.type).toBe(ERROR_TYPES.OPERATIONAL);
        });
    });

    describe('tokenError', () => {
        test('should create a token error with default message', () => {
            const error = ErrorFactory.tokenError();

            expect(error).toBeInstanceOf(AppError);
            expect(error.message).toBe('Invalid or Expired Token');
            expect(error.statusCode).toBe(403);
            expect(error.type).toBe(ERROR_TYPES.AUTHENTICATION);
            expect(error.severity).toBe(ERROR_SEVERITY.MEDIUM);
            expect(error.isOperational).toBe(true);
        });

        test('should create a token error with custom message', () => {
            const customMessage = 'Token has been revoked';
            const error = ErrorFactory.tokenError(customMessage);

            expect(error.message).toBe(customMessage);
            expect(error.statusCode).toBe(403);
            expect(error.type).toBe(ERROR_TYPES.AUTHENTICATION);
        });
    });

    describe('userExistsError', () => {
        test('should create a user exists error', () => {
            const error = ErrorFactory.userExistsError();

            expect(error).toBeInstanceOf(AppError);
            expect(error.message).toBe('User with this email already exists');
            expect(error.statusCode).toBe(409);
            expect(error.type).toBe(ERROR_TYPES.CONFLICT);
            expect(error.severity).toBe(ERROR_SEVERITY.MEDIUM);
            expect(error.isOperational).toBe(true);
        });
    });

    describe('invalidCredentialsError', () => {
        test('should create an invalid credentials error', () => {
            const error = ErrorFactory.invalidCredentialsError();

            expect(error).toBeInstanceOf(AppError);
            expect(error.message).toBe('Invalid credentials');
            expect(error.statusCode).toBe(401);
            expect(error.type).toBe(ERROR_TYPES.AUTHENTICATION);
            expect(error.severity).toBe(ERROR_SEVERITY.MEDIUM);
            expect(error.isOperational).toBe(true);
        });
    });

    describe('ERROR_TYPES constants', () => {
        test('should have all expected error types', () => {
            expect(ERROR_TYPES).toEqual({
                OPERATIONAL: 'OPERATIONAL',
                VALIDATION: 'VALIDATION',
                AUTHENTICATION: 'AUTHENTICATION',
                AUTHORIZATION: 'AUTHORIZATION',
                NOT_FOUND: 'NOT_FOUND',
                CONFLICT: 'CONFLICT',
                INTERNAL: 'INTERNAL'
            });
        });
    });

    describe('ERROR_SEVERITY constants', () => {
        test('should have all expected severity levels', () => {
            expect(ERROR_SEVERITY).toEqual({
                LOW: 'LOW',
                MEDIUM: 'MEDIUM',
                HIGH: 'HIGH',
                CRITICAL: 'CRITICAL'
            });
        });
    });
});