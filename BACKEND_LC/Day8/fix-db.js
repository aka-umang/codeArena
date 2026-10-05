require('dotenv').config();
const mongoose = require('mongoose');

async function fix() {
    try {
        await mongoose.connect(process.env.DB_CONNECTION_STRING);
        console.log('Connected');
        await mongoose.connection.collection('users').dropIndex('problemsSolved_1');
        console.log('Index dropped');
    } catch (e) {
        console.log('Index probably already dropped or another error: ', e.message);
    } finally {
        mongoose.disconnect();
    }
}
fix();
