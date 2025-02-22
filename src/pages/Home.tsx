import React, { use, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface Task {
    title: string,
    description: string,
    completed: boolean
}

export const Home = () => {
    const [tasks, setTasks] = React.useState<Task[]>([]);
    const [userID, setUserID] = React.useState<number | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const storedUserID = localStorage.getItem('userID');

        if (storedUserID) {
            setUserID(parseInt(storedUserID, 10));
        } else {
            console.error('No user ID found');
        }

    }, []);

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

    const signOut = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userID');

        navigate('/');
    };

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
            <button onClick={signOut}>Sign Out</button>
        </div>
    );
};