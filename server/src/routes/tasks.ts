import express, { Request, Response } from 'express';
import pool from '../database';

const router = express.Router();

router.get('/', async (req: Request, res: Response) => {
    try {
        const { userID } = req.query;

        if (!userID) {
            return res.status(400).json({ message: 'Missing userID' });
        }

        const userResult = await pool.query('SELECT * FROM tasks WHERE user_id = $1', [userID]);

        res.json(userResult.rows);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

export default router;