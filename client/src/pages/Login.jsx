import React, { useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const navigate = useNavigate();

    const { email, password } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        try {
            const res = await api.post('/auth/login', formData);
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('role', res.data.role);
            localStorage.setItem('name', res.data.name);
            navigate('/dashboard');
        } catch (err) {
            console.error('Login Error:', err.response?.data || err.message);
            alert(err.response?.data?.msg || 'Login failed. Please check your credentials and database connection.');
        }
    };

    return (
        <div className="auth-container">
            <div className="glass-card">
                <h1>Login</h1>
                <form onSubmit={onSubmit}>
                    <div className="input-group">
                        <input
                            className="input-field"
                            type="email"
                            placeholder="Email Address"
                            name="email"
                            value={email}
                            onChange={onChange}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <input
                            className="input-field"
                            type="password"
                            placeholder="Password"
                            name="password"
                            value={password}
                            onChange={onChange}
                            required
                        />
                    </div>
                    <button type="submit" className="btn-primary">Login</button>
                </form>
                <p style={{ marginTop: '1rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                    Don't have an account? <a href="/register">Register</a>
                </p>
            </div>
        </div>
    );
};

export default Login;
