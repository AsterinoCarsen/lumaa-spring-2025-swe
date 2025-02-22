import express, { Request, Response } from 'express';
import pool from '../database';

const router = express.Router();

// Get all tasks, update the list.
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

// Create a new task
router.post('/', async (req: Request, res: Response) => {
    try {
        const { userID, title, description } = req.body;

        if (!userID || !title) {
            return res.status(400).json({ message: 'Missing userID or title' });
        }

        const userResult = await pool.query('INSERT INTO tasks (user_id, title, description, completed) VALUES ($1, $2, $3, $4) RETURNING *',
            [userID, title, description, false]
        );

        res.status(201).json(userResult.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Update a task
router.put('/:taskID', async (req: Request, res: Response) => {
    try {
        const { taskID } = req.params;
        const { title, description, completed } = req.query;

        if (!taskID) {
            return res.status(400).json({ message: 'Missing taskID' });
        }

        const userResult = await pool.query('UPDATE tasks SET title = $1, description = $2, completed = $3 WHERE task_id = $4 RETURNING *', 
            [title, description, completed, taskID]
        );

        if (userResult.rowCount === 0) {
            return res.status(404).json({ message: 'Task not found' });
        }

        res.json(userResult.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Delete a task
router.delete('/:taskID', async (req: Request, res: Response) => {
    try {
        const { taskID } = req.params;

        if (!taskID) {
            return res.status(400).json({ message: 'Missing taskID' });
        }

        const userResult = await pool.query('DELETE FROM tasks WHERE task_id = $1 RETURNING *', 
            [taskID]
        );

        res.json({ message: 'Task deleted' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

export default router;