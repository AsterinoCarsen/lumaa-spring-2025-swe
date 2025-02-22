import React, { useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

interface DecodedToken {
    userID: number;
}

export const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:5000/login', { username, password });

            if (response.data.token) {
                localStorage.setItem('token', response.data.token);

                const decodedToken = jwtDecode<DecodedToken>(response.data.token);
                const userID = decodedToken.userID;
                localStorage.setItem('userID', userID.toString());

                navigate('/home');
            }
        } catch (error) {
            console.error(error);
        }

    }
    return (
        <div>
            <h1>Login</h1>
            <form onSubmit={handleSubmit}>
                <label>Username</label>
                <input type="text" value={username} onChange={e => setUsername(e.target.value)} />
                <label>Password</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
                <button type="submit">Login</button>
            </form>
            <a href="/register">Register</a>
        </div>
    );
};