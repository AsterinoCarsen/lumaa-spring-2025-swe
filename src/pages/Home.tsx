import React, { use, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface Task {
    task_id: number,
    title: string,
    description: string,
    completed: boolean
}

export const Home = () => {
    const [tasks, setTasks] = React.useState<Task[]>([]);
    const [userID, setUserID] = React.useState<number | null>(null);
    const navigate = useNavigate();

    // Get the user ID from JWT local storage
    useEffect(() => {
        const storedUserID = localStorage.getItem('userID');

        if (storedUserID) {
            setUserID(parseInt(storedUserID, 10));
        } else {
            console.error('No user ID found');
        }

    }, []);

    // Update the list of tasks
    useEffect(() => {
        fetchTasks();
    }, [userID]);

    const fetchTasks = async () => {
        if (!userID) return;

        try {
            const response = await axios.get(`http://localhost:5000/tasks?userID=${userID}`);
            setTasks(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    const signOut = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userID');

        navigate('/');
    };

    const addTask = async (userID: number | null, title: string, description: string) => {
        if (!userID) return;

        try {
            await axios.post("http://localhost:5000/tasks", {
                userID,
                title,
                description,
            });

            await fetchTasks();
        } catch (error) {
            console.error(error);
        }
    };

    const updateTask = async(taskID: number, title: string, description: string, completed: boolean) => {
        try {
            await axios.put(`http://localhost:5000/tasks/${taskID}`, null, {
                params: {
                    title,
                    description,
                    completed
                }
            });

            await fetchTasks();
        } catch (error) {
            console.error(error);
        }
    }

    const deleteTask = async (taskID: number) => {
        try {
            await axios.delete(`http://localhost:5000/tasks/${taskID}`);
            await fetchTasks();
        } catch (error) {
            console.error(error);
        }
    }

    const handleInputChange = (taskID: number, field: string, value: string | boolean) => {
        setTasks((prevTasks: Task[]) =>
            prevTasks.map(task =>
                task.task_id === taskID
                    ? { ...task, [field]: value }
                    : task
            )
        );
    }

    const handleBlur = (taskID: number, task: Task) => {
        updateTask(taskID, task.title, task.description, task.completed);
    }

    const createNewTask = async () => {
        const newTask: Task = {
            task_id: -1,
            title: 'Insert title',
            description: 'Insert description',
            completed: false
        };

        addTask(userID, newTask.title, newTask.description);
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
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
                        <tr key={index} style={{ backgroundColor: task.completed ? "#a9a9a9" : "#d3d3d3" }}>
                            <td>
                                <input
                                    className="editField"
                                    type="text" 
                                    value={task.title}
                                    onChange={(e) => handleInputChange(task.task_id, 'title', e.target.value)} 
                                    onBlur={() => handleBlur(task.task_id, task)}
                                />
                            </td>
                            <td>
                                <input
                                    className="editField"
                                    type="text"
                                    value={task.description}
                                    onChange={(e) => handleInputChange(task.task_id, 'description', e.target.value)}
                                    onBlur={() => handleBlur(task.task_id, task)}
                                />
                            </td>
                            <td>
                                <span 
                                    onClick={async () => {
                                        const updateCompletedStatus = !task.completed;
                                        await updateTask(task.task_id, task.title, task.description, updateCompletedStatus);
                                        handleInputChange(task.task_id, 'completed', updateCompletedStatus);
                                    }}
                                    style={{ cursor: 'pointer' }}
                                >
                                    {task.completed ? "Completed" : "In Progress"}
                                </span>
                            </td>
                            <td>
                                <button onClick={async () => {
                                    await deleteTask(task.task_id);
                                }}>Delete</button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            ) : (
                <p>No tasks</p>
            )}
            <button onClick={createNewTask}>New</button>
            <button onClick={signOut}>Sign Out</button>
        </div>
    );
};