import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        try {
            const response = await axios.post('http://localhost:5000/register', 
            { username, password },
            { headers: { 'Content-Type': 'application/json' } });

            navigate('/');
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div className="App">
            <h1>Register</h1>
            <form onSubmit={handleSubmit}>
                <label>Username</label>
                <input type="text" value={username} onChange={e => setUsername(e.target.value)} />
                <label>Password</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
                <button type="submit">Register</button>
            </form>
            <a href="/">Back to Login</a>
        </div>
    );
};