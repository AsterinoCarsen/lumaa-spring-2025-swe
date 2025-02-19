import express, { Request, Response } from 'express';
import pool from '../database';

const router = express.Router();

router.get('/', async (req: Request, res: Response) => {
    try {
        const { rows } = await pool.query('SELECT * FROM users');
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.post('/', async (req: Request, res: Response) => {
    const { title, description } = req.body;
    try {
        await pool.query('INSERT INTO tasks (title, description) VALUES ($1, $2)', [title, description]);
        res.json({ message: 'Task created' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.put('/:id', async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const { title, description } = req.body;
    try {
        await pool.query('UPDATE tasks SET title = $1, description = $2 WHERE id = $3', [title, description, id]);
        res.json({ message: 'Task updated' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


export default router;