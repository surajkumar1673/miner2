import React, { useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'patient' // Default role
    });
    const navigate = useNavigate();

    const { name, email, password, role } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        try {
            const res = await api.post('/auth/register', formData);
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('role', res.data.role);
            localStorage.setItem('name', res.data.name || formData.name);
            navigate('/dashboard');
        } catch (err) {
            console.error('Registration Error:', err.response?.data || err.message);
            alert(err.response?.data?.msg || 'Registration failed. Please check if the server is running and database is connected.');
        }
    };

    return (
        <div className="auth-container">
            <div className="glass-card">
                <h1>Register</h1>
                <form onSubmit={onSubmit}>
                    <div className="input-group">
                        <input
                            className="input-field"
                            type="text"
                            placeholder="Name"
                            name="name"
                            value={name}
                            onChange={onChange}
                            required
                        />
                    </div>
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
                    <div className="input-group">
                        <select
                            className="input-field"
                            name="role"
                            value={role}
                            onChange={onChange}
                        >
                            <option value="patient">Patient</option>
                            <option value="doctor">Doctor</option>
                        </select>
                    </div>

                    <button type="submit" className="btn-primary">Register</button>
                </form>
                <p style={{ marginTop: '1rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                    Already have an account? <a href="/login">Login</a>
                </p>
            </div>
        </div>
    );
};

export default Register;
