import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser'
import cors from 'cors';
// import routes from './routes.js';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js'
import requestRoutes from './routes/requestRoutes.js'
import disasterRoutes from './routes/disasterRoutes.js'
import userRoutes from './routes/userRoutes.js'

dotenv.config();
connectDB();

const app = express();
const PORT = 5000;

app.use(express.json());
app.use(cookieParser())
app.use(cors({
    origin: "http://localhost:5173", 
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type"],
    crediantials:true
}));


app.use('/auth', authRoutes);
app.use('/request', requestRoutes)
app.use('/disaster', disasterRoutes)
app.use('/user', userRoutes)

// app.use ("/",routes)
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
