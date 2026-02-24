const Appointment = require('../models/Appointment');

exports.createAppointment = async (req, res) => {
    const { department, doctorName, doctorId, patientName, date, timeSlot } = req.body;

    try {
        const newAppointment = new Appointment({
            department,
            doctorName,
            doctorId,
            patientName,
            patientId: req.user.id,
            date,
            timeSlot
        });

        const appointment = await newAppointment.save();
        res.json(appointment);
    } catch (err) {
        console.error('Create Appointment Error:', err.message);
        if (err.name === 'ValidationError') {
            return res.status(400).json({ msg: err.message });
        }
        res.status(500).json({ msg: 'Server error creating appointment' });
    }
};

exports.getAppointments = async (req, res) => {
    try {
        let appointments;
        if (req.user.role === 'doctor') {
            appointments = await Appointment.find({ doctorId: req.user.id });
        } else {
            appointments = await Appointment.find({ patientId: req.user.id });
        }
        res.json(appointments);
    } catch (err) {
        console.error('Get Appointments Error:', err.message);
        res.status(500).json({ msg: 'Server error fetching appointments' });
    }
};

exports.updateAppointmentStatus = async (req, res) => {
    const { status } = req.body;

    try {
        let appointment = await Appointment.findById(req.params.id);

        if (!appointment) return res.status(404).json({ msg: 'Appointment not found' });

        appointment.status = status;

        await appointment.save();

        res.json(appointment);
    } catch (err) {
        console.error('Update Appointment Error:', err.message);
        if (err.name === 'ValidationError') {
            return res.status(400).json({ msg: err.message });
        }
        res.status(500).json({ msg: 'Server error updating appointment' });
    }
};
