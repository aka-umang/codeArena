const express = require('express');
const app = express();

require('dotenv').config();

const main = require('./config/db');
const cookieParser = require('cookie-parser');
const authRouter = require('./routes/userauth');
const Redisclient = require('./config/redis');
const problemRouter=require('./routes/problemCreator')
const submitRouter = require('./routes/submit')
const aiRouter = require('./routes/aiChatting')
const videoRouter = require('./routes/videoCreator')
const cors = require('cors')
app.use(cors({
    origin:'http://localhost:5173',
    credentials:true
}))
// Middleware
app.use(express.json());
app.use(cookieParser());

// Test Route
// app.get('/', (req, res) => {
//     console.log('Request received');
//     res.status(200).send('Server Working');
// });

// Routes
app.use('/user', authRouter);
app.use('/problem',problemRouter)
app.use('/submission',submitRouter)
app.use('/ai', aiRouter);
app.use('/video', videoRouter);
const InitializeConnection = async () => {
    try {
        await Promise.all([main(), Redisclient.connect()]);
        console.log('Connected to DB and Redis');
        app.listen(process.env.PORT, () => {
            console.log(`Server running on ${process.env.PORT}`);
        });
}
    catch (err) {
        console.log('Error connecting to DB or Redis:', err);
    }
}
InitializeConnection ();

// Database Connection
// main()
//     .then(() => {
//         console.log('Connected to DB');
//     })
//     .catch((err) => {
//         console.log('Error connecting to DB:', err);
//     });

// // Start Server
// app.listen(process.env.PORT, () => {
//     console.log(`Server running on ${process.env.PORT}`);
// });