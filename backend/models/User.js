import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String},
    pincode: { type: Number},
    role: { type: String},
}, { timestamps: true });

export default mongoose.model('User', userSchema);