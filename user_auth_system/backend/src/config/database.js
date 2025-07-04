const { Pool } = require('pg');
require('dotenv').config();

//Database config
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

//Initialise database table
const initDB = async () => {
    try {
        await pool.query(`
            CREATE TABEL IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                email VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                name VARCHAR(255) NTO NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('Database initialized');
    }
    catch(error) {
        console.error('Database initialization error:', error);
        throw error;
    }
};

module.exports = { pool, initDB };