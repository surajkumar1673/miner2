const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const User = require('./models/User');

dotenv.config({ path: path.join(__dirname, '.env') });

const doctors = [
    { name: 'Dr. Sarah Mitchell', email: 'sarah@clinic.com', password: 'password123', role: 'doctor' },
    { name: 'Dr. Robert Wilson', email: 'robert@clinic.com', password: 'password123', role: 'doctor' },
    { name: 'Dr. Emily Chen', email: 'emily@clinic.com', password: 'password123', role: 'doctor' },
    { name: 'Dr. David Brooks', email: 'david@clinic.com', password: 'password123', role: 'doctor' },
    { name: 'Dr. Michael Ross', email: 'michael@clinic.com', password: 'password123', role: 'doctor' }
];

const seedDoctors = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB for seeding...');

        for (const docData of doctors) {
            const exists = await User.findOne({ email: docData.email });
            if (!exists) {
                const doc = new User(docData);
                await doc.save();
                console.log(`Added: ${docData.name}`);
            } else {
                console.log(`Skipped (exists): ${docData.name}`);
            }
        }

        console.log('Seeding complete!');
        process.exit(0);
    } catch (err) {
        console.error('Seeding error:', err.message);
        process.exit(1);
    }
};

seedDoctors();
