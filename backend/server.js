import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser'
import cors from 'cors';
// import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js'
import requestRoutes from './routes/requestRoutes.js'
import disasterRoutes from './routes/disasterRoutes.js'
import userRoutes from './routes/userRoutes.js'
import expenseRoutes from './routes/expenseRoutes.js'

dotenv.config();
mongoose.connect(process.env.MONGO)
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.error(err));

const app = express();
const PORT = 5000;

app.use(express.json());
app.use(cookieParser())
app.use(cors({
    origin: "http://localhost:5173", 
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type"],
    credentials:true
}));


app.use('/auth', authRoutes);
app.use('/request', requestRoutes)
app.use('/disaster', disasterRoutes)
app.use('/user', userRoutes)
app.use('/expense',expenseRoutes)

// app.use ("/",routes)
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
