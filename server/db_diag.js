const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');

dotenv.config({ path: './server/.env' });

async function testConnection() {
    let log = '';
    const addLog = (msg) => {
        log += `[${new Date().toISOString()}] ${msg}\n`;
        console.log(msg);
        fs.writeFileSync('db_diag.txt', log);
    };

    try {
        addLog('Diagnostic started');
        addLog('URI starts with: ' + process.env.MONGO_URI.substring(0, 20) + '...');

        mongoose.connection.on('connecting', () => addLog('Mongoose connecting...'));
        mongoose.connection.on('connected', () => addLog('Mongoose connected'));
        mongoose.connection.on('error', (err) => addLog('Mongoose error: ' + err.message));
        mongoose.connection.on('disconnected', () => addLog('Mongoose disconnected'));

        addLog('Calling mongoose.connect...');
        await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 30000, // 30 seconds
            connectTimeoutMS: 30000
        });

        addLog('Awaited mongoose.connect successful');
        await mongoose.connection.close();
        addLog('Diagnostic finished successfully');
        process.exit(0);
    } catch (err) {
        addLog('CATCH: Connection failed!');
        addLog('Error Name: ' + err.name);
        addLog('Error Message: ' + err.message);
        process.exit(1);
    }
}

testConnection();
