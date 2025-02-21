import express, { Request, Response } from 'express';
import pool from '../database';
const { compare } = require('bcryptjs');

const router = express.Router();

router.post('/', async (req: Request, res: Response) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).send('Missing username or password');
    }

    try {
        const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
        if (result.rows.length == 0) {
            return res.status(400).send('User does not exist.');
        }

        const user = result.rows[0];
        const hashedPassword = user.password_hash;

        const isPasswordValid = await compare(password, hashedPassword);

        if (isPasswordValid) {
            return res.send('Login successful');
        } else {
            return res.status(400).send('Invalid password');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred');
    }
});

export default router;