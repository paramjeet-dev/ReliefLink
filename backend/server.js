import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser'
import cors from 'cors';
import routes from './routes.js';

dotenv.config();

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



mongoose.connect(process.env.MONGO)
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.error(err));


app.use ("/",routes)
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
