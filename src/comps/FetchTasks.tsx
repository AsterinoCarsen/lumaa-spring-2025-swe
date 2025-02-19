import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Task {
    id: number;
    title: string;
    description: string;
    completed: boolean;
}

const FetchTasks = () => {
    const [tasks, setTasks] = useState<Task[]>([]);

    useEffect(() => {
        axios.get('http://localhost:5000/tasks')
            .then(response => {
                setTasks(response.data);
            });
    }, []);

    return (
        <div>
            <h2>Tasks</h2>
            <ul>
                {tasks.map(task => (
                    <li key={task.id}>
                        {task.title}
                    </li>
                ))}
            </ul>
        </div>
    );
};