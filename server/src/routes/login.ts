import express, { Request, Response } from 'express';
import pool from '../database';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import exp from 'constants';
const { compare } = require('bcryptjs');

const router = express.Router();
dotenv.config({ path: './.env.local' });

const generateToken = (userID: number) => {
    return jwt.sign({ userID }, process.env.JWT_SECRET as string, {
        expiresIn: '1h'
    });
}

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

        if (!isPasswordValid) {
            return res.status(400).send('Invalid password');
        }

        const token = generateToken(user.id);
        res.send({ token });
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred');
    }
});

export default router;