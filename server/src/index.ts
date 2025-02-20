import express from 'express';
import cors from 'cors';
import { Pool } from 'pg';

import tasksRouter from './routes/tasks';
import registerRouter from './routes/register';

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

app.use('/tasks', tasksRouter);
app.use('/register', registerRouter);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})