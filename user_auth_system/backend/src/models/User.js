const { pool } = require('../config/database');
const { ErrorFactory } = require('../utils/errorFactory');

class User {
    constructor(data) {
        this.id = data.id;
        this.email = data.email;
        this.password = data.password;
        this.name = data.name;
        this.createdAt = data.created_at;
        this.updatedAt = data.updated_at;
    }

    // Convert database row to User entity
    static fromRow(row) {
        if (!row) return null;
        return new User(row);
    }

    // Convert User entity to safe object (without password)
    toSafeObject() {
        return {
            id: this.id,
            email: this.email,
            name: this.name,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        };
    }
}

class UserRepository {
    static async findByEmail(email) {
        try {
            const result = await pool.query(
                'SELECT * FROM users WHERE email = $1',
                [email]
            );
            return User.fromRow(result.rows[0]);
        } catch (error) {
            throw ErrorFactory.databaseError('Failed to find user by email');
        }
    }

    static async findById(id) {
        try {
            const result = await pool.query(
                'SELECT * FROM users WHERE id = $1',
                [id]
            );
            return User.fromRow(result.rows[0]);
        } catch (error) {
            throw ErrorFactory.databaseError('Failed to find user by ID');
        }
    }

    static async create({ email, password, name }) {
        try {
            const result = await pool.query(
                'INSERT INTO users (email, password, name) VALUES ($1, $2, $3) RETURNING *',
                [email, password, name]
            );
            return User.fromRow(result.rows[0]);
        } catch (error) {
            if (error.code === '23505') {
                throw ErrorFactory.userExistsError();
            }
            throw ErrorFactory.databaseError('Failed to create user');
        }
    }

    static async updateById(id, updates) {
        try {
            const setClause = Object.keys(updates)
                .map((key, index) => `${key} = $${index + 2}`)
                .join(', ');
            
            const values = [id, ...Object.values(updates)];
            
            const result = await pool.query(
                `UPDATE users SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *`,
                values
            );
            
            return User.fromRow(result.rows[0]);
        } catch (error) {
            throw ErrorFactory.databaseError('Failed to update user');
        }
    }

    static async updateLastLogin(id) {
        try {
            await pool.query(
                'UPDATE users SET updated_at = CURRENT_TIMESTAMP WHERE id = $1',
                [id]
            );
        } catch (error) {
            throw ErrorFactory.databaseError('Failed to update last login');
        }
    }

    static async deleteById(id) {
        try {
            const result = await pool.query(
                'DELETE FROM users WHERE id = $1 RETURNING *',
                [id]
            );
            return User.fromRow(result.rows[0]);
        } catch (error) {
            throw ErrorFactory.databaseError('Failed to delete user');
        }
    }

    static async findAll(limit = 100, offset = 0) {
        try {
            const result = await pool.query(
                'SELECT * FROM users ORDER BY created_at DESC LIMIT $1 OFFSET $2',
                [limit, offset]
            );
            return result.rows.map(row => User.fromRow(row));
        } catch (error) {
            throw ErrorFactory.databaseError('Failed to fetch users');
        }
    }

    static async count() {
        try {
            const result = await pool.query('SELECT COUNT(*) FROM users');
            return parseInt(result.rows[0].count);
        } catch (error) {
            throw ErrorFactory.databaseError('Failed to count users');
        }
    }

    static async existsByEmail(email) {
        try {
            const result = await pool.query(
                'SELECT EXISTS(SELECT 1 FROM users WHERE email = $1)',
                [email]
            );
            return result.rows[0].exists;
        } catch (error) {
            throw ErrorFactory.databaseError('Failed to check user existence');
        }
    }
}

// Service layer for business logic
class UserService {
    static async createUser(userData) {
        const { email, password, name } = userData;
        
        // Check if user already exists
        const existingUser = await UserRepository.findByEmail(email);
        if (existingUser) {
            throw ErrorFactory.userExistsError();
        }
        
        // Create user
        const user = await UserRepository.create({
            email: email.toLowerCase().trim(),
            password,
            name: name.trim()
        });
        
        return user;
    }

    static async authenticateUser(email, password) {
        const user = await UserRepository.findByEmail(email.toLowerCase().trim());
        if (!user) {
            throw ErrorFactory.invalidCredentialsError();
        }
        
        return user;
    }

    static async getUserById(id) {
        const user = await UserRepository.findById(id);
        if (!user) {
            throw ErrorFactory.notFoundError('User');
        }
        
        return user;
    }

    static async updateUserLastLogin(id) {
        return await UserRepository.updateLastLogin(id);
    }

    static async getUserProfile(id) {
        const user = await this.getUserById(id);
        return user.toSafeObject();
    }
}

module.exports = { User, UserRepository, UserService };