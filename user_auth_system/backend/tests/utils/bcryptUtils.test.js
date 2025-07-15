const { hashPassword, comparePassword } = require('../../src/utils/bcryptUtils');

describe('bcryptUtils', () => {
    describe('hashPassword', () => {
        test('should hash a password successfully', async () => {
            const password = 'testPassword123';
            const hashedPassword = await hashPassword(password);
            
            expect(hashedPassword).toBeDefined();
            expect(typeof hashedPassword).toBe('string');
            expect(hashedPassword).not.toBe(password);
        });

        test('should generate different hashes for the same password', async () => {
            const password = 'testPassword123';
            const hash1 = await hashPassword(password);
            const hash2 = await hashPassword(password);
            
            expect(hash1).not.toBe(hash2);
        });

        test('should handle empty password', async () => {
            const password = '';
            const hashedPassword = await hashPassword(password);
            
            expect(hashedPassword).toBeDefined();
            expect(typeof hashedPassword).toBe('string');
        });

        test('should handle special characters in password', async () => {
            const password = '!@#$%^&*()_+-=[]{}|;:,.<>?';
            const hashedPassword = await hashPassword(password);
            
            expect(hashedPassword).toBeDefined();
            expect(typeof hashedPassword).toBe('string');
        });
    });

    describe('comparePassword', () => {
        test('should return true for matching password and hash', async () => {
            const password = 'testPassword123';
            const hashedPassword = await hashPassword(password);
            
            const isMatch = await comparePassword(password, hashedPassword);
            expect(isMatch).toBe(true);
        });

        test('should return false for non-matching password and hash', async () => {
            const password = 'testPassword123';
            const wrongPassword = 'wrongPassword456';
            const hashedPassword = await hashPassword(password);
            
            const isMatch = await comparePassword(wrongPassword, hashedPassword);
            expect(isMatch).toBe(false);
        });

        test('should handle case sensitivity correctly', async () => {
            const password = 'TestPassword123';
            const hashedPassword = await hashPassword(password);
            
            const isMatchLower = await comparePassword('testpassword123', hashedPassword);
            const isMatchUpper = await comparePassword('TESTPASSWORD123', hashedPassword);
            const isMatchCorrect = await comparePassword('TestPassword123', hashedPassword);
            
            expect(isMatchLower).toBe(false);
            expect(isMatchUpper).toBe(false);
            expect(isMatchCorrect).toBe(true);
        });

        test('should handle special characters correctly', async () => {
            const password = '!@#$%^&*()_+-=[]{}|;:,.<>?';
            const hashedPassword = await hashPassword(password);
            
            const isMatch = await comparePassword(password, hashedPassword);
            expect(isMatch).toBe(true);
        });
    });
});