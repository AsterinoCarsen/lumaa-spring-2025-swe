import express, { Request, Response } from 'express';
import pool from '../database';
const { hash } = require('bcryptjs');

const router = express.Router();

router.post('/', async (req: Request, res: Response) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).send('Missing username or password');
    }

    try {
        const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
        if (result.rows.length > 0) {
            return res.status(400).send('User already exists');
        }

        const hashedPassword = await hash(password, 10);
        await pool.query('INSERT INTO users (username, password_hash) VALUES ($1, $2)', [username, hashedPassword]);
        res.status(201).send('User registered');
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred');
    }
});

export default router;