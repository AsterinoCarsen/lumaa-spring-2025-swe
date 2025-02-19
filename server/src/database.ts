import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config({ path: './.env.local' });

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false,
    },
});

pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error("Error executing query", err);
    } else {
        console.log('Connected to the database', res.rows[0]);
    }
});

export default pool;