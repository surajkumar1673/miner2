import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        navigate('/login');
    };

    return (
        <nav style={{ padding: '10px', background: '#eee', display: 'flex', justifyContent: 'space-between' }}>
            <div>
                <Link to="/" style={{ marginRight: '10px', textDecoration: 'none', fontWeight: 'bold' }}>Medical App</Link>
            </div>
            <div>
                {token ? (
                    <>
                        <span style={{ marginRight: '10px' }}>Role: {role}</span>
                        <button onClick={handleLogout}>Logout</button>
                    </>
                ) : (
                    <>
                        <Link to="/login" style={{ marginRight: '10px' }}>Login</Link>
                        <Link to="/register">Register</Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
