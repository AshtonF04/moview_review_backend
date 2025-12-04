import mysql from 'mysql2/promise';

// Create a connection pool for better performance
const poolConfig = {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

// Only add SSL if explicitly required (e.g., for external databases like PlanetScale)
// Railway's internal MySQL connections don't need SSL
if (process.env.DB_SSL === 'true') {
    poolConfig.ssl = {
        rejectUnauthorized: false // Set to false for most cloud databases
    };
}

const pool = mysql.createPool(poolConfig);

// Log connection config (without password) for debugging
console.log('Database config:', {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    ssl: process.env.DB_SSL === 'true'
});

export default pool;

