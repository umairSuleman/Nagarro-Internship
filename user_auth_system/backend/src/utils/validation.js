const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

const validatePassword = (password) => {
    return password && password.length >= 6;
};

const validateName = (name) => {
    return name && name.trim().length >= 2;
};

const validateRegistrationData = (data) => {
    const { name, email, password } = data;
    const errors = [];

    if (!validateName(name)) {
        errors.push('Name must be at least 2 characters long');
    }

    if (!validateEmail(email)) {
        errors.push('Please provide a valid email address');
    }

    if (!validatePassword(password)) {
        errors.push('Password must be at least 6 characters long');
    }

    return {
        isValid: errors.length === 0,
        errors
    };
};

const validateLoginData = (data) => {
    const { email, password } = data;
    const errors = [];

    if (!email) {
        errors.push('Email is required');
    }

    if (!password) {
        errors.push('Password is required');
    }

    return {
        isValid: errors.length === 0,
        errors
    };
};

module.exports = {
    validateEmail,
    validatePassword,
    validateName,
    validateRegistrationData,
    validateLoginData
};