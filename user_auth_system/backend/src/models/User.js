const { pool } = require('../config/database');

class User {
    static async findByEmail(email) {
        try {
            const result = await pool.query(
                'SELECT * FROM users WHERE email = $1',
                [email]
            );
            return result.rows[0];
        } 
        catch (error) {
            throw new Error('Database error: Unable to find user');
        }
    }

    static async findById(id) {
        try {
            const result = await pool.query(
                'SELECT id, email, name, created_at FROM users WHERE id = $1',
                [id]
            );
            return result.rows[0];
        } 
        catch (error) {
            throw new Error('Database error: Unable to find user');
        }
    }

    static async create({ email, password, name }) {
        try {
            const result = await pool.query(
                'INSERT INTO users (email, password, name) VALUES ($1, $2, $3) RETURNING id, email, name, created_at',
                [email, password, name]
            );
            return result.rows[0];
        } 
        catch (error) {
            if (error.code === '23505') { // Unique constraint violation
                throw new Error('User with this email already exists');
            }
            throw new Error('Database error: Unable to create user');
        }
    }

    static async updateLastLogin(id) {
        try {
            await pool.query(
                'UPDATE users SET updated_at = CURRENT_TIMESTAMP WHERE id = $1',
                [id]
            );
        } 
        catch (error) {
            console.error('Error updating last login:', error);
        }
    }
}

module.exports = User;