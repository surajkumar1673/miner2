import React, { useEffect, useState } from 'react';
import api from '../api';
import Navbar from '../components/Navbar';

const Dashboard = () => {
    const [appointments, setAppointments] = useState([]);
    const [role, setRole] = useState('');
    const [formData, setFormData] = useState({
        department: '',
        doctorName: '',
        doctorId: '',
        patientName: '',
        date: '',
        timeSlot: ''
    });

    const categories = [
        { name: 'Cardiology', icon: '❤️' },
        { name: 'Neurology', icon: '🧠' },
        { name: 'Pediatrics', icon: '👶' },
        { name: 'Orthopedics', icon: '🦴' },
        { name: 'Dermatology', icon: '✨' },
        { name: 'General', icon: '🏥' }
    ];

    const [doctors, setDoctors] = useState([]);

    useEffect(() => {
        const userRole = localStorage.getItem('role');
        const userName = localStorage.getItem('name');
        setRole(userRole);
        if (userRole === 'patient') {
            setFormData(prev => ({ ...prev, patientName: userName }));
            fetchDoctors();
        }
        fetchAppointments(userRole);
    }, []);

    const fetchDoctors = async () => {
        try {
            const res = await api.get('/auth/doctors');
            setDoctors(res.data);
        } catch (err) {
            console.error('Fetch Doctors Error:', err.response?.data?.msg || err.message);
        }
    };

    const fetchAppointments = async (currentRole) => {
        try {
            const res = await api.get(`/appointments?role=${currentRole}`);
            setAppointments(res.data);
        } catch (err) {
            console.error('Fetch Appointments Error:', err.response?.data?.msg || err.message);
        }
    };

    const onSelectDept = (dept) => {
        setFormData({ ...formData, department: dept });
    };

    const onSelectDoctor = (doc) => {
        setFormData({
            ...formData,
            doctorId: doc._id,
            doctorName: doc.name
        });
    };

    const onChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const onBook = async e => {
        e.preventDefault();

        if (!formData.department) {
            alert('Please select a medical department first!');
            return;
        }

        if (!formData.doctorId) {
            alert('Please select a specialist doctor first!');
            return;
        }

        try {
            await api.post('/appointments', formData);
            alert('Appointment booked successfully!');
            // Reset selection after success if desired, or keep it. Let's reset the doctor at least.
            setFormData(prev => ({ ...prev, doctorId: '', doctorName: '', date: '', timeSlot: '' }));
            fetchAppointments(role);
        } catch (err) {
            console.error('Booking Error:', err.response?.data?.msg || err.message);
            alert(err.response?.data?.msg || 'Error booking appointment');
        }
    };

    const handleStatus = async (id, status) => {
        try {
            await api.put(`/appointments/${id}`, { status });
            fetchAppointments(role);
        } catch (err) {
            console.error('Status Update Error:', err.response?.data?.msg || err.message);
            alert(err.response?.data?.msg || 'Error updating status');
        }
    };

    return (
        <div>
            <Navbar />
            <div className="container">
                <header className="dashboard-header">
                    <h1>Dashboard</h1>
                    <span className="status-badge" style={{ fontSize: '1rem', background: 'rgba(79, 70, 229, 0.2)', color: '#818cf8' }}>
                        {role.toUpperCase()}
                    </span>
                </header>

                {role === 'patient' && (
                    <div className="glass-card" style={{ marginBottom: '2rem' }}>
                        <h2>Book Appointment</h2>
                        <form onSubmit={onBook}>
                            <label className="selection-label">Select Department</label>
                            <div className="selection-container">
                                {categories.map(dept => (
                                    <div
                                        key={dept.name}
                                        className={`selection-card dept-card ${formData.department === dept.name ? 'active' : ''}`}
                                        data-dept={dept.name}
                                        onClick={() => onSelectDept(dept.name)}
                                    >
                                        <span className="icon">{dept.icon}</span>
                                        <span className="name">{dept.name}</span>
                                    </div>
                                ))}
                            </div>

                            <label className="selection-label">Select Specialist</label>
                            <div className="selection-container">
                                {doctors.length > 0 ? (
                                    doctors.map(doc => (
                                        <div
                                            key={doc._id}
                                            className={`selection-card ${formData.doctorId === doc._id ? 'active' : ''}`}
                                            onClick={() => onSelectDoctor(doc)}
                                        >
                                            <span className="icon">👨‍⚕️</span>
                                            <span className="name">{doc.name}</span>
                                            <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Availability: Open</span>
                                        </div>
                                    ))
                                ) : (
                                    <p style={{ padding: '1rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Searching for doctors...</p>
                                )}
                            </div>

                            <div className="input-group">
                                <label className="selection-label">Appointment Date</label>
                                <input className="input-field" type="date" name="date" value={formData.date} onChange={onChange} required />
                            </div>

                            <div className="input-group">
                                <label className="selection-label">Preferred Time Slot</label>
                                <input className="input-field" type="text" placeholder="e.g. 10:00 AM" name="timeSlot" value={formData.timeSlot} onChange={onChange} required />
                            </div>

                            <button type="submit" className="btn-primary" style={{ marginTop: '1rem' }}>Book Appointment</button>
                        </form>
                    </div>
                )}

                <div className="glass-card">
                    <h2>Appointments</h2>
                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Patient</th>
                                    <th>Doctor</th>
                                    <th>Department</th>
                                    <th>Date/Time</th>
                                    <th>Status</th>
                                    {role === 'doctor' && <th>Action</th>}
                                </tr>
                            </thead>
                            <tbody>
                                {appointments.map(app => (
                                    <tr key={app._id}>
                                        <td>{app.patientName}</td>
                                        <td>{app.doctorName}</td>
                                        <td>{app.department}</td>
                                        <td>{app.date} at {app.timeSlot}</td>
                                        <td>
                                            <span className={`status-badge status-${app.status}`}>
                                                {app.status}
                                            </span>
                                        </td>
                                        {role === 'doctor' && (
                                            <td>
                                                {app.status === 'pending' && (
                                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                        <button
                                                            onClick={() => handleStatus(app._id, 'approved')}
                                                            className="btn-primary"
                                                            style={{ background: 'var(--secondary)', fontSize: '0.8rem', padding: '0.4rem 0.8rem' }}
                                                        >
                                                            Approve
                                                        </button>
                                                        <button
                                                            onClick={() => handleStatus(app._id, 'rejected')}
                                                            className="btn-secondary"
                                                            style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem', borderColor: '#ef4444', color: '#ef4444' }}
                                                        >
                                                            Reject
                                                        </button>
                                                    </div>
                                                )}
                                            </td>
                                        )}
                                    </tr>
                                ))}
                                {appointments.length === 0 && (
                                    <tr>
                                        <td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
                                            No appointments found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
