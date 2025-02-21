import React, { useEffect } from "react";
import axios from "axios";

interface HomeProps {
    userID: number;
}

interface Task {
    title: string,
    description: string,
    completed: boolean
}

export const Home: React.FC<HomeProps> = ({ userID }) => {
    const [tasks, setTasks] = React.useState<Task[]>([]);

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/tasks?userID=${userID}`);
                setTasks(response.data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchTasks();
    }, [userID]);

    return (
        <div>
            <h1>Welcome</h1>
            <h2>Your tasks:</h2>
            {tasks.length > 0 ? (
                <table className="taskTable">
                    <thead className="taskTableHead">
                        <tr>
                            <th>Title</th>
                            <th>Description</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                    {tasks.map((task, index) => (
                        <tr key={index}>
                            <td>{task.title}</td>
                            <td>{task.description}</td>
                            <td><input type="checkbox" checked={task.completed}/></td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            ) : (
                <p>No tasks</p>
            )}
        </div>
    );
};